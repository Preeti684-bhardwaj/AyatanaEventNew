const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, 'public/temp')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
})

const upload = multer({
    storage: storage,
    // fileFilter: function (req, file, cb) {
    //     const fileTypes = /jpeg|jpg|png|gif/;
    //     const mimeType = fileTypes.test(file.mimetype);
    //     const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    
    //     if (mimeType && extName) {
    //       return cb(null, true);
    //     }
    //     cb(new Error('Invalid file type. Only JPEG, PNG, and GIF file types are allowed.'));
    //   }
})

module.exports = upload