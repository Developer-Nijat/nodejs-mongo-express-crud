const express = require("express");

module.exports = (Collection) => {
  // ======
  // Create
  // ======
  const create = (req, res) => {
    const newEntry = req.body;
    Collection.create(newEntry, (e, newEntry) => {
      if (e) {
        console.log("baseCrud.create error: ", e.message || e);
        res.status(400).send(e);
      } else {
        res.status(201).send(newEntry);
      }
    });
  };

  // =========
  // Read many
  // =========
  const readMany = (req, res) => {
    let query = req.query || {};

    Collection.find(query, (e, result) => {
      if (e) {
        console.log("baseCrud.find error: ", e.message || e);
        res.status(400).send(e);
      } else {
        res.status(200).send(result);
      }
    });
  };

  // ========
  // Read one
  // ========
  const readOne = (req, res) => {
    const { _id } = req.params;

    Collection.findById(_id, (e, result) => {
      if (e) {
        console.log("baseCrud.findById error: ", e.message || e);
        res.status(400).send(e);
      } else {
        res.status(200).send(result);
      }
    });
  };

  // ======
  // Update
  // ======
  const update = (req, res) => {
    const changedEntry = req.body;
    Collection.update({ _id: req.params._id }, { $set: changedEntry }, (e) => {
      if (e) {
        console.log("baseCrud.update error: ", e.message || e);
        res.status(400).send(e);
      } else {
        res.status(200).send({ message: "Successfully updated" });
      }
    });
  };

  // ======
  // Remove
  // ======
  const remove = (req, res) => {
    Collection.remove({ _id: req.params._id }, (e) => {
      if (e) {
        console.log("baseCrud.remove error: ", e.message || e);
        res.status(400).send(e);
      } else {
        res.status(200).send({ message: "Successfully deleted" });
      }
    });
  };

  // ======
  // Routes
  // ======

  let router = express.Router();

  router.post("/", create);
  router.get("/", readMany);
  router.get("/:_id", readOne);
  router.put("/:_id", update);
  router.delete("/:_id", remove);

  return router;
};
