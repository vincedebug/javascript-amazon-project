
// This is the object used to store the item in the cart
export let cart = JSON.parse(localStorage.getItem('cart'));
 
if (!cart) {
  cart = [{
    productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    quantity: 2
  }, {
  
    productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
    quantity: 1
  }];
}

export function addToCart(productId) {
  const productQuantity = document.querySelector(`.js-quantity-selector-${productId}`);
  const quantity = Number(productQuantity.value);

  let matchingItem;

  cart.forEach((item) => {
    if (productId === item.productId) {
      matchingItem = item;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity
      });
  }
  saveToStorage();
}

// Save the data in local Storage
function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}


export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;
  saveToStorage();
}

// calculate the cart quantity
export function calculateCartQuantity() {
  let cartQuantity = 0;

  // loop cart to get the quantity of the cart
  cart.forEach((cartItem) => {
  cartQuantity += cartItem.quantity;
  });

  return cartQuantity;
}

export function updateQuantity(productId, newQuantity) {
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
        cartItem.quantity = newQuantity;
        saveToStorage();
    }
  });
}