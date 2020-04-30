(function(global) {
  PRM = {};

  PRM.nav = 0;
  var officesArray = [];
  var offices = null;
  var statuses = null;

  // DBS TEST:
  //var apiRoot = 'http://10.0.1.251:8090/';
  //var apiRoot = 'https://10.0.1.251:443/';
  //const control = 'centar';

  // RGZ TEST:
  var apiRoot = 'http://93.87.56.76:8095/';
  const control = 'Sektor za katastar nepokretnosti';

  // RGZ LIVE:
  //var apiRoot = 'http://93.87.56.76:8090/';
  //const control = 'Sektor za katastar nepokretnosti';

  var authObject = null;

  var cComment, oComment, oResponse;
  var cComms = [];
  var oComms = [];
  var oResps = [];

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

  $(window).resize(function() {
    $(".divtextarea").each(function() {
      adjustHeight($(this));
    });
  });

  document.addEventListener("DOMContentLoaded", function(event) {
    if (localStorage.getItem("RGZPRMrefreshToken") !== null) {
      disappear($(".login-screen"), 500);
      setTimeout(function() {
        appear($(".loader"), 500);
        var data = 'refresh_token=' + encodeURIComponent(localStorage.getItem("RGZPRMrefreshToken")) + '&grant_type=refresh_token';
        $ajaxUtils.sendPostRequestWithData(
          apiRoot + 'token',
          function(response, status) {
            authObject = response;
            localStorage.setItem("RGZPRMrefreshToken", authObject.refresh_token);
            var cnt = 0;
            $ajaxUtils.sendGetRequest(
              apiRoot + 'api/Sluzbe',
              function(response, status) {
                offices = response;
                cnt = cnt + 1;
                if (cnt == 2)
                  PRM.signInAux();
              },
              true, authObject.access_token
            );
            $ajaxUtils.sendGetRequest(
              apiRoot + 'api/rgz_primedbe/get_statusi',
              function(response, status) {
                statuses = response;
                cnt = cnt + 1;
                if (cnt == 2)
                  PRM.signInAux();
              },
              true, authObject.access_token
            );
          },
          true, data, null
        );
      }, 500);
    }
  });

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
      var data = 'username=' + encodeURIComponent($("#username").val()) + '&password=' + encodeURIComponent($("#password").val()) + '&grant_type=password';
      $ajaxUtils.sendPostRequestWithData(
        apiRoot + 'token',
        function(response, status) {
          authObject = response;
          localStorage.setItem("RGZPRMrefreshToken", authObject.refresh_token);
          var cnt = 0;
          $ajaxUtils.sendGetRequest(
            apiRoot + 'api/Sluzbe',
            function(response, status) {
              offices = response;
              cnt = cnt + 1;
              if (cnt == 2)
                PRM.signInAux();
            },
            true, authObject.access_token
          );
          $ajaxUtils.sendGetRequest(
            apiRoot + 'api/rgz_primedbe/get_statusi',
            function(response, status) {
              statuses = response;
              cnt = cnt + 1;
              if (cnt == 2)
                PRM.signInAux();
            },
            true, authObject.access_token
          );
        },
        true, data, null
      );
    }, 500);
  };

  PRM.signInAux = function() {
    disappear($(".loader"), 500);
    setTimeout(function() {
      var html = `
        <header class="gone">
          <nav class="navbar navbar-toggleable-md">
            <button class="navbar-toggler navbar-toggler-right collapsed" type="button" data-toggle="collapse" data-target="#navbar-content" aria-controls="navbar-content" aria-expanded="false" aria-label="Toggle navigation">
              <i class="fa fa-bars"></i>
            </button>
            <div class="navbar-brand"></div>
            <div class="mobile-navi-helper mnh-1 hidden-lg-up"><i class="fa fa-ticket"></i></div>
            <div class="mobile-navi-helper mnh-2 hidden-lg-up gone"><i class="fa fa-bar-chart"></i></div>
            <div class="mobile-navi-helper mnh-3 hidden-lg-up gone"><i class="fa fa-user-circle-o"></i></div>
            <div class="collapse navbar-collapse" id="navbar-content">
              <ul class="navbar-nav ml-auto">
                <li class="nav-item active" onclick="$PRM.navi(1, this);">
                  <div class="nav-link"><i class="fa fa-ticket"></i>&nbsp;&nbsp;&nbsp;ПРИМЕДБЕ</div>
                </li>
                <li class="nav-item" onclick="$PRM.navi(2, this);">
                  <div class="nav-link"><i class="fa fa-bar-chart"></i>&nbsp;&nbsp;&nbsp;СТАТИСТИКА</div>
                </li>
                <li class="nav-item" onclick="$PRM.navi(3, this);">
                  <div class="nav-link"><i class="fa fa-user-circle-o"></i>&nbsp;&nbsp;&nbsp;ПРОФИЛ</div>
                </li>
              </ul>
            </div>
          </nav>
        </header>
        <div id="main-content" class="gone">
          <div class="loader">
            <div class="loader-inner"></div>
          </div>
          <div id="switchbox" class="gone">
          </div>
        </div>
      `;
      insertHtml("body", html);
      appear($("header, #main-content"), 500);
      setTimeout(function() {
        PRM.loadPage(1);
      }, 500);
    }, 500);
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

  var generateTableRowsHtml = function(response) {
    var html = '';
    for (var i = 0; i < response.Primedbe.length; i++) {
      var officeString = '';
      for (var j = 0; j < offices.length; j++)
        if (offices[j].Id == response.Primedbe[i].SluzbaId) {
          officeString = offices[j].Naziv;
          break;
        }
      var statusIcon = '';
      var statusClass = '';
      var statusString = '';
      var responseIcon = '';
      var responseClass = '';
      var responseString = '';
      switch (response.Primedbe[i].PoslednjiStatus) {
        case 'НЕПРОСЛЕЂЕН':
          statusIcon = '<i class="fa fa-inbox"></i>';
          statusClass = 'status-1';
          statusString = 'НЕПРОСЛЕЂЕН';
          responseString = 'НИЈЕ ОДГОВОРЕНО';
          break;
        case 'ПРОСЛЕЂЕН СЛУЖБИ':
          statusIcon = '<i class="fa fa-share"></i>';
          statusClass = 'status-2';
          statusString = 'ПРИМЕДБА ПРОСЛЕЂЕНА СЛУЖБИ';
          responseIcon = '<i class="fa fa-clock-o"></i>';
          responseClass = 'response-2';
          responseString = 'ЧЕКА СЕ ОДГОВОР СЛУЖБЕ';
          break;
        case 'НИЈЕ ОДГОВОРЕНО':
          statusIcon = '<i class="fa fa-share"></i>';
          statusClass = 'status-2';
          statusString = 'ПРИМЕДБА ПРОСЛЕЂЕНА СЛУЖБИ';
          responseIcon = '<i class="fa fa-times"></i>';
          responseClass = 'response-4';
          responseString = 'НИЈЕ ОДГОВОРЕНО У ПРЕДВИЂЕНОМ РОКУ';
          break;
        case 'ОДГОВОРЕНО':
          statusIcon = '<i class="fa fa-share"></i>';
          statusClass = 'status-2';
          statusString = 'ПРИМЕДБА ПРОСЛЕЂЕНА СЛУЖБИ';
          responseIcon = '<i class="fa fa-check"></i>';
          responseClass = 'response-3';
          responseString = 'ОДГОВОРЕНО';
          break;
        case 'ОДГОВОРЕНО КОРИСНИКУ':
          statusIcon = '<i class="fa fa-check"></i>';
          statusClass = 'status-3';
          statusString = 'ОДГОВОР ПОСЛАТ ГРАЂАНИНУ';
          responseIcon = '<i class="fa fa-check"></i>';
          responseClass = 'response-3';
          responseString = 'ОДГОВОРЕНО';
          break;
      }
      html += `
        <div class="table-row row" onclick="$PRM.tableRowClicked(` + (i + 1) + `, this);">
          <div class="col-2 col-md-1">` + response.Primedbe[i].Id + `</div>
          <div class="col-6 col-md-2">` + response.Primedbe[i].BrojPredmeta + `</div>
          <div class="col-3 hidden-sm-down">` + response.Primedbe[i].Ime + `</div>
          <div class="col-2 hidden-sm-down">` + officeString + `</div>
          <div class="col-2 hidden-sm-down">` + response.Primedbe[i].DatumPrijema.substring(8, 10) + '.' + response.Primedbe[i].DatumPrijema.substring(5, 7) + '.' + response.Primedbe[i].DatumPrijema.substring(0, 4) + '. ' + response.Primedbe[i].DatumPrijema.substring(11, 13) + ':' + response.Primedbe[i].DatumPrijema.substring(14, 16) + `</div>
          <div class="col-2 col-md-1 ` + statusClass + `">` + statusIcon + `</div>
          <div class="col-2 col-md-1 ` + responseClass + `">` + responseIcon + `</div>
        </div>
        <div id="expansion-` + (i + 1) + `" class="expansion collapse">
          <div class="row">
            <div class="expansion-info col-12 col-md-6">
              <div class="expansion-label">бр. предмета:</div>
              <div class="expansion-info-data">` + response.Primedbe[i].BrojPredmeta + `</div>
              <div class="expansion-label">датум:</div>
              <div class="expansion-info-data">` + response.Primedbe[i].DatumPrijema.substring(8, 10) + '.' + response.Primedbe[i].DatumPrijema.substring(5, 7) + '.' + response.Primedbe[i].DatumPrijema.substring(0, 4) + '. ' + response.Primedbe[i].DatumPrijema.substring(11, 13) + ':' + response.Primedbe[i].DatumPrijema.substring(14, 16) + `</div>
              <div class="expansion-label">име и презиме:</div>
              <div class="expansion-info-data">` + response.Primedbe[i].Ime + `</div>
              <div class="expansion-label">e-mail:</div>
              <div class="expansion-info-data">` + response.Primedbe[i].Email + `</div>
              <div class="expansion-label">телефон:</div>
              <div class="expansion-info-data">` + response.Primedbe[i].Telefon + `</div>
              <div class="expansion-label">служба:</div>
              <div class="expansion-info-data">` + officeString + `</div>
              <div class="expansion-label">претходно обраћање:</div>
              <div class="expansion-info-data">` + (response.Primedbe[i].ObracanjeSluzbi ? `ДА` : `НЕ`) + `</div>` +
              (response.Primedbe[i].ObracanjeSluzbi && response.Primedbe[i].ObracanjeKome != null ? `<div class="expansion-label">службеник:</div>
              <div class="expansion-info-data">` + response.Primedbe[i].ObracanjeKome + `</div>` : ``) + `
              <div class="expansion-label">статус:</div>
              <div class="expansion-info-data">` + statusString + `</div>
              <div class="expansion-label">одговор:</div>
              <div class="expansion-info-data">` + responseString + `</div>
              <div class="expansion-label">историја статуса:</div>
              <div class="expansion-info-data">
      `;
      cComment = null;
      oComment = null;
      oResponse = response.Primedbe[i].Odgovor.length != 0 ? response.Primedbe[i].Odgovor[response.Primedbe[i].Odgovor.length - 1].Odgovor1.replace(/\n/g, "<br>") : '';
      for (var j = 1; j < response.Primedbe[i].Logovi.length; j++) {
        var logStatusString = '';
        var logResponseString = '';
        switch (response.Primedbe[i].Logovi[j].Status) {
          case 'НЕПРОСЛЕЂЕН':
            logStatusString = 'НЕПРОСЛЕЂЕН';
            logResponseString = 'НИЈЕ ОДГОВОРЕНО';
            break;
          case 'ПРОСЛЕЂЕН СЛУЖБИ':
            logStatusString = 'ПРИМЕДБА ПРОСЛЕЂЕНА СЛУЖБИ';
            logResponseString = 'ЧЕКА СЕ ОДГОВОР СЛУЖБЕ';
            break;
          case 'НИЈЕ ОДГОВОРЕНО':
            logStatusString = 'ПРИМЕДБА ПРОСЛЕЂЕНА СЛУЖБИ';
            logResponseString = 'НИЈЕ ОДГОВОРЕНО У ПРЕДВИЂЕНОМ РОКУ';
            break;
          case 'ОДГОВОРЕНО':
            logStatusString = 'ПРИМЕДБА ПРОСЛЕЂЕНА СЛУЖБИ';
            logResponseString = 'ОДГОВОРЕНО';
            break;
          case 'ОДГОВОРЕНО КОРИСНИКУ':
            logStatusString = 'ОДГОВОР ПОСЛАТ ГРАЂАНИНУ';
            logResponseString = 'ОДГОВОРЕНО';
            break;
        }
        html += '&bull; <span style="color: #CC5505 !important; font-weight: 700">' + response.Primedbe[i].Logovi[j].Datum.substring(8, 10) + '.' + response.Primedbe[i].Logovi[j].Datum.substring(5, 7) + '.' + response.Primedbe[i].Logovi[j].Datum.substring(0, 4) + '. ' + response.Primedbe[i].Logovi[j].Datum.substring(11, 13) + ':' + response.Primedbe[i].Logovi[j].Datum.substring(14, 16) + '</span> &bull; ' + (response.Primedbe[i].Logovi[j].Sluzbenik != 'servis' ? (response.Primedbe[i].Logovi[j].sluzbenikSluzba == control ? 'контролор ' : 'оператер ') + response.Primedbe[i].Logovi[j].Sluzbenik + ' променио/-ла статус и стање одговора у ' + logStatusString + ' / ' + logResponseString : 'статус и стање одговора аутоматски промењени на ' + logStatusString + ' / ' + logResponseString);
        if (response.Primedbe[i].Logovi[j].Komentar != null && response.Primedbe[i].Logovi[j].Komentar != "") {
          html += ' уз коментар \"' + response.Primedbe[i].Logovi[j].Komentar.replace(/\n/g, " ") + '\"';
          if (response.Primedbe[i].Logovi[j].sluzbenikSluzba == control)
            cComment = response.Primedbe[i].Logovi[j].Komentar.replace(/\n/g, "<br>");
          else
            oComment = response.Primedbe[i].Logovi[j].Komentar.replace(/\n/g, "<br>");
        }
        html += '<br>';
      }
      cComms[i] = cComment ? cComment : '';
      oComms[i] = oComment ? oComment : '';
      oResps[i] = oResponse;
      html += `
              </div>
              <div class="expansion-label">историја одговора:</div>
              <div class="expansion-info-data">
      `;
      for (var j = 0; j < response.Primedbe[i].Odgovor.length; j++)
        html += '&bull; <span style="color: #CC5505 !important; font-weight: 700">' + response.Primedbe[i].Odgovor[j].DatumOdgovora.substring(8, 10) + '.' + response.Primedbe[i].Odgovor[j].DatumOdgovora.substring(5, 7) + '.' + response.Primedbe[i].Odgovor[j].DatumOdgovora.substring(0, 4) + '. ' + response.Primedbe[i].Odgovor[j].DatumOdgovora.substring(11, 13) + ':' + response.Primedbe[i].Odgovor[j].DatumOdgovora.substring(14, 16) + '</span> &bull; ' + (response.Primedbe[i].Odgovor[j].SluzbaId == 1 ? 'контролор ' : 'оператер ') + response.Primedbe[i].Odgovor[j].Sluzbenik + ' променио/-ла одговор у \"' + response.Primedbe[i].Odgovor[j].Odgovor1.replace(/\n/g, " ") + '\"<br>';
      html += `
              </div>
            </div>
            <div class="expansion-response col-12 col-md-6">
      `;
      if (authObject.sluzba == control && response.Primedbe[i].PoslednjiStatus != statuses[4]) {
        html += `
              <div id="forward-label" class="expansion-label">прослеђивање:</div>
              <div id="forward-container" class="row">
                <div id="forward-select-container" class="col-12 col-md-9">
                  <select id="forward" onchange="$PRM.expansionSelectChanged(this);">
                      <!--<option value="0" disabled selected hidden>СКН</option>-->
        `;
        for (var j = 0; j < offices.length; j++) {
          var tempArray = response.Primedbe[i].Logovi.filter(e => e.SluzbaId != 1);
          var tempCheck = response.Primedbe[i].PoslednjiStatus != 'НЕПРОСЛЕЂЕН' && tempArray[tempArray.length - 1].SluzbaId == offices[j].Id || response.Primedbe[i].PoslednjiStatus == 'НЕПРОСЛЕЂЕН' && response.Primedbe[i].SluzbaId == offices[j].Id;
          html += `<option value="` + offices[j].Id + `" ` + ((tempCheck) ? `selected` : ``) + `>` + offices[j].Naziv + `</option>`;
          //html += `<option value="` + offices[j].Id + `" ` + ((response.Primedbe[i].PoslednjiStatus != 'НЕПРОСЛЕЂЕН' && /*response.Primedbe[i].SluzbaId == offices[j].Id*/ response.Primedbe[i].Logovi[response.Primedbe[i].Logovi.length - 1].SluzbaId == offices[j].Id)? `selected` : ``) + `>` + offices[j].Naziv + `</option>`;
        }
        html += `
                  </select>
                </div>
                <div id="forward-button-container" class="col-12 col-md-3">
                  <div class="loader gone">
                    <div class="loader-inner"></div>
                  </div>
                  <button onclick="$PRM.forward(` + response.Primedbe[i].Id + `, this);"><i class="fa fa-share"></i></button>
                </div>
              </div>
        `;
      }
      html += `
              <div class="expansion-label">примедба:</div>
              <textarea class="divtextarea" spellcheck="false" readonly>` + response.Primedbe[i].OpisPrimedbe + `</textarea>
              <div class="expansion-label">коментар контролора:</div>
              <textarea id="controller-comment" oninput="$PRM.crChanged(1, ` + i + `, this);" onblur="$PRM.crChanged(1, ` + i + `, this);" rows="1" class="divtextarea" ` + (authObject.sluzba == control && response.Primedbe[i].PoslednjiStatus != statuses[4] ? `` : `readonly`) + ` spellcheck="false">` + (cComment != null && cComment != '' ? cComment : '') + `</textarea>
              <div class="expansion-label">коментар службеника:</div>
              <textarea id="office-comment" oninput="$PRM.crChanged(2, ` + i + `, this);" onblur="$PRM.crChanged(2, ` + i + `, this);" rows="1" class="divtextarea" ` + (authObject.sluzba == control || response.Primedbe[i].PoslednjiStatus == statuses[3] || response.Primedbe[i].PoslednjiStatus == statuses[4] ? `readonly` : ``) + ` spellcheck="false">` + (oComment != null && oComment != '' ? oComment : '') + `</textarea>
              <div class="expansion-label">одговор службе:</div>
              <textarea id="office-response" oninput="$PRM.crChanged(3, ` + i + `, this);" onblur="$PRM.crChanged(3, ` + i + `, this);" rows="1" class="divtextarea" ` + (authObject.sluzba == control && response.Primedbe[i].PoslednjiStatus == statuses[3] || authObject.sluzba != control && (response.Primedbe[i].PoslednjiStatus == statuses[1] || response.Primedbe[i].PoslednjiStatus == statuses[2]) ? `` : `readonly`) + ` spellcheck="false">` + oResponse + `</textarea>
              ` + (authObject.sluzba != control && response.Primedbe[i].PoslednjiStatus == statuses[3] || response.Primedbe[i].PoslednjiStatus == statuses[4] ? `` : `
              <div class="row">
                <div class="hidden-sm-down col-md-9"></div>
                <div id="save-button-container" class="col-12 col-md-3">
                  <div class="loader gone">
                    <div class="loader-inner"></div>
                  </div>
                  <button onclick="$PRM.save(` + response.Primedbe[i].Id + `, this, ` + i + `);"><i class="fa fa-save"></i></button>
                </div>
              </div>
              <div class="row">
                <div class="hidden-sm-down col-md-9"></div>
                <div id="check-button-container" class="col-12 col-md-3">
                  <div class="loader gone">
                    <div class="loader-inner"></div>
                  </div>
                  <button onclick="$PRM.check(` + response.Primedbe[i].Id + `, this, ` + i + `);"><i class="fa fa-check"></i></button>
                </div>
              </div>
              `) + `
            </div>
          </div>
        </div>
      `;
    }
    return html;
  };

  var processComplaints = function(response, pageNum) {
    var html = `
      <div id="searchbar" class="row hidden-md-down">
      <div id="search-criteria" class="col-11">
        <img src="img/favicons/favicon.ico" onload="$PRM.dateInit();">
        <div class="col-ninth"><input id="file-number" class="file-number" type="text" placeholder="бр. предмета" onfocus="this.placeholder = ''" onblur="this.placeholder = 'бр. предмета'" onkeyup="$PRM.searchbarInputChanged(this);"></div>
        <div class="col-ninth"><input id="date-from" class="date-from" type="text" placeholder="датум од" onfocus="this.placeholder = ''" onblur="this.placeholder = 'датум од'" onkeydown="return false" onchange="$PRM.dateFromChanged(this);"></div>
        <div class="col-ninth"><input id="date-to" class="date-to" type="text" placeholder="датум до" onfocus="this.placeholder = ''" onblur="this.placeholder = 'датум до'" onkeydown="return false" onchange="$PRM.dateToChanged(this);"></div>
        <div class="col-ninth ` + (authObject.sluzba == control ? "" : "col-ninth-double") + `"><input id="client-name" class="client-name" type="text" placeholder="име и презиме" onfocus="this.placeholder = ''" onblur="this.placeholder = 'име и презиме'" onkeyup="$PRM.searchbarInputChanged(this);"></div>
        <div class="col-ninth"><input id="client-mail" class="client-mail" type="text" placeholder="e-mail" onfocus="this.placeholder = ''" onblur="this.placeholder = 'e-mail'" onkeyup="$PRM.searchbarInputChanged(this);"></div>
        <div class="col-ninth"><input id="client-phone" class="client-phone" type="text" placeholder="телефон" onfocus="this.placeholder = ''" onblur="this.placeholder = 'телефон'" onkeyup="$PRM.searchbarInputChanged(this);"></div>
      `;
      if (authObject.sluzba == control) {
        html += `
          <div class="col-ninth">
            <select id="office" class="office" onchange="$PRM.searchbarSelectChanged(this);">
                <option value="0" disabled selected hidden>служба</option>
        `;
        for (var i = 0; i < offices.length; i++)
          html += `<option value="` + offices[i].Id + `">` + offices[i].Naziv + `</option>`;
        html += `
            </select>
          </div>
        `;
      }
      html += `
        <div class="col-ninth col-ninth-double">
          <select id="status" class="status" onchange="$PRM.searchbarSelectChanged(this);">
              <option value="0" disabled selected hidden>статус / одговор</option>
              <option value="НЕПРОСЛЕЂЕН">НЕПРОСЛЕЂЕНИ</option>
              <option value="ПРОСЛЕЂЕН СЛУЖБИ">ПРОСЛЕЂЕНИ / НА ЧЕКАЊУ</option>
              <option value="НИЈЕ ОДГОВОРЕНО">ПРОСЛЕЂЕНИ / НИЈЕ ОДГОВОРЕНО</option>
              <option value="ОДГОВОРЕНО">ПРОСЛЕЂЕНИ / ОДГОВОРЕНО</option>
              <option value="ОДГОВОРЕНО КОРИСНИКУ">ОДГОВОР ПОСЛАТ ГРАЂАНИНУ / ОДГОВОРЕНО</option>
            </select>
        </div>
        <div class="col-outertwelvthhalf">
          <button id="clear-searchboxes" onclick="$PRM.clearRefreshButtonClicked();"><i class="fa fa-times"></i></button>
        </div>
      </div>
      <div id="two-buttons" class="col-11">
        <div class="col-outertwelvth">
          <button id="print" onclick="$PRM.print();"><i class="fa fa-print"></i></button>
        </div>
        <div class="col-outertwelvth">
          <button id="refresh" onclick="$PRM.refresh();"><i class="fa fa-refresh"></i></button>
        </div>
      </div>
      <div id="search-button-container" class="col-1">
        <button id="search" onclick="$PRM.searchButtonClicked();"><i class="fa fa-search"></i></button>
      </div>
    </div>
    <div id="searchbar" class="row hidden-lg-up">
      <div id="mobile-buttons-container" class="row">
        <div class="col-4 col-md-6"></div>
        <div id="mobile-refresh-clear-button-container" class="col-4 col-md-3">
          <button id="mobile-refresh-clear" onclick="$PRM.clearRefreshButtonClicked();"><i class="fa fa-refresh"></i></button>
        </div>
        <div id="mobile-search-button-container" class="col-4 col-md-3">
          <button id="mobile-search" onclick="$PRM.searchButtonClicked();"><i class="fa fa-search"></i></button>
        </div>
      </div>
      <div id="mobile-searchboxes" class="collapse row">
        <div class="col-12"><input id="file-number" class="file-number" type="text" placeholder="бр. предмета" onfocus="this.placeholder = ''" onblur="this.placeholder = 'бр. предмета'" onkeyup="$PRM.searchbarInputChanged(this);"></div>
        <div class="col-12 col-md-6"><input id="date-from" class="date-from" type="text" placeholder="датум од" onfocus="this.placeholder = ''" onblur="this.placeholder = 'датум од'" onkeydown="return false" onchange="$PRM.dateFromChanged(this);"></div>
        <div class="col-12 col-md-6"><input id="date-to" class="date-to" type="text" placeholder="датум до" onfocus="this.placeholder = ''" onblur="this.placeholder = 'датум до'" onkeydown="return false" onchange="$PRM.dateToChanged(this);"></div>
        <div class="col-12 col-md-6"><input id="client-name" class="client-name" type="text" placeholder="име и презиме" onfocus="this.placeholder = ''" onblur="this.placeholder = 'име и презиме'" onkeyup="$PRM.searchbarInputChanged(this);"></div>
        <div class="col-12 col-md-6"><input id="client-mail" class="client-mail" type="text" placeholder="e-mail" onfocus="this.placeholder = ''" onblur="this.placeholder = 'e-mail'" onkeyup="$PRM.searchbarInputChanged(this);"></div>
        <div class="col-12 col-md-6"><input id="client-phone" class="client-phone" type="text" placeholder="телефон" onfocus="this.placeholder = ''" onblur="this.placeholder = 'телефон'" onkeyup="$PRM.searchbarInputChanged(this);"></div>
        `;
        if (authObject.sluzba == control) {
          html += `
            <div class="col-12 col-md-6">
              <select id="office" class="office" onchange="$PRM.searchbarSelectChanged(this);">
                  <option value="0" disabled selected hidden>служба</option>
          `;
          for (var i = 0; i < offices.length; i++)
            html += `<option value="` + offices[i].Id + `">` + offices[i].Naziv + `</option>`;
          html += `
              </select>
            </div>
          `;
        }
        html += `
        <div class="col-12 col-md-6">
          <select id="status" class="status" onchange="$PRM.searchbarSelectChanged(this);">
            <option value="0" disabled selected hidden>статус / одговор</option>
            <option value="НЕПРОСЛЕЂЕН">НЕПРОСЛЕЂЕНИ</option>
            <option value="ПРОСЛЕЂЕН СЛУЖБИ">ПРОСЛЕЂЕНИ / НА ЧЕКАЊУ</option>
            <option value="НИЈЕ ОДГОВОРЕНО">ПРОСЛЕЂЕНИ / НИЈЕ ОДГОВОРЕНО</option>
            <option value="ОДГОВОРЕНО">ПРОСЛЕЂЕНИ / ОДГОВОРЕНО</option>
            <option value="ОДГОВОРЕНО КОРИСНИКУ">ОДГОВОР ПОСЛАТ ГРАЂАНИНУ / ОДГОВОРЕНО</option>
          </select>
        </div>
      </div>
    </div>
    <div id="table">
      <div id="table-header" class="row">
        <div class="col-2 col-md-1">р.б.</div>
        <div class="col-6 col-md-2">бр. предмета</div>
        <div class="col-3 hidden-sm-down">име и презиме</div>
        <div class="col-2 hidden-sm-down">служба</div>
        <div class="col-2 hidden-sm-down">датум</div>
        <div class="col-2 col-md-1"><span class="hidden-sm-down">статус</span><i class="hidden-md-up fa fa-info-circle"></i></div>
        <div class="col-2 col-md-1"><span class="hidden-sm-down">одговор</span><i class="hidden-md-up fa fa-comments"></i></div>
      </div>
    `;
    html += generateTableRowsHtml(response);
    html += `
      </div>
      <div id="pagination">
        <div>
          <div onclick="$PRM.firstPage(this);" class="pagination-disabled"><i class="fa fa-angle-double-left"></i></div>
          <div onclick="$PRM.previousPage(this);" class="pagination-disabled"><i class="fa fa-angle-left"></i></div>
          <div>
            <select id="page-select" onchange="$PRM.selectPage();" onclick="$PRM.promptDirty();">
    `;
    for (var i = 0; i < (response.UkupnoPrimedbi < 10 ? 1 : Math.ceil(response.UkupnoPrimedbi / 10)); i++)
      html += `<option value="` + (i + 1) + `" ` + (i == 0 ? `selected` : ``) + `>` + (i + 1) + `</option>`;
    html += `
            </select>
          </div>
          <div onclick="$PRM.nextPage(this);" ` + (response.UkupnoPrimedbi < 10 ? `class="pagination-disabled"` : ``) + `><i class="fa fa-angle-right"></i></div>
          <div onclick="$PRM.lastPage(this);" ` + (response.UkupnoPrimedbi < 10 ? `class="pagination-disabled"` : ``) + `><i class="fa fa-angle-double-right"></i></div>
        </div>
      </div>
    `;
    insertHtml("#switchbox", html);
    disappear($(".loader"), 500);
    appear($("#switchbox"), 500);
  };

  PRM.loadPage = function(n) {
    disappear($("#switchbox"), 500);
    if (n == 1) {
      appear($(".loader"), 500);
      setTimeout(function() {
        $ajaxUtils.sendGetRequest(
          apiRoot + 'api/rgz_primedbe/get' + '?page=1',
          function(response, status) {
            processComplaints(response, 1);
          },
          true, authObject.access_token
        );
      }, 510);
    } else if (n == 2) {
      setTimeout(function() {
        var html = `
          <div class="row" id="statsparams">
            <img src="img/favicons/favicon.ico" onload="$PRM.statsDateInit();">
            ` + (authObject.sluzba == control ? `<div class="col-7 hidden-md-down"></div>` : `<div class="col-9 hidden-md-down"></div>`) + `
            <div class="col-8 col-md-9 hidden-lg-up"></div>
            <div class="col-4 col-md-3 hidden-lg-up"><button id="search" onclick="$PRM.statsSearchButtonClicked();"><i class="fa fa-search"></i></button></div>
            <div class="col-12 col-md-6 col-lg-1"><input id="stats-date-from" class="stats-date-from" type="text" placeholder="датум од" onfocus="this.placeholder = ''" onblur="this.placeholder = 'датум од'" onkeydown="return false" onchange="$PRM.statsDateFromChanged(this);"></div>
            <div class="col-12 col-md-6 col-lg-1"><input id="stats-date-to" class="stats-date-to" type="text" placeholder="датум до" onfocus="this.placeholder = ''" onblur="this.placeholder = 'датум до'" onkeydown="return false" onchange="$PRM.statsDateToChanged(this);"></div>
            ` + (authObject.sluzba == control ? `<div class="col-12 col-lg-2"><input id="stats-offices" class="stats-offices" type="text" placeholder="службе" onfocus="this.placeholder = ''" onblur="this.placeholder = 'службе'" onkeydown="return false" onclick="$PRM.statsOfficesClicked();"></div>` : ``) + `
            <div class="col-1 hidden-md-down"><button id="search" onclick="$PRM.statsSearchButtonClicked();"><i class="fa fa-search"></i></button></div>
          </div>
          <div class="row" id="statsdata"></div>
        `;
        insertHtml("#switchbox", html);
        appear($("#switchbox"), 500);
      }, 510);
    } else if (n == 3) {
      setTimeout(function() {
        var html = `
          <div id="profile-picture"><i class="fa fa-user-circle-o"></i></div>
          <div id="profile-name">` + authObject.name + `</div>
          <div id="profile-position">` + (authObject.sluzba == control ? 'КОНТРОЛОР' : 'СЛУЖБЕНИК') + `</div>
          <div id="profile-container" class="row">
            <div class="col-2 col-md-4"></div>
            <div id="profile-content" class="col-8 col-md-4">
              <!--<div id="new-password-container"><input id="new-password" type="password" placeholder="нова лозинка" onfocus="this.placeholder = ''" onblur="this.placeholder = 'нова лозинка'"></div>
              <div id="change-password-container">
                <div class="loader gone">
                  <div class="loader-inner"></div>
                </div>
                <button id="change-password-button" onclick="$PRM.changePassword();" onkeydown="if (event.keyCode == 13) $PRM.changePassword();"><i class="fa fa-key"></i>&nbsp;&nbsp;&nbsp;ПРОМЕНИ</button>
              </div>-->
              <div id="logout-container"><button id="logout-button" onclick="$PRM.signOut();"><i class="fa fa-sign-out"></i>&nbsp;&nbsp;&nbsp;ОДЈАВА</button></div>
            </div>
            <div class="col-2 col-md-4"></div>
          </div>
        `;
        insertHtml("#switchbox", html);
        appear($("#switchbox"), 500);
      }, 510);
    }
  };

  var adjustHeight = function(e) {
    $(e).css("height", 0);
    $(e).css("height", Math.ceil(Math.max(window.innerHeight * 0.07, $(e).prop("scrollHeight")) + window.innerHeight * 0.005) + "px");
  };

  PRM.crChanged = function(type, i, e) {
    var ref = type == 1 ? cComms : type == 2 ? oComms : oResps;
    if ($(e).val() != ref[i])
      $(e).addClass('dirty');
    else
      $(e).removeClass('dirty');
    adjustHeight($(e));
  };

  PRM.statsSearchButtonClicked = function() {
    if ($("#stats-date-from").val() == "" || $("#stats-date-to").val() == "" || $("#stats-offices").val() == "" && authObject.sluzba == control) {
      $.confirm({
        title: 'ГРЕШКА!',
        content: 'Морате унети све параметре за претрагу.',
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
    appear($(".loader"), 500);
    disappear($("#statsdata"), 500);
    var dateFrom = $('#stats-date-from').datepicker('getDate');
    var dateTo = $('#stats-date-to').datepicker('getDate');
    $ajaxUtils.sendGetRequest(
      apiRoot + 'api/statistika/get' + '?pocetak=' + encodeURIComponent(dateFrom.getFullYear() + '-' + (dateFrom.getMonth() + 1) + '-' + dateFrom.getDate() + ' 00:00:00') + '&kraj=' + encodeURIComponent(dateTo.getFullYear() + '-' + (dateTo.getMonth() + 1) + '-' + dateTo.getDate() + ' 00:00:00') + (authObject.sluzba == control ? '&sluzbe=' + encodeURIComponent(officesArray) : ''),
      function(response, status) {
        disappear($(".loader"), 500);

        setTimeout(function() {
          var tempStats = [];
          response.forEach(function(e) {
            tempStats = tempStats.concat(e.Statistika);
          });

          var total = 0;
          var status1 = 0;
          var status2 = 0;
          var status3 = 0;
          var status4 = 0;
          var status5 = 0;
          var multiple = 0;

          tempStats.forEach(function(e) {
            total += e.Broj;
            switch(e.Status) {
              case statuses[0]:
                status1 += e.Broj;
                break;
              case statuses[1]:
                status2 += e.Broj;
                break;
              case statuses[2]:
                status3 += e.Broj;
                break;
              case statuses[3]:
                status4 += e.Broj;
                break;
              case statuses[4]:
                status5 += e.Broj;
                break;
            }
          });

          response.forEach(function(e) {
            multiple += e.VisestrukePrimedbe != null || e.VisestrukePrimedbe != undefined ? e.VisestrukePrimedbe.Broj : 0;
          });

          var html = `
            <div class="col-12" id="statstitle">Статистика за ` + (authObject.sluzba != control ? authObject.sluzba : (officesArray.length == 1 ? $('#stats-offices').val() : `одабране СКН`)) + ` за период од ` + $('#stats-date-from').val() + ` до ` + $('#stats-date-to').val() + `</div>
            <div class="col-lg-6 col-12" id="chart">
              <div id="chart-inner"></div>
            </div>
            <div class="col-lg-6 col-12" id="stats">
              <div class="stat row unforwarded">
                <div class="col-9 col-sm-10 stat-toc">Непрослеђених:&nbsp;............................................................................................................................................................................................................................................................................................................................................................................................................
                  <div class="stat-num stat-blue">` + status1 + `</div>
                </div>
                <div class="col-3 col-sm-2 stat-desc">(` + (100 * status1 / total).toFixed(2) + `%)</div>
              </div>
              <div class="stat row pending">
                <div class="col-9 col-sm-10 stat-toc">На&nbsp;чекању:&nbsp;............................................................................................................................................................................................................................................................................................................................................................................................................
                  <div class="stat-num stat-yellow">` + status2 + `</div>
                </div>
                <div class="col-3 col-sm-2 stat-desc">(` + (100 * status2 / total).toFixed(2) + `%)</div>
              </div>
              <div class="stat row noreply">
                <div class="col-9 col-sm-10 stat-toc">Без&nbsp;одговора:&nbsp;............................................................................................................................................................................................................................................................................................................................................................................................................
                  <div class="stat-num stat-red">` + status3 + `</div>
                </div>
                <div class="col-3 col-sm-2 stat-desc">(` + (100 * status3 / total).toFixed(2) + `%)</div>
              </div>
              <div class="stat row answered">
                <div class="col-9 col-sm-10 stat-toc">Одговорено:&nbsp;............................................................................................................................................................................................................................................................................................................................................................................................................
                  <div class="stat-num stat-darkgreen">` + status4 + `</div>
                </div>
                <div class="col-3 col-sm-2 stat-desc">(` + (100 * status4 / total).toFixed(2) + `%)</div>
              </div>
              <div class="stat row closed">
                <div class="col-9 col-sm-10 stat-toc">Послато&nbsp;грађанину:&nbsp;............................................................................................................................................................................................................................................................................................................................................................................................................
                  <div class="stat-num stat-green">` + status5 + `</div>
                </div>
                <div class="col-3 col-sm-2 stat-desc">(` + (100 * status5 / total).toFixed(2) + `%)</div>
              </div>
              <div class="totaldouble" style="margin: 3vh 0 2vh 0; border-top: 2px solid #CC5505"></div>
              <div class="stat row totaldouble">
                <div class="col-9 col-sm-10 stat-toc">Укупно:&nbsp;............................................................................................................................................................................................................................................................................................................................................................................................................
                  <div class="stat-num stat-orange">` + total + `</div>
                </div>
                <div class="col-3 col-sm-2 stat-desc">(100.00%)</div>
              </div>
              <div class="stat row totaldouble">
                <div class="col-9 col-sm-10 stat-toc">Вишеструко&nbsp;прослеђених:&nbsp;............................................................................................................................................................................................................................................................................................................................................................................................................
                  <div class="stat-num stat-white">` + multiple + `</div>
                </div>
                <div class="col-3 col-sm-2 stat-desc">(` + (100 * multiple / total).toFixed(2) + `%)</div>
              </div>
            </div>
          `;
          insertHtml("#statsdata", html);
          $(".stat, .totaldouble").css({"opacity": "0", "transition": "opacity 0.45s ease"});
          $(".unforwarded").css({"opacity": "1"});
          setTimeout(function() {
            $(".pending").css({"opacity": "1"});
          }, 500);
          setTimeout(function() {
            $(".noreply").css({"opacity": "1"});
          }, 1000);
          setTimeout(function() {
            $(".answered").css({"opacity": "1"});
          }, 1500);
          setTimeout(function() {
            $(".closed").css({"opacity": "1"});
          }, 2000);
          setTimeout(function() {
            $(".totaldouble").css({"opacity": "1"});
          }, 2500);

          var chart = new Chartist.Pie("#chart", {
            series: [status1, status2, status3, status4, status5],
            labels: [0, 0, 0, 0, 0]
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
          var chartInner = new Chartist.Pie("#chart-inner", {
            series: [0, 0, 0, 0, 0, total - multiple, multiple],
            labels: [0, 0, 0, 0, 0, 0, 0]
          }, {
            donut: true,
            showLabel: false
          });
          chartInner.on('draw', function(data) {
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
          appear($("#statsdata"), 500);
        }, 500);
      },
      true, authObject.access_token
    );
  };

  PRM.statsOfficesClicked = function() {
    var html = `
      <div class="offices-picker">
        <button class="offices-picker-all" onclick="$PRM.officesAllClicked();">ОДАБЕРИ&nbsp;СВЕ&nbsp;СКН</button>
        <div class="offices-picker-list row">
    `;
    for(var i = 0; i < offices.length; i++)
      html += `<div class="col-12 col-md-6 col-lg-3"><div value="` + offices[i].Id + `" onclick="$PRM.officeItemClicked(` + offices[i].Id + `, this);">` + offices[i].Naziv + `</div></div>`;
    html += `
        </div>
        <button onclick="$PRM.officesConfirm();">ОК</button>
      </div>
    `;
    $("body").append(html);
    setTimeout(function() {
      $(".offices-picker").css({"opacity": "1"});
      if (officesArray.length > 0) {
        $(".offices-picker-list>div>div").each(function() {
          if (officesArray.indexOf(Number($(this).attr("value"))) != -1) {
            $(this).toggleClass("checked", true);
          }
        });
      }
      if ($(".offices-picker-list>div>div").length == $(".offices-picker-list>div>.checked").length) {
        $(".offices-picker-all").toggleClass("checked", true);
      }
    }, 20);
  };

  PRM.officesConfirm = function() {
    $(".offices-picker").css({"opacity": "0"});
    setTimeout(function() {
      var officesTemp = '';
      for (var i = 0; i < officesArray.length; i++)
        for (var j = 0; j < offices.length; j++)
          if (officesArray[i] == offices[j].Id) {
            officesTemp += offices[j].Naziv + (i == officesArray.length - 1 ? '' : ', ');
            break;
          }
      $("#stats-offices").val(officesTemp);
      $(".offices-picker").remove();
    }, 400);
  };

  PRM.officeItemClicked = function(id, e) {
    $(e).toggleClass("checked");
    if ($(e).hasClass("checked")) {
      officesArray.push(id);
      if ($(".offices-picker-list>div>div").length == $(".offices-picker-list>div>.checked").length)
        $(".offices-picker-all").toggleClass("checked", true);
    } else {
      officesArray.splice(officesArray.indexOf(id), 1);
      $(".offices-picker-all").toggleClass("checked", false);
    }
  };

  PRM.officesAllClicked = function() {
    $(".offices-picker-all").toggleClass("checked");
    $(".offices-picker-list>div>div").toggleClass("checked", $(".offices-picker-all").hasClass("checked"));
    officesArray = [];
    if ($(".offices-picker-all").hasClass("checked")) {
      $(".offices-picker-list>div>div").each(function() {
        officesArray.push(Number($(this).attr("value")));
      });
    }
  };

  PRM.searchbarInputChanged = function(e) {
    if ($(e).val() != "") {
      $("#clear-searchboxes i, #mobile-refresh-clear i").addClass("fa-eraser").removeClass("fa-times");
      $("." + $(e).attr("class")).val($(e).val());
    } else if ($("#file-number").val() == "" && $("#date-from").val() == "" && $("#date-to").val() == "" && $("#client-name").val() == "" && $("#client-mail").val() == "" && $("#client-phone").val() == "" && $("#office option:selected").attr("value") == 0 && $("#status option:selected").attr("value") == 0 /*&& $("#response option:selected").attr("value") == 0*/)
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
      if ($("#file-number").val() == "" && $("#date-from").val() == "" && $("#date-to").val() == "" && $("#client-name").val() == "" && $("#client-mail").val() == "" && $("#client-phone").val() == "" && $("#office option:selected").attr("value") == 0 && $("#status option:selected").attr("value") == 0 /*&& $("#response option:selected").attr("value") == 0*/)
        $("#mobile-refresh-clear i").addClass("fa-times");
      else
        $("#mobile-refresh-clear i").addClass("fa-eraser");
    } else if ($("#search-criteria").width() >= (window.innerWidth - window.innerHeight / 100) * 11 / 12 - 20) {
      if ($("#file-number").val() == "" && $("#date-from").val() == "" && $("#date-to").val() == "" && $("#client-name").val() == "" && $("#client-mail").val() == "" && $("#client-phone").val() == "" && $("#office option:selected").attr("value") == 0 && $("#status option:selected").attr("value") == 0 /*&& $("#response option:selected").attr("value") == 0*/) {
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
      
      PRM.refresh();
    }
  };

  PRM.clearRefreshButtonClicked = function() {
    if ($("#mobile-refresh-clear i").hasClass("fa-spin")) return;
    if ($("#mobile-refresh-clear i").hasClass("fa-refresh")) {
      PRM.refresh();
    } else if ($("#clear-searchboxes i").hasClass("fa-eraser") || $("#mobile-refresh-clear i").hasClass("fa-eraser")) {
      $("#searchbar input").val("");
      $("#searchbar option").prop("selected", false);
      $("#searchbar option:first-child").prop("selected", true);
      $("#searchbar select").css({
        "color": "#777"
      });
      $(".date-from, .date-to").datepicker('update', '');
      $(".date-from, .date-to").datepicker('setEndDate', '0d');
      $(".date-from, .date-to").datepicker('setStartDate', '');
      $("#clear-searchboxes i, #mobile-refresh-clear i").removeClass("fa-eraser").addClass("fa-times");
    } else if ($("#clear-searchboxes i").hasClass("fa-times") || $("#mobile-refresh-clear i").hasClass("fa-times")) {
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
      $("#mobile-refresh-clear i").removeClass("fa-times").addClass("fa-refresh");
    }
  };

  PRM.tableRowClicked = function(n, e) {
    if ($(e).hasClass("expanded")) {
      $(e).removeClass("expanded");
      $("#expansion-" + n).collapse('hide');
    } else {
      $(e).addClass("expanded");
      $("#expansion-" + n).collapse('show');
      $("#expansion-" + n + " .divtextarea").each(function() {
        adjustHeight($(this));
      });
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
        content: 'Морате изабрати службу којој се примедба прослеђује.',
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
        $ajaxUtils.sendPutRequest(
          apiRoot + 'api/rgz_primedbe/prosledi_sluzbi' + '?sluzbaId=' + $(e).parent().parent().find("#forward option:selected").val() + '&primedbaId=' + pID,
          function(response, status) {
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
            //TODO: add history item, change status icons and status and response labels
            disappear($(e).parent().find(".loader"), 500);
            setTimeout(function() {
              appear(e, 500);
            }, 500);
          },
          true, authObject.access_token
        );
      }, 510);
    }
  };

  PRM.save = function(pID, e, i) {
    if ($(e).parent().parent().parent().find(authObject.sluzba == control ? "#controller-comment" : "#office-comment").hasClass("dirty") || $(e).parent().parent().parent().find("#office-response").hasClass('dirty')) {
      $.confirm({
        title: 'ПАЖЊА!',
        content: 'Да ли сте сигурни да желите да сачувате измењена поља?',
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
                var data = {};
                data.komentar = ($(e).parent().parent().parent().find(authObject.sluzba == control ? "#controller-comment" : "#office-comment").hasClass("dirty") ? $(e).parent().parent().parent().find(authObject.sluzba == control ? "#controller-comment" : "#office-comment").html().replace(/<br>/g, "\n").replace(/&nbsp;/g, " ").replace(/ +/g, " ") : "");
                data.odgovor = ($(e).parent().parent().parent().find("#office-response").hasClass('dirty') ? $(e).parent().parent().parent().find("#office-response").html().replace(/<br>/g, "\n").replace(/&nbsp;/g, " ").replace(/ +/g, " ") : "");
                $ajaxUtils.sendPutRequestWithData(
                  apiRoot + 'api/rgz_primedbe/' + /*(authObject.sluzba == control ? 'odgovor_korisniku' : 'odgovor_sluzbe')*/ 'odgovor_sluzbe'
                    + '?primedbaId=' + pID
                    + '&promeniStatus=0'
                    /*+ ($(e).parent().parent().parent().find(authObject.sluzba == control ? "#controller-comment" : "#office-comment").hasClass("dirty") ? '&komentar=' + encodeURIComponent($(e).parent().parent().parent().find(authObject.sluzba == control ? "#controller-comment" : "#office-comment").html().replace(/<br>/g, "\n").replace(/&nbsp;/g, " ").replace(/ +/g, " ")) : "")
                    + ($(e).parent().parent().parent().find("#office-response").hasClass('dirty') ? "&odgovor=" + encodeURIComponent($(e).parent().parent().parent().find("#office-response").html().replace(/<br>/g, "\n").replace(/&nbsp;/g, " ").replace(/ +/g, " ")) : "")*/,
                  function(response, status) {
                    $.confirm({
                      title: 'ПОТВРДА',
                      content: 'Измене над примедбом ' + pID + ' успешно сачуване.',
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
                    if (authObject.sluzba == control) {
                      $(e).parent().parent().parent().find("#controller-comment").removeClass('dirty');
                      cComms[i] = $(e).parent().parent().parent().find("#controller-comment").html();
                    } else {
                      $(e).parent().parent().parent().find("#office-comment").removeClass('dirty');
                      oComms[i] = $(e).parent().parent().parent().find("#office-comment").html();
                    }
                    if ($(e).parent().parent().parent().find("#office-response").hasClass('dirty')) {
                      $(e).parent().parent().parent().find("#office-response").removeClass('dirty');
                      oResps[i] = $(e).parent().parent().parent().find("#office-response").html();
                    }
                    //TODO: add history item
                    disappear($(e).parent().find(".loader"), 500);
                    setTimeout(function() {
                      appear(e, 500);
                    }, 500);
                  },
                  true, JSON.stringify(data), authObject.access_token
                );
              }, 510);
            }
          }
        }
      });
    } else {
      $.confirm({
        title: 'ГРЕШКА!',
        content: 'Морате прво изменити коментар пре него што сачувате измене коментара.',
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
  };

  PRM.check = function(pID, e, i) {
    if ($(e).parent().parent().parent().find("#office-response").hasClass('dirty') || $(e).parent().parent().parent().find("#office-response").html() != ''/* && authObject.sluzba == control*/) {
      if ($(e).parent().parent().parent().find("#controller-comment").hasClass('dirty') || $(e).parent().parent().parent().find("#office-coment").hasClass('dirty')) {
        $.confirm({
          title: 'ПАЖЊА!',
          content: 'Да ли желите да ' + (authObject.sluzba == control ? "одговор проследите грађанину" : "завршите обраду примедбе и проследите је контролору") + ', а да претходно нисте проверили и сачували постојеће измене коментара?',
          theme: 'supervan',
          backgroundDismiss: 'true',
          autoClose: 'no|15000',
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
                PRM.checkAux(pID, e, i);
              }
            }
          }
        });
        return;
      } else
        PRM.checkAux(pID, e, i);
    } else {
      $.confirm({
        title: 'ГРЕШКА!',
        content: 'Морате прво изменити одговор пре него што завршите обраду. Одговор не може да буде празан.',
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
  };

  PRM.checkAux = function(pID, e, i) {
    $.confirm({
      title: 'ПАЖЊА!',
      content: 'Да ли желите да ' + (authObject.sluzba == control ? "одговор проследите грађанину" : "завршите обраду примедбе и проследите је контролору") + '?<br><br><br><span>Измене над овом примедбом неће бити могуће након ове акције.</span>',
      theme: 'supervan',
      backgroundDismiss: 'true',
      autoClose: 'no|15000',
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
              var data = {};
              data.odgovor = $(e).parent().parent().parent().find("#office-response").html().replace(/<br>/g, "\n").replace(/&nbsp;/g, " ").replace(/ +/g, " ");
              data.komentar = ($(e).parent().parent().parent().find(authObject.sluzba == control ? "#controller-comment" : "#office-comment").hasClass("dirty") ? $(e).parent().parent().parent().find(authObject.sluzba == control ? "#controller-comment" : "#office-comment").html().replace(/<br>/g, "\n").replace(/&nbsp;/g, " ").replace(/ +/g, " ") : "");
              $ajaxUtils.sendPutRequestWithData(
                apiRoot + 'api/rgz_primedbe/' + (authObject.sluzba == control ? 'odgovor_korisniku' : 'odgovor_sluzbe')
                  + '?primedbaId=' + pID
                  + (authObject.sluzba == control ? '' : '&promeniStatus=1')
                  /*+ '&odgovor=' + encodeURIComponent($(e).parent().parent().parent().find("#office-response").html().replace(/<br>/g, "\n").replace(/&nbsp;/g, " ").replace(/ +/g, " "))
                  + ($(e).parent().parent().parent().find(authObject.sluzba == control ? "#controller-comment" : "#office-comment").hasClass("dirty") ? '&komentar=' + encodeURIComponent($(e).parent().parent().parent().find(authObject.sluzba == control ? "#controller-comment" : "#office-comment").html().replace(/<br>/g, "\n").replace(/&nbsp;/g, " ").replace(/ +/g, " ")) : "")*/,
                function(response, status) {
                  $.confirm({
                    title: 'ПОТВРДА',
                    content: (authObject.sluzba == control ? 'Примедба ' + pID + ' успешно закључена и означена као прослеђена грађанину.' : 'Одговор на примедбу ' + pID + ' успешно евидентиран и прослеђен контролорима.'),
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
                  //TODO: add history item
                  $(e).parent().parent().parent().find("#office-response").removeClass('dirty');
                  oResps[i] = $(e).parent().parent().parent().find("#office-response").html();
                  $(e).parent().parent().parent().find(authObject.sluzba == control ? "#controller-comment" : "#office-comment").removeClass("dirty");
                  disappear($(e).parent().find(".loader"), 500);
                  cComms[i] = $(e).parent().parent().parent().find("#controller-comment").html();
                  oComms[i] = $(e).parent().parent().parent().find("#office-comment").html();
                  setTimeout(function() {
                    appear(e, 500);
                  }, 500);
                },
                true, JSON.stringify(data), authObject.access_token
              );
            }, 510);
          }
        }
      }
    });
  };

  PRM.refresh = function() {
    if ($(".dirty").length > 0) {
      $.confirm({
        title: 'ПАЖЊА!',
        content: 'Постоје измене над најмање једном примедбом. Да ли желите да одбаците ове измене и да наставите са учитавањем?',
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
            action: function() { PRM.refreshAux(); }
          }
        }
      });
    } else
      PRM.refreshAux();
    /*
    if ($("#refresh i").hasClass("fa-spin")) return;
    $("#refresh i, #mobile-refresh-clear i").addClass("fa-spin");
    disappear($(".table-row, .expansion"), 500);
    setTimeout(function() {
      appear($(".loader"), 500);
    }, 500);
    insertHtml("#page-select", "");
    $("#pagination>div>div").addClass("pagination-disabled");
    $("#pagination select").prop("disabled", true);
    setTimeout(function() {
      //edit table html and #page-select html according to response
      $("#refresh i, #mobile-refresh-clear i").removeClass("fa-spin");
      disappear($(".loader"), 500);
      setTimeout(function() {
        appear($(".table-row, .expansion"), 500);
      }, 500);
      insertHtml("#page-select", `
        <option value="1" selected>1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
      `);
      $("#pagination>div>div:nth-child(3)").removeClass("pagination-disabled");
      $("#pagination select").prop("disabled", false);
      $("#pagination>div>div:nth-child(1), #pagination>div>div:nth-child(2)").addClass("pagination-disabled");
      if ($("#page-select option").length == 1)
        $("#pagination>div>div:nth-last-child(1), #pagination>div>div:nth-last-child(2)").addClass("pagination-disabled");
      else
        $("#pagination>div>div:nth-last-child(1), #pagination>div>div:nth-last-child(2)").removeClass("pagination-disabled");
    }, 2500); //this delay only simulating network response
    */
  };

  var updatePagination = function(n) {
    if (n == 0 || n == $("#page-select option").length) return;
    if (n > $("#page-select option").length)
      for (var i = $("#page-select option").length; i <= n; i++)
        $("#page-select").append(`<option value="` + i + `">` + i + `</option>`);
    else if (n < $("#page-select option").length) {
      var html = '';
      var si = $("#page-select").prop("selectedIndex") + 1;
      for (var i = 0; i < n; i++)
        html += `<option value="` + (i + 1) + `" ` + (i + 1 == si ? `selected` : ``) + `>` + (i + 1) + `</option>`;
      insertHtml("#page-select", html);
    }
    if ($("#page-select").prop("selectedIndex") == 0)
      $("#pagination>div>div:nth-child(1), #pagination>div>div:nth-child(2)").addClass("pagination-disabled");
    else
      $("#pagination>div>div:nth-child(1), #pagination>div>div:nth-child(2)").removeClass("pagination-disabled");
    if ($("#page-select").prop("selectedIndex") == $("#page-select option").length - 1)
      $("#pagination>div>div:nth-last-child(1), #pagination>div>div:nth-last-child(2)").addClass("pagination-disabled");
    else
      $("#pagination>div>div:nth-last-child(1), #pagination>div>div:nth-last-child(2)").removeClass("pagination-disabled");
  };

  PRM.refreshAux = function() {
    disappear($(".table-row, .expansion"), 10);
    setTimeout(function() {
      appear($(".loader"), 10);
    }, 20);
    setTimeout(function() {
      var pageNum = $("#page-select").prop("selectedIndex") + 1;
      $ajaxUtils.sendGetRequest(
        apiRoot + 'api/rgz_primedbe/get' + '?page=' + pageNum +
          (($("#file-number").val() != "") ? ('&br_pr=' + encodeURIComponent($("#file-number").val())) : '') +
          (($("#date-from").val() != "") ? ('&d_od=' + encodeURIComponent($("#date-from").datepicker('getUTCDate'))) : '') +
          (($("#date-to").val() != "") ? ('&d_do=' + encodeURIComponent($("#date-to").datepicker('getUTCDate'))) : '') +
          (($("#client-name").val() != "") ? ('&ime=' + encodeURIComponent($("#client-name").val())) : '') +
          (($("#client-mail").val() != "") ? ('&email=' + encodeURIComponent($("#client-mail").val())) : '') +
          (($("#client-phone").val() != "") ? ('&tel=' + encodeURIComponent($("#client-phone").val())) : '') +
          ((authObject.sluzba == control) ? (($("#office option:selected").attr("value") != 0) ? ('&sluzbaId=' + $("#office option:selected").attr("value")) : '') : '') +
          (($("#status option:selected").attr("value") != 0) ? ('&status=' + encodeURIComponent($("#status option:selected").attr("value"))) : ''),
        function(response, status) {
          var html = generateTableRowsHtml(response);
          $(".table-row, .expansion").remove();
          $("#table").append(html);
          updatePagination(Math.ceil(response.UkupnoPrimedbi / 10));
          disappear($(".loader"), 10);
        },
        true, authObject.access_token
      );
    }, 30);
  };

  var printTitle = "";
  PRM.printTitleChanged = function(e) {
    printTitle = $(e).val();
  };

  PRM.print = function() {
    return; //TODO: delete on print data establishment, redo the rest
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
                  <div class="inner-xl">` + `Petar Petrović` + `</div>
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

  PRM.statsDateInit = function() {
    $(".stats-date-from, .stats-date-to").datepicker({
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
    PRM.searchbarInputChanged(e);
  };

  PRM.statsDateFromChanged = function(e) {
    if ($(e).val() != "")
      $(".stats-date-to").datepicker('setStartDate', $(e).val());
  };

  PRM.dateToChanged = function(e) {
    if ($(e).val() != "")
      $(".date-from").datepicker('setEndDate', $(e).val());
    PRM.searchbarInputChanged(e);
  };

  PRM.statsDateToChanged = function(e) {
    if ($(e).val() != "")
      $(".stats-date-from").datepicker('setEndDate', $(e).val());
  };

  PRM.promptDirty = function() {
    if ($(".dirty").length > 0) {
      $.confirm({
        title: 'ПАЖЊА!',
        content: 'Постоје измене над најмање једном примедбом. Уколико промените страну, одбацићете ове измене.',
        theme: 'supervan',
        backgroundDismiss: 'false',
        buttons: {
          ok: {
            text: 'ОК',
            btnClass: 'btn-white-prm',
            keys: ['enter'],
            action: function() {}
          }
        }
      });
    }
  };

  PRM.firstPage = function(e) {
    if ($(".dirty").length > 0 && !($(e).hasClass("pagination-disabled"))) {
      $.confirm({
        title: 'ПАЖЊА!',
        content: 'Постоје измене над најмање једном примедбом. Да ли желите да одбаците ове измене и да наставите са учитавањем?',
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
              if ($("#page-select").prop("selectedIndex") != 0) {
                $("#page-select option").prop("selected", false);
                $("#page-select option:first-child").prop("selected", true);
                PRM.selectPage();
              }
            }
          }
        }
      });
    } else {
      if ($("#page-select").prop("selectedIndex") != 0) {
        $("#page-select option").prop("selected", false);
        $("#page-select option:first-child").prop("selected", true);
        PRM.selectPage();
      }
    }
  };

  PRM.previousPage = function(e) {
    if ($(".dirty").length > 0 && !($(e).hasClass("pagination-disabled"))) {
      $.confirm({
        title: 'ПАЖЊА!',
        content: 'Постоје измене над најмање једном примедбом. Да ли желите да одбаците ове измене и да наставите са учитавањем?',
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
              if ($("#page-select").prop("selectedIndex") != 0) {
                var i = $("#page-select").prop("selectedIndex", $("#page-select").prop("selectedIndex") - 1);
                PRM.selectPage();
              }
            }
          }
        }
      });
    } else {
      if ($("#page-select").prop("selectedIndex") != 0) {
        var i = $("#page-select").prop("selectedIndex", $("#page-select").prop("selectedIndex") - 1);
        PRM.selectPage();
      }
    }
  };

  PRM.selectPage = function() {
    disappear($(".table-row, .expansion"), 10);
    setTimeout(function() {
      appear($(".loader"), 10);
    }, 20);
    setTimeout(function() {
      var pageNum = $("#page-select").prop("selectedIndex") + 1;
      $ajaxUtils.sendGetRequest(
        apiRoot + 'api/rgz_primedbe/get' + '?page=' + pageNum +
          (($("#file-number").val() != "") ? ('&br_pr=' + encodeURIComponent($("#file-number").val())) : '') +
          (($("#date-from").val() != "") ? ('&d_od=' + encodeURIComponent($("#date-from").datepicker('getUTCDate'))) : '') +
          (($("#date-to").val() != "") ? ('&d_do=' + encodeURIComponent($("#date-to").datepicker('getUTCDate'))) : '') +
          (($("#client-name").val() != "") ? ('&ime=' + encodeURIComponent($("#client-name").val())) : '') +
          (($("#client-mail").val() != "") ? ('&email=' + encodeURIComponent($("#client-mail").val())) : '') +
          (($("#client-phone").val() != "") ? ('&tel=' + encodeURIComponent($("#client-phone").val())) : '') +
          ((authObject.sluzba == control) ? (($("#office option:selected").attr("value") != 0) ? ('&sluzbaId=' + $("#office option:selected").attr("value")) : '') : '') +
          (($("#status option:selected").attr("value") != 0) ? ('&status=' + encodeURIComponent($("#status option:selected").attr("value"))) : ''),
        function(response, status) {
          var html = generateTableRowsHtml(response);
          $(".table-row, .expansion").remove();
          $("#table").append(html);
          updatePagination(Math.ceil(response.UkupnoPrimedbi / 10));
          disappear($(".loader"), 10);
          if ($("#page-select").prop("selectedIndex") == 0)
            $("#pagination>div>div:nth-child(1), #pagination>div>div:nth-child(2)").addClass("pagination-disabled");
          else
            $("#pagination>div>div:nth-child(1), #pagination>div>div:nth-child(2)").removeClass("pagination-disabled");
          if ($("#page-select").prop("selectedIndex") == $("#page-select option").length - 1)
            $("#pagination>div>div:nth-last-child(1), #pagination>div>div:nth-last-child(2)").addClass("pagination-disabled");
          else
            $("#pagination>div>div:nth-last-child(1), #pagination>div>div:nth-last-child(2)").removeClass("pagination-disabled");
        },
        true, authObject.access_token
      );
    }, 30);
  };

  PRM.nextPage = function(e) {
    if ($(".dirty").length > 0 && !($(e).hasClass("pagination-disabled"))) {
      $.confirm({
        title: 'ПАЖЊА!',
        content: 'Постоје измене над најмање једном примедбом. Да ли желите да одбаците ове измене и да наставите са учитавањем?',
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
              if ($("#page-select").prop("selectedIndex") != $("#page-select option").length - 1) {
                var i = $("#page-select").prop("selectedIndex", $("#page-select").prop("selectedIndex") + 1);
                PRM.selectPage();
              }
            }
          }
        }
      });
    } else {
      if ($("#page-select").prop("selectedIndex") != $("#page-select option").length - 1) {
        var i = $("#page-select").prop("selectedIndex", $("#page-select").prop("selectedIndex") + 1);
        PRM.selectPage();
      }
    }
  };

  PRM.lastPage = function(e) {
    if ($(".dirty").length > 0 && !($(e).hasClass("pagination-disabled"))) {
      $.confirm({
        title: 'ПАЖЊА!',
        content: 'Постоје измене над најмање једном примедбом. Да ли желите да одбаците ове измене и да наставите са учитавањем?',
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
              if ($("#page-select").prop("selectedIndex") != $("#page-select option").length - 1) {
                $("#page-select option").prop("selected", false);
                $("#page-select option:last-child").prop("selected", true);
                PRM.selectPage();
              }
            }
          }
        }
      });
    } else {
      if ($("#page-select").prop("selectedIndex") != $("#page-select option").length - 1) {
        $("#page-select option").prop("selected", false);
        $("#page-select option:last-child").prop("selected", true);
        PRM.selectPage();
      }
    }
  };

  PRM.signOut = function() {
    $.confirm({
      title: 'ПАЖЊА!',
      content: 'Да ли сте сигурни да желите да се одјавите?',
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
            $ajaxUtils.sendGetRequest(
              apiRoot + 'api/user/logout',
              function(response, status) {
                localStorage.removeItem("RGZPRMrefreshToken");
                location.reload();
              },
              true, authObject.access_token
            );
          }
        }
      }
    });
  };

  pattern1 = /[~!@\`#$%\^&*+=\-\[\];,./{}()|\\\":<>\?]/;
  pattern2 = /[a-z]/;
  pattern3 = /[A-Z]/;
  pattern4 = /[0-9]/;

  PRM.changePassword = function() {
    var newPass = $("#new-password").val();
    if (newPass.length < 8 || !pattern1.test(newPass) || !pattern2.test(newPass) || !pattern3.test(newPass) || !pattern4.test(newPass)) {
      $.confirm({
        title: 'ГРЕШКА!',
        content: 'Лозинка мора имати барем 8 карактера и мора садржати барем једно мало слово и барем једно велико слово енглеског алфабета, барем једну цифру и барем један специјални карактер. Шифра не сме садржати бланко ознаке (space, tab и сл.)',
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
    $("#new-password").prop("disabled", true);
    disappear($("#change-password-button"), 500);
    setTimeout(function() {
      appear($("#change-password-container .loader"), 500);
    }, 500);
    setTimeout(function() {
      disappear($("#change-password-container .loader"), 500);
      setTimeout(function() {
        appear($("#change-password-button"), 500);
      }, 500);
      $.confirm({
        title: 'ПОТВРДА',
        content: 'Лозинка је успешно промењена.<br><br>Користите нову лозинку приликом следеће пријаве на систем.',
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
      $("#new-password").prop("disabled", false);
    }, 2500); //this delay only simulating network response
  };

  global.$PRM = PRM;
})(window);