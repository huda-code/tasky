Tasky - Task Manager
Welcome to the Tasky repository! Tasky is a comprehensive task management application designed to help teams and individuals stay organized and on track. Built with the MERN stack (MongoDB, Express.js, React.js, and Node.js), it offers a user-friendly interface and robust features to manage tasks efficiently and ensure timely reminders.

Features
Task Management: Add, edit, delete, and view tasks with options to adjust schedules.
Reminders: Set up to three reminders per task, ensuring you never miss a deadline.
User Authentication: Secure registration and login processes.
OTP Confirmation: Enhance security with OTP confirmation during the registration process, sent via email.
Email Notifications: Receive reminder emails for upcoming tasks deadlines, powered by NodeMailer.
Project Structure
The repository is organized into two main folders:

client-app: Contains all frontend code built with React.js.
server: Houses backend code, including APIs developed with Node.js and Express.js. It connects to MongoDB for data storage.
Client-App
The frontend is interactive and responsive, providing a seamless user experience. It supports user authentication and communicates with the backend via RESTful APIs to perform CRUD operations on tasks.

Server
The backend handles API requests, interfaces with MongoDB, performs CRUD operations, manages user authentication, sends OTPs for verification, and triggers email reminders via NodeMailer.

Getting Started
Prerequisites
Node.js
MongoDB
npm or yarn
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/huda-code/tasky.git
Install dependencies for the server:

bash
Copy code
cd server
npm install
Install dependencies for the client:

bash
Copy code
cd ../client-app
npm install
Start the server:

bash
Copy code
cd ../server
npm start
In a new terminal, start the client app:

bash
Copy code
cd ../client-app
npm start
The client app will run on http://localhost:3000, and the server on http://localhost:5000.

Contributing
Contributions are welcome! Feel free to submit a pull request or create an issue if you have feedback or wish to propose changes.

License
This project is licensed under the MIT License - see the LICENSE.md file for details.
