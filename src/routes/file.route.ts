import express from 'express';
const router = express.Router();
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('file', file);
        cb(null, 'public/');
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.').filter(Boolean).slice(1).join('.');
        console.log(ext);

        cb(null, Date.now() + '.' + ext);
    },
});
const upload = multer({ storage: storage });

router.post('/', upload.single('file'), (req, res) => {
    const url = req.file?.path.replace(/\\/g, '/');
    if (req.file) {
        res.status(200).send({ url });
    } else {
        res.status(400).send({ error: 'File upload failed' });
    }
});

export = router;
