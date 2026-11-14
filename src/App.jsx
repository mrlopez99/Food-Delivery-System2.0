import { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const defaultFoods = [
  {
    id: 1,
    name: "Classic Burger",
    price: 120,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    price: 250,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600",
  },
  {
    id: 3,
    name: "Fried Chicken",
    price: 145,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600",
  },
  {
    id: 4,
    name: "French Fries",
    price: 75,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600",
  },
  {
    id: 5,
    name: "Pasta",
    price: 165,
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600",
  },
  {
    id: 6,
    name: "Iced Coffee",
    price: 95,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600",
  },
];

const money = (amount) => "₱" + Number(amount).toFixed(2);

function App() {
  // FOOD INPUTS
  const [foodName, setFoodName] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [foodImage, setFoodImage] = useState("");

  // CUSTOMER INFORMATION
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerLocation, setBuyerLocation] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  // FOOD DATA
  const [foods, setFoods] = useState(
    () => JSON.parse(localStorage.getItem("foods")) || defaultFoods,
  );

  // CART DATA
  const [cart, setCart] = useState(
    () => JSON.parse(localStorage.getItem("cart")) || [],
  );

  // ORDER DATA
  const [orders, setOrders] = useState(
    () => JSON.parse(localStorage.getItem("orders")) || [],
  );

  useEffect(() => {
    localStorage.setItem("foods", JSON.stringify(foods));
  }, [foods]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  // Continue with your existing functions below...

  const addFood = (e) => {
    e.preventDefault();

    if (!foodName.trim() || Number(foodPrice) <= 0) {
      alert("Please enter a valid food name and price.");
      return;
    }

    const newFood = {
      id: Date.now(),
      name: foodName.trim(),
      price: Number(foodPrice),
      image:
        foodImage.trim() ||
        "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=600",
    };

    setFoods([...foods, newFood]);

    setFoodName("");
    setFoodPrice("");
    setFoodImage("");

    alert("Food successfully added!");
  };

  const addToCart = (food) => {
    const existing = cart.find((item) => item.id === food.id);

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      );
    } else {
      setCart([...cart, { ...food, quantity: 1 }]);
    }

    alert(food.name + " added to cart!");
  };

  const updateQuantity = (id, amount) => {
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + amount } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // OPEN CUSTOMER CHECKOUT
  const checkout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setShowCheckoutForm(true);

    setTimeout(() => {
      document.getElementById("customer-checkout")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  // PLACE ORDER
  const placeOrder = (e) => {
    e.preventDefault();

    if (!buyerName.trim() || !buyerPhone.trim() || !buyerLocation.trim()) {
      alert("Please complete your customer information.");
      return;
    }

    // Generate order ID and date when customer submits
    // eslint-disable-next-line react-hooks/purity
    const orderId = Date.now();

    // eslint-disable-next-line react-hooks/purity
    const orderDate = new Date().toLocaleString();

    const newOrder = {
      id: orderId,
      date: orderDate,
      customerName: buyerName,
      phone: buyerPhone,
      location: buyerLocation,
      instructions: deliveryInstructions,
      items: cart.map((item) => ({ ...item })),
      total: total,
      status: "Pending",
    };

    setOrders((previousOrders) => [...previousOrders, newOrder]);
    setCart([]);

    setBuyerName("");
    setBuyerPhone("");
    setBuyerLocation("");
    setDeliveryInstructions("");
    setShowCheckoutForm(false);

    alert("Your order has been placed successfully!");

    document.getElementById("orders")?.scrollIntoView({
      behavior: "smooth",
    });
  };
  // ADD THIS
  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark custom-nav sticky-top">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#home">
            🍔 FAST DELICIOUS
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarMenu">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#home">
                  Home
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#menu">
                  Menu
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#add-food">
                  Add Food
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#cart">
                  Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#orders">
                  My Orders
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* HOME */}
      <section id="home" className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="hero-label">FRESH • FAST • DELICIOUS</p>
              <h1>
                Delicious Food <br />
                <span>Delivered To You!</span>
              </h1>
              <p className="hero-description">
                Enjoy your favorite meals anytime, anywhere. Choose your food
                and let us deliver happiness to your doorstep.
              </p>
              <a href="#menu" className="btn order-btn">
                ORDER NOW →
              </a>
            </div>

            <div className="col-md-6 text-center">
              <img
                className="hero-image"
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800"
                alt="Delicious food"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="container section-padding">
        <div className="section-title">
          <p>OUR DELICIOUS SELECTION</p>
          <h2>Food Menu</h2>
        </div>

        <div className="row g-4">
          {foods.map((food) => (
            <div className="col-md-4 col-sm-6" key={food.id}>
              <div className="food-card">
                <img src={food.image} alt={food.name} />

                <div className="food-info">
                  <h5>{food.name}</h5>

                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="food-price">{money(food.price)}</h5>

                    <button
                      className="btn add-btn"
                      onClick={() => addToCart(food)}
                    >
                      + Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ADD FOOD */}
      <section id="add-food" className="add-section section-padding">
        <div className="container">
          <div className="section-title">
            <p>MANAGE YOUR MENU</p>
            <h2>Add New Food</h2>
          </div>

          <form className="food-form" onSubmit={addFood}>
            <div className="mb-3">
              <label className="form-label">Food Name</label>
              <input
                className="form-control"
                type="text"
                placeholder="Enter food name"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Food Price (₱)</label>
              <input
                className="form-control"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Enter price"
                value={foodPrice}
                onChange={(e) => setFoodPrice(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Food Image URL</label>
              <input
                className="form-control"
                type="url"
                placeholder="Paste image URL (optional)"
                value={foodImage}
                onChange={(e) => setFoodImage(e.target.value)}
              />
            </div>

            <button className="btn add-food-btn" type="submit">
              + ADD FOOD
            </button>
          </form>
        </div>
      </section>

      {/* CART AND CHECKOUT */}
      <section id="cart" className="container section-padding">
        <div className="section-title">
          <p>YOUR SELECTED FOOD</p>
          <h2>My Cart</h2>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            Your cart is empty. Add food from our menu!
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div>
                  <h6>{item.name}</h6>
                  <p>{money(item.price)} each</p>
                </div>

                <div className="quantity-control">
                  <button onClick={() => updateQuantity(item.id, -1)}>−</button>

                  <strong>{item.quantity}</strong>

                  <button onClick={() => updateQuantity(item.id, 1)}>+</button>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>

                <strong>{money(item.price * item.quantity)}</strong>
              </div>
            ))}
          </>
        )}

        <div className="checkout-box">
          <div>
            <span>Grand Total:</span>
            <h3>{money(total)}</h3>
          </div>

          <button
            className="btn checkout-btn"
            onClick={checkout}
            disabled={cart.length === 0}
          >
            CHECKOUT →
          </button>
        </div>
      </section>

      {/* MY ORDERS */}
      <section id="orders" className="orders-section section-padding">
        <div className="container">
          <div className="section-title">
            <p>YOUR ORDER HISTORY</p>
            <h2>My Orders</h2>
          </div>

          {orders.length === 0 ? (
            <div className="empty-cart">No orders yet.</div>
          ) : (
            [...orders].reverse().map((order) => (
              <div className="order-card" key={order.id}>
                <div>
                  <h5>Order #{order.id}</h5>
                  <p>{order.date}</p>
                  <div className="customer-order-details">
                    <p>
                      <strong>Customer:</strong> {order.customerName}
                    </p>

                    <p>
                      <strong>Phone Number:</strong> {order.phone}
                    </p>

                    <p>
                      <strong>Delivery Address:</strong> {order.location}
                    </p>

                    {order.instructions && (
                      <p>
                        <strong>Instructions:</strong> {order.instructions}
                      </p>
                    )}

                    <p>
                      <strong>Order Status:</strong>{" "}
                      <span className="order-status">
                        {order.status || "Pending"}
                      </span>
                    </p>
                  </div>

                  {order.items.map((item, index) => (
                    <p key={index}>
                      {item.name} × {item.quantity} ={" "}
                      {money(item.price * item.quantity)}
                    </p>
                  ))}
                </div>

                <h5 className="food-price">{money(order.total)}</h5>
              </div>
            ))
          )}
        </div>
        {/* CUSTOMER CHECKOUT FORM */}
        {showCheckoutForm && cart.length > 0 && (
          <section id="customer-checkout" className="container section-padding">
            <div className="section-title">
              <p>DELIVERY INFORMATION</p>
              <h2>Customer Details</h2>
            </div>

            <form className="food-form" onSubmit={placeOrder}>
              <div className="mb-3">
                <label className="form-label">Customer Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your full name"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="09XXXXXXXXX"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Complete Delivery Address</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="House number, street, barangay, city..."
                  value={buyerLocation}
                  onChange={(e) => setBuyerLocation(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Delivery Instructions (Optional)
                </label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Example: Near the school gate"
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                />
              </div>

              <h5 className="food-price">Total: {money(total)}</h5>

              <button type="submit" className="btn checkout-btn">
                PLACE ORDER →
              </button>

              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => setShowCheckoutForm(false)}
              >
                CANCEL
              </button>
            </form>
          </section>
        )}
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <h4>FAST DELICIOUS</h4>
        <p>Good Food. Great Taste. Delivered With Love.</p>
        <p>© 2026 Food Delivery System</p>
      </footer>
    </>
  );
}

export default App;
