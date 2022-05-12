const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kkgin.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
    console.log('inventory connected');
  client.close();
});


app.get('/', (req, res) => {
    res.send('running Car inventory Server');
});
app.listen(port, () => {
    console.log('Listening to port',port);
})
// m64sx8DQ5FN8dM3y
// carInventory
// cm7dPyMxCXBzfRsS