// import express
const express = require('express');

// import db connection
const db = require('../database.js');

// setup route handler
const router = express.Router();

// import Categories db model
const Categories = require('../database/models/CategoriesModel.js');

router.get("/get/all", async (request, response) => {
    try {
        var cats = await Categories.getAll();
        response.json(cats);
    } catch(error) {
        console.error(error)
        response.status(500).json({error: "Failed to retrieve categories"})
    }
})

router.get("/get/:id", async (request, response) => {
    try {
        var cat = await Categories.getByID(request.params.id);

        // if category not found
        if(cat == undefined) {
            response.json({error: "Category not found"});
            return;
        }

        response.json(cat);
    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Failed to retrieve category from ID provided"})
    }
})

router.post("/create", async (request, response) => {
    try {
        var desired_name = request.body["name"];
        
        // check name is defined & not blank
        if(!isCatNameValid(desired_name)) {
            response.status(400).json({error: "Failed to create category - invalid name"})
            return;
        }

        // have to use brackets & index 0 as returns array of results, only want 1st entry as is an insert sql cmd
        var cat = (await Categories.create(desired_name))[0]
        response.status(200).json({message: "Successfully created category.", category_data: cat});

    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Failed to create category"})
    }
})

router.post("/disable", async (request, response) => {

    try {
        toggleCatVisibility(request, response, false)
    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Error changing category status"})
    }

})

router.post("/enable", async (request, response) => {

    try {
        toggleCatVisibility(request, response, true)
    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Error changing category status"})
    }

})

router.post("/:id/name", async (request, response) => {
    try{

        var cat_id = request.params.id;

        if(!isCatIDValid(cat_id)) {
            response.status(400).json({error: "Category not found"});
            return;
        }
        
        var desired_name = request.body["name"];

        // check name is defined & not blank
        if(!isCatNameValid(desired_name)) {
            response.status(400).json({error: "Failed to update category - invalid name"})
            return;
        }

        var status = await Categories.change_name(cat_id, desired_name);
        var new_cat_details = status[0];
        response.status(200).json({message: "Category updated successfully.", category_id: new_cat_details.id, new_name: new_cat_details.name})

    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Error occurred updating category details"})
    }
})

router.post("/:id/priority", async (request, response) => {
    try{

        var cat_id = request.params.id;

        if(!isCatIDValid(cat_id)) {
            response.status(400).json({error: "Category not found"});
            return;
        }
        
        var desired_priority = request.body["priority"];

        // check name is defined & not blank
        if(!isPriorityValid(desired_priority)) {
            response.status(400).json({error: "Failed to update category - invalid priority"})
            return;
        }

        var status = await Categories.change_priority(cat_id, desired_priority);
        var new_cat_details = status[0];
        response.status(200).json({message: "Category updated successfully.", category_id: new_cat_details.id, new_priority: new_cat_details.priority})

    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Error occurred updating category details", details: error})
    }
})

async function toggleCatVisibility(request, response, status) { 

    var cat_id = request.body["id"];

    // check if product exists
    if(!isCatIDValid(cat_id)) {
        response.json({error: "Category not found"});
        return;
    }

    var status = await Categories.change_status(cat_id, status);
    response.status(200).json({message: "Successfully changed category visiblilty", enabled: status[0].enabled})


}

async function isCatIDValid(id) {
    return await Categories.getByID(id) != undefined
}

function isCatNameValid(name) {
   return name != undefined && name.trim() != ""
}

function isPriorityValid(input) {
    return input != undefined && !isNaN(input) && isFinite(input)
}

module.exports = router;