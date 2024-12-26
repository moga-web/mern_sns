const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//投稿の作成
router.post("/",async (req,res) => {
  const newPost = await Post(req.body);
  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (err) {
    return res.status(500).json(err);
  }
})
//投稿の編集
router.put ("/:id", async (req, res) => {
  try{
    const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId){
      await post.updateOne({$set: req.body});
      return res.status(200).json("post has been updated");
    }else{
      return res.status(403).json("you can update only your post");
    }
  }catch(err){
    return res.status(403).json(err);
  }
})
//投稿の削除
router.delete("/:id", async (req, res) => {
  try{
    const post = await Post.findById(req.params.id);
    if(post.userId.id === req.body.userId){
      await post.deleteOne();
      return res.status(200).json("post has been deleted");
    }else{
      return res.status(403).json("you can delete only your post");
    }
  }catch(err){
    return res.status(500).json(err);
  }
})
//投稿の取得
router.get("/:id", async (req, res) => {
  try{
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
  }catch(err){
    return res.status(500).json(err);
  }
})

//投稿のいいね
router.put("/:id/like", async (req,res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("post has been unliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
})
//タイムラインの投稿を取得
router.get("/timeline/all", async (req, res) => {
  try{
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({userId: currentUser._id});
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({userId: friendId});
      })
    )
    return res.status(200).json(userPosts.concat(...friendPosts));
  }catch(err){
    return res.status(500).json(err);
  }
})

module.exports = router;
