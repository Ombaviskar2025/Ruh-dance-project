const Style = require('../models/Style');

// @desc    Get all dance styles
// @route   GET /api/styles
exports.getStyles = async (req, res) => {
    try {
        const styles = await Style.find();
        res.status(200).json({ success: true, data: styles });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Create a new dance style
// @route   POST /api/styles
exports.createStyle = async (req, res) => {
    try {
        const styleData = {
           ...req.body,
           image: req.file ? req.file.path : (req.body.imageUrl || req.body.image)
        };
        const style = await Style.create(styleData);
        res.status(201).json({ success: true, data: style });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update a dance style
// @route   PUT /api/styles/:id
exports.updateStyle = async (req, res) => {
    try {
        const updatedData = { ...req.body };
        if (req.file) {
            updatedData.image = req.file.path;
        } else if (req.body.imageUrl) {
            updatedData.image = req.body.imageUrl;
        } else if (req.body.image) {
            updatedData.image = req.body.image;
        }

        const style = await Style.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!style) {
            return res.status(404).json({ success: false, message: 'Style not found' });
        }
        res.status(200).json({ success: true, data: style });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Delete a dance style
// @route   DELETE /api/styles/:id
exports.deleteStyle = async (req, res) => {
    try {
        const style = await Style.findByIdAndDelete(req.params.id);
        if (!style) {
            return res.status(404).json({ success: false, message: 'Style not found' });
        }
        res.status(200).json({ success: true, message: 'Style deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};