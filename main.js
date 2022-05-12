const screen = document.getElementById('screen');
let userInput = document.getElementById('chat_input');
const sendButton = document.getElementById('send_message_btn');
const userTypingStatus = document.getElementById('user_typing_status');
let typingTimer;

const socket = io('http://localhost:3000');
const sensitiveWords = [
    'dm',
    'dkm',
    'adu',
    'cailon',
    'loz',
    'concac',
    'dkmm',
    'duma',
    'ma',
    'me',
    'tdn',
    'concu',
    'concho',
    'chó',
    'con di',
    'suc vat',
    'địt mẹ',
    'con cặc',
];

socket.on('connect', () => {});

socket.on('receive_message', (message) => {
    displayOpponentMessage(message);
});

socket.on('user_are_typing', (username) => {
    displayUserTypingStatus(username);
});

userInput.addEventListener('keydown', (e) => {
    clearTimeout(typingTimer);
    socket.emit('user_typing', 'Tri');
});

userInput.addEventListener('keyup', (e) => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(hideUserTypingStatus, 5000);
});

const isSensitiveMessage = (message) => {
    return sensitiveWords.includes(message);
};

const convertWordWithHiddenSensitiveWord = (message) => {
    const wordSplitted = message.split(' ');

    const convertedWords = wordSplitted.map((word) => {
        return isSensitiveMessage(word) ? '***' : word;
    });

    return convertedWords.join(' ');
};

sendButton.addEventListener('click', (e) => {
    e.preventDefault();
    const message = userInput.value;
    if (message !== '') {
        displayMeMessage(message);
        socket.emit('send_message', message);
        userInput.value = '';
        userInput.focus();
    }
});

const displayMeMessage = (message) => {
    const meMessageContainer = document.createElement('div');
    meMessageContainer.classList.add('me_message_container');

    const meMessageText = document.createElement('div');
    meMessageText.classList.add('me_message_text');

    meMessageText.textContent = convertWordWithHiddenSensitiveWord(
        message.trim()
    );
    meMessageContainer.append(meMessageText);

    screen.append(meMessageContainer);

    scrollToBottom();
};

const displayOpponentMessage = (message) => {
    const opponentMessageContainer = document.createElement('div');
    opponentMessageContainer.classList.add('opponent_message_container');

    const opponentMessageText = document.createElement('div');
    opponentMessageText.classList.add('opponent_message_text');

    opponentMessageText.textContent = convertWordWithHiddenSensitiveWord(
        message.trim()
    );
    opponentMessageContainer.append(opponentMessageText);

    screen.append(opponentMessageContainer);

    scrollToBottom();
};

const scrollToBottom = () => {
    screen.scrollTo({
        top: screen.scrollHeight,
        left: 0,
        behavior: 'smooth',
    });
};

const displayUserTypingStatus = (username) => {
    userTypingStatus.content = `${username} are typing ...`;
    userTypingStatus.style.display = 'block';
};

const hideUserTypingStatus = () => {
    userTypingStatus.style.display = 'none';
};
