const express = require('express');
const router = express.Router();
const objectController = require('../controllers/objectController');
const multer = require('multer');
const {join, extname} = require("node:path");
const crypto = require('crypto');
const fs = require("fs");
const authCheck = require("../middleware/authMiddleware");

/**
 * @swagger
 * /objects/upload:
 *   post:
 *     summary: Upload object
 *     tags: [Object]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               bucket:
 *                 type: string
 *                 example: My bucket
 *                 required: true
 *               file:
 *                 type: file
 *                 example: My file
 *                 required: true
 *                 format: binary
 *     responses:
 *       201:
 *             description: Object uploaded
 *       400:
 *             description: No file uploaded
 *       401:
 *             description: Unauthorized
 *       500:
 *             description: Internal server error
 */

/**
 * @swagger
 * /objects/getAllObjects/{bucketId}:
 *   get:
 *     summary: Get all objects
 *     tags: [Object]
 *     parameters:
 *       - in: path
 *         name: bucketId
 *         schema:
 *           type: string
 *         required: true
 *         description: Bucket ID
 *     responses:
 *       201:
 *             description: Objects retrieved
 *       401:
 *             description: Unauthorized
 *       500:
 *             description: Internal server error
 */

/**
 * @swagger
 * /objects/get/{objectId}:
 *   get:
 *     summary: Get object
 *     tags: [Object]
 *     parameters:
 *       - in: path
 *         name: objectId
 *         schema:
 *           type: string
 *         required: true
 *         description: Object ID
 *     responses:
 *       200:
 *             description: Object retrieved
 *             content:
 *                  application/octet-stream:
 *                   schema:
 *                     type: string
 *                     format: binary
 *       401:
 *             description: Unauthorized
 *       500:
 *             description: Internal server error
 */

/**
 * @swagger
 * /objects/delete/{objectId}:
 *   delete:
 *     summary: Delete object
 *     tags: [Object]
 *     parameters:
 *       - in: path
 *         name: objectId
 *         schema:
 *           type: string
 *         required: true
 *         description: Object ID
 *     responses:
 *       201:
 *             description: Object deleted
 *       401:
 *             description: Unauthorized
 *       500:
 *             description: Internal server error
 */

/**
 * @swagger
 * /objects/update/{objectId}:
 *   put:
 *     summary: Update object
 *     tags: [Object]
 *     parameters:
 *       - in: path
 *         name: objectId
 *         schema:
 *           type: string
 *         required: true
 *         description: Object ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: file
 *                 example: My file
 *                 required: true
 *                 format: binary
 *     responses:
 *       201:
 *             description: Object updated
 *       401:
 *             description: Unauthorized
 *       500:
 *             description: Internal server error
 */

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, join(__dirname, '../uploads/'));
    },
    filename: (req, file, cb) => {
        if (!file) {
            const error = new Error('No file uploaded');
            error.code = 'NO_FILE';
            return cb(error);
        }
        crypto.randomBytes(16, (err, buffer) => {
            if (err) return cb(err);
            const uniqueSuffix = buffer.toString('hex');
            const fileExtension = extname(file.originalname);
            cb(null, uniqueSuffix + fileExtension);
        });
    }
});
const upload = multer({storage});


router.post('/upload', authCheck, upload.single('file'), (req, res) => {
    if (!req.file || !req.body.bucket) {
        return res.status(400).send('No file uploaded');
    }
    const data = {
        bucket: req.body.bucket,
        file: req.file
    }
    objectController.uploadObject(data)
        .then((data) => {
            res.status(201).json({success: true, data: data});
        })
        .catch((err) => {
            res.status(500).json({success: false, error: err});
        })
});

router.get('/get/:objectId', (req, res) => {
    objectController.getObject(req.params.objectId)
        .then((object) => {
            res.setHeader('Content-Type', object.metadata.mimetype);
            const readStream = fs.createReadStream(object.filePath);
            readStream.pipe(res);
        })
        .catch((err) => {
            res.status(500).json({success: false, error: err});
        })
});

router.get('/getAllObjects/:bucketId', (req, res) => {
    objectController.listObjects(req.params.bucketId)
        .then((data) => {
            res.status(201).json({success: true, objects: data});
        })
        .catch((err) => {
            res.status(500).json({success: false, error: err});
        });
});

router.put('/update/:objectId', authCheck, upload.single('file'), (req, res) => {
    const data = {
        file: req.file
    }
    objectController.updateObject(req.params.objectId, data)
        .then((data) => {
            res.status(201).json({success: true, object: data});
        })
        .catch((err) => {
            res.status(500).json({success: false, error: err});
        })
});

router.delete('/delete/:objectId', authCheck, (req, res) => {
    objectController.deleteObject(req.params.objectId)
        .then((data) => {
            res.status(201).json(data);
        })
        .catch((err) => {
            res.status(500).json({success: false, error: err});
        })
});


module.exports = router;