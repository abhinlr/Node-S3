const Bucket = require('../models/Bucket');
const Object = require('../models/Object');
const {promisify} = require('util');
const fs = require("fs");
const {join} = require("node:path");
const unlinkAsync = promisify(fs.unlink);

const createBucket = async function (bucketData) {
    try {
        const {name, description, owner} = bucketData;

        const existingBucket = await Bucket.findOne({name , owner});
        if (existingBucket) {
            throw new Error('Bucket already exists');
        }

        const newBucket = new Bucket({name, description, owner});
        await newBucket.save();

        const bucketFolderPath = join(__dirname, '..', 'uploads', name);
        if (!fs.existsSync(bucketFolderPath)) {
            fs.mkdirSync(bucketFolderPath, { recursive: true });
        }

        return newBucket;
    } catch (err) {
        throw err;
    }
}

const getAllBuckets = async (owner) => {
    try {
        const buckets = await Bucket.find({owner});
        if (!buckets) {
            throw new Error('No buckets found');
        }
        return buckets;
    } catch (err) {
        throw err;
    }
};

const updateBucket = async (bucketId, bucketData) => {
    try {
        const updatedBucket = await Bucket.findByIdAndUpdate(bucketId, bucketData, {new: true});
        if (!updatedBucket) {
            throw new Error('No bucket found');
        }
        return updatedBucket;
    } catch (err) {
        throw err;
    }
}

const deleteBucket = async (bucketId) => {
    try {
        const bucket = await Bucket.findById(bucketId);
        if (!bucket) {
            throw new Error('No bucket found');
        }
        const objects = await Object.find({bucket: bucketId});
        await Promise.all(objects.map(async (object) => {
            await unlinkAsync(object.filePath);
        }));

        await Object.deleteMany({ bucket: bucketId });
        const bucketFolderPath = join(__dirname, '..', 'uploads', bucket.name);
        if (fs.existsSync(bucketFolderPath)) {
            fs.rmSync(bucketFolderPath, { recursive: true });
        }
        const deletedBucket = await Bucket.findByIdAndDelete(bucketId);
        return deletedBucket;
    } catch (err) {
        throw err;
    }
}


module.exports.createBucket = createBucket;
module.exports.getAllBuckets = getAllBuckets;
module.exports.updateBucket = updateBucket;
module.exports.deleteBucket = deleteBucket;