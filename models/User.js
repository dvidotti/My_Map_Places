const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  myplaces: [{type: mongoose.Schema.Types.ObjectId, ref: 'Places'}]
},
{
  timestamps: true,
})

const User = mongoose.model('User', userSchema);

module.exports = User;