import { useEffect, useRef } from "react";
import { socket } from "../socket";

import { map, zone, game, camera, walls, stars, particles } from "./game/config";
import { drawWalls } from "./game/drawWalls";
import { drawStars } from "./game/drawStars";
import { drawParticles } from "./game/drawParticles";
import { drawDangerZone, out_of_danger_zone } from "./game/drawZone";
import { update_camera } from "./game/camera";
import { endScreen } from "./game/endGame";
import { healthBar } from "./utils/healthBar";
import { drawTimer } from "./game/drawTimer";
import { configMap } from "./game/drawMap";
import { drawPlayers } from "./game/drawPlayer";

export const GameCanvas = (props: any) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        let animationId: number;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let lastTime = performance.now();

        let mySocketId = "";
        let players: Record<string, any> = {};

        const keys: Record<string, boolean> = {};

        const keyDown = (e: KeyboardEvent) => {
            keys[e.key] = true;
        };

        const keyUp = (e: KeyboardEvent) => {
            keys[e.key] = false;
        };

        window.addEventListener("keydown", keyDown);
        window.addEventListener("keyup", keyUp);

        socket.on("connected", (data) => {
            console.log("Connecté au serveur :", data);
            mySocketId = data.id;
        });

        socket.on("players:update", (serverPlayers) => {
            players = serverPlayers;
        });

        function sendMovementToServer() {
            socket.emit("player:move", {
                up: keys["z"] || keys["Z"] || false,
                down: keys["s"] || keys["S"] || false,
                left: keys["q"] || keys["Q"] || false,
                right: keys["d"] || keys["D"] || false,
            });
        }

        function screen(time: number) {
            const myPlayer = players[mySocketId];

            if (game.isOver) {
                configMap(ctx, canvas);
                drawStars(ctx, stars, camera);
                drawWalls(ctx, camera, walls);
                drawDangerZone(ctx, zone, camera, canvas);
                drawParticles(ctx, particles, camera);

                if (particles.length === 0) {
                    endScreen(ctx, canvas, game);
                    return;
                }

                animationId = requestAnimationFrame(screen);
                return;
            }

            const deltaTime = (time - lastTime) / 1000;
            lastTime = time;

            sendMovementToServer();

            if (myPlayer) {
                update_camera(myPlayer, camera, map, canvas);

                if (out_of_danger_zone(time, game, zone, myPlayer)) {
                    myPlayer.hp -= zone.damagePerSecond * deltaTime;

                    if (myPlayer.hp < 0) {
                        myPlayer.hp = 0;
                    }
                }

                if (myPlayer.hp <= 0) {
                    game.isOver = true;
                    game.result = "Défaite";
                }
            }

            configMap(ctx, canvas);
            drawStars(ctx, stars, camera);
            drawWalls(ctx, camera, walls);
            drawDangerZone(ctx, zone, camera, canvas);
            drawPlayers(ctx, players, camera);

            if (myPlayer) {
                healthBar(ctx, myPlayer);
            }

            drawTimer(time, ctx, canvas, game);

            animationId = requestAnimationFrame(screen);
        }

        animationId = requestAnimationFrame(screen);

        return () => {
            window.removeEventListener("keydown", keyDown);
            window.removeEventListener("keyup", keyUp);

            socket.off("connected");
            socket.off("players:update");

            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, []);

    return <canvas ref={canvasRef} {...props} />;
};