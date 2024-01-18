const mongoose = require('mongoose')

const DB = "mongodb+srv://akashwani2209:Aaadavoo8@cluster0.gcuscun.mongodb.net/agroFarm2?retryWrites=true&w=majority"

mongoose.connect(DB,{
    
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>console.log("connection start")).catch((error)=>console.log(error.message));