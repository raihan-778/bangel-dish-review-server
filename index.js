const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const jwt = require("jsonwebtoken");
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

    // api for jwt token generation
    app.post("/jwt", (req, res) => {
      const user = req.body;
      // console.log(user);
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.send({ token });
    });

    //get all data form mongodb
    app.get("/dishes", async (req, res) => {
      const query = {};
      const sort = { length: -1 };
      const cursor = dishCollection.find(query).sort(sort);
      const dishes = await cursor.toArray();
      res.send(dishes);
    });

    //single post request
    app.post("/dishes", async (req, res) => {
      const singleDish = req.body;
      const result = await dishCollection.insertOne(singleDish);
      res.send(result);
    });

    //get all review form mongodb
    app.get("/reviews", async (req, res) => {
      const query = {};
      const date = -1;
      const cursor = reviewCollection.find(query).sort(date);
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

    // single review post
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    // delete review
    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    });

    // update reviews
    app.patch("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const text = req.body.text;
      console.log(text);
      const query = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: {
          text: text,
        },
      };
      const result = await reviewCollection.updateOne(query, updatedDoc);
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
      const sort = { length: -1 };
      const query = {};
      const cursor = dishCollection.find(query).limit(3).sort(sort);
      const homeDishes = await cursor.toArray();
      res.send(homeDishes);
    });
    app.post("/homeDishes", async (req, res) => {
      const singleDish = req.body;
      const result = await dishCollection.insertOne(singleDish);
      res.send(result);
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
