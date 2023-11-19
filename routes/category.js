var express = require('express');
var router = express.Router();

const category_controller = require('../controllers/categoryController');

router.get('/', category_controller.index);
router.get('/categories', category_controller.category_list);
router.get('/category/create', category_controller.category_create_get);
router.post('/category/create', category_controller.category_create_post);
router.get('/category/:id/', category_controller.category_detail);
router.get('/category/:id/update', category_controller.category_update_get);
router.post('/category/:id/update', category_controller.category_update_post);
router.get('/category/:id/delete', category_controller.category_delete_get);
router.post('/category/:id/delete', category_controller.category_delete_post);
router.get('/category/:id/items', category_controller.category_items_list);

module.exports = router;
