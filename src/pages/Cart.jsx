import React, { useContext } from "react";
import { CartContext } from "../Context/CartContext";
import { Link } from "react-router-dom";

// SVG components for icons - this makes the buttons cleaner
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const MinusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
  </svg>
);

const Cart = () => {
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);

  // Use .reduce() for a cleaner way to calculate the total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
        Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12 px-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900">Your cart is empty.</h3>
          <p className="mt-2 text-sm text-gray-500">
            Looks like you haven't added anything to your cart yet.
          </p>
          <div className="mt-6">
            <Link
              to="/" // Assuming your product page is the root
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg">
          <ul role="list" className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <li key={item.id} className="flex items-center p-4 sm:p-6">
                {/* Image */}
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={item.images?.[0]?.src || 'https://via.placeholder.com/150'}
                    alt={item.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                {/* Name, Attributes, and Price */}
                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>{item.name}</h3>
                      <p className="ml-4 font-semibold text-indigo-600">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    {item.attributes?.length > 0 && (
                       <p className="mt-1 text-sm text-gray-500">{item.attributes[0].option}</p>
                    )}
                     <p className="mt-1 text-sm text-gray-500">${Number(item.price).toFixed(2)} each</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-1 items-center justify-start text-sm mt-4">
                    <div className="flex items-center border border-gray-200 rounded">
                       <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-gray-500 hover:bg-gray-100 transition-colors"
                        aria-label="Remove one item"
                      >
                        <MinusIcon />
                      </button>
                      <span className="px-4 py-1 text-gray-700">{item.quantity}</span>
                      <button
                        onClick={() => addToCart(item)}
                        className="p-2 text-gray-500 hover:bg-gray-100 transition-colors"
                        aria-label="Add one item"
                      >
                        <PlusIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          {/* Order summary */}
          <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
            <div className="flex justify-between text-lg font-medium text-gray-900">
              <p>Total</p>
              <p>${totalPrice.toFixed(2)}</p>
            </div>
            <p className="mt-1 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
            <div className="mt-6">
               <Link to="/checkout"
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;