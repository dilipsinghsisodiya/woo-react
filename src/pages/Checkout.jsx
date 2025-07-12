import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../Context/CartContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useContext(CartContext); 
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [user, setUser] = useState(null);
  const [billing, setBilling] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zip: "",
  });

  // ZIP code regex: 4 to 10 digits
  const zipRegex = /^[0-9]{4,10}$/;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/account");
      return;
    }

    if (cartItems.length === 0 && !orderPlaced) {
      navigate("/cart");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    setBilling((prev) => ({
      ...prev,
      firstName: parsedUser.first_name || "",
      lastName: parsedUser.last_name || "",
      email: parsedUser.email || "",
    }));
  }, [navigate, cartItems]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBilling((prev) => ({ ...prev, [name]: value }));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!zipRegex.test(billing.zip)) {
      alert("❌ ZIP code must be 4 to 10 digits.");
      return;
    }

    if (!user?.id || isNaN(user.id)) {
      alert("❌ Invalid user. Please log in again.");
      navigate("/account");
      return;
    }

    try {
      const line_items = cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        variation_id: item.variation_id || undefined,
      }));

      const orderData = {
        customer_id: user.id,
        payment_method: "cod",
        payment_method_title: "Cash on Delivery",
        set_paid: false,
        billing: {
          first_name: billing.firstName,
          last_name: billing.lastName,
          email: billing.email,
          address_1: billing.address,
          city: billing.city,
          postcode: billing.zip,
          country: "US",
        },
        shipping: {
          first_name: billing.firstName,
          last_name: billing.lastName,
          address_1: billing.address,
          city: billing.city,
          postcode: billing.zip,
          country: "US",
        },
        line_items,
      };

      const res = await fetch(
        `https://coral-chough-451794.hostingersite.com/wp-json/wc/v3/orders?consumer_key=ck_fe67442e96003d71eb94e2df36ad47bf8684b255&consumer_secret=cs_f67c0e3743682d995f0041c6f9a17090db4d75e7`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Order Error:", data);
        alert("❌ Failed to place order. Please try again.");
        return;
      }

      alert("✅ Order placed successfully!");
      setOrderPlaced(true);
      clearCart();
      navigate("/account");
    } catch (error) {
      console.error("Order Submission Error:", error);
      alert("❌ An unexpected error occurred.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold">Billing Details</h2>
          <input name="firstName" placeholder="First Name" value={billing.firstName} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
          <input name="lastName" placeholder="Last Name" value={billing.lastName} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
          <input name="email" type="email" placeholder="Email" value={billing.email} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
          <input name="address" placeholder="Address" value={billing.address} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
          <input name="city" placeholder="City" value={billing.city} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
          <input name="zip" placeholder="ZIP Code" value={billing.zip} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Place Order</button>
        </form>

        <div className="bg-gray-50 p-6 rounded">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <ul className="space-y-2">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <hr className="my-4" />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;