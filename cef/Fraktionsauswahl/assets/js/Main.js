
let frakBrowser = null;

mp.events.add("frakBrowser", (ballas, fib, grovestreet, lcn, marabunta, midnight, triaden, vagos, yakuza, bloods,) => {
   
    frakBrowser.execute(`ballasCount(${ballas});`);
    frakBrowser.execute(`fibCount(${fib});`);
    frakBrowser.execute(`grovestreetCount(${grovestreet});`);
    frakBrowser.execute(`lcnCount(${lcn});`);
    frakBrowser.execute(`marabuntaCount(${marabunta});`);
    frakBrowser.execute(`midnightCount(${midnight});`);
    frakBrowser.execute(`triadenCount(${triaden});`);
    frakBrowser.execute(`vagosCount(${vagos});`);
    frakBrowser.execute(`yakuzaCount(${yakuza});`);
    frakBrowser.execute(`bloodsCount(${bloods});`);
	mp.gui.cursor.show(true, true);		
	setTimeout(function() {
	mp.gui.cursor.show(true, true);
	}, 600);
});

mp.events.add("CloseFrakBrowser", () => {

	frakBrowser.destroy();
    mp.gui.cursor.show(false, false);
});

mp.events.add("mnc", () => {
    mp.events.callRemote('mnc.server');
	frakBrowser.destroy();
    mp.gui.cursor.show(false, false);
});


mp.events.add("gf", () => {
    mp.events.callRemote('gf.server');
	frakBrowser.destroy();
    mp.gui.cursor.show(false, false);
});

mp.events.add("ballas", () => {
    mp.events.callRemote('ballas.server');
	frakBrowser.destroy();
    mp.gui.cursor.show(false, false);
});

mp.events.add("lsv", () => {
    mp.events.callRemote('lsv.server');
	frakBrowser.destroy();
    mp.gui.cursor.show(false, false);
});

mp.events.add("mg13", () => {
    mp.events.callRemote('mg13.server');
	frakBrowser.destroy();
    mp.gui.cursor.show(false, false);
});

mp.events.add("lcn", () => {
    mp.events.callRemote('lcn.server');
	frakBrowser.destroy();
    mp.gui.cursor.show(false, false);
});

mp.events.add("triaden", () => {
    mp.events.callRemote('triaden.server');
	frakBrowser.destroy();
    mp.gui.cursor.show(false, false);
});

mp.events.add("yakuza", () => {
    mp.events.callRemote('yakuza.server');
	frakBrowser.destroy();
    mp.gui.cursor.show(false, false);
});

mp.events.add("fib", () => {
    mp.events.callRemote('fib.server');
});

mp.events.add("bloods", () => {
    mp.events.callRemote('bloods.server');
});


mp.events.add("destroyfrakbrowser", () => {
    frakBrowser.destroy();
    mp.gui.cursor.show(false, false);
});
