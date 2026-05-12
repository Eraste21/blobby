// on dessine le joueur
export function drawPlayer(ctx, player, camera) {
    const pulse = 40 + Math.sin(performance.now() * 0.008) * 15

    ctx.save()

    ctx.beginPath()
    ctx.arc(player.x - camera.x, player.y - camera.y, player.r, 0, 2 * Math.PI)

    ctx.fillStyle = "cyan"
    ctx.shadowColor = "#00eaff"
    ctx.shadowBlur = pulse
    ctx.fill()

    ctx.restore()
}

export function drawPlayers(ctx, players, camera) {
    Object.values(players).forEach((p: any) => {
        ctx.beginPath()

        ctx.arc(
            p.x - camera.x,
            p.y - camera.y,
            p.r,
            0,
            Math.PI * 2
        )

        ctx.fillStyle = p.color || "#00eaff"
        ctx.shadowColor = p.color || "#00eaff"
        ctx.shadowBlur = 50
        ctx.fill()

        ctx.shadowBlur = 0
    })
}