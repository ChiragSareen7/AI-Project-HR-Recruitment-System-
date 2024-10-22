const express = require("express");
const router = express.Router();
const multer = require("multer");
const { spawn } = require("child_process");
const fs = require("fs");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed!"), false);
    }
    cb(null, true);
  },
});

router.post("/", upload.array("files"), (req, res) => {
  try {
    const filePaths = req.files.map((file) => file.path);
    const question = req.body.question;

    if (!question || !filePaths.length) {
      return res.status(400).send("No files or question provided.");
    }


    const python = spawn("python", ["demo.py", ...filePaths, question]);

    let aiResponse = "";

    python.stdout.on("data", (data) => {
      aiResponse += data.toString();
    });

    python.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    python.on("close", (code) => {

      filePaths.forEach((path) => fs.unlink(path, (err) => err && console.error(`Failed to delete ${path}:`, err)));

      if (code !== 0) {
        return res.status(500).send("Error processing the files.");
      }
      res.status(200).send({ aiResponse });
    });
  } catch (err) {
    console.error("Error uploading files:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
