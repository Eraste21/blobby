import { useEffect, useRef } from "react"
import { map, zone, game, camera, walls, stars, particles, speed } from "./game/config"
import { drawWalls } from "./game/drawWalls"
import { movement } from "./game/movement"
import { drawPlayer } from "./game/drawPlayer"
import { drawStars } from "./game/drawStars"
import { drawParticles } from "./game/drawParticles"
import { drawDangerZone, out_of_danger_zone } from "./game/drawZone"
import { update_camera } from "./game/camera"
import { endGame, endScreen } from "./game/endGame"
import { healthBar } from "./utils/healthBar"
import { drawTimer } from "./game/drawTimer"
import { configMap } from "./game/drawMap"

export const GameCanvas = (props) => {

    const canvasRef = useRef(null)

    useEffect(() => {
        // pour éviter de lancer 2 fois le use effect
        let animationId

        // configuration du canvas ( écran de jeu )
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        // taille du canvas
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        let lastTime = performance.now()

        // informations du joueur ( boule )
        let player = {
            x: 200,
            y: canvas.height,
            r: 25,
            hp: 100,
        }

        // déplacement clavier
        const keys = {}

        const keyDown = (e) => {
            keys[e.key] = true
        }
        const keyUp = (e) => {
            keys[e.key] = false
        }

        window.addEventListener("keydown", keyDown)
        window.addEventListener("keyup", keyUp)



        // écran de jeu
        function screen(time: number) {
            // on arrête le jeu s'il est fini
            if (game.isOver) {
                configMap(ctx, canvas)
                drawStars(ctx, stars, camera)
                drawWalls(ctx, camera, walls)
                drawDangerZone(ctx, zone, camera, canvas)
                drawParticles(ctx, particles, camera)

                if (particles.length === 0) {
                    endScreen(ctx, canvas, game)
                    return
                }

                animationId = requestAnimationFrame(screen)
                return
            }

            // on veut des dgats par demi seconde
            const deltaTime = (time - lastTime) / 1000
            lastTime = time

            // mise à jour de la position du joueur en fonction de la touche appuyée
            movement(keys, speed, player, walls, map)
            // mise à jour de la camera
            update_camera(player, camera, map, canvas)

            // initialisation de la zone de danger
            if (out_of_danger_zone(time, game, zone, player)) {
                player.hp -= zone.damagePerSecond * deltaTime
                if (player.hp < 0) player.hp = 0
            }
            // vérifier les conditions d'arrêts du jeu
            endGame(time, game, player, particles)
            if (game.isOver) {
                animationId = requestAnimationFrame(screen)
                return
            }

            // configuration de la map
            configMap(ctx, canvas)
            // dessin des étoiles
            drawStars(ctx, stars, camera)
            // dessin des murs
            drawWalls(ctx, camera, walls)
            // affichage de la zone
            drawDangerZone(ctx, zone, camera, canvas)
            // dessin du joueur
            drawPlayer(ctx, player, camera)
            // barre de vie du joueur
            healthBar(ctx, player)
            // timer
            drawTimer(time, ctx, canvas, game)

            animationId = requestAnimationFrame(screen)
        }

        // afficher feuille de dessin
        animationId = requestAnimationFrame(screen)

        return () => {
            window.removeEventListener("keydown", keyDown)
            window.removeEventListener("keyup", keyUp)

            if (animationId) cancelAnimationFrame(animationId)
        }
    }, [])
    return (
        <canvas ref={canvasRef} {...props} />
    )
}