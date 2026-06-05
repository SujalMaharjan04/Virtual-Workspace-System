const map = require("../public/assets/map/office.json")

const getSpawnPoint = () => {
    const spawnLayer = map.layers.find(m => m.name === "Spawn")
    const spawnObject = spawnLayer.objects.find(obj => obj.properties.find(p => p.name === "PlayerSpawn" && p.value === true))

    const SPAWN_POINT = {
        x: spawnObject.x + spawnObject.widht / 2,
        y: spawnObject.y + spawnObject.height / 2
    }

    return SPAWN_POINT
}

module.exports = getSpawnPoint