const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });
const taskController = require('../controllers/breakingTaskController');

// Require Middlewares
const corsMiddleware = require('../middleware/corsMiddleware');
// const authMiddleware = require('./../middleware/authMiddleware');

// Create an instance of BreakingTaskController
const taskBreakDown = new taskController();
// const authController = require('../controllers/authController');

// Apply the middleware
router.use(corsMiddleware.restrict);
// router.use('/pages', authMiddleware.checkSessionAndPrivileges());

// API route for breaking down the task
router.post('/api/breakdown', upload.single('file'), (req, res) => {
    taskBreakDown.breakdown(req, res);
});

// API route for generating subtasks
router.post('/api/subtasks', (req, res) => {
    taskBreakDown.breakdownSubtask(req, res);
});

// Auth routes - no check for session and privileges
// router.post('/auth/login', authController.login);
// router.post('/auth/logout', authController.logout);
// router.get('/auth/checkSessionExists', authController.checkSessionExists);


module.exports = router;