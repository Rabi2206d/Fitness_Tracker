import express from 'express';
import ConnectToMongo from "./Database/db.js";

const app = express();
app.use(express.json())
const portNumber = 4000;
ConnectToMongo();

app.listen(portNumber, ()=>
{
    console.log(`The Server is Running On Port Number ${portNumber}`);
})