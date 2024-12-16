import ImageKit from "imagekit";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import * as dotenv from "dotenv";
dotenv.config();

export const getPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;

  const posts = await Post.find()
    .populate("user", "username")
    .limit(limit)
    .skip((page - 1) * limit);

  const totalPosts = await Post.countDocuments();
  const hasMore = page * limit < totalPosts;

  res.status(200).json({ hasMore, posts });
};

export const getPost = async (req, res) => {
  const { slug } = req.params;
  const post = await Post.findOne({ slug }).populate("user", "username img");
  res.status(200).json(post);
};

export const createPost = async (req, res) => {
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) res.status(401).json("Not Authenticated");

  const user = await User.findOne({ clerkUserId });

  if (!user) res.status(401).json("User not exist");

  const slug = req.body.title?.replace(/ /g, "-")?.toLowerCase();

  let existingSlug = await Post.findOne({ slug });

  let counter = 2;
  while (existingSlug) {
    slug = `${slug}-${counter}`;
    existingSlug = await Post.findOne({ slug });
    counter++;
  }
  const newPost = new Post({ user: user._id, slug, ...req.body });
  const post = await newPost.save();
  res.status(201).send(post);
};

export const deletePost = async (req, res) => {
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) res.status(401).json("Not Authenticated");

  const user = await User.findOne({ clerkUserId });

  if (!user) res.status(401).json("User not exist");

  const deletedPost = await Post.findByIdAndDelete({
    _id: req.params.id,
    user: user._id,
  });

  if (!deletedPost)
    return res.status(403).json("You can delete only your posts!");

  res.status(200).send("Post Deleted");
};

const imageKit = new ImageKit({
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

export const uploadAuth = async (req, res) => {
  var result = imageKit.getAuthenticationParameters();
  res.send(result);
};
