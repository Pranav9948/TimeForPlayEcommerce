const User = require("../models/UserModel");
const Review = require("../models/ReviewModel");
const Product = require("../models/ProductModel");
const Cart=require('../models/CartModel')
const { hashPassword, comparePasswords } = require("../utils/hashPassword");
const generateAuthToken = require("../utils/generateAuthToken");
const Coupon = require("../models/CouponModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs/dist/bcrypt");
const bcryptjs = require("bcryptjs");
const JWT_SECRET_KEY = "jki786hmgdjbdydb87";
var objectId = require("mongodb").ObjectId;

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password");
    return res.json(users);
  } catch (err) {
    next(err);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { name, lastName, email, password } = req.body;
    if (!(name && lastName && email && password)) {
      return res.status(400).send("All inputs are required");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send("user exists");
    } else {
      const hashedPassword = hashPassword(password);
      const user = await User.create({
        name,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
      });
      res
        .cookie(
          "access_token",
          generateAuthToken(
            user._id,
            user.name,
            user.lastName,
            user.email,
            user.isAdmin
          ),
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          }
        )
        .status(201)
        .json({
          success: "User created",
          userCreated: {
            _id: user._id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin,
          },
        });
    }
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password, doNotLogout } = req.body;
    if (!(email && password)) {
      return res.status(400).send("All inputs are required");
    }

    const user = await User.findOne({ email }).orFail();
    if (user && comparePasswords(password, user.password)) {
      let cookieParams = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      };

      if (doNotLogout) {
        cookieParams = { ...cookieParams, maxAge: 1000 * 60 * 60 * 24 * 7 }; // 1000=1ms
      }

      return res
        .cookie(
          "access_token",
          generateAuthToken(
            user._id,
            user.name,
            user.lastName,
            user.email,
            user.isAdmin
          ),
          cookieParams
        )
        .json({
          success: "user logged in",
          userLoggedIn: {
            _id: user._id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin,
            doNotLogout,
          },
        });
    } else {
      return res.status(401).send("wrong credentials");
    }
  } catch (err) {
    next(err);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).orFail();
    user.name = req.body.name || user.name;
    user.lastName = req.body.lastName || user.lastName;
    user.phoneNumber = req.body.phoneNumber;
    user.address = req.body.address;
    user.country = req.body.country;
    user.zipCode = req.body.zipCode;
    user.city = req.body.city;
    user.state = req.body.state;
    if (req.body.password !== user.password) {
      user.password = hashPassword(req.body.password);
    }
    await user.save();

    res.json({
      success: "user updated",
      userUpdated: {
        _id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).orFail();
    return res.send(user);
  } catch (err) {
    next(err);
  }
};

const writeReview = async (req, res, next) => {
  try {
    const session = await Review.startSession();

    // get comment, rating from request.body:
    const { comment, rating } = req.body;
    // validate request:
    if (!(comment && rating)) {
      return res.status(400).send("All inputs are required");
    }

    // create review id manually because it is needed also for saving in Product collection
    const ObjectId = require("mongodb").ObjectId;
    let reviewId = ObjectId();

    session.startTransaction();
    await Review.create(
      [
        {
          _id: reviewId,
          comment: comment,
          rating: Number(rating),
          user: {
            _id: req.user._id,
            name: req.user.name + " " + req.user.lastName,
          },
        },
      ],
      { session: session }
    );

    const product = await Product.findById(req.params.productId)
      .populate("reviews")
      .session(session);

    const alreadyReviewed = product.reviews.find(
      (r) => r.user._id.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send("product already reviewed");
    }

    let prc = [...product.reviews];
    prc.push({ rating: rating });
    product.reviews.push(reviewId);
    if (product.reviews.length === 1) {
      product.rating = Number(rating);
      product.reviewsNumber = 1;
    } else {
      product.reviewsNumber = product.reviews.length;
      let ratingCalc =
        prc
          .map((item) => Number(item.rating))
          .reduce((sum, item) => sum + item, 0) / product.reviews.length;
      product.rating = Math.round(ratingCalc);
    }
    await product.save();

    await session.commitTransaction();
    session.endSession();
    res.send("review created");
  } catch (err) {
    await session.abortTransaction();
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select("name lastName email isAdmin")
      .orFail();
    return res.send(user);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).orFail();

    user.name = req.body.name || user.name;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    await user.save();

    res.send("user updated");
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).orFail();
    await user.remove();
    res.send("user removed");
  } catch (err) {
    next(err);
  }
};

const applyCouponCart = async (req, res) => {
  console.log("reached");
  const couponName = req.body.couponz;

  const getCouponDetails = await Coupon.findOne({ name: couponName });

  if (getCouponDetails === null) {
    return res.json({
      err: "invalid coupon",
    });
  }

  res.json(getCouponDetails);
};

