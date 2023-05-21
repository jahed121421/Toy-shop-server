const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

// middleware
const corsConfig ={
  origin:'',
  credential: true,
  methods: ["GET", "PUT", "PATCH", "DELETE", "OPTIONS", "POST"]
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig))
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.qutetvc.mongodb.net/?retryWrites=true&w=majority`;

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
    //  await client.connect();



    const database = client.db("toyshop").collection('alldata');


    const indexKeys = {name:1, catagory:1};
    const indexOptions = {titel: "nameCategory"};
    // const result = await database.createIndex(indexKeys, indexOptions);



    // app.get("/datasearch/:text", async(req, res)=>{
    //   const searchText = req.params.text;
    //   const result = await database.find({
    //     $or :[{
    //       name: {$regex: searchText, $options: "i"}
    //     },
    //     {
    //       catagory: {$regex: searchText, $options: "i"}
    //     }],
    //   }).toArray();
    //   res.send(result);
    // })
    
    app.get('/alldata', async(req, res)=>{
      const cousor = database.find();
      const result = await cousor.limit(20).toArray();
      res.send(result);
    })
    app.post('/sendtoydata', async(req, res)=>{
      const body = req.body;
      console.log(body);
      const result = await database.insertOne(body);
      res.send(result);
    })

    app.get('/alldata/:id', async(req,res)=>{
    const id = req.params.id;
    const query = {_id : new ObjectId(id)}
    const result = await database.findOne(query);
    res.send(result)
    })
    app.get('/mytoy', async(req,res)=>{
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email
        }
      }
    const result = await database.find(query).toArray();
    res.send(result)
    })
    app.delete('/mytoy/:id', async (req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await database.deleteOne(query);
      res.send(query);
    })

    app.get('/mytoy/:id', async (req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await database.findOne(query);
      res.send(result)
    })
    app.put('/mytoy/:id', async (req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const body = req.body;
      const update ={
        $set: {
          price :body.price,
          description: body.description,
          quantity: body.quantity,
          image: body.image

        },
      };
      const result = await database.updateOne(query, update);
      res.send(result)
    });

   
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Website is running')
})

app.listen(port, () => {
  console.log(`Website listening on port ${port}`)
})
module.exports = app;