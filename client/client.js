let aduty = false,
    nametag = false,
    lastInteract = 0;
    count = 0;

function canInteract() { return lastInteract + 1000 < Date.now(); }

mp.keys.bind(0x45, false, function() {
    if (!canInteract) return;
    lastInteract = Date.now();
    mp.events.callRemote("Server:Gangwar:captureFlag");
    mp.events.callRemote("server:hotkey:E");
});

mp.keys.bind(0x75, false, function() {
    if (!canInteract) return;
    lastInteract = Date.now();
    mp.events.callRemote("Server:Admin:toggleVanish");
});

mp.events.add("Client:Aufnahmepflicht", () => {
    mp.game.gameplay.setFakeWantedLevel(5);
});

mp.events.add('playerWeaponShot', (targetPosition, targetEntity) => {
  //  mp.gui.chat.push('You fired a weapon!');
  mp.events.callRemote('Tablet:Shot');
});

mp.events.add("Client:Admin:toggleNametag", () => {
    if (nametag) mp.nametags.enabled = false;
    else mp.nametags.enabled = true;
    nametag = !nametag;
});

mp.events.add("Client:FFA-Announce", (streak) => {
    mp.events.callRemote("Server:FFA-Announce", streak);
});


mp.events.add("Client:Admin:setAdutyState", state => {
    aduty = state;
    if (aduty) {
        mp.game.player.setInvincible(true);
        mp.nametags.enabled = true;
    } else {
        mp.game.player.setInvincible(false);
        mp.nametags.enabled = false;
    }
});

mp.events.add("Client:Kick:Kick", () => {
    mp.events.callRemote("kick");
});

mp.events.add("CreatorlOLXd", () => {
    mp.events.callRemote("creator");
});


mp.events.add("charreloadc", () => {
    mp.events.callRemote("charreload")
});

mp.events.add("restoreCustomazion", () => {
    mp.events.callRemote("restoreCustomazion");
});

const controlsIds = {
    F5: 327,
    W: 32, //232
    S: 33, //31, 219, 233, 268, 269
    A: 34, //234
    D: 35, //30, 218, 235, 266, 267
    Space: 321,
    LCtrl: 326,
    Shift: 16
};

global.fly = { flying: false, f: 2.0, w: 2.0, h: 2.0 };
global.gameplayCam = mp.cameras.new("gameplay");

mp.events.add("render", () => {
    if (aduty) {
        let controls = mp.game.controls;
        let fly = global.fly;
        const direction = global.gameplayCam.getDirection();
        controlModifier = mp.keys.isDown(controlsIds.LCtrl);
        shiftModifier = mp.keys.isDown(controlsIds.Shift);
        var fastMult = 1;
        var slowMult = 1;
        if (shiftModifier) {
            fastMult = 3;
        } else if (controlModifier) {
            slowMult = 0.5;
        }
        if (controls.isControlJustPressed(0, controlsIds.F5)) {
            fly.flying = !fly.flying;

            const player = mp.players.local;

            player.freezePosition(fly.flying);

            if (!fly.flying &&
                !controls.isControlPressed(0, controlsIds.Space)) {
                let position = mp.players.local.position;
                position.z = mp.game.gameplay.getGroundZFor3dCoord(position.x, position.y, position.z, 0.0, false);
                mp.players.local.setCoordsNoOffset(position.x, position.y, position.z, false, false, false);
            }

            mp.game.graphics.notify(fly.flying ? "Admin Dienst No-Clip: ~g~Aktiviert" : "Admin Dienst No-Clip: ~r~Deaktiviert");
        } else if (fly.flying) {
            let updated = false;
            let position = mp.players.local.position;

            if (controls.isControlPressed(0, controlsIds.W)) {

                position.x += direction.x * fastMult * slowMult;;
                position.y += direction.y * fastMult * slowMult;;
                position.z += direction.z * fastMult * slowMult;;
                updated = true;
            } else if (controls.isControlPressed(0, controlsIds.S)) {

                position.x -= direction.x * fastMult * slowMult;;
                position.y -= direction.y * fastMult * slowMult;;
                position.z -= direction.z * fastMult * slowMult;;
                updated = true;
            } else {
                fly.f = 2.0;
            }

            if (controls.isControlPressed(0, controlsIds.A)) {


                position.x += (-direction.y) * fastMult * slowMult;;
                position.y += direction.x * fastMult * slowMult;;
                updated = true;
            } else if (controls.isControlPressed(0, controlsIds.D)) {
                if (fly.l < 8.0)
                    fly.l *= 1.05;

                position.x -= (-direction.y) * fastMult * slowMult;;
                position.y -= direction.x * fastMult * slowMult;;
                updated = true;
            } else {
                fly.l = 2.0;
            }

            if (controls.isControlPressed(0, controlsIds.Space)) {

                position.z += fastMult * slowMult;;
                updated = true;
            } else {
                fly.h = 2.0;
            }

            if (updated) {
                mp.players.local.setCoordsNoOffset(position.x, position.y, position.z, false, false, false);
            }
        }
    }
});

