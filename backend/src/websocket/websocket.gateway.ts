import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { WebsocketService } from './websocket.service';
import { Server, Socket } from 'socket.io';
import { CallDto } from './dto/call.dto';
import { PeerDto } from './dto/peer.dto';
import { AnswerDto } from './dto/answer.dto';
import { IceCandidateDto } from './dto/ice-candidate.dto';
import { MessageService } from 'src/message/message.service';

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server
    private users: Map<string, Socket> = new Map()

    constructor(
        private websocketService: WebsocketService,
        private messageService: MessageService
    ) { }

    handleConnection(socket: Socket) {
        const username = socket.handshake.query.username as string;
        this.users.set(username, socket)
        socket.emit('online', Array.from(this.users.keys()).filter(u => u !== username))
        socket.broadcast.emit('user-connect', username)
    }

    handleDisconnect(socket: Socket) {
        const username = Array.from(this.users).find(([_, s]) => s === socket)?.[0]
        this.users.delete(username)
        this.server.emit('user-disconnect', username)
    }

    @SubscribeMessage('initiateCall')
    async initiateCall(@MessageBody() data: CallDto) {
        const receiver = this.users.get(data.receiver)
        if (receiver) {
            receiver.emit('callInitiated', data.caller)
        }
    }

    @SubscribeMessage('acceptCall')
    async acceptCall(@MessageBody() data: CallDto) {
        const caller = this.users.get(data.caller)
        if (caller) {
            caller.emit('callAccepted', data.receiver)
        }
    }

    @SubscribeMessage('rejectCall')
    async rejectCall(@MessageBody() data: CallDto) {
        const caller = this.users.get(data.caller)
        if (caller) {
            caller.emit('callRejected', data.receiver)
        }
    }

    @SubscribeMessage('offer')
    async offer(@MessageBody() data: PeerDto) {
        const receiver = this.users.get(data.receiver)
        if (receiver) {
            receiver.emit('onOffer', data.offer)
        }
    }

    @SubscribeMessage('answer')
    async answer(@MessageBody() data: AnswerDto) {
        const caller = this.users.get(data.receiver)
        if (caller) {
            caller.emit('onAnswer', data.answer)
        }
    }

    @SubscribeMessage('iceCandidate')
    async iceCandidate(@MessageBody() data: IceCandidateDto) {
        const receiver = this.users.get(data.receiver)
        if (receiver) {
            receiver.emit('onIceCandidate', data.candidate)
        }
    }

    @SubscribeMessage('hangup')
    async hangup(@MessageBody() data: string) {
        const receiver = this.users.get(data)
        if (receiver) {
            receiver.emit('onHangup')
        }
    }

    @SubscribeMessage('message')
    async message(@MessageBody() data: { sender: string, receiver: string, text: string }) {
        const receiver = this.users.get(data.receiver)
        if (receiver) {
            receiver.emit('onMessage', data)
        }
        await this.messageService.createMessage(data.sender, data.receiver, data.text)
    }
}
