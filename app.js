const express=require('express');
const dotenv=require('dotenv');
const bodyParser = require('body-parser');
const authrouter=require('./routes/authRoutes');
const cors = require('cors');

dotenv.config();
const app=express();
app.use(bodyParser.json());
app.use(cors());

app.use('/api',authrouter);

const port=process.env.port
app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})