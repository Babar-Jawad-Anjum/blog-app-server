import Post from "../models/post.model.js";

export const getPosts = async (req, res) => {
  const posts = await Post.find();
  res.status(200).send(posts);
};

export const getPost = async (req, res) => {
  const { slug } = req.params;
  const post = await Post.findOne({ slug });
  res.status(200).send(post);
};

export const createPost = async (req, res) => {
  const newPost = new Post(req.body);
  const post = await newPost.save();
  res.status(201).send(post);
};

export const deletePost = async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.status(200).send("Post Deleted");
};
