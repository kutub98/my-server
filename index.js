const express = require("express");
require('dotenv').config()
const cors = require ('cors')
const app = express()
const port = process.env.PORT || 5000

const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

app.use(cors())
app.use(express.json());

app.get('/', (req, res) =>{
    res.send('data base is running')
})




const { MongoClient, ServerApiVersion } = require('mongodb');
const { query } = require("express");

const uri = `mongodb+srv://${process.env.SITE_NAME_PORTFOLIO}:${process.env.SITE_AP_KEY}@cluster0.mlxcjcs.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

  const  userRequestMessage = client.db("Portfolio").collection("userRequestMessage");
  // perform actions on the collection object

async function run(){
    try{
        await client.connect()
        console.log('database has connected')
    } catch(error){
        console.error(error)
    }
}
const receivedClientMessage = (messageBody) =>{
   
    const {email, message} = messageBody
    // This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
    const auth = {
      auth: {
        api_key: process.env.EMAIL_API,
        domain: process.env.EMAIL_DOMAIN
      }
    }
    
    const transporter = nodemailer.createTransport(mg(auth));
    
    transporter.sendMail({
      from: email,
      to: 'severaltask@gmail.com', // An array if you have multiple recipients.
      
      subject: `Your Request for contact ${email}`,
      'replyTo': 'reply2this@company.com',
      //You can use "html:" to send HTML email content. It's magic!
      html: `
      <b>Your request submitted is confirmed </b>
      <h1>${message}</h1>`,
      //You can use "text:" to send plain-text content. It's oldschool!

    }, (err, info) => {
      if (err) {
        console.log(`Error: ${err}`);
      }
      else {
        console.log(`Response: ${info}`);
      }
    });
    
}

app.post('/invites', async (req, res)=>{
    const messageBody= req.body;
    const receivedMessage = await userRequestMessage.insertOne(messageBody);
    console.log(receivedMessage)
    receivedClientMessage(messageBody)
    res.send(receivedMessage)
})

app.get('/invites', async(req, res)=>{
    const query = {}
    const received = await userRequestMessage.find(query).toArray()
    console.log(received)
    res.send(received)
})


run().catch((error)=> console.error(error))

app.listen(port, ()=>{
    console.log(`hello wold is running ${port}`)
})