const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash")
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb+srv://ps1991:ps7394@cluster0.i0rrm.mongodb.net/todoListDB?retryWrites=true&w=majority");
}

// schema 1
const itemsSchema = new mongoose.Schema({
  name: String,
});

const item = mongoose.model("Item", itemsSchema);

const item1 = new item({
  name: "Welcome to my TodoList",
});
const item2 = new item({
  name: "Click + button to add new task",
});
const item3 = new item({
  name: "Click on the checkbox to remove a task",
});

const defaultItems = [item1, item2, item3];

// schema 2
const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  const day = date.getDate();

  item.find({}, function (err, foundItems) {

    if (foundItems.length == 0) {
      // This condition ensures that our default items are added only once
      item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully added default items!");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: day, newListItems: foundItems });
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const Item = new item({
    name: itemName,
  });

  if (listName == date.getDate()) {
    //   In this case the new item will be added in our items collection
    Item.save();
    res.redirect("/");
  } else {
    // in this case we'll search through the existing lists in our collection(lists)
    List.findOne({ name: listName }, function (err, foundList) {
      // we'll push the newly created item into items array of foundList
      // so that new items are added in the same list

      foundList.items.push(Item);
      foundList.save();
      // finally we are redirected to the customListName route
      res.redirect("/" + listName);
    });
  }
});

// to remove checked items:

app.post("/delete", function (req, res) {
  const checkeditemID = req.body.checkbox;
  const listName = req.body.listName;

  if (listName == date.getDate()) {
    item.findByIdAndRemove(checkeditemID, function (err) {
      if (!err) {
        console.log("Checked item successfully removed!");
        res.redirect("/");
    }
    });
  }
  else {
    //      Here we have used a mongoDB array update operator with a model method
    //      $pull removes that element having checkeditemID from items array of listName
    //      findOneAndUpdate method searches the matching document, updates it according to conditions and returns the document

    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkeditemID}}}, function(err,foundList){
        if(!err){
            res.redirect("/" + listName);
        }
    });
  }

});

// using express route params to create a dynamic route
app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        // Create a new list
        const list1 = new List({
          name: customListName,
          items: defaultItems,
        });
        list1.save();
        res.redirect("/" + customListName);
      } else {
        // Show the existing list
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items });
      }
    }
  });

});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(1111, function () {
  console.log("Server running on port 1111");
});
