const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const { fetchPdfUrl, updatePdfUrl } = require("../controllers/pdfController");

const router = express.Router();

router.get("/get", protect, fetchPdfUrl);
router.patch("/update", updatePdfUrl);

module.exports = router;
