const mongoose = require("mongoose");
const router = require("express").Router();

router.get("/get/:modelName", (req, res, next) => {
  const modelName = req.params.modelName;
  const response = {}
  try {
    const data = mongoose.model(modelName).schema.paths;
    response.data = data;
    response.message = "Success";
    response.status = 200;
  } catch (err) {
    response.status = 500;
    response.error = err.message;
    response.message = "Internal Server Error";
  }

  res.status(response.status).json(response);
});

module.exports = router;
