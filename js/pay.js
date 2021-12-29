if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    fillCart()

    var cookieUserID = readCookie('userID')
    if (cookieUserID) {
        fillOasaCard(cookieUserID)
    }

    // document.getElementsByClassName('pay-btn')[0].addEventListener('submit', completePayment)
}

function fillCart() {
    let finalCart = document.getElementsByClassName('cart')[0]
    let parser = new DOMParser;
    let dom = parser.parseFromString(
        '<!doctype html><body>' + sessionStorage.cartInfo,
        'text/html');
    let decodedString = dom.body.textContent;
    finalCart.innerHTML = decodedString
}

async function fillOasaCard(cookieUserID) {
    let cardField = document.getElementsByClassName('oasa-card-id')[0];
    
    let myinput = '?id='+cookieUserID;
    let url =  'http://localhost:3000/getcardid' + myinput;
    try {
        let response = await axios.post(url);
        // console.log(response)
        let oasaCardId = response.data;
       
        console.log(oasaCardId);
        cardField.value = oasaCardId;
    } catch(error) {
        console.log(error);
    }

}

async function completePayment() {
    let oasaCardId = document.getElementsByClassName('oasa-card-id')[0].value;
    let cartItems = document.getElementsByClassName('cart-item');
    // console.log(cartItems)
    
    let myinput = '?id=' + oasaCardId;
    let ticketArray = new Array()
    for (var i = 0 ; i < cartItems.length ; i++) {
        ticketName = cartItems[i].getElementsByClassName('title')[0].innerText;
        ticketQuantity = cartItems[i].getElementsByClassName('quantity')[0].innerText.replace('x','');
        ticketArray.push({title: ticketName, quantity: ticketQuantity});
    }
    // console.log(myinput)
    let check = 'http://localhost:3000/checkid' + myinput;
    let update = 'http://localhost:3000/updatecart' + myinput;
    try {
        response = await axios.post(check);
        // console.log(response.data);
        if (response.data) {
            response = await axios.post(update, ticketArray);
            if (response.data === 'completed') {
                sessionStorage.clear();
                setSession();
                location.href = "confirmation.html";
            }
        } else {
            alert('Δεν υπάρχει ηλεκτρονική κάρτα ΟΑΣΑ με αυτόν τον αριθμό.');
        }
    } catch (error) {
        alert('Κάτι πήγε στραβά! Παρακαλώ ξαναπροσπαθήστε.');
        console.log(error);
    }
}

function setSession() {
    let cartItemTitles = document.getElementsByClassName('title');
    let cartItemQuantities = document.getElementsByClassName('quantity');

    let quantities = document.createElement('div');
    quantities.classList.add('quantities');
    quantities.append(`<div><b>Ποσότητα</b></div>`);
    for (var i = 0 ; i < cartItemQuantities.length ; i++)  {
        let q = document.createElement('div');
        q.append(`<div>${cartItemQuantities[i].innerText.replace('x', '')}</div>`);
        quantities.append(q);
    }
    sessionStorage.quantities = quantities.innerHTML;

    let titles = document.createElement('div');
    titles.classList.add('titles');
    titles.append(`<div><b>Εισιτήρια</b></div>`);
    for (var i = 0 ; i < cartItemTitles.length-1 ; i++)  {
        let t = document.createElement('div');
        t.append(`<div>${cartItemTitles[i].innerText}</div>`);
        titles.append(t);
    }
    sessionStorage.titles = titles.innerHTML;

}