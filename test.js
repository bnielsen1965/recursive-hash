
const RecursiveHash = require('./index.js'); // normally we would use require('recursive-hash');

let path = process.argv[2] || './';
let processHash = async (path, name, hash) => {
  console.log(`Hash: ${hash}, Filename: ${name}, Path: ${path}`);
}

return RecursiveHash.search({ path, processHash, hashCommand: 'sha1sum' })
  .catch(error => {
    console.log(`Error: ${error}`);
    process.exit(1);
  });
