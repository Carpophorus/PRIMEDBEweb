(function(global) {
  PRM = {};

  PRM.nav = 0;

  var insertHtml = function(selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  var appear = function(selector, interval) {
    $(selector).removeClass("gone");
    setTimeout(function() {
      $(selector).css({
        "opacity": 1,
        "-webkit-transition": "opacity " + Number(interval) / 1000 + "s ease",
        "-moz-transition": "opacity " + Number(interval) / 1000 + "s ease",
        "transition": "opacity " + Number(interval) / 1000 + "s ease"
      });
    }, 10);
  };

  var disappear = function(selector, interval) {
    $(selector).css({
      "opacity": 0,
      "-webkit-transition": "opacity " + Number(interval) / 1000 + "s ease",
      "-moz-transition": "opacity " + Number(interval) / 1000 + "s ease",
      "transition": "opacity " + Number(interval) / 1000 + "s ease"
    });
    setTimeout(function() {
      $(selector).addClass("gone");
    }, Number(interval) + 10);

  };

  // document.addEventListener("DOMContentLoaded", function(event) {
  //   if (history.state != null) {
  //     if (history.state.state != null) {
  //       switch (history.state.state) {
  //         case 0:
  //           RGZ.navi(0);
  //           break;
  //         case 1:
  //           RGZ.navi(1);
  //           break;
  //         case 2:
  //           RGZ.navi(2);
  //           break;
  //         case 3:
  //           RGZ.navi(3);
  //           break;
  //         default:
  //           break;
  //       }
  //       if (history.state.state > 0 && window.innerWidth > 990.5) {
  //         $("#navi-landing").css({
  //           "opacity": "0"
  //         });
  //         $("#navi-menu").removeClass("gone");
  //         setTimeout(function() {
  //           $("#navi-menu").css({
  //             "opacity": "1"
  //           });
  //         }, 600);
  //         $("#navi-menu div span").removeClass("active");
  //         $("#navi-" + ((history.state.state == 1) ? "book" : ((history.state.state == 2) ? "stat" : "info")) + " span").addClass("active");
  //       }
  //     }
  //   } else {
  //     history.replaceState({
  //       state: 0
  //     }, null, null);
  //     RGZ.loadPage(0);
  //     RGZ.footMouseOver();
  //     setTimeout(RGZ.footMouseOut, 2500);
  //   }
  // });
  //
  // window.onpopstate = function(event) {
  //   if (event.state != null) {
  //     if (event.state.state != null) {
  //       switch (event.state.state) {
  //         case 0:
  //           RGZ.navi(0);
  //           break;
  //         case 1:
  //           RGZ.navi(1);
  //           break;
  //         case 2:
  //           RGZ.navi(2);
  //           break;
  //         case 3:
  //           RGZ.navi(3);
  //           break;
  //         default:
  //           break;
  //       }
  //       if (event.state.state > 0 && window.innerWidth > 990.5) {
  //         $("#navi-landing").css({
  //           "opacity": "0"
  //         });
  //         $("#navi-menu").removeClass("gone");
  //         setTimeout(function() {
  //           $("#navi-menu").css({
  //             "opacity": "1"
  //           });
  //         }, 600);
  //         $("#navi-menu div span").removeClass("active");
  //         $("#navi-" + ((event.state.state == 1) ? "book" : ((event.state.state == 2) ? "stat" : "info")) + " span").addClass("active");
  //       }
  //     }
  //   }
  // };

  PRM.signIn = function() {
    disappear($(".login-screen"), 500);
    setTimeout(function() {
      appear($(".loader"), 500);
    }, 500);
    setTimeout(function() { //after unsuccesful login, with prompt
      disappear($(".loader"), 500);
      setTimeout(function() {
        appear($(".login-screen"), 500);
      }, 500);
    }, 3000);
  };

  global.$PRM = PRM;
})(window);
