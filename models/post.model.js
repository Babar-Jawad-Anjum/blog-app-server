import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    // User who created post
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    img: { type: String },
    title: { type: String, require: true },
    slug: { type: String, require: true, unique: true },
    desc: { type: String },
    content: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    visit: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
