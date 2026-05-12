// on dessine les étoiles
export function drawStars(ctx, stars, camera) {
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

}