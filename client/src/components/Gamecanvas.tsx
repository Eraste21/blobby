import { useEffect, useRef } from "react"

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

        // paramétrage de la partie
        const game = {
            startTime: performance.now(),
            duration: 150,
            isOver: false,
            result: "",
        }

        // configuration de la map
        const map = {
            width: 5000,
            height: 3500,
        }

        // création de la zone de danger
        const zone = {
            x: map.width / 2,
            y: map.height / 2,
            r: 4000,
            rMax: 4000,
            rMin: 350,
            damagePerSecond: 10,
        }

        let lastTime = performance.now()

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
            y: canvas.height,
            r: 25,
            hp: 100,
        }

        // création des étoiles ( points )
        const stars = []
        for (let i = 0; i < 700; i++) {
            stars.push({
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
            // le problème était que la balle se deplaçait par saut de 25px, donc passait au travers de certains murs
            // la solution était donc de le faire déplacer pixel par pixel
            let dx = 0
            let dy = 0

            if (keys["z"] || keys["Z"]) dy -= 1
            if (keys["s"] || keys["S"]) dy += 1
            if (keys["q"] || keys["Q"]) dx -= 1
            if (keys["d"] || keys["D"]) dx += 1

            // normalisation diagonale
            if (dx !== 0 || dy !== 0) {
                const length = Math.sqrt(dx * dx + dy * dy)
                dx /= length
                dy /= length
            }

            // on se déplace pixel après pixel
            for (let i = 0; i < speed; i++) {
                const oldX = player.x
                const oldY = player.y

                player.x += dx
                player.y += dy

                // si on touche le mur, on s'arrête
                for (const wall of walls) {
                    if (wall_collision_detected(player, wall)) {
                        player.x = oldX
                        player.y = oldY
                        return
                    }
                }

                player.x = Math.max(player.r, Math.min(player.x, map.width - player.r))
                player.y = Math.max(player.r, Math.min(player.y, map.height - player.r))
            }
        }

        // on detecte les collisions ici
        function wall_collision_detected(player, wall) {
            const borderX = Math.max(wall.x, Math.min(player.x, wall.x + wall.width))
            const borderY = Math.max(wall.y, Math.min(player.y, wall.y + wall.height))

            const dx = player.x - borderX
            const dy = player.y - borderY

            return dx * dx + dy * dy < player.r * player.r
        }

        function danger_zone(time) {
            const elapsed = (time - game.startTime) / 1000
            const progress = Math.min(elapsed / game.duration, 1)

            zone.r = zone.rMax - (zone.rMax - zone.rMin) * progress

            const dx = player.x - zone.x
            const dy = player.y - zone.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            return distance > zone.r
        }

        // potitionnement de la camera
        function update_camera() {
            camera.x = player.x - canvas.width / 2
            camera.y = player.y - canvas.height / 2

            // pour garder la camera sur la map
            camera.x = Math.max(0, Math.min(camera.x, map.width - canvas.width))
            camera.y = Math.max(0, Math.min(camera.y, map.height - canvas.height))
        }

        // barre de vie
        function healthBar() {
            const x = 20
            const y = 20
            const width = 240
            const height = 26
            const radius = 13

            const hpRatio = player.hp / 100
            const hpWidth = width * hpRatio

            ctx.shadowBlur = 0

            // fond
            ctx.fillStyle = "rgba(255, 255, 255, 0.12)"
            ctx.beginPath()
            ctx.roundRect(x, y, width, height, radius)
            ctx.fill()

            // couleur vie
            ctx.fillStyle = "#00eaff"
            ctx.beginPath()
            ctx.roundRect(x, y, hpWidth, height, radius)
            ctx.fill()

            // contour glow
            ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
            ctx.lineWidth = 2
            ctx.shadowColor = "#e0f7ff"
            ctx.shadowBlur = 10
            ctx.beginPath()
            ctx.roundRect(x, y, width, height, radius)
            ctx.stroke()

            ctx.shadowBlur = 0
        }

        // configuration du timer
        function timer(time) {
            const elapsed = (time - game.startTime) / 1000
            const remaining = Math.max(0, game.duration - elapsed)

            const minutes = Math.floor(remaining / 60)
            const seconds = Math.floor(remaining % 60).toString().padStart(2, "0")

            ctx.shadowBlur = 0
            ctx.fillStyle = "white"
            ctx.font = "28px Arial"
            ctx.textAlign = "center"

            ctx.fillText(`${minutes}:${seconds}`, canvas.width / 2, 40)

            ctx.textAlign = "left"
        }

        // conditions de victoire
        function endGame(time) {
            const elapsed = (time - game.startTime) / 1000
            const remaining = Math.max(0, game.duration - elapsed)

            if (player.hp <= 0) {
                game.isOver = true
                game.result = "Défaite"
            }

            if (remaining <= 0) {
                game.isOver = true
                game.result = "Victoire"
            }
        }

        // écran de fin de jeu
        function endScreen() {
            ctx.fillStyle = "rgba(0, 0, 0, 0.75)"
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            ctx.shadowColor = "#e0f7ff"
            ctx.shadowBlur = 20
            ctx.fillStyle = "white"
            ctx.font = "48px Arial"
            ctx.textAlign = "center"

            ctx.fillText(game.result, canvas.width / 2, canvas.height / 2)

            ctx.shadowBlur = 0
            ctx.font = "22px Arial"
            ctx.fillText("Recharge la page pour recommencer", canvas.width / 2, canvas.height / 2 + 50)

            ctx.textAlign = "left"
        }

        // écran de jeu
        function screen(time: number) {
            // on arrête le jeu s'il est fini
            if (game.isOver) {
                endScreen()
                return
            }

            // on veut des dgats par demi seconde
            const deltaTime = (time - lastTime) / 1000
            lastTime = time

            // mise à jour de la position du joueur en fonction de la touche appuyée
            move()
            // mise à jour de la camera
            update_camera()

            // initialisation de la zone de danger
            if (danger_zone(time)) {
                player.hp -= zone.damagePerSecond * deltaTime
                if (player.hp < 0) player.hp = 0
            }
            // vérifier les conditions d'arrêts du jeu
            endGame(time)
            if (game.isOver) {
                endScreen()
                return
            }

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
            stars.forEach(star => {
                ctx.moveTo(star.x - camera.x + star.r, star.y - camera.y)
                ctx.arc(star.x - camera.x, star.y - camera.y, star.r, 0, 2 * Math.PI)
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

            // affichage de la zone
            ctx.beginPath()
            ctx.arc(zone.x - camera.x, zone.y - camera.y, zone.r, 0, 2 * Math.PI)
            ctx.strokeStyle = "#e0f7ff"
            ctx.lineWidth = 4
            ctx.shadowColor = "#e0f7ff"
            ctx.shadowBlur = 30
            ctx.stroke()

            // paramètre et affichage du joueur ( boule )
            ctx.beginPath()
            ctx.arc(player.x - camera.x, player.y - camera.y, player.r, 0, 2 * Math.PI)
            ctx.fillStyle = "cyan";
            ctx.shadowColor = "#00eaff"
            ctx.shadowBlur = 60
            ctx.fill()
            ctx.shadowBlur = 0

            // barre de vie du joueur
            healthBar()
            // timer
            timer(time)

            requestAnimationFrame(screen)
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