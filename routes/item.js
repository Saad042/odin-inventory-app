var express = require('express');
var router = express.Router();

const item_controller = require('../controllers/itemController');

router.get('/create', item_controller.item_create_get);
router.post('/create', item_controller.item_create_post);
router.get('/:id/', item_controller.item_detail);
router.get('/:id/update', item_controller.item_update_get);
router.post('/:id/update', item_controller.item_update_post);
router.get('/:id/delete', item_controller.item_delete_get);
router.post('/:id/delete', item_controller.item_delete_post);

module.exports = router;
