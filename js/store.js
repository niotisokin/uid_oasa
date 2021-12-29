if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    var cookieUserId = readCookie('userID')
    if (cookieUserId) {
        document.getElementsByClassName('lower')[0].remove()
        checkLowerPrice(cookieUserId)
    } else {
        var loginButton = document.getElementsByClassName('lower-login')[0]
        loginButton.addEventListener('click', clickLogin)
    }

    var removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity')
    for (var i = 0; i < quantityInputs.length; i++) {
        var quantityInput = quantityInputs[i]
        quantityInput.addEventListener('change', quantityChanged)
    }

    var addToCartButtons = document.getElementsByClassName('add-to-cart')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var addButton = addToCartButtons[i]
        addButton.addEventListener('click', addToCartClicked)
    }

    var continueToPayButton = document.getElementById('continueToPay')
    continueToPayButton.addEventListener('click', continueToPay)
}

async function lowerPrices() {
    let ticketPrices = document.getElementsByClassName('ticket-price')
    for (var i = 0 ; i < ticketPrices.length ; i++) {
        let price = ticketPrices[i].innerText.replace('€', '')
        price = price/2
        if (price % 1 != 0) {
            price = price.toFixed(2) + '€'
        } else {
            price = price + '€'
        }
        ticketPrices[i].innerText = price
    }
}

async function checkLowerPrice(cookieUserId) {
    let myinput = '?id='+cookieUserId
    let url =  'http://localhost:3000/getlower' + myinput;
    try {
        let response = await axios.post(url)
        if (response.data) {
            lowerPrices()
        }
    } catch(error) {
        console.log(error)
    }
}

function clickLogin() {
    document.getElementById('login-register').click()
}

function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

function addToCartClicked(event) {
    var addToCartButton = event.target
    var ticket = addToCartButton.parentElement.parentElement.parentElement
    var ticketTitle = ticket.getElementsByClassName('ticket-info')[0].getElementsByClassName('ticket-title')[0].getElementsByTagName('h5')[0].innerText
    var ticketPrice = ticket.getElementsByClassName('ticket-buy')[0].getElementsByClassName('ticket-price')[0].innerText
    // console.log(ticketTitle,ticketPrice)
    addItemToCart(ticketTitle, ticketPrice)
    updateCartTotal()
}

function addItemToCart(title, price) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('Αυτο το εισιτήριο βρίσκεται ήδη στο καλάθι αγορών')
            return
        }
    }
    var cartRowContent = `
    <div class="cart-item cart-column">
    <span class="cart-item-title">${title}</span>
    </div>
    <span class="cart-price cart-column">${price}</span>
    <div class="cart-quantity cart-column">
    <input class="cart-quantity-input" type="number" value="1">
    <button class="btn btn-danger" type="button">Αφαίρεση</button>
    </div> `
    cartRow.innerHTML = cartRowContent
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('€', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = total.toFixed(2)
    document.getElementsByClassName('cart-total-price')[0].innerText = total + '€'
    if (total > 0) {
        document.getElementsByClassName('btn-purchase')[0].disabled = false
    } else {
        document.getElementsByClassName('btn-purchase')[0].disabled = true
    }
}

function continueToPay() {
    let cartItemTitles = document.getElementsByClassName('cart-item-title');
    let cartItemQuantities = document.getElementsByClassName('cart-quantity-input');
    let cartItemPrices = document.getElementsByClassName('cart-price');
    let cartTotal = document.getElementsByClassName('cart-total-price')[0];
    
    // console.log(cartItemTitles)
    // console.log(cartItemQuantities)
    // console.log(cartItemPrices)
    // console.log(cartTotal)

    let cart = document.createElement('div');
    cart.classList.add('container');
    cart.classList.add('cart');
    cart.append(`<h4>Καλάθι αγορών</h4>`);

    for (var i = 0 ; i < cartItemTitles.length ; i++) {
        cart.append(`<p class="cart-item d-flex justify-content-between"><span class="title">${cartItemTitles[i].innerText}</span><span class="quantity">x${cartItemQuantities[i].value}</span></p>`);
    }
    cart.append(`
    <hr>
    <p class="cart-total d-flex justify-content-center"><span class="title">Σύνολο&ensp;</span><span class="price"><b>${cartTotal.innerText}</b></span></p>`);
    
    sessionStorage.cartInfo = cart.innerHTML;
}