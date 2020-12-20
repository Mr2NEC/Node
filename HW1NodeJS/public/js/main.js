let wrapperElem = document.querySelector('#wrapper');
let input1Elem = document.createElement('input');
input1Elem.type = 'name';
input1Elem.style = 'padding: 10px; margin: 10px;';
input1Elem.placeholder = 'Enter your Nickname';
wrapperElem.appendChild(input1Elem);
let input2Elem = document.createElement('input');
input2Elem.type = 'text';
input2Elem.style = 'padding: 10px; margin: 10px;';
input2Elem.placeholder = 'Enter your Massege';
wrapperElem.appendChild(input2Elem);
let btn = document.createElement('button');
btn.type = 'submit';
btn.style = 'padding: 10px; margin: 10px;';
btn.innerText = 'Submit';
wrapperElem.appendChild(btn);
let divElem = document.createElement('div');
divElem.style = 'border:2px solid black;';
divElem.id = 'divBodyChat';
wrapperElem.appendChild(divElem);

const URL = 'http://localhost:4000/message';
let myMessageId = 0;
const delay = (ms) => new Promise((ok) => setTimeout(() => ok(ms), ms));

async function jsonPost(url, data) {
    let response = await fetch(url, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(data),
    });

    if (response.status == 200 || response.status == 201) {
        let json = await response.json();
        return json;
    }

    throw new Error(response.status);
}

async function putMessage(url, { timestamp, body }) {
    let response = await fetch(url + `/${timestamp}`, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify(body),
    });

    if (response.status == 204) {
      let newMessage = document.getElementById(timestamp)
      let itemList = newMessage.childNodes;
      itemList.forEach((item) => {
        item.className === 'textRed' ?item.innerText="Nick: " + body.nick: null;
        item.className=== 'textGreen'?item.innerText="Message: " + body.message: null;
    })
       return
    }

    throw new Error(response.status);
}

async function getMessages() {
    try {
        let data = await jsonPost(URL, {
            func: 'getMessages',
            messageId: myMessageId,
        });
        for (let id in data.data) {
            displayMessage(data.data[id]);
        }
        myMessageId = data.nextMessageId;
    } catch (err) {
        console.log(err);
    }
}
function displayMessage(objElem) {
    let divMessage = document.createElement('div');
    let buttonMessage = document.createElement('button');
    buttonMessage.innerText = 'Change';
    buttonMessage.addEventListener('click', () =>
        changeMessage(input1Elem.value, input2Elem.value, objElem.timestamp)
    );
    divMessage.style =
        'border: 1px solid black; padding: 10px; background: #00FFFF; display: flex; align-items: center; flex-direction: column;';
    divMessage.id =objElem.timestamp
    divMessage.innerHTML = `<div class='textRed'>Nick: ${
        objElem.nick
    }</div><div class='textGreen'>Message: ${
        objElem.message
    }</div><div class='textBlack'>Timestamp: ${timeConverter(
        objElem.timestamp
    )}</div>`;
    divMessage.appendChild(buttonMessage);
    let firstElem = divElem.firstChild;
    divElem.insertBefore(divMessage, firstElem);
}

function timeConverter(timestamp) {
    let a = new Date(timestamp);
    let months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();
    let time =
        date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
}

async function checkLoop() {
    let endlessCycle = false;
    while (!endlessCycle) {
        await delay(5000);
        getMessages();
    }
}

async function sendMessage(nick, message) {
    try {
        jsonPost(URL, {
            func: 'addMessage',
            nick: nick,
            message: message,
        });
    } catch (err) {
        console.log(err);
    }
}

async function changeMessage(nick, message, timestamp) {
    try {
        putMessage(URL, {
            timestamp: timestamp,
            body: { nick: nick, message: message },
        });
    } catch (err) {
        console.log(err);
    }
}

async function sendAndCheck() {
    await sendMessage(input1Elem.value, input2Elem.value);
    await getMessages();
}

btn.addEventListener('click', sendAndCheck);
getMessages();
checkLoop();
