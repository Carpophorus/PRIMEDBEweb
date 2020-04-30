(function(global) {

  // DBS TEST:
  //var apiRoot = 'http://10.0.1.251:8090/';
  
  // RGZ TEST:
  var apiRoot = 'http://93.87.56.76:8095/';

  // RGZ LIVE:
  //var apiRoot = 'http://93.87.56.76:8090/';
  
  var form = null;

  var appear = function(selector, interval) {
    var e = document.getElementById(selector);
    e.classList.remove("gone");
    setTimeout(function() {
      e.style.opacity = 1;
      e.style.transition = "opacity " + Number(interval) / 1000 + "s ease";
    }, 10);
  };

  var disappear = function(selector, interval) {
    var e = document.getElementById(selector);
    e.style.opacity = 0;
    e.style.transition = "opacity " + Number(interval) / 1000 + "s ease";
    setTimeout(function() {
      e.classList.add("gone");
    }, Number(interval) + 10);
  };

  getRequestObject = function() {
    if (window.XMLHttpRequest) {
      return new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      return new ActiveXObject('Microsoft.XMLHTTP');
    } else {
      global.alert('Ajax is not supported!');
      return null;
    }
  };

  global.recaptchaCallback = function(token) {
    //disappear form, appear loader
    sendData(token);
  };

  function sendData(token) {
    var XHR = getRequestObject();
    var FD = new FormData(form);

    // Define what happens on successful data submission
    XHR.addEventListener('load', function(event) {
      form.disabled = false;
      form.reset();
      document.getElementById('sluzba-id').children[0].selected = true;
      //appear form, disappear loader?
      if (event.target.status >= 400) {
        if (event.target.status == 400)
          alert('\nГРЕШКА!\n\n' + JSON.parse(event.target.responseText).Message);
        else
          alert('\nГРЕШКА!\n\nДесила се грешка, покушајте поново.');
      } else {
        alert('\nУспешно сте послали примедбу.');
      }
      //confirm dialogue instead of alerts?
    });

    // Define what happens in case of error
    XHR.addEventListener('error', function(event) {
      form.disabled = false;
      //disappear form, appear loader?
      alert('\nГРЕШКА!\n\nДесила се грешка, покушајте поново.');
      //confirm dialogue instead of alert?
    });

    var data = {};
    for (var e of FD) {
      if ((e[0] === 'Ime' || e[0] === 'ObracanjeKome') && e[1] !== '' && e[1] !== undefined) {
        e[1] = e[1].toLowerCase();
        e[1] = (e[1].toString())[0].toUpperCase() + e[1].substr(1);
        if (e[1].indexOf(' ') !== -1)
          e[1] = e[1].substr(0, e[1].indexOf(' ') + 1) + (e[1].toString())[e[1].indexOf(' ') + 1].toUpperCase() + e[1].substr(e[1].indexOf(' ') + 2);
        if (e[1].indexOf('-') !== -1)
          e[1] = e[1].substr(0, e[1].indexOf('-') + 1) + (e[1].toString())[e[1].indexOf('-') + 1].toUpperCase() + e[1].substr(e[1].indexOf('-') + 2);
      }
      else if (e[0] === 'Email')
        e[1] = e[1].toLowerCase();
      else if (e[0] === 'OpisPrimedbe')
        e[1] = e[1].trim();
      else if (e[0] === 'SluzbaId')
        e[1] = Number(e[1]);
      else if (e[0] === 'ObracanjeSluzbi')
        e[1] = JSON.parse(e[1]);
      data[e[0]] = e[1];
    }
    if (data.ObracanjeSluzbi === false)
      data.ObracanjeKome = null;

    XHR.open('POST', apiRoot + 'api/rgz_primedbe/post?token=' + encodeURIComponent(token), true);
    XHR.setRequestHeader('Content-type', 'application/json');
    XHR.send(JSON.stringify(data));
  }

  document.addEventListener('DOMContentLoaded', function(event) {
    form = document.getElementById('primedba');
    var XHR = getRequestObject();

    XHR.addEventListener('load', function(event) {
      setTimeout(function() {
        disappear("loader", 500);
        setTimeout(function() {
          appear("form-container", 500);
        }, 500);
      }, 1000);
      var sel = document.getElementById('sluzba-id');
      var optX = document.createElement('option');
      optX.value = -1;
      optX.selected = true;
      optX.disabled = true;
      optX.hidden = true;
      optX.appendChild(document.createTextNode(''));
      sel.appendChild(optX);
      array = JSON.parse(event.target.responseText);
      for (var i = 0; i < array.length; i++) {
        var opt = document.createElement('option');
        opt.value = array[i].Id;
        opt.appendChild(document.createTextNode(array[i].Naziv));
        sel.appendChild(opt);
      }
    });

    XHR.addEventListener('error', function(event) {
      alert('\nГРЕШКА!\n\nДесила се грешка, покушајте поново.');
    });

    XHR.open('GET', apiRoot + 'api/Sluzbe', true);
    XHR.send();

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      form.disabled = true;
      grecaptcha.execute();
    });
  });

})(window);