import { renderCheckoutHeader } from "./checkout/checkoutHeader.js";
import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js"; 
//import '../data/cart-class.js';
import { loadProducts, loadProductsFetch } from "../data/products.js";
import { loadCart } from "../data/cart.js";

async function loadPage() {
    try {
        //throw 'error1';

        await loadProductsFetch();

        const value = await new Promise((resolve, reject) => {
            //throw 'error2';
            loadCart(() => {
                //reject('error3');
                resolve('value3');
            });
        });
    } catch (error) {
        console.log('Unexpected Error. Please try again later');
    }
    
    renderCheckoutHeader();
    renderOrderSummary();
    renderPaymentSummary();
}
loadPage();

//since it returns a promise we can add next step using then
/*
loadPage().then((value) => {
    console.log('next step');
    console.log(value);
});
*/

/*
Promise.all([
    loadProductsFetch(),
    new Promise((resolve) => {
        loadCart(() => {
            resolve();
        });
    })
]).then((values) => {
    console.log(values);
    renderCheckoutHeader();
    renderOrderSummary();
    renderPaymentSummary();
});
*/

/*
new Promise((resolve) => {
    loadProducts(() => {
        resolve('value1');
    });
}).then((value) => {
    console.log(value);

    return new Promise((resolve) => {
        loadCart(() => {
            resolve();
        });
    });
}).then(() => {
    renderCheckoutHeader();
    renderOrderSummary();
    renderPaymentSummary();
});
*/

//we wait for the asynchronous function to finish(loadProducts) then we call for resolve to go go to the next step
//This does the same work as the callback below
/*
new Promise((resolve) => {
    loadProducts(() => {
        resolve();
    });
}).then(() => {
    renderCheckoutHeader();
    renderOrderSummary();
    renderPaymentSummary();
});
*/

//Callback
//too much nesting so we use Promise
//it flattens our code
//load products to checkout page using anonymous function
/*
loadProducts(() => {
    loadCart(() => {
        renderCheckoutHeader();

        renderOrderSummary();

        renderPaymentSummary();
    });
});
*/

