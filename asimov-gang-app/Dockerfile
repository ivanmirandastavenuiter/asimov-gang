FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env
WORKDIR /app

COPY *.sln .
COPY ["asimov-gang-api/*.csproj", "./asimov-gang-api/"]
COPY ["asimov-gang-unit-tests/*.csproj", "./asimov-gang-unit-tests/"]

RUN dotnet restore

COPY ["asimov-gang-api/", "./asimov-gang-api/"]
COPY ["asimov-gang-unit-tests/", "./asimov-gang-unit-tests/"]

WORKDIR /app
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:6.0

ENV ASPNETCORE_URLS=http://*:45000
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "asimov-gang-api.dll"]