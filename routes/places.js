const express = require("express");
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const isOwner = require("../middleware/is-owner");
const router = express.Router();
const { body } = require("express-validator/check");

router.get("/", isAuth, adminController.getPlaces);

router.get("/:placeId", adminController.getPlace);

router.post(
  "/",
  isAuth,
  isOwner,
  [
    body("title").trim().isLength({ min: 3 }),
    body("description").trim().isLength({ min: 3 }),
    body("suprafata").trim().isLength({ min: 1 }),
    body("country").trim().isLength({ min: 3 }),
    body("city").trim().isLength({ min: 1 }),
    body("street").trim().isLength({ min: 1 }),
    body("number").trim().isLength({ min: 1 }),
    body("occupied").trim().isLength({ min: 1 }),
  ],
  adminController.createPlace
);

router.put(
  "/:placeId",
  isAuth,
  isOwner,
  [
    body("title").trim().isLength({ min: 3 }),
    body("description").trim().isLength({ min: 3 }),
    body("suprafata").trim().isLength({ min: 1 }),
    body("country").trim().isLength({ min: 1 }),
    body("city").trim().isLength({ min: 1 }),
    body("street").trim().isLength({ min: 1 }),
    body("number").trim().isLength({ min: 1 }),
    body("occupied").trim().isLength({ min: 1 }),
  ],
  adminController.editPlace
);

router.delete(
    "/:placeId",
    isAuth,
    isOwner,
    adminController.deletePlace
)


module.exports = router;
