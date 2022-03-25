const mongoose = require('mongoose');

const wardenSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    block: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Block',
    },
    mobileNumber: {
        type: Number,
        required: true,
        maxLength: 10
    },
    mail: {
        type: String,  
        required: true,
    },
    pendingOutings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Outing',
    }],
    approvedOutings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Outing',
    }],


})


const Warden = mongoose.model('Warden', wardenSchema);

module.exports = Warden;