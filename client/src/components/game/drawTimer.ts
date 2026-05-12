// configuration du timer
export function drawTimer(time, ctx, canvas, game) {
    const elapsed = (time - game.startTime) / 1000
    const remaining = Math.max(0, game.duration - elapsed)

    const minutes = Math.floor(remaining / 60)
    const seconds = Math.floor(remaining % 60).toString().padStart(2, "0")

    ctx.shadowBlur = 0
    ctx.fillStyle = "white"
    ctx.font = "700 32px Orbitron"
    ctx.textAlign = "center"

    ctx.fillText(`${minutes}:${seconds}`, canvas.width / 2, 40)

    ctx.textAlign = "left"
}