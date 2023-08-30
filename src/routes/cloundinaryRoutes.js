const express = require("express");
const router = express.Router();

const upload = require("../controller/cloundinaryController");

const MultiUpload = upload.fields([
  { name: "image", maxCount: 10, required: false },
  { name: "video", maxCount: 10, required: false },
  { name: "doc", maxCount: 10, required: false },
  { name: "audio", maxCount: 10, required: false },
]);

router.post("/UploadDocumentToCloudinaryAndGetPublicUrl", function (req, res) {
  MultiUpload(req, res, function (err) {
    if (err) {
      return res.status(422).send({
        errors: [{ title: "File Upload Error", detail: err.message }],
      });
    }

    const image_url = req.files["image"] ? req.files["image"].map(file => file.path) : null;

    const video_url = req.files["video"] ? req.files["video"].map(file=>file.path) : null;

    const doc_url = req.files["doc"] ? req.files["doc"].map(file=>file.path) : null;

    const audio_url = req.files["audio"] ? req.files["audio"].map(file=>file.path) : null;

    return res.json({
      image_url,
      video_url,
      doc_url,
      audio_url,
      success: true,
      message: "File uploaded successfully",
    });
  });
});

module.exports = router;
