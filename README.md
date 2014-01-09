
emscripten-tools
================

## NOTE 

I am using this project in my own projects and evolving it on demand. Solutions may be tightly adopted to my environment. But implemented features are tested and should works fine.

## Motivation

First feature of this project (and single for now) helps to working with arrays passed by reference into javascript-wrapper of c-function.

## Background

Documentation wrote assuming you are famous with npm, requirejs, emscripten
TODO: links here

## Features

### CArrayRef

This is representation of reference to array which may be passed to c-function.
General usage is wrap array by CArrayRef instance and pass it into function as pointer arrRef.ptr. Then changes in array may be retreived as arrRef.getArray() or arrRef.getTypedArray()

@see comments in js/lib/c-array-ref.js for details

#### Basic usage

    // assuming Module is emscripten Module
    var arrRef = new CArrayRef(Module, [1,2,3], 'uint32');
    // avail types: [u]int[8,16,32] @see CArrayRef.TYPES_ARRAYS 

    // general pattern for passing array into c-function
    wrappedCFunc(arrRef.ptr, arrRef.itemsCount);

    // if wrappedCFunc mades some changes in array we can access it
    var arr = arrRef.getArray(); // NOTE: it will makes copy data

    // or
    var typedArr = arrRef.getTypedArray();  // NOTE: it shared TypedArray which will be changed if we call function again or pass arrRef.ptr into other similar function    


## Setup

    git clone this

## Test

    npm install -g karma   # may be skipped if you will call karma from node_modules/.bin/karma
    npm install
    karama start

### Testing layout

Directory `test` contains general testing configuration and data.

Most important:
 * `test-main.js` - settings of testing framework for requirejs
 * `array-param.c` - cample of c-function
 * `array-param.js` - compiled sample by emscripten

Karma settings placed in `karma.conf.js`

### Using C-code sample

Sample already compiled into `test/array-param.js` by emscripten.
If you would like to recomile it you may invoke `make` inside `test` directory.
You need installed emscripten SDK (TODO:link here)

Also see `make clean` inside `test/Makefile`

## Copyleft

It is opensource and free.
