const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const Category = require('../models/category');
const Item = require('../models/item');

exports.category_list = asyncHandler(async (req, res) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();
  res.render('category/category_list', {
    title: 'Categories List',
    category_list: allCategories,
  });
});

exports.category_create_form = (req, res) => {
  res.render('category/category_form', {
    title: 'Create Category',
  });
};

exports.category_validator = [
  body('name', 'Category name must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),

  body('description', 'Category description must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),
];

exports.category_create = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  const category = new Category({
    name: req.body.name,
    description: req.body.description,
  });

  if (!errors.isEmpty()) {
    res.render('category/category_form', {
      title: 'Create Category',
      category: category,
      errors: errors.array(),
    });
  } else {
    const categoryExists = await Category.findOne({ name: req.body.name })
      .collation({ locale: 'en', strength: 2 })
      .exec();
    if (categoryExists) {
      res.redirect(categoryExists.url);
    } else {
      await category.save();
      res.redirect(category.url);
    }
  }
});

exports.category_detail = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (category === null) {
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }

  res.render('category/category_detail', {
    title: category.name,
    category: category,
  });
});

exports.category_update_form = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (category === null) {
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }

  res.render('category/category_form', {
    title: category.name,
    category: category,
  });
});

exports.category_update = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  const category = new Category({
    name: req.body.name,
    description: req.body.description,
    _id: req.params.id,
  });

  if (!errors.isEmpty()) {
    res.render('category/category_form', {
      title: 'Update Category',
      category: category,
      errors: errors.array(),
    });
  } else {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      category,
    );
    res.redirect(updatedCategory.url);
  }
});

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, allItemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, 'name description').exec(),
  ]);

  if (category === null) {
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }

  res.render('category/category_delete', {
    title: 'Delete Category',
    category: category,
    category_items: allItemsInCategory,
  });
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  if (category === null) {
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }

  await Promise.all([
    Category.findByIdAndDelete(req.params.id).exec(),
    Item.deleteMany({ category: req.params.id }).exec(),
  ]);

  res.redirect('/');
});

exports.category_items_list = asyncHandler(async (req, res, next) => {
  const [category, allItemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, 'name description').exec(),
  ]);
  if (category === null) {
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }

  res.render('category/category_items', {
    title: 'View',
    category: category,
    category_items: allItemsInCategory,
  });
});
