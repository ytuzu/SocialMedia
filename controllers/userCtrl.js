const Users = require("../models/userModel");
const {validFullName} = require("../utils/Validate");

const userCtrl = {
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id)
        .select("-password")
        .populate("followers following friends", "-password");

      if (!user) {
        return res.status(400).json({ msg: "Không có tài khoản này" });
      }

      if (user.role === "admin") {
        return res.status(400).json({ msg: "Bạn không có quyền xem tài khoản này" });
      }

      if (user.status === false) {
        return res.status(400).json({ msg: "Tài khoản này bị khóa" });
      }

      res.json({ user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  searchUser: async (req, res) => {
    try {
      let users = await Users.find({
        username: { $regex: req.query.username },
      })
        .limit(10)
        .select("fullName username avatar role status");

      users = users.filter(user => user.role !== "admin");
      res.json({ users });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { avatar, fullName, story, website, gender } = req.body;
      if (validFullName(fullName)) {
        return res.status(400).json({ msg: validFullName(fullName) });
      }

      await Users.findOneAndUpdate(
        { _id: req.user._id },
        { avatar, fullName, story, website, gender }
      );

      res.json({ msg: "Cập nhật thông tin thành công" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  follow: async (req, res) => {
    try {
      const user = await Users.find({_id: req.params.id, followers: req.user._id})
      if(user.length > 0) return res.status(500).json({msg: "Bạn đã follow user này"})

      const newUser = await Users.findOneAndUpdate({_id: req.params.id}, {
        $push: {followers: req.user._id}
      }, {new: true}).populate("followers following", "-password")

      await Users.findOneAndUpdate({_id: req.user._id}, {
        $push: {following: req.params.id}
      }, {new: true})

      res.json({newUser})

    } catch (err) {
      return res.status(500).json({msg: err.message})
    }
  },
  unfollow: async (req, res) => {
    try {

      const newUser = await Users.findOneAndUpdate({_id: req.params.id}, {
        $pull: {followers: req.user._id}
      }, {new: true}).populate("followers following", "-password")

      await Users.findOneAndUpdate({_id: req.user._id}, {
        $pull: {following: req.params.id}
      }, {new: true})

      res.json({newUser})

    } catch (err) {
      return res.status(500).json({msg: err.message})
    }
  },

  suggestionsUser: async (req, res) => {
    try {
      const newArr = [...req.user.following, req.user._id];

      const num = req.query.num || 10;
      let users = await Users.aggregate([
        { $match: { _id: { $nin: newArr } } },
        { $sample: { size: Number(num) } },
        {
          $lookup: {
            from: "users",
            localField: "followers",
            foreignField: "_id",
            as: "followers",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "following",
            foreignField: "_id",
            as: "following",
          },
        },
      ]).project("-password");

      users = users.filter(user => user.role !== "admin");
      return res.json({
        users,
        result: users.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = userCtrl;
