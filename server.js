require("rootpath")();
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { graphqlHTTP } = require('express-graphql');

// Custom Imports
const errorHandler = require("src/middleware/error-handler");
const graphqlService = require("src/services/graphql.service");

// Initial Config
const app = express();
const port = process.env.SERVER_PORT || 4000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// allow cors requests from any origin and with credentials
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);

// Database configuration
require("src/utils/database");

// Api Routes
app.get('/', (req, res) => res.json("Server working..."))
app.use('/api/v1', require('src/helpers/router'));
app.use("/auth", require("src/controllers/auth.controller"));
app.use("/upload", require("src/helpers/upload"));
app.use('/graphql', graphqlHTTP({
  schema: graphqlService.schema,
  rootValue: graphqlService.resolver,
  graphiql: true,
}));
app.get('*', (req, res) => res.status(404).json("API route not found"));

// Global error handler
app.use(errorHandler);

// Start server
app.listen(port, () => console.log(`Server listening on port ${port}`));
