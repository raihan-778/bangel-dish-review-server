const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

    //get all data form mongodb
    app.get("/dishes", async (req, res) => {
      const query = {};
      const cursor = dishCollection.find(query);
      const dishes = await cursor.toArray();
      res.send(dishes);
    });
    //get all review form mongodb
    app.get("/reviews", async (req, res) => {
      const query = {};
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    //get individuals review

    app.get("/myreviews", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    //single post request
    app.post("/dishes", async (req, res) => {
      const singleDish = req.body;
      const result = await dishCollection.insertOne(singleDish);
      res.send(result);
    });

    // single review post
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    //single query by id

    app.get("/dishes/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const singleDish = await dishCollection.findOne(query);
      res.send(singleDish);
    });

    app.get("/homeDishes", async (req, res) => {
      const query = {};
      const cursor = dishCollection.find(query).limit(3);
      const homeDishes = await cursor.toArray();
      res.send(homeDishes);
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
