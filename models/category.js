const mongoose = require('mongoose');

const { Schema } = mongoose;

const categorySchema = new Schema({
  name: Schema.Types.String,
  description: Schema.Types.String,
});

categorySchema.virtual('url').get(function () {
  return `/category/${this._id}`;
});

module.exports = mongoose.model('Category', categorySchema);
