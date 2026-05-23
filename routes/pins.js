const express = require('express');
const router = express.Router({ mergeParams: true });

const upload = require('../config/multer');

const {
  newPinForm,
  createPin,
  showPin,
  editPinForm,
  updatePin,
  deletePin
} = require('../Controller/pinController');

const { isLoggedIn, isPinOwner } = require('../middlware');

// NEW PIN FORM
router.get('/new', isLoggedIn, newPinForm);

// CREATE PIN
router.post(
  '/',
  isLoggedIn,
  upload.single('image'),
  createPin
);

// SHOW PIN
router.get('/:pinId', isLoggedIn, showPin);

// EDIT FORM
router.get(
  '/:pinId/edit',
  isLoggedIn,
  isPinOwner,
  editPinForm
);

// UPDATE PIN
router.put(
  '/:pinId',
  isLoggedIn,
  isPinOwner,
  upload.single('image'),
  updatePin
);

// DELETE PIN
router.delete(
  '/:pinId',
  isLoggedIn,
  isPinOwner,
  deletePin
);

module.exports = router;