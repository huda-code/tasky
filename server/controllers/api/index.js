import express from "express";
import { loginValidation, registerValidation, errorMiddleware } from "../../middleware/validation/index.js"
import fs from "fs/promises";
import bcrypt from "bcrypt";
import config from "config";


import generateToken from "../../middleware/auth/generateToken.js";
import { randomString, sendEmail, sendSMS } from "../../utils/index.js"

import userModel from "../../models/Users/index.js";
import taskModel from "../../models/Tasks/index.js";

const router = express.Router();


// router.use((req, res, next) => {
//     try {
//         console.log("HELLO WORLD FROM NEXT");
//         req.payload="HI QASIM";
//         req.adnan="HI ADNAN";
//         // res.status(200).json({ success: "Next Middleware" })
//         next();
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: "Internal Server Error " })
//     }
// })

/*
METHOD : POST
PUBLIC
API Endpoint : /api/login
Body : 
email
password 
*/

router.post('/login', loginValidation(), errorMiddleware, async (req, res) => {
	try {
		//destructuring from body
		let { email, password } = req.body;

		//if empty fields
		// if (!email || !password) {
		// 	return res.status(400).json({ error: 'Some Fields Are Missing ' });
		// }

		//reading from existing db
		// let fileData = await fs.readFile('data.json');
		// fileData = JSON.parse(fileData);

		//email checking if exist in db
		let userFound = await userModel.findOne({"email":email});

    // console.log(userFound);

		if (!userFound) {
			return res.status(401).json({ error: 'Invalid Credentials ' });
		}

		//checking hashed password matching with entered password
		let matchPassword = await bcrypt.compare(password, userFound.password);

		if (!matchPassword) {
			return res.status(401).json({ error: 'Invalid Credentials ' });
		}

		//GENERATE A JWT TOKEN
		let payload = {
			user_id: userFound._id,
			role: 'user',
		};

		//using auth middleware
		const token=generateToken(payload);

		//passing token in response
		res.status(200).json({ success: 'Login is Successful', token });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.post(
    '/signup',
    registerValidation(),
    errorMiddleware,
    async (req, res) => {
        try {
            let { firstname, lastname, email, password, password2, address, phone } =
                req.body;
            console.log(req.body);


            //if email of user already exist in db
            // let emailFound = fileData.find((ele) => ele.email == email);
            let emailFound = await userModel.findOne({ email: email });

            console.log(emailFound);

            if (emailFound) {
                return res
                    .status(409)
                    .json({ error: 'User Email Already Registered. Please Login' });
            }

            //if phone number already exist in db
            let phoneFound = await userModel.findOne({ phone: phone });
            // console.log(phoneFound,"on line 81")
            if (phoneFound) {
                return res
                    .status(409)
                    .json({ error: 'User Phone Already Registered. Please Login.' });
            }

            //Hashing the password
            password = await bcrypt.hash(password, 12); //applying 12 rounds of salt

            //making our own object to store in db
            let userData = { firstname, lastname, email, password, address, phone };

            //mongodb data
            //add user_id to our userData object and tasks array
            // userData.user_id = randomString(16);

            // userData.tasks = [];

            // userData.userVerified = {
            // 	phone: false,
            // 	email: false,
            // };

            let phoneToken = randomString(20);
            let emailToken = randomString(20);

            userData.userverifytoken = {
                phone: phoneToken,
                email: emailToken,
            };

            const users = new userModel(userData);
            //pushing our userData object to empty filedata
            // fileData.push(userData);

            //writing the fileData to db
            // await fs.writeFile('data.json', JSON.stringify(fileData));

            await users.save();

            // const payments = new Payment();
            //   payments.user = booking_data._id;
            //   payments.save();

            const task_Data = new taskModel();

            task_Data.user = users._id;
            task_Data.save();

            res.status(200).json({ success: "User Successfully Registered" });
            // console.log("hello")

            //TODO: Add SMS and EMAIL Verification calls

            // sendSMS({
            // body: `Thank you for Signing Up. Please click on the given link to verify your phone. ${config.get("URL")}/api/verify/mobile/${phoneToken}`,
            // to: phone
            // })
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server error' });
        }
    }
);



router.get("/", (req, res) => {
    try {
        res.status(200).json({ "success": "Router GET is UP" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ "error": "Interval Server Error" });

    }
})


export default router;