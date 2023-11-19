const category_handler = require('../handlers/categoryHandler');

exports.index = (req, res) => {
  res.redirect('/categories');
};

exports.category_list = category_handler.category_list;

exports.category_create_get = category_handler.category_create_form;

exports.category_create_post = [
  category_handler.category_validator,
  category_handler.category_create,
];

exports.category_detail = category_handler.category_detail;

exports.category_update_get = category_handler.category_update_form;

exports.category_update_post = [
  category_handler.category_validator,
  category_handler.category_update,
];

exports.category_delete_get = category_handler.category_delete_get;

exports.category_delete_post = category_handler.category_delete_post;

exports.category_items_list = category_handler.category_items_list;
