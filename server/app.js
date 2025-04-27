// import express library
const express = require('express');
// define & setup app
const app = express();
// define communication format (JSON)
app.use(express.json());
// allow communication via form data
app.use(express.urlencoded({extended: true}));

// define port to host server on
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("EPOS Server started.");
    console.log("> Listening on port", port);
});

const APIKeys = require('./database/models/APIKeysModel.js');

app.use(async function(request, response, next) {

    let api_key = request.headers["epos_api_key"];
    
    if(api_key == null || api_key == undefined) {
        response.status(401).send({"error": "No API key supplied"});
        console.warn("Request refused, no API key supplied")
        return;
    }

    let result = await APIKeys.isKeyValid(api_key);

    if(result == null || result == undefined) {
        response.status(401).send({"error": "Invalid API key"});
        console.warn("Request refused, invalid API key supplied")
        return;
    }

    next();

})





app.get("/heartbeat", async (request, response) => {

    // TODO - implement server-side logging of till ID (api key) and last heartbeat time
    response.send({"status": "ok"})
});

// import product routes
const productRoutes = require('./routes/products')
app.use("/api/products", productRoutes)

// import category routes
const catRoutes = require('./routes/categories')
app.use("/api/categories", catRoutes)

// import category routes
const catProdLinkRoutes = require('./routes/catsproductslink')
app.use("/api/cat_link", catProdLinkRoutes)

// import clerk routes
const clerkRoutes = require('./routes/clerks')
app.use("/api/clerks", clerkRoutes)

// import venue routes
const venueRoutes = require('./routes/venue')
app.use("/api/venue", venueRoutes)

// import table routes
const tableRoutes = require('./routes/tables')
app.use("/api/tables", tableRoutes)

// import order routes
const orderRoutes = require('./routes/orders')
app.use("/api/orders", orderRoutes)

// import order routes
const suborderRoutes = require('./routes/suborder')
app.use("/api/suborder", suborderRoutes)


// import payment method routes
const paymentMethodsRoutes = require('./routes/payment_methods')
app.use("/api/payment_methods", paymentMethodsRoutes)