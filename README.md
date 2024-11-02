# Mini-Blog Backend

This project is a backend server for a mini-blog application built with Node.js, Express, MongoDB, Mongoose, and EJS for templating. The server manages authentication, user profiles, and CRUD operations for blog posts, with EJS templates for rendering server-side views. This README provides installation instructions, project details, and usage guidelines.
**Check out Working Website** - [On Render](#https://blog-website-udvo.onrender.com)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Technologies Used](#technologies-used)
- [Environment Variables](#environment-variables)

## Features

- User registration and login with JWT authentication.
- User profile management with support for profile pictures.
- Secure password hashing with bcrypt.
- CRUD operations for blog posts.
- EJS templates for dynamic server-rendered pages.
- Token-based authentication for protected routes.

## Installation

To install and set up the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/mini-blog-backend.git
   cd mini-blog-backend
2. **Install dependencies**:
   ```bash
   npm install
3. **Set up environment variables**: Create a .env file in the root directory with the necessary configuration (see Environment Variables section).
4. **Start the server**: 
   ```bash
   nodemon app
## Configuration
- *MongoDB* : This project uses MongoDB as the database. You can set up a MongoDB Atlas cluster or use a local MongoDB instance.
- *Environment Variables* : Define your environment variables in the .env file.
## Technologies Used

- **Node.js**: JavaScript runtime for building server-side applications.
- **Express.js**: A web framework for Node.js that simplifies routing and middleware management.
- **MongoDB & Mongoose**: MongoDB is a NoSQL database, and Mongoose is an Object Data Modeling (ODM) library that provides a schema-based solution for modeling application data.
- **EJS**: A templating language that allows you to generate HTML markup with plain JavaScript.
- **bcrypt**: A library to help you hash passwords for secure authentication.
- **jsonwebtoken**: A library to issue and verify JSON Web Tokens for authentication and authorization.
- **multer**: Middleware for handling `multipart/form-data`, which is primarily used for uploading files.
- **dotenv**: A module that loads environment variables from a `.env` file into `process.env`.

## Environment Variables

Create a `.env` file in the root directory to securely store sensitive information. Below is an example of the required environment variables:

```plaintext
DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/mydatabase?retryWrites=true&w=majority
PORT=3000
JWT_SECRET=<your-jwt-secret>
