const log = console.log;
log("Loading app.js");

// Select elements
const fullNameElement = document.querySelector('#fullName');
const expirationElement = document.querySelector('#expiration');
const cardNumberElement = document.querySelector('#cardNumber');
const lockIconElement = document.querySelector('.fa-lock');
const cvvElement = document.getElementById('cvv');

const params = new URLSearchParams(location.search);
const getParameterByName = (name) => {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

const fullName = getParameterByName("fullName");
const token = getParameterByName("token");
const cardNumber = getParameterByName("cardNumber")?.replace(" ", "+")?.replace(" ", "+");

const expiration = getParameterByName("expiration");
const cvc = getParameterByName("cvc")?.replace(" ", "+")?.replace(" ", "+");
const uiKey = getParameterByName("uiKey")?.replace(" ", "+");
const provider = getParameterByName("provider");
const status = getParameterByName("status");

const bearerToken = `Bearer ${token}`;


const fractionize = (number) => {
    let numerator = number?.slice(0, 2);
    let denominator = number?.slice(2, 4);

    return `${numerator}/${denominator}`;
}


if (status === "pending") {
    fullNameElement.innerHTML = `${fullName}`;
    cardNumberElement.innerHTML = `**** **** **** ****`;
    expirationElement.innerHTML = `**/**`;
    expirationElement.innerHTML = `**/**`;
    cvvElement.innerHTML = `***`;
}

const onSuccess = function () {
    log("Loading success");
    const number = window.OpcUxSecureClient.span('cardNumber', cardNumber);
    number.mount(cardNumberElement);


    var cvv = window.OpcUxSecureClient.span('cvv', cvc);
    cvv.mount(document.getElementById('cvv'));

    fullNameElement.innerHTML = `${fullName}`;
    expirationElement.innerHTML = `${fractionize(expiration)}`;

    secureIframe = document.querySelector('iframe');
}

const onError = function (e) {
    console.error('Decode Failed: ' + e);
}

const handleSensitiveData = () => {
    if (status === "pending") {
        lockIconElement.style.display = "none";
    }
    cardNumberElement.innerHTML = `**** **** **** ****`;
    cvvElement.innerHTML = `***`;
    expirationElement.innerHTML = `**/**`;
    fullNameElement.innerHTML = `${fullName}`;
}

handleSensitiveData();

const initApp = () => {
    try {
        // Initialize the client
        if (window.OpcUxSecureClient && status === "success") {
            window.OpcUxSecureClient.init(uiKey);
            window.OpcUxSecureClient.associate(bearerToken, () => { }, onError);
        }
    } catch (error) {
        console.log("Error: ", error);
    }
}

initApp();

document.addEventListener('click', function (e) {
    const target = e.target;

    if (target.matches('.fa-lock-open') || target.matches('.fa-lock')) {
        const className = target?.getAttribute('class');

        if (className?.includes('fa-lock-open')) {
            // Hide sensitive data
            target.classList.remove('fa-lock-open');
            target.classList.add('fa-lock');
            handleSensitiveData();

        } else {
            // Show sensitive data
            target.classList.remove('fa-lock');
            target.classList.add('fa-lock-open');
            onSuccess();
        }
    }
})


