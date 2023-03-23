const { default: mongoose } = require("mongoose");
const Article = require("../model/Article");
const User = require("../model/User");

const getAllArticles = async (req, res) => {
  const articles = await Article.find();
  if (!articles) return res.status(204).json({ message: "No article present" });
  res.json(articles);
};

const createNewArticle = async (req, res) => {
  const { title, content } = req.body;
  const { user } = req.params;

  if (!title || !content) {
    return res
      .status(400)
      .json({ message: "Username, title and content are required" });
  }

  let existingUser;

  try {
    existingUser = await User.findById(user);
  } catch (err) {
    return console.log(err);
  }

  if (!existingUser) {
    return res.status(400).json({ message: "User most be login" });
  }
  const article = new Article({
    title,
    content,
    user,
  });

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await article.save({ session });
    existingUser.articles.push(article);
    await existingUser.save({ session });
    await session.commitTransaction();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  return res.status(201);
};

const updateArticle = async (req, res, next) => {
  const { title, content } = req.body;
  const { userId } = req.query.userId;
  const { Id } = req.params.Id;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: Id, userId: userId },
      { $set: req.body },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({
        message: "Blog not found or you are not authorized to update it",
      });
    }

    return res.status(200).json({ message: "Blog updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteArticle = async (req, res) => {
  const Id = req.params.Id;
  const userId = req.query.userId;

  try {
    // Check if blog post exists
    const blogPost = await Article.findOne({ _id: Id, userId });
    if (!blogPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    // Delete the blog post
    await Article.deleteOne({ _id: Id, userId });
    res.json({ success: "Blog post deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

const getArticleById = async (req, res) => {
  const id = req?.params?.id;
  if (!id) return res.status(400);
  const article = await Article.findById(id);
  if (!article) {
    return res.status(404);
  }
  res.status(200).json(article);
};

module.exports = {
  getAllArticles,
  createNewArticle,
  updateArticle,
  deleteArticle,
  getArticleById,
};
