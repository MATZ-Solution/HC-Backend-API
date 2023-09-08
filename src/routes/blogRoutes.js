const express = require('express');
const { blogCreate, blogUpdate, deleteBlog, getPendingBlogs, acceptedBlogs } = require('../controller/blogController');
const { verifyTokenAndAdmin } = require("../middleware/verifytokens");
const router = express.Router();

router.route('/create').post(blogCreate);
router.route('/:id').put(blogUpdate);
router.route('/:id').delete(deleteBlog);
router.route('/pending').get(getPendingBlogs);
router.route('/accepted').get(acceptedBlogs);
// router.put('/:id', blogUpdate);
// router.delete('/:id', deleteBlog);
// router.get('/pending', getPendingBlogs);
// router.get('/accepted', acceptedBlogs);

module.exports = router;