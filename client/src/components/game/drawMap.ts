// on configure la map
export function configMap(ctx, canvas) {
    // reset écran
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // paramètres de la map
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}