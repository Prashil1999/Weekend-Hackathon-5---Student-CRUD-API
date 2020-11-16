const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
app.use(express.urlencoded());
const students=require("./InitialData");
let count=7;

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// your code goes here

app.get("/api/student",(req,res)=>{
    res.send(students);
});

app.get("/api/student/:id",(req,res)=>{
    let id=req.params.id;
    let studentIndex=students.findIndex((student)=>{return student.id===parseInt(id)});
    if(studentIndex===-1){
        //res.status(404).send("");
        res.sendStatus(404);
        return;
    }
    res.send(students[studentIndex]);
});

app.post("/api/student",(req,res)=>{
    let {name,currentClass,division}=req.body;
    if(!name || !currentClass || !division){
        //res.status(400).send("");
        res.sendStatus(400);
        return;
    }
    let student={...req.body,id:++count};
    students.push(student);
    res.send(student);
});

app.put("/api/student/:id",(req,res)=>{
    let id=req.params.id;
    let studentIndex=students.findIndex((student)=>{return student.id===parseInt(id)});
    let keys=Object.keys(req.body);
    let isValid=true;
    for(let i=0;i<keys.length;i++){
        if(!"name currentClass division".includes(keys[i])){
            isValid=false;
        }
    }
    if(studentIndex===-1 || !isValid || !req.body.name){
        res.sendStatus(400);
        return;
    }
    students[studentIndex]={...req.body,id:students[studentIndex].id};
    res.send(students[studentIndex]);
});

app.delete("/api/student/:id",(req,res)=>{
    let id=req.params.id;
    // if(isNaN(parseInt(id))){
    //     res.sendStatus(400);
    //     return;
    // }
    let studentIndex=students.findIndex((student)=>{return student.id===parseInt(id)});
    if(studentIndex===-1){
        res.sendStatus(404);
        return;
    }
    let student=students[studentIndex];
    students.splice(studentIndex,1);
    res.send(student);

});

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;   