const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`Service review server is running`);
});

app.listen(port, () => {
  console.log(`your Service review server is runngin on port${port}`);
});
