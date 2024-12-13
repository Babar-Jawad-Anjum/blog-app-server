import express from "express";
import dotenv from "dotenv";

import { connectDb } from "./lib/connectDb.js";

import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import webHooksRouter from "./routes/webhook.route.js";
import { clerkMiddleware } from "@clerk/express";

dotenv.config();

const app = express();

app.use(clerkMiddleware());

app.use("/api/webhooks", webHooksRouter); // place before express.json() middleware to avoid conflicts
app.use(express.json());

app.get("/auth-state", (req, res) => {
  const authState = req.auth;

  res.json(authState);
});

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);

//Base route
app.get("/", (req, res) => {
  res.send("Sever is running!");
});

//Error handler middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500);

  res.json({
    message: error.message || "Something went wrong!",
    status: error.status || 500,
    stack: error.stack,
  });
});

//Default router handler

app.listen(3001, () => {
  connectDb(); //Make Db Connection
  console.log("Express Server Running on port 3001");
});
