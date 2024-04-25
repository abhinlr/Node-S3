const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const ObjectSchema = new mongoose.Schema({
    bucket: {
        type: ObjectId,
        required: true,
        ref: 'Bucket',
    },
    fileName: {
        type: String,
        required: true,
    },
    filePath: {
        type: String,
        required: true,
    },
    metadata: {
        type: {},
        default: {},
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});


const Object = mongoose.model('Object', ObjectSchema);

module.exports = Object;
