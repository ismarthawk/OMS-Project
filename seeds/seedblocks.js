const mongoose = require('mongoose');
const Block = require('../models/block');

mongoose.connect('mongodb://localhost:27017/OMS', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })


    const seedBlocks = [
        {
            name: 'Godavari',
            isFor: 'boys',
            warden:[]
        },
        {
            name: 'Indravathi',
            isFor: 'boys',
            warden:[]
        },
        {
            name: 'Sabari',
            isFor: 'boys',
            warden:[]
        },
        {
            name: 'Krishnaveni',
            isFor: 'girls',
            warden:[]
        },
        {
            name: 'Thungabadhra',
            isFor: 'girls',
            warden:[]
        },
]


Block.insertMany(seedBlocks)
    .then(res => {
        console.log(res)
    })
    .catch(e => {
        console.log(e)
    })