
const express = require("express");
const router = express.Router();
const blogController = require("../controllers/Blogs.controller");
const { requireAdmin } = require("../middlewares/auth.middlewares");


// "/user"

// get all

router.get("/", requireAdmin, blogController.getAllBlogs);

// get one by id:
router.get("/:id", blogController.getAllBlogsId);

// Create one buy id

router.post("/", blogController.createBlogs);

// Update one buy id

router.put("/:id", blogController.updateBlogs);

// Delete one buy id

router.delete("/:id", blogController.deleteBlogs);



// admin



module.exports = router;

