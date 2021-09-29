// GraphQL-Crunch is fully backwards-compatible. This module routes into the
// proper implementation.

const versions = [require("./v1"), require("./v2")];

module.exports = {
  crunch: (data, version = 1) =>
    version === 1
      ? versions[0].crunch(data)
      : version > versions.length
      ? versions[0].crunch(data)
      : { version, crunched: versions[version - 1].crunch(data) },

  uncrunch: (data) =>
    data.version == null
      ? versions[0].uncrunch(data)
      : versions[data.version - 1].uncrunch(data.crunched),
};
