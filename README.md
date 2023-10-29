# Taskforce: A Hierarchical Todo List App

[The repository can be found here](https://github.com/Nathnaelc/TaskForce):
I suggest cloning the repository to interact with it than using the folders in the repo.

# [![Click here to check the Deployed app on Render](https://img.shields.io/badge/Click%20here%20to%20check%20the%20Deployed%20app%20on-Render-blue)](https://taskforceui.onrender.com/)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Introduction

Taskforce is an intuitive hierarchical todo list application designed to help users manage tasks efficiently. The application allows for multiple users, each confined to their own task space, according to the MVP requirements for the CS162 assignment. With Taskforce, users can create tasks, nest subtasks to any level, mark tasks as complete, and move tasks between different lists. This aligns with the #cs162_webstandards learning outcome by adhering to web standards and solving a real-world problem effectively. The app also allows a user friendly interface with a light and dark theme.

## Features

- User Registration and Login
- Create Lists
- Add Tasks and Nested Subtasks
- Mark Tasks as Complete
- Delete Tasks and Subtasks
- Move Tasks to Different Lists

See [this loom video](https://www.loom.com/share/69396f4edf1046fe9e6812158bf7f99f?sid=61ee8135-3fbf-429d-b2df-72582156539f) for a walkthrough of these features.

## Technologies Used

The application is built on the PERN stack, comprising PostgreSQL, Express, React, and Node.js. The choice of PERN stack is aligned with web standards, offering robustness, speed, and a rich user interface. This approach aligns well with the #cs162_webstandards learning outcome.

- PostgreSQL: For durable data storage.
- Express: For handling server-side logic.
- React: For building a dynamic UI.
- Node.js: For executing server-side JavaScript code.
- Tailwind CSS: For styling the app beautifully and in different themes

## Prerequisites

- PostgreSQL v16
- Node.js

## Installation and Setup

### Backend (Located in the ToDo_API folder)

1. Clone the repository.
   `git clone`
2. Navigate to the `ToDo_API` folder using `cd ToDO_API` command.
3. Install the necessary npm packages:
   ```bash
   npm install
   ```
4. Set up the .env file using `touch .env` and put the JWT_SECRET_KEY = string value such as d6f45a0ger7esdvwfwe3sjhd346wehkjsba98765egr
5. Create a new database server on Postgres called `TodoApp` and create a database named `todo_app` then run the `create_tables.sql` in Schemas folder against the database.
6. Start the server. Make sure it's running on port 3001:
   ```bash
   npm start
   ```

### Frontend (Located in the ToDo_UI folder)

1. Navigate to the `ToDo_UI` folder using `cd ToDO_UI` command.
2. Install the necessary npm packages:
   ```bash
   npm install
   ```
3. Set up the .env file using `touch .env` and put the VITE_BASE_URL = http://localhost:3001
4. Start the application. This will run the app in development mode:
   ```bash
   npm run dev
   ```

## Usage

After following the installation steps, open your browser and go to `http://localhost:5173` for the frontend and `http://localhost:3001` for the backend.

## Deployment

The application is deployed on Render and can be accessed [here](https://taskforceui.onrender.com/).

## Contributing

This is a solo project for CS162 assignment

## Application Structure

This section outlines the well-considered structure of the application, offering an in-depth look into how various components are organized. Our architecture is rooted in the principle of Separation of Concerns, ensuring that each component is dedicated to a specific function, thus making the system both maintainable and scalable.

### Backend Structure

The backend is neatly organized into distinct folders, each serving a unique purpose:

```plaintext
ToDo_API/
├── db/db.js                 # Manages database connections
├── models/               # Contains the todo lists and tasks logic and interacts with the database
│   ├── listModel.js
│   └── todoModel.js
├── routes/               # Defines the API endpoints and their corresponding actions
│   ├── authRoutes.js
│   ├── listRoutes.js
│   └── todoRoutes.js
└── server.js             # Entry point for the backend, initializing the server and middleware
```

### Frontend Structure

```
ToDo_UI/
├── src/
│   ├── components/
│   │   ├── WholeContainer/  # Houses the main layout components
│   │   │   ├── SideListContainer.jsx
│   │   │   ├── TaskWrapper.jsx
│   │   │   └── TodoListContainer.jsx
│   ├── contexts/             # Manages state and shares it across different components
│   │   └── AuthContext.jsx, TodoContext.jsx
│   └── utils/                # Contains utility functions and API calls
│       └── api.js

```

### Simple explanation of the app logic

The app has the following logic for Http connections. A todo model -> connects backend to database -> imported in routes -> routes create an endpoint reachable by the frontend -> api.js functions calls an endpoint on the backend and export it -> context provider imports the function and handle the request from components.

The application strictly adheres to the principle of Separation of Concerns. Each part of the system is designed to handle a specific task and is neatly organized into its own folder and file. For instance, database models are separated from routing logic and the task lists and todos are managed separately, and within the frontend, state management is decoupled from UI components. The authentication logics are implemented in different context provider than the todo context providers. This structure ensures that each component handles conceptually similar tasks, making the codebase easier to maintain and extend.

Throughout the codebase, I used brief comments and docstrings liberally to explain the functionality of each section. Error messages are clear and informative, aiding in debugging and understanding the code. One can spend few minutes and pick up the logic of the app and understand it. Also, I followed Naming conventions and used expressive names to improve readability of the code. So when I come back after sometime to add features, it is going to be easy to do so.

```

```
