import Comment from "../models/comment.model.js";

export const getPostComments = async (req, res) => {
  const { postId } = req.params;

  const comments = await Comment.find({ post: postId })
    .populate("user", "username img")
    .sort({ createdAt: -1 });

  res.status(200).json(comments);
};

export const addComment = (req, res) => {};
export const deleteComment = (req, res) => {};
