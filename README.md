# ExtJsPackages <a href="https://travis-ci.org/mayflower/ExtJsPackages/"><img src="https://api.travis-ci.org/mayflower/ExtJsPackages.svg" alt="Build Status" style="max-width:100%;"></a>
ExtJS Packages by Mayflower

## Requirements

* ExtJS-5.1 [direct download link](http://cdn.sencha.com/ext/gpl/ext-5.1.0-gpl.zip)
* [Sencha Cmd](http://www.sencha.com/products/sencha-cmd/)
* [JSDuck](https://github.com/senchalabs/jsduck)
* [NodeJS](https://nodejs.org/)
* [npm](https://www.npmjs.com/)

## Setup & Build

1. Go to the `ExtJsPackages` directory.
```sh
    $ cd <path_to_workspace>/ExtJsPackages
```
2. Install required node packages with npm:

```sh
    $ npm install
```
3. Extract the ExtJS framework files into the `ext` directory:

```sh
    $ unzip <path_to>/ext-5.1.0-gpl.zip
    $ mv ext-5.1.0 ext
```
4. build the package with Sencha Cmd:

```sh
    $ (cd packages/mf-grid-filter-form; sencha package build)
```
## Contributing

### Getting started

* Fork the [mayflower/ExtJsPackages](https://github.com/mayflower/ExtJsPackages) to your own GitHub account.
* Clone the **fork** to your machine:

```sh
    $ cd <path_to_workspace>
    $ git clone https://github.com/<your github account>/ExtJsPackages.git
    $ cd ExtJsPackages
```
* Checkout out a new branch to make your changes on:

```sh
    $ git checkout -b <your_new_patch>
```
* Have a look at [Sencha's Guide to JavaScript Style and Best Practices](https://github.com/sencha/code-guidelines)
* Read the [JSDuck documentation](https://github.com/senchalabs/jsduck/wiki) and take a look at [JSduck example.js](https://github.com/senchalabs/jsduck/blob/master/opt/example.js).
* Use [Jasmine](http://jasmine.github.io/) to write tests for your new code.

### Before you submit your contribution

* Run tests:

```sh
    $ npm test
```
* Check code style:

```sh
    $ ./node_modules/jscs/bin/jscs packages
```
* Make sure that sencha packaging runs fine:

```sh
    $ cd packages/<name>
    $ sencha package build
```
