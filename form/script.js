(function(global) {

  var apiRoot = 'http://10.0.1.251:8090/';
  var form = null;

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

  function sendData() {
    var XHR = getRequestObject();
    var FD = new FormData(form);

    // Define what happens on successful data submission
    XHR.addEventListener('load', function(event) {
      alert(event.target.responseText);
    });

    // Define what happens in case of error
    XHR.addEventListener('error', function(event) {
      alert('Oops! Something went wrong.');
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
        e[1] = e[1].replace(/\s+/g,' ').trim();
      else if (e[0] === 'SluzbaId')
        e[1] = Number(e[1]);
      else if (e[0] === 'ObracanjeSluzbi')
        e[1] = JSON.parse(e[1]);
      data[e[0]] = e[1];
    }
    if (data.ObracanjeSluzbi === false)
      data.ObracanjeKome = null;

    console.log(data);
    console.log(apiRoot + 'api/rgz_primedbe/post?token=testje&primedbe=' + encodeURIComponent(data));
    XHR.open('POST', apiRoot + 'api/rgz_primedbe/post?token=testje', true);
    XHR.send(data);
  }

  document.addEventListener('DOMContentLoaded', function(event) {
    form = document.getElementById('primedba');
    var XHR = getRequestObject();

    XHR.addEventListener('load', function(event) {
      document.getElementById('loader').remove();
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
      alert('Oops! Something went wrong.');
    });

    XHR.open('GET', apiRoot + 'api/Sluzbe', true);
    XHR.send();

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      sendData();

      //document.getElementById('primedba').reset();
      //document.getElementById('sluzba-id').children[0].selected = true;
    });
  });

})(window);