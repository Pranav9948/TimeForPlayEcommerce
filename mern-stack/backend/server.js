
const { createServer } = require("http");
const { Server } = require("socket.io");

const express = require("express");

const apiRouter = require("./routes/apiRoutes");

const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

const app = express();
const port = 5000;

const httpServer = createServer(app);
global.io = new Server(httpServer);


app.use(fileUpload());

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))

app.use("/api", apiRouter);

app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.error(error);
  }
  next(error);
});


app.set("view engine","ejs");

var nodemailer = require("nodemailer");

// mongoDB connection //

const connectDB = require("./config/db");

connectDB();

app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  } else {
    res.status(500).json({
      message: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));