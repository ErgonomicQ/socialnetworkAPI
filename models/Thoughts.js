const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Reaction subdocument schema
const reactionSchema = new Schema({
    reactionId: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAt) => {
        // Format the timestamp in ISO format
        return new Date(createdAt).toISOString();
      },
    },
  });
  

const thoughtSchema = new Schema({
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAt) => {
        // Format the timestamp in ISO format
        return new Date(createdAt).toISOString();
      },
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema], // Array of nested reaction documents
  });
  
  // Create a virtual called reactionCount to retrieve the length of reactions array, ideally.
  thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
  });
  
  const Thought = mongoose.model('Thought', thoughtSchema);
  
  module.exports = Thought;