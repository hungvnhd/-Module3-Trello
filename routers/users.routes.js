const express = require("express");
const router = express.Router();
const userController = require("../controllers/users.controller")
const blogController = require ("../controllers/blogs.controller")
const {requireAdmin} = require("../middlewares/auth.middlewares")
// "/user"

// get all

router.get("/", requireAdmin, userController.getAll);

// get one by id:
router.get("/:id", userController.getAllId);

// get all blogs by id:
router.get("/:id/blogs", blogController.getBlogsByUserId);


// get all upload by id
router.get("/:id/upload", blogController.getUploadUserById);


// Create one buy id

router.post("/", userController.createUsers);

// Update one buy id

router.put("/:id", userController.updateUsers);

// Delete one buy id

router.delete("/:id",requireAdmin, userController.deleteUsers);



// admin



module.exports = router;
