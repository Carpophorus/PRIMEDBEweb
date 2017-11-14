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
    if ($("#username").val() == "" || $("#password").val() == "") {
      $.confirm({
        title: 'ГРЕШКА',
        content: 'Морате унети и корисничко име и шифру.',
        theme: 'supervan',
        backgroundDismiss: 'true',
        buttons: {
          ok: {
            text: 'ОК',
            btnClass: 'btn-white-prm',
            keys: ['enter'],
            action: function() {}
          }
        }
      });
      return;
    }
    disappear($(".login-screen"), 500);
    setTimeout(function() {
      appear($(".loader"), 500);
    }, 500);
    setTimeout(function() { //after unsuccesful login, with prompt
      disappear($(".loader"), 500);
      setTimeout(function() {
        appear($(".login-screen"), 500);
        $.confirm({
          title: 'ГРЕШКА',
          content: 'Појавила се грешка приликом пријаве на систем. Проверите своје креденцијале и покушајте поново.<br><br>Контактирајте системске администраторе уколико се овај проблем често дешава.',
          theme: 'supervan',
          backgroundDismiss: 'true',
          buttons: {
            ok: {
              text: 'ОК',
              btnClass: 'btn-white-prm',
              keys: ['enter'],
              action: function() {}
            }
          }
        });
      }, 500);
    }, 3000);
  };

  PRM.navi = function(n, e) {
    if (!$(".navbar-toggler").hasClass("collapsed"))
      $(".navbar-toggler").click();
    if ($(e).hasClass("active"))
      return;
    $(".nav-item").removeClass("active");
    $(e).addClass("active");
    disappear($(".mobile-navi-helper"), 500);
    setTimeout(function() {
      appear($(".mnh-" + n), 500);
    }, 510);
    PRM.loadPage(n);
  };

  PRM.loadPage = function(n) {
    //
    disappear($("#switchbox"), 500);
    appear($(".loader"), 500);
    setTimeout(function() {
      insertHtml("#switchbox", ``);
    }, 500);
    setTimeout(function() {
      if (n == 2) {
        var html = `
          <div class="row">
            <div class="col-lg-6 col-12" id="chart"></div>
            <div class="col-lg-6 col-12" id="stats">
              <div class="stat row">
                <div class="col-7 col-sm-8 stat-toc">Укупно:&nbsp;......................................................................................................................................................................................................</div>
                <div class="col-2 col-sm-2 stat-num stat-white">` + 66 + `</div>
                <div class="col-3 col-sm-2 stat-desc">примедби</div>
              </div>
              <div class="stat row">
                <div class="col-7 col-sm-8 stat-toc">Без&nbsp;одговора:&nbsp;......................................................................................................................................................................................................</div>
                <div class="col-2 col-sm-2 stat-num stat-red">` + 14 + `</div>
                <div class="col-3 col-sm-2 stat-desc">(` + (100 * 14 / 66).toFixed(2) + `%)</div>
              </div>
              <div class="stat row">
                <div class="col-7 col-sm-8 stat-toc">Непрослеђених:&nbsp;......................................................................................................................................................................................................</div>
                <div class="col-2 col-sm-2 stat-num stat-blue">` + 5 + `</div>
                <div class="col-3 col-sm-2 stat-desc">(` + (100 * 5 / 66).toFixed(2) + `%)</div>
              </div>
              <div class="stat row">
                <div class="col-7 col-sm-8 stat-toc">На&nbsp;чекању:&nbsp;......................................................................................................................................................................................................</div>
                <div class="col-2 col-sm-2 stat-num stat-yellow">` + 7 + `</div>
                <div class="col-3 col-sm-2 stat-desc">(` + (100 * 7 / 66).toFixed(2) + `%)</div>
              </div>
              <div class="stat row">
                <div class="col-7 col-sm-8 stat-toc">Одговорено:&nbsp;......................................................................................................................................................................................................</div>
                <div class="col-2 col-sm-2 stat-num stat-green">` + 40 + `</div>
                <div class="col-3 col-sm-2 stat-desc">(` + (100 * 40 / 66).toFixed(2) + `%)</div>
              </div>
            </div>
          </div>
        `;
        insertHtml("#switchbox", html);
        var chart = new Chartist.Pie("#chart", {
          series: [14, 5, 7, 40],
          labels: [0, 0, 0, 0]
        }, {
          donut: true,
          showLabel: false
        });
        chart.on('draw', function(data) {
          if (data.type === 'slice') {
            var pathLength = data.element._node.getTotalLength();
            data.element.attr({
              'stroke-dasharray': pathLength + 'px ' + pathLength + 'px'
            });
            var animationDefinition = {
              'stroke-dashoffset': {
                id: 'anim' + data.index,
                dur: 500,
                from: -pathLength + 'px',
                to: '0px',
                easing: Chartist.Svg.Easing.easeOutQuint,
                fill: 'freeze'
              }
            };
            if (data.index !== 0) {
              animationDefinition['stroke-dashoffset'].begin = 'anim' + (data.index - 1) + '.end';
            }
            data.element.attr({
              'stroke-dashoffset': -pathLength + 'px'
            });
            data.element.animate(animationDefinition, false);
          }
        });
      }
      appear($("#switchbox"), 500);
      disappear($(".loader"), 500);
    }, 2500); //this delay only simulating network response
  };

  PRM.searchbarInputChanged = function(e) {
    if ($(e).val() != "")
      $("#clear-searchboxes i").addClass("fa-eraser").removeClass("fa-times");
    else if ($("#file-number").val() == "" && $("#date-from").val() == "" && $("#date-to").val() == "" && $("#client-name").val() == "" && $("#client-mail").val() == "" && $("#client-phone").val() == "" && $("#office option:selected").attr("value") == 0 && $("#status option:selected").attr("value") == 0 && $("#response option:selected").attr("value") == 0)
      $("#clear-searchboxes i").removeClass("fa-eraser").addClass("fa-times");
  };

  PRM.searchbarSelectChanged = function(e) {
    $(e).css({
      "color": "white"
    });
    $("#clear-searchboxes i").addClass("fa-eraser").removeClass("fa-times");
  };

  PRM.searchButtonClicked = function() {
    if ($("#search-criteria").width() == 0) {
      $("#two-buttons").css({
        "width": "0",
        "opacity": "0"
      });
      $("#search-criteria").css({
        "width": "100%",
        "opacity": "1"
      });
    } else {
      if ($("#file-number").val() == "" && $("#date-from").val() == "" && $("#date-to").val() == "" && $("#client-name").val() == "" && $("#client-mail").val() == "" && $("#client-phone").val() == "" && $("#office option:selected").attr("value") == 0 && $("#status option:selected").attr("value") == 0 && $("#response option:selected").attr("value") == 0) {
        $.confirm({
          title: 'ГРЕШКА',
          content: 'Барем једно од поља за критеријуме претраге мора имати вредност.',
          theme: 'supervan',
          backgroundDismiss: 'true',
          buttons: {
            ok: {
              text: 'ОК',
              btnClass: 'btn-white-prm',
              keys: ['enter'],
              action: function() {}
            }
          }
        });
        return;
      }
      $("#search-criteria").css({
        "width": "0",
        "opacity": "0"
      });
      $("#two-buttons").css({
        "width": "100%",
        "opacity": "1"
      });
      //perform search
    }
  };

  PRM.clearButtonClicked = function() {
    if ($("#clear-searchboxes i").hasClass("fa-eraser")) {
      $("#searchbar input").val("");
      $("#searchbar option").prop("selected", false);
      $("#searchbar option:first-child").prop("selected", true);
      $("#searchbar select").css({
        "color": "#777"
      });
      $("#clear-searchboxes i").removeClass("fa-eraser").addClass("fa-times");
    } else {
      $("#search-criteria").css({
        "width": "0",
        "opacity": "0"
      });
      $("#two-buttons").css({
        "width": "100%",
        "opacity": "1"
      });
    }
  };

  PRM.tableRowClicked = function(n, e) {
    if ($(e).hasClass("expanded")) {
      $(e).removeClass("expanded");
      $("#expansion-" + n).collapse('hide');
    } else {
      $(e).addClass("expanded");
      $("#expansion-" + n).collapse('show');
    }
  };

  PRM.expansionSelectChanged = function(e) {
    $(e).css({
      "color": "white"
    });
  };

  PRM.forward = function(pID, e) {
    if ($(e).parent().parent().find("#forward option:selected").val() == 0) {
      $.confirm({
        title: 'ГРЕШКА',
        content: 'Морате изабрати оператера којем се примедба прослеђује.',
        theme: 'supervan',
        backgroundDismiss: 'true',
        buttons: {
          ok: {
            text: 'ОК',
            btnClass: 'btn-white-prm',
            keys: ['enter'],
            action: function() {}
          }
        }
      });
      return;
    } else {
      disappear(e, 500);
      setTimeout(function() {
        appear($(e).parent().find(".loader"), 500);
      }, 500);
      setTimeout(function() {
        $.confirm({
          title: 'ПОТВРДА',
          content: 'Примедба ' + pID + ' успешно прослеђена.',
          theme: 'supervan',
          backgroundDismiss: 'true',
          buttons: {
            ok: {
              text: 'ОК',
              btnClass: 'btn-white-prm',
              keys: ['enter'],
              action: function() {}
            }
          }
        });
        disappear($(e).parent().find(".loader"), 500);
        setTimeout(function() {
          appear(e, 500);
        }, 500);
      }, 2500); //this delay only simulating network response
    }
  };

  PRM.send = function(pID, e) {
    if ($("#office-response").html() == "") {
      $.confirm({
        title: 'ГРЕШКА',
        content: 'Не можете послати празан одговор.',
        theme: 'supervan',
        backgroundDismiss: 'true',
        buttons: {
          ok: {
            text: 'ОК',
            btnClass: 'btn-white-prm',
            keys: ['enter'],
            action: function() {}
          }
        }
      });
      return;
    } else {
      disappear(e, 500);
      setTimeout(function() {
        appear($(e).parent().find(".loader"), 500);
      }, 500);
      setTimeout(function() {
        $.confirm({
          title: 'ПОТВРДА',
          content: 'Одговор на примедбу ' + pID + ' успешно евидентиран. / Одговор на примедбу ' + pID + ' успешно послат клијенту.',
          theme: 'supervan',
          backgroundDismiss: 'true',
          buttons: {
            ok: {
              text: 'ОК',
              btnClass: 'btn-white-prm',
              keys: ['enter'],
              action: function() {}
            }
          }
        });
        disappear($(e).parent().find(".loader"), 500);
        setTimeout(function() {
          appear(e, 500);
        }, 500);
      }, 2500); //this delay only simulating network response
    }
  };

  PRM.refresh = function() {
    $("#refresh i").addClass("fa-spin");
    setTimeout(function() {
      $("#refresh i").removeClass("fa-spin");
    }, 2500); //this delay only simulating network response
  };

  global.$PRM = PRM;
})(window);
