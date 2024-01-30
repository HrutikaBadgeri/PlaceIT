# PlaceIT - A college placement backend server 
This backend server, developed using Node.js, Express.js, and MongoDB, aims to optimize the placement process within a college. Through its REST API, it allows students to submit job applications directly via the portal. Moreover, the placement officer can review the applications and select the most suitable candidates to forward to the HR department of the company. This seamless process enhances the efficiency of the placement procedure, promoting transparency, and ensuring timely communication between all parties involved.

## Getting Started
To get started with this server, follow these steps:

1. Install Node.js on your computer.
2. Clone this repository to your computer.
3. Install the dependencies using the following command:

```
npm install
```
4. Rename the example.env file to .env and fill in the required values.
5. Start the server using the following command:

```
npm start
```
6. The server should now be running on http://localhost:3000.

## API Endpoints
List of available routes:

**Student routes**:\
`POST api/v1/student/register` - Signup\
`POST api/v1/student/login` - Signin\
`GET api/v1/student/logout` - Logout\
`GET api/v1/student/getStudentToken`- Gets the student token\
`PATCH api/v1/student/updateDetails`  - Updates the student details\
`POST api/v1/student/forgotPassword` - Reset the password\
`PUT api/v1/student/updatePassword` - Update the password

**Company routes**:\
`GET api/v1/company/getAllCompanies` - Shows all the companies\
`POST api/v1/company/getOneCompany` - Shows a single company\
`POST api/v1/company/addCompany` - Company Signup\
`POST api/v1/company/login` - Company Signin\
`GET api/v1/company/logout` - Logout\
`GET api/v1/company/getCompanyToken` - Gets the company token\
`PATCH api/v1/company/updateDetails` - Updates the company details\
`PUT api/v1/company/updatePassword` - Update the password\
`POST api/v1/company/forgotPassword` - Reset the password

**TPO routes**:\
`POST api/v1/tpo/login` - Signin\
`GET api/v1/tpo/logout` - Logout\
`POST api/v1/tpo/forgotPassword` - Reset the password\
`PUT api/v1/tpo/updatePassword` - Update the password

**Application routes**:\
`POST api/v1/application/createApplications`- Creats application\
`GET api/v1/application/getAllApplications`  - Shows all application\
`PATCH api/v1/application/tpoStatus` - TPO changes the application status\
`PATCH api/v1/application/companyStatus` - Company HR changes the application status\
`GET api/v1/application/generateCSV`- Generates a csv of all applications

**Announcement routes**:\
`POST api/v1/announcement/createAnnouncement`- Creates announcement\
`POST api/v1/announcement/getAnnouncements`  - Shows all announcements\
`PATCH api/v1/announcement/updateAnnouncement` - Update announcement\
`DELETE api/v1/announcement/deleteAnnouncement` - Delete announcement

## Environment Variables
The following environment variables are required:

- MONGO_URI: The URI for the MongoDB instance.
- PORT: Express server starts on PORT number.
- JWT_SECRET_KEY: The secret key for JSON Web Tokens.
- JWT_EXPIRE: Number of days after which JWT expires.
- JWT_COOKIE_EXPIRE: Number of days after which JWT Cookie expires.
- FROM_EMAIL: Email from which reset password url is sent.
- SENDGRID_API_KEY: API key to access SENDGRID email system.


## Contributing
If you would like to contribute to this project, feel free to fork the repository and submit a pull request. Please ensure that any changes made adhere to the project's coding standards and are thoroughly tested.

