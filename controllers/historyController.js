const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const generateToken = require("../config/generateToken");
const { paginatedArray } = require("../helper/pagination");
const History = require("../models/historyModel");
const { sendSuccessResponse, sendErrorResponse } = require("../helper/utils");
require("dotenv").config();


const ipAddress = process.env.IP_ADDRESS;

const createHistory = asyncHandler(async (req, res) => {
    try {
        const { userId, prompt, pdfUrl } = req.body;

        try {

            const resp = await axios.post(`http://${ipAddress}:8000/query`, {
                pdf_name: pdfUrl,
                query: prompt,
            })
            
            if (resp?.data) {
                const history = await History.create({
                    summary: "",
                    userId,
                    pdfUrl: "",
                    history: [
                        {
                            prompt,
                            response: resp?.data?.response,
                            pdfName: "",
                        }
                    ]
                })

                await history.populate('userId');

                if (history) {
                    sendSuccessResponse(res, {
                        history
                    })
                }
            }
        } catch (error) {
            sendErrorResponse(res, error?.response?.data);
        }
    } catch (error) {
        sendErrorResponse(res, error.message);
    }
});

const updateHistory = asyncHandler(async (req, res) => {
    try {
        const { historyId, prompt, pdfUrl } = req.body;

        const history = await History.findById(historyId)

        if (!history) {
            sendErrorResponse(res, "History not found", 404)
        }
        try {

            const resp = await axios.post(`http://${ipAddress}:8000/query`, {
                pdf_name: pdfUrl,
                query: prompt,
            })


            history.history.push({ prompt, response: resp?.data?.response, pdfName: "" });
            await history.save();

            sendSuccessResponse(res, {
                history
            })
        } catch (error) {
            sendErrorResponse(res, error?.response?.data)
        }
    } catch (error) {
        sendErrorResponse(res, error.message);
    }
});

const fetchHistory = asyncHandler(async (req, res) => {
    try {
        const { userId, page, size } = req.query;

        const history = await History.find({ userId });

        if (!history || history.length === 0) {
            sendSuccessResponse(res, { data: [] });
        }

        sendSuccessResponse(res, paginatedArray(history, page, size));
    } catch (error) {
        sendErrorResponse(res, error.message);
    }
});

const getSummury = asyncHandler(async (req, res) => {

    try {
        const { pdfData } = req.body;

        if (pdfData?.length > 0) {
            try {
                const resp = await axios.post(`http://${ipAddress}:8000/summarize`, {
                    pdf_files: pdfData
                })
                if (resp?.data) {
                    sendSuccessResponse(res, { pdf_name: resp?.data?.pdf_name })
                }
            } catch (error) {
                sendErrorResponse(res, error.message, 400)
            }
        }
    } catch (error) {
        sendErrorResponse(res, error.message);
    }
});

const getPageNumber = asyncHandler(async (req, res) => {
    try {
        const { pdfUrl, response } = req.body;

        const resp = await axios.post(`http://${ipAddress}/page_no`, {
            pdf_name: pdfUrl,
            response,
        });

        if (resp?.data) {
            sendSuccessResponse(res, { pageNo: resp?.data?.page_number });
        }
    } catch (error) {
        sendErrorResponse(res, error.message);
    }
});

module.exports = {
    createHistory,
    updateHistory,
    fetchHistory,
    getSummury,
    getPageNumber,
};
