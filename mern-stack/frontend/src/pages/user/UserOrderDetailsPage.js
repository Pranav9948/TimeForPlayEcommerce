import UserOrderDetailsPageComponent from "./components/UserOrderDetailsPageComponent";
import { useSelector } from "react-redux";
import axios from "axios";
import { loadScript } from "@paypal/paypal-js";

const getOrder = async (orderId) => {
  const { data } = await axios.get("/api/orders/user/" + orderId);
  return data;
};

const loadPayPalScript = (
  priceAfterDiscount,
  cartSubtotal,
  cartItems,
  orderId,
  updateStateAfterOrder
) => {
  console.log("p2", priceAfterDiscount);

  loadScript({
    "client-id":
      "ARMFhbrI9qlm1rsHFOtoZVMmW5JqyMBS6LFfIQVTHf-6S7BwruZb0MCby4S74n3huktBXN6GHgK3kw64",
  })
    .then((paypal) => {
      paypal
        .Buttons(
          buttons(
            priceAfterDiscount,
            cartSubtotal,
            cartItems,
            orderId,
            updateStateAfterOrder
          )
        )
        .render("#paypal-container-element");
    })
    .catch((err) => {
      console.error("failed to load the PayPal JS SDK script", err);
    });
};

const buttons = (
  priceAfterDiscount,
  cartSubtotal,
  cartItems,
  orderId,
  updateStateAfterOrder
) => {
  console.log("p3", priceAfterDiscount);
  let finalAmount = priceAfterDiscount.length ? priceAfterDiscount : cartSubtotal;
  let rounded = Math.round(finalAmount)
  console.log('c3', cartSubtotal)
  console.log(rounded + "sdfdsfsdf")
  return {
    createOrder: function (data, actions) {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: Number(rounded),
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: Number(rounded),
                },
              },
            },
            items: cartItems.map((product) => {
              return {
                name: product.name,
                unit_amount: {
                  currency_code: "USD",
                  value: product.price,
                },
                quantity: product.quantity,
              };
            }),
          },
        ],
      });
    },
    onCancel: onCancelHandler,
    onApprove: function (data, actions) {
      return actions.order.capture().then(function (orderData) {
        var transaction = orderData.purchase_units[0].payments.captures[0];
        if (
          transaction.status === "COMPLETED" &&
          Number(transaction.amount.value) === Number(rounded)
        ) {
          updateOrder(orderId)
            .then((data) => {
              if (data.isPaid) {
                updateStateAfterOrder(data.paidAt);
              }
            })
            .catch((er) => console.log(er));
        }
      });
    },
    onError: onErrorHandler,
  };
};

const onCancelHandler = function () {
  console.log("cancel");
};

const onErrorHandler = function (err) {
  console.log("error");
};

const updateOrder = async (orderId) => {
  const { data } = await axios.put("/api/orders/paid/" + orderId);
  return data;
};

const UserOrderDetailsPage = () => {
  const userInfo = useSelector((state) => state.userRegisterLogin.userInfo);

  const getUser = async () => {
    const { data } = await axios.get("/api/users/profile/" + userInfo._id);
    return data;
  };

  return (
    <UserOrderDetailsPageComponent
      userInfo={userInfo}
      getUser={getUser}
      getOrder={getOrder}
      loadPayPalScript={loadPayPalScript}
    />
  );
};

export default UserOrderDetailsPage;
