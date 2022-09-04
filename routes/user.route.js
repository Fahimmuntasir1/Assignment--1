const express = require('express');
const {getAllUsers, getRandomUser , postUser, updateUser, bulkUpdate, deleteUser} = require('../controller/user.controller');
const router = express.Router()

//routes
router.route("/random").get(getRandomUser);
router.route("/all").get(getAllUsers);
router.route("/save").post(postUser);
router.route("/update").patch(updateUser);
router.route("/bulk-update").patch(bulkUpdate);
router.route("/delete").delete(deleteUser);

module.exports = router