FROM node:18.10.0-alpine3.16 as node

WORKDIR /usr/src/asimov-gang

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2
FROM nginx

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html/* 

COPY --from=node /usr/src/asimov-gang/dist/asimov-gang /usr/share/nginx/html

ENV PORT=${PORT:-4200}

CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'