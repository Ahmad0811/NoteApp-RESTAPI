const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
	note: {
		type: String,
		required: [true, 'Please add a note'],
	},
});

module.exports = mongoose.model('Note', NoteSchema);
