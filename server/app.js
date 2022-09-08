import express from "express";

const app = express();
const port = 5000;
// JSON Body Parser
app.use(express.json())

app.get("/", (req,res)=>{
    res.status(200).json({ success: "Welcome to the tasky application"})
    })

// METHOD :post
// API End point : /api/register
// BODY: 
// firstname:
// lastname:
// phone:
// email:
// password:
// password2:
// address
app.post("/api/signup", (req, res) => {
    // console.log(req.body);
    let { firstname, lastname, email, password, password2, address, phone } = req.body;
    // console.log(email);
    if (!email || !firstname || !lastname || !phone || !address || !password || !password2) {
        return res.status(400).json({ "error": "Some Fields Are Missing " });
    }
    if (password !== password2) {
        return res.status(400).json({ "error": "Passwords are Not Same" });
    }
    res.status(200).json({ success: "You are in Signup Route" });
})