const newlineRegex = /(\r\n|\r|\n)/g;

export const nl2br = (str) => {
  if (typeof str !== 'string') {
    return str;
  }

  return str.split(newlineRegex).map(function(line, index) {
    if (line.match(newlineRegex)) {
      return <br key={index} />
    }
    return line;
  });
};