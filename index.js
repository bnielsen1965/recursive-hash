
const FS = require('fs');
const Path = require('path');
const Exec = require('child_process').exec;

const Defaults = {
  path: './',
  hashCommand: 'md5sum',
  processHash: async (path, name, hash) => console.log(`${hash} : ${name} : ${path}`)
};

class RecursiveHash {
  // recursively search for files and perform hash
  static async search (settings) {
    settings = RecursiveHash.normalizeSettings(settings);
    let files = FS.readdirSync(settings.path);
    for (let i = 0; i < files.length; i++) {
      let path = Path.join(settings.path, files[i]);
      if (files[i] === '.' || files[i] === '..') continue;
      if (FS.lstatSync(path).isDirectory()) {
        await RecursiveHash.search(Object.assign({}, settings, { path }));
        continue;
      }
      let hash = await RecursiveHash.fileHash(path, settings);
      settings.processHash && await settings.processHash(path, Path.basename(path), hash);
    }
  }

  // generate hash for file at specified path
  static fileHash (path, settings) {
    return new Promise((resolve, reject) => {
      Exec(`${settings.hashCommand} "${path}"`, (error, stdout, stderr) => {
        resolve(stdout.toString().split(' ')[0].trim());
      });
    });
  }

  // use defaults to normalize settings
  static normalizeSettings (settings) {
    settings = Object.assign({}, Defaults, settings);
    settings.path = Path.resolve(settings.path);
    return settings;
  }
}

module.exports = RecursiveHash;
