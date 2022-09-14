import twilio from "twilio";


const accountSid = "AC9bf7fb45d5509df83f0d546333cdedf0";
const authToken = "ca41c5bc140f06e5ac13d27bbea32781";
const client = new twilio(accountSid, authToken);

let smsbody={  
    body :" This is the reminder",
    to: '+919014828737'
}
async function sendsms (smsbody) {
    try {
       let message = await client.messages
            .create({
                body: smsbody.body,
                from: '+15739953393',
                to: smsbody.to 
            })
            console.log(message.sid);
    } catch (error) {
        console.error(error)
    }
}
sendsms(sms);