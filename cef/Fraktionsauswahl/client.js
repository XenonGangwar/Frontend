let teamBrowser = null;
let teamInfo = [];

mp.events.add("Client:TeamBrowser:createBrowser", () => {
    if (teamBrowser == null) teamBrowser = mp.browsers.new("package://cef/Fraktionsauswahl/index.html");

    setTimeout(() => {
        teamBrowser.execute(`fillInformations('${JSON.stringify(teamInfo)}');`);
        mp.gui.cursor.show(true, true);
    }, 1000);
});

mp.events.add("Client:TeamBrowser:clearInfo", () => {
    teamInfo = [];
});

mp.events.add("Client:TeamBrowser:fillInformations", (json) => {
    setTeamInfoItems(json);
});

function setTeamInfoItems(array) {
    array = JSON.parse(array);
    for (var i in array) {
        teamInfo.push(array[i]);
    }
}

mp.events.add("Client:TeamBrowser:selectTeam", (factionId) => {
    if (factionId <= 0 || factionId == undefined) return;
    mp.events.callRemote("Server:TeamBrowser:selectTeam", parseInt(factionId));
});

mp.events.add("Client:TeamBrowser:destroyBrowser", () => {
    if (teamBrowser != null) {
        mp.gui.cursor.show(false, false);
        teamBrowser.destroy();
        teamBrowser = null;
    }
});