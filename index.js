const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const { parse } = require('dotenv');
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a1obszd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const productCollection = client.db("productDB").collection("products");
    app.get('/products', async(req, res)=>{
        const page = parseInt(req.query.page);
        const items = parseInt(req.query.items);
        const brand = req.query.brand;
        const categoryName = req.query.categoryName;
        const minPrice = parseFloat(req.query.minPrice);
        const maxPrice = parseFloat(req.query.maxPrice);
        const search = req.query.search;
        let query = {};
        if(brand){
            query = {brandName: brand};
        }
        if(categoryName){
            query = {...query, category: categoryName};
        }
        if(minPrice || maxPrice){
           query= {...query, price: {$gte: minPrice, $lte: maxPrice}};
        }
        if(search){
            query = {...query, productName:{$regex: search, $options: 'i'}};
        }
        const result = await productCollection.find(query)
        .skip((page-1)*items)
        .limit(items)
        .toArray();
        res.send(result)
    })
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', async (req, res) => {
    res.send('Mega Buyz Server running');
})

app.listen(port, () => {
    console.log('Mega Buyz running on port,', port);
})