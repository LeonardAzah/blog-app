const { default: mongoose } = require("mongoose");
const Article = require("../model/Article");
const User = require("../model/User");

const getAllArticles = async (req, res) => {
  const articles = await Article.find();
  if (!articles) return res.status(204).json({ message: "No article present" });
  res.json(articles);
};

const createNewArticle = async (req, res) => {
  const { title, content, user } = req.body;

  if (!title || !content || !user) {
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
  console.log("user exist");
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
  const { title, content, user } = req.body;
  const { bloggerId } = req.query;
  const { blogId } = req.params;

  if (!title || !content || !user) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: blogId, bloggerId: bloggerId },
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
  const { user } = req.body;

  const id = req.params.id;

  if (!id) return res.status(400);
  let article;
  article = await Article.findById(id);
  const userId = article.user.toString();
  if (userI === user) {
    try {
      article = await Article.findByIdAndRemove(id).populate("user");
      await article.user.articles.pull(article);
      await article.user.save();
    } catch (err) {
      return res.status(500).json({ message: "Error" });
    }
  } else {
    res.status(401).json({ message: "You can delete only your post!" });
  }

  res.status(200).json({ message: "Blog deleted successfully" });
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
