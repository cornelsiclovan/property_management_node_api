const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const multer = require("multer");

// models
const Place = require("./models/place");
const User = require("./models/user");
const Category = require("./models/category");

// routes
const authRoutes  = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const categoriesRoutes = require("./routes/categories");
const placesRoutes = require("./routes/places")
const clientRoutes = require("./routes/client");

dotenv.config();
const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, images);
    },
    filename: (req, file, cb) => {
        const date = new Date().toISOString().replace(/:/g, "-");
        cb(null, date + "-" + file.originalname)
    }
});

const fileFilter = (req, file, cb) =>  {
    if(
        file.mimetype === "image/png" || 
        file.mimetype === "image/jpg" || 
        file.mimetype === "image/jpeg"
        ) {
            cb(null, true);
        } else {
            cb(null, false)
        }
}

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    next();
});

// Routing 

app.use("/admin", adminRoutes);
app.use("/places",placesRoutes);
app.use("/clients",clientRoutes);
app.use("/categories",categoriesRoutes);
app.use(authRoutes);

// End Routing

// Error handling 

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;

    res.status(status).json({message: message, data: data});
});  

// End Error handling


// Relations

Place.belongsTo(User, {constraints: true, onDelete: "RESTRICT"});
User.hasMany(Place);

Place.belongsTo(Category, {constraints: true, onDelete: "RESTRICT"});
Category.hasMany(Place);

// End Relations

try {
    // sequelize.sync({force: true});
    sequelize.sync();
} catch(error) {
    console.log(error);
}

app.listen(8080); 