const getForgotPassword = async (req, res) => {
  console.log("reach");
  const forgotEmail = req.body.email;

  try {
    const oldUser = await User.findOne({ email: forgotEmail });

    if (!oldUser) {
      return res.json({ status: "user with email dont exist" });
    }

    const secret = JWT_SECRET_KEY + oldUser.password;

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });

    const link = `http://localhost:5000/api/users/reset-password/${oldUser._id}/${token}`;

    var nodemailer = require("nodemailer");

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "pranavat9948@gmail.com",
        pass: "uzecljmiiutnhlcc",
      },
    });

    var mailOptions = {
      from: "youremail@gmail.com",
      to: "pranavat007@gmail.com",
      subject: "forgot password",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    console.log(link);
    res.json({success:"check your register Mail id"})
  } catch (err) {
    console.log(err);
  }
};

const resetPassword = async (req, res) => {
  const { id, token } = req.params;

  const oldUser = await User.findOne({ _id: id });

  if (!oldUser) {
    return res.json({ status: "user with email dont exist" });
  }

  const secret = JWT_SECRET_KEY + oldUser.password;

  try {
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email,status:"Not Verified"});
  } catch (err) {
    console.log(err);
    res.send("not verified");
  }
};

const resetPasswords = async (req, res) => {
  const { id, token } = req.params;
 const newPassword=req.body.password
  console.log("nmm",newPassword) 



  const oldUser = await User.findOne({ _id: id });

  if (!oldUser) {
    return res.json({ status: "user not found" });
  }

  const secret = JWT_SECRET_KEY + oldUser.password;

  try {
    const verify = jwt.verify(token, secret);
    
    const encryptedPassword =  await bcrypt.hash(newPassword,10);

    console.log("started",encryptedPassword)
    await User.findOneAndUpdate(
      { _id: id },
      { $set: { password: encryptedPassword } }
    );

  
    res.render('index',{email:verify.email,status:"verified"})
  } catch (err) {

    console.log(err)
    res.json({status:"something went wrong..."})
  }
};


const getCartContentBackend=async(req,res)=>{

  const cart=req.body.usercart
  const cartArray=cart.cartItems

  console.log("1222",cart)
  console.log("mkmkm",cartArray)


let cartItems=[];

const user=await User.findOne(req.user).exec()

console.log("kk",user)

let cartExistByUser=await Cart.findOne(req.user).exec()

console.log("mmm",cartExistByUser)



if(cartExistByUser){

  cartExistByUser.remove();
  console.log("old userCart removed")
}

for(let i=0;i<cartArray.length; i++){

  let object={}

 console.log("names",cartArray[i].name)

  object.name=cartArray[i].name;
  object.price=cartArray[i].price;
  object.image=cartArray[i].image;
  object.quantity=cartArray[i].quantity;
  object.count=cartArray[i].count
 
cartItems.push(object);
}

console.log("xxx",cartItems)
const itemsCount=cart.itemsCount;
const cartSubtotal=cart.cartSubtotal;

console.log("uas",req.user)

let newCart = await new Cart({
  user: {
    _id: req.user._id,
  
  },
  cartItems,
  itemsCount,
  cartSubtotal,
}).save();

console.log("new cart",newCart);
res.json({ok:true})

}


const showWishlist=async(req,res)=>{

  try{
  
  const list = await User.findOne({_id:objectId(req.user._id) })
    .select("wishlist")
    .populate("wishlist")
    .exec();
    console.log("mm",list)
      res.json (list)

  }

  catch(err){
    console.log(err)
    
  }

}


const addWishlist=async(req,res)=>{

  
    const {productId}=req.body

    const user = await User.findOneAndUpdate(
      {
        _id: req.user._id,
      },
      {
        $addToSet: { wishlist: productId },
      },
      {
        new: true,
      }
    );
      res.json({ ok: true });
}


const removeWishlist=async(req,res)=>{
console.log("reachezz")
 
const ProductId = req.params.productId;
  
  const user = await User.findOneAndUpdate(
    {
      _id: req.user._id,
    },
    {
      $pull: { wishlist: ProductId },
    }
  ).exec();
  
  res.json({ok:true});
}


const getCartFromDb= async(req,res)=>{

  const cartDetails= await Cart.findOne({user:objectId(req.user._id)})
  res.json(cartDetails)

}






module.exports = {
  getUsers,
  registerUser,
  loginUser,
  updateUserProfile,
  getUserProfile,
  writeReview,
  getUser,
  updateUser,
  deleteUser,
  applyCouponCart,
  getForgotPassword,
  resetPassword,
  resetPasswords,
  getCartContentBackend,
  showWishlist,
  addWishlist,
  removeWishlist,
  getCartFromDb,
};
