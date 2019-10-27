const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const placesSchema = new Schema({
  name: String,
  type: { type: String, enum: ['coffee', 'shop', 'bookstore']},
  location: { type: { type: String }, coordinates: [Number] },
  picture: {type: mongoose.Schema.Types.ObjectId, ref: 'Picture' }
},
{
  timestamps: true,
})

const Place = mongoose.model('Place', placesSchema);

module.exports = Place;