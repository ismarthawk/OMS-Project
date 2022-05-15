const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    isFor: { //boys or girls
        type: String,
        enum:['boys','girls'],
        required: true,
    },
    wardens: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warden',
    }],
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    }],
})



const Block = mongoose.model('Block', blockSchema);

module.exports = Block;