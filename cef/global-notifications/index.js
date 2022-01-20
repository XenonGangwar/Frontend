let browser = null;

mp.events.add("client:gnotifyCreateBrowser", () => {
    if(browser != null) return;

    browser = mp.browsers.new("package://cef/global-notifications/index.html");
});

mp.events.add("client:gnotifyDeleteBrowser", () => {
    if(browser == null) return;

    browser.destroy();
    browser = null;
});

mp.events.add("client:gnotifySendNotification", (title, message = "", color, time) => {
    if(browser == null) return;

    browser.execute(`sendGlobalMessage("${title}", "${message}", "${color}", "${time}");`);
});
