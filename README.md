# Taskforce: A Hierarchical Todo List App

[![Click here to check the Deployed app on Render](https://img.shields.io/badge/Click%20here%20to%20check%20the%20Deployed%20app%20on-Render-blue)](https://taskforceui.onrender.com/)

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

See [this loom video](link-to-loom-video) for a walkthrough of these features.

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
2. Navigate to the `ToDo_API` folder.
3. Install the necessary npm packages:
   ```bash
   npm install
   ```
4. Start the server. Make sure it's running on port 3001:
   ```bash
   npm start
   ```

### Frontend (Located in the ToDo_UI folder)

1. Navigate to the `ToDo_UI` folder.
2. Install the necessary npm packages:
   ```bash
   npm install
   ```
3. Start the application. This will run the app in development mode:
   ```bash
   npm run dev
   ```

## Usage

After following the installation steps, open your browser and go to `http://localhost:5173` for the frontend and `http://localhost:3001` for the backend.

## Deployment

The application is deployed on Render and can be accessed [here](https://taskforceui.onrender.com/).

## Contributing

This is a solo project for CS162 assignment
