import express from 'express'
import amqp from 'amqplib'

const app = express()
app.use(express.json())
app.get("/get-message", async(req, res) => {
    const data ={
        title:"The History of Ottomon Empire",
        author:"Sultan Fateh Mohammed"
    }
    const SendDataQueue = await sendData(data)
    console.log("Data Send!", SendDataQueue)
    res.status(200).json({
        sucess: true,
        message: "Hello World",
        data:SendDataQueue
    })
})
let channel, connection;
const rabbitMQURL = "amqp://localhost:5672"
async function connectQueue(){
    try {
        connection = await amqp.connect(rabbitMQURL)
        channel =  await connection.createChannel()
        await channel.assertQueue("test-queue")
    } catch (error) {
        console.log(error)
        
    }
}
connectQueue()


async function sendData(data){
    try {
        await channel.sendToQueue("test-queue", Buffer.from(JSON.stringify(data)));
        await channel.close()
        await connection.close()
    } catch (error) {
        console.log(error)

        
    }
}


const PORT = 4001
app.listen(PORT, () => {
    console.log(`The server has started on PORT:${PORT}`)
})