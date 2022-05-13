const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
app.use(cors());
app.use(express.json());
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({message:'unauthorized access'})
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({message:'Forbidden access'})
        }
        console.log('decoded', decoded);
        req.decoded = decoded;
        next();
    })
    
    
}
const uri = `mongodb+srv://InventoryDb:VuP8qgGzcedDmvTr@cluster0.kkgin.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    
    try {
        await client.connect();
        const carCollection = client.db('carInventory').collection('cars');
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            res.send({ accessToken });
        });
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
        app.post('/cars', async (req, res) => {
            const newCar = req.body;
            const result = await carCollection.insertOne(newCar);
            res.send(result);
        });
        // app.put('/cars/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const updatedQuantity = req.body;
        //     const filter = { _id: ObjectId(id) };
        //     const options = { upsert: true };
        //     const updatedDoc = {
        //         $set: {
        //             quantity: updatedQuantity.quantity
                    
        //         }
        //     };
        //     const result = await carCollection.updateOne(filter, updatedDoc, options);
        //     res.send(result)
        // })  
        app.put('/cars/:id', async (req, res) => {
            const id = req.params.id;
            const updatedCar = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: updatedCar.name,
                    
                }
            };
            const result = await carCollection.updateOne(filter, updatedDoc, options);
            res.send(result)
        }) 
        app.get('/cars', verifyJWT, async (req, res) => {
            const decodedEmail = req.decoded.email
            const email = req.query.email;
            
            if (email === decodedEmail) {
                const query = { email: email };
                const cursor = carCollection.find(query);
                const car = await cursor.toArray();
                res.send(car)
            }
            else {
                res.status(403).send({ message: 'Forbidden access' })
            }
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
