const express = require("express");
const FrontController = require("../controllers/FrontController");
const AdminController = require("../controllers/admin/AdminController");
const route = express.Router();

route.get("/home", FrontController.home);
route.get("/about", FrontController.about);
route.get("/", FrontController.login);
route.get("/register", FrontController.register);
route.get("/contact", FrontController.contact);

//// insert data
route.post("/insertStudent", FrontController.insertStudent);
route.post("/verifyLogin", FrontController.verifyLogin);
route.get("/Logout", FrontController.Logout);

//adminController
route.get("/admin/dashboard", AdminController.dashboard);

module.exports = route;
