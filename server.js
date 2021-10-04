if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cookieHandler = require("./middleware/cookieHandler");
const methodOverride = require("method-override");
// const seedProduct = require('./seed/products')

const blogRoutes = require("./routes/blog_routes");
const shopRoutes = require("./routes/shop_routes");
const cartRoutes = require("./routes/cart_routes");
const authRoutes = require("./routes/auth_routes");
const adminRoutes = require("./routes/admin_routes");

const app = express();

const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("DB OK"));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(cookieHandler);
app.use(methodOverride("_method"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", cookieHandler, (req, res) => {
  const user = req.user;
  fs.readFile(path.join(__dirname, "mainpage.json"), (err, data) => {
    if (err) return res.sendStatus(500);
    res.render("index", {
      user,
      data: JSON.parse(data),
    });
  });
});

app.get("/chisiamo", (req, res) => {
  res.render("chisiamo");
});
app.get("/nostroconcetti", (req, res) => {
  res.render("nostroconcetti");
});
app.get("/contatti", (req, res) => {
  res.render("contatti");
});

app.use("/blog", blogRoutes);
app.use("/shop", shopRoutes);
app.use("/cart", cartRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
// seedProduct()

const PORT = process.env.PORT || 4242;

app.listen(PORT, () =>
  console.log(`server is runnning http://localhost:${PORT}`)
);
