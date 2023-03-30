'use strict';

var jsxRuntime = require('react/jsx-runtime');
var _jsx = jsxRuntime.jsx;
var newlineRegex = /(\r\n|\r|\n)/g;

export const nl2br = (str) => {
  if (typeof str !== 'string') {
    return str;
  }

  return str.split(newlineRegex).map(function(line, index) {
    if (line.match(newlineRegex)) {
      return _jsx('br', { key: index });
    }
    return line;
  });
};