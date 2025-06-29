import React from 'react'
import { Link } from 'react-router-dom'

const ProductCard = ({ productURL, productImg, productName, productPrice, productStock }) => {
  return (
    <>
      <Link to={productURL} className="group">
        <img
          alt={productName}
          src={productImg}
          className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
        />
        <h3 className="mt-4 text-sm text-gray-700">{productName}</h3>
        {
          productStock == "instock"
            ?
            <p className="mt-1 text-lg font-medium text-gray-900">${productPrice == '' ? "0" : productPrice}</p>
            :
            <p className="mt-1 text-lg font-medium text-gray-900">Out of Stock</p>
        }
      </Link>
    </>
  )
}

export default ProductCard