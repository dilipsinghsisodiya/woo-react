import React, { useContext, useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { CartContext } from "../Context/CartContext";
import Loader from "../components/Loader";

const Products = () => {
  const { addToCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);

  const consumerKey = import.meta.env.VITE_CK;
  const consumerSecret = import.meta.env.VITE_CS;
  const websiteURL = "https://coral-chough-451794.hostingersite.com";

  const wooURL = `${websiteURL}/wp-json/wc/v3/products?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;

  const [data, setData] = useState([]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(wooURL);
      const result = await res.json();

      setData(result);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <h2 className="sr-only">Products</h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {data.map((product) => (
                <ProductCard
                  key={product.id}
                  productURL={`/product/${product.slug}`}
                  productName={product.name}
                  productPrice={product.price}
                  productImg={product.images?.[0]?.src}
                  productDesc={product.description.replace(/<[^>]+>/g, "")}
                  productStock={product.stock_status}
                  product={product}
                  productAddToCart={addToCart}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Products;
