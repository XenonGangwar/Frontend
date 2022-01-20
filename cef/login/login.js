let cam = null,
    loginBrowser = null;

mp.events.add("Client:Login:createLoginCamera", (showLogin) => {
    mp.players.local.freezePosition(true);
    mp.game.ui.displayRadar(false);
    mp.game.ui.displayHud(false);
    mp.gui.chat.activate(false);
    //cam = mp.cameras.new("default", new mp.Vector3(760.045, 225.2709, 147.3329), new mp.Vector3(0, 0, 0), 40);
    //cam.pointAtCoord(-1415.043, 2240.278, 42.58513);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);
    if (showLogin) createLoginBrowser();
});

mp.events.add("Client:Login:destroyLogin", () => {
    if (loginBrowser != null) {
        mp.gui.cursor.show(false, false);
        loginBrowser.destroy();
        loginBrowser = null;
    }
});

mp.events.add("Client:Login:destroyLoginCam", () => {
    mp.players.local.freezePosition(false);
    mp.game.ui.displayRadar(true);
    mp.game.ui.displayHud(true);
    mp.gui.chat.activate(true);
    mp.gui.chat.show(true);
    mp.game.cam.renderScriptCams(false, false, 0, true, false);
    if (cam != null) {
        cam.setActive(false);
        cam.destroy();
        cam = null;
    }
});

mp.events.add("Client:Login:LoginResult", (type, msg) => {
    if (loginBrowser != null) {
        loginBrowser.execute(`loginResponse('${msg}', '${type}');`);
        if (type === 0) loginBrowser.execute(`registerResult('${type}');`);
    }
});

mp.events.add("Client:Login:tryLogin", (username, password) => {
    if (!username.length) return;
    mp.events.callRemote("Server:Login:tryLogin", username, password);
});


mp.events.add("Client:Login:tryRegister", (username, password) => {
    if (!username.length) return;
    mp.events.callRemote("Server:Login:tryRegister", username, password);
});


function createLoginBrowser() {
    if (loginBrowser == null) {
        loginBrowser = mp.browsers.new("package://cef/login/index.html");
        mp.gui.cursor.show(true, true);
    }
}