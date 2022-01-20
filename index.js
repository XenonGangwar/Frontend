require ('./client/utils.js');
require('./cef/login/login.js');
require('./cef/HUD/hud.js');
require('./cef/weaponshop/weaponshop.js');
require('./cef/Fraktionsauswahl/client.js');
require('./cef/Garage/Main.js');
require("./cef/notifications/index.js");
require("./cef/global-notifications/index.js");
require('./client/client.js');
require('./cef/FFA/Main.js');
require('sync.js');
require('charcreator')
require('weaponcomponents');
require("anticheat")
require('speedometer/script')



mp.events.add('updateDiscord', (name) => {
	mp.discord.update('Xenon-Gangwar','Eingeloggt als ' + name);
});

mp.events.add('renderseat', () =>
{
	const controls = mp.game.controls;
	
	controls.enableControlAction(0, 23, true);
	controls.disableControlAction(0, 58, true);
	
	if(controls.isDisabledControlJustPressed(0, 58))
	{
		let position = mp.players.local.position;		
		let vehHandle = mp.game.vehicle.getClosestVehicle(position.x, position.y, position.z, 5, 0, 70);
		
		let vehicle = mp.vehicles.atHandle(vehHandle);
		
		if(vehicle
			&& vehicle.isAnySeatEmpty()
			&& vehicle.getSpeed() < 5)
		{
			mp.players.local.taskEnterVehicle(vehicle.handle, 5000, 0, 2, 1, 0);
		}
	}
});


mp.game.ped.setAiWeaponDamageModifier(0.9);

