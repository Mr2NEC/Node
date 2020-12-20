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

const func = {
    getMessages: (messageId) => {
        let newMessage;

        if (messageId === 0) {
            newMessage = messages;
            return { data: newMessage, nextMessageId: messages.length };
        }

        newMessage = messages.slice(messageId);
        return { data: newMessage, nextMessageId: messages.length };
    },

    addMessage: ({ nick, message }) => {
        let newMessage = {
            nick: nick,
            message: message,
            timestamp: new Date().getTime(),
        };
        messages.push(newMessage);
        return newMessage.timestamp;
    },
};

app.post('/message', (req, res) => {
    switch (req.body.func) {
        case 'getMessages':
            const getMessagesResult = func.getMessages(req.body.messageId);
            res.status(201).end(JSON.stringify(getMessagesResult));
            break;
        case 'addMessage':
            const addMessageResult = func.addMessage(req.body);
            res.status(201).end(JSON.stringify(addMessageResult));
            break;
        default:
            break;
    }
});

app.put('/message/:timestamp', (req, res) => {

    const { timestamp: skip, ...newMessage } = { ...req.body };
    const { timestamp } = req.params;

    const oldMsg = messages.find(
        ({ timestamp: oldMsgtimestamp }) => oldMsgtimestamp === +timestamp
    );

    if (!oldMsg) {
        res.status(404).end(`{"error": "Message ID: ${timestamp} Not Found"}`);
        return
    }

    Object.assign(oldMsg, newMessage);

    res.status(204).end(JSON.stringify(oldMsg));
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
