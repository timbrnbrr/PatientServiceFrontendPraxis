/**
 * Slimmed version of PatientServiceFrontend to demonstrate loading of data when checking in with RFID-Card
 * Therefore, this service consumes events containing the userId from Kafka Streams Databus and
 * opens patientData.html to show the related data.
 *
 * @type {createApplication}
 */

var express = require('express');
var app = express();
var open = require('open');
var kafka = require('kafka-node');
var path = require('path');

app.use(express.static('web'));

app.listen(4000, function () {
  console.log('Frontend listening on port 4000!');
});

app.get('/:id', function (req, res) {
    res.sendFile(path.join(__dirname + '/web/patientData.html'));
});

var Consumer = kafka.Consumer;
var client = new kafka.KafkaClient();
var consumer = new Consumer(
    client,
    [
      { topic: 'pdi-topic', partition: 0 }
    ],
    {
      autoCommit: false
    }
);

consumer.on('message', function (message) {
  console.log(message);

  open('http://localhost:4000/' + message.value, {app: 'chrome'});

});



