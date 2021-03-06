var fs = require('fs');
var path = require('path');
var less = require('less');

function LessFile(file, dstFile) {
  this.file = file;
  this.dstFile = dstFile;
  this.imports = [];
  this.parser = new less.Parser({
    paths: path.dirname(file),
    filename: file
  });
}

LessFile.prototype = {
  parse: function(callback) {
    var self = this;
    this.parser.parse(fs.readFileSync(this.file, 'utf-8'), function(err) {
      self.imports = Object.keys(self.parser.imports.files);
      callback(err);
    });
  },

  compile: function(callback) {
    var self = this;
    this.parser.parse(fs.readFileSync(this.file, 'utf-8'), function(err, tree) {
      if (err) {
        callback(err);
      } else {
        try {
          fs.writeFileSync(self.dstFile, tree.toCSS(), 'utf-8');
          callback(null);
        } catch (err) {
          callback(err);
        }
      }
    });
  }
};

module.exports = LessFile;

