const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const Note = require('./models/Note');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

app.get('/', async (req, res) => {
	try {
		const note = await Note.find();
		res.json({
			success: true,
			count: note.length,
			data: note,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			msg: error.message,
		});
	}
});

app.get('/:id', async (req, res) => {
	try {
		const note = await Note.findById(req.params.id);

		if (!note) {
			return res.status(404).json({
				success: false,
				msg: `Note not found with id of ${req.params.id}`,
			});
		}

		res.json({
			success: true,
			data: note,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			msg: error.message,
		});
	}
});

app.post('/', async (req, res) => {
	try {
		const note = await Note.create(req.body);

		res.json({
			success: true,
			data: note,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			msg: error.message,
		});
	}
});

app.put('/:id', async (req, res) => {
	try {
		const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!note) {
			return res.status(404).json({
				success: false,
				msg: `Note not found with id of ${req.params.id}`,
			});
		}

		res.json({
			success: true,
			data: note,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			msg: error.message,
		});
	}
});

app.delete('/:id', async (req, res) => {
	try {
		const note = await Note.findByIdAndDelete(req.params.id);

		if (!note) {
			return res.status(404).json({
				success: false,
				msg: `Note not found with id of ${req.params.id}`,
			});
		}

		res.json({
			success: true,
			data: note,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			msg: error.message,
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