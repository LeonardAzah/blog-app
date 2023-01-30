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

const updateArticle = async (req, res) => {
  const { title, content, user } = req.body;

  const blogId = req.params.id;

  if (!title || !content || !user) {
    return res.status(400).json({ message: "Title and content are required" });
  }
  if (!blogId) {
    return res.status(400);
  }

  const article = await Article.findById(blogId);
  const userId = article.user.toString();
  if (userId === user) {
    try {
      const article = await Article.findByIdAndUpdate(blogId, {
        title,
        content,
      });
    } catch (err) {
      return res.status(500).json({ message: "Unable to update article" });
    }
  } else {
    res.status(401).json({ message: "You can update only your post!" });
  }

  return res.status(200).json({ message: "Blog updated successfully!" });
};

const deleteArticle = async (req, res) => {
  const { user } = req.body;

  const id = req.params.id;

  if (!id) return res.status(400);
  let article;
  article = await Article.findById(id);
  const userId = article.user.toString();
  if (userId === user) {
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
