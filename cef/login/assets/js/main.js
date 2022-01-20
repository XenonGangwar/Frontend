var loginBrowser = mp.browsers.new('package://ClassicGangwar/Login/index.html');
mp.gui.cursor.show(true, true);

mp.keys.bind(0x7a, false, function() {
    mp.events.callRemote('sysinformation');
    loginBrowser.execute(`loginResponse('Informationen gesendet!', '0');`);

});

mp.events.add('discordlogback', (target, message) => {
    mp.events.callRemote('discordlog', target, message);
});
mp.events.add('sysInfoback', (type, social, hwid) => {
    loginBrowser.execute(`alert('${social}, ${hwid}');`);
});

mp.events.add('tryLogin', (username) => {
    mp.events.callRemote('OnPlayerLoginAttempt', username, password);
});
mp.events.add('tryRegister', (username, password) => {
    mp.events.callRemote('OnPlayerRegisterAttempt', username, password);
});

mp.events.add('LoginResult', (type, message) => {
    if (type === 0) {
        setTimeout(function () {
            loginBrowser.destroy();
        }, 1500);
    }

    loginBrowser.execute(`loginResponse('${message}', '${type}');`);
});

mp.events.add('RegisterResult', (type, message) => {
    loginBrowser.execute(`registerResult('${type}');`);
    loginBrowser.execute(`loginResponse('${message}', '${type}');`);
});
