mp.events.add("hcolor", (player, colorId) => {
    if (player.vehicle) {
        player.vehicle.data.headlightColor = Number(colorId);
    } else {
        
    }
});

function setHeadlightsColor(vehicle, color) {
    if (typeof color !== "number" || isNaN(color) || color < 0 || color === 255) {
        // Disable
        vehicle.toggleMod(22, false);
        mp.game.invoke("0xE41033B25D003A07", vehicle.handle, 255);
    } else {
        // Enable
        vehicle.toggleMod(22, true);
        mp.game.invoke("0xE41033B25D003A07", vehicle.handle, color);
    }
}

mp.events.add("entityStreamIn", (entity) => {
    if (entity.type === "vehicle") setHeadlightsColor(entity, parseInt(entity.getVariable("headlightColor")));
});

mp.events.addDataHandler("headlightColor", (entity, value) => {
    if (entity.type === "vehicle") setHeadlightsColor(entity, value);
});
