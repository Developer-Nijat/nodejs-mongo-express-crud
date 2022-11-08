const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = `uploads/${req?.body?.folder || "general"}`;

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    cb(null, directory);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${Date.now()}-${file.fieldname || "file"}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] === "png") {
    cb(null, true);
  } else {
    cb(new Error("Not a PNG File!!"), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

router.post("/single", upload.single("file"), uploadSingleFile);
router.post("/multi", upload.array("files"), uploadMultiFiles);

function uploadSingleFile(req, res) {
  res.json({ message: "Successfully uploaded file", data: req.file });
}

function uploadMultiFiles(req, res) {
  res.json({ message: "Successfully uploaded files", data: req.files });
}

module.exports = router;
