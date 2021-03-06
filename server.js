const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const helmet = require('helmet');
const expressSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const Note = require('./models/Note');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

app.use(expressSanitize());

app.use(helmet());

app.use(xss());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// @route   GET /
// @desc    Get Documentation
// @access  Public
app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const getLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 15
});

// @route   GET /api/
// @desc    Get all notes
// @access  Public
app.get('/api/', getLimiter, async (req, res) => {
  try {
    const note = await Note.find();

    if (note.length > 100) {
      await Note.deleteMany();
    }

    res.json({
      success: true,
      count: note.length,
      data: note
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: error.message
    });
  }
});

// @route   GET /api/:id
// @desc    Get note by id
// @access  Public
app.get('/api/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        msg: `Note not found with id of ${req.params.id}`
      });
    }

    res.json({
      success: true,
      data: note
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: error.message
    });
  }
});

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10
});

// @route   POST /api
// @desc    Create a note
// @access  Public
app.post('/api/', limiter, async (req, res) => {
  try {
    const notes = await Note.find();
    if (notes.length > 100) {
      await Note.deleteMany();
    }

    await Note.create(req.body);

    res.json({
      success: true
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: error.message
    });
  }
});

// @route   PUT /api/:id
// @desc    Update note by id
// @access  Public
app.put('/api/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        msg: `Note not found with id of ${req.params.id}`
      });
    }

    res.json({
      success: true,
      data: note
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: error.message
    });
  }
});

// @route   GET /api/:id
// @desc    Delete note by id
// @access  Public
app.delete('/api/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        msg: `Note not found with id of ${req.params.id}`
      });
    }

    res.json({
      success: true,
      data: note
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server running on port ${PORT}`);
  }
});
