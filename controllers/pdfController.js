const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const generateToken = require("../config/generateToken");
const { paginatedArray } = require("../helper/pagination");
const PdfUrl = require("../models/pdfModel");
const { sendSuccessResponse, sendErrorResponse } = require("../helper/utils");

const fetchPdfUrl = asyncHandler(async (req, res) => {
    try {

        const pdf_url = await PdfUrl.find();
        if(pdf_url.length > 0){
            sendSuccessResponse(res, { pdf_name :  pdf_url[0].latest_pdfUrl})
        }

    } catch (error) {
        sendErrorResponse(res, error.message)
    }
})

const updatePdfUrl = asyncHandler(async (req, res) => {
  try {
    const { pdf_name } = req.body;

    if (!pdf_name) {
      return sendErrorResponse(res, 'latest_pdfUrl is required', 400);
    }

    // Find all documents and update them
    const result = await PdfUrl.updateMany(
      {},
      { $set: { latest_pdfUrl: pdf_name } },
      { new: true, upsert: true }
    );

    if (result.modifiedCount > 0 || result.upsertedCount > 0) {
      sendSuccessResponse(res, { message: 'PDF URL updated successfully', pdf_name });
    } else {
      sendSuccessResponse(res, { message: 'No changes were made', pdf_name });
    }
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
});

module.exports = {
    fetchPdfUrl,updatePdfUrl,
}