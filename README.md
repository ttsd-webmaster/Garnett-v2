<div align="center">
  <img alt="Garnett" src="https://www.fullstacklabs.co/img/developersRuby/Ruby@2x.png" height="125px" />
</div>

# Garnett

Web application for members of the Epsilon Delta Chapter of Theta Tau. You can check it out [here](https://garnett-app.herokuapp.com).

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the app](#running-the-app)
- [App Guide](#app-guide)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Database](#database)
  - [Scripts](#scripts)
    - [Data App](#data-app)
    - [Delibs App](#delibs-app)
    - [Pledge App](#pledge-app)
  - [Libraries we use](#libraries-we-use)
  - [Adding a new icon](#adding-a-new-icon)
- [Testing](#testing)
- [Deployment](#deployment)
- [Versioning](#versioning)

## Getting Started

We use React for the frontend and Node.js along with Express.js for the backend. We store all the data in a Firebase database and use Heroku for deployment.

**Note:** One of the libraries we use requires that we use Node.js v8.12.0.

Ask the webmasters for permissions to the following applications.

- Firebase
- Heroku
- Google Analytics

### Prerequisites

After gaining access to Heroku, create `.env` files for both the server and the client and copy the environement variables into them. You can find them under Settings as Config Vars. 

Copy all the environment variables prefixed by `REACT_APP_FIREBASE` into the client's `.env` file and everything else into the server's `.env` file.

### Installation

Run `npm install` in the root folder to download the dependencies for the server and in the client folder to download the dependencies for the client.

### Running the app

Run `npm run dev` in the root folder. This will concurrently start both the client and the server.

## App Guide

```bash
├── client
├── controllers
├── routes
├── scripts
└── server.js
```

- Everything server related is handled in `server.js` and the `controllers` and `routes` folders.
- Everything client related is inside the `client` folder.
- Any scripts we use to modify the database is handled in the `scripts` folder.

### Backend

```bash
├── controllers
│   ├── chalkboardsController.js
│   ├── complaintsController.js
│   ├── dataController.js
│   ├── delibsController.js
│   ├── indexController.js
│   ├── meritsController.js
│   └── notificationsController.js
├── routes
│   ├── chalkboards.js
│   ├── complaints.js
│   ├── data.js
│   ├── delibs.js
│   ├── index.js
│   ├── merits.js
│   └── notifications.js
└── server.js
```

### Frontend

```bash
├── api
├── App
├── components
├── containers
│   ├── Chalkboards
│   ├── Complaints
│   ├── DataApp
│   ├── DelibsApp
│   ├── Home
│   ├── Login
│   ├── PledgeApp
│   └── index.js
├── fontello
├── fonts
├── helpers
├── images
├── index.css
├── index.js
├── registerServiceWorker.js
└── service-worker.js
```

### Database

We use Firebase Authentication to handle all user authentication, Firebase Database to store all our data, and Firebase Storage to store images.

Each user has the following properties:

| Property | Description                                                                            | Type          |
|----------|----------------------------------------------------------------------------------------|---------------|
| Pledges  | a list of the remaining merits for each pledge (actives and alumni only) | object
| class     | the user's class                                      | string        |
| email   |  the user's email           | string        |
| firstName    | the user's first name            | string        |
| lastName       | the user's last name | string |
| major       | the user's major | string |
| mbti       | the user's personality type | string |
| phone       | the user's phone number | string |
| photoURL       | the user's firebase storage photo URL                         | string |
| registrationToken       | a unique notification token (Android only)                          | string |
| status       | the user's status: `active`, `pledge`, `alumni`, `pipm`                          | string |
| year       | the user's year                          | string |

Each merit has the following properties:

| Property | Description                                                                            | Type          |
|----------|----------------------------------------------------------------------------------------|---------------|
| activeName     | the active's full name                                      | string        |
| activePhoto   |  the active's photo URL           | string        |
| amount    | the merit's amount            | number        |
| createdBy       | the user who created the merit | string |
| date       | the merit's timestamp | string |
| description       | the merit's description | string |
| platform       | the platform that was used to merit | string |
| pledgeName       | the pledge's full name                         | string |
| pledgePhoto       | the pledge's photo URL                          | string |
| type       | the merit's type: `personal`, `standardized`, `interview`, `chalkboard`                          | string |

### Scripts

```bash
├── DataApp
├── DelibsApp
└── PledgeApp
    ├── After
    ├── Before
    ├── DataApp
    ├── During
    ├── EndOfYear
    ├── listUsers.js
    └── verifyUsers.js
```

We have multiple scripts that are used to alter data in our Firebase database.

#### Pledge App

The folder is split into scripts that should be used before, during, or after pledging.

### Libraries we use

- [material-ui v0](https://v0.material-ui.com/#/)
- [material-ui-fullscreen-dialog](https://github.com/TeamWertarbyte/material-ui-fullscreen-dialog)
- [react-Loadable](https://github.com/jamiebuilds/react-loadable#optsrender)
- [react-swipeable-views](https://github.com/oliviertassinari/react-swipeable-views)
- [react-portal](https://github.com/tajo/react-portal)
- [react-lazyload](https://github.com/jasonslyvia/react-lazyload)
- [react-infinite-scroller](https://github.com/CassetteRocks/react-infinite-scroller)
- [react-day-picker](https://react-day-picker.js.org/)
- [react-countup](https://github.com/glennreyes/react-countup)
- [react-swipeable-bottom-sheet](https://github.com/manufont/react-swipeable-bottom-sheet)
- [react-sweet-progress](https://github.com/abraztsov/react-sweet-progress#readme)
- [react-chartjs-2](https://github.com/jerairrest/react-chartjs-2)
- [pull-to-refresh](https://github.com/jiangfengming/pull-to-refresh)

### Adding a new icon

In order to reduce the app size, we use a [fontello](http://fontello.com) to bundle the exact icons we want, instead of downloading an icons library.

Follow these steps to add a new icon.

1. Import our current icons selection by clicking the wrench icon
2. Select the icons you want
3. Download and unzip the icons
4. Replace our `fontello` folder in `src` with the new icons folder, which should be named `fontello-xxxxx`, and rename it to `fontello`.
5. Save `App.js` and the new icon should show up!

## Testing

TODO

## Deployment

Every push to `master` will **automatically** deploy a new version of this app.

## Versioning

TODO
