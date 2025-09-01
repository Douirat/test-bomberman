import { store } from '../store.js';
import { send } from '../ws.js';
import { router } from '../router.js';
import { NicknameScreen } from '../components/NicknameScreen.js';

export function NicknameScreenContainer() {
    const handleJoin = (nickname, roomId) => {
        store.dispatch({ type: 'SET_NICKNAME', payload: nickname });
        // Include roomId in the payload if it's provided
        send({ type: 'JOIN_GAME', payload: { nickname, roomId } });
    };

    return NicknameScreen({ onJoin: handleJoin });
}
