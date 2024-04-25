const fs = require('fs');
const path = require('path');
const Object = require('../models/Object');
const Bucket = require('../models/Bucket');
const {promisify} = require('util');
const unlinkAsync = promisify(fs.unlink);

const uploadObject = async function (data) {
    try {
        const {bucket} = data;
        const existingBucket = await Bucket.findById(bucket);
        if (!existingBucket) {
            throw new Error('Bucket not found');
        }
        const file = data.file;
        const filePath = path.join(__dirname, '../uploads/', file.filename);
        const newFilePath = path.join(__dirname, '../uploads/', existingBucket.name, file.filename);
        fs.rename(filePath, newFilePath, (err) => {
            if (err) throw err;
        })
        const newObject = new Object({
            bucket: bucket,
            fileName: file.originalname,
            filePath: newFilePath,
            metadata: {
                mimetype: file.mimetype,
                size: file.size,
            },
        });
        const object = await newObject.save();
        return object;

    } catch (error) {
        throw error;
    }
}

const getObject = async function (objectId) {
    try {
        const object = await Object.findById(objectId);
        if (!object) {
            throw new Error('Object not found');
        }
        return object;
    } catch (error) {
        throw error;
    }
}

const listObjects = async function (bucket) {
    try {
        const objects = await Object.find({bucket});
        if (!objects) {
            throw new Error('Bucket not found or empty');
        }
        return objects;
    } catch (error) {
        throw error;
    }
}

const updateObject = async function (objectId, data) {
    try {
        const object = await Object.findById(objectId).populate('bucket');
        if (!object) {
            throw new Error('Object not found');
        }
        if (data.file) {
            await unlinkAsync(object.filePath);
            const filePath = path.join(__dirname, '../uploads/', object.bucket.name , data.file.filename);
            object.fileName = data.file.originalname;
            object.filePath = filePath;
            object.metadata = {
                mimetype: data.file.mimetype,
                size: data.file.size,
            };
        }
        object.updatedAt = Date.now();
        await object.save();
        return object;
    } catch (error) {
        throw error;
    }
}

const deleteObject = async function (objectId) {
    try {
        const object = await Object.findById(objectId);
        if (!object) {
            throw new Error('Object not found');
        }
        await unlinkAsync(object.filePath);
        await object.deleteOne();
        return {success: true};
    } catch (error) {
        throw error;
    }
}


module.exports.uploadObject = uploadObject;
module.exports.getObject = getObject;
module.exports.listObjects = listObjects;
module.exports.deleteObject = deleteObject;
module.exports.updateObject = updateObject;