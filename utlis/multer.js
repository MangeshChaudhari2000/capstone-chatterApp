import express from 'express';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, 'public/profile')

        cb(null, path.join(path.resolve() + '/public/profile/'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

export const upload = multer({
    storage: storage,
    limits: { fileSize: 60000 },
    fileFilter: (req, file, cb) => {
        var filetypes = /jpeg|jpg|png|jfif/;
        var mimetypes = filetypes.test(filetypes);
        var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetypes && extname) return cb(null, true);
        else {
            cb("file only su[pports:" + filetypes)
        }
    }

})