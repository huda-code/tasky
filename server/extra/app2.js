// import express from "express";
// import fs from "fs/promises";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import { scheduleJob, scheduledJobs, cancelJob } from "node-schedule";

// import randomString from "./randomString.js";
// // 
// import "./dbconnect.js";
// import userModel from "./data.js";

// const app = express();
// const port = 5000;


// //JSON Body Parser
// app.use(express.json())
// // 
// app.get("/", (req, res) => {
//     res.send("Server is up");

// })

// app.get("/", (req, res) => {
//     res.status(200).json({ success: "Welcome To the Tasky Application" })
// })

// /*
// METHOD : POST
// API Endpoint : /api/signup
// Body : 
// firstname ; 
// lastname
// phone
// email
// password 
// password2
// address
// */

// app.post("/api/signup", async (req, res) => {
//     try {
//         console.log(req.body);
//         // let { firstname, lastname, email, password, password2, address, phone } = req.body;
//         // let body = req.body;

//         //Basic Validations
//         // if (!email || !firstname || !lastname || !phone || !address || !password || !password2) {
//         // return res.status(400).json({ "error": "Some Fields Are Missing " });
//         // }
//         // if (password !== password2) {
//         // return res.status(400).json({ "error": "Passwords are Not Same" });
//         // }
//         //Check Duplication of Email & Mobile
//         // let fileData = await fs.readFile("data.json");
//         // fileData = JSON.parse(fileData);


//         req.body.password = await bcrypt.hash(req.body.password, 12);


//         // console.log(fileData);
//         // console.log(email);

//         // let emailFound = fileData.find((ele) => ele.email == email)
//         let emailFound = await userModel.findOne({ email: req.body.email });
//         // console.log(emailFound);
//         if (emailFound) {
//             return res.status(409).json({ error: "User Email Already Registered. Please Login" });
//         }

//         let phoneFound = await userModel.findOne({ phone: req.body.phone });
//         if (phoneFound) {
//             return res.status(409).json({ error: "User Phone Already Registered. Please Login." })
//         }

//         // fileData.forEach((ele) => {
//         //     console.log(ele.email);
//         // })

//         let userData = new userModel(req.body);
//         await userData.save();

//         res.status(200).json({ success: "User Signed Up Succesfully" });

//         // 
//         // let tasky_data = new taskyModel(req.body);
//         // await tasky_data.save();

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal Server Error" })
//     }
// })

// /*
// METHOD : POST
// PUBLIC
// API Endpoint : /api/login
// Body : 
// email
// password 
// */

// app.post("/api/login", async (req, res) => {
//     try {
//         let { email, password } = req.body;
//         if (!email || !password) {
//             return res.status(400).json({ "error": "Some Fields Are Missing " });
//         }

//         let fileData = await fs.readFile("data.json");
//         fileData = JSON.parse(fileData);

//         let userFound = fileData.find((ele) => ele.email == email)
//         if (!userFound) {
//             return res.status(401).json({ "error": "Invalid Credentials " });
//         }
//         // console.log(userFound);
//         let matchPassword = await bcrypt.compare(password, userFound.password)
//         // console.log(matchPassword);
//         if (!matchPassword) {
//             return res.status(401).json({ "error": "Invalid Credentials " });
//         }

//         let payload = {
//             user_id: userFound.user_id,
//             role: "user"
//         }

//         let privatekey = "codeforindia";

//         //GENERATE A TOKEN
//         const token = jwt.sign(payload, privatekey, { expiresIn: "7d" });
//         // console.log(token);

//         res.status(200).json({ success: "Login is Successful", token })


//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal Server Error" })
//     }
// })

// /*
// METHOD : POST
// PRIVATE
// auth-token
// API Endpoint : /api/task
// Body : 
// task_name
// deadline
// */


// app.post("/api/task", async (req, res) => {
//     try {
//         //Check for Authorization 
//         let token = req.headers["auth-token"];
//         if (!token) {
//             return res.status(401).json({ error: "Unauthorised Access" });
//         }
//         const payload = jwt.verify(token, "codeforindia");
//         // console.log(payload);
//         if (!payload) {
//             return res.status(401).json({ error: "Unauthorised Access" });
//         }

//         //Check Req.body

//         let { task_name, deadline } = req.body;
//         if (!task_name || !deadline) {
//             return res.status(400).json({ error: "Some Fields are Missing" });
//         }

//         //    console.log(task_name, deadline);


//         let utc_deadline = new Date(deadline);
//         //Check if format is Right or Not
//         //Check if its Backdated or Not

//         let present_time = new Date();
//         // console.log(present_time);
//         // console.log(utc_deadline < present_time);

//         if (utc_deadline == "Invalid Date" || (utc_deadline < present_time)) {
//             return res.status(400).json({ error: "Invalid Date Entered" });
//         }
//         // console.log(utc_deadline);

//         //Check Validation for 30 mins and 30 Days
//         let difference = utc_deadline - present_time;
//         // console.log(utc_deadline);
//         // console.log(present_time);
//         // console.log(difference);


//         //Difference in Minutes
//         let mins = difference / (1000 * 60)
//         // console.log(mins);

//         let days = difference / (1000 * 60 * 60 * 24);
//         // console.log(days);

//         //Not Less than 30 mins and Not more than 30 Days
//         if (mins < 1 || days > 30) {
//             return res.status(400).json({ error: "Invalid Date Entered, Deadline Should be More than 30 mins and Less than 30 Days" });
//         }

//         //Get Reminders
//         let reminders = [];

//         let reminder1 = new Date((+present_time) + (difference / 4));
//         // console.log(reminder1);

//         let reminder2 = new Date((+present_time) + (difference / 2));
//         // console.log(reminder2);

//         let reminder3 = new Date((+present_time) + (difference / (4 / 3)));
//         // console.log(reminder3);

//         reminders.push(reminder1, reminder2, reminder3, utc_deadline);
//         // console.log(reminders);


//         //Reading File Data
//         let fileData = await fs.readFile("data.json");
//         fileData = JSON.parse(fileData);

//         let userFound = fileData.find((ele) => ele.user_id == payload.user_id)
//         // console.log(userFound);
//         let task_id = randomString(14)

//         let task_data = {
//             task_id,
//             task_name,
//             deadline: utc_deadline,
//             isCompleted: false,
//             reminders
//         }

//         task_data.reminders.forEach((ele, i) => {
//             scheduleJob(`${task_id}_${i}`, ele, () => {

//                 sendEmail({
//                     subject: "This is a Reminder",
//                     to: userFound.email,
//                     html: `<p> Hi! this is reminder  ${i + 1}  to complete the task ${task_name}

//                     <b>CFI Tasky Solution</b>
//                 </p>`
//                 })
//                 // console.log(ele);
//                 // console.log(`Hi ${userFound.firstname},
//                 // This is a reminder  ${i+1} for Completing your task ${task_data.task_name}`, i);
//                 console.log(new Date());

//             })

//         })
//         // console.log(scheduledJobs);
//         // console.log(task_data);
//         userFound.tasks.push(task_data);

//         // console.log(userFound);
//         // console.log(fileData);
//         await fs.writeFile("data.json", JSON.stringify(fileData));

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: "Internal Server Error" })
//     }
// })

// /* 
// End Point : /api/tasks
// Method : GET
// PRIVATE
// */
// app.get("/api/tasks", (req, res) => {
//     try {
//         res.status(200).json({ success: "Task was get" });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: "Internal Server Error" });
//     }

// })


// /* 
// End Point : /api/task/:task_id
// Method : GET
// PRIVATE
// */



// /* 
// End Point : /api/task/:task_id
// Method : DELETE
// PRIVATE
// Use : To Delete the Task from a Given ID
// */


// app.delete("/api/task/:task_id", async (req, res) => {
//     try {
//         // console.log(req.params);
//         let task_id = req.params.task_id;
//         console.log(task_id);

//         //Check for Authorisation
//         let token = req.headers["auth-token"];
//         if (!token) {
//             return res.status(401).json({ error: "Unauthorised Access" });
//         }
//         const payload = jwt.verify(token, "codeforindia");
//         // console.log(payload);
//         if (!payload) {
//             return res.status(401).json({ error: "Unauthorised Access" });
//         }


//         //Reading File Data
//         let fileData = await fs.readFile("data.json");
//         fileData = JSON.parse(fileData);

//         let userFound = fileData.find((ele) => ele.user_id == payload.user_id)
//         // console.log(userFound);

//         //Find Index of Given Task

//         let taskIndex = userFound.tasks.findIndex((ele) => ele.task_id == task_id);
//         // console.log(taskIndex);

//         if (taskIndex == -1) {
//             return res.status(404).json({ error: "Task Not Found" });
//         }

//         //Delete Element with Given Index from an Array
//         userFound.tasks.splice(taskIndex, 1)
//         // console.log(userFound.tasks);
//         // console.log(fileData);
//         await fs.writeFile("data.json", JSON.stringify(fileData));
//         res.status(200).json({ success: "Task Was Deleted Successfully" });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: "Internal Server Error" });
//     }
// })

// app.listen(port, () => {
//     console.log("Server Started at Port ", port);
// })

// ...........................................................