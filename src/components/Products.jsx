import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
    toast.success("Added to cart");
  };

  useEffect(() => {
    let componentMounted = true;
    const getProducts = async () => {
      setLoading(true);
      const response = await fetch("https://fakestoreapi.com/products/");
      if (componentMounted) {
        const fetchedData = await response.json();

        // mock stock availability
        const productsWithStock = fetchedData.map((stock) => ({
          ...stock,
          inStock: Math.random() > 0.3 // 70% in stock
        }));

        setData(productsWithStock);
        setFilter(productsWithStock);
        setLoading(false);
      }
      return () => {
        componentMounted = false;
      };
    };
    getProducts();
  }, []);

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      </>
    );
  };
  const filterProduct = (cat) => {
    if (cat === "all") {
      setFilter(data);
    } else {
      const updatedList = data.filter((item) => item.category === cat);
      setFilter(updatedList);
    }
  };

  const ShowProducts = () => (
    <>
      {filter.map((product) => (
        <div className="col-md-4 col-sm-6 mb-4"  id={product.id} key={product.id}>
          <div className="card h-100 text-center p-3 shadow-sm">
            <img
              src={product.image}
              className="card-img-top mx-auto"
              alt={product.title}
              style={{ height: "250px", objectFit: "contain" }}
            />
            <div className="card-body">
              <h5 className="card-title">
                {product.title.substring(0, 20)}...
              </h5>
              <p className="lead">${product.price}</p>

              {/* Size dropdown */}
              <div className="mb-3">
                <label htmlFor={`size-${product.id}`} className="form-label">
                  Size:
                </label>
                <select
                  id={`size-${product.id}`}
                  className="form-select"
                  disabled={!product.inStock}
                >
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>
              </div>

              {/* Action buttons */}
              {product.inStock ? (
                <>
                  <Link to={`/product/${product.id}`} className="btn btn-primary me-2">
                    Buy Now
                  </Link>
                  <button
                    className="btn btn-success"
                    onClick={() => addProduct(product)}
                  >
                    Add to Cart
                  </button>
                </>
              ) : (
                <button className="btn btn-secondary w-100" disabled>
                  Out of Stock
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Latest Products</h2>
      <div className="d-flex justify-content-center mb-4 flex-wrap">
        <button className="btn btn-outline-dark m-1" onClick={() => filterProduct("all")}>
          All
        </button>
        <button className="btn btn-outline-dark m-1" onClick={() => filterProduct("men's clothing")}>
          Men's Clothing
        </button>
        <button className="btn btn-outline-dark m-1" onClick={() => filterProduct("women's clothing")}>
          Women's Clothing
        </button>
        <button className="btn btn-outline-dark m-1" onClick={() => filterProduct("jewelery")}>
          Jewelery
        </button>
        <button className="btn btn-outline-dark m-1" onClick={() => filterProduct("electronics")}>
          Electronics
        </button>
      </div>
      <div className="row">
        {loading ? <Loading /> : <ShowProducts />}
      </div>
    </div>
  );
};

export default Products;
