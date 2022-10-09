import nodemailer from "nodemailer";
async function sendEmail(){
        try {
            let transporter = nodemailer.createTransport({
                host : "mail.csmafia.com",
                port:"465",
                secure: true,
                auth:{
                    user:"cfi@csmafia.com",
                    pass:"codeforindiaFTW"
                }
            });
            let info = await transporter.sendMail({
                from : 'CFI Tasky solution <cfi@csmafia.com>',
                subject: "This is the test mail",
                to:"mohammedsabiya2@gmail.com",
                // Body, can be written anything
                html:"<h1>I am sending an Email from nodemailer"
            })
          console.log(info.messageId);
        } catch (error) {
            console.log(error);
        }
    }

sendEmail();
