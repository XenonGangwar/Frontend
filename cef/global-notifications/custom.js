function sendGlobalMessage(title, message, color, time) {
    var $html = $(
        `
        <div class="notification" style="border-top: 5px ` + color + ` solid; border-bottom: 5px ` + color + ` solid;">
            <p id="title" style="color: ` + color + `;">` + title + `</p>
            <p id="message">` + message + `</p>
        </div>
        `
    )
    $(".global-messages").prepend($html).fadeIn();
    $html.fadeOut(0);
    $html.fadeIn(1000);

    setTimeout(() => {
        $html.fadeOut(1000);
        setTimeout(() => {
            $html.remove();
        }, 850);
    }, time);
}