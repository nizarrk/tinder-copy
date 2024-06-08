# Tinder Copy Backend

A backend service for a Tinder-like application, allowing users to swipe through profiles, purchase premium packages, and enjoy premium features like unlimited swipes and verified labels.

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Testing](#testing)
- [API Endpoints](#api-endpoints)

## Project Description 

This project provides a backend service for a dating application inspired by Tinder. Users can view, like, or pass on other users' profiles. The service also supports premium packages, which users can purchase to unlock features such as unlimited swipes and verified labels.

## Features

- User Authentication
- Profile Swiping
- Premium Package Purchase
- Unlimited Swipes for Premium Users
- Verified Label for Premium Users

## Technologies Used

- Node.js
- Express.js
- Sequelize (ORM)
- MariaDB/MySQL
- TypeScript
- Moment.js
- JWT for authentication
- Postman/Newman for API testing

## Project Structure
```
tinder-copy-backend/
│
├── src/
│ ├── configs/
│ │ ├── messages.json
│ │ ├── sequelize.ts
│ ├── controllers/
│ │ ├── authController.ts
│ │ ├── swipeController.ts
│ │ ├── premiumController.ts
│ ├── models/
│ │ ├── user.ts
│ │ ├── premiumPackage.ts
│ │ ├── premiumFeature.ts
│ │ ├── userSwipe.ts
│ │ ├── userPremiumPackage.ts
│ ├── routes/
│ │ ├── authRoutes.ts
│ │ ├── swipeRoutes.ts
│ │ ├── premiumRoutes.ts
│ ├── tools/
│ │ └── response.ts
│ ├── middlewares/
│ │ └── authMiddleware.ts
│ └── app.ts
│
├── logs/
|
├── tests/
│ └── postman/
│ └── collection.json
│
├── env/
│ └── .env.example
|
├── package.json
├── tsconfig.json
└── README.md
```


## Installation

### Prerequisites

- Node.js
- MariaDB/MySQL
- Git

### Steps

1. Clone the repository:

```
git clone https://github.com/nizarrk/tinder-copy-api.git
```

2. Navigate to the project directory:
```
cd tinder-copy-api

```
3. Install dependencies:
```
npm install
```
4. Set up the environment variables:
##### Create a .env.dev file in the ./env directory of the project based on ./env/.env.example file and add the following variables:
```
MYSQL_TINDER_HOST=your_database_host
MYSQL_TINDER_PORT=your_database_port
MYSQL_TINDER_NAME=tinder_copy
MYSQL_TINDER_USER=your_database_user
MYSQL_TINDER_PASS=your_database_password

```
##### Replace your_database_host, your_database_user and your_database_password with the appropriate values for your database configuration.
5. Run the database migrations and seeders:
```
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

6. Start the service:
##### Development mode:
```
npm run dev
```
##### Production mode:
```
npm run build
npm start
```

##### The server will start and listen for incoming requests on http://localhost:4091 by default.


## Testing
##### To run the tests, you need to have newman installed globally. If you don't have it installed, you can install it using npm:
```
npm install -g newman

```

## API Endpoints
##### Authentication:
```
POST /api/auth/register - Register a new user
POST /api/auth/login - Login and obtain a token
```
##### Premium Packages:
```
POST /api/premium/purchase - Purchase a premium package
```
##### Swiping:
```
GET /api/users/swipe - Get list of users to swipe on
POST /api/users/swipe - Swipe on a user
```
