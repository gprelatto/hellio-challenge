# Helio Challenge by Gonzalo Prelatto
## Technologies Used

This project leverages the following technologies:

- **TypeScript**
- **Node.js + NestJS**
- **TypeORM**
- **Jest**
- **MongoDB**
- **Swagger**

---

## Getting Started

Follow these steps to set up and run the project:

### 1. Install Dependencies

Run the following command to install all required dependencies:

```bash
npm install
```

### 2. Build the Docker Image (Optional)

If you want to use Docker for MongoDB, build the Docker image:

```bash
docker build -t helio-challenge .
```

### 3. Run the Docker Container (Optional)

Start the MongoDB container using Docker:

```bash
docker run -p 27017:27017 helio-challenge
```

- Port `27017` is exposed for MongoDB.

> **Note**: Steps 2 and 3 are optional if you already have a MongoDB instance running. You can modify the configuration files to point to your existing MongoDB instance.

### 4. Start the Application

Run the following command to start the application in development mode:

```bash
npm run start:dev
```

---

## Configuration

- The application startup port can be configured in the environment files.
- Using config files (*.yml) per environment. You can create your own DEV/STAGE/PROD/TEST config file inside the config folder.
- Default access:
  - **API Base URL**: `http://localhost:3000`
  - **API Documentation (Swagger)**: `http://localhost:3000/swagger`

---

## API Endpoints

### Auth Workflow

The only publicly accessible endpoints are **Register** and **Login**:

- **Register**: `POST /v1/auth/register`
- **Login**: `POST /v1/auth/login`

#### Steps:

1. **Register a New User**  
   Use the `/v1/auth/register` endpoint to create a new user account.

2. **Login to Obtain an Auth Token**  
   Authenticate with the `/v1/auth/login` endpoint to receive a JWT token.

#### Role-Based Access Control (RBAC)

- The JWT token includes an array of companies the user has access to.
- Access validation is enforced using **Role Guards** at the controller level.

This ensures secure and role-specific access to the API resources.

### Company Management Endpoints

The following endpoints are available to facilitate testing and initial setup:

- **Create a Company**:  
   `POST /v1/companies/`  
   Automatically assigns the user who creates the company as the owner with full access.

- **List Companies**:  
   `GET /v1/companies/`  
   Retrieves a list of all companies.

- **Add a Project to a Company**:  
   `POST /v1/companies/:companyId/project`  
   Adds a new project to the specified company.

### Required Endpoints

These endpoints are essential for completing the challenge:

1. **Get Projects for a Company**:  
    `GET /v1/companies/:companyId/project`  
    Fetches all projects associated with a specific company.

2. **Update a Project**:  
    `PATCH /v1/companies/:companyId/project/:projectId`  
    Updates the details of a specific project within a company.

3. **Add Roles to a Company**:  
    `POST /v1/companies/:companyId/roles`  
    Assigns new roles to a company.

4. **Delete Roles from a Company**:  
    `DELETE /v1/companies/:companyId/roles`  
    Removes roles from a company.

### Unit Tests

Two tests included:
1. Login workflow
2. Fetch projects for a company

---

Feel free to explore the API using the Swagger documentation available at `http://localhost:3000/swagger`.