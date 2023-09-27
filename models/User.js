const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
  },
  thoughts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Thought',
    },
  ],
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

// Define indexes for username and email fields
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

const User = mongoose.model('User', userSchema);

module.exports = User;
