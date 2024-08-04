const express = require('express');
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")))
const Chat = require("./models/chat.js")

main().then(()=>{
    console.log("Connection Successful")
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}
app.get("/chats",async (req,res)=>{
    let chats = await Chat.find();
   
    res.render("index.ejs",{chats});
})
app.get("/chats/new",(req,res)=>{
    
    res.render("new.ejs");
})
app.post("/chats",(req,res)=>{
    let {from,msg,to}=req.body;
    let newChat = new Chat({
    from: from,
    to: to,
    msg: msg,
    created_at:new Date()
})
newChat.save().then((res)=>{
    console.log("Chat was saved")
})
.catch(err => console.log(err));
res.redirect("/chats");
})
app.get("/chats/:id/edit",async(req,res)=>{
    let{id}=req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs",{chat});
})
app.get("/", (req, res) => {
    res.send("root is working");
})
app.put("/chats/:id",async(req,res)=>{
    let {id}=req.params;
    let {msg:newmsg}=req.body;
   await Chat.findByIdAndUpdate(id,{msg:newmsg},{runValidators:true})
    res.redirect("/chats");
    
})
app.delete("/chats/:id",async (req,res)=>{
    let {id}=req.params;
    await Chat.findByIdAndDelete(id);
    res.redirect("/chats");
})

app.listen(8080, () => {
    console.log("Server is listening")
})
