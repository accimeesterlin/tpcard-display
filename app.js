const log = console.log;

// Select elements
const fullNameElement = document.querySelector('#fullName');
const expirationElement = document.querySelector('#expiration');

const params = new URLSearchParams(location.search);
const getParameterByName = (name) => {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

const firstName = getParameterByName("firstName");
const lastName = getParameterByName("lastName");
const token = getParameterByName("token");
const cardNumber = getParameterByName("cardNumber");
const expiration = getParameterByName("expiration");
const cvc = getParameterByName("cvc");
const uiKey = getParameterByName("uiKey");
const provider = getParameterByName("provider");

const bearerToken = `Bearer ${token}`;
        

const onSucces = function() {
    log("Loading success");
    const number = window.OpcUxSecureClient.span('cardNumber', cardNumber);
    number.mount(document.getElementById('cardNumber'));

    
    var cvv = window.OpcUxSecureClient.span('cvv', cvc?.replace(" ", "+"));
    cvv.mount(document.getElementById('cvv'));

    fullNameElement.innerHTML = `${firstName} ${lastName}`;
    expirationElement.innerHTML = `${expiration}`;
}

const onError = function(e) {
    console.error('Decode Failed: ' + e);
}

// Initialize the client
if (window.OpcUxSecureClient) {
    window.OpcUxSecureClient.init(uiKey);
    window.OpcUxSecureClient.associate(bearerToken, onSucces, onError);
}