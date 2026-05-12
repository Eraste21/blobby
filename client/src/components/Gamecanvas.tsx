import { useEffect, useRef } from "react"

export const GameCanvas = (props) => {

    const canvasRef = useRef(null)

    useEffect(() => {
        // configuration du canvas ( écran de jeu )
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        // taille du canvas
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        // configuration de la map
        const map = {
            width: 5000,
            height: 3500,
        }

        // création de la caméra
        const camera = {
            x: 0,
            y: 0,
        }

        // coordonnées des murs
        const walls = [
            { x: 450, y: 320, width: 180, height: 8 },
            { x: 900, y: 780, width: 8, height: 170 },
            { x: 1450, y: 420, width: 220, height: 8 },
            { x: 2100, y: 950, width: 8, height: 190 },
            { x: 2750, y: 520, width: 200, height: 8 },
            { x: 600, y: 1650, width: 240, height: 8 },
            { x: 1250, y: 1350, width: 8, height: 180 },
            { x: 1900, y: 1750, width: 220, height: 8 },
            { x: 2550, y: 1450, width: 8, height: 200 },
            { x: 3300, y: 1900, width: 260, height: 8 },
            { x: 3800, y: 700, width: 8, height: 180 },
            { x: 4200, y: 1300, width: 230, height: 8 },
        ]

        // vitesse de deplacement
        let speed = 25

        // informations du joueur ( boule )
        let player = {
            x: 200,
            y: 150,
            r: 25,
        }

        // création des étoiles ( points )
        const dots = []
        for (let i = 0; i < 1000; i++) {
            dots.push({
                x: Math.random() * map.width,
                y: Math.random() * map.height,
                r: Math.random() * 2,
            })
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

        // Touches de déplacement ( Z- S - Q - D )
        function move() {
            // on garde les anciennes positions pour gérer les collisions avec les murs
            const oldX = player.x
            const oldY = player.y

            if (keys["z"] || keys["Z"]) player.y -= speed
            if (keys["s"] || keys["S"]) player.y += speed

            // on bouge pas en cas de collision ( pour X )
            for (const wall of walls) {
                if (wall_collision_detected(player, wall)) {
                    player.x = oldX
                    break
                }
            }

            if (keys["q"] || keys["Q"]) player.x -= speed
            if (keys["d"] || keys["D"]) player.x += speed

            // on bouge pas en cas de collision ( pour y )
            for (const wall of walls) {
                if (wall_collision_detected(player, wall)) {
                    player.y = oldY
                    break
                }
            }

            // pour ne pas sortir de la map
            player.x = Math.max(player.r, Math.min(player.x, map.width - player.r))
            player.y = Math.max(player.r, Math.min(player.y, map.height - player.r))
        }

        function wall_collision_detected(player, wall) {
            const borderX = Math.max(wall.x, Math.min(player.x, wall.x + wall.width))
            const borderY = Math.max(wall.y, Math.min(player.y, wall.y + wall.height))

            const dx = player.x - borderX
            const dy = player.y - borderY

            return dx * dx + dy * dy < player.r * player.r
        }

        // potitionnement de la camera
        function update_camera() {
            camera.x = player.x - canvas.width / 2
            camera.y = player.y - canvas.height / 2

            // pour garder la camera sur la map
            camera.x = Math.max(0, Math.min(camera.x, map.width - canvas.width))
            camera.y = Math.max(0, Math.min(camera.y, map.height - canvas.height))
        }

        function screen() {
            // mise à jour de la position du joueur en fonction de la touche appuyée
            move()
            // mise à jour de la camera
            update_camera()

            // reset écran
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // paramètres de la map
            ctx.fillStyle = '#000000'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // paramètres étoiles
            ctx.beginPath()
            ctx.fillStyle = "white"
            ctx.shadowBlur = 0

            // affichage étoile
            dots.forEach(dot => {
                ctx.moveTo(dot.x - camera.x + dot.r, dot.y - camera.y)
                ctx.arc(dot.x - camera.x, dot.y - camera.y, dot.r, 0, 2 * Math.PI)
            })
            ctx.fill()

            // affichage murs
            ctx.fillStyle = "white"
            ctx.shadowBlur = 0

            walls.forEach(wall => {
                ctx.fillRect(
                    wall.x - camera.x,
                    wall.y - camera.y,
                    wall.width,
                    wall.height,
                )
            })

            // paramètre et affichage du joueur ( boule )
            ctx.beginPath()
            ctx.arc(player.x - camera.x, player.y - camera.y, player.r, 0, 2 * Math.PI)
            ctx.fillStyle = "cyan";
            ctx.shadowColor = "#00eaff"
            ctx.shadowBlur = 60
            ctx.fill()

            requestAnimationFrame(screen)
        }

        // afficher feuille de dessin
        screen()

        return () => {
            window.removeEventListener("keydown", keyDown)
            window.removeEventListener("keyup", keyUp)
        }
    }, [])
    return (
        <canvas ref={canvasRef} {...props} />
    )
}