import express from "express";
const router = express.Router();
import multer from "multer";

const base = "http://" + process.env.DOMAIN_BASE + ":" + process.env.PORT + "/";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/");
  },
  filename: function (req, file, cb) {
    const ext = file.originalname
      .split(".")
      .filter(Boolean) // removes empty extensions (e.g. `filename...txt`)
      .slice(1)
      .join(".");
    cb(null, Date.now() + "." + ext);
  },
});
const upload = multer({ storage: storage });

router.post("/", upload.single("file"), (req, res) => {
  console.log("Received a POST request to /file");
  console.log("Request body:", req.body); // Log incoming body data
  console.log("Uploaded file:", req.file); // Log file data after multer processes it

  if (req.file) {
    console.log("File uploaded successfully:", base + req.file.path);
    res.status(200).send({ url: base + req.file.path });
  } else {
    console.error("File upload failed, no file received");
    res.status(400).send({ error: "File upload failed" });
  }
});

export = router;
