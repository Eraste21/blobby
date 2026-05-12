// barre de vie
export function healthBar(ctx, player) {
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
