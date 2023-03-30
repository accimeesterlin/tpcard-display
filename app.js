const log = console.log;
log("Loading app.js");

// Select elements
const fullNameElement = document.querySelector('#fullName');
const expirationElement = document.querySelector('#expiration');
const cardNumberElement = document.querySelector('#cardNumber');
const cvvElement = document.getElementById('cvv');

const params = new URLSearchParams(location.search);
const getParameterByName = (name) => {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

const fullName = getParameterByName("fullName");
const token = getParameterByName("token");
const cardNumber = getParameterByName("cardNumber")?.replace(" ", "+")?.replace(" ", "+");

console.log("Card Number: ", cardNumber);
const expiration = getParameterByName("expiration");
const cvc = getParameterByName("cvc")?.replace(" ", "+");
const uiKey = getParameterByName("uiKey")?.replace(" ", "+");
const provider = getParameterByName("provider");
const status = getParameterByName("status");

const bearerToken = `Bearer ${token}`;


if (status === "pending") {
    fullNameElement.innerHTML = `${fullName}`;
    cardNumberElement.innerHTML = `**** **** **** ****`;
    expirationElement.innerHTML = `**/**`;
    expirationElement.innerHTML = `**/**`;
    cvvElement.innerHTML = `***`;
}

const onSucces = function() {
    log("Loading success");
    const number = window.OpcUxSecureClient.span('cardNumber', cardNumber);
    number.mount(cardNumberElement);

    
    var cvv = window.OpcUxSecureClient.span('cvv', cvc);
    cvv.mount(document.getElementById('cvv'));

    fullNameElement.innerHTML = `${fullName}`;
    expirationElement.innerHTML = `${expiration}`;
}

const onError = function(e) {
    console.error('Decode Failed: ' + e);
}

// Initialize the client
if (window.OpcUxSecureClient && status === "success") {
    window.OpcUxSecureClient.init(uiKey);
    window.OpcUxSecureClient.associate(bearerToken, onSucces, onError);
}
