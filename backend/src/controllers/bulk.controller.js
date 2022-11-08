const express = require("express");
const { Joke } = require("../utils/models");
const router = express.Router();

router.post("/jokes-bulk-insert", async (req, res, next) => {
  try {
    const jokes = req.body;

    await Joke.insertMany(jokes, (error, docs) => {
      if (docs) {
        res
          .status(200)
          .json({ success: true, message: "jokes-bulk-insert success" });
      }
      if (error) {
        console.log("insertMany error: ", error);
        res.status(400).json({
          success: false,
          error: error,
          message: "jokes-bulk-insert failed",
        });
      }
    });
  } catch (err) {
    console.error("jokes-bulk-insert error: ", err);
    res.status(500).json({ success: false, message: "internal_server_error" });
  }
});

router.post("/jokes-bulk-update", async (req, res, next) => {
  try {
    const jokes = req.body;

    const promises = jokes.map(async (item) => {
      const res = await Joke.findByIdAndUpdate(item._id, {
        $set: { ...item },
      });

      return res;
    });

    Promise.all(promises)
      .then(() =>
        res.json({ success: true, message: "jokes-bulk-update success" })
      )
      .catch((err) => res.status(400).json(err));
  } catch (err) {
    console.error("jokes-bulk-update error: ", err);
    res.status(500).json({ success: false, message: "internal_server_error" });
  }
});

module.exports = router;
