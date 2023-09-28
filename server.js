const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
 // Insert the seed data into the database
 const User = require('./models/User'); 
 const Thought = require('./models/Thoughts'); 
 const seeds = require('./seeds.json'); 

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/social-network', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');

  
  mongoose.connection.db.collection('users').drop()
    .then(() => {
      console.log('Users collection dropped');

     
      return mongoose.connection.db.collection('thoughts').drop();
    })
    .then(() => {
      console.log('Thoughts collection dropped');

      
      return Promise.all([
        User.insertMany(seeds.users),
        Thought.insertMany(seeds.thoughts),
      ]);
    })
    .then(() => {
      console.log('Data seeded successfully');
      
    })
    .catch((err) => {
      console.error('Error seeding data:', err);
      
    });
});


const userRoutes = require('./routes/user-routes');
const thoughtRoutes = require('./routes/thought-route');
const reactionRoutes = require('./routes/reactions-route');

app.use('/api/users', userRoutes);
app.use('/api/thoughts', thoughtRoutes);
app.use('/api/thoughts/:thoughtId/reactions', reactionRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
