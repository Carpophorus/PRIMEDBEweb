(function(global) {
  PRM = {};

  PRM.nav = 0;
  var officesArray = [];

  console.log(`
    LOGIN:

    Oba polja (username i password) su samo slovo t. Planiran je trajni token u local strage-u radi smanjivanja broja prijava na sistem nakon osvežavanja strane. Svi ostali pozivi osim login-a ka API-u imaju ovaj token kao Auth. Po tome, odn. korisničkoj roli, odlučuje se koje se primedbe i ostali sadržaj prikazuje korisniku.


    PRIMEDBE:

    Prikazuje se po 10 primedbi (API poziv ne sme da dohvati sve primedbe, pa se na front-u rešava iteracija). U pozivu ka API-u postoji i broj stranice zbog dohvatanja određenih 10 primedbi po hronološki opadajućem redosledu (na dnu ispod primedbi je pagination na čiju se promenu opet poziva API; poziv ka API-u nakon login-a bi onda bio npr. .../api/desetPrimedbi&page=1). Štampa je rešena sa tim podacima, refresh je poslednji poziv za desetPrimedbi. Opcioni parametri pretrage bi trebalo da se takođe ubace u API poziv. Rezultat API poziva mora da vraća i ukupan broj tiketa kao odvojeni rezultat zbog određivanja broja stranica za pagination.


    POJEDINAČNA PRIMEDBA:

    Unutar ekspandovane primedbe je najveći broj poziva ka API-u. Sva polja su priložena, uz moguće dodavanje komentara službenika ispod komentara kontrolora. Istorija treba da sadrži sve relevantne događaje prosleđivanja, odgovaranja ili isteka roka za odgovor, eventualno i promene komentara kontrolora ili službenika (sve naravno prati i ID korisnika ako je u pitanju user action). Prosleđivanje primedbe i save za izmene su odvojeni pozivi. U odnosu na korisničke role po Auth tokenu treba paziti ko šta može da izmeni, iako će na front-u biti onemogućen pristup određenim poljima za određene role. Status primedbe i status odgovora su automatski (potvrda da je odgovor poslat građaninu može da bude na odvojeno dugme jer to jedino nije automatski).


    STATISTIKA:

    Parametri su opseg datuma i odabrane SKN. Samo su ovi parametri vidljivi na početku (grafikon i rezultati se prikazuju nakon pokretanja pretrage). Podaci su zbirni za odabrane SKN, ali su u RGZ-u hteli da ih razdvoje. Primljeni podaci će moći da se štampaju nakon dobijanja podataka (dugme za štampu treba da se pojavi).


    PROFIL:

    Lični podaci i logout dugme. Osim invalidacije tokena, ova strana ne bi trebalo da dodaje funkcije na API (lični podaci su tu nakon login-a).
  `);

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
    if ($("#username").val() != "t" || $("#password").val() != "t") {
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
      }, 3000); //this delay only simulating network response
    } else {
      setTimeout(function() { //success
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
      }, 3000); //this delay only simulating network response
    }
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
    disappear($("#switchbox"), 500);
    appear($(".loader"), 500);
    setTimeout(function() {
      insertHtml("#switchbox", ``);
    }, 500);
    setTimeout(function() {
      if (n == 1) {
        var html = `
          <div id="searchbar" class="row hidden-md-down">
            <div id="search-criteria" class="col-11">
              <img src="img/favicons/favicon.ico" onload="$PRM.dateInit();">
              <div class="col-ninth"><input id="file-number" class="file-number" type="text" placeholder="бр. предмета" onfocus="this.placeholder = ''" onblur="this.placeholder = 'бр. предмета'" onkeyup="$PRM.searchbarInputChanged(this);"></div>
              <div class="col-ninth"><input id="date-from" class="date-from" type="text" placeholder="датум од" onfocus="this.placeholder = ''" onblur="this.placeholder = 'датум од'" onkeydown="return false" onchange="$PRM.dateFromChanged(this);"></div>
              <div class="col-ninth"><input id="date-to" class="date-to" type="text" placeholder="датум до" onfocus="this.placeholder = ''" onblur="this.placeholder = 'датум до'" onkeydown="return false" onchange="$PRM.dateToChanged(this);"></div>
              <div class="col-ninth"><input id="client-name" class="client-name" type="text" placeholder="име и презиме" onfocus="this.placeholder = ''" onblur="this.placeholder = 'име и презиме'" onkeyup="$PRM.searchbarInputChanged(this);"></div>
              <div class="col-ninth"><input id="client-mail" class="client-mail" type="text" placeholder="e-mail" onfocus="this.placeholder = ''" onblur="this.placeholder = 'e-mail'" onkeyup="$PRM.searchbarInputChanged(this);"></div>
              <div class="col-ninth"><input id="client-phone" class="client-phone" type="text" placeholder="телефон" onfocus="this.placeholder = ''" onblur="this.placeholder = 'телефон'" onkeyup="$PRM.searchbarInputChanged(this);"></div>
              <div class="col-ninth">
                <select id="office" class="office" onchange="$PRM.searchbarSelectChanged(this);">
                    <option value="0" disabled selected hidden>служба</option>
                    <option value="1">Ада</option>
                    <option value="2">Нови Београд</option>
                    <option value="3">Осечина</option>
                    <option value="4">Житорађа</option>
                  </select>
              </div>
              <div class="col-ninth">
                <select id="status" class="status" onchange="$PRM.searchbarSelectChanged(this);">
                    <option value="0" disabled selected hidden>статус</option>
                    <option value="1">Непрослеђен</option>
                    <option value="2">Прослеђен</option>
                    <option value="3">Готов</option>
                  </select>
              </div>
              <div class="col-ninth">
                <select id="response" class="response" onchange="$PRM.searchbarSelectChanged(this);">
                    <option value="0" disabled selected hidden>одговор</option>
                    <option value="1">На чекању</option>
                    <option value="2">Одговорено</option>
                    <option value="3">Нема одговора</option>
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
              <div class="col-12 col-md-6">
                <select id="office" class="office" onchange="$PRM.searchbarSelectChanged(this);">
                    <option value="0" disabled selected hidden>служба</option>
                    <option value="1">Ада</option>
                    <option value="2">Нови Београд</option>
                    <option value="3">Осечина</option>
                    <option value="4">Житорађа</option>
                  </select>
              </div>
              <div class="col-12 col-md-6">
                <select id="status" class="status" onchange="$PRM.searchbarSelectChanged(this);">
                    <option value="0" disabled selected hidden>статус</option>
                    <option value="1">Непрослеђен</option>
                    <option value="2">Прослеђен</option>
                    <option value="3">Готов</option>
                  </select>
              </div>
              <div class="col-12 col-md-6">
                <select id="response" class="response" onchange="$PRM.searchbarSelectChanged(this);">
                    <option value="0" disabled selected hidden>одговор</option>
                    <option value="1">На чекању</option>
                    <option value="2">Одговорено</option>
                    <option value="3">Нема одговора</option>
                  </select>
              </div>
            </div>
          </div>
          <div id="table">
            <div id="table-header" class="row">
              <div class="col-2 col-md-1">р.б.</div>
              <div class="col-6 col-md-3">бр. предмета</div>
              <div class="col-3 hidden-sm-down">датум</div>
              <div class="col-3 hidden-sm-down">име и презиме</div>
              <div class="col-2 col-md-1"><span class="hidden-sm-down">статус</span><i class="hidden-md-up fa fa-info-circle"></i></div>
              <div class="col-2 col-md-1"><span class="hidden-sm-down">одговор</span><i class="hidden-md-up fa fa-comments"></i></div>
            </div>
            <div class="table-row row" onclick="$PRM.tableRowClicked(1, this);">
              <div class="col-2 col-md-1">123</div>
              <div class="col-6 col-md-3">95-74993678/2017</div>
              <div class="col-3 hidden-sm-down">10.11.2017. 08:51</div>
              <div class="col-3 hidden-sm-down">Петар Петровић</div>
              <div class="col-2 col-md-1 status-1"><i class="fa fa-inbox"></i></div>
              <div class="col-2 col-md-1 response-1"></div>
            </div>
            <div id="expansion-1" class="expansion collapse">
              <div class="row">
                <div class="expansion-info col-12 col-md-6">
                  <div class="expansion-label">бр. предмета:</div>
                  <div class="expansion-info-data">95-74993/2017</div>
                  <div class="expansion-label">датум:</div>
                  <div class="expansion-info-data">10.11.2017. 08:51</div>
                  <div class="expansion-label">име и презиме:</div>
                  <div class="expansion-info-data">Петар Петровић</div>
                  <div class="expansion-label">e-mail:</div>
                  <div class="expansion-info-data">rr69@gmail.com</div>
                  <div class="expansion-label">телефон:</div>
                  <div class="expansion-info-data">069/555-78-03</div>
                  <div class="expansion-label">служба:</div>
                  <div class="expansion-info-data">Велика Плана</div>
                  <div class="expansion-label">претходно обраћање:</div>
                  <div class="expansion-info-data">ДА</div>
                  <div class="expansion-label">службеник:</div>
                  <div class="expansion-info-data">Јован Јовановић</div>
                  <div class="expansion-label">статус:</div>
                  <div class="expansion-info-data">Непрослеђен</div>
                  <div class="expansion-label">одговор:</div>
                  <div class="expansion-info-data">Нема одговора</div>
                  <div class="expansion-label">историја:</div>
                  <div class="expansion-info-data">
                    &bull; прослеђено на СКН Велика Плана 11.11.2017. 09:45
                    <br>&bull; није одговорено до 14.11.2017. 09:45
                    <br>&bull; прослеђено на СКН Велика Плана 15.11.2017. 13:27
                  </div>
                </div>
                <div class="expansion-response col-12 col-md-6">
                  <div id="forward-label" class="expansion-label">прослеђивање:</div>
                  <div id="forward-container" class="row">
                    <div id="forward-select-container" class="col-12 col-md-9">
                      <select id="forward" onchange="$PRM.expansionSelectChanged(this);">
                          <option value="0" disabled selected hidden>оператер</option>
                          <option value="1">СКН 1</option>
                          <option value="2">СКН 2</option>
                          <option value="3">СКН 3</option>
                          <option value="4">СКН 4</option>
                          <option value="5">СКН 5</option>
                          <option value="6">СКН 6</option>
                          <option value="7">Другостепена комисија</option>
                        </select>
                    </div>
                    <div id="forward-button-container" class="col-12 col-md-3">
                      <div class="loader gone">
                        <div class="loader-inner"></div>
                      </div>
                      <button onclick="$PRM.forward(123, this);"><i class="fa fa-share"></i></button>
                    </div>
                  </div>
                  <div class="expansion-label">примедба:</div>
                  <div class="divtextarea">Ovo je primedba klijenta. Polje se ne može menjati. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet provident similique nemo alias amet, sapiente dolor, at maiores voluptates quo deleniti praesentium modi ab, illo minus vitae
                    deserunt harum dolorum. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni ipsum consectetur in ad quia, quas vitae aliquam tempora ex doloremque dignissimos perspiciatis veniam odio esse, qui, eos dicta nesciunt est? Lorem ipsum
                    dolor sit amet, consectetur adipisicing elit. Hic, possimus nemo nihil voluptatum facere aperiam ullam dolor. Velit officiis dignissimos blanditiis, saepe fugit dolor dolorem tenetur quo voluptatum, ab ullam!</div>
                  <div class="expansion-label">коментар контролора:</div>
                  <div class="divtextarea" contenteditable="true">Ovo je komentar kontrolora. Polje može menjati samo kontrolor.</div>
                  <div class="expansion-label">коментар службеника:</div>
                  <div class="divtextarea" contenteditable="true">Ovo je komentar službenika. Polje može menjati samo službenik.</div>
                  <div class="expansion-label">одговор службе:</div>
                  <div id="office-response" class="divtextarea" contenteditable="true"></div>
                  <div class="row">
                    <div class="hidden-sm-down col-md-9"></div>
                    <div id="save-button-container" class="col-12 col-md-3">
                      <div class="loader gone">
                        <div class="loader-inner"></div>
                      </div>
                      <button onclick="$PRM.save(123, this);"><i class="fa fa-save"></i></button>
                    </div>
                  </div>
                  <div class="row">
                    <div class="hidden-sm-down col-md-9"></div>
                    <div id="check-button-container" class="col-12 col-md-3">
                      <div class="loader gone">
                        <div class="loader-inner"></div>
                      </div>
                      <button onclick="$PRM.check(123, this);"><i class="fa fa-check"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="table-row row" onclick="$PRM.tableRowClicked(2, this);">
              <div class="col-2 col-md-1">123</div>
              <div class="col-6 col-md-3">95-74993678/2017</div>
              <div class="col-3 hidden-sm-down">10.11.2017. 08:51</div>
              <div class="col-3 hidden-sm-down">Petar Petrović</div>
              <div class="col-2 col-md-1 status-2"><i class="fa fa-share"></i></div>
              <div class="col-2 col-md-1 response-2"><i class="fa fa-clock-o"></i></div>
            </div>
            <div id="expansion-2" class="expansion collapse">
              <div>
                dgfjgkldfgkldfkl
                <br>djfkdkdfd
                <br>gdkfdfdpllgdld
              </div>
            </div>
            <div class="table-row row" onclick="$PRM.tableRowClicked(3, this);">
              <div class="col-2 col-md-1">123</div>
              <div class="col-6 col-md-3">95-74993678/2017</div>
              <div class="col-3 hidden-sm-down">10.11.2017. 08:51</div>
              <div class="col-3 hidden-sm-down">Petar Petrović</div>
              <div class="col-2 col-md-1 status-2"><i class="fa fa-share"></i></div>
              <div class="col-2 col-md-1 response-3"><i class="fa fa-check"></i></div>
            </div>
            <div id="expansion-3" class="expansion collapse">
              <div>
                dgfjgkldfgkldfkl
                <br>djfkdkdfd
                <br>gdkfdfdpllgdld
              </div>
            </div>
            <div class="table-row row" onclick="$PRM.tableRowClicked(4, this);">
              <div class="col-2 col-md-1">123</div>
              <div class="col-6 col-md-3">95-74993678/2017</div>
              <div class="col-3 hidden-sm-down">10.11.2017. 08:51</div>
              <div class="col-3 hidden-sm-down">Petar Petrović</div>
              <div class="col-2 col-md-1 status-2"><i class="fa fa-share"></i></div>
              <div class="col-2 col-md-1 response-4"><i class="fa fa-times"></i></div>
            </div>
            <div id="expansion-4" class="expansion collapse">
              <div>
                dgfjgkldfgkldfkl
                <br>djfkdkdfd
                <br>gdkfdfdpllgdld
              </div>
            </div>
            <div class="table-row row" onclick="$PRM.tableRowClicked(5, this);">
              <div class="col-2 col-md-1">123</div>
              <div class="col-6 col-md-3">95-74993678/2017</div>
              <div class="col-3 hidden-sm-down">10.11.2017. 08:51</div>
              <div class="col-3 hidden-sm-down">Petar Petrović</div>
              <div class="col-2 col-md-1 status-3"><i class="fa fa-check"></i></div>
              <div class="col-2 col-md-1 response-3"><i class="fa fa-check"></i></div>
            </div>
            <div id="expansion-5" class="expansion collapse">
              <div>
                dgfjgkldfgkldfkl
                <br>djfkdkdfd
                <br>gdkfdfdpllgdld
              </div>
            </div>
            <div class="table-row row" onclick="$PRM.tableRowClicked(6, this);">
              <div class="col-2 col-md-1">123</div>
              <div class="col-6 col-md-3">95-74993678/2017</div>
              <div class="col-3 hidden-sm-down">10.11.2017. 08:51</div>
              <div class="col-3 hidden-sm-down">Petar Petrović</div>
              <div class="col-2 col-md-1 status-3"><i class="fa fa-check"></i></div>
              <div class="col-2 col-md-1 response-3"><i class="fa fa-check"></i></div>
            </div>
            <div id="expansion-6" class="expansion collapse">
              <div>
                dgfjgkldfgkldfkl
                <br>djfkdkdfd
                <br>gdkfdfdpllgdld
              </div>
            </div>
            <div class="table-row row" onclick="$PRM.tableRowClicked(7, this);">
              <div class="col-2 col-md-1">123</div>
              <div class="col-6 col-md-3">95-74993678/2017</div>
              <div class="col-3 hidden-sm-down">10.11.2017. 08:51</div>
              <div class="col-3 hidden-sm-down">Petar Petrović</div>
              <div class="col-2 col-md-1 status-3"><i class="fa fa-check"></i></div>
              <div class="col-2 col-md-1 response-3"><i class="fa fa-check"></i></div>
            </div>
            <div id="expansion-7" class="expansion collapse">
              <div>
                dgfjgkldfgkldfkl
                <br>djfkdkdfd
                <br>gdkfdfdpllgdld
              </div>
            </div>
            <div class="table-row row" onclick="$PRM.tableRowClicked(8, this);">
              <div class="col-2 col-md-1">123</div>
              <div class="col-6 col-md-3">95-74993678/2017</div>
              <div class="col-3 hidden-sm-down">10.11.2017. 08:51</div>
              <div class="col-3 hidden-sm-down">Petar Petrović</div>
              <div class="col-2 col-md-1 status-3"><i class="fa fa-check"></i></div>
              <div class="col-2 col-md-1 response-3"><i class="fa fa-check"></i></div>
            </div>
            <div id="expansion-8" class="expansion collapse">
              <div>
                dgfjgkldfgkldfkl
                <br>djfkdkdfd
                <br>gdkfdfdpllgdld
              </div>
            </div>
            <div class="table-row row" onclick="$PRM.tableRowClicked(9, this);">
              <div class="col-2 col-md-1">123</div>
              <div class="col-6 col-md-3">95-74993678/2017</div>
              <div class="col-3 hidden-sm-down">10.11.2017. 08:51</div>
              <div class="col-3 hidden-sm-down">Petar Petrović</div>
              <div class="col-2 col-md-1 status-3"><i class="fa fa-check"></i></div>
              <div class="col-2 col-md-1 response-3"><i class="fa fa-check"></i></div>
            </div>
            <div id="expansion-9" class="expansion collapse">
              <div>
                dgfjgkldfgkldfkl
                <br>djfkdkdfd
                <br>gdkfdfdpllgdld
              </div>
            </div>
            <div class="table-row row" onclick="$PRM.tableRowClicked(10, this);">
              <div class="col-2 col-md-1">123</div>
              <div class="col-6 col-md-3">95-74993678/2017</div>
              <div class="col-3 hidden-sm-down">10.11.2017. 08:51</div>
              <div class="col-3 hidden-sm-down">Petar Petrović</div>
              <div class="col-2 col-md-1 status-3"><i class="fa fa-check"></i></div>
              <div class="col-2 col-md-1 response-3"><i class="fa fa-check"></i></div>
            </div>
            <div id="expansion-10" class="expansion collapse">
              <div>
                dgfjgkldfgkldfkl
                <br>djfkdkdfd
                <br>gdkfdfdpllgdld
              </div>
            </div>
          </div>
          <div id="pagination">
            <div>
              <div onclick="$PRM.firstPage();" class="pagination-disabled"><i class="fa fa-angle-double-left"></i></div>
              <div onclick="$PRM.previousPage();" class="pagination-disabled"><i class="fa fa-angle-left"></i></div>
              <div>
                <select id="page-select" onchange="$PRM.selectPage();">
                    <option value="1" selected>1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                  </select>
              </div>
              <div onclick="$PRM.nextPage();"><i class="fa fa-angle-right"></i></div>
              <div onclick="$PRM.lastPage();"><i class="fa fa-angle-double-right"></i></div>
            </div>
          </div>
        `;
        insertHtml("#switchbox", html);
      } else if (n == 2) {
        var html = `
          <div class="row" id="statsparams">
            <img src="img/favicons/favicon.ico" onload="$PRM.statsDateInit();">
            <div class="col-7 hidden-md-down"></div>
            <div class="col-8 col-md-9 hidden-lg-up"></div>
            <div class="col-4 col-md-3 hidden-lg-up"><button id="search" onclick="$PRM.statsSearchButtonClicked();"><i class="fa fa-search"></i></button></div>
            <div class="col-12 col-md-6 col-lg-1"><input id="stats-date-from" class="stats-date-from" type="text" placeholder="датум од" onfocus="this.placeholder = ''" onblur="this.placeholder = 'датум од'" onkeydown="return false" onchange="$PRM.statsDateFromChanged(this);"></div>
            <div class="col-12 col-md-6 col-lg-1"><input id="stats-date-to" class="stats-date-to" type="text" placeholder="датум до" onfocus="this.placeholder = ''" onblur="this.placeholder = 'датум до'" onkeydown="return false" onchange="$PRM.statsDateToChanged(this);"></div>
            <div class="col-12 col-lg-2"><input id="stats-offices" class="stats-offices" type="text" placeholder="службе" onfocus="this.placeholder = ''" onblur="this.placeholder = 'службе'" onkeydown="return false" onclick="$PRM.statsOfficesClicked();"></div>
            <div class="col-1 hidden-md-down"><button id="search" onclick="$PRM.statsSearchButtonClicked();"><i class="fa fa-search"></i></button></div>
          </div>
          <div class="row" id="statsdata"></div>
        `;
        insertHtml("#switchbox", html);
      } else if (n == 3) {
        var html = `
          <div id="profile-picture"><i class="fa fa-user-circle-o"></i></div>
          <div id="profile-name">Петар Петровић</div>
          <div id="profile-position">ОПЕРАТЕР</div>
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
      }
      appear($("#switchbox"), 500);
      disappear($(".loader"), 500);
    }, 2500); //this delay only simulating network response
  };

  PRM.statsSearchButtonClicked = function() {
    if ($("#stats-date-from").val() == "" || $("#stats-date-to").val() == "" || $("#stats-offices").val() == "") {
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
    setTimeout(function() {
      var html = `
        <div class="col-12" id="statstitle">Статистика за СКН XXXXXXX за период од XX.XX.XXXX. до XX.XX.XXXX.</div>
        <div class="col-lg-6 col-12" id="chart">
          <div id="chart-inner"></div>
        </div>
        <div class="col-lg-6 col-12" id="stats">
          <div class="stat row noreply">
            <div class="col-9 col-sm-10 stat-toc">Без&nbsp;одговора:&nbsp;......................................................................................................................................................................................................
              <div class="stat-num stat-red">` + 14 + `</div>
            </div>
            <div class="col-3 col-sm-2 stat-desc">(` + (100 * 14 / 66).toFixed(2) + `%)</div>
          </div>
          <div class="stat row unforwarded">
            <div class="col-9 col-sm-10 stat-toc">Непрослеђених:&nbsp;......................................................................................................................................................................................................
              <div class="stat-num stat-blue">` + 5 + `</div>
            </div>
            <div class="col-3 col-sm-2 stat-desc">(` + (100 * 5 / 66).toFixed(2) + `%)</div>
          </div>
          <div class="stat row pending">
            <div class="col-9 col-sm-10 stat-toc">На&nbsp;чекању:&nbsp;......................................................................................................................................................................................................
              <div class="stat-num stat-yellow">` + 7 + `</div>
            </div>
            <div class="col-3 col-sm-2 stat-desc">(` + (100 * 7 / 66).toFixed(2) + `%)</div>
          </div>
          <div class="stat row answered">
            <div class="col-9 col-sm-10 stat-toc">Одговорено:&nbsp;......................................................................................................................................................................................................
              <div class="stat-num stat-green">` + 40 + `</div>
            </div>
            <div class="col-3 col-sm-2 stat-desc">(` + (100 * 40 / 66).toFixed(2) + `%)</div>
          </div>
          <div class="totaldouble" style="margin: 3vh 0 2vh 0; border-top: 2px solid #CC5505"></div>
          <div class="stat row totaldouble">
            <div class="col-9 col-sm-10 stat-toc">Укупно:&nbsp;......................................................................................................................................................................................................
              <div class="stat-num stat-orange">` + 66 + `</div>
            </div>
            <div class="col-3 col-sm-2 stat-desc">(100.00%)</div>
          </div>
          <div class="stat row totaldouble">
            <div class="col-9 col-sm-10 stat-toc">Вишеструко&nbsp;прослеђених:&nbsp;......................................................................................................................................................................................................
              <div class="stat-num stat-white">` + 9 + `</div>
            </div>
            <div class="col-3 col-sm-2 stat-desc">(` + (100 * 9 / 66).toFixed(2) + `%)</div>
          </div>
        </div>
      `;
      insertHtml("#statsdata", html);
      $(".stat, .totaldouble").css({"opacity": "0", "transition": "opacity 0.45s ease"});
      $(".noreply").css({"opacity": "1"});
      setTimeout(function() {
        $(".unforwarded").css({"opacity": "1"});
      }, 500);
      setTimeout(function() {
        $(".pending").css({"opacity": "1"});
      }, 1000);
      setTimeout(function() {
        $(".answered").css({"opacity": "1"});
      }, 1500);
      setTimeout(function() {
        $(".totaldouble").css({"opacity": "1"});
      }, 2000);
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
      var chartInner = new Chartist.Pie("#chart-inner", {
        series: [0, 0, 0, 0, 9, 66 - 9],
        labels: [0, 0, 0, 0, 0, 0]
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
      disappear($(".loader"), 500);
      $("#statsdata").css({"opacity": "1"});
    }, 2500); //this delay only simulating network response
  };

  PRM.statsOfficesClicked = function() {
    var html = `
      <div class="offices-picker">
        <button class="offices-picker-all" onclick="$PRM.officesAllClicked();">ОДАБЕРИ&nbsp;СВЕ&nbsp;СКН</button>
        <div class="offices-picker-list row">
    `;
    for(var i = 1; i < 100; i++)
      html += `<div class="col-12 col-md-6 col-lg-3"><div value="` + i + `" onclick="$PRM.officeItemClicked(` + i + `, this);">СКН ` + i + `</div></div>`;
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
      var offices = '';
      for (var i = 0; i < officesArray.length; i++)
        offices += 'СКН ' + officesArray[i] + ((i == officesArray.length - 1) ? '' : ', ');
      $("#stats-offices").val(offices);
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
      PRM.refresh(); //maybe
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

  PRM.save = function(pID, e) {
    if ($("#office-response").html() == "") {
      $.confirm({
        title: 'ГРЕШКА!',
        content: 'Не можете послати празан одговор.', //ne ovo, već samo ako su neka polja izmenjena...prosleđivanje se ne prikazuje na strani skn-a
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
        content: 'Да ли сте сигурни да желите да сачувате измењене податке?',
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

  PRM.check = function(pID, e) {
    if ($("#office-response").html() == "") { //mora se proveriti i da li su polja dirty u else if, pa prompt za save first
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
        content: 'Да ли сте сигурни да желите да завршите обраду ове примедбе и проследите је контролорима?',
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
                  content: 'Примедба ' + pID + ' успешно закључена и прослеђена контролорима.',
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
    disappear($(".table-row"), 500);
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
        appear($(".table-row"), 500);
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

  PRM.firstPage = function() {
    if ($("#page-select").prop("selectedIndex") != 0) {
      $("#page-select option").prop("selected", false);
      $("#page-select option:first-child").prop("selected", true);
      PRM.selectPage();
    }
  };

  PRM.previousPage = function() {
    if ($("#page-select").prop("selectedIndex") != 0) {
      var i = $("#page-select").prop("selectedIndex", $("#page-select").prop("selectedIndex") - 1);
      PRM.selectPage();
    }
  };

  PRM.selectPage = function() {
    //call api
    disappear($(".table-row"), 500);
    setTimeout(function() {
      appear($(".loader"), 500);
    }, 500);
    setTimeout(function() {
      disappear($(".loader"), 500);
      setTimeout(function() {
        appear($(".table-row"), 500);
      }, 500);
    }, 2000); //this delay only simulating network response
    if ($("#page-select").prop("selectedIndex") == 0)
      $("#pagination>div>div:nth-child(1), #pagination>div>div:nth-child(2)").addClass("pagination-disabled");
    else
      $("#pagination>div>div:nth-child(1), #pagination>div>div:nth-child(2)").removeClass("pagination-disabled");
    if ($("#page-select").prop("selectedIndex") == $("#page-select option").length - 1)
      $("#pagination>div>div:nth-last-child(1), #pagination>div>div:nth-last-child(2)").addClass("pagination-disabled");
    else
      $("#pagination>div>div:nth-last-child(1), #pagination>div>div:nth-last-child(2)").removeClass("pagination-disabled");
  };

  PRM.nextPage = function() {
    if ($("#page-select").prop("selectedIndex") != $("#page-select option").length - 1) {
      var i = $("#page-select").prop("selectedIndex", $("#page-select").prop("selectedIndex") + 1);
      PRM.selectPage();
    }
  };

  PRM.lastPage = function() {
    if ($("#page-select").prop("selectedIndex") != $("#page-select option").length - 1) {
      $("#page-select option").prop("selected", false);
      $("#page-select option:last-child").prop("selected", true);
      PRM.selectPage();
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
            location.reload();
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