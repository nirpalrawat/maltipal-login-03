const UserModel = require("../models/user");
const TeacherModel = require("../models/teacher");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class FrontController {
  static home = async (req, res) => {
    try {
      res.render("home"); // home.ejs file
    } catch (error) {
      console.log(error);
    }
  };

  static about = async (req, res) => {
    try {
      res.render("about");
    } catch (error) {
      console.log(error);
    }
  };

  static login = async (req, res) => {
    try {
      res.render("login", {
        message: req.flash("success"),
        msg: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  static register = async (req, res) => {
    try {
      res.render("register", { message: req.flash("error") });
    } catch (error) {
      console.log(error);
    }
  };

  static contact = async (req, res) => {
    try {
      res.render("contact");
    } catch (error) {
      console.log(error);
    }
  };
  //// insert data
  static insertStudent = async (req, res) => {
    try {
      const { name, email, password, confirmpassword } = req.body;

      if (!name || !email || !password || !confirmpassword) {
        req.flash("error", "All Fields are Required.");
        return res.redirect("/register");
      }

      const isEmail = await UserModel.findOne({ email });
      if (isEmail) {
        req.flash("error", "Email Already Exists.");

        return res.redirect("/register");
      }

      if (password != confirmpassword) {
        req.flash("error", "password does not match.");
        return res.redirect("/register");
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const data = await UserModel.create({
        name,
        email,
        password: hashPassword,
      });
      req.flash("success", "Register Success  !Plz Login");
      res.redirect("/"); /// route ** web
    } catch (error) {
      console.log(error);
    }
  };

  static verifyLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await UserModel.findOne({ email: email });

        if (user != null) {
          const isMatched = await bcrypt.compare(password, user.password);
          console.log(isMatched);

          if (isMatched) {
            if (user.role == "admin") {
              // token create
              let token = jwt.sign({ ID: user.id }, "dileepmeena1234");

              //  console.log(token)
              res.cookie("token", token);
              res.redirect("admin/dashboard");
            }
            if (user.role == "student") {
              // token create
              let token = jwt.sign({ ID: user.id }, "dileepmeena1234");

              //  console.log(token)
              res.cookie("token", token);
              res.redirect("/home");
            }
          }
        } else {
          req.flash("error", "you are not a registered user");
          return res.redirect("/");
        }
      } else {
        req.flash("error", "All Fields Required");
        res.redirect("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static Logout = async (req, res) => {
    try {
      res.clearCookie("token"); // clearcookie ---> token ko clear krna
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };
}
module.exports = FrontController;
