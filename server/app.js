// import express library
const express = require('express');
// define & setup app
const app = express();
// define communication format (JSON)
app.use(express.json());
// define port to host server on
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("EPOS Server started.");
    console.log("> Listening on port", port);
});

app.get("/status", (request, response) => {
    response.send({"status": "ok"})
});

app.get("/products", (request, response) => {
    products = [
        {
            "product_id": 1,
            "product_name": "Pint of Beer",
            "product_price": 450,
            "product_enabled": true,
        },
        {
            "product_id": 2,
            "product_name": "Half Pint of Beer",
            "product_price": 230,
            "product_enabled": true,
        },
    ]

    response.send(products);
})