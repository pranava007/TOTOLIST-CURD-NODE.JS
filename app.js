const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const expresshandle = require("express-handlebars");
const path = require("path");
const dbo = require("./db");
const ObjectID = dbo.ObjectID;

app.engine(
  "hbs",
  expresshandle.engine({
    layoutsDir: "views/",
    defaultLayout: false,
    extname: ".hbs",
  })
);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

/////////////////////////////////////////////////////

app.get("/", async (req, res, next) => {
  let database = await dbo.getdatabase();

  const collection = database.collection("books");

  const cursor = collection.find({});

  let books = await cursor.toArray();

  let ME = "";
  let edit_id, edit_book;

  if (req.query.edit_id) {
    edit_id = req.query.edit_id;
    edit_book = await collection.findOne({ _id: new ObjectID(edit_id) });
  }
  if (req.query.delete_id) {
    await collection.deleteOne({ _id: new ObjectID(req.query.delete_id) });

    return res.redirect("/?status=3");
  }

  switch (req.query.status) {
    case "1":
      ME = "insert succesfully!";
      break;

    case "2":
      ME = " Updated succesfully!";
      break;

    case "3":
      ME = " Deleted succesfully!";
      break;

    default:
      break;
  }

  res.render("main", { ME, books, edit_id, edit_book });
});

/////////////////////////////////////////////////////

app.post("/store_book", async (req, res, next) => {
  let database = await dbo.getdatabase();
  let collection = database.collection("books");
  let book = { title: req.body.title, author: req.body.author };
  await collection.insertOne(book);
  return res.redirect("/?status=1");
});

app.post("/update_book/:edit_id", async (req, res, next) => {
  let database = await dbo.getdatabase();
  let collection = database.collection("books");
  let book = { title: req.body.title, author: req.body.author };
  let edit_id = req.params.edit_id;
  await collection.updateOne({ _id: new ObjectID(edit_id) }, { $set: book });
  return res.redirect("/?status=2");
});
app.listen(3030);
