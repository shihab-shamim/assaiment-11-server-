const express =require('express')
const cors =require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port=process.env.PORT || 5000
const app =express()

const corsOptions = {
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
    
    ],
    // credentials: true,
    // optionSuccessStatus: 200,
  }
  app.use(cors(corsOptions))
  app.use(express.json())



  

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u53e1so.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const queryCollection = client.db("queryDb").collection("queries");
    

    app.post('/query',async(req,res)=>{
        const query=req.body
        console.log(query)

        const result=await queryCollection.insertOne(query)

        res.send(result)

        
    })
    
    app.get('/query',async (req,res)=>{

        const result = await queryCollection.find().toArray()

      res.send(result)
    })
    app.get('/query/:id',async (req,res)=>{
        const id=req.params.id
        const query = { _id: new ObjectId(id) };
        const result = await queryCollection.findOne(query);
        res.send(result)
    })
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
    res.send(' Server Is Running....')
  })
  
  app.listen(port, () => console.log(`Server running on port ${port}`))