let browser = null;

mp.events.add("client:notifyCreateBrowser", () => {
    if(browser != null) return;

    browser = mp.browsers.new("package://cef/notifications/index.html");
});

mp.events.add("client:notifyDeleteBrowser", () => {
    if(browser == null) return;

    browser.destroy();
    browser = null;
});

mp.events.add("client:notifySendNotification", (title, message = "", color, time) => {
    if(browser == null) return;

    browser.execute(`sendMessage("${title}", "${message}", "${color}", "${time}");`);
});
