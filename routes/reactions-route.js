// routes/reaction-routes.js
const router = require('express').Router();
const {
  createReaction,
  deleteReaction,
} = require('../controllers/thoughtController');

// /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions')
  .post(createReaction);

// /api/thoughts/:thoughtId/reactions/:reactionId
router.route('/:thoughtId/reactions/:reactionId')
  .delete(deleteReaction);

module.exports = router;
