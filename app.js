const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose")
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

main().catch(err => console.log(err))

async function main(){
    await mongoose.connect('mongodb://localhost:27017/todoListDB')
}

const itemsSchema = new mongoose.Schema({
    name : String
})

const item = mongoose.model("Item", itemsSchema);

const item1 = new item({
    name: "Welcome to my TodoList"
})
const item2 = new item({
    name: "Click + button to add new task"
})
const item3 = new item({
    name: "Click on the checkbox to remove a task"
})

const defaultItems = [item1,item2,item3];

app.get("/", function(req,res){
    const day = date.getDate();

    item.find({}, function(err,foundItems){
        
        if(foundItems.length==0){
            item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err)
                }
                else{
                     console.log("Successfully added default items!")
                }
            });
            res.redirect("/");
        }
        else{
            res.render("list", {listTitle: day, newListItems: foundItems})
        }
    });
});

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