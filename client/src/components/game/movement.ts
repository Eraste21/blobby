import { wallCollisionDetected } from "./collisions"

// Touches de déplacement ( Z- S - Q - D )
export function movement(keys, speed, player, walls, map) {
    // le problème était que la balle se deplaçait par saut de 25px, donc passait au travers de certains murs
    // la solution était donc de le faire déplacer pixel par pixel
    let dx = 0
    let dy = 0

    if (keys["z"] || keys["Z"]) dy -= 1
    if (keys["s"] || keys["S"]) dy += 1
    if (keys["q"] || keys["Q"]) dx -= 1
    if (keys["d"] || keys["D"]) dx += 1

    // normalisation diagonale
    if (dx !== 0 || dy !== 0) {
        const length = Math.sqrt(dx * dx + dy * dy)
        dx /= length
        dy /= length
    }

    // on se déplace pixel après pixel
    for (let i = 0; i < speed; i++) {
        const oldX = player.x
        const oldY = player.y

        player.x += dx
        player.y += dy

        // si on touche le mur, on s'arrête
        for (const wall of walls) {
            if (wallCollisionDetected(player, wall)) {
                player.x = oldX
                player.y = oldY
                return
            }
        }

        player.x = Math.max(player.r, Math.min(player.x, map.width - player.r))
        player.y = Math.max(player.r, Math.min(player.y, map.height - player.r))
    }
}