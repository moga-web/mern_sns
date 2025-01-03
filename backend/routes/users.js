const router = require("express").Router();
const User = require("../models/User");
// CRUD
// ユーザーの更新
router.put("/:id", async(req,res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
      res.status(200).json("user has been updated");
    } catch (err) {
      res.status(500).json(err);
    }
  }else{
    return res.status(403).json("you can update only your account");
  }
})
// ユーザーの削除
router.delete("/:id", async(req,res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("user has been deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  }else{
    return res.status(403).json("you can delete only your account");
  }
})
// ユーザーの取得
router.get("/:id", async (req,res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, isAdmin, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
})

// ユーザーのフォロー
router.put("/:id/follow", async (req,res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you already follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(500).json("you can't follow yourself");
  }
})

// ユーザーのフォロー解除
router.put("/:id/unfollow", async (req,res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you don't unfollow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(500).json("you can't unfollow yourself");
  }
})

module.exports = router;
