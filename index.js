const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://InventoryDb:VuP8qgGzcedDmvTr@cluster0.kkgin.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    
    try {
        await client.connect();
        const carCollection = client.db('carInventory').collection('cars');
        
        app.get('/cars', async (req, res) => {
            const query = {};
            const cursor = carCollection.find(query);
            const cars = await cursor.toArray();
            res.send(cars)
        })
        app.get('/cars/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const car = await carCollection.findOne(query);
            res.send(car);
        });
        app.delete('/cars/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await carCollection.deleteOne(query);
            res.send(result);
        });
    }
    finally {
        
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('running Car inventory Server');
});
app.listen(port, () => {
    console.log('Listening to port',port);
})
// m64sx8DQ5FN8dM3y
// carInventory
// cm7dPyMxCXBzfRsS