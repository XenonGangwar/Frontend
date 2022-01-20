var adminMode = false;
var gangwarMode = false;
var mic = true;
var progressBarDOM = document.getElementsByClassName('experience-bar')[0].getElementsByClassName("progress")[0];
var gangwarTimerBarDOM = document.getElementsByClassName('gangwartimer-bar')[0].getElementsByClassName("progress")[0];
var player = document.getElementById("player");
var hud = document.getElementById("hud-notifiction-message");
var topBar = document.getElementById("top-bar");
var gangwarHUD = document.getElementById("gangwar");

var deathScreen = document.getElementById("death-screen");
var deathMotivationMessage = document.getElementById("motivation-sentence");
var deathMessage = document.getElementById("death-message");
var deathTimer = document.getElementById("death-timer");

var inventory = document.getElementById("inventory");

var personalKills = 0;
var personalDeaths = 0;
var personalExperience = 0;
var personalMaxExperience = 0;
var personalKillStreakCount = 0;
var personalFirstKill = 0;

var maxTeamKills = 3;
var personalTeamKills = 0;

var maxDriveBy = 3;
var personalDriveBy = 0;

function deleteClasses(el) {
    let classList = el.classList;

    if (!classList) {
        return;
    }
    let classListLength = classList.length;
    let classIndex = 0;
    for (; classIndex < classListLength; classIndex++) {
        classList.remove(classList[0]);
    }
}

function toggleInventory() {
    //mp.trigger("ie_ToggleInventory");
    if (inventory.classList.contains("show")) {
        inventory.classList.remove("show");
        return;
    }
    inventory.classList.add("show");
}

function showInventory() {
    inventory.classList.add("show");
}

var firstAid = document.getElementById("first-aid");
firstAid.onclick = function() {
    mp.trigger("i_UseFirstAid");
    toggleInventory();
};

var vest = document.getElementById("vest");
vest.onclick = function() {
    mp.trigger("i_UseVest");
    toggleInventory();
};

var vest = document.getElementById("repair-kit");
vest.onclick = function() {
    mp.trigger("i_UseRepairKit");
    toggleInventory();
};

function showHUD() {
    topBar.classList.add("show");
}

function hideHUD() {
    topBar.classList.remove("show");
}

function toggleAdminMode() {
    adminMode = !adminMode;
    document.getElementById('admin').classList.toggle('active');

}

function showGangwarMode(gebiet, team1, team2, team1Points, team2Points) {
    gangwarMode = !gangwarMode;
    document.getElementById('gangwar').classList.toggle('active', true);

    document.getElementById('teamtitle1').innerHTML = team1;
    document.getElementById('teamtitle2').innerHTML = team2;
    document.getElementById('teampointtitle1').innerHTML = team1Points;
    document.getElementById('teampointtitle2').innerHTML = team2Points;

}

function hideGangwarMode() {
    gangwarMode = !gangwarMode;
    document.getElementById('gangwar').classList.toggle('active', false);
}

function updateGangwarStats(team1Points, team2Points) {
    document.getElementById('teampointtitle1').innerHTML = 100;
    document.getElementById('teampointtitle2').innerHTML = 200;
}

function startGwTimer() {
    var presentTime = document.getElementById('gwtimer').innerHTML;
    var timeArray = presentTime.split(/[Minuten]+/);
    var done = false;
    var m = checkMin(timeArray[0]);
    var s = checkSecond((timeArray[1] - 1));
    if (s == 59) {
        if (m != 0) { m = m - 1 } else {
            s = 0;
            done = true;
            mp.trigger("e_DoneGangwarMode");
        }
    }

    document.getElementById('gwtimer').innerHTML =
        m + " Minuten " + s;
    gangwarTimerBarDOM.style.width = (parseFloat(gangwarTimerBarDOM.style.width) - 0.055) + "%";

    if (done == false) {
        setTimeout(startGwTimer, 0.25);
    }
}

