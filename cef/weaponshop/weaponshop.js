let shopBrowser = null

mp.events.add("Client:OpenWeaponShop", () => {
    if (shopBrowser == null) {
        shopBrowser = mp.browsers.new("package://cef/weaponshop/Hud.html");
        mp.gui.cursor.show(true, true);
    }
});
mp.events.add("Client:CloseWeaponShop", () => {
    if (shopBrowser != null) {
        mp.gui.cursor.show(false, false);
        shopBrowser.destroy();
        shopBrowser = null;
    }
});
mp.events.add("Client:PurchaseWeapon", (weapon) => {
    mp.events.callRemote("Server:User:WeaponShop", weapon);
});