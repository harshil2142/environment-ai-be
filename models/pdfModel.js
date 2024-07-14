const mongoose = require('mongoose');

// Define the schema for the history collection
const pdfSchema = new mongoose.Schema({
    latest_pdfUrl : {
        type : String,
        required : true,
    }
},
    {
        timestamps: true,
    }
);

const PdfUrl = mongoose.model('Pdf', pdfSchema);

module.exports = PdfUrl;
