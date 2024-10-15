export const cart = [];

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
}