import express from "express";
import dotenv from "dotenv";

import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import { connectDb } from "./lib/connectDb.js";

dotenv.config();

const app = express();

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.listen(3001, () => {
  connectDb(); //Make Db Connection
  console.log("Express Server Running on port 3001");
});
