import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { CartContext } from "../Context/CartContext";
import Loader from "../components/Loader"

const ProductDetails = () => {
  const { slug } = useParams();
  const { addToCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);

  const consumerKey = import.meta.env.VITE_CK;
  const consumerSecret = import.meta.env.VITE_CS;
  const websiteURL = "https://coral-chough-451794.hostingersite.com";

  const wooURL = `${websiteURL}/wp-json/wc/v3/products?slug=${slug}&consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;

  const [productData, setProductData] = useState({});

  useEffect(() => {
    fetchProductDetails();
  }, [slug]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(wooURL);
      const result = await res.json();
      console.log(result);
      setProductData(result[0]);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-5xl lg:grid-cols-2 lg:gap-8 lg:px-8 p-5">
            <img
              alt={productData.name}
              src={productData.images?.[0]?.src}
              className="row-span-2 aspect-4/5 size-full object-cover sm:rounded-lg lg:aspect-3/4"
            />
            <div>
              <h1 className="mt-6 mb-2 font-medium text-gray-900 text-4xl">
                {productData.name}
              </h1>
              <span>
                <span className="font-bold">Category: </span>
                {productData.categories?.[0]?.name}
              </span>
              <p className="mt-2 mb-6">
                {productData.short_description?.replace(/<[^>]+>/g, "")}
              </p>
              <span className="font-medium text-gray-900">
                {productData.stock_status == "instock" ? (
                  <p className="mt-1 font-medium text-gray-900 text-3xl">
                    ${productData.price == "" ? "0" : productData.price}
                  </p>
                ) : (
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    Out of Stock
                  </p>
                )}
              </span>
              <Link to="/cart">
                <button
                  onClick={() => {
                    addToCart(productData);
                  }}
                  className="mt-6 bg-indigo-600 hover:bg-black text-white font-bold py-2 px-4 rounded transition duration-200 cursor-pointer"
                >
                  ADD TO CART
                </button>
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-6 mb-12 max-w-2xl sm:px-6 lg:grid lg:max-w-5xl lg:grid-cols-1 lg:gap-2 lg:px-8 p-5 pt-0">
            <h1 className="mt-6 text-lg text-gray-900 font-bold">
              Description:
            </h1>
            <p>{productData.description?.replace(/<[^>]+>/g, "")}</p>
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetails;
