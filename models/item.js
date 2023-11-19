const mongoose = require('mongoose');

const { Schema } = mongoose;

const itemSchema = new Schema({
  name: Schema.Types.String,
  description: Schema.Types.String,
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  price: Schema.Types.Number,
  number_in_stock: Schema.Types.Number,
});

itemSchema.virtual('url').get(function () {
  return `/item/${this._id}`;
});

module.exports = mongoose.model('Item', itemSchema);
