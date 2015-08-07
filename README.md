# ExtJsPackages <a href="https://travis-ci.org/mayflower/ExtJsPackages/"><img src="https://api.travis-ci.org/mayflower/ExtJsPackages.svg" alt="Build Status" style="max-width:100%;"></a>
ExtJS Packages by Mayflower

## Using these packages in your application

* Add the repository
```
$ sencha repository add mayflower http://mayflower.github.io/ExtJsPackages
Sencha Cmd v5.1.3.61
[INF] Adding remote "mayflower"
[INF] Remote "mayflower" added
```
* Embed the packages
In your `app.js` adjust the requires array, e.g.:
```
"requires": [
    "ext-locale",
    "mf-grid-filter-form@1.1.1+",
    "mf-grid-celltooltip@1.0.0+"
]
```
* Use the code
    * See the ```example``` folder in the respective package folder for usage examples.
* Profit!

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

### Build Requirements

* ExtJS-5.1.1 ([direct download link](http://cdn.sencha.com/ext/gpl/ext-5.1.1-gpl.zip))
* [Sencha Cmd](http://www.sencha.com/products/sencha-cmd/)
* [JSDuck](https://github.com/senchalabs/jsduck)
* [NodeJS](https://nodejs.org/)
* [npm](https://www.npmjs.com/)

### Setup & Build

* Go to the `ExtJsPackages` directory.
```sh
    $ cd <path_to_workspace>/ExtJsPackages
```
* Install required node packages with npm:

```sh
    $ npm install
```
* [Download](http://cdn.sencha.com/ext/gpl/ext-5.1.1-gpl.zip) and extract the ExtJS framework files into the `ext` directory:

```sh
    $ unzip <path_to>/ext-5.1.1-gpl.zip
    $ mv ext-5.1.1 ext
```
* build the package with Sencha Cmd:

```sh
    $ (cd packages/mf-<package-name>; sencha package build)
```

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
    $ cd packages/<package-name>
    $ sencha package build
```

