const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const Category = require('../models/category');
const Item = require('../models/item');

exports.item_create_form = asyncHandler(async (req, res) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();
  res.render('item/item_form', {
    title: 'Create Item',
    categories: allCategories,
  });
});

exports.item_validator = [
  body('name', 'Item name must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('description', 'Item description must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('category', 'Category must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('category', 'Category must not be empty.').trim().exists().escape(),
  body('price', 'Price must not be empty.')
    .trim()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive value')
    .escape(),
  body('number_in_stock', 'Number in stock must not be empty.')
    .trim()
    .isInt({ min: 0 })
    .withMessage('Number in stock must be a positive whole number')
    .escape(),
];

exports.item_create = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  const { name, description, category, price, number_in_stock } = req.body;
  const item = new Item({
    name,
    description,
    category,
    price,
    number_in_stock,
  });

  if (!errors.isEmpty()) {
    res.render('item/item_form', {
      title: 'Create item',
      item: item,
      errors: errors.array(),
    });
  } else {
    const itemExists = await Item.findOne({ name: req.body.name })
      .collation({ locale: 'en', strength: 2 })
      .exec();
    if (itemExists) {
      res.redirect(itemExists.url);
    } else {
      await item.save();
      res.redirect(item.url);
    }
  }
});

exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id)
    .populate('category', 'name')
    .exec();
  console.log(item.category);

  if (item === null) {
    const err = new Error('Item not found');
    err.status = 404;
    return next(err);
  }

  res.render('item/item_detail', {
    title: item.name,
    item: item,
  });
});

exports.item_update_form = asyncHandler(async (req, res, next) => {
  const [item, allCategories] = [
    await Item.findById(req.params.id),
    await Category.find().sort({ name: 1 }).exec(),
  ];

  if (item === null) {
    const err = new Error('Item not found');
    err.status = 404;
    return next(err);
  }

  res.render('item/item_form', {
    title: item.name,
    item: item,
    categories: allCategories,
  });
});

exports.item_update = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  const { name, description, category, price, number_in_stock } = req.body;
  const item = new Item({
    name,
    description,
    category,
    price,
    number_in_stock,
    _id: req.params.id,
  });

  if (!errors.isEmpty()) {
    res.render('item/item_form', {
      title: 'Update item',
      item: item,
      errors: errors.array(),
    });
  } else {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, item);
    res.redirect(updatedItem.url);
  }
});

exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();
  if (item === null) {
    const err = new Error('Item not found');
    err.status = 404;
    return next(err);
  }

  res.render('item/item_delete', {
    title: 'Delete item',
    item: item,
  });
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();

  const { key } = req.body;

  if (item === null) {
    const err = new Error('Item not found');
    err.status = 404;
    return next(err);
  }
  if (key === process.env.SECRET_KEY) {
    await Item.findByIdAndDelete(req.params.id).exec();
    res.redirect('/');
  } else res.redirect(req.baseUrl + '/' + req.url);
});
