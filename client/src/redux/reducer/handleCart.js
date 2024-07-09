// client/src/redux/reducer/handleCart.js
const cart = JSON.parse(localStorage.getItem("cart")) || [];

const handleCart = (state=cart, action) => {
  const product = action.payload;
  let newState;

  switch (action.type) {
    case "ADDITEM":
      const exist = state.find((x) => x.id === product.id);
      if (exist) {
        newState = state.map((x) =>
          x.id === product.id ? { ...x, qty: x.qty + 1 } : x
        );
      } else {
        newState = [...state, { ...product, qty: 1 }];
      }
      localStorage.setItem("cart", JSON.stringify(newState));
      return newState;

    case "DELITEM":
      const delItem = state.find((x) => x.id === product.id);
      if (delItem.qty === 1) {
        newState = state.filter((x) => x.id !== delItem.id);
      } else {
        newState = state.map((x) =>
          x.id === product.id ? { ...x, qty: x.qty - 1 } : x
        );
      }
      localStorage.setItem("cart", JSON.stringify(newState));
      return newState;

    case "CLEARCART":
      localStorage.removeItem("cart");
      return [];

    case "REMOVE_CART_ITEM":
      newState = state.filter((item) => item.id !== action.payload.id);
      localStorage.setItem("cart", JSON.stringify(newState));
      return newState;

    default:
      return state;
  }
};

export default handleCart;