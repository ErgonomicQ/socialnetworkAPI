const Thought = require('../models/Thoughts');
const User = require('../models/User')



const thoughtController = {
  getAllThoughts: async (req, res) => {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      console.error(err)
      res.status(500).json(err);
    }
  },

  getThoughtById: async (req, res) => {
    try {
      const thoughtId = req.params.thoughtId;
      const thought = await Thought.findById(thoughtId);

      if (!thought) {
        return res.status(404).json({ message: 'Thought not found' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  createThought: async (req, res) => {
    try {
      const { thoughtText, username, userId } = req.body;

      // Check if the user exists
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const thought = await Thought.create({ thoughtText, username });

      // Push the created thought's _id to the associated user's thoughts array field
      user.thoughts.push(thought._id);
      await user.save();

      res.status(201).json(thought);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  updateThought: async (req, res) => {
    try {
      const thoughtId = req.params.thoughtId;
      const updatedThought = await Thought.findByIdAndUpdate(
        thoughtId,
        req.body,
        { new: true }
      );

      if (!updatedThought) {
        return res.status(404).json({ message: 'Thought not found' });
      }

      res.json(updatedThought);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  deleteThought: async (req, res) => {
    try {
      const thoughtId = req.params.thoughtId;

      // Find the thought's associated user
      const thought = await Thought.findById(thoughtId);

      if (!thought) {
        return res.status(404).json({ message: 'Thought not found' });
      }

      const userId = thought.username; // Username of the user who created the thought

      // Remove the thought from the user's thoughts array
      await User.findByIdAndUpdate(userId, { $pull: { thoughts: thoughtId } });

      // Delete the thought
      await Thought.findByIdAndDelete(thoughtId);

      res.json({ message: 'Thought deleted successfully' });
    } catch (err) {
      res.status(400).json(err);
    }
  },


  createReaction: async (req, res) => {
    try {
      const thoughtId = req.params.thoughtId;
      const { reactionBody, username } = req.body;

      // Find the thought by its ID
      const thought = await Thought.findById(thoughtId);
     

      if (!thought) {
        return res.status(404).json({ message: 'Thought not found' });
      }

      // Add the reaction to the thought's reactions array
      thought.reactions.push({ reactionBody, username });
      await thought.save();

      res.status(201).json(thought);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  deleteReaction: async (req, res) => {
    try {
      const { thoughtId, reactionId } = req.params;

      // Find the thought by its ID
      const thought = await Thought.findById(thoughtId);

      if (!thought) {
        return res.status(404).json({ message: 'Thought not found' });
      }

      // Remove the reaction from the thought's reactions array by reactionId
      thought.reactions = thought.reactions.filter(
        (reaction) => reaction._id.toString() !== reactionId
      );
      await thought.save();

      res.json({ message: 'Reaction removed successfully' });
    } catch (err) {
      res.status(400).json(err);
    }
  },
};


module.exports = thoughtController;
