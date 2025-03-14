const express = require("express");
const mongoose = require("mongoose");

const routes = require("./routes");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://localhost:27017/wtwr_db")
  .then(() => {
    // console.log("Connected to DB");
  })
  .catch();

app.use((req, res, next) => {
  req.user = {
    _id: "67d335d24a70e482a275e923",
  };
  next();
});

app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  // console.log(`Listening on port ${PORT}`);
});
