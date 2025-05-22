import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PrivateAxios from "../../Services/PrivateAxios";
import { CardDetails } from "../../components/CardDetails";
import publicAxios from "../../Services/PublicAxios";
import { BsBoxArrowInDownLeft, BsBoxArrowInUp } from "react-icons/bs";
import { TbCategoryPlus } from "react-icons/tb";
import { MdAttachMoney } from "react-icons/md";
import { StatCard } from "../../components/Admin/StatCard";
import { socket } from "../../Services/Socket";
import { playNotificationSound } from "../../Util/PlaySound";
import { CardView } from "../../components/Client/CardView";

export const DashBoardPage = () => {
  const [products, setProducts] = useState([]);
  const [AllOrders, setAllOrders] = useState([]);
  const [AllSales, setAllSales] = useState([]);
  const [AllCategory, setAllCategory] = useState([]);
  const [todayOrders, setTodayOrders] = useState([]);
  const [SelingData, setSellingData] = useState([]);

  // fetch All Products
  useEffect(() => {
    socket.emit("join-admin");
    const fetchData = async () => {
      try {
        const responce = await PrivateAxios.get("/products");
        if (responce.status !== 200) {
          throw new Error({ message: "responce failed" });
        }
        setProducts(responce.data.data); // Set fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchedBestSellingItem = async () => {
      const response = await PrivateAxios.get("/sales/best-selling-item");
      if (response.status === 200) {
        setSellingData(response.data.content);
      }
    };
    fetchedBestSellingItem();
  }, []);

  const updatedSellingData = SelingData.map((item) => {
    return {
      ...item,
      category: "Best-Selling", // ✅ Adds a new field
      // or override nested field:
      categoryId: {
        ...item.categoryId,
        name: "Best-Selling", // ✅ Updates the existing nested name
      },
    };
  });

  const grouped = updatedSellingData.reduce((acc, item) => {
    const category = item.category || "Uncategorized";

    if (!acc[category]) {
      acc[category] = []; // ✅ Initialize array
    }

    acc[category].push(item); // ✅ Now safely push the item

    return acc; // ✅ Don't forget to return accumulator
  }, {});

  // Fetch All orders
  useEffect(() => {
    const controller = new AbortController();

    const fetchOrder = async () => {
      try {
        const response = await publicAxios.get("/orders/active-orders", {
          signal: controller.signal,
        });

        if (response.status !== 200) {
          throw new Error("Response failed");
        }

        setAllOrders(response.data.content);
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error("Fetching orders failed:", err);
        }
      }
    };
    fetchOrder();
    socket.emit("join-admin");
    const handleOrderUpdate = (data) => {
      playNotificationSound();
      fetchOrder();
    };
    socket.on("placed-order", handleOrderUpdate);

    return () => {
      controller.abort();
      socket.off("placed-order", handleOrderUpdate); // Remove specific callback
    };
  }, []);

  // Fetch sale
  useEffect(() => {
    const controller = new AbortController();
    const fetchedOrder = async () => {
      const responce = await PrivateAxios.get("/sales", {
        signal: controller.signal,
      });
      if (responce.status !== 200) {
        throw new Error({ message: "responce failed" });
      }
      setAllSales(responce.data.content);
    };
    fetchedOrder();
    return () => {
      controller.abort();
    };
  }, []);

  // fetch category
  useEffect(() => {
    const controller = new AbortController();
    const fetchedOrder = async () => {
      const responce = await publicAxios.get("/products/category", {
        signal: controller.signal,
      });
      if (responce.status !== 200) {
        throw new Error({ message: "responce failed" });
      }
      setAllCategory(responce.data.content);
    };
    fetchedOrder();
    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const fetchingTodayorders = async () => {
      try {
        const todatOrders = await publicAxios.get("/orders/today-orders");
        setTodayOrders(todatOrders.data.content);
      } catch (error) {
        throw new Error({ messsage: "Responce failed" });
      }
    };
    fetchingTodayorders();
  }, []);

  // Today ORders
  const today = new Date().toISOString().split("T")[0];
  const todaysOrders = todayOrders.filter((order) => {
    const orderDate = new Date(order.placedAt).toISOString().split("T")[0];
    return orderDate === today;
  });

  const categorywise = todaysOrders?.reduce((acc, item) => {
    const orderStatus = item.status;

    if (!acc[orderStatus]) {
      acc[orderStatus] = [];
    }

    acc[orderStatus].push(item);
    return acc;
  }, {});

  // Pending Orders
  const pendingOrders = AllOrders.filter(
    (order) => order.status === "pending" || order.status === "processing"
  );

  // set deta According category
  const groupedProducts = products.reduce((acc, product) => {
    const categoryName = product.categoryId?.name || "Uncategorized";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(product);
    return acc;
  }, {});

  return (
    <div className="w-[100%] min-w-[375px] relative">
      <div>
        <img
          src="/assets/image1.jpg"
          alt="logo"
          className="w-full h-full object-cover min-w-[100%] max-h-[250px]"
        ></img>
      </div>

      <div className="mt-[20px] grid mb-4 grid-cols-2  md:grid-cols-4  sm:gap-6">
        <StatCard
          name={"Today Orders"}
          value={todaysOrders}
          imageName={<BsBoxArrowInUp size={40} />}
          route={"/admin/today-orders"}
          items={categorywise}
        />
        <StatCard
          name={"Pending Orders"}
          value={pendingOrders}
          imageName={<BsBoxArrowInDownLeft size={40} />}
          route={"/admin/pending-orders"}
        />
        <StatCard
          name={"Total Sale"}
          value={AllSales ? AllSales : 0}
          imageName={<MdAttachMoney size={40} />}
          route={"/admin/totelsale"}
        />
        <StatCard
          name={"Total Category"}
          value={AllCategory ? AllCategory : 0}
          imageName={<TbCategoryPlus size={40} />}
          route={"/admin/Category"}
        />
      </div>

      {/* <Link to={'/admin/data-visualize'}>
                <h2 className='flex flex-row text-center bg-green-200 h-9 justify-center items-center'>Graphical Persentation</h2>
            </Link> */}

      <CardView products={grouped} hideAddToCard={true} />

      <CardView
        products={groupedProducts}
        hideAddToCard={true}
        cardCss={"h-[245px]"}
        css={"category-section mb-4 h-[250px]"}
      />

      {/* Admin Actions - naturally placed at the bottom of content */}
      <div className="fixed top-[85%] left-0 right-0  w-[98%] mx-auto mt-0 mb-0 bg-blend-saturation">
        <div className="min-w-[343px] gap-[8px] lg:w-[99%] overflow-hidden flex flex-col">
          <div className="w-full bg-[#F9D718] h-[48px] text-center p-1 rounded">
            <Link to="/admin/createProduct" className="font-semibold">
              Create New Item
            </Link>
          </div>
          <div className="w-full h-[48px] text-center p-2 rounded bg-gray-200 mt-1">
            <Link to="/admin/category" className="font-semibold">
              Create New Category
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
