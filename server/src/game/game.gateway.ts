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

    handleConnection(client: Socket) {
        console.log('Joueur connecté :', client.id);

        client.emit('connected', {
            id: client.id,
            message: 'Connexion au serveur Blobby réussie',
        });
    }

    handleDisconnect(client: Socket) {
        console.log('Joueur déconnecté :', client.id);
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
}