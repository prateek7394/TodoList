const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

const items =["Go to market"];
const workItems =[];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req,res){

    const day = date.getDate();

    res.render("list", {listTitle: day, newListItems: items});
})

app.post("/", function(req,res){

    // console.log(req.body);
    
    var item = req.body.newItem;

    // Here we used the submit button name and its value to distinguish where to add our new item 
    
    if(req.body.list == "WorkList"){
        workItems.push(item);
        res.redirect("/work");
    }
    
    else{
        const item = req.body.newItem;
        items.push(item);
        res.redirect("/");
    }

})

app.get("/work", function(req,res){
    res.render("list", {listTitle: "WorkList", newListItems: workItems});
});

app.post("/work", function(req,res){


    const item = req.body.newItem;

    workItems.push(item);

    res.redirect("/work");
})

app.get("/about", function(req,res){
    res.render("about");
})

app.listen(1111, function(){
    console.log("Server running on port 1111");
})