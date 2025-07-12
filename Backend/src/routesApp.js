const express= require('express');
const app= express();

app.get("/ab?c", (req, res)=>{
    res.send("? Testing");
})

app.get("/ab*c", (req, res)=>{
    res.send("* Testing");
})

app.get("/ab+c", (req, res)=>{
    res.send("+ Testing");
})

app.get("/a(bc)+d", (req, res)=>{
    res.send("Grouped Testing");
})

app.get(/a/, (req, res)=>{
    res.send("/a/ Testing");
})

app.get(/.*fly$/, (req, res)=>{
    res.send("Regex Testing");
})

app.get("/user", (req, res)=>{
    res.send("Get request");
})

app.post("/user", (req, res)=>{
    res.send("Post request");
})

app.delete("/user", (req, res)=>{
    res.send("Delete request");
})


app.use("/Hello", (req,res)=>{
    res.send("Hello");
})




app.use("/User", (req, res, next)=>{
    console.log("1st response");
    // res.send("1st Response");
    next();
   
},
(req, res, next)=>{
    console.log("2nd response");
    // res.send("2nd Response");
    next();
},
(req, res, next)=>{
    console.log("3rd response");
    res.send("3rd Response");
    next();
},
(req, res, next)=>{
    console.log("4th response");
    res.send("4th Response");
})

app.listen(7777, ()=>{
    console.log("Server runing on port 7777...");
})