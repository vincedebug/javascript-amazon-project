import { cart, removeFromCart, calculateCartQuantity, updateQuantity, updateDeliveryOption} from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions } from '../data/deliveryOptions.js';

const today = dayjs();
const deliveryDate = today.add(7, 'days');
const deliveryDateString = deliveryDate.format('dddd, MMMM D');



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

  const deliveryOptionId = cartItem.deliveryOptionsId;

  let deliveryOption;

  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });

  const today = dayjs();
  const deliveryDate = today.add(
    deliveryOptions.deliveryDays,
    'days'
  );
  const dateString = deliveryDate.format('dddd, MMMM D');

  cartSummaryHTML += `<div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
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
          ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>
        </div>
      </div>`;
});

// this is a function to generate delivery option in checkout page
// https://youtu.be/EerdGm-ehJQ?si=W17eVx66eOn2zBHI&t=52702
function deliveryOptionsHTML(matchingProduct, cartItem) {

  let html = '';

  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(
      deliveryOption.deliveryDays,
      'days'
    );
    const dateString = deliveryDate.format(
      'dddd, MMMM D'
    );

    const priceString = deliveryOption.priceCents === 0
    ? 'FREE'
    : `$${formatCurrency(deliveryOption.priceCents)} - `;

    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    html += `
    <div class="delivery-option  js-delivery-option"
          data-product-id="${matchingProduct.id}"
          data-delivery-option-id="${deliveryOption.id}" >
      <input type="radio"
        ${isChecked ? 'checked' : ''}
        class="delivery-option-input"
        name="delivery-option-${matchingProduct.id}">
      <div>
        <div class="delivery-option-date">
          ${dateString}
        </div>
        <div class="delivery-option-price">
          ${priceString} Shipping
        </div>
      </div>
    </div> `
  });
  return html;
}

function orderSummaryHTML() {
  let html = `
            <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div class="js-total-items">Items ():</div>
            <div class="payment-summary-money">$42.75</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$4.99</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$47.74</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$4.77</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$52.51</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>
  `;

  return html;

}



// Display the the item in the cart in HTML
document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

// Display the Payment Summary in HTML
document.querySelector('.js-payment-summary').innerHTML = orderSummaryHTML();




// Delete the item in the cart
document.querySelectorAll('.js-delete-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.remove();
      updateCart();
      updateTotalOrder();
                                        
    });
});

// This function is used to change the ui of the cart in the checkout page
function updateCart() {
  const quantity = calculateCartQuantity();
  document.querySelector('.js-return-to-home-link')
.innerHTML = `${quantity} items`;
}

function updateTotalOrder() {
  const quantity = calculateCartQuantity();
  document.querySelector('.js-total-items').innerHTML = `Items (${quantity}):`;
}


updateTotalOrder();
updateCart();

// When clicking the update the save button will appear
// and the input for updating the quantity of the item
document.querySelectorAll('.js-update-quantity-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.classList.add('is-editing-quantity');
    });
  });

// save and update the cart quantity
document.querySelectorAll('.js-save-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.id;
    updateQuantityCart(productId);
    updateTotalOrder();
  });
});

// updates the item in order summary
document.querySelectorAll('.js-total-item').innerHTML = calculateCartQuantity();

// this is used to save the input number when enter is pressed
document.querySelectorAll('.quantity-input').forEach((link) => {
  link.addEventListener('keydown', (event) => {
   
    const productId = link.id;
    if (event.key == 'Enter') {
      updateQuantityCart(productId);
    }
  });
});


// This is the function to update the quantity in the checkout 
function updateQuantityCart(productId) {
      const container = document.querySelector(`.js-cart-item-container-${productId}`);

      // remove the is editing quantity 
      container.classList.remove('is-editing-quantity');

      // get the value or new from the input
      const newQuantity = Number(document.querySelector(`.js-quantity-input-${productId}`).value);

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

document.querySelectorAll('.js-delivery-option')
  .forEach((element) => {
    element.addEventListener('click', () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
    });
  });
