const csv = require("csv-parser");
var express = require("express");
var bodyParser = require("body-parser");
const fs = require("fs");
const model = require("./model.js");
var app = (module.exports = express());

// Configuration
app.set("views", __dirname + "/views");
app.set("view engine", "jade");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));

async function getData() {
  let count = await model.collection.count();
  console.log(count);
  if (count > 0) return;
  let arr = [];
  fs.createReadStream("data.csv")
    .pipe(csv())
    .on("data", (row) => {
      // arr.push(row);
      const post = new model(row);

      post.save(function (err) {});
    })
    .on("end", async () => {
      console.log("CSV file successfully processed");
    });
}

model.createMapping(function (err, mapping) {
  if (err) {
    console.log("error creating mapping (you can safely ignore this)");
    console.log(err);
  } else {
    console.log("mapping created!");
    console.log(mapping);
  }
});
async function main() {
  getData();
}

app.get("/", function (req, res) {
  res.render("index", { title: "indian-liver-patient-records" });
});

app.post("/search", async function (req, res) {
  const str = req.body.q;

  const messageToSearchWith = new model({ Total_Bilirubin: str });
  messageToSearchWith.encryptFieldsSync();

  console.log(messageToSearchWith.Total_Bilirubin);

  const results = await model.find({
    Total_Bilirubin: messageToSearchWith.Total_Bilirubin,
  });

  model.search(
    {
      query_string: {
        query: 65,
      },
    },
    function (err, results) {
      console.log(results);
      res.send(results);
    }
  );
});
let count = 0;
var stream = model.synchronize();
stream.on("data", function (err, doc) {
  count++;
});
stream.on("close", function () {
  console.log("indexed " + count + " documents!");
});
app.listen(3000, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    3000,
    app.settings.env
  );
});
main().catch(console.dir);