function checkSecond(sec) {
    if (sec < 10 && sec >= 0) { sec = "0" + sec };
    if (sec < 0) { sec = "59" };

    return sec;
}

function checkMin(m) {
    if (m < 0) { m = "0" };
    return m;
}

function toggleMic() {
    mic = !mic;
    document.getElementById('kd-mic').style.color = ((!mic) ? 'red' : '#22d822');
    document.getElementById('mictext').innerHTML = ((!mic) ? 'Aus' : 'An');
}

var killstreakTimeout = null;

function personalKillStreak() {
    personalKillStreakCount++;

    switch (personalKillStreakCount) {
        case 3:
            playSound("v2_unstoppable");
            break;
        case 6:
            playSound("v2_massacre");
            break;
        case 9:
            playSound("v2_killingmachine");
            break;
    }

    clearTimeout(killstreakTimeout);
    killstreakTimeout = setTimeout(function() {
        personalKillStreakCount = 0;
        killstreakTimeout = null;
    }, 5000);
}

var hudMessageTimeout = null;

function hudMessage(message, type = "") {
    deleteClasses(hud);
    setTimeout(function() {
        hud.innerHTML = message;
        hud.classList.add("show");
        if (type.length) {
            hud.classList.add(type);
        }

        clearTimeout(hudMessageTimeout);
        hudMessageTimeout = setTimeout(function() {
            deleteClasses(hud);
        }, 3000);
    }, 5);

}

/* KDR */
function killEvent(teamKill, killerName, kills, deaths, victimName, driveBy) {
    if (killerName === victimName) {
        return;
    }

    if (teamKill) {
        if (personalTeamKills >= 3) {
            sendPopup("system", "TEAMKILL", `Du hast zuviele Teamkills (${personalTeamKills}/${maxTeamKills}) gemacht, du wurdest gekickt.`)
            mp.trigger("Client:Kick:Kick");
            return;
        }
        personalTeamKills++;
        sendPopup("system", "TEAMKILL", `Achtung, du hast ${personalTeamKills}/${maxTeamKills} Teamkills gemacht. Teamkills werden nicht geduldet.`);
        return;
    }

    if (driveBy) {
        personalDriveBy++;
        sendPopup("system", "DRIVEBY", `Achtung, du hast ${personalDriveBy}/${maxDriveBy} Drive-bys gemacht. Drive-bys werden nicht geduldet.`);
        return;
    }

    hudMessage(`DU HAST ${victimName.toUpperCase()} GE${teamKill ? "TEAMKILLT." : "TÖTET."}`);

    if (personalFirstKill === 0) {
        personalFirstKill = 1;
        playSound("v2_firstblood");
    }

    personalKillStreak();

    updateRatio(kills, deaths);
}

function deathEvent(teamKill, killerName, kills, deaths, victimName) {
    hideHUD();
    showDeathScreen();
    startDeathTimer(teamKill, killerName);

    if (killerName === victimName) {
        return;
    }

    deathMessage.innerHTML = `DU WURDEST VON ${killerName.toUpperCase()} GE${teamKill ? "TEAMKILLT." : "TÖTET."}`;

    updateRatio(kills, deaths);

    if (teamKill) {
        return;
    }


}

function startDeathTimer(teamKill, killerName) {
    let countdownCount = 4;
    let motivationArray = [
        "Räche dich in",
        "Gib Vollgas in",
        "Neuer Versuch in",
        "Bereite dich vor.",
        "Setze alles auf eine Karte!",
        "Zeig es Ihnen in",
        "Mach deine Gang stolz in",
        "Blutrache in",
        "Hol dir deine Ehre zurück in",
        "Es geht los in",
        "Starte deinen Killstreak in",
    ];
    setTimeout(function() {
        playSound("timer_buildup");
    }, 1000);

    var motivationSentence = motivationArray[Math.floor(Math.random() * motivationArray.length)];
    playSound("timer_beep");
    deathMotivationMessage.innerHTML = motivationSentence;
    deathTimer.innerHTML = "&nbsp;00:05";

    let countdown = setInterval(function() {
        if (countdownCount === 0) {
            hideDeathScreen();
            clearInterval(countdown);
            return;
        }

        playSound("timer_beep");


        deathTimer.innerHTML = "&nbsp;00:0" + countdownCount;
        countdownCount--;
    }, 1000);

}

