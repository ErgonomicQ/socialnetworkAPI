const { User, Thought } = require('../models');

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getUserById: async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId)
        .populate('thoughts')
        .populate('friends');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  createUser: async (req, res) => {
    try {
      const { username, email } = req.body;
      const user = await User.create({ username, email });
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  updateUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        req.body,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(updatedUser);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      
      // Bonus - Remove a user's associated thoughts when deleted
      await Thought.deleteMany({ username: userId });

      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User and associated thoughts deleted' });
    } catch (err) {
      res.status(400).json(err);
    }
  },

  addFriend: async (req, res) => {
    try {
      const { userId, friendId } = req.params;

      // Check if the user and friend IDs exist
      const user = await User.findById(userId);
      const friend = await User.findById(friendId);

      if (!user || !friend) {
        return res.status(404).json({ message: 'User or friend not found' });
      }

      // Check if the friend is already in the user's friend list
      if (user.friends.includes(friendId)) {
        return res.status(400).json({ message: 'Friend is already in the list' });
      }

      // Add the friend to the user's friend list
      user.friends.push(friendId);
      await user.save();

      res.json({ message: 'Friend added successfully' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  removeFriend: async (req, res) => {
    try {
      const { userId, friendId } = req.params;

      // Check if the user exists
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if the friend is in the user's friend list
      if (!user.friends.includes(friendId)) {
        return res.status(400).json({ message: 'Friend not found in the list' });
      }

      // Remove the friend from the user's friend list
      user.friends = user.friends.filter((friend) => friend.toString() !== friendId);
      await user.save();

      res.json({ message: 'Friend removed successfully' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = userController;
