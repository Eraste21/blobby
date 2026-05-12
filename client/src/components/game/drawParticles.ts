// on crée un tableau de particules
export function createExplosion(x, y, particles) {
    for (let i = 0; i < 40; i++) {
        particles.push({
            x: x,
            y: y,
            r: Math.random() * 4 + 2,
            dx: (Math.random() - 0.5) * 12,
            dy: (Math.random() - 0.5) * 12,
            life: 60,
            color: "#00eaff"
        })
    }
}

// on dessine les particules pour donner l'impression d'explosion
export function drawParticles(ctx, particles, camera) {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]

        p.x += p.dx
        p.y += p.dy
        p.life -= 1
        p.r *= 0.97

        ctx.beginPath()
        ctx.arc(
            p.x - camera.x,
            p.y - camera.y,
            p.r,
            0,
            Math.PI * 2
        )

        ctx.fillStyle = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur = 15
        ctx.fill()

        if (p.life <= 0 || p.r < 0.5) {
            particles.splice(i, 1)
        }
    }

    ctx.shadowBlur = 0
}
