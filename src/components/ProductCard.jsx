import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const ProductCard = ({
  productURL,
  productImg,
  productName,
  productPrice,
  productStock,
  productAddToCart,
  product,
}) => {

  return (
    <>
      <div className="grid grid-cols-1 gap-4 p-5">
        <Link to={productURL} className="group">
          <img
            alt={productName}
            src={productImg}
            className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
          />
          <h3 className="mt-4 text-sm text-gray-700">{productName}</h3>
          {productStock == "instock" ? (
            <p className="mt-1 text-lg font-medium text-gray-900">
              ${productPrice == "" ? "0" : productPrice}
            </p>
          ) : (
            <p className="mt-1 text-lg font-medium text-gray-900">
              Out of Stock
            </p>
          )}
        </Link>

        <button
          onClick={() => {
            productAddToCart(product);
          }}
          className="mt-6 bg-indigo-600 hover:bg-black text-white font-bold py-2 px-4 rounded transition duration-200 cursor-pointer"
        >
          ADD TO CART
        </button>
      </div>
    </>
  );
};

export default ProductCard;
