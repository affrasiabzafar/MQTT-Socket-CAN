const express = require('express');
const app = express();
const fs = require('fs');
const port = 4141;
var mosca = require('mosca')
var mqtt = require('mqtt');

var vehicleData = JSON.parse(fs.readFileSync(__dirname+'/data.json', 'utf8'));

vehicleData = JSON.stringify(vehicleData)


var broker = new mosca.Server({port: 1111})

broker.on('ready', ()=>{
    console.log('Broker working!')
})

broker.on('published', (packet)=>{
    message = packet.payload.toString()
    console.log('On Published',message)
})




app.get('/publish', (req, res) => {
var client = mqtt.connect('mqtt://localhost:1111')

client.on('connect', ()=>{
        client.publish('canMessage', vehicleData)
        console.log('Data Published!', vehicleData)
})
res.send('Data Sent!!!');
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});