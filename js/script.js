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
        title: 'ГРЕШКА!',
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
          title: 'ГРЕШКА!',
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
    if ($(e).val() != "") {
      $("#clear-searchboxes i, #mobile-refresh-clear i").addClass("fa-eraser").removeClass("fa-times");
      $("." + $(e).attr("class")).val($(e).val());
    } else if ($("#file-number").val() == "" && $("#date-from").val() == "" && $("#date-to").val() == "" && $("#client-name").val() == "" && $("#client-mail").val() == "" && $("#client-phone").val() == "" && $("#office option:selected").attr("value") == 0 && $("#status option:selected").attr("value") == 0 && $("#response option:selected").attr("value") == 0)
      $("#clear-searchboxes i, #mobile-refresh-clear i").removeClass("fa-eraser").addClass("fa-times");
  };

  PRM.searchbarSelectChanged = function(e) {
    $("." + $(e).attr("class")).css({
      "color": "white"
    });
    $("." + $(e).attr("class")).prop("selectedIndex", $(e).prop("selectedIndex"));
    $("#clear-searchboxes i, #mobile-refresh-clear i").addClass("fa-eraser").removeClass("fa-times");
  };

  PRM.searchButtonClicked = function() {
    if ($("#refresh i").hasClass("fa-spin")) return;
    if ($("#search-criteria").width() == 0) {
      $("#two-buttons").css({
        "width": "0",
        "opacity": "0"
      });
      $("#search-criteria").css({
        "width": "100%",
        "opacity": "1"
      });
      $("#mobile-searchboxes").collapse("show");
      $("#mobile-refresh-clear").addClass("shrunken");
      $("#mobile-refresh-clear i").removeClass("fa-refresh");
      if ($("#file-number").val() == "" && $("#date-from").val() == "" && $("#date-to").val() == "" && $("#client-name").val() == "" && $("#client-mail").val() == "" && $("#client-phone").val() == "" && $("#office option:selected").attr("value") == 0 && $("#status option:selected").attr("value") == 0 && $("#response option:selected").attr("value") == 0)
        $("#mobile-refresh-clear i").addClass("fa-times");
      else
        $("#mobile-refresh-clear i").addClass("fa-eraser");
    } else if ($("#search-criteria").width() >= (window.innerWidth - window.innerHeight / 100) * 11 / 12 - 20) {
      if ($("#file-number").val() == "" && $("#date-from").val() == "" && $("#date-to").val() == "" && $("#client-name").val() == "" && $("#client-mail").val() == "" && $("#client-phone").val() == "" && $("#office option:selected").attr("value") == 0 && $("#status option:selected").attr("value") == 0 && $("#response option:selected").attr("value") == 0) {
        $.confirm({
          title: 'ГРЕШКА!',
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
      $("#mobile-searchboxes").collapse("hide");
      $("#mobile-refresh-clear").removeClass("shrunken");
      $("#mobile-refresh-clear i").removeClass("fa-times fa-eraser").addClass("fa-refresh");
      //TODO: perform search
    }
  };

  PRM.clearButtonClicked = function(nest) {
    if ($("#clear-searchboxes i").hasClass("fa-eraser")) {
      $("#searchbar input").val("");
      $("#searchbar option").prop("selected", false);
      $("#searchbar option:first-child").prop("selected", true);
      $("#searchbar select").css({
        "color": "#777"
      });
      $(".date-from, .date-to").datepicker('update', '');
      $(".date-from, .date-to").datepicker('setEndDate', '0d');
      $(".date-from, .date-to").datepicker('setStartDate', '');
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
    if (nest != 1)
      PRM.mobileRefreshClearButtonClicked(1);
  };

  PRM.mobileRefreshClearButtonClicked = function(nest) {
    if ($("#mobile-refresh-clear i").hasClass("fa-spin")) return;
    if ($("#mobile-refresh-clear i").hasClass("fa-refresh")) {
      PRM.refresh();
    } else if ($("#mobile-refresh-clear i").hasClass("fa-times")) {
      $("#mobile-searchboxes").collapse("hide");
      $("#mobile-refresh-clear").removeClass("shrunken");
      $("#mobile-refresh-clear i").removeClass("fa-times").addClass("fa-refresh");
      if (nest != 1)
        PRM.clearButtonClicked(1);
    } else if ($("#mobile-refresh-clear i").hasClass("fa-eraser")) {
      $("#searchbar input").val("");
      $("#searchbar option").prop("selected", false);
      $("#searchbar option:first-child").prop("selected", true);
      $("#searchbar select").css({
        "color": "#777"
      });
      $(".date-from, .date-to").datepicker('update', '');
      $(".date-from, .date-to").datepicker('setEndDate', '0d');
      $(".date-from, .date-to").datepicker('setStartDate', '');
      $("#mobile-refresh-clear i").removeClass("fa-eraser").addClass("fa-times");
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
        title: 'ГРЕШКА!',
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
        title: 'ГРЕШКА!',
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
      $.confirm({
        title: 'ПАЖЊА!',
        content: 'Да ли сте сигурни да желите да сачувате овај одговор као званичан одговор службе? / Да ли сте сигурни да желите да клијенту пошаљете овај одговор као званичан одговор службе?',
        theme: 'supervan',
        backgroundDismiss: 'true',
        autoClose: 'no|10000',
        buttons: {
          no: {
            text: 'НЕ',
            btnClass: 'btn-white-prm',
            keys: ['esc'],
            action: function() {}
          },
          yes: {
            text: 'ДА',
            btnClass: 'btn-white-prm',
            keys: ['enter'],
            action: function() {
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
          }
        }
      });
    }
  };

  PRM.refresh = function() {
    if ($("#refresh i").hasClass("fa-spin")) return;
    $("#refresh i, #mobile-refresh-clear i").addClass("fa-spin");
    setTimeout(function() {
      $("#refresh i, #mobile-refresh-clear i").removeClass("fa-spin");
    }, 2500); //this delay only simulating network response
  };

  var printTitle = "";
  PRM.printTitleChanged = function(e) {
    printTitle = $(e).val();
  };

  PRM.print = function() {
    printTitle = "";
    $.confirm({
      title: 'ПОТВРДА',
      content: `Уколико желите наслов на документу за штампу, унесите га у ово поље:<br><br><input id="print-title" type="text" placeholder="наслов" onfocus="this.placeholder = ''" onblur="this.placeholder = 'наслов'" onkeyup="$PRM.printTitleChanged(this);">`,
      theme: 'supervan',
      backgroundDismiss: 'true',
      buttons: {
        cancel: {
          text: '<i class="fa fa-times"></i>',
          btnClass: 'btn-white-prm',
          keys: ['esc'],
          action: function() {}
        },
        print: {
          text: '<i class="fa fa-print"></i>',
          btnClass: 'btn-white-prm',
          keys: ['enter'],
          action: function() {
            var html4print = `
              <head><title>` + printTitle + `</title></head>
              <body>
                <div class="header">
                  <div class="inner-s">р.б.</div>
                  <div class="inner-xl">бр. предмета</div>
                  <div class="inner-l">датум</div>
                  <div class="inner-xl">име и презиме</div>
                  <div class="inner-xl">e-mail</div>
                  <div class="inner-l">телефон</div>
                  <div class="inner-l">служба</div>
                  <div class="inner-l">статус</div>
                  <div class="inner-l">одговор</div>
                </div>
            `;
            for (var i = 0; i < 50; i++) {
              html4print += `
                <div class="outer">
                  <div class="inner-s">` + `123` + `</div>
                  <div class="inner-xl">` + `95-74993678/2017` + `</div>
                  <div class="inner-l">` + `10.11.2017. 08:51` + `</div>
                  <div class="inner-xl">` + `Radibrat Radibratović` + `</div>
                  <div class="inner-xl">` + `rr69@gmail.com` + `</div>
                  <div class="inner-l">` + `069/555-78-03` + `</div>
                  <div class="inner-l">` + `Велика Плана` + `</div>
                  <div class="inner-l">` + `Непрослеђен` + `</div>
                  <div class="inner-l">` + `Нема одговора` + `</div>
                </div>
              `;
            }
            html4print += `
              </body>
              <style>
                body {
                  margin: 0;
                  -webkit-print-color-adjust: exact;
                }
                .header, .outer {
                  position: relative;
                  width: 100%;
                  font-size: 65%;
                  overflow: auto;
                }
                .header {
                  color: white;
                  font-weight: bold;
                  background-color: #444;
                }
                .outer:nth-child(odd) {
                  background-color: #eee !important;
                }
                .header>div, .outer>div {
                  float: left;
                  white-space: nowrap;
                  overflow: hidden !important;
                  text-overflow: ellipsis;
                  line-height: 2;
                }
                .inner-s {
                  width: 5%;
                }
                .inner-l {
                  width: 10%;
                }
                .inner-xl {
                  width: 15%;
                }
              </style>
            `;

            w = window.open("");
            w.document.write(html4print);
            w.print();
            w.close();
          }
        }
      }
    });
    //generate html (prompt for all or screen?)
  };

  PRM.dateInit = function() {
    $(".date-from, .date-to").datepicker({
      format: "dd.mm.yyyy.",
      todayHighlight: true,
      todayBtn: "linked",
      language: "sr",
      endDate: "0d"
    });
  };

  PRM.dateFromChanged = function(e) {
    if ($(e).val() != "")
      $(".date-to").datepicker('setStartDate', $(e).val());
    console.log($("#date-to").datepicker('getStartDate'));
    PRM.searchbarInputChanged(e);
  };

  PRM.dateToChanged = function(e) {
    if ($(e).val() != "")
      $(".date-from").datepicker('setEndDate', $(e).val());
    console.log($("#date-from").datepicker('getEndDate'));
    PRM.searchbarInputChanged(e);
  };

  global.$PRM = PRM;
})(window);
