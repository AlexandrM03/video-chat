import { Component, ElementRef, ViewChild } from '@angular/core';
import { WebsocketService } from '../../../services/websocket.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-call',
    standalone: true,
    imports: [MatGridListModule, MatButtonModule, MatIconModule, DragDropModule],
    templateUrl: './call.component.html',
    styleUrl: './call.component.css'
})
export class CallComponent {
    @ViewChild('localVideo') localVideo: ElementRef<HTMLVideoElement> = {} as ElementRef;
    @ViewChild('remoteVideo') remoteVideo: ElementRef<HTMLVideoElement> = {} as ElementRef;

    private peerConnection: RTCPeerConnection | null = null;
    private localStream: MediaStream | null = null;
    private receiver: string;

    inCall = false;
    localVideoActive = false;

    constructor(private websocketService: WebsocketService, private route: ActivatedRoute) {
        this.receiver = this.route.snapshot.params['username'];
    }

    async call(): Promise<void> {
        this.createPeerConnection();

        this.localStream?.getTracks().forEach(track => {
            this.peerConnection?.addTrack(track, this.localStream as MediaStream);
        });

        try {
            const offer = await this.peerConnection?.createOffer({
                offerToReceiveVideo: true,
                offerToReceiveAudio: true
            });
            await this.peerConnection?.setLocalDescription(offer);
            this.inCall = true;

            if (offer) {
                this.websocketService.sendOffer({
                    receiver: this.receiver,
                    offer
                });
            }
        } catch (e) {
            console.error('Error creating offer:', e);
        }
    }

    hangup() {
        this.websocketService.sendHangUp(this.receiver);
        this.closeVideoCall();
    }

    ngAfterViewInit() {
        this.addIncominMessageHandler();
    }

    private addIncominMessageHandler() {
        this.websocketService.onOffer().subscribe(async (data) => {
            this.handleOfferMessage(data);
        });

        this.websocketService.onAnswer().subscribe(async (data) => {
            this.handleAnswerMessage(data);
        });

        this.websocketService.onIceCandidate().subscribe(async (data) => {
            this.handleIceCandidateMessage(data);
        });

        this.websocketService.onHangup().subscribe(async (data) => {
            this.closeVideoCall();
        });
    }

    private handleOfferMessage(msg: RTCSessionDescriptionInit) {
        if (!this.peerConnection) {
            this.createPeerConnection();
        }

        if (!this.localStream) {
            this.startLocalVideo();
        }

        this.peerConnection?.setRemoteDescription(new RTCSessionDescription(msg))
            .then(() => {
                this.localVideo.nativeElement.srcObject = this.localStream;

                this.localStream?.getTracks().forEach(track => {
                    this.peerConnection?.addTrack(track, this.localStream as MediaStream);
                });
            })
            .then(() => this.peerConnection?.createAnswer())
            .then(answer => this.peerConnection?.setLocalDescription(answer))
            .then(() => {
                this.websocketService.sendAnswer({
                    receiver: this.receiver,
                    answer: this.peerConnection?.localDescription as RTCSessionDescriptionInit
                });
                this.inCall = true;
            })
            .catch(e => console.error('Error creating answer:', e));
    }

    private handleAnswerMessage(msg: RTCSessionDescriptionInit) {
        this.peerConnection?.setRemoteDescription(new RTCSessionDescription(msg))
            .catch(e => console.error('Error setting remote description:', e));
    }

    private handleIceCandidateMessage(msg: RTCIceCandidate) {
        this.peerConnection?.addIceCandidate(new RTCIceCandidate(msg))
            .catch(e => console.error('Error adding received ice candidate:', e));
    }

    startLocalVideo() {
        this.hangup();

        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        }).then(stream => {
            this.localStream = stream;
            this.localVideo.nativeElement.srcObject = this.localStream;

            this.localStream.getTracks().forEach(track => {
                this.peerConnection?.addTrack(track, this.localStream as MediaStream);
            });

            this.localVideoActive = true;

            this.call();
        }).catch(e => console.error('Error accessing media devices:', e));
    }

    startScreenShare() {
        this.hangup();

        if ((window as any).getScreenSources && typeof (window as any).getScreenSources === 'function') {
            // @ts-ignore
            window.getScreenSources().then((stream: MediaStream) => {
                this.localStream = stream;
                this.localVideo.nativeElement.srcObject = this.localStream;

                this.localStream.getTracks().forEach(track => {
                    this.peerConnection?.addTrack(track, this.localStream as MediaStream);
                });

                this.localVideoActive = true;

                this.call();
            }).catch((e: any) => console.error('Error accessing media devices:', e));
            return;
        } else {
            navigator.mediaDevices.getDisplayMedia({
                video: true
            }).then(stream => {
                this.localStream = stream;
                this.localVideo.nativeElement.srcObject = this.localStream;

                this.localStream.getTracks().forEach(track => {
                    this.peerConnection?.addTrack(track, this.localStream as MediaStream);
                });

                this.localVideoActive = true;

                this.call();
            }).catch(e => console.error('Error accessing media devices:', e));
        }
    }

    pauseLocalVideo() {
        this.localStream?.getTracks().forEach(track => {
            track.enabled = false;
        });
        this.localVideo.nativeElement.srcObject = null;

        this.localVideoActive = false;
    }

    private createPeerConnection() {
        this.peerConnection = new RTCPeerConnection({
            iceServers: [
                {
                    urls: 'stun:stun.l.google.com:19302'
                }
            ]
        });

        this.peerConnection.onicecandidate = this.handleICECandidateEvent.bind(this);
        this.peerConnection.oniceconnectionstatechange = this.handleICEConnectionStateChangeEvent.bind(this);
        this.peerConnection.onsignalingstatechange = this.handleSignalingStateChangeEvent.bind(this);
        this.peerConnection.ontrack = this.handleTrackEvent.bind(this);
    }

    private closeVideoCall() {
        this.inCall = false;

        if (this.peerConnection) {
            this.peerConnection.ontrack = null;
            this.peerConnection.onicecandidate = null;
            this.peerConnection.oniceconnectionstatechange = null;
            this.peerConnection.onsignalingstatechange = null;

            this.peerConnection.getTransceivers().forEach(transceiver => {
                transceiver.stop();
            });

            this.peerConnection.close();
            this.peerConnection = null;
        }
    }

    private handleICECandidateEvent(event: RTCPeerConnectionIceEvent) {
        if (event.candidate) {
            this.websocketService.sendIceCandidate({
                receiver: this.receiver,
                candidate: event.candidate
            });
        }
    }

    private handleICEConnectionStateChangeEvent(event: Event) {
        switch (this.peerConnection?.iceConnectionState) {
            case 'closed':
            case 'failed':
            case 'disconnected':
                this.closeVideoCall();
                break;
        }
    }

    private handleSignalingStateChangeEvent(event: Event) {
        switch (this.peerConnection?.signalingState) {
            case 'closed':
                this.closeVideoCall();
                break;
        }
    }

    private handleTrackEvent(event: RTCTrackEvent) {
        this.remoteVideo.nativeElement.srcObject = event.streams[0];
    }
}