let spectateCam = null;

mp.events.add("spectatePlayer", (specatedPlayer) => {      
    spectateCam = mp.cameras.new("spectateCamera");
    spectateCam.attachTo(specatedPlayer.handle, 0, -2.0, 1.0, true); 
    mp.players.local.position = new mp.Vector3(specatedPlayer.position.x, specatedPlayer.position.y, specatedPlayer.position.z - 88);
    spectateCam.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);

    specateInterval = setInterval(() => {
         spectateCam.pointAtCoord(specatedPlayer.position.x, specatedPlayer.position.y, specatedPlayer.position.z);
         var changedz = specatedPlayer.position.z - 5;
         mp.events.callRemote("sync-spectatePlayer", specatedPlayer.position.x, specatedPlayer.position.y, changedz);
    }, 5);
});

mp.events.add('ChangeClothesC', (componentId, drawable, texture) => {
    mp.events.callRemote('ChangeClothes', componentId, drawable, texture);
});


mp.events.add("stopSpectating", () => {
    if (spectateCam != null) {
        clearInterval(specateInterval);
        spectateCam.setActive(false);
        mp.game.cam.renderScriptCams(false, false, 0, false, false);
        spectateCam.destroy(true);
        spectateCam = null;
    }
});

// WEAPON-BLACKLIST
mp.events.add("playerWeaponShot", (targetPosition, targetEntity) => {
    let player = mp.players.local;
    let weapon = player.weapon;
    
    if (weapon == 453432689  || weapon == 3219281620  || weapon == 1593441988  || weapon == -1076751822  || weapon == -771403250  || weapon == 137902532  || weapon == -598887786  || weapon == -1045183535 || weapon == 584646201  || weapon == 1198879012  || weapon == 32421536  || weapon == -6190109924  || weapon == 736523883  || weapon == 2024373456  || weapon == -270015777  || weapon == 171789620 || weapon == -1660422300  || weapon == 2144741730  || weapon == 3686625920  || weapon == -1121678507  || weapon == -1074790547  || weapon == 961495388  || weapon == -2084633992  || weapon == 4208062921 || weapon == -1063057011  || weapon == 100416529  || weapon == 205991906  || weapon == 177293209  || weapon == 487013001  || weapon == 2017895192  || weapon == -1654528753  || weapon == -494615257 || weapon == -1466123874  || weapon == 984333226  || weapon == -275439685  || weapon == 317205821  || weapon == -1568386805  || weapon == -1312131151  || weapon == 1119849093  || weapon == 2138347493 || weapon == 1834241177  || weapon == 1672152130  || weapon ==  1305664598  || weapon == 125959754  || weapon == 1813897027  || weapon == 741814745  || weapon == -1420407917  || weapon == -1600701090 || weapon == 615608432  || weapon == 101631238  || weapon == 883325847  || weapon == 1233104067  || weapon == 600439132  || weapon == 126349499  || weapon == -37975472  || weapon == -1169823560)  {
        mp.events.callRemote("server:ac:checkWeapon", "Unallowed Weapon");
    }

});
