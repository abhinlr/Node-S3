const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const BucketSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        default: '',
    },
    owner: {
        type: ObjectId,
        required: true,
        ref: 'User',
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

const Bucket = mongoose.model('Bucket', BucketSchema);

module.exports = Bucket;
