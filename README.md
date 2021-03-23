<div align="center">
  <img  src="https://res.cloudinary.com/modus-labs/image/upload/w_240,f_auto/v1561025523/labs/modir.png" alt="Modite Directory" width="120" />

  <h1>Modite Directory</h1>



[![MIT Licensed](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/ModusCreateOrg/beep/blob/master/LICENSE)
[![Powered by Modus_Create](https://img.shields.io/badge/powered_by-Modus_Create-blue.svg?longCache=true&style=flat&logo=data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzIwIDMwMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNOTguODI0IDE0OS40OThjMCAxMi41Ny0yLjM1NiAyNC41ODItNi42MzcgMzUuNjM3LTQ5LjEtMjQuODEtODIuNzc1LTc1LjY5Mi04Mi43NzUtMTM0LjQ2IDAtMTcuNzgyIDMuMDkxLTM0LjgzOCA4Ljc0OS01MC42NzVhMTQ5LjUzNSAxNDkuNTM1IDAgMCAxIDQxLjEyNCAxMS4wNDYgMTA3Ljg3NyAxMDcuODc3IDAgMCAwLTcuNTIgMzkuNjI4YzAgMzYuODQyIDE4LjQyMyA2OS4zNiA0Ni41NDQgODguOTAzLjMyNiAzLjI2NS41MTUgNi41Ny41MTUgOS45MjF6TTY3LjgyIDE1LjAxOGM0OS4xIDI0LjgxMSA4Mi43NjggNzUuNzExIDgyLjc2OCAxMzQuNDggMCA4My4xNjgtNjcuNDIgMTUwLjU4OC0xNTAuNTg4IDE1MC41ODh2LTQyLjM1M2M1OS43NzggMCAxMDguMjM1LTQ4LjQ1OSAxMDguMjM1LTEwOC4yMzUgMC0zNi44NS0xOC40My02OS4zOC00Ni41NjItODguOTI3YTk5Ljk0OSA5OS45NDkgMCAwIDEtLjQ5Ny05Ljg5NyA5OC41MTIgOTguNTEyIDAgMCAxIDYuNjQ0LTM1LjY1NnptMTU1LjI5MiAxODIuNzE4YzE3LjczNyAzNS41NTggNTQuNDUgNTkuOTk3IDk2Ljg4OCA1OS45OTd2NDIuMzUzYy02MS45NTUgMC0xMTUuMTYyLTM3LjQyLTEzOC4yOC05MC44ODZhMTU4LjgxMSAxNTguODExIDAgMCAwIDQxLjM5Mi0xMS40NjR6bS0xMC4yNi02My41ODlhOTguMjMyIDk4LjIzMiAwIDAgMS00My40MjggMTQuODg5QzE2OS42NTQgNzIuMjI0IDIyNy4zOSA4Ljk1IDMwMS44NDUuMDAzYzQuNzAxIDEzLjE1MiA3LjU5MyAyNy4xNiA4LjQ1IDQxLjcxNC01MC4xMzMgNC40Ni05MC40MzMgNDMuMDgtOTcuNDQzIDkyLjQzem01NC4yNzgtNjguMTA1YzEyLjc5NC04LjEyNyAyNy41NjctMTMuNDA3IDQzLjQ1Mi0xNC45MTEtLjI0NyA4Mi45NTctNjcuNTY3IDE1MC4xMzItMTUwLjU4MiAxNTAuMTMyLTIuODQ2IDAtNS42NzMtLjA4OC04LjQ4LS4yNDNhMTU5LjM3OCAxNTkuMzc4IDAgMCAwIDguMTk4LTQyLjExOGMuMDk0IDAgLjE4Ny4wMDguMjgyLjAwOCA1NC41NTcgMCA5OS42NjUtNDAuMzczIDEwNy4xMy05Mi44Njh6IiBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KPC9zdmc+)](https://moduscreate.com?utm_source=labs&utm_medium=github&utm_campaign=modir)

</div>


[Modite Directory](https://dir.modus.app/?utm_source=labs&utm_medium=github&utm_campaign=modir) brings distributed teams at Modus closer together with clever data patterns. Uses 3rd party API services from Slack, Harvest, Google Suite, GitHub, HeyTaco, etc.


##### Modite Directory uses:
* Ionic 4
* React
* Cloudflare Workers
* Workers KV store
* Cloudflare Access

# Developing

## Use Docker

The benefit of Docker is that the specific versions of node_modules and Node JS required to build/run this 
can be encapsulated within a Docker container rather than having to have those versions of software installed
on your workstation.

*NOTES* 
1) Node version 12 seems to be required for node-sass to work.

### Shell scripts

The Dockerfile is used to build a Docker image that has no node_modules/ directory.  

There are 4 .sh (shell) scripts to make using Docker easy:

#### docker-build.sh
The docker-build.sh script uses the Dockerfile to create an image, then mounts a named volume over node_modules and does
the npm install into that volume.

You use npm/yarn to add modules to package.json on the workstation.  When you run the docker-build.sh script, your local
node_modules/ will be removed (since it's not needed by the container).

This script might be slow the first time you run it, but should be quite fast each successive time - as long as the
node_modules in the named container are preserved.


#### docker-debug.sh
The docker-debug.sh script uses an image built with docker-build.sh and runs it (not as a deamon) so you can see any
outoput from the program run via npm start within the container.  The working dir ($PWD) is mounted at /home/app where
the app is run.  This allows you to edit files on your workstation and the changes take effect as if the code were
running natively on the workstation.  The named volume is mounted on /home/app/node_modules so they are available.

You can change the port the server listens on by editing this file.

#### docker-prod-build.sh
This script does an npm build within the container but generates its output files in the build/ directory on the host so
you can use them accordingly.

#### docker-clean.sh
This script cleans up the Docker files for this project (removes them), including the named volume and the Docker image.

### Typical workflow:
1) ./docker-build.sh (to build the container and node_modules volume)
2) ./docker-debug.sh (to run the container so you can edit and debug)
3) ./docker-prod-build.sh (eventually, to make a production build/ set of files)

## Without Docker

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

# Modus Create

[Modus Create](https://moduscreate.com) is a digital product consultancy. We use a distributed team of the best talent in the world to offer a full suite of digital product design-build services; ranging from consumer facing apps, to digital migration, to agile development training, and business transformation.

<a href="https://moduscreate.com/?utm_source=labs&utm_medium=github&utm_campaign=modir"><img src="https://res.cloudinary.com/modus-labs/image/upload/h_80/v1533109874/modus/logo-long-black.svg" height="80" alt="Modus Create"/></a>
<br />

This project is part of [Modus Labs](https://labs.moduscreate.com/?utm_source=labs&utm_medium=github&utm_campaign=modir).

<a href="https://labs.moduscreate.com/?utm_source=labs&utm_medium=github&utm_campaign=modir"><img src="https://res.cloudinary.com/modus-labs/image/upload/h_80/v1531492623/labs/logo-black.svg" height="80" alt="Modus Labs"/></a>
