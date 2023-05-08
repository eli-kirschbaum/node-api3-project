const User = require('../users/users-model');


function logger(req, res, next) {
  console.log('logger middleware ')
  //console.log(`A ${req.method} request was made`)]
  const timestamp = new Date().toLocaleString();
  const method = req.method;
  const url = req.originalUrl;
  console.log(`[${timestamp}] ${method} to ${url}`);
  next()
}

async function validateUserId(req, res, next) {
  try {
    console.log('things')
    const user = await User.getById(req.params.id)
    if (!user) {
      res.status(404).json({
        message: 'user not found',
      })
    }
    else {
      req.user = user
      next()
    }
  } catch (err) {
    res.status(500).json({
      message: 'error finding user',
    })
  }
}

  
function validateUser(req, res, next) {
  const { name } = req.body
  if (!name || !name.trim()) {
    res.status(400).json({
      message: 'missing required name field',
    })
  } else {
    req.name = name.trim()
    next()
  }
}

function validatePost(req, res, next) {
  console.log('validatePost middleware ')
  if (!req.body.text) {
    res.status(400).json({
      message: "missing required text field"
    })
  } else {
    next()
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}