
# Node-S3 Service

This project aims to create a Node.js/Express application that mimics the basic functionalities of AWS S3 bucket without using AWS S3 service.

# Features

* Get Object: Retrieve the uploaded file by providing the ID or name which is unique to the uploaded file.
* Put Object: Upload a file, save the file on disk, and store the URL in the database for future retrieval.
* List Objects: List all the files inside a specific bucket.
* List Buckets: List all the buckets created for the user.

# Installation

## Prerequisites

* Node.js installed on your machine. Preferred version v20.11.1

## Setup

1. Clone the repository:

```bash
  git clone https://github.com/abhinlr/Node-S3.git
```

2. Navigate to the project directory:

```bash
  cd NodeS3
```

3. Install dependencies:
    
```bash
  npm install
```

## Running the Application

To start the server, run:

```bash
  npm start
```

# Routes

## Authentication

* POST /auth/signUp: To create a user
* POST /auth/login: User login
* POST /auth/logout: To logout user

## Bucket

* POST /buckets/create : To create a bucket
* GET /buckets/getAll: Get all buckets
* PUT /buckets/update/{bucketId} : Update bucket
* DELETE /buckets/delete/{bucketId} : To delete a bucket

## Object

* POST /objects/upload : Upload object
* GET /objects/getAllObjects/{bucketId} : Get all objects
* GET /objects/get/{objectId} : Get object
* DELETE /objects/delete/{objectId} : Delete object
* PUT /objects/update/{objectId} : Update object
# Technologies Used

* Node.js
* Express.js
* MongoDB (For storing file metadata)
* Multer (For handling file uploads)
* Swagger UI Express (For API documentation)
* Swagger Js Doc (For API documentation)
* PassportJs (For Authentication)
## Authors

- [@abhinlr](https://www.github.com/abhinlr)

