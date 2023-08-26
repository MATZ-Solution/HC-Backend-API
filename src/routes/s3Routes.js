const express = require("express");
const router = express.Router();

const upload = require("../controller/s3Controller");

const MultiUpload = upload.fields([
    { name: "image", maxCount: 1, required: false },
    { name: "video", maxCount: 1, required: false },
    { name: "doc", maxCount: 1, required: false },
    { name: "audio", maxCount: 1, required: false },

]);

router.post("/UploadDocumentToS3AndGetPublicUrl", function (req, res) {
    MultiUpload(req, res, function (err) {
        if (err) {
            return res.status(422).send({
                errors: [{ title: "File Upload Error", detail: err.message }],
            });
        }

        return res.json({
            image_url: (req.files["image"] && req.files["image"][0].location) || null,
            video_url: (req.files["video"] && req.files["video"][0].location) || null,
            doc_url: (req.files["doc"] && req.files["doc"][0].location) || null,
            audio_url: (req.files["audio"] && req.files["audio"][0].location) || null,
            success: true,
            message: "File uploaded successfully",
        });
    });
});

module.exports = router;