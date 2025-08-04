import {cart, addToCart, calculateCartQuantity, saveToStorage} from '../data/cart.js';
//Another format for above import
//import * as cartModule from '../data/cart.js';
//cartModule.cart
//cartModule.addToCart('id');
import {products, loadProducts} from '../data/products.js';
import { formatCurrency } from './utils/money.js';

loadProducts(renderProductsGrid);


function renderProductsGrid() {
    // To combine all the html string generated below
    let productsHTML = '';

    // Loop through the array
    // To generate html for the above products
    products.forEach((product) => {
        productsHTML += `
        <div class="product-container">
                <div class="product-image-container">
                    <img class="product-image"
                    src="${product.image}">
                </div>

                <div class="product-name limit-text-to-2-lines">
                    ${product.name}
                </div>

                <div class="product-rating-container">
                    <img class="product-rating-stars"
                    src="${product.getStarsUrl()}">
                    <div class="product-rating-count link-primary">
                        ${product.rating.count}
                    </div>
                </div>

                <div class="product-price">
                    ${product.getPrice()}
                </div>

                <div class="product-quantity-container">
                    <select class="js-quantity-selector-${product.id}">
                    <option selected value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    </select>
                </div>

                ${product.extraInfoHTML()}

                <div class="product-spacer"></div>

                <div class="added-to-cart js-added-to-cart-${product.id}">
                    <img src="images/icons/checkmark.png">
                    Added
                </div>

                <button class="add-to-cart-button button-primary js-add-to-cart"
                data-product-id="${product.id}">
                    Add to Cart
                </button>
            </div> 
        `;
    });

    // Last step is to put all the html code generated in the JS to the webpage
    // This is done using DOM 
    document.querySelector('.js-products-grid')
        .innerHTML = productsHTML;

    // We're going to use an object to save the timeout ids.
    // The reason we use an object is because each product
    // will have its own timeoutId. So an object lets us
    // save multiple timeout ids for different products.
    const addedMessageTimeouts = {};


    // Adding an eventListener when we click add to cart button
    // Here data-product-name changes from kebab case to camel case productName

    // Steps while adding item to a cart
    // 1)Check if the product is already in cart
    // 2)If it is in the cart, increase the quantity
    // 3)If not, then add the product to the cart


    function updateCartQuantity() {
        const cartQuantity = calculateCartQuantity();

        document.querySelector('.js-cart-quantity')
            .innerHTML = cartQuantity;

        saveToStorage();
    }

    updateCartQuantity();

    function showAddedMessage(productId) {
        const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);

        addedMessage.classList.add('added-to-cart-visible');

        // Check if there's a previous timeout for this product. If there is, we should stop it.
        const previousTimeoutId = addedMessageTimeouts[productId];
        //Dot notation can only be used with static property names (i.e., directly referencing the name).

        // Bracket notation allows you to use dynamic property names (i.e., variables or expressions), which is why it's necessary in your case to access the timeoutId using addedMessageTimeouts[productId].

        if (previousTimeoutId) {
            clearTimeout(previousTimeoutId);
        }

        const timeoutId = setTimeout(() => {
            addedMessage.classList.remove('added-to-cart-visible');
        }, 2000);   
        
        // Save the timeoutId for this product
        // so we can stop it later if we need to.
        addedMessageTimeouts[productId] = timeoutId;
    }

    document.querySelectorAll('.js-add-to-cart')
        .forEach((button) => {
            button.addEventListener('click', () => {
                const {productId} = button.dataset;

                addToCart(productId);

                updateCartQuantity();

                showAddedMessage(productId);

            });
        });
}
