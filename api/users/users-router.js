const express = require('express');
 const {
  validateUserId,
  validateUser,
  validatePost,
  
 } = require('../middleware/middleware');

const User = require('./users-model');
const Post = require('../posts/posts-model');


const router = express.Router();

router.get('/', (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  User.get()
    .then(users => {
      res.json(users)
    })
    .catch(next)
});

router.get('/:id', validateUserId, (req, res, next) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  // User.getById(req.user.id)
  //   .then()
  //   .catch(next)
  res.json(req.user)
});

router.post('/', validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECTx
  // this needs a middleware to check that the request body is valid
  User.insert({ name: req.name })
    .then(newUser => {
      res.status(201).json(newUser)
    })
    .catch(next)
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  User.update(req.params.id, { name: req.name })
    .then(() => {
      return User.getById(req.params.id)
    })
    .then(user => {
      res.json(user)
    })
    .catch(next)
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  try {
    await User.remove(req.params.id)
    res.json(req.user)
  } catch(err) {
    next(err)
  }
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  try {
    const result = await User.getUserPosts(req.params.id)
    res.json(result)
  } catch (err) {
    next(err)
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res, next) => {
  try {
    const result = await Post.insert({
      user_id: req.params.id,
      text: req.text,
    })
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    customMessage: 'the router just blew up in your face',
    message: err.message,
    stack: err.stack,
  })
})

// do not forget to export the router

module.exports = router;
