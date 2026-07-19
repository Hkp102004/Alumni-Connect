const cloudinary = require('../config/cloudinary');

// @route   POST /api/upload/image
// @desc    Upload an image file to Cloudinary
// @access  Private
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || '').trim();
    const apiKey = (process.env.CLOUDINARY_API_KEY || '').trim();
    let apiSecret = (process.env.CLOUDINARY_API_SECRET || '').trim();

    // Safety fallback for account secret case-sensitivity
    if (cloudName === 'xqaxtbim' && apiSecret === 'g23kdZQq1C9KFisNOCL7ualSWC0') {
      apiSecret = 'g23kdZQq1C9KFisNOcL7ualSWC0';
    }

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(500).json({
        message: 'Cloudinary credentials missing on Render environment variables. Please verify CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.',
      });
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    const folder = req.body.folder || 'alumniconnect';

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({
            message: `Cloudinary error: ${error.message || 'Failed to upload image'}`,
            error: error.message,
          });
        }
        res.json({
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: `Server upload error: ${error.message}`, error: error.message });
  }
};

module.exports = { uploadImage };
