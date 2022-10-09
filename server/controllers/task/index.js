import express from "express";
import authMiddleware from "../../middlewares/auth/verifyToken.js";
import jwt from "jsonwebtoken";
import { scheduleJob, scheduledJobs, cancelJob } from "node-schedule";
import taskmodel from "../../model/taskmodel.js";
import randomString from "../../utils/randomString.js";
import userModel from "../../model/usermodel.js";
import mongoose from "mongoose"

const taskRouter = express.Router();
taskRouter.post("/", authMiddleware, async (req, res) => {
    try {
        let token = req.headers["auth-token"]
        const payload = jwt.verify(token,"codeforindia")
        if (!payload) {
            return res.status(401).json({ error: "Unauthorized Access" });
        };
        let { taskName, deadline } = req.body;
        if (!taskName && !deadline) {
            return res.status(400).json({ error: "Some Fields are Missing" });
        }
        // let taskFound = await userModel.tasks.taskName;
        // if(taskFound){
        //     return res.status(409).json({error:"Task Name Already Exist"});
        // }
        let utcDeadline = new Date(deadline);
        let presentTime = new Date();
        if ((utcDeadline == "Invalid Date") || (utcDeadline < presentTime)) {
            return res.status(400).json({ error: "Invalid Date Entered" });
        }
        let difference = utcDeadline - presentTime;
        let mins = difference / (1000 * 60);
        let days = difference / (1000 * 60 * 60 * 24);
        if ((mins < 30) || (days > 30)) {
            return res.status(400).json({ error: "Invalid Date Entered, Deadline Should be Greater then 30 mins and Less then 30 Days" })
        }
        let reminders = [];
        let reminder1 = ((+presentTime) + (difference / 4));
        let reminder2 = ((+presentTime) + (difference / 2));
        let reminder3 = ((+presentTime) + (difference / (4 / 3)));
        reminders.push(reminder1, reminder2, reminder3);
        console.log(payload.user_id)
        let userFound = await userModel.findById({_id : payload.user_id});
        console.log(userFound)
        let taskId = randomString(14);
        let taskData = {
            taskName,
            deadline: utcDeadline,
            isCompleted: false,
            reminders
        }
        userFound.tasks.push(taskData)
        taskData.reminders.forEach((ele, i) => {
            // console.log(ele);
            scheduleJob(`${taskId}_${i}`, ele, () => {
                sendEmail({
                    subject: "This is a  Reminder",
                    to: userFound.email,
                    html: `<p>Hi ${userFound.firstname}, <br>
                    This is a Reminder - ${i + 1} to Complete your Task ${taskName} <br>
                    <b>CFI Tasky App</b>
                    </p>`
                })
                //Add Logic for Body
                // console.log(`hey ${userFound.firstname}, this is your ${i + 1} reminder for your task : ${task_data.task_name}`);
            })
            // console.log(i);
        })
        //  const tasktoPush = await taskmodel.findOne({_id:payload.user_id}).populate("user")
        //  console.log(tasktoPush)
        // await tasktoPush.save();
        await userFound.save()
        res.status(200).json({ success: "Task was Added" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
export default taskRouter