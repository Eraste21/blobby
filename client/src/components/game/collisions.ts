// on detecte les collisions avec le mur ici
export function wallCollisionDetected(player, wall) {
    const borderX = Math.max(wall.x, Math.min(player.x, wall.x + wall.width))
    const borderY = Math.max(wall.y, Math.min(player.y, wall.y + wall.height))

    const dx = player.x - borderX
    const dy = player.y - borderY

    return dx * dx + dy * dy < player.r * player.r
}
