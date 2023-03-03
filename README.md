# Ground Station
## About
This repository contains code for the ground station that
will be used to view live telemetry from and control the
rocket.

The UI frontend is written using the [React](https://reactjs.org/)
framework. All the UI code lives in the `telemetry` directory,
which was created using [create-react-app](https://create-react-app.dev/).
The app itself uses [Electron](https://www.electronjs.org/) as a
framework for displaying the UI. All the code that runs on the
backend, including processing data from the rocket, lives in the
`electron` directory.

## Setup
Here is a guide to get started with running the dashboard.
First, make sure you have NodeJS installed. If you don't,
read [these](https://nodejs.org/en/download/) instructions
to install it. Once node is installed, clone this repository:
`git clone https://github.com/Space-Enterprise-at-Berkeley/ground.git`


Then, `cd` into this directory and run `npm i`. If running on a Mac M1, run `arch -x86_64 npm i` instead.
This will install all the dependencies required by this project that are defined in
the `package.json` file. Next, `cd` into the `telemetry` directory
and run `npm i`. The `telemetry` directory contains all the code for the web based UI. If running on a Mac M1, run `export NODE_OPTIONS=--openssl-legacy-provider`. This will need to be run every time a new Terminal session is begun. ~~The `remote` directory contains all the code for the web page
that can be loaded on your phone to view pressure values
remotely over wifi.~~

> The remote directory has been removed.

Now that you have all the dependencies installed, `cd` back
to the top directory. Then, run `npx electron-rebuild`. This
command rebuilds some of the native libraries for the specific
platform you are running. That's all that is required to setup
for development.

## Running
NOTE: Running the ground station for the first time will create
a new directory in your home directory called `GroundStation`,
where it will store data files.

To start the ground station, first `cd` from the top level, project `ground` directory into the `telemetry` directory
and run `npm run start`. This will start the "backend" of the Dashboard. Next open a **new** terminal window (the previous one must stay open for the dashboard to work) and make sure you are in the top level `ground` directory. Run ~~`npm run start [config file]` or~~ `npm run start [config file] [...window IDs]` to open either all the windows from a config or a specified list. 

~~If you would like to run the remote viewing web page, open a new
terminal window and `cd` into the `remote` directory. Then run
`npm run start`.~~

## Receiving Telemetry & Sending Commands. 
The dashboard receives packets from all boards over ethernet - meaning that in order to receive telemetry you must have be connected directly to a board with an ethernet cable or connected to a network switch that has one or more boards connected. 
You must also have your computer network settings configured correctly to receive packets - your computer needs to appear on the network with a static ip of either `10.0.0.169` or `10.0.0.170`. As long as your computer's static ip has been configured appropriately, once any board is on the network and powered up, packets will start to be received and displayed (and the corresponding datarate indicator on the top bar will turn green)

## Storing Data. 
The dashboard is capable of pushing data to a server running an influx instance, to allow data to be stored and accessed at a later time. Data can be pushed to the remote influx server (`influx.andycate.com`) or can be pushed to an influx instance running locally on your computer or on any server on the local network. Which influx instance and which specific database can be configured via the influx settings button in the top right corner of the dashboard. 


## Packaging the app
There is a way to package the app into a nice neat executable that
is standalone, but I'm too lazy to write the instructions to do it
right now. I will do it at some point, when that feature actually
becomes useful/relevant.
