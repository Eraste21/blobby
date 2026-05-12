// On dessine la zone de danger
export function drawDangerZone(ctx, zone, camera, canvas) {
    ctx.save()

    const zoneScreenX = zone.x - camera.x
    const zoneScreenY = zone.y - camera.y

    // On crée une forme composée de :
    // 1. tout l'écran
    // 2. le cercle de la zone safe
    ctx.beginPath()
    ctx.rect(0, 0, canvas.width, canvas.height)

    ctx.arc(
        zoneScreenX,
        zoneScreenY,
        zone.r,
        0,
        Math.PI * 2
    )

    // evenodd veut dire :
    // remplir l'extérieur du cercle, pas l'intérieur
    ctx.fillStyle = "rgba(224, 247, 255, 0.12)"
    ctx.fill("evenodd")

    ctx.restore()

    // Bordure glow de la zone
    ctx.save()

    ctx.beginPath()
    ctx.arc(
        zoneScreenX,
        zoneScreenY,
        zone.r,
        0,
        Math.PI * 2
    )

    ctx.strokeStyle = "#e0f7ff"
    ctx.lineWidth = 4
    ctx.shadowColor = "#e0f7ff"
    const zonePulse = 25 + Math.sin(performance.now() * 0.006) * 10
    ctx.shadowBlur = zonePulse
    ctx.stroke()

    ctx.restore()
}

// configuration de la zone de danger
export function out_of_danger_zone(time, game, zone, player) {
    // la zone de danger retrecit avec le temps
    const elapsed = (time - game.startTime) / 1000
    const progress = Math.min(elapsed / game.duration, 1)

    zone.r = zone.rMax - (zone.rMax - zone.rMin) * progress

    // on veut retourner la position du joueur par rapport à la zone de danger
    const dx = player.x - zone.x
    const dy = player.y - zone.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    return distance > zone.r
}
