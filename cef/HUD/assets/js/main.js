let hudBrowser = null;

mp.events.add("e_ShowHUD", (level, kills, deaths, experience, maxExperience) => {
    hudBrowser = mp.browsers.new('package://ClassicGangwar/HUD/Hud.html');
    hudBrowser.execute(`showHUD();`);
    hudBrowser.execute(`setLevel(${level});`);
    hudBrowser.execute(`setKills(${kills});`);
    hudBrowser.execute(`setDeaths(${deaths});`);
    hudBrowser.execute(`updateRatio(${kills}, ${deaths});`);
    hudBrowser.execute(`setExperience(${experience});`);
    hudBrowser.execute(`setMaxExperience(${maxExperience});`);
});

mp.events.add("e_KillEvent", (teamKill, killerName, kills, deaths, victimName, driveby) => {
    hudBrowser.execute(`killEvent(${teamKill}, "${killerName}", "${kills}", "${deaths}", "${victimName}", ${driveby});`);
});

mp.events.add("e_DeathEvent", (teamKill, killerName, kills, deaths, victimName) => {
    hudBrowser.execute(`deathEvent(${teamKill}, "${killerName}", "${kills}", "${deaths}", "${victimName}");`);
});

var toggleMouse = false;
mp.keys.bind(0x77, true, () => {
    toggleMouse = !toggleMouse;
    mp.gui.cursor.show(toggleMouse, toggleMouse);
});

let showingInventory = false;
let usingWestOrAidKit = false;
let usingRepairKit = false;

mp.events.add("render", () => {
    if (usingWestOrAidKit === true || showingInventory === true)
    {
        mp.game.player.disableFiring(true);
        mp.players.local.freezePosition(true);
    }
    else if(usingRepairKit === true)
    {
        mp.game.player.disableFiring(true);
    }
});

mp.events.add("e_ShowInventory", () => {
    mp.gui.cursor.show(true, true);
    hudBrowser.execute(`showInventory();`);
});

mp.events.add("e_UseVest", (player) => {
    mp.events.callRemote("player_useVest", player);
});

mp.keys.bind(0x49, true, function() {
        hudBrowser.execute('showInventory();')
        mp.gui.cursor.show(true, true)
});

mp.events.add("i_UseVest", (player) => {
    mp.events.callRemote("player_useVest", player);
    showingInventory = false;
    usingWestOrAidKit = true;
    mp.gui.cursor.show(false, false);
    setTimeout(function() {
        usingWestOrAidKit = false;
        mp.players.local.freezePosition(false);
    }, 4000);
});

mp.events.add("i_UseFirstAid", (player) => {
    mp.events.callRemote("player_useFirstAid", player);
    showingInventory = false;
    usingWestOrAidKit = true;
    mp.gui.cursor.show(false, false);
    setTimeout(function() {
        usingWestOrAidKit = false;
        mp.players.local.freezePosition(false);
    }, 4000);
});

mp.events.add("i_UseRepairKit", (player) => {
    mp.events.callRemote("player_useRepairKit", player);
    showingInventory = false;
    usingRepairKit = true;
    mp.gui.cursor.show(false, false);
    setTimeout(function() {
        usingRepairKit = false;
        mp.players.local.freezePosition(false);
    }, 4000);
});

mp.events.add("e_RespawnEvent", () => {
    hudBrowser.execute(`respawnEvent();`);
});

mp.events.add("e_SetKills", (kills) => {
    hudBrowser.execute(`setKills(${kills});`);
});

mp.events.add("e_SetDeaths", (deaths) => {
    hudBrowser.execute(`setDeaths(${deaths});`);
});

mp.events.add("e_SetExperience", (experience) => {
    hudBrowser.execute(`setExperience(${experience});`);
});
mp.events.add("e_SetMaxExperience", (maxExperience) => {
    hudBrowser.execute(`setMaxExperience(${maxExperience});`);
});
mp.events.add("e_LevelUp", (level, maxExperience) => {
    hudBrowser.execute(`levelUp(${level}, ${maxExperience});`);
});
mp.events.add("e_AssistEvent", (experience) => {
    hudBrowser.execute(`addAssistXP(${experience});`);
});
mp.events.add("e_ToggleAdminMode", () => {
    hudBrowser.execute(`toggleAdminMode();`);
});
mp.events.add("e_ShowGangwarMode", (gebiet, angreifer, besitzer, team1Points, team2Points) => {
    hudBrowser.execute(`showGangwarMode("${gebiet}", "${angreifer}", "${besitzer}", "${team1Points}", "${team2Points}");`);
});
mp.events.add("e_UpdateGangwarStats", (team1Points, team2Points) => {
    hudBrowser.execute(`updateGangwarStats("${team1Points}", "${team2Points}"`);
});
mp.events.add("e_HideGangwarMode", () => {
    hudBrowser.execute(`hideGangwarMode()`);
});
mp.events.add("e_DoneGangwarMode", () => {
    mp.events.callRemote("s_doneGangwar");
});

mp.events.add("e_ToggleMic", () => {
    hudBrowser.execute(`toggleMic();`);
});

mp.events.add("e_HideHUD",() => {
	hudBrowser.destroy();
});

mp.events.add("e_ShowPopup", (style, title, message, lengthMS) => {
    hudBrowser.execute(`sendPopup("${style}", "${title}", "${message}", ${lengthMS});`);
});
mp.events.add("e_AdminMessage", (title, message, lengthMS) => {
    hudBrowser.execute(`sendPopup("admin", "${title}", "${message}", ${lengthMS});`);
});
mp.events.add("e_FIBMessage", (title, message, lengthMS) => {
    hudBrowser.execute(`sendPopup("fib", "${title}", "${message}", ${lengthMS});`);
});
mp.events.add("e_SystemMessage", (title, message, lengthMS) => {
    hudBrowser.execute(`sendPopup("system", "${title}", "${message}", ${lengthMS});`);
});
mp.events.add("e_ModMessage", (title, message, lengthMS) => {
    hudBrowser.execute(`sendPopup("mod", "${title}", "${message}", ${lengthMS});`);
});