const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const events = [];

app.post('/events', (req, res) => {
    const event = req.body;

    console.log('event-bus: EVENT:', event);

    events.push(event);

    // Send to posts service
    axios.post(`http://localhost:4000/events`, event).catch((err) => {
        console.log('event-bus:', err.message);
    });
    // Send to comments service
    axios.post(`http://localhost:4001/events`, event).catch((err) => {
        console.log('event-bus:', err.message);
    });
    // Send to query service
    axios.post(`http://localhost:4002/events`, event).catch((err) => {
        console.log('event-bus:', err.message);
    });
    // Send to moderator service
    axios.post(`http://localhost:4003/events`, event).catch((err) => {
        console.log('event-bus:', err.message);
    });
    res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
    res.send(events);
});

app.listen(4005, () => {
    console.log('event-bus: listening on http://localhost:4005');
});
