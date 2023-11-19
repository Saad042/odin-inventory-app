const item_handler = require('../handlers/itemHandler');

exports.item_create_get = item_handler.item_create_form;

exports.item_create_post = [
  item_handler.item_validator,
  item_handler.item_create,
];

exports.item_detail = item_handler.item_detail;

exports.item_update_get = item_handler.item_update_form;

exports.item_update_post = [
  item_handler.item_validator,
  item_handler.item_update,
];

exports.item_delete_get = item_handler.item_delete_get;

exports.item_delete_post = item_handler.item_delete_post;
