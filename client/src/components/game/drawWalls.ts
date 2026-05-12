// on dessine les murs
export function drawWalls(ctx, camera, walls) {
    ctx.save()

    walls.forEach(wall => {
        ctx.fillStyle = "#050505"
        ctx.strokeStyle = "#e0f7ff"
        ctx.lineWidth = 2
        ctx.shadowColor = "#e0f7ff"
        ctx.shadowBlur = 12

        ctx.fillRect(
            wall.x - camera.x,
            wall.y - camera.y,
            wall.width,
            wall.height
        )

        ctx.strokeRect(
            wall.x - camera.x,
            wall.y - camera.y,
            wall.width,
            wall.height
        )
    })

    ctx.restore()
}