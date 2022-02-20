String.prototype.toTitleCase = function () {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

// Sanitize a string to be passed as parameter: trim, lowercase
String.prototype.sanitize = function () {
  return this.trim().toLowerCase();
};
