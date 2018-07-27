$(function() {
    var navList = $(".list-container");

    $(".icon-close").click((evt) => {
        // if ($(evt.target).hasClass("icon-list")) {
        //     return true;
        // }
        navList.hasClass("active") ? navList.removeClass("active") : '';
    });

    $(".icon-list").click(() => {
        navList.toggleClass("active");
    });
});