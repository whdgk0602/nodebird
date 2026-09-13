const express = require('express');

const { isLoggedIn } = require('../middlewares');
const { doubleCsrfProtection } = require('../middlewares/csrf');
const { follow } = require('../controllers/user');

const router = express.Router();

// POST /user/:id/follow
router.post('/:id/follow', isLoggedIn, doubleCsrfProtection, follow);

module.exports = router;