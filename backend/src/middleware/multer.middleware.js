import multer from "multer";

// Store uploaded files temporarily in memory
const storage = multer.memoryStorage();

// Accept only PDF uploads
const fileFilter = (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
          const error = new Error("Only PDF files are allowed.");
          error.statusCode = 400;

          return cb(error, false);
    }

    cb(null, true);
};

// Configure Multer
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
        files: 1,
    },
});

export const uploadResume = upload.single("resume");


export const validatePdfSignature = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Please upload a resume.",
        });
    }

    const pdfSignature = req.file.buffer
        .subarray(0, 5)
        .toString("ascii");

    if (pdfSignature !== "%PDF-") {
        return res.status(400).json({
            success: false,
            message: "Invalid PDF file. Please upload a genuine PDF.",
        });
    }

    next();
};
