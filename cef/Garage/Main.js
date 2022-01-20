let garageBrowser = null;
let privateCars = [];
let prestigeCars = [];
let vehicles = [];

mp.events.add("Client:Garage:openBrowser", (garageId) => {
    if (garageBrowser != null) return;
    garageBrowser = mp.browsers.new("package://cef/Garage/index.html");
    setTimeout(() => {
        garageBrowser.execute(`setPrivateCars('${JSON.stringify(privateCars)}');`);
        garageBrowser.execute(`setPrestigeCars('${JSON.stringify(prestigeCars)}');`);
        garageBrowser.execute(`fillInformations(${garageId}, '${JSON.stringify(vehicles)}');`);
        mp.gui.cursor.show(true, true);
    }, 500);
});

mp.events.add("Client:Garage:clearInfo", () => {
	vehicles = [];
	prestigeCars = [];
	privateCars = [];
});

mp.events.add("Client:Garage:setPrivateCars", (json) => {
    setJsonInfo(1, json);
});

mp.events.add("Client:Garage:setVehicles", (json) => {
    setJsonInfo(3, json);
});

mp.events.add("Client:Garage:setPrestigeCars", (json) => {
    setJsonInfo(2, json);
});

mp.events.add("Client:Garage:destroyBrowser", () => {
    if (garageBrowser == null) return;
    garageBrowser.destroy();
    garageBrowser = null;
    mp.gui.cursor.show(false, false);
});

mp.events.add("Client:Garage:takeVehicle", (displayName, type, garageId) => {
    mp.events.callRemote("Server:Garage:takeVehicle", displayName, type, garageId); //ausparkenGarage
    if (garageBrowser == null) return;
    garageBrowser.destroy();
    garageBrowser = null;
    mp.gui.cursor.show(false, false);
});

function setJsonInfo(type, array) {
    array = JSON.parse(array);
    switch (type) {
        case 1:
            for (var i in array) {
                privateCars.push(array[i]);
            }
            break;
        case 2:
            for (var i in array) {
                prestigeCars.push(array[i]);
            }
            break;
        case 3:
            for (var i in array) {
                vehicles.push(array[i]);
            }
            break;
    }
}