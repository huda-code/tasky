import express from "express";
import authMiddleware from "../../middleware/auth/verifyToken.js";
import { scheduleJob, scheduledJobs, cancelJob } from "node-schedule";
import { scheduleTaskValidation, errorMiddleware, editTaskValidation } from "../../middleware/validation/index.js";
import { sendEmail, sendSMS } from "../../utils/index.js";


import taskModel from "../../models/Tasks/index.js";


const router = express.Router();

router.post("/", authMiddleware, scheduleTaskValidation(), errorMiddleware, async (req, res) => {
    try {
        //getting token from request.headers
        // let token = req.headers['auth-token'];



        const payload = req.payload

        //checking the token is valid or not
        if (!payload) {
            return res.status(401).json({ error: "Unauthorised Access" })
        }

        //getting task_name, and deadline from body
        let { taskname, deadline } = req.body;

        //if date is in correct format AND date entered is already been passed
        let present_time = new Date(); //utc format

        //will be getting diff in present time and deadline in milliseconds
        let difference = new Date(deadline) - present_time;

        //Creating Reminders Array
        let reminders = []

        let reminder1 = new Date(+present_time + difference / 4);
        // console.log(reminder1);

        let reminder2 = new Date(+present_time + difference / 2);
        // console.log(reminder2);

        let reminder3 = new Date(+present_time + difference / (4 / 3));
        // console.log(reminder3);

        //populating reminders array
        reminders.push(reminder1, reminder2, reminder3, new Date(deadline));
        // console.log(reminders);


        //Checking user_id exist in db that is same from token i.e payload.user_id
        // let userFound = await userModel.findOne({ user_id: payload.user_id })

        let taskData = await taskModel.findOne({ user: payload.user_id }).populate("user", ["firstname", "phone", "email"]);
        console.log(taskData);


        //creating task_data object to push in tasks array
        let task_data = {
            taskname,
            deadline: new Date(deadline),
            isCompleted: false,
            reminders,
        }

        taskData.tasks.push(task_data);
        //Saving into DB
        await taskData.save();
        res.status(200).json({ success: "Task was Added" })

        // console.log(taskData);

        let job_id = taskData.tasks[taskData.tasks.length - 1]._id.toString();
        // console.log(job_id);


        //TODO: Add SMS and Mail Body Logic
        task_data.reminders.forEach((ele, i) => {
            scheduleJob(`${job_id}_${i}`, ele, () => {
                if (reminders.length - 1 == i) {
                    sendEmail({
                        subject: `This is a Deadline Reminder for your Task ${task_data.taskname}`,
                        to: taskData.user.email,
                        html: `<p>Hi ${taskData.user.firstname}, <br>
            			Your deadline for  ${taskname} has been passed. <br>
            			<b>CFI Tasky App</b>
            			</p>`,
                    });
                } else {
                    sendEmail({
                        subject: `This is a Reminder for your Task ${task_data.taskname}`,
                        to: taskData.user.email,
                        html: `<p>Hi ${taskData.user.firstname}, <br>
            			This is a Reminder - ${i + 1} to Complete your Task ${taskname} <br>
            			<b>CFI Tasky App</b>
            			</p>`,
                    });
                }
            });
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" })
    }
})


router.get("/tasks", authMiddleware, async (req, res) => {
    try {
        const payload = req.payload;
        let taskData = await taskModel.findOne({ user: payload.user_id });
        console.log(taskData);
        res.status(200).json({ tasks: taskData.tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ "error": "Interval Server Error" });
    }
})

router.get("/:task_id", authMiddleware, async (req, res) => {
    try {
        const payload = req.payload;
        // console.log(req.params.task_id);

        let taskData = await taskModel.findOne({ user: payload.user_id });
        console.log(taskData);

        let taskFound = taskData.tasks.find((ele) => ele._id == req.params.task_id);
        console.log(taskFound);

        if (!taskFound) {
            res.status(404).json({ "error": "Task Not Found" });
        }

        res.status(200).json({ success: "Task Found", task: taskFound });
    } catch (error) {
        console.error(error);
        res.status(500).json({ "error": "Interval Server Error" });
    }
})

router.delete("/:task_id", authMiddleware, async (req, res) => {
    try {
        console.log(scheduledJobs);

        const payload = req.payload;

        let taskData = await taskModel.findOne({ user: payload.user_id });
        // console.log(taskData);

        let taskIndex = taskData.tasks.findIndex((ele) => ele._id == req.params.task_id);
        // console.log(taskIndex);
        if (taskIndex == -1) {
            res.status(404).json({ "error": "Task Not Found" });
        }
        // console.log(taskData.tasks[taskIndex]);
        taskData.tasks[taskIndex].reminders.forEach((ele, i) => {
            cancelJob(`${taskData.tasks[taskIndex]._id}_${i}`)
        })
        taskData.tasks.splice(taskIndex, 1);

        console.log(scheduledJobs);
        await taskData.save();
        res.status(200).json({ "success": "Task Deleted Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ "error": "Interval Server Error" });

    }
})


/*
METHOD: PUT
API Endpoint: /api/task/:task_id
PRIVATE
res: "reminder has been edited"
*/

router.put("/:task_id", authMiddleware, editTaskValidation(), errorMiddleware, async (req, res) => {
    try {
        let task_id = req.params.task_id;

        const payload = req.payload;
        //checking the token is valid or not
        if (!payload) {
            return res.status(401).json({ error: "Unauthorised Access" });
        }

        //getting task_name, and deadline, isCompleted from body
        let { taskname, deadline, isCompleted } = req.body;



        // converting ---> utc deadline
        let utc_deadline = new Date(deadline);
        // console.log(utc_deadline);

        //if date is in correct format AND date entered is already been passed
        let present_time = new Date(); //utc format


        //Check Validation for 30 mins and 30 Days
        //will be getting diff in present time and deadline in milliseconds
        let difference = utc_deadline - present_time;

        //Creating Reminders Array
        let reminders = []

        let reminder1 = new Date(+present_time + difference / 4);
        // console.log(reminder1);

        let reminder2 = new Date(+present_time + difference / 2);
        // console.log(reminder2);

        let reminder3 = new Date(+present_time + difference / (4 / 3));
        // console.log(reminder3);

        //populating reminders array
        reminders.push(reminder1, reminder2, reminder3, new Date(deadline));

        //--------------------------
        let taskData = await taskModel.findOne({ user: payload.user_id }).populate("user", ["firstname", "email", "phone"]);
        let taskFound = taskData.tasks.find((ele) => ele._id == req.params.task_id);
        console.log(taskFound);
        if (!taskFound) {
            res.status(404).json({ "error": "Task Not Found" });
        }
        console.log(taskFound._id);

        taskFound.reminders.forEach((ele, i) => {
            cancelJob(`${taskFound._id}_${i}`)
        })


        taskFound.taskname = taskname;
        taskFound.deadline = new Date(deadline);
        taskFound.isCompleted = isCompleted;
        taskFound.reminders = reminders;

        //SAVE TO DB
        await taskData.save();
        res.status(200).json({ success: "Reminder has been Edited" });



        if (isCompleted == false) {
            let job_id = taskFound._id.toString();
            reminders.forEach((ele, i) => {
                scheduleJob(`${job_id}_${i}`, ele, () => {
                    if (reminders.length - 1 == i) {
                        sendEmail({
                            subject: `This is a Deadline Reminder for your Task ${taskname}`,
                            to: taskData.user.email,
                            html: `<p>Hi ${taskData.user.firstname}, <br>
                            Your deadline for  ${taskname} has been passed. <br>
                            <b>CFI Tasky App</b>
                            </p>`,
                        });
                    } else {
                        sendEmail({
                            subject: `This is a Reminder for your Task ${taskname}`,
                            to: taskData.user.email,
                            html: `<p>Hi ${taskData.user.firstname}, <br>
                            This is a Reminder - ${i + 1} to Complete your Task ${taskname} <br>
                            <b>CFI Tasky App</b>
                            </p>`,
                        });
                    }
                });
            })
        }



    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;