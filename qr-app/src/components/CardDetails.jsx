import React, { useRef, useState } from "react";
import "../Pages/Clients/Home.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthProvider";

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
}) => {
  const backendUrl =
    import.meta.env.MODE === "Production"
      ? import.meta.env.VITE_BACKEND_PROD
      : import.meta.env.VITE_BACKEND_DEV;
  const [selected, setSelected] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const totelStock = fixedStock ? fixedStock : 0;
  let stockTag;

  if (stock === 0) {
    stockTag = "OutOfStock";
  } else if (stock <= (totelStock / 100) * 10) {
    console.log("stock", stock);
    stockTag = "lowStock";
  } else {
    stockTag = "InStock";
  }
  console.log(stock);
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
      <div className="flex flex-col items-center justify-center pt-2 px-2 pb-2">
        <img
          src={`${backendUrl}/${image}`}
          alt="food"
          className="w-[80px] h-[80px] object-cover rounded-full"
        />
        <h3 className="text-sm font-medium tracking-tighter mt-2 text-center">
          {dishName}
        </h3>
        <p className="font-bold text-xs mt-1 text-center">Rs. {price}/-</p>
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
