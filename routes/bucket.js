const express = require('express');
const router = express.Router();
const authCheck = require('../middleware/authMiddleware');
const bucketController = require('../controllers/bucketController');

/**
 * @swagger
 * /buckets/create:
 *   post:
 *     summary: Create bucket
 *     tags: [Bucket]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: My bucket
 *                 required: true
 *               description:
 *                 type: string
 *                 example: My bucket description
 *     responses:
 *       201:
 *         description: Bucket created
 *       401:
 *          description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /buckets/getAll:
 *   get:
 *     summary: Get all buckets
 *     tags: [Bucket]
 *     responses:
 *       201:
 *         description: Buckets retrieved
 *       401:
 *          description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /buckets/update/{bucketId}:
 *   put:
 *     summary: Update bucket
 *     tags: [Bucket]
 *     parameters:
 *       - in: path
 *         name: bucketId
 *         schema:
 *           type: string
 *         required: true
 *         description: Bucket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated bucket
 *                 required: true
 *               description:
 *                 type: string
 *                 example: My bucket description
 *                 required: true
 *     responses:
 *       200:
 *          description: Bucket updated
 *       401:
 *          description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /buckets/delete/{bucketId}:
 *   delete:
 *     summary: Delete bucket
 *     tags: [Bucket]
 *     parameters:
 *       - in: path
 *         name: bucketId
 *         schema:
 *           type: string
 *         required: true
 *         description: Bucket ID
 *     responses:
 *       200:
 *          description: Bucket deleted
 *       401:
 *          description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.post('/create', authCheck, (req, res) => {
    const data = {
        name: req.body.name,
        description: req.body.description,
        owner: req.user._id
    }
    bucketController.createBucket(data)
        .then((data) => {
            res.status(201).json({success: true, bucket: data});
        })
        .catch((err) => {
            res.status(500).json({success: false, error: err.message});
        });
});
router.get('/getAll', authCheck, (req, res) => {
    bucketController.getAllBuckets(req.user._id)
        .then((data) => {
            res.status(201).json({success: true, buckets: data});
        })
        .catch((err)=>{
            res.status(500).json({success: false, error: err.message});
        })
});

router.put('/update/:bucketId', authCheck, (req, res) => {
    const data = {
        name: req.body.name,
        description: req.body.description
    }
    bucketController.updateBucket(req.params.bucketId, data)
        .then((data) => {
            res.status(201).json({success: true, bucket: data});
        })
        .catch((err) => {
            res.status(500).json({success: false, error: err.message});
        });
});

router.delete('/delete/:bucketId', authCheck, (req, res) => {
    bucketController.deleteBucket(req.params.bucketId)
        .then((data) => {
            res.status(201).json({success: true});
        })
        .catch((err) => {
            res.status(500).json({success: false, error: err.message});
        });
});

module.exports = router;
