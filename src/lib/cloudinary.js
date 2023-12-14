import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: import.meta.env.CLOUDINARY_CLOUDNAME,
    api_key: import.meta.env.CLOUDINARY_APIKEY,
    api_secret: import.meta.env.CLOUDINARY_APISECRET,
});

const uploadStream = async (buffer, option) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(option, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            })
            .end(buffer)
    });
};

export async function uploadImages(files) {
    const responses = [];
    for (let i = 0; i < files.length; i++) {
        const imagen = files[i];
        //console.log(imagen.name);
        const arrayBuffer = await imagen.arrayBuffer();
        const uit8array = new Uint8Array(arrayBuffer);
        //console.log("Array Buffer:", arrayBuffer);
        //console.log("Uint8Array:", uit8array);
        const response = await uploadStream(uit8array, { resource_type: 'auto' });
        console.log(response);

        responses.push(response);
    }

    return responses;
}

export async function getImages(ids) {
    let images = [];

    let placeholder = cloudinary.url("placeholder", {
        width: 400,
        height: 250,
        crop: "fill",
    });

    if (ids !== undefined && ids.length > 0) {
        for(let id of ids) {
            // Generate Cloudinary URL for the first image
            let temp = cloudinary.url(id, {
                width: 400,
                height: 250,
                crop: "fill",
            });
            
            // Check if the image exists
            let exist = await fetch(temp)
                .then(function (response) {
                    return response.status != 404;
                })
                .catch(function () {
                    return false;
                });

            // If the image exists, update placeholder
            if (exist) {
                images.push(temp);
            } else {
                images.push(placeholder);
            }
        }
        
        return images;
        
    }
}