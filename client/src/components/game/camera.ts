// potitionnement de la camera
export function update_camera(player, camera, map, canvas) {
    camera.x = player.x - canvas.width / 2
    camera.y = player.y - canvas.height / 2

    // pour garder la camera sur la map
    camera.x = Math.max(0, Math.min(camera.x, map.width - canvas.width))
    camera.y = Math.max(0, Math.min(camera.y, map.height - canvas.height))
}
