import { cart, removeFromCart, calculateCartQuantity, updateQuantity } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';

// html template with data
let cartSummaryHTML = '';

// loop the cart and display different items in the page
cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  // store the data in this variable
  let matchingProduct;

  // check other information about the product 
  products.forEach((product) => {
    if (productId === product.id) {
      matchingProduct = product;
    }
  });

  cartSummaryHTML += `<div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: Tuesday, June 21
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            ${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id="${matchingProduct.id}">
              Update
            </span>
            <input class="quantity-input js-quantity-input-${matchingProduct.id}" id="${matchingProduct.id}">
            <span class="save-quantity-link link-primary js-save-link" id="${matchingProduct.id}">Save</span> 
            <span class="delete-quantity-link link-primary js-delete-link " data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          <div class="delivery-option">
            <input type="radio" checked
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Tuesday, June 21
              </div>
              <div class="delivery-option-price">
                FREE Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Wednesday, June 15
              </div>
              <div class="delivery-option-price">
                $4.99 - Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Monday, June 13
              </div>
              <div class="delivery-option-price">
                $9.99 - Shipping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
});

document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;



document.querySelectorAll('.js-delete-link')
  .forEach((link) => {
    link.addEventListener('click', () => {

      const productId = link.dataset.productId;

      removeFromCart(productId);

      const container = document.querySelector(`.js-cart-item-container-${productId}`);

      container.remove();

      updateCart();
                                        
    });
});

function updateCart() {
  const quantity = calculateCartQuantity();
  document.querySelector('.js-return-to-home-link')
.innerHTML = `${quantity} items`;
}

updateCart();


document.querySelectorAll('.js-update-quantity-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;

      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.classList.add('is-editing-quantity');
    });
  });

document.querySelectorAll('.js-save-link').forEach((link) => {
  link.addEventListener('click', () => {
    // get the product Id
    const productId = link.id;
    updateQuantityCart(productId);

  });

});


document.querySelectorAll('.quantity-input').forEach((link) => {
  link.addEventListener('keydown', (event) => {
    // get the product Id
    
    const productId = link.id;

    if (event.key == 'Enter') {
      updateQuantityCart(productId);
    }

  });

});

function updateQuantityCart(productId) {
      const container = document.querySelector(`.js-cart-item-container-${productId}`);

      // remove the is editing quantity 
      container.classList.remove('is-editing-quantity');

      // get the value or new from the input
      const newQuantity = Number(document.querySelector(`.js-quantity-input-${productId}`).value);

      console.log(newQuantity);

      // check the new quantity from the input
      if (newQuantity < 0 || newQuantity >= 1000) {
        alert('Quantity must be at least 0 and less than 1000');
        return;
      }

      updateQuantity(productId, newQuantity);

      const quantityLabel = document.querySelector(
        `.js-quantity-label-${productId}`
      );

      quantityLabel.innerHTML = newQuantity;

      updateCart();

}



  

 
  




  

