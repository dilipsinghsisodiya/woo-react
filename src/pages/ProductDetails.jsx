import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { slug } = useParams();

  const consumerKey = import.meta.env.VITE_CK;
  const consumerSecret = import.meta.env.VITE_CS;
  const websiteURL = "https://coral-chough-451794.hostingersite.com";

  const wooURL = `${websiteURL}/wp-json/wc/v3/products?slug=${slug}&consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;

  const [productData, setProductData] = useState({});

  const fetchProductDetails = async () => {
    try {
      const res = await fetch(wooURL);
      const result = await res.json();
      console.log(result);
      setProductData(result[0]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [slug]);

  return (
    <>
      <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-5xl lg:grid-cols-2 lg:gap-8 lg:px-8">
        <img
          alt={productData.name}
          src={productData.images?.[0]?.src}
          className="row-span-2 aspect-4/5 size-full object-cover sm:rounded-lg lg:aspect-3/4"
        />
        <div>
          <h1 className="mt-6 text-lg font-medium text-gray-900">
            {productData.name}
          </h1>
          <span>Category: {productData.categories?.[0]?.name}</span>
          <p className="mt-6 mb-6">
            {productData.short_description?.replace(/<[^>]+>/g, "")}
          </p>
          <span className="text-lg font-medium text-gray-900">
            {productData.stock_status == "instock" ? (
              <p className="mt-1 text-lg font-medium text-gray-900">
                ${productData.price == "" ? "0" : productData.price}
              </p>
            ) : (
              <p className="mt-1 text-lg font-medium text-gray-900">
                Out of Stock
              </p>
            )}
          </span>
        </div>
      </div>

      <div className="mx-auto mt-6 mb-12 max-w-2xl sm:px-6 lg:grid lg:max-w-5xl lg:grid-cols-1 lg:gap-2 lg:px-8">
        <h1 className="mt-6 text-lg font-medium text-gray-900">Description:</h1>
        <p>
          {productData.description?.replace(/<[^>]+>/g, "")}
        </p>
      </div>
    </>
  );
};

export default ProductDetails;
