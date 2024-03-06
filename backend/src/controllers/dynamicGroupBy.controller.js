const express = require("express");
const mongoose = require("mongoose");
const queryBuilder = require("../helpers/query-builder");
const router = express.Router();

const dynamicModels = new Map();

const getDynamicModel = (collectionName) => {
  if (!dynamicModels.has(collectionName)) {
    dynamicModels.set(collectionName, mongoose.model(collectionName));

    // if not working try below code
    // mongoose.model(collectionName, new mongoose.Schema({}))
  }

  return dynamicModels.get(collectionName);
};

router.post("/single", async (req, res) => {
  try {
    const { collectionName, groupByKey, ...filters } = req.body;
    const dynamicModel = getDynamicModel(collectionName);
    const pipeline = [];

    if (Object.keys(filters).length) {
      const query = queryBuilder(filters);
      const match = {};
      for (const key in query) {
        match[key] = query[key];
      }
      pipeline.push({ $match: match });
    }
    pipeline.push({ $group: { _id: `$${groupByKey}`, count: { $sum: 1 } } });

    const result = await dynamicModel.aggregate(pipeline);
    res.json({ collectionName, result });
  } catch (error) {
    console.log("single error: ", error);
    res.status(500).json({ error });
  }
});

router.post("/nested", async (req, res) => {
  try {
    const {
      collectionName,
      nestedCollectionName,
      groupByKey,
      groupByChildKey,
      ...filters
    } = req.body;
    const dynamicModel = getDynamicModel(collectionName);
    const pipeline = [];
    if (Object.keys(filters).length) {
      const query = queryBuilder(filters);
      const match = {};
      for (const key in query) {
        match[key] = query[key];
      }
      pipeline.push({ $match: match });
    }

    pipeline.push({
      $lookup: {
        from: nestedCollectionName,
        localField: groupByKey,
        foreignField: "_id",
        as: "nestedDoc",
      },
    });

    pipeline.push({ $unwind: "$nestedDoc" });

    pipeline.push({
      $group: {
        _id: `$nestedDoc.${groupByChildKey}`,
        count: { $sum: 1 },
      },
    });

    const result = await dynamicModel.aggregate(pipeline);
    res.json({ collectionName, result });
  } catch (error) {
    console.log("nested error:", error);
    res.status(500).json({ error });
  }
});

module.exports = router;
