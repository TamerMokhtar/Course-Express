const { validationResult } = require("express-validator");
const Course = require("../models/courses.model");
const httpStatus = require("../utils/httpStatusText");
const asyncWrapper = require("../middlewares/asyncWrapper");
const appError = require("../utils/appError");

const getAllCourses = asyncWrapper(async (req, res) => {
  // get all courses from DB using Course Model

  const query = req.query;
  const limit = parseInt(query.limit) || 10;
  const page = parseInt(query.page) || 1;
  const skip = (page - 1) * limit;

  const courses = await Course.find({}, { __v: 0 }).limit(limit).skip(skip);
  res.json({ status: httpStatus.SUCCESS, data: { courses } });
});

const getCourseById = asyncWrapper(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (course) {
    res.json({ status: httpStatus.SUCCESS, data: { courses } }); // Jsend() format
  } else {
    const error = appError.create("Course not found", 404, httpStatus.FAIL);
    next(error);
    // res.status(404).json({
    //   status: httpStatus.FAIL,
    //   data: { courses: "course not found" },
  }
  // try {
  //   }
  // } catch (error) {
  //   res.status(400).json({
  //     status: httpStatus.ERROR,
  //     data: null,
  //     message: error.message,
  //     code: 400,
  //   }
  // }
});

const addCourse = asyncWrapper(async (req, res, next) => {
  // validate the request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, httpStatus.FAIL);
    return next(error);
    // return res
    //   .status(400)
    //   .json({ status: httpStatus.FAIL, data: errors.array() });
  }

  const newCourse = new Course(req.body);
  await newCourse.save();
  res.status(201).json({ status: httpStatus.SUCCESS, data: { newCourse } });
});

const updateCourse = asyncWrapper(async (req, res) => {
  const id = req.params.id;

  const updateCourse = await Course.findByIdAndUpdate(id, {
    $set: { ...req.body },
  });
  const course = await Course.findById(id);

  return res
    .status(200)
    .json({ status: httpStatus.SUCCESS, data: { courses } });
  // try {
  // } catch (error) {
  //   res.status(404).json({
  //     status: httpStatus.ERROR,
  //     data: null,
  //     message: error.message,
  //     code: 400,
  //   });
  // }
});

const deleteCourse = asyncWrapper(async (req, res) => {
  const id = req.params.id;
  try {
    const deleted = await Course.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        status: httpStatus.FAIL,
        data: { courses: "course not found" },
      });
    }
    res.status(200).json({ status: httpStatus.SUCCESS, data: null });
  } catch (error) {
    res.status(400).json({
      status: httpStatus.ERROR,
      data: null,
      message: error.message,
      code: 400,
    });
  }
});

module.exports = {
  getAllCourses,
  getCourseById,
  addCourse,
  updateCourse,
  deleteCourse,
};
