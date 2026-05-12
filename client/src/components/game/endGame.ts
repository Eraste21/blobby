import { createExplosion } from "./drawParticles"

// conditions de victoire
export function endGame(time, game, player, particles) {
    if (game.isOver) return

    const elapsed = (time - game.startTime) / 1000
    const remaining = Math.max(0, game.duration - elapsed)

    if (player.hp <= 0) {
        game.isOver = true
        game.result = "Défaite"

        if (!game.explosion) {
            createExplosion(player.x, player.y, particles)
            game.explosion = true
        }

        return
    }

    if (remaining <= 0) {
        game.isOver = true
        game.result = "Victoire"

        if (!game.explosion) {
            createExplosion(player.x, player.y, particles)
            game.explosion = true
        }

        return
    }
}

// écran de fin de jeu
export function endScreen(ctx, canvas, game) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.shadowColor = "#e0f7ff"
    ctx.shadowBlur = 20
    ctx.fillStyle = "white"
    ctx.font = "700 48px Orbitron"
    ctx.textAlign = "center"

    ctx.fillText(game.result, canvas.width / 2, canvas.height / 2)

    ctx.shadowBlur = 0
    ctx.font = "700 22px Orbitron"
    ctx.fillText("Recharge la page pour recommencer", canvas.width / 2, canvas.height / 2 + 50)

    ctx.textAlign = "left"
}
