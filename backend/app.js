const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express(); //app is a object on which middleware will be registered

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/places", placesRoutes); //middleware

app.use("/api/users", usersRoutes);

//below middleware will only run if no response is sent above for a request
app.use((req, res, next) => {
  //error handling for unsupported routes
  const error = new HttpError("Could not find a route", 404);
  throw error; //this will now reach default error handler and send a response
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    //checking if response has already been sent
    return next(error); //we will forward the error because only one response can be sent for one request
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});

mongoose
  .connect(
    "mongodb+srv://msanskriti24:sanskriti@cluster0.n24tdwm.mongodb.net/mern?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
