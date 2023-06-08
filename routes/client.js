const express = require("express");
const clientController = require("../controllers/client");
const isAuth = require("../middleware/is-auth");
const isOwner = require("../middleware/is-owner");
const router = express.Router();
const { body } = require("express-validator/check");
const isAdmin = require("../middleware/is-admin");

router.get("/", isAuth, clientController.getClients);

router.get("/:clientId", isAuth, clientController.getClient);

router.post(
  "/",
  isAuth,
  isOwner,
  [
    body("userId").trim().isLength({ min: 1 }),
    body("placeId").trim().isLength({ min: 1 }),
  ],
  clientController.createClient
);

router.put(
  "/:clientId",
  isAuth,
  clientController.editClient
);

router.delete(
    "/:clientId",
    isAuth,
    isOwner,
    clientController.deleteClient
)


module.exports = router;
