let ffaBrowser = null;

mp.events.add("Client:FFA:openBrowser", arena => {
    if (ffaBrowser == null) {
        ffaBrowser = mp.browsers.new("package://cef/FFA/index.html");
        mp.gui.cursor.visible = true;
        ffaBrowser.execute(`updateArena('${arena}');`);
    }
    else
    {
        mp.events.call("Client:FFA:destroyBrowser");
    }
});

mp.events.add("Client:FFA:destroyBrowser", () => {
    if (ffaBrowser != null) {
        ffaBrowser.destroy();
        mp.gui.cursor.visible = false;
        ffaBrowser = null;
    }
    else
    {
        mp.events.call("Client:FFA:openBrowser");
    }
});

mp.events.add("Client:FFA:setFFA", arenaname => {
    mp.events.callRemote("Server:FFA:setFFA", arenaname);
    if (ffaBrowser != null) {
        ffaBrowser.destroy();
        mp.gui.cursor.visible = false;
        ffaBrowser = null;
    }
});

mp.keys.bind(0x45, false, function() {
    if (mp.gui.cursor.visible) return;
    mp.events.callRemote("Server:Keyhandler:E")
});
