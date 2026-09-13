const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { afterUploadImage, uploadPost } = require('../controllers/post');
const { isLoggedIn } = require('../middlewares');
const { doubleCsrfProtection } = require('../middlewares/csrf');

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// POST /post/img (AJAX upload, CSRF token arrives via the x-csrf-token header)
router.post('/img', isLoggedIn, doubleCsrfProtection, upload.single('img'), afterUploadImage);

// POST /post (multipart form submit, CSRF token arrives as a "_csrf" field -
// doubleCsrfProtection must run after multer parses the multipart body)
const uploadNone = multer();
router.post('/', isLoggedIn, uploadNone.none(), doubleCsrfProtection, uploadPost);

module.exports = router;