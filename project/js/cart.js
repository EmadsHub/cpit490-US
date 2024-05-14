document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartList = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total span');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const printReceiptBtn = document.querySelector('.print-btn');
    
    const cart = [];
  
    addToCartButtons.forEach(button => {
      button.addEventListener('click', addToCart);
    });
  
    checkoutBtn.addEventListener('click', confirmCheckout); // Changed the event listener here
  
    cartList.addEventListener('click', handleCartItemClick);
  
    function addToCart(event) {
      const product = event.target.getAttribute('data-product');
      const price = parseFloat(event.target.getAttribute('data-price'));
  
      const existingItem = cart.find(item => item.product === product);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({
          product: product,
          price: price,
          quantity: 1,
        });
      }
  
      updateCartUI();
    }
  
    function handleCartItemClick(event) {
      if (event.target.classList.contains('remove-item')) {
        const index = parseInt(event.target.getAttribute('data-index'));
        const item = cart[index];
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          cart.splice(index, 1);
        }
        updateCartUI();
      } else if (event.target.classList.contains('add-item')) {
        const index = parseInt(event.target.getAttribute('data-index'));
        cart[index].quantity++;
        updateCartUI();
      }
    }
  
    function confirmCheckout() { // Added the confirmation function
      const cartLength = cart.length;
      if (cartLength === 0) {
        alert('Your cart is empty. Add items to your cart before checkout.');
        return;
      }
  
      const confirmation = window.confirm(`Are you sure you want to proceed to checkout with ${cartLength} items?`);
      if (confirmation) {
        checkout();
      }
    }
  
    function checkout() {
      if (cart.length === 0) {
        alert('Your cart is empty. Add items to your cart before checkout.');
        return;
      }
  
      const total = calculateTotal();
      alert(`Thank you for your purchase! Your total: SAR${total}`);
      cart.length = 0;
      updateCartUI();
    }
  
    function calculateTotal() {
      return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }
  
    function updateCartUI() {
      cartList.innerHTML = '';
      cart.forEach((item, index) => {
        const cartItem = document.createElement('li');
        cartItem.innerHTML = `
          <span>${item.product}</span>
          <span>SAR${item.price.toFixed(2)} x ${item.quantity}</span>
          <button class="btn remove-item" data-index="${index}">-</button>
          <button class="btn add-item" data-index="${index}">+</button>`;
        cartList.appendChild(cartItem);
      });
      cartTotal.innerText = calculateTotal();
    }


    // Add print receipt button

    printReceiptBtn.addEventListener('click', printReceipt);


    function printReceipt() {
        const total = calculateTotal();
        if (total === 0) {
            alert("Cannot print receipt for an empty cart.");
            return;
        }
     
        const receiptWindow = window.open('', '_blank');
        
        const receiptContent = `
            <html>
            <head>
                <title>Receipt</title>
                <style>
                    /* Add your CSS styles here for the receipt layout */
                    body {
                        font-family: 'Poppins', sans-serif;
                    }
                    .receipt-container {
                        padding: 1rem;
                    }
                    .receipt-header {
                        text-align: center;
                        font-size: 1.5rem;
                        margin-bottom: 1rem;
                    }
                    .receipt-item {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 0.5rem;
                    }
                    .receipt-total {
                        text-align: right;
                        font-weight: bold;
                        margin-top: 1rem;
                    }
                </style>
            </head>
            <body>
                <div class="receipt-container">
                    <div class="receipt-header">
                        <h2>Receipt</h2>
                    </div>
                    <div class="receipt-items">
                        ${cart.map((item, index) => `
                            <div class="receipt-item">
                                <span>${item.product}</span>
                                <span>SAR${item.price.toFixed(2)} x ${item.quantity}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="receipt-total">
                        Total: SAR${calculateTotal().toFixed(2)}
                    </div>
                </div>
            </body>
            </html>
        `;
        
        receiptWindow.document.open();
        receiptWindow.document.write(receiptContent);
        receiptWindow.document.close();
        
        receiptWindow.onload = () => {
            receiptWindow.print();
            receiptWindow.close();
        };
    }
});
    

