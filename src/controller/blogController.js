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
        const blogs = await Blog.find({ status: 'Accepted' });
        res.json(blogs);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
};
const getAllBlog = async (req, res, next) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
};
module.exports = {
    blogCreate,
    getAllBlog,
    blogUpdate,
    deleteBlog,
    getPendingBlogs,
    acceptedBlogs
};