# Backend One Bangkok

## Description

This project is a backend application for One Bangkok,

1. built using Node.js with TypeScript.
2. It follows a monorepo structure and utilizes yarn workspaces for managing dependencies.
3. The project incorporates OpenAPI specifications for routing registration, request, and response control,
4. Prisma for database management.

## Backend Structure

The backend follows a monorepo structure, and it includes shared services that can be utilized across different microservices.

### 1. ob-common-lib

The `ob-common-lib` service contains middlewares, utilities, and context that can be shared with other services. Currently, it includes the following:

- **Logging Middleware and Utility**: This middleware automatically logs incoming requests and outgoing responses, including a traceId. It is already set up in the `ob-template`.
- **Response Middleware**: This middleware transforms object attributes from camel case to snake case. This is in line with our team convention of using snake case in requests and responses, while maintaining camel case in the code.
- **DateTime Utility**: This utility provides functions for formatting and manipulating dates using `dayjs`.

### Note

After updating this service, please follow these steps:

1. Run the following command to update the source code to JavaScript files:

```
    tsc -d
```

2. Reinstall the packages in the root (backend) directory to update the `node_modules`. Use the following command:

```
    npm install
```

**Note:**
One thing that may be missing after reinstalling the packages is the Prisma Client. If you reinstall the packages, please run the setup command again to ensure the Prisma Client is properly set up:

```
    ./scripts/setup.sh <Microservice Name>
```

Alternatively, you can use the following command, which includes the necessary steps:

```
    yarn start <Microservice Name>
```

For more details please refer to the "How to Start the Microservice" section.

### 2. ob-template

The `ob-template` is a project template that helps in creating a new microservice. It includes pre-configured middleware and provides an easy command to set up a new microservice. You can create a new microservice using the following command:

```
    yarn workspace ob-template create:project <Microservice Name>
```

This command will generate a new microservice with snipped files and code from the template. It will also update all the constants and names to match your project name.

```
    yarn workspace <Microservice Name> dev
```

This command starts the microservice in development mode.

```
    curl --location 'http://localhost:3000/health'
```

This command allows you to test the microservice by checking its health endpoint.

## Microservice Structure

- `db`: Contains the database schema and data migration files.
- `src`: Contains the source code of the project.
  - `src/api`: Contains the API specifications defined using OpenAPI 3.0.
  - `src/controllers`: Contains the controllers responsible for handling API requests, including validation and calling the appropriate service.
  - `src/middlewares`: Contains microservice middlewares, such as error middlewares.
  - `src/repositories`: Contains SQL statements implemented using Prisma ORM.
  - `src/services`: Contains the business logic layer, which can call other services and repositories.
  - `src/utils`: Contains utility functions.
- `test`: Contains all unit tests.

## How to Start the Microservice

1. Obtain or request the `.env` file from the team.
2. Run the following command to start the microservice:

```
    yarn start <Microservice name>
```

**Note:**

This command will execute the start script, which performs the following actions:

1. Installs dependencies for ob-common-lib.
2. Compiles ob-common-lib.
3. Deletes the node_modules directory.
4. Installs dependencies, including setting up the Prisma client.
5. Performs database migration.
6. Starts the services.

**Note2:**
An alternative way to start the service without installing dependencies is by using the following command:

```
    yarn workspaces <Microservice Name> dev
```

This command will directly start the service without the need to install dependencies separately.

## How to Create a New Microservice

We provide a microservice template that is already set up to help you start a new service. Follow these steps to create a new microservice:

1. Create the service using the template:

```
   yarn workspace ob-template create:project <Microservice name>
```

2. Open root package.json and add the name of the new service to the array, like this

```
    "workspace": [
    "ob-iam",
    "ob-template",
    "ob-document",
    "<Service Name>"
  ]
```

3. Set up and run the project:

```
    yarn start <Microservice name>
```

Note: The template includes an implemented endpoint that you can test. Use the following command to test the endpoint:

```
    curl --location 'http://localhost:3000/health'
```

The response will be:

```
{
    "data": {
        "health": true
    }
}
```

## How to Manage Database (Prisma ORM)

1. Install PostgreSQL on your local machine.

2. Request and edit the `.env` file to configure the database connection.

3. Set up the project by running the following command:

```
   ./scripts/setup.sh <Microservice name>
```

This command sets up the project and creates the Prisma client.

4. Update the schema located at <Microservice Name>/db/schema.prisma according to your database requirements.

5. Check the syntax of the Prisma schema by running the following command:

```
    yarn workspace <Microservice Name> prisma:migrate:format
```

This command checks and updates the formatting of the schema.prisma file.

6. Generate a migration file automatically by running the following command:

```
    yarn workspace <Microservice Name> prisma:migrate:generate <Migration Name>
```

7. Deploy the migration by running the following command:

```
    yarn workspace <Microservice Name> prisma:migrate:deploy <Migration Name>
```

## Things to Do Before Committing and Pushing Source Code

1. Create unit tests for your code.

2. Run the unit tests using the following command:

```
   yarn workspace <Microservice Name> test
```

3. Ensure that the code coverage is above 80%.

4. Check and update the code formatting using the following command:

```
yarn workspace <Microservice Name> format
```

5. Run the linter to check for code quality and adherence to coding standards using the following command:

```
yarn workspace <Microservice Name> lint
```

