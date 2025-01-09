const express = require('express');
const Blog = require('../Model/blogmodel');
const bodyParser = require('body-parser');




//============Create Blog========================
const blogCreate = async (req, res, next) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//============Update Blog using id========================
const blogUpdate = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastEdited: Date.now() },
      { new: true }
    );
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//============Delete Blog using id========================
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//=============Get Pending Blogs=======================
const getPendingBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ status: 'Pending' });
    res.json(blogs);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
//=========Get Accepted Blogs===========================
const acceptedBlogs = async (req, res, next) => {
  try {
    const { pages, limit ,category} = req.body;

    let countBlogs;
    let blogs;

    if (typeof pages === 'number' && typeof limit === 'number') {
      (countBlogs = await Blog.countDocuments({ status: 'Accepted' ,category:category})),
        (blogs = await Blog.find({ status: 'Accepted' ,category:category })
          .skip(pages * limit)
          .limit(limit));
    } else {
      countBlogs = await Blog.countDocuments({ status: 'Accepted',category:category  });
      blogs = await Blog.find({ status: 'Accepted' ,category:category  });
    }

    res.status(200).json({
      count: countBlogs,
      blogs,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const getAllBlog = async (req, res, next) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getLatestBlog = async (req, res, next) => {
  try {
    const blogs = await Blog.find({status:"Accepted"}).sort({ createdAt: -1 }).limit(3);

    res.status(200).json(blogs);
  } catch (err) {
    next(err);
  }
};
const getacceptedBlogbyId=async(req,res,next)=>{
  const {id}=req.params
  try{
    const blogs=await Blog.findOne({_id:id,status:"Accepted"})
    res.status(200).json(blogs)
  }
  catch(err){
    next(err)
  }
}

// const getBlogsByCategory = async (req, res, next) => {
//   try {
//     const { category } = req.params; 

//     if (!category) {
//       return res.status(400).json({ error: "Category query parameter is required" });
//     }

//     const blogs = await Blog.find({ category });
//     res.status(200).json(blogs);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
module.exports = {
  blogCreate,
  getAllBlog,
  blogUpdate,
  deleteBlog,
  getPendingBlogs,
  acceptedBlogs,
  getLatestBlog,
  getacceptedBlogbyId,
  // getBlogsByCategory
};
