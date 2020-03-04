const multer = require('multer');
const sharp = require('sharp');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

// file is req.file
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     // user-id-timestamp.jpeg
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please only upload images!', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  // buffer: file stored in memory, not to disk
  // resize: resize(width: height: options)
  // look at sharp documentation for options
  // jpeg turns it to jpeg
  // to file needs the destination
  sharp(req.file.buffer)
    // Listing image at 72x72, other images at ___
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};
exports.resizeUserPhoto72x72 = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const filename72x72 = `${req.file.filename.replace('.jpeg', '')}-72x72.jpeg`;

  // buffer: file stored in memory, not to disk
  // resize: resize(width: height: options)
  // look at sharp documentation for options
  // jpeg turns it to jpeg
  // to file needs the destination
  sharp(req.file.buffer)
    // Listing image at 72x72, other images at ___
    .resize(72, 72)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${filename72x72}`);
  next();
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log(req.file);

  // 1. Create an error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('To update your password, please use /updatePassword')
    );
  }
  // 2. Update user document
  const filteredBody = filterObj(req.body, 'name', 'email');
  // if the request has a file (photo), update the photo
  if (req.file) {
    filteredBody.photo = req.file.filename;
    filteredBody.photo72x72 = `${req.file.filename.replace(
      '.jpeg',
      ''
    )}-72x72.jpeg`;
  }
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use Signup instead'
  });
};
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.deleteUser = factory.deleteOne(User);
// only for admins, dont update passwords with this
exports.updateUser = factory.updateOne(User);
