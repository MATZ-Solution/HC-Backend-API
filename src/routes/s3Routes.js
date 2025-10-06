
  const express = require('express');
  const router = express.Router();

  const upload = require('../controller/s3Controller');
const { deleteFromS3 } = require('../utils/S3delete');

  const MultiUpload = upload.fields([
    { name: 'image', maxCount: 1, required: false },
    { name: 'video', maxCount: 1, required: false },
    { name: 'doc', maxCount: 1, required: false },
    { name: 'audio', maxCount: 1, required: false },
  ]);

router.post('/UploadDocumentToS3AndGetPublicUrl', function (req, res) {
  MultiUpload(req, res, async function (err) {
    if (err) {
      return res.status(422).send({
        success: false,
        message: err.message,
      });
    }

    try {
      // ✅ If updating profile, delete old image if provided
      if (req.body.oldFileUrl) {
        await deleteFromS3(req.body.oldFileUrl);
      }

      return res.json({
        image_url: (req.files['image'] && req.files['image'][0].location) || null,
        video_url: (req.files['video'] && req.files['video'][0].location) || null,
        doc_url: (req.files['doc'] && req.files['doc'][0].location) || null,
        audio_url: (req.files['audio'] && req.files['audio'][0].location) || null,
        success: true,
        message: 'File uploaded successfully',
      });
    } catch (error) {
      console.error('S3 error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error while deleting/uploading file',
      });
    }
  });
});

  module.exports = router;