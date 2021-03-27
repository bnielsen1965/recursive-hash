# Recursive Hash

Recursively walk a path and hash files.

Provided a method to search a specified path recursively and calculate hash values
for all discovered files. Hash results are passed to a user provided hash processing
function.


# Usage

Use npm to install recursive-hash as a dependency in your application. Import the
recursive-hash module into your application and call the search() method with settings
for the path you wish to recursively search and hash files.

Example:
```javascript
const RecursiveHash = require('recursive-hash');

let path = process.argv[2] || './';
let processHash = (path, name, hash) => {
  console.log(`Hash: ${hash}, Filename: ${name}, Path: ${path}`);
}

return RecursiveHash.search({ path, processHash, hashCommand: 'sha1sum' })
  .catch(error => {
    console.log(`Error: ${error}`);
    process.exit(1);
  });
```


# Settings

The search method accepts settings that are used to define the starting path for
the recursive search, the command to use when calculating a file hash, and a function
to process the resulting file hash details.

While the search method has a full set of default settings it is likely that you
will want custom path and processHash settings.

Default settings:
```javascript
const Defaults = {
  path: './',
  hashCommand: 'md5sum',
  processHash: async (path, name, hash) => console.log(`${hash} : ${name} : ${path}`),
  continueOnError: true,
  onError: null
};
```


## path

The path setting passed to the search method is the start path for the recursive
search for files to hash.


## processHash

The processHash setting is used to specify an asynchronous function that is used
to process the results from a file hash. This function is passed the hash, file
path, and file name as arguments.

If the provided processHash function is asynchronous then the search process will
wait for the processHash function to complete before proceeding to the next file
or directory in the recursive search.

Example processHash function:
```javascript
let processHash = async (path, name, hash) => {
  console.log(`Hash: ${hash}, Filename: ${name}, Path: ${path}`);
}
```


## continueOnError

When an error occurs while performing the recursive search and hash the process
will skip the file or directory where the error occurred and continue on. If the
*continueOnError* setting is set to false then the process will stop if an error
occurs.


## onError

An optional *onError* function can be provided in the settings to process any errors
that occur during the recursive search and hash. The function should accept an
error object for processing.

Example search with an onError method:
```javascript
const RecursiveHash = require('recursive-hash');
RecursiveHash.search({
  path,
  processHash,
  continueOnError: true,
  onError: error => console.log(`Error: ${error.message}`)
});
```

The recursive search and hash will continue after processing any provided onError
method.



## hashCommand

The hashCommand setting is used to specify the operating system shell command that
should be used to calculate a file hash. When a file is discovered by the recursive
search the specified hashCommand will be called as a child process and the results
off the hash command's output in the shell will be used as the hash value.
