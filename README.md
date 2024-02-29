# ASSIGNMENT 4

This web application is built using Node.js with Express.js framework, MongoDB for database storage, and various middleware and services to manage authentication, data retrieval, and user management.

## Prerequisites

Node.js installed on your machine

MongoDB Atlas account or a local MongoDB server set up

Basic understanding of Node.js, Express.js, and MongoDB

## Installation
Install dependencies using npm:
npm install
npm install bcryptjs
npm install axios

Access the application through your web browser at http://localhost:3000.

## Configuration
Ensure MongoDB Atlas URI is correctly set up in the mongoose.connect() function call within app.js file.

Set up your session secret key in the session middleware initialization.

Adjust any other configurations as per your requirements.

## Features
User Authentication: Users can register and log in to access the application functionalities.

Session Management: Utilizes express-session middleware for managing user sessions.

Admin Panel: Admins have access to a special panel to manage users and items.

CRUD Operations: Create, read, update, and delete operations for historical events, figures, and items.

Error Handling: Comprehensive error handling for various scenarios.

## Routes
/: Main page, displays historical events.

/login: Log in page.

/register: User registration page.

/home: Home page displaying historical events.

/hisEvents: Endpoint for retrieving historical events.

/figures: Endpoint for retrieving historical figures.

/logout: Log out endpoint.

/admin: Admin panel.

/add-item: Endpoint for adding items.

/items: Endpoint for retrieving items.

/items-add-page: Page for adding items.

/items-for-admin: Endpoint for retrieving items in admin panel.

/delete-item/:id: Endpoint for deleting items.

ADMIN 
login :    111
password:  111

##
[Deploy link](https://history-nb8i.onrender.com/)
