# NestJS Authentication with JWT, PostgreSQL, Prisma, and Docker

This repository demonstrates how to set up authentication in a NestJS application using JWT (JSON Web Tokens). The project also uses PostgreSQL as the database and Prisma as the ORM. Docker is used to containerize the PostgreSQL and Redis services.

## Features

- **Authentication**: Uses JWT for securing endpoints.
- **Database**: PostgreSQL managed with Prisma ORM.
- **Caching**: Redis for session management (optional, can be integrated as needed).
- **Containerization**: Docker for easy setup and deployment of PostgreSQL and Redis.

## Prerequisites

Before running this project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v20 or later)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/bundocba/nestjs-jwt-postgresql-prisma
cd your-repo-name
```
### Run docker for create postgresql and redis
```bash
bin\up
bin\start

bin\stop #for stop
```
###Prisma Setup
```bash
npx prisma migrate dev
npx prisma generate

```
###Create user = seed
```bash
npm run prisma:seed 
```
###Apis example
```
localhost:3007/v1/user/auth/login
localhost:3007/v1/user/auth/signup
localhost:3007/v1/user/auth/logout
localhost:3007/v1/user/info

```

###Authentication Lock Defaults
```
AUTH_LOCK_TIME = 3 minutes
AUTH_RETRY_ATTEMPTS = 5
```

###Install Dependencies
```
npm install
npm run start:dev
```
The application will be running at http://localhost:port.

###Project Structure
```ruby
src/
├── auth/           # Authentication module
│   ├── controllers/
│   ├── guards/
│   ├── service/
│   ├── dto/
│   └── auth.module.ts
├── common/         # Common utilities and guards
├── prisma/         # Prisma service and setup
├── main.ts         # Entry point
├── app.module.ts   # Root module
└── ...             # Other modules and controllers

```

