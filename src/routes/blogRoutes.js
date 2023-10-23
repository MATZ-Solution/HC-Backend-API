const express = require('express');
const {
  blogCreate,
  getAllBlog,
  blogUpdate,
  deleteBlog,
  getPendingBlogs,
  acceptedBlogs,
  getLatestBlog,
} = require('../controller/blogController');
const { verifyTokenAndAdmin } = require('../middleware/verifytokens');
const router = express.Router();

router.route('/createblog').post(blogCreate);
router.route('/getallblogs').get(getAllBlog);
router.route('/updateblog/:id').put(blogUpdate);
router.route('/deleteblog/:id').delete(deleteBlog);
router.route('/pendingblog').get(getPendingBlogs);
router.route('/acceptedblog').post(acceptedBlogs);
router.route('/getLatestBlog').get(getLatestBlog);
// router.put('/:id', blogUpdate);
// router.delete('/:id', deleteBlog);
// router.get('/pending', getPendingBlogs);
// router.get('/accepted', acceptedBlogs);

module.exports = router;
