const { AddHandler, PutHandler, DeleteHandler, SignHandler, GetHandler, VerifiedHandler } = require("../controller/controller");

const router = require("express").Router();

const validate = require('../../../common/middleware/validate');
const Auth = require('../../../common/middleware/auth');

const { AddUserSchema, SignUserSchema } = require("../Joi/UserValidation");

router.get("/user", Auth(), GetHandler)
router.get("/user/verified/:token", VerifiedHandler)

router.post("/user", validate(AddUserSchema), AddHandler)
router.post("/auth", validate(SignUserSchema), SignHandler)

router.put("/user/:id", PutHandler)

router.delete("/user", DeleteHandler)

module.exports = router;