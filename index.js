const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4lwt8qz.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const Products = client.db("ema-jhon-simple").collection("products");

    app.get("/products", async (req, res) => {
      const perPageData = parseInt(req.query.perPageData);
      const currentPage = parseInt(req.query.currentPage);

      const query = {};
      const product = Products.find(query);
      const products = await product
        .skip(currentPage * perPageData)
        .limit(perPageData)
        .toArray();
      const count = await Products.estimatedDocumentCount();
      res.send({ count, products });
    });

    app.post("/preductsIds", async (req, res) => {
        const ids = req.body;
        const objectIds = ids.map(id => ObjectId(id))
        const query = { _id: { $in: objectIds } };
        const product = Products.find(query)
        const products = await product.toArray()
        res.send(products)
    });

      
  } finally {
  }
}

run().catch((err) => console.log(err));

app.listen(port, () => console.log(`port is running ${port}`));
