const Board = require('../models/Board');
const Pin = require('../models/Pin');

const { uploadToCloudinary } = require('../config/cloudinary');


// ===== NEW PIN FORM =====
module.exports.newPinForm = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);

    if (!board) {
      req.flash('error', 'Board not found');
      return res.redirect('/boards');
    }

    res.render('pins/new', { board });

  } catch (err) {
    console.log(err);
    req.flash('error', 'Server error while loading form');
    res.redirect('/boards');
  }
};


// ===== CREATE PIN =====
module.exports.createPin = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);

    if (!board) {
      req.flash('error', 'Board not found');
      return res.redirect('/boards');
    }

    let imageUrl = null;

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "pins",
        true
      );

      imageUrl = result;
    }

    const pin = new Pin({
      title: req.body.title,
      description: req.body.description,
      image: imageUrl,
      board: board._id,
      user: req.user._id
    });

    await pin.save();

    board.pins.push(pin._id);

    await board.save();

    req.flash('success', 'Pin added successfully');

    res.redirect(`/boards/${board._id}`);

  } catch (err) {
    console.log(err);

    req.flash('error', 'Failed to add pin');

    res.redirect(`/boards/${req.params.boardId}`);
  }
};


// ===== SHOW PIN =====
module.exports.showPin = async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.pinId)
      .populate('board');

    if (!pin) {
      req.flash('error', 'Pin not found');

      return res.redirect(`/boards/${req.params.boardId}`);
    }

    res.render('pins/show', {
      pin,
      boardId: req.params.boardId
    });

  } catch (err) {
    console.log(err);

    req.flash('error', 'Server error while loading pin');

    res.redirect(`/boards/${req.params.boardId}`);
  }
};


// ===== EDIT PIN FORM =====
module.exports.editPinForm = async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.pinId);

    if (!pin) {
      req.flash('error', 'Pin not found');

      return res.redirect(`/boards/${req.params.boardId}`);
    }

    res.render('pins/edit', {
      pin,
      boardId: req.params.boardId
    });

  } catch (err) {
    console.log(err);

    req.flash('error', 'Server error');

    res.redirect(`/boards/${req.params.boardId}`);
  }
};


// ===== UPDATE PIN =====
module.exports.updatePin = async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.pinId);

    if (!pin) {
      req.flash('error', 'Pin not found');

      return res.redirect(`/boards/${req.params.boardId}`);
    }

    pin.title = req.body.title;
    pin.description = req.body.description;

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "pins",
        true
      );

      pin.image = result;
    }

    await pin.save();

    req.flash('success', 'Pin updated successfully');

    res.redirect(`/boards/${req.params.boardId}`);

  } catch (err) {
    console.log(err);

    req.flash('error', 'Failed to update pin');

    res.redirect(`/boards/${req.params.boardId}`);
  }
};


// ===== DELETE PIN =====
module.exports.deletePin = async (req, res) => {
  try {

    const { boardId, pinId } = req.params;

    await Board.findByIdAndUpdate(
      boardId,
      {
        $pull: { pins: pinId }
      }
    );

    await Pin.findByIdAndDelete(pinId);

    req.flash('success', 'Pin deleted successfully');

    res.redirect(`/boards/${boardId}`);

  } catch (err) {
    console.log(err);

    req.flash('error', 'Failed to delete pin');

    res.redirect(`/boards/${req.params.boardId}`);
  }
};