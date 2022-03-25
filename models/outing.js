const mongoose = require('mongoose');

const outingSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['local', 'non-local'],
    },
    desc: {
        type: String,
        required: true,
    },
    requestedOn: {
        type: Date,
        required: true,
    },
    approvedOn: {
        type: Date,
        default: null,
    },
    usedOn: {
        type: Date,
        default: null,
    },
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    },
    // requestedTo: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Warden'
    // }
})



const Outing = mongoose.model('Outing', outingSchema);

module.exports = Outing;