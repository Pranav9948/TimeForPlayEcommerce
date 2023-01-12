const express = require('express')
const router = express.Router()
const { verifyIsLoggedIn, verifyIsAdmin } = require("../middleware/verifyAuthToken");
const {
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
  addWishlist,
  showWishlist,
  removeWishlist,
  getCartFromDb,
} = require("../controllers/userController");

router.post("/register", registerUser)
router.post("/login", loginUser)

router.post('/coupon',applyCouponCart)
router.post('/forgotPassword',getForgotPassword)
router.get("/reset-password/:id/:token",resetPassword);
router.post("/reset-password/:id/:token", resetPasswords);

// user logged in routes:
router.use(verifyIsLoggedIn);
router.put("/profile", updateUserProfile);
router.get('/profile/:id', getUserProfile)
router.post('/review/:productId', writeReview)
router.post("/cartContent",getCartContentBackend);
router.get('/cartFromDb',getCartFromDb)

router.get("/user/wishlist/:userId", showWishlist);
router.post("/user/wishlist",addWishlist);
router.put("/user/wishlist/:productId", removeWishlist);





// admin routes:
router.use(verifyIsAdmin);
router.get("/", getUsers)
router.get("/:id", getUser);
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)


module.exports = router