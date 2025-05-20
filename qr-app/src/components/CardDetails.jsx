import React, { useRef, useState } from "react";
import "../Pages/Clients/Home.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthProvider";
import StarIcons from "react-rating-stars-component";
import publicAxios from "../Services/PublicAxios";

export const CardDetails = ({
  dishName,
  price,
  category,
  id,
  onAddToCart,
  image,
  product,
  css,
  button,
  stock,
  fixedStock,
  data,
  ratingValue,
}) => {
  const backendUrl =
    import.meta.env.VITE_MODE === "Production"
      ? import.meta.env.VITE_BACKEND_PROD
      : import.meta.env.VITE_BACKEND_DEV;
  const [selected, setSelected] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const totelStock = fixedStock ? fixedStock : 0;
  let stockTag;

  async function ratingChanged(newRating) {
    const userId = await JSON.parse(localStorage.getItem("user"));

    const responce = await publicAxios.post("/products/rating", {
      productId: id,
      userId: userId._id,
      rating: newRating,
    });
    console.log(responce);
  }

  if (stock === 0) {
    stockTag = "OutOfStock";
  } else if (stock <= (totelStock / 100) * 10) {
    console.log("stock", stock);
    stockTag = "lowStock";
  } else {
    stockTag = "InStock";
  }

  return (
    <div
      className={`flex flex-col justify-end shadow-md hover:scale-105 ${css} my-0 sm:w-[190px]`}
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {/* Stock tag aligned top-right using flex */}
      {isAuthenticated && stock >= 0 && (
        <div className="flex justify-end w-full px-1 mt-0.5 pt-2">
          <div
            className={`px-2 py-1.5 text-xs font-medium rounded-xl
              ${
                stockTag === "OutOfStock"
                  ? "bg-[#DC3545]"
                  : stockTag === "lowStock"
                  ? "bg-[#FFA500]"
                  : "bg-[#1DB954] text-white"
              }`}
          >
            {stockTag}
            <span className="font-medium"> ({stock})</span>
          </div>
        </div>
      )}

      {/* Content wrapper */}
      <div className="flex flex-col items-center justify-center pt-2 px-2 pb-1">
        <img
          src={`${backendUrl}/${image}`}
          alt="food"
          className="w-[80px] h-[80px] object-cover rounded-full"
        />
        <h3 className="text-sm font-medium tracking-tighter mt-2 text-center capitalize">
          {dishName}
        </h3>
        <p className="font-bold text-xs mt-1 text-center capitalize">
          Rs. {price}/-
        </p>
        <StarIcons
          count={5}
          onChange={ratingChanged}
          size={20}
          isHalf={true}
          emptyIcon={<i className="far fa-star"></i>}
          halfIcon={<i className="fa fa-star-half-alt"></i>}
          fullIcon={<i className="fa fa-star"></i>}
          activeColor="#ffd700"
          value={ratingValue}
        />
      </div>

      {/* Buttons */}
      {!button && (
        <button
          className={`${
            stock === 0 ? "pointer-events-none opacity-50" : ""
          } w-[85%] font-semibold bg-yellow-300 mb-2 rounded-sm h-[35px] justify-center mx-auto mt-1`}
          onClick={() => onAddToCart(category, id, price)}
        >
          Add to cart
        </button>
      )}
      {button && (
        <Link
          className="border w-[85%] mb-2 flex font-semibold rounded-sm h-[35px] justify-center mx-auto mt-1"
          to={"/admin/createProduct"}
          state={{ product: data }}
        >
          Edit
        </Link>
      )}
    </div>
  );
};
