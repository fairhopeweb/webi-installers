'use strict';

var path = require('path');

var github = require('../_common/github.js');
var owner = 'denoland';
var repo = 'deno';

module.exports = function () {
  return github(null, owner, repo).then(function (all) {
    // remove checksums and .deb
    all.releases = all.releases
      .filter(function (rel) {
        let isMeta = rel.name.endsWith('.d.ts');
        if (isMeta) {
          return false;
        }

        return true;
      })
      .map(function (rel) {
        var ext;
        if (!rel.name.match(rel.version)) {
          ext = path.extname(rel.name);
          rel.filename =
            rel.name.slice(0, rel.name.length - ext.length) +
            '-' +
            rel.version +
            ext;
        }
        return rel;
      });
    return all;
  });
};

if (module === require.main) {
  module.exports().then(function (all) {
    all = require('../_webi/normalize.js')(all);
    console.info(JSON.stringify(all, null, 2));
  });
}
