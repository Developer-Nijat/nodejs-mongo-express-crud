const express = require("express");
const router = express.Router();
const models = require("./../utils/models");

// Api Routes
router.use("/swagger", require("src/helpers/swagger"));
router.use("/jokes", require("src/helpers/base.crud")(models.Joke));
router.use("/books", require("src/helpers/base.crud")(models.Book));
router.use("/accounts", require("src/collections/account/account.controller"));

module.exports = router;
