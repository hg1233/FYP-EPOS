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