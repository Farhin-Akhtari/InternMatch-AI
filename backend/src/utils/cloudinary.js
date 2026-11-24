import { Readable } from "node:stream";
import cloudinary from "../config/cloudinary.js";


const uploadBufferToCloudinary = (fileBuffer, options = {}) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                ...options,
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            }
        );

        Readable.from([fileBuffer]).pipe(uploadStream);
    });
};


const deleteOnCloudinary = async (
    publicId,
    resourceType = "image",
    deliveryType = "upload"
) => {
    if(!publicId){
        throw new Error("Cloudinary public ID is required.");
    }
    return await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
        type: deliveryType,
    });
};

export {uploadBufferToCloudinary, deleteOnCloudinary};