import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server!: Server;

    private players: Record<string, any> = {};

    handleConnection(client: Socket) {
        console.log('Joueur connecté :', client.id);

        this.players[client.id] = {
            id: client.id,
            x: Math.floor(Math.random() * 800) + 100,
            y: Math.floor(Math.random() * 500) + 100,
            r: 25,
            hp: 100,
            color: '#00eaff',
        };

        client.emit('connected', {
            id: client.id,
            message: 'Connexion au serveur Blobby réussie',
        });

        this.server.emit('players:update', this.players);
    }

    handleDisconnect(client: Socket) {
        console.log('Joueur déconnecté :', client.id);

        delete this.players[client.id];

        this.server.emit('players:update', this.players);
    }

    @SubscribeMessage('ping')
    handlePing(
        @MessageBody() data: unknown,
        @ConnectedSocket() client: Socket,
    ) {
        console.log('Message reçu du client :', data);

        client.emit('pong', {
            message: 'Réponse du serveur',
            received: data,
        });
    }

    @SubscribeMessage('player:move')
    handlePlayerMove(
        @MessageBody() direction: any,
        @ConnectedSocket() client: Socket,
    ) {
        const player = this.players[client.id];

        if (!player) return;

        const speed = 10;

        if (direction.up) player.y -= speed;
        if (direction.down) player.y += speed;
        if (direction.left) player.x -= speed;
        if (direction.right) player.x += speed;

        this.server.emit('players:update', this.players);
    }

}