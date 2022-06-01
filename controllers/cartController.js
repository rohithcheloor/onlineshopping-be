const cart = require("../models/cartSchema");
const productVariant = require("../models/productVariantSchema");
const user = require("../models/userSchema");
const errorGenerator = require("../utils/errorGenerator");
const { validateToken } = require("../utils/tokenValidator");

const getCartData = async (req, res) => {
  const authToken = req.headers.authorization.split(" ")[1];
  const userData = await user.findOne({
    "authInfo.tokens.token": authToken,
  });
  const cartData = await cart.findOne({ userId: userData._id });
  if (cartData) {
    return cartData._id;
  } else {
    const createNewCart = await cart.create({
      userId: userData._id,
      cartItems: [],
    });
    return createNewCart._id;
  }
};

const addToCart = async (req, res) => {
  const isAuthorized = await validateToken(req);
  if (isAuthorized) {
    const cartId = await getCartData(req, res);
    const cartData = await cart.findById(cartId);
    if (req.body.productVariantId && req.body.quantity) {
      await productVariant.findById(req.body.productVariantId).then(
        async () => {
          const findExistingItem = cartData.cartItems.find(
            (item) => item.productVariantId === req.body.productVariantId
          );
          if (findExistingItem) {
            cartData.cartItems.forEach((item) =>
              item.productVariantId === req.body.productVariantId
                ? (item.quantity = Number(req.body.quantity))
                : null
            );
          } else {
            cartData.cartItems.push(req.body);
          }
          await cart.findOneAndUpdate({ _id: cartId }, cartData).then(
            () => {
              return res.status(200).json({
                success: true,
                message: "Product added to Cart!",
                data: cartData,
              });
            },
            (err) => {
              return res.status(404).json({
                success: false,
                message: errorGenerator(404, "cart"),
                err: err,
              });
            }
          );
        },
        (noProduct) => {
          return res.status(404).json({
            success: false,
            message: errorGenerator(404, "product"),
            err: noProduct,
          });
        }
      );
    } else {
      if (!req.body.quantity) {
        return res.status(404).json({
          success: false,
          message: errorGenerator(404, "cart"),
        });
      } else {
        return res.status(404).json({
          success: false,
          message: errorGenerator(404, "product"),
        });
      }
    }
  } else {
    return res.status(401).json({
      success: false,
      message: errorGenerator(401, "auth"),
    });
  }
};

module.exports = { addToCart };
