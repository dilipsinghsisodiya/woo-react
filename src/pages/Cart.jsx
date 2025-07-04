import React, { useContext, useState } from "react";
import { CartContext } from "../Context/CartContext";

const Cart = () => {
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  let totalPrice = 0;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item) => {
            totalPrice = item.price * item.quantity + totalPrice;
            return (
              <li
                key={item.id}
                className="border-b py-2 grid grid-cols-[1fr_1fr_auto]"
              >
                <span>
                  {item.name}{" "}
                  {item.attributes?.length > 0 &&
                    `- ${item.attributes[0].option}`}
                </span>
                <div className="w-[100px] grid grid-cols-3 place-items-center">
                  <span
                    className="w-5 h-5 bg-red-400 rounded-full cursor-pointer grid place-content-center"
                    onClick={() => removeFromCart(item.id)}
                  >
                    -
                  </span>
                  <span>{item.quantity}</span>
                  <span
                    className="w-5 h-5 bg-green-400 rounded-full cursor-pointer grid place-content-center"
                    onClick={() => addToCart(item)}
                  >
                    +
                  </span>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            );
          })}
          <li className="py-2 flex justify-end">
            <span>Total: ${totalPrice}</span>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Cart;
