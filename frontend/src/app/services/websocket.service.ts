import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { CallDto } from '../dto/call.dto';
import { PeerDto } from '../dto/peer.dto';
import { AnswerDto } from '../dto/answer.dto';
import { IceCandidateDto } from '../dto/ice-candidate.dto';
import { MessageDto } from '../dto/message.dto';

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {
    private socket: Socket;

    constructor() {
        const username = localStorage.getItem('username');
        this.socket = new Socket({
            url: 'http://localhost:5000', options: {
                transports: ['websocket'],
                withCredentials: true,
                extraHeaders: {
                    'Access-Control-Allow-Origin': 'http://localhost:3000'
                },
                query: {
                    username
                }
            }
        });
    }

    getOnlineUsers() {
        return this.socket.fromEvent<string[]>('online');
    }

    initiateCall(data: CallDto) {
        this.socket.emit('initiateCall', data);
    }

    acceptCall(data: CallDto) {
        this.socket.emit('acceptCall', data);
    }

    rejectCall(data: CallDto) {
        this.socket.emit('rejectCall', data);
    }

    sendOffer(data: PeerDto) {
        this.socket.emit('offer', data);
    }

    sendAnswer(data: AnswerDto) {
        this.socket.emit('answer', data);
    }

    sendIceCandidate(data: IceCandidateDto) {
        this.socket.emit('iceCandidate', data);
    }

    sendHangUp(data: string) {
        this.socket.emit('hangup', data);
    }

    onCallInitiated() {
        return this.socket.fromEvent<string>('callInitiated');
    }

    onCallAccepted() {
        return this.socket.fromEvent<string>('callAccepted');
    }

    onCallRejected() {
        return this.socket.fromEvent<string>('callRejected');
    }

    onConnect() {
        return this.socket.fromEvent<string>('user-connect');
    }

    onDisconnect() {
        return this.socket.fromEvent<string>('user-disconnect');
    }

    onOffer() {
        return this.socket.fromEvent<RTCSessionDescriptionInit>('onOffer');
    }

    onAnswer() {
        return this.socket.fromEvent<RTCSessionDescriptionInit>('onAnswer');
    }

    onIceCandidate() {
        return this.socket.fromEvent<RTCIceCandidate>('onIceCandidate');
    }

    onHangup() {
        return this.socket.fromEvent('onHangup');
    }

    // Chat
    sendMessage(data: MessageDto) {
        this.socket.emit('message', data);
    }

    onMessage() {
        return this.socket.fromEvent<MessageDto>('onMessage');
    }
}
