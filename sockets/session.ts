import { Socket} from 'socket.io-client'
export default class SessionSocket {
    private socket : Socket;
    constructor(socket: Socket) {
        this.socket = socket;
    }

    emitJoinSession({ uId, sId}: { uId: string, sId: string}){
        this.socket.emit('join-session', { uId, sId });
    }
}

