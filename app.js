require("dotenv").config()
const express = require("express")
const app = express()

const cors = require('cors')
app.use(cors())

const morgan = require("morgan");
app.use(morgan("dev"));

const apiRouter = require("./api");
const client = require("./db/client");

app.use(express.json());

app.use("/api", apiRouter);

client.connect();

// Setup your Middleware and API Router here
app.use((error, req, res, next) => {
    res.send({
      name: error.name,
      message: error.message,
      error: error.message
    });
  });

module.exports = app;
