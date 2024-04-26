const express = require("express")
const app = express()
const cors = require("cors")
const {MongoClient, ObjectId} = require("mongodb")
require("dotenv").config()
const PORT = 7860

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = "sample_mflix",
    collection 

MongoClient.connect(dbConnectionStr)
    .then(client => {
        db = client.db(dbName)
        console.log(`Connected to database`)
        collection = db.collection("movies")
    })

app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(cors())

app.use(express.static("public"));

app.get("/search", async (req,res) => {
    try{
        let result = await collection.aggregate([
            {"$search" : {
                "autocomplete": {
                    "query" :  `${req.query.query}`,
                    "path": "title",
                    "fuzzy": {
                        "maxEdits":2,
                        "prefixLength":3
                    }
                }
            }
        }
        ]).toArray()
        res.send(result)
    } catch (error) {
        res.status(500).send({message: error.message})
    }
})

app.get("/get/:id", async (req, res) => {
    try {
        let result = await collection.findOne({
            "_id": new ObjectId(req.params.id)
        })
        res.send(result)
    } catch (error){
        res.status(500).send({message: error.message})
    }
})

// app.get("/", (req, res) => {
//     res.send("Welcome to the server!");
// });
app.listen(process.env.PORT || PORT, () => {
            console.log(`Server is running on PORT ${PORT}`)
        })