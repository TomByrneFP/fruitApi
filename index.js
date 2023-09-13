//Fruit Api
require('dotenv').config()
const cors = require('cors')
const fruits = require("./fruits.json")
const express = require("express")
const app = express()
const port = process.env.PORT

app.use(cors())
app.use(express.json())

app.get("/", (req,res) => {
    res.send("Hello Fruit API")
})

app.get("/fruits", (req,res) => {
    res.send(fruits)
})

const getFruitIndex = name => {
    //Take in a lowercase fruitname and returns the index of the fruit
    // or -1
    
    return fruits.findIndex((fruit) => fruit.name.toLowerCase() == name)
}

app.post("/fruits", (req, res) => {
    //Check if the fruit exists
    const fi = getFruitIndex(req.body.name.toLowerCase())
    if(fi > -1){
        res.status(409).send("The fruit already exists")
    }else{
        //Create an array of all ids
        const ids = fruits.map((fruit) => fruit.id)
        //Get the maximum ID
        let maxId = Math.max(...ids)
        //Increment that by one
        maxId++
        //Adjust ID to new maxId
        req.body.id = maxId

        fruits.push(req.body)
        res.status(201).send(req.body)
    }

})

app.delete("/fruits/:name", (req,res) => {
    const fi = getFruitIndex(req.params.name.toLowerCase())
    if( fi == -1){
        //Fruit Can not be found
        res.status(404).send("Fruit can not be found")
    }else{
        fruits.splice(fi,1)
        res.sendStatus(200)
    }
})

app.get("/fruits/:name", (req,res) => {
    //res.send(`Return a fruit with ${req.params.name} name`)
    const name = req.params.name.toLowerCase() //Get the name of what I am searching for
    //Search Fruits.json (fruits) to return fruit if the names match
    const fruit = fruits.find(fruit => fruit.name.toLowerCase() == name)
    if(fruit == undefined){
        //There is NO Fruit
        res.status(404).send("The fruit doesn't exist")
    }else{
        //If there is a Fruit
        res.send(fruit)
    }
})


app.listen(port, () => {
    console.log(`Server is now listening on port ${port}`)
})