import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const ProductDetails = () => {

  const {id} = useParams();

    const consumerKey = import.meta.env.VITE_CK;
    const consumerSecret = import.meta.env.VITE_CS;
    const websiteURL = "https://coral-chough-451794.hostingersite.com";
    const getproducts = "products";
  
    const wooURL = `${websiteURL}/wp-json/wc/v3/${getproducts}/${id}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;
  
    const [productData, setProductData] = useState({});
  
      const fetchProductDetails = async () => {
        try {
          const res = await fetch(wooURL);
          const result = await res.json();
          console.log(result);
          setProductData(result);
        } catch (err) {
          console.log(err);
        }
      };
  
    useEffect(() => {
      fetchProductDetails();
    }, [id]);

  return (
    <>
      <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-5xl lg:grid-cols-2 lg:gap-8 lg:px-8">
        <img
          alt={productData.name}
          src={productData.images?.[0]?.src}
          className="row-span-2 aspect-4/5 size-full object-cover sm:rounded-lg lg:aspect-3/4"
        />
        <div>
        <h1 className='mt-6 text-lg font-medium text-gray-900'>{productData.name}</h1>
        <span>{productData.stock_status}</span>
        <p className='mt-6 mb-6'>{productData.description?.replace(/<[^>]+>/g, "")}</p>
        <span className='text-lg font-medium text-gray-900'>${productData.price}</span>

        </div>

      </div>
    </>
  )
}

export default ProductDetails
