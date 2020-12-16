const express = require("express")
const db = require("../data/config")

const router = express.Router()

router.get("/", async(req, res, next) => {
try{
//SELECT * FROM messages;
//translates to `SELECT * FROM messages
const messages = await db.select("*").from("messages")
res.json(messages);
}catch(err){
    next(err)
}
})

router.get("/:id", async(req, res, next) => {
    try{
//select * FROM messages WHERE id = ? ;
const [message] = await db
.select("*")
.from("messages")
.where("id", req.params.id)
.limit(1)
res.json(message);
    }catch(err){
        next(err)
    }
})

router.post("/",async (req, res, next) => {
    try{
//insert into messages (title, contents) VALUES (?,?);
//use a payload obj just in case req.body containes an id or dates
const payload = {
    //send this to thje db
    //db auto generets the id and the dates
    title: req.body.title,
    contents: req.body.contents
}
const [id] = await db.insert(payload).into("messages")
//knex returns the new generated id from the insert command
const newMessage = await db.first().from("messages").where("id", id)
//we dont have to specify a wild card and we dont have to do a from we can just do db("messages")
res.status(201).json(newMessage)
    }catch(err){
        next(err)
    }
})

router.put("/:id",async (req, res, next) => {
    try{
        const payload = {
            //send this to thje db
            //db auto generets the id and the dates
            title: req.body.title,
            contents: req.body.contents
        }
        //UPDATE messages SET title = ? AND contents = ? WHERE id = ?
        await db("messages").where("id", req.params.id).update(payload)
        const updatedMessage = await db("messages").where("id", req.params.id).first()
        res.json(updatedMessage)
    }catch(err){
        next(err)
    }
})

router.delete("/:id", async(req, res, next) => {
    try{
//DELETE FROM messages WHERE id = ?;
await db("messages").where("id", req.params.id).del()
res.status(204).end()
    }catch(err){
        next(err)
    }
})

module.exports = router