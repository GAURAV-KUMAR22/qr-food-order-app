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
    <div className={`${css} my-5 capitalize`}  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

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

          <div className="flex overflow-x-auto space-x-4 px-4 scrollbar-hide">
            {products[categoryName]?.map((product) => (
              <div
                key={product._id}
                className="min-w-[150px] h-[280px] flex-shrink-0"
              >
                <CardDetails
                  id={product._id}
                  category={product.categoryId?.name}
                  dishName={product.name}
                  price={product.price}
                  image={product.imageUrl}
                  product={product}
                  button={hideAddToCard}
                  css={cardCss}
                  stock={product.quantity ?? 0}
                  fixedStock={product.totelQuantity ?? 0}
                  data={product}
                  onAddToCart={addToCarts}
                  ratingValue={product.rating ?? 0}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
