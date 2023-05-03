import { json } from "express";
import mongoose from "mongoose";
import Blog from "../model/Blog.js";
import User from "../model/User.js";

export  const getAllBlog = async(req  , res , next) =>{
    let blogs;
    try{
        blogs = await Blog.find().populate("user")
    }catch(err){
        console.log(err)
    }
    if(! Blog){
       return  res.status(400).json({message : "No Blog Find"});
    }
    return res.status(200).json({blogs})

}

export const addBlog = async(req , res , next)=> {
    const {title , description , image , user} = req.body;

    let existingUser;
    try{
        existingUser = await User.findById(user)
    }catch(err){
        return console.log(err)
    }
    if(! existingUser){
        return res.status(400).json({message : "Unable TO FIND USER BY ID "})
    }

    const blog = new Blog({
        title,
        description,
        image,
        user
    });
    try{
       const session = await mongoose.startSession();
       session.startTransaction();
       await blog.save({session});
       existingUser.blogs.push(blog);
       await existingUser.save({session})
       await session.commitTransaction();
    }catch(err){
      return  console.log(err)
      return res.status(500).json({message : err});
    }
    return res.status(200).json({blog})


}

export const updateBlog = async(req , res , next)=>{
    const {title , description} = req.body;
    const blogID = req.params.id;
    let blog;
    try{
        blog = await Blog.findByIdAndUpdate(blogID , {
        title,
        description
       })
    }catch(err){
        return console.log(err);
    }
    if(! blog){
        return res.status(500).json({message: "Unavailable blog post"})
    }
    return res.status(200).json({blog})
};

export const getById = async(req , res , next) =>{
    const blogID = req.params.id;
    let blog ;
    try{
        blog = await Blog.findById(blogID);
    }catch(err){
        return console.log(err);
    }
    if(! blog){
        return res.status(404).json({message : "No blog Found"})
    }
    return res.status(200).json({blog});
}

export const deleteBlog = async(req , res , next) => {
    const blogID = req.params.id;
    let blog;
    try{
       blog = await Blog.findByIdAndRemove(blogID).populate("user");
       await blog.user.blogs.pull(blog);
       await blog.user.save();
    }catch(err){
        return console.log(err)
    }
    if(! blog){
        return res.status(500).json({message : "No blog available by this id"})
    }
    return res.status(200).json({message : "Blog deleted successfully!!"});
}

export const getBlogByUserId = async(req , res , next) => {
    const userID = req.params.id;
    let userBlogs ;
    try{
        userBlogs = await User.findById(userID).populate("blogs");
    }catch(err){
        return console.log(err);
    }
    if(! userBlogs){
        return res.status(404).json({message : "No Blog Found of this User"});
    }
    return res.status(200).json({user:userBlogs})
}