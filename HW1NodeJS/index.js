const express = require('express');
const { json } = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 4000;

const messages = [{ nick: 'Serg', message: 'Hello', timestamp: 1602089736601 }];

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/message', (req, res) => {
    res.end(JSON.stringify(messages));
});

function getMessages(messageId) {
    let newMessage;
    console.log(messageId);

    if (messageId === 0) {
        newMessage = messages;
        console.log(newMessage);
        return { data: newMessage, nextMessageId: messages.length };
    }

    newMessage = messages.slice(messageId);
    console.log(newMessage);
    return { data: newMessage, nextMessageId: messages.length };
}

app.post('/message', (req, res) => {
    console.log(req.body);

    switch (req.body.func) {
        case 'getMessages':
            const result = getMessages(req.body.messageId);
            res.status(201).end(JSON.stringify(result));
            break;
        case 'getMessages':

        default:
            break;
    }
    // messages.push(newMessage);
    // const newMessage = { ...req.body, timestamp: new Date().getTime() };
    // res.status(201).end(JSON.stringify(newMessage));
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
