import FacileJS from '../../framework/index.js';

export function NicknameScreen({ onJoin }) {
    let nickname = '';
    let roomId = ''; // Add a variable for the room ID

    const handleNicknameInput = (e) => {
        nickname = e.target.value;
    };

    const handleRoomIdInput = (e) => {
        roomId = e.target.value;
    };

    const handleJoin = () => {
        if (nickname.trim().length > 0) {
            // Pass both nickname and roomId to the handler
            onJoin(nickname, roomId.trim());
        }
    };

    return FacileJS.createElement('div', { class: 'container nickname-screen' },
        FacileJS.createElement('h1', {}, 'Bomberman-DOM'),
        FacileJS.createElement('input', {
            type: 'text',
            placeholder: 'Enter your nickname',
            oninput: handleNicknameInput,
            onkeyup: (e) => e.keyCode === 13 && handleJoin()
        }),
        FacileJS.createElement('input', { // Add a new input field for the room ID
            type: 'text',
            placeholder: 'Enter Room ID (optional)',
            oninput: handleRoomIdInput,
            onkeyup: (e) => e.keyCode === 13 && handleJoin()
        }),
        FacileJS.createElement('button', { onclick: handleJoin }, 'Join Game')
    );
}
