const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

require("dotenv").config();

//middleware

app.use(cors());
app.use(express.json());

//mongodb conntection setup

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.SECRET_KEY}@cluster0.jz1qjld.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const run = async () => {
  try {
    const dishCollection = client.db("bengleDishDb").collection("services");
    const reviewCollection = client.db("bengleDishDb").collection("reviews");

    app.get("/dishes", async (req, res) => {
      const query = {};
      const cursor = dishCollection.find(query);
      const dishes = await cursor.toArray();
      res.send(dishes);
    });
  } finally {
  }
};
run().catch((err) => console.error(err));

//middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`Service review server is running`);
});

app.listen(port, () => {
  console.log(`your Service review server is runngin on port${port}`);
});
