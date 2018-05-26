This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Overview
This project is a boilerplate using the MERN stack to create a simple web app with an authentication layer.

<p align='center'>
  <img src='https://github.com/arjohnston/boilerplates/blob/master/mern-auth/public/example.png' width='600' alt='start up'>
</p>

## Installation

### Mern-auth Boilerplate
Clone the repository:
```sh
git clone https://github.com/arjohnston/boilerplates.git
```

Install the dependencies:
```sh
npm install
```

Setup the `/config/config.js` by copying the contents of `config.example.js` into a `config.js` file in the same file directory. `config.js` is automatically ignored by `.gitignore`

### MongoDB
This project uses [Mongo](https://www.mongodb.com/) as it's database.<br>
MacOS Installation instructions below. For other operating systems, visit [the MongoDB installation guide](https://docs.mongodb.com/manual/administration/install-community/).

Install via brew:
```sh
brew update
brew install mongodb
```

Create the required directory:
```sh
mkdir -p /data/db
```

Set the permissions:
> Note: it's recommended to set up a user and group over using root for security reasons

```sh
sudo chown -R `id -un` /data/db
```

Run MongoDB:
```sh
mongod
```

Run the program for the first time in another terminal window:
```sh
npm run build && npm start
```


## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run start`

Runs the app in production mode.<br>
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

The app needs to be re-built if you make edits<br>

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](#running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
