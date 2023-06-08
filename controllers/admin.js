const { validationResult } = require("express-validator");
const Category = require("../models/category");
const Place = require("../models/place");

// Places

exports.getPlaces = async (req, res, next) => {
  let places = [];

  let queryObject = {};

  let userId =  req.query.userId;
  let categoryId =  req.query.categoryId;


  if(userId !== undefined) {
    console.log("here");
    queryObject.userId = userId
  }

  if(categoryId !== undefined) {
    queryObject.categoryId = categoryId
  }

  let totalItems = 0; 

  try {
   
    places = await Place.findAll({ 'where': queryObject });
    

    totalItems = places.length;
    res.status(200).json({
      places: places,
      totalItems: totalItems,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPlace = async (req, res, next) => {
  const placeId = req.params.placeId;
  try {
    const place = await Place.findByPk(placeId);
    if (!place) {
      const error = new Error("This place does not exist.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      place: place,
    });
  } catch (error) {
    if (!error) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!req.isOwner) {
    const error = new Error("Not authorized");
    error.statusCode = 403;
    next(error);
    return;
  }

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.status = 422;
      error.data = errors.array();
      throw error;
    }
  } catch (error) {
    next(error);
    return;
  }

  const title = req.body.title;
  const description = req.body.description;
  const suprafata = req.body.suprafata;
  const country = req.body.country;
  const city = req.body.city;
  const street = req.body.street;
  const number = req.body.number;
  const apartment = req.body.apartment;
  const occupied = req.body.occupied;
  const categoryId = req.body.category;

  try {
    const place = await Place.create({
      title: title,
      description: description,
      suprafata: suprafata,
      country: country,
      city: city,
      street: street,
      number: number,
      apartment: apartment,
      occupied: occupied,
      userId: req.userId,
      categoryId: categoryId,
    });

    res.status(200).json({
      place: place,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 404;
    }
    next(error);
  }
};

exports.editPlace = async (req, res, next) => {
  const errors = validationResult(req);
  const placeId = req.params.placeId;
  if (!req.isOwner) {
    const error = new Error("Not authorized!");
    error.statusCode = 403;
    next(error);
  }

  try {
    if (!errors.isEmpty) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      throw error;
    }

    const place = await Place.findByPk(placeId);

    if (!place) {
      const error = new Error("Place does not exist!");
      error.statusCode = 403;
      throw error;
    }

    if (place.userId !== req.userId) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }

    place.title = req.body.title;
    place.description = req.body.description;
    place.suprafata = req.body.suprafata;
    place.country = req.body.country;
    place.city = req.body.city;
    place.street = req.body.street;
    place.number = req.body.number;
    place.apartment = req.body.apartment;
    place.occupied = req.body.occupied;
    place.categoryId = req.body.category;
  

    await place.save();

    res.status(200).json({
      place: place,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 404;
    }
    next(error);
  }
};

exports.deletePlace = async (req, res, next) => {
  const placeId = req.params.placeId;
  if (!req.isOwner) {
    const error = new Error("Not authorized!");
    error.statusCode = 403;
    next(error);
  }

  try {
    const place = await Place.findByPk(placeId);

    if (!place) {
      const error = new Error("Could not find place.");
      error.statusCode = 404;
      throw error;
    }

    if (place.userId !== req.userId) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }

    await place.destroy();

    res.status(200).json({ message: "Deleted place!" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

/// End Places

/// Categotories

exports.getCategories = async (req, res, next) => {
  let categories = [];
  let totalItems = 0;

  try {
    categories = await Category.findAll();
    if (!categories || categories.length === 0) {
      const error = Error("There is no category available");
      error.statusCode = 400;
      throw error;
    }

    res.status(200).json({
      categories: categories,
      totalItems: totalItems,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;

  try {
    const category = Category.findByPk(categoryId);
    if (!category) {
      const error = new Error("Category is not available!");
      error.statusCode = 400;
      throw error;
    }

    res.status(200).json({
      category: category,
    });
  } catch (error) {
    next(error);
  }
};

exports.addCategory = async (req, res, next) => {
  const errors = validationResult(req);

  if (!req.isAdmin) {
    const error = new Error("Not authorized!");
    error.statusCode = 403;
    next(error);
  }

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.status = 422;
      error.data = errors.array();
      throw error;
    }
  } catch (error) {
    next(error);
    return;
  }

  const title = req.body.title;
  const description = req.body.description;

  try {
    const category = await Category.create({
      title: title,
      description: description,
    });

    res.status(200).json({
      category: category,
    });
  } catch (error) {
    next(error);
  }
};

exports.editCategory = async (req, res, next) => {
  const errors = validationResult(req);
  const categoryId = req.params.categoryId;

  if (!req.isAdmin) {
    const error = new Error("Not authorized!");
    error.statusCode = 403;
    next(error);
  }

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.status = 422;
      error.data = errors.array();
      throw error;
    }
  } catch (error) {
    next(error);
    return;
  }

  const title = req.body.title;
  const description = req.body.description;

  try {
    const category = await Category.findByPk(categoryId);

    if (!category) {
      const error = new Error("Category does not exist!");
      error.statusCode = 400;
      throw error;
    }

    category.title = title;
    category.description = description;

    await category.save();

    res.status(200).json({
      category: category,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  if (!req.isAdmin) {
    const error = new Error("Not Authorized!");
    error.statusCode = 400;
    throw error;
  }

  try {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      const error = new Error("This category does not exist!");
      error.statusCode = 400;
      throw error;
    }

    await category.destroy();

    res.status(200).json({
      message: "Category deleted!",
    });
  } catch (error) {
    next(error);
  }
};

/// End Categories
