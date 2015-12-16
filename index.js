'use strict';


var app,
    el;

el = document.querySelector('#application');

app = QCApplication({
  el: el,
  url: 'qc.json'
});
