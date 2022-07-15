const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');

const book_uploadSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        },
        publisher: {
            type: String,
            required: true
        },
        edition: {
            type: String,
            required: true
        },
        year: {
            type: String,
            required: true
        },
        isbn: {
            type: String,
            required: true
        },
        binding: {
            type: String,
            required: true
        },
        pages: {
            type: String,
            required: true
        },
        language: {
            type: String,
            required: true
        },
        mrp: {
            type: Number,
            required: true

        },
        discount: {
            type: String,
            required: true
        },
        cost: {
            type: Number,
            required: true
        },
        front: {
            type: String,
            required: true
        },
        back: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        classes: {
            type: String,
            required: true
        },
        bookCategories: {
            type: String,
            required: true
        },
        sellerName: {
            type: String,
            required: true
        },
        sellerPhone: {
            type: String,
            required: true
        },
        aadhar: {
            type: String,
            required: true
        },
        paymentMode: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        status: {
            type: String,
        }

    }, { timestamps: true }
);

const bookRegistraion = new mongoose.model('Book', book_uploadSchema)

module.exports = bookRegistraion;
