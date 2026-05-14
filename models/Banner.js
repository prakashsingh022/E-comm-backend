const mongoose = require('mongoose');

const bannerSchema = mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
        },
        image: {
            type: String,
            required: [true, 'Please add a banner image'],
        },
        link: {
            type: String,
            default: '/',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Banner', bannerSchema);
