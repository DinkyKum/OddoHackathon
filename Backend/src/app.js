const express= require('express');
const app= express();
const mongoose = require("mongoose");
require("./config/database");


require('dotenv').config()

require('dotenv').config()

// require('./utils/cronjob');

const connectDB=require("./config/database")
const cookieParser=require('cookie-parser');
const cors=require('cors')

const authRouter = require('./routes/auth');
const profileRouter= require('./routes/profile');
const requestRouter= require('./routes/request');
const userRouter=require('./routes/user');
const adminRouter = require('./routes/admin');  
const port=process.env.PORT;

app.use(express.json())
app.use(cookieParser())

const isVercel = !!process.env.VERCEL; 

const allowedOrigins = ["http://localhost:5174", "http://localhost:5173", "https://oddo-hackathon.vercel.app"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET,POST,PATCH,PUT,DELETE,OPTIONS",
    credentials: true,
  })
);

app.use(async (req, res, next) => {
  if (mongoose.connection.readyState === 0) {
    try {
      await connectDB();
    } catch (err) {
      console.error("Database Connection Failed:", err);
      return res.status(500).json({ error: "Database Connection Failed" });
    }
  }
  next();
});

// Base Route
app.get("/", (req, res) => {
  res.send("All is Well!");
});


if (isVercel) {
  module.exports = async (req, res) => {
    try {
      if (mongoose.connection.readyState === 0) await connectDB();
      return app(req, res);
    } catch (err) {
      console.error("Vercel API Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
} else {
  // Local Development Mode
  connectDB()
    .then(() => {
      console.log("MongoDB Connected Successfully");
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    })
    .catch((err) => {
      console.error("Cannot connect to DB:", err);
      process.exit(1);
    });
}


app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);
app.use('/admin', adminRouter);








