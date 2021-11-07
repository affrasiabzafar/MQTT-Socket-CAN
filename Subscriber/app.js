const express = require('express');
const app = express();
const port = 4142;
var can = require('socketcan');
var mqtt = require('mqtt')
const fs = require('fs');

var channel = can.createRawChannel("vcan0");
channel.start();


var data;

var client = mqtt.connect('mqtt://localhost:1111')
var topic= 'canMessage'
client.on('message', (topic, message)=>{
    data = message;
    message = message.toString()
    fs.writeFileSync('data.json', message);
    var parseMessage = JSON.parse(message);
  

  for (var i = 0; i < parseMessage.length; i++){
    var value = Object.values(parseMessage[i]);
     var buffer2 = Buffer.from(value[1]);

    
    console.log(value[1]);
    channel.send({ id: value[4],
      ext: true,
      data: buffer2
    
  });
    
  }

})

client.on('connect', ()=>{
    client.subscribe(topic)
})


app.listen(port, () => {
  console.log(`Server running on port${port}`);
});