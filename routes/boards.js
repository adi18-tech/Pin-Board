const express = require('express');
const router = express.Router();

const boardController = require('../Controller/boardController');

const { isLoggedIn, isBoardOwner } = require('../middlware');


// -------------------- Boards Routes --------------------


// List all boards
router.get('/', boardController.index);


// Form to create new board
router.get(
  '/new',
  isLoggedIn,
  boardController.renderNewForm
);


// Create board
router.post(
  '/',
  isLoggedIn,
  boardController.createBoard
);


// Form to edit board
router.get(
  '/:id/edit',
  isLoggedIn,
  isBoardOwner,
  boardController.renderEditForm
);


// Update board
router.put(
  '/:id',
  isLoggedIn,
  isBoardOwner,
  boardController.updateBoard
);


// Delete board
router.delete(
  '/:id',
  isLoggedIn,
  isBoardOwner,
  boardController.deleteBoard
);


// Show single board
router.get(
  '/:id',
  boardController.showBoard
);


module.exports = router;