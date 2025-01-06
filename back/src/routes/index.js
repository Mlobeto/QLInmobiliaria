const { Router } = require("express");

const router = Router();

router.use("/admin", require("./admin"));
router.use("/auth", require("./auth"));
router.use("/client", require("./client"));
router.use("/lease", require("./lease"));
router.use("/payment", require("./payment"));
router.use("/clientRole", require("./clientWithRole"))
router.use("/property", require("./property"));
router.use("/garantor", require("./garantor"));


module.exports = router;
