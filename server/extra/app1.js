

// import express from "express";
// import fs from "fs/promises";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { scheduleJob, scheduledJobs, cancelJob } from "node-schedule";
// import randomString from "./randomString.js";
// // import sendEmail from "./sendmail.js";
// import sendsms from "./sendsms.js";
// const app = express();
// const port = 5000;
// //JSON Body Parser
// app.use(express.json());
// app.get("/", (req, res) => {
//   res.status(200).json({ success: "Welcome To the Tasky Application" });
// });
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
//   try {
//     // console.log(req.body);
//     let { firstname, lastname, email, password, password2, address, phone } =
//       req.body;
//     // let body = req.body;
//     //Basic Validations
//     if (
//       !email ||
//       !firstname ||
//       !lastname ||
//       !phone ||
//       !address ||
//       !password ||
//       !password2
//     ) {
//       return res.status(400).json({ error: "Some Fields Are Missing " });
//     }
//     if (password !== password2) {
//       return res.status(400).json({ error: "Passwords are Not Same" });
//     }
//     //Check Duplication of Email & Mobile
//     let fileData = await fs.readFile("data.json");
//     fileData = JSON.parse(fileData);
//     // console.log(fileData);
//     // console.log(email);
//     let emailFound = fileData.find((ele) => ele.email == email);
//     // console.log(emailFound);
//     if (emailFound) {
//       return res
//         .status(409)
//         .json({ error: "User Email Already Registered. Please Login" });
//     }
//     let phoneFound = fileData.find((ele) => ele.phone == phone);
//     if (phoneFound) {
//       return res
//         .status(409)
//         .json({ error: "User Phone Already Registered. Please Login." });
//     }
//     // fileData.forEach((ele) => {
//     //     console.log(ele.email);
//     // })
//     password = await bcrypt.hash(password, 12);
//     //Generate a 12 Digit Random String for user_id
//     let user_id = randomString(16);
//     // console.log(user_id);
//     let userData = {
//       user_id,
//       firstname,
//       lastname,
//       email,
//       password,
//       address,
//       phone,
//     };
//     userData.tasks = [];
//     // userData.firstname = firstname;
//     // console.log(userData)
//     fileData.push(userData);
//     await fs.writeFile("data.json", JSON.stringify(fileData));
//     res.status(200).json({ success: "User Signed Up Succesfully" });
//     await sendsms({ body: `Thank you for registering. Please follow this link to get verified. https://192.168.1.36:5000/api/verify/mobile/${phoneToken}`, to: phone})
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// // /*
// // METHOD : POST
// // PUBLIC
// // API Endpoint : /api/login
// // Body : 
// // email
// // password 
// // */
// app.post("/api/login", async (req, res) => {
//   try {
//     let { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ error: "Some Fields Are Missing " });
//     }
//     let fileData = await fs.readFile("data.json");
//     fileData = JSON.parse(fileData);
//     // console.log(fileData);
//     let userFound = fileData.find((ele) => ele.email == email);
//     // console.log(userFound);
//     if (!userFound) {
//       return res.status(401).json({ error: "Invalid Credentials " });
//     }
//     console.log(userFound);
//     let matchPassword = await bcrypt.compare(password, userFound.password);
//     // console.log(matchPassword);
//     if (!matchPassword) {
//       return res.status(401).json({ error: "Invalid Credentials " });
//     }
//     let payload = {
//       user_id: userFound.user_id,
//       role: "user",
//     };
//     let privatekey = "codeforindia";
//     //GENERATE A TOKEN
//     const token = jwt.sign(payload, privatekey, { expiresIn: "45d" });
//     console.log(token);
//     res.status(200).json({ success: "Login is Successful" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// // /*
// // METHOD : POST
// // PRIVATE
// // auth-token
// // API Endpoint : /api/task
// // Body : 
// // task_name
// // deadline
// // */
// app.post("/api/task", async (req, res) => {
//   try {
//     // Check for Authorization
//     let token = req.headers["auth-token"];
//     if (!token) {
//       return res.status(401).json({ error: "Unauthorised Access" });
//     }
//     const payload = jwt.verify(token, "codeforindia");
//     // console.log(payload);
//     if (!payload) {
//       return res.status(401).json({ error: "Unauthorised Access" });
//     }
//     // Check Req.body
//     let { task_name, deadline } = req.body;
//     if (!task_name || !deadline) {
//       return res.status(400).json({ error: "Some Fields are Missing" });
//     }
//     // console.log(task_name,deadline);
//     let utc_deadline = new Date(deadline);
//     //Check if format is Right or Not
//     //Check if its Backdated or Not
//     let present_time = new Date();
//     // console.log(utc_deadline < present_time);
//     if (utc_deadline == "Invalid Date" || utc_deadline < present_time) {
//       return res.status(400).json({ error: "Invalid Date Entered" });
//     }
//     // console.log(utc_deadline);
//     // Check Validation for 30 mins and 30 Days
//     let difference = utc_deadline - present_time;
//     // console.log(difference);
//     // Difference in Minutes
//     let Minute = difference / (1000 * 60);
//     // console.log(Minute);
//     let days = difference / (1000 * 60 * 60 * 24);
//     // console.log(days);
//     // Not Less than 30 mins and Not more than 30 Days
//     if (Minute < 30 || days > 30) {
//       return res.status(400).json({ error: "Invalid Date Entered, Deadline" });
//     }
//     // Get Reminders
//     let reminders = [];
//     let reminder1 = new Date(+present_time + difference / 4);
//     // console.log(reminder1);
//     let reminder2 = new Date(+present_time + difference / 2);
//     // console.log(reminder2);
//     let reminder3 = new Date(+present_time + difference / (4 / 3));
//     // console.log(reminder3);
//     reminders.push(reminder1, reminder2, reminder3, utc_deadline);
//     console.log(reminders);
//     //Reading File Data
//     let fileData = await fs.readFile("data.json");
//     fileData = JSON.parse(fileData);
//     let userFound = fileData.find((ele) => ele.user_id == payload.user_id);
//     // console.log(userFound);
//     let task_data = {
//       task_id: randomString(14),
//       task_name,
//       deadline: utc_deadline,
//       isCompleted: false,
//       reminders,
//     };
//     task_data.reminders.forEach((ele, i) => {
//       // console.log(ele);
//       scheduleJob(`${ele.task_id}_${i}`, ele, () => {
//         sendEmail({
//           subject: "This is a  Reminder",
//           to: userFound.email,
//           html: `<p> Hi ${userFound.firstname}, <br>
//                     This is a Reminder - ${
//                       i + 1
//                     } to Complete your Task ${task_name} <br>
//                     <b>CFI Tasky App</b>
//                     </p>`,
//         });
//         console.log(new Date());
//       });
//       // console.log(i);
//     });
//     console.log(scheduledJobs);
//     // console.log(task_data);
//     userFound.tasks.push(task_data);
//     // console.log(userFound);
//     // console.log(fileData);
//     await fs.writeFile("data.json", JSON.stringify(fileData));
//     res.status(200).json({ success: "Task Added" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // /* 
// // End Point : /api/task/:task_id
// // Method : DELETE
// // PRIVATE
// // Use : To Delete the Task from a Given ID
// // */
// app.delete("/api/task/:task_id", async (req, res) => {
//   try {
//     // console.log(req.params);
//     let task_id = req.params.task_id;
//     console.log(task_id);
//     //Check for Authorisation
//     let token = req.headers["auth-token"];
//     if (!token) {
//       return res.status(401).json({ error: "Unauthorised Access" });
//     }
//     const payload = jwt.verify(token, "codeforindia");
//     // console.log(payload);
//     if (!payload) {
//       return res.status(401).json({ error: "Unauthorised Access" });
//     }
//     //Reading File Data
//     let fileData = await fs.readFile("data.json");
//     fileData = JSON.parse(fileData);
//     let userFound = fileData.find((ele) => ele.user_id == payload.user_id);
//     let taskIndex = userFound.tasks.findIndex((ele) => ele.task_id == task_id);
//     if (taskIndex == -1) {
//       return res.status(404).json({ error: "Task Not Found" });
//     }
//     userFound.tasks.splice(taskIndex, 1);
//     await fs.writeFile("data.json", JSON.stringify(fileData));
//     res.status(200).json({ success: "Task Was Deleted Successfully" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// // /* 
// // End Point : /api/task/:task_id
// // Method : GET
// // PRIVATE
// // */
// app.get("/api/tasks", async (req, res) => {
//   try {
//     let user_id = req.params.user_id;
//     console.log(user_id);
//     let token = req.headers["auth-token"];
//     if (!token) {
//       return res.status(401).json({ error: "Unauthorised Access" });
//     }
//     const payload = jwt.verify(token, "codeforindia");
//     if (!payload) {
//       return res.status(401).json({ error: "Unauthorised Access" });
//     }
//     let fileData = await fs.readFile("data.json");
//     fileData = JSON.parse(fileData);
//     let userFound = fileData.find((ele) => ele.user_id == payload.user_id);
//     console.log(userFound);
//     let list = userFound.tasks;
//     console.log(list);
//     if (list[0] == -1) {
//       return res.status(404).json({ error: "No Tasks Found" });
//     }
//     else {
//       res.status(200).json({ success: "Task Added" });}
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// // /* 
// // End Point : /api/task/:task_id
// // Method : GET
// // PRIVATE
// // */
// app.get("/api/task/:task_id", async (req, res) => {
//   try {
//     let task_id = req.params.task_id;
//     console.log(task_id);
//     let token = req.header["auth-token"];
//     if (!token) {
//       return res.status(401).json({ error: "Unauthorised Access" });
//     }
//     const payload = jwt.verify(token, "codeforindia");
//     console.log(payload);
//     if (!payload) {
//       return res.status(401).json({ error: "Unauthorised Access" });
//     }
//     let fileData = await fs.readFile("data.json");
//     fileData = JSON.parse(fileData);
//     let userFound = fileData.find((ele) => ele.user_id == payload.user_id);
//     let taskIndex = userFound.tasks.find((ele) => ele.task_id == task_id);
//     console.log(taskIndex);
//     if (taskIndex == -1) {
//       return res.status(404).json({ error: "No Task Found" });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// // End Point : /api/tasks
// // Method : GET
// // PRIVATE
// // Route :EDIT
// // */
// app.put("/api/task/:task_id", async (req, res) => {
//   try {
//     let { new_task_name, new_deadline } = req.body;
//     if (!new_task_name || !new_deadline) {
//       return res.status(400).json({ error: "Some Fields are Missing" });
//     }
//     let task_id = req.params.task_id;
//     let token = req.headers["auth-token"];
//     if (!token) {
//       return res.status(401).json({ error: "Unauthorised Access" });
//     }
//     const payload = jwt.verify(token, "codeforindia");
//     if (!payload) {
//       return res.status(401).json({ error: "Unauthorised Access" });
//     }
//     let fileData = await fs.readFile("data.json");
//     fileData = JSON.parse(fileData);
//     let userFound = fileData.find((ele) => ele.user_id == payload.user_id);
//     let taskIndex = userFound.tasks.find((ele) => ele.task_id == task_id);
//     if (taskIndex == -1) {
//       return res.status(404).json({ error: "Task Not Found" });
//     }
//     // console.log(taskIndex);
//     let utc_deadline = new Date(new_deadline);
//     let present_time = new Date();
//     if (utc_deadline == "Invalid Date" || utc_deadline < present_time) {
//       return res.status(400).json({ error: "Invalid Date Entered" });
//     }
//     // console.log(utc_deadline);
//     //Check Validation for 30 mins and 30 Days
//     let difference = utc_deadline - present_time;
//     //Difference in Minutes
//     let mins = difference / (1000 * 60);
//     // console.log(mins);
//     let days = difference / (1000 * 60 * 60 * 24);
//     // console.log(days);
//     //Not Less than 30 mins and Not more than 30 Days
//     if (mins < 1 || days > 30) {
//       return res.status(400).json({error: "Invalid Date Entered, Deadline Should be More than 30 mins and Less than 30 Days",});
//     }
//     //Get Reminders
//     let reminders = [];
//     let reminder1 = new Date(+present_time + difference / 4);
//     // console.log(reminder1);
//     let reminder2 = new Date(+present_time + difference / 2);
//     // console.log(reminder2);
//     let reminder3 = new Date(+present_time + difference / (4 / 3));
//     // console.log(reminder3);
//     reminders.push(reminder1, reminder2, reminder3, utc_deadline);
//     console.log(reminders);
//     taskIndex.task_id = ele.task_id;
//     taskIndex.task_name = new_task_name;
//     taskIndex.deadline = new_deadline;
//     taskIndex.isCompleted = false;
//     taskIndex.deadline = utc_deadline;
//     taskIndex.reminders = reminders;
//     taskIndex.reminders.forEach((ele, i) => {
//       // console.log(ele);
//       scheduleJob(`${ele.task_id}_${i}`, ele, () => {
//         sendEmail({
//           subject: "This is a  Reminder",
//           to: userFound.email,
//           html: `<p>Hi ${userFound.firstname}, <br>
//                     This is a Reminder - ${ i + 1 } to Complete your Task ${task_name} <br>
//                     <b>CFI Tasky App</b>
//                     </p>`,
//         });
//         console.log(new Date());
//       });
//       // console.log(i);
//     });
//     await fs.writeFile("data.json", JSON.stringify(fileData));
//     res.status(200).json({ success: "Task Was updated Successfully" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// app.listen(port, () => {
//   console.log("Server Started at Port ", port);
// });