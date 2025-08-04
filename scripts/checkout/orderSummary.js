//named export below
import {cart, removeFromCart, updateQuantity, updateDeliveryOption} from '../../data/cart.js';
import {getProduct} from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
//default export below
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import {calculateDeliveryDate, deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js';
import { renderCheckoutHeader } from './checkoutHeader.js';
import { renderPaymentSummary } from './paymentSummary.js';

export function renderOrderSummary() {

    //2) View: takes the data and displays it on the oage
    //Below it takes the data and generates all the HTML
    let cartSummaryHTML = '';

    cart.forEach((cartItem) => {
        const productId = cartItem.productId;

        const matchingProduct = getProduct(productId);

        const deliveryOptionId = cartItem.deliveryOptionId;

        const deliveryOption = getDeliveryOption(deliveryOptionId);

        const dateString = calculateDeliveryDate(deliveryOption);
        
        cartSummaryHTML += `
            <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
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
                    ${matchingProduct.getPrice()}
                    </div>
                    <div class="product-quantity">
                    <span>
                        Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                        Update
                    </span>
                    <input class="quantity-input js-quantity-input-${matchingProduct.id}">
                    <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}">Save</span>
                    <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
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
            </div>
            `;
    });

    //Step 1: Loop through deliveryOptions
    //Step 2: For each option, generate some HTML
    //Step 3: Combine HTML together
    function deliveryOptionsHTML(matchingProduct, cartItem) {
        let html ='';
        deliveryOptions.forEach((deliveryOption) => {
            const dateString = calculateDeliveryDate(deliveryOption);

            const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)}`;

            const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

            html += `   
                <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
                    <input type="radio" 
                    ${isChecked ? 'checked':''}
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
                </div>
            `;
        });
        return html;
    }

    document.querySelector('.js-order-summary')
        .innerHTML = cartSummaryHTML;

    //3) Controller: runs some code when we interact with the page
    // these eventListeners are the controllers
    // they interact with the view

    document.querySelectorAll('.js-delete-link')
        .forEach((link) => {
            link.addEventListener('click',() => {
                const productId = link.dataset.productId;

                removeFromCart(productId);

                const container = document.querySelector(`.js-cart-item-container-${productId}`);

                container.remove();

                renderCheckoutHeader();
                renderOrderSummary();
                renderPaymentSummary();
            });
        });

    document.querySelectorAll('.js-update-link')
        .forEach((link) => {
            link.addEventListener('click', () => {
                const productId = link.dataset.productId;

                document.querySelector(`.js-cart-item-container-${productId}`).classList.add('is-editing-quantity');
            });
        });

    document.querySelectorAll('.js-save-link')
        .forEach((link) => {
            link.addEventListener('click', () => {
                const productId = link.dataset.productId;
                const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);

                handleUpdateQuantity(productId, quantityInput);
            });
        });

    function handleUpdateQuantity(productId, quantityInput) {
        
        //Here's an example of a feature we can add: validation.
        const newQuantity = Number(quantityInput.value);

        if (newQuantity < 0 || newQuantity >= 100) {
            alert('Quantity must be atleast 0 and less than 1000');
            return;
        }

        updateQuantity(productId, newQuantity);

        document.querySelector(`.js-cart-item-container-${productId}`).classList.remove('is-editing-quantity');

        const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
        
        quantityLabel.innerHTML = newQuantity;

        renderCheckoutHeader();
        renderPaymentSummary();
    }

    //Step 1: Update the deliveryOptionId in the cart
    //Step 2: Update the page
    document.querySelectorAll('.js-delivery-option')
        .forEach((element) => {
            element.addEventListener('click', () => {
                const{productId, deliveryOptionId} = element.dataset;
                updateDeliveryOption(productId, deliveryOptionId);

                //Update the data
                //Regenrate all the HTML
                //MVC = Model-View-Controller
                //A MVC split our code into 3 parts
                renderCheckoutHeader();

                renderOrderSummary();

                renderPaymentSummary();
            });
        });
}
