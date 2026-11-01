const Signature = require('../models/Signature');
const upload = require('../middleware/multer');

// @desc    Get all signature performances
// @route   GET /api/signatures
exports.getSignatures = async (req, res) => {
    try {
        const signatures = await Signature.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: signatures });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Create a signature performance
// @route   POST /api/signatures
exports.createSignature = async (req, res) => {
    try {
        console.log('--- Creating Signature ---');
        console.log('Body:', req.body);
        console.log('Files:', req.files);

        const signatureData = { ...req.body };

        // Handle files from multer (memory storage — upload to Cloudinary)
        if (req.files) {
            if (req.files.image && req.files.image[0]) {
                const f = req.files.image[0];
                signatureData.image = await upload.uploadToCloudinary(f.buffer, f.mimetype);
            }
            if (req.files.videoUrl && req.files.videoUrl[0]) {
                const f = req.files.videoUrl[0];
                signatureData.videoUrl = await upload.uploadToCloudinary(f.buffer, f.mimetype);
            }
        }

        // Fallback to URL strings from body if no files were uploaded
        if (!signatureData.image && req.body.imageUrl) {
            signatureData.image = req.body.imageUrl;
        }
        if (!signatureData.videoUrl && req.body.videoUrlText) {
            signatureData.videoUrl = req.body.videoUrlText;
        }

        // Remove empty strings so Mongoose doesn't validate them
        if (!signatureData.image) delete signatureData.image;
        if (!signatureData.videoUrl) delete signatureData.videoUrl;

        console.log('Data to be saved:', signatureData);

        const signature = await Signature.create(signatureData);
        console.log('✅ Signature saved successfully');
        res.status(201).json({ success: true, data: signature });
    } catch (err) {
        console.error('❌ Error in createSignature:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update a signature performance
// @route   PUT /api/signatures/:id
exports.updateSignature = async (req, res) => {
    try {
        const updatedData = { ...req.body };

        if (req.files) {
            if (req.files.image && req.files.image[0]) {
                const f = req.files.image[0];
                updatedData.image = await upload.uploadToCloudinary(f.buffer, f.mimetype);
            }
            if (req.files.videoUrl && req.files.videoUrl[0]) {
                const f = req.files.videoUrl[0];
                updatedData.videoUrl = await upload.uploadToCloudinary(f.buffer, f.mimetype);
            }
        }

        // Fallback to URL strings from body if no new files were uploaded
        if (!updatedData.image && req.body.imageUrl) {
            updatedData.image = req.body.imageUrl;
        }

        // Clean up empty fields
        if (updatedData.image === '') delete updatedData.image;
        if (updatedData.videoUrl === '') delete updatedData.videoUrl;

        const signature = await Signature.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!signature) {
            return res.status(404).json({ success: false, message: 'Performance not found' });
        }
        res.status(200).json({ success: true, data: signature });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Delete a signature performance
// @route   DELETE /api/signatures/:id
exports.deleteSignature = async (req, res) => {
    try {
        const signature = await Signature.findByIdAndDelete(req.params.id);
        if (!signature) {
            return res.status(404).json({ success: false, message: 'Performance not found' });
        }
        res.status(200).json({ success: true, message: 'Performance removed' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
