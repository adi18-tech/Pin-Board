const Board = require('../models/Board');


// List all boards
module.exports.index = async (req, res) => {
  const boards = await Board.find().populate('user');
  res.render('boards/index', { boards });
};


// Show form to create new board
module.exports.renderNewForm = (req, res) => {
  res.render('boards/new');
};


// Create board
module.exports.createBoard = async (req, res) => {
  try {
    const { name, description } = req.body;

    const board = new Board({
      name,
      description,
      user: req.user._id
    });

    await board.save();

    req.flash('success', 'Board created successfully!');
    res.redirect('/boards');

  } catch (err) {
    console.error(err);

    req.flash('error', 'Failed to create board.');
    res.redirect('/boards');
  }
};


// Show edit form
module.exports.renderEditForm = async (req, res) => {
  const board = await Board.findById(req.params.id);

  res.render('boards/edit', { board });
};


// Update board
module.exports.updateBoard = async (req, res) => {
  try {
    const { name, description } = req.body;

    await Board.findByIdAndUpdate(req.params.id, {
      name,
      description
    });

    req.flash('success', 'Board updated successfully!');
    res.redirect('/boards');

  } catch (err) {
    console.error(err);

    req.flash('error', 'Failed to update board.');
    res.redirect('/boards');
  }
};


// Delete board
module.exports.deleteBoard = async (req, res) => {
  try {
    await Board.findByIdAndDelete(req.params.id);

    req.flash('success', 'Board deleted successfully!');
    res.redirect('/boards');

  } catch (err) {
    console.error(err);

    req.flash('error', 'Failed to delete board.');
    res.redirect('/boards');
  }
};


// Show single board
module.exports.showBoard = async (req, res) => {
  try {

    const board = await Board.findById(req.params.id)
      .populate('user')
      .populate({
        path: 'pins',
        populate: {
          path: 'user'
        }
      });

    if (!board) {
      req.flash('error', 'Board not found.');
      return res.redirect('/boards');
    }

    res.render('boards/show', { board });

  } catch (err) {
    console.error(err);

    req.flash('error', 'Server error loading board.');
    res.redirect('/boards');
  }
};