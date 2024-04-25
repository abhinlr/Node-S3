const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

/**
 * @swagger
 * /auth/signUp:
 *   post:
 *     summary: Sign up
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *                 required: true
 *               email:
 *                 type: string
 *                 example: 9YyZ3@example.com
 *                 required: true
 *               password:
 *                 type: string
 *                 example: password
 *                 required: true
 *     responses:
 *       201:
 *         description: Sign up successful
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: 9YyZ3@example.com
 *                 required: true
 *               password:
 *                 type: string
 *                 example: password
 *                 required: true
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
 *       500:
 *         description: Internal server error
 */

router.post('/signUp', (req, res) => {
    authController.signUp(req.body)
        .then((data) => {
            res.status(201).json({success: true});
        })
        .catch((err) => {
            res.status(500).json({success: false, error: err.message});
        });
});

router.post('/login', (req, res,next) => {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return res.status(500).json({ message: 'An error occurred during authentication.' });
        }
        if (!user) {
            return res.status(401).json({ message: info.message });
        }
        req.login(user, function(err) {
            if (err) {
                return res.status(500).json({ message: 'An error occurred during login.' });
            }
            return res.status(200).json({success:true,user:user});
        });
    })(req, res, next);
});

router.get('/logout', function (req, res) {
    req.session.destroy(function(err) {
        if(err) {
            res.status(500).json({ success: false, error: 'Failed to logout' });
        } else {
            res.json({ success: true });
        }
    });
});

module.exports = router;