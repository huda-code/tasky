import express from "express";
import taskRouter from "./controllers/task/index.js";
// import config from ".config"

import apiRouter from "./controllers/api/index.js"


const app = express();

const port = 5000;
import './dbConnect.js';
// import connectDB from './dbConnect.js'

app.use(express.json());


app.get("/", (req,res)=>{
    res.status(200).json({success:"Tasky Connected"})
});

app.use("/api", apiRouter);
app.use("/tasks",taskRouter)



app.listen(port,()=>{
    console.log("Server Started at Port: ", port);
})