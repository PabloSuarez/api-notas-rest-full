var mongoose = require('mongoose'),
	Schema = mongoose.Schema

var noteSchema = new Schema({
	title: 'string',
	description: 'string',
	type: 'string',
	body: 'string',
	id: 'string'
})

// noteSchema.set('toJSON', {
// 	transform: function (doc, ret, options) {
// 		delete ret._id
// 		delete ret.__v
// 	}
// })

module.exports = mongoose.model('nota', noteSchema)
