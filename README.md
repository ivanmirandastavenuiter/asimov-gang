<h2 align="center">
  <br>
  <img src="https://github.com/ivanmirandastavenuiter/asimov-gang/blob/main/asimov-gang/src/assets/ufo.jpg" alt="UFO" width="400">
  <br>
  <br>
  Asimov Gang
  <br>
  <br>
  <img alt="owner" src="https://img.shields.io/badge/version-1.0-green" />
  <br>
  <br>
  
</h2>

### Introduction
---
` [ 📰 ] `

<p>The Asimov Gang project simply shows the progressions of the path that robots may follow with a set of given coordinates in a given grid or matrix.</p>

At the top of the screen, you will find a configuration interface that will let you setup the options. In order, it will contain:

- Number of robots
- Coordinates for axis x and y
- Coordinates, orientation and instructions for each robot

After pressing Go, then the robots will execute sequentially. 

An identifier for each robot will be shown on each execution. At the end, on the bottom, you should be able to see a summary of statistics. 

### Structure
---
` [ 👷 ] `

Building a CLI was easy but boring, so structure has been thought a bit far beyond.

We have:

- Front
- Rest API service at back
- Tests
- Docker

The logic that handles input data and creation for grid is on the front. 

**Most important feature for front**: robots are separately launched through the usage of intervals and timeouts.

- **Intervals**: an interval is set and removed for each robot, executing the steps
- **Timeouts**: at the bootstrap, the proper initialization time is calculated for each robot, with a margin of 2 and a half seconds, which gives a friendly pause among executions. Then, each robot will trigger accordingly.

But each movement is calculated with interactions with the backend, balancing thus the computation between front and back.

You can inspect this on the network tab.

### Assumptions
---
` [ 👇 ] `

Application is based on a few **assumptions** to be taken in account.

- Number of robots won't exceed 10
- Coordinates x and y won't exceed 10
- Coordinates for robot won't exceed 10 and orientation and instructions need to be valid

### Validations
---
` [ 👽 ] `

Asimov gang **won't accept all input!** It's delicate, so treat it **softly!**

You can get errors if:

- Orientation is not valid. Valid values are **N, E, S, W**
- Instructions are not valid. Valid values are **F, L, R**
- Coordinates must be numbers

Errors will be shown and execution won't continue

You have a button on the top to reset all forms. Also refresh the page if got stuck.

### Run it 
---
` [ 🏃 ] `

You can run both applications with the classic commands.

- For front: `npm run start`
- For dotnet: `dotnet run *.csproj`

**But** application has been **containerized with docker**. You will find a dockerfile for each part, front and back, in their respective levels. 

With the docker-compose file, configuration is set to build and lift up both projects. So executing a compose up you'll get the application working. 

You can do it in 2 ways: 

- Command: `docker compose  -f "docker-compose.yml" up -d --build asimov_gang_api asimov_gang_front <`

- VS Code comes with a nice docker native extension. Right click on docker compose file and select compose up.

**And you'll get it**

Access on http://localhost:4200

### Tests
---
` [ 🏭 ] `

A set of tests have been included for logic at the server. Run it with Visual Studio.

### License
---
` [ ❗ ] `

MKNA Devs ©

