const express = require("express");
const adminController = require("../controllers/admin");
const isAdmin = require("../middleware/is-admin");
const isAuth = require("../middleware/is-auth");
const router = express.Router();
const { body } = require("express-validator/check");

router.get("/", isAuth, adminController.getCategories);

router.get("/:categoryId", isAuth, adminController.getCategory);

router.post("/", isAuth, isAdmin, 
    [
        body("title").trim().isLength({min: 3}),
        body("description").trim().isLength({min: 3})
    ],
    adminController.addCategory
);

router.put(
    "/:categoryId",
    isAuth,
    isAdmin,
    [
        body("title").trim().isLength({min: 3}),
        body("description").trim().isLength({min: 3}),
    ],
    adminController.editCategory
);

router.delete(
    "/:categoryId",
    isAuth,
    isAdmin,
    adminController.deleteCategory
);

module.exports = router;
  