function showDeathScreen() {
    deathScreen.classList.add("show");
}

function hideDeathScreen() {
    deathScreen.classList.remove("show");
}

function respawnEvent() {
    showHUD();
    hideDeathScreen();
}

function updateRatio(personalKills, personalDeaths) {
    var ratio = (Math.max(personalKills, 1) / Math.max(personalDeaths, 1));
    document.getElementById('kd-ratio').innerHTML = ratio.toFixed(2).toString();
}

/* LEVEL AND XP */
function setLevel(level) {
    document.getElementById('level').innerHTML = level;
}

function setKills(kills) {
    document.getElementById("kd-kills").innerHTML = kills;
    personalkills = kills;
}

function setMoney(money) {
    document.getElementById("kd-money").innerHTML = money;
    personalmoney = money;
}

function setDeaths(deaths) {
    document.getElementById("kd-deaths").innerHTML = deaths;
    personaldeaths = deaths;
}

function setExperience(experience, animate = false) {
    document.getElementById("actual-experience").innerHTML = experience;
    personalExperience = experience;
    setProgressBar(experience, null, animate);
}

function setMaxExperience(maxExperience, animate = false) {
    document.getElementById("max-experience").innerHTML = maxExperience;
    personalMaxExperience = maxExperience;
    setProgressBar(null, maxExperience, animate);
}

function setProgressBar(animate) {
    progressBarDOM.style.width = (personalExperience / personalMaxExperience) * 100 + "%";

    if (!animate) {
        return;
    }

    progressBarDOM.classList.add("gained");

    setTimeout(function() {
        progressBarDOM.classList.remove("gained");
    }, 750);
}

function levelUp(level, maxExperience) {
    setLevel(level);
    setExperience(0);
    setMaxExperience(maxExperience);
    sendPopup("levelup", `LEVEL AUFSTIEG`, `Du bist auf Level ${level} aufgestiegen!`);
}

function addAssistXP(experience) {
    personalExperience += experience;
    document.getElementById("actual-experience").innerHTML = personalExperience;
    setProgressBar(personalExperience, null, 1);
    hudMessage(`+${experience}XP ASSIST`, "pop-in");
}

function clearPopups() {
    toastr.remove();
}

function log(title, message) {
    sendPopup("system", title, message, 1800);
}

function gw(style, message) {
    sendPopup(style, "GANGWAR", message, 1800);
}

function sendPopup(style, title, message, lengthMS = 5000) {
    toastr.options.positionClass = "toast-top-center";
    toastr.options.timeOut = lengthMS;

    switch (style) {
        case "levelup":
            toastr.success(message, title);
            playSound("levelup");
            break;
        case "gangwar":
            toastr.success(message, title);
            playSound("gangwar");
            break;
        case "gangwarloose":
            toastr.error(message, title);
            playSound("gangwar");
            break;
        case "system":
            toastr.error(message, title);
            playSound("error");
            break;
        case "fib":
            toastr.fib(message, title);
            playSound("fib");
            break;
        case "admin":
            toastr.warning(message, title);
            playSound("warning");
            break;
        case "mod":
            toastr.info(message, title);
            playSound("info");
            break;
        default:
            toastr.info(message, title);
            break;
    }
}

function playSound(type) {
    var play = player.getElementsByClassName(type)[0];
    var sound = new Audio();
    var source = document.createElement("source");
    source.type = "audio/mp3";
    source.src = play.src;
    sound.onended = function() {
        sound = null;
        source = null;
    };
    sound.appendChild(source);
    sound.play();
}