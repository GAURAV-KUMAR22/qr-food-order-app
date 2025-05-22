import React from "react";
import { Link } from "react-router-dom";
import { CardDetails } from "../CardDetails";
export const CardView = ({
  products,
  addToCarts,
  hideAddToCard,
  stock,
  fixedStock,
  cardCss,
  css,
}) => {
  return (
    <div
      className={`${css} capitalize `}
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {Object.keys(products)?.map((categoryName) => (
        <div key={categoryName} className="category-section">
          <div className="flex justify-between px-4 py-2">
            <h2 className="text-sm font-semibold">{categoryName}</h2>
            <Link
              to={`/${categoryName}`}
              state={{ items: products[categoryName] }}
              className="text-blue-500"
            >
              See More
            </Link>
          </div>

          {/* Filtered Item  */}
          <div
            className={`flex overflow-x-auto  space-x-4 px-4 ${css}`}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {products[categoryName]?.map((product) => (
              <div
                key={product._id}
                className="min-w-[150px] h-[220px] flex-shrink-0"
              >
                <CardDetails
                  key={product._id}
                  id={product._id}
                  category={product.categoryId?.name}
                  dishName={product.name}
                  price={product.price || 100}
                  qty={product.quantity} // Adjusted to use `quantity`
                  image={product.imageUrl}
                  product={product}
                  button={hideAddToCard}
                  css={cardCss}
                  stock={product.quantity ? product.quantity : 0}
                  fixedStock={product.totelQuantity ? product.totelQuantity : 0}
                  data={product}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
