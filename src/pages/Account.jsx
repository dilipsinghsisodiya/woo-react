import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// --- Icon Components for a clean, modern UI ---
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);
const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);
const EmailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const RefreshIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
    />
  </svg>
);

const Account = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    name: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const { user, login } = useContext(AuthContext);

  // --- API details ---
  const siteUrl = "https://coral-chough-451794.hostingersite.com";
  const consumerKey = import.meta.env.VITE_CK;
  const consumerSecret = import.meta.env.VITE_CS;

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // --- Combined Login/Register Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isRegister) {
        const response = await fetch(
          `${siteUrl}/wp-json/wc/v3/customers?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: formData.email,
              username: formData.username,
              password: formData.password,
              first_name: formData.name,
            }),
          }
        );
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Registration failed.");
        setMessage("🎉 Registration successful! Please log in.");
        setIsRegister(false);
      } else {
        const res = await fetch(`${siteUrl}/wp-json/jwt-auth/v1/token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.token)
          throw new Error(data.message || "Login failed.");
        const customerRes = await fetch(
          `${siteUrl}/wp-json/wc/v3/customers?email=${data.user_email}&consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`
        );
        const customers = await customerRes.json();
        if (!customers.length) throw new Error("Customer account not found.");
        login(customers[0], data.token);
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${siteUrl}/wp-json/wc/v3/orders?customer=${user.id}&status=any&consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch orders.");
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchOrders();
    setMessage("");
  }, [user]);

  // --- Logged Out View: Login/Register Form ---
  if (!user) {
    return (
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            {isRegister ? "Create a new account" : "Sign in to your account"}
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {isRegister && (
              <>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <UserIcon />
                  </span>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <EmailIcon />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email address"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
              </>
            )}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <UserIcon />
              </span>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="Username"
                required
                value={formData.username}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
              />
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <LockIcon />
              </span>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
              />
            </div>
            {message && (
              <p className="text-center text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {message}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
            >
              {loading ? "Processing..." : isRegister ? "Register" : "Sign in"}
            </button>
          </form>
          <p className="mt-10 text-center text-sm text-gray-500">
            {isRegister ? "Already a member?" : "Not a member?"}{" "}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setMessage("");
              }}
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              {isRegister ? "Sign In" : "Register Now"}
            </button>
          </p>
        </div>
      </div>
    );
  }

  // --- Logged In View: The New Modern Dashboard ---
  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome, {user.first_name || user.username}!
          </h1>
          <p className="mt-1 text-md text-gray-600">
            Here's a summary of your account and order history.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Account Details
              </h2>
            </div>
            <div className="border-t border-gray-200 px-6 py-5">
              <dl className="grid grid-cols-1 gap-y-4 text-sm">
                <div className="flex justify-between">
                  <dt className="font-medium text-gray-500">User ID</dt>
                  <dd className="text-gray-900">{user.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium text-gray-500">Username</dt>
                  <dd className="text-gray-900">{user.username}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium text-gray-500">Full Name</dt>
                  <dd className="text-gray-900">
                    {user.first_name} {user.last_name}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium text-gray-500">Email</dt>
                  <dd className="text-gray-900">{user.email}</dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg">
            <div className="flex justify-between items-center p-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Your Orders
              </h2>
              <button
                onClick={fetchOrders}
                disabled={loading}
                className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-sm"
              >
                <RefreshIcon />
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
            {orders.length > 0 ? (
              <ul role="list" className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-base font-semibold text-indigo-600">
                        Order #{order.number}
                      </p>
                      <p
                        className={`text-xs font-medium capitalize px-2.5 py-1 rounded-full ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "processing" ||
                              order.status === "on-hold"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status}
                      </p>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      {order.line_items.map((item) => (
                        <li key={item.id}>
                          {item.name} × {item.quantity}
                        </li>
                      ))}
                    </div>

                    <div className="mt-3 sm:flex sm:justify-between text-sm text-gray-600">
                      <p>
                        Date:{" "}
                        {new Date(order.date_created).toLocaleDateString()}
                      </p>
                      <p className="mt-2 sm:mt-0">
                        Total:{" "}
                        <span className="font-medium text-gray-900">
                          ${order.total}
                        </span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-16 px-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  You haven't placed any orders yet.
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  When you place an order, it will appear here.
                </p>
              </div>
            )}
            {error && <p className="text-center text-red-500 p-4">{error}</p>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Account;
