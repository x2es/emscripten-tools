// Note: Some Emscripten settings will significantly limit the speed of the generated code.
// Note: Some Emscripten settings may limit the speed of the generated code.
// The Module object: Our interface to the outside world. We import
// and export values on it, and do the work to get that through
// closure compiler if necessary. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to do an eval in order to handle the closure compiler
// case, where this code here is minified but Module was defined
// elsewhere (e.g. case 4 above). We also need to check if Module
// already exists (e.g. case 3 above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
 
var CParamsPtrs = {
  noInitialRun: true,
  print: function() {
    console.log('CParamsPtrs.print', arguments);
  }
};

(function(Module) {
  var Module;
  if (!Module) Module = eval('(function() { try { return Module || {} } catch(e) { return {} } })()');
  // Sometimes an existing Module object exists with properties
  // meant to overwrite the default module functionality. Here
  // we collect those properties and reapply _after_ we configure
  // the current environment's defaults to avoid having to be so
  // defensive during initialization.
  var moduleOverrides = {};
  for (var key in Module) {
    if (Module.hasOwnProperty(key)) {
      moduleOverrides[key] = Module[key];
    }
  }
  // The environment setup code below is customized to use Module.
  // *** Environment setup code ***
  var ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function';
  var ENVIRONMENT_IS_WEB = typeof window === 'object';
  var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
  var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
  if (ENVIRONMENT_IS_NODE) {
    // Expose functionality in the same simple way that the shells work
    // Note that we pollute the global namespace here, otherwise we break in node
    Module['print'] = function print(x) {
      process['stdout'].write(x + '\n');
    };
    Module['printErr'] = function printErr(x) {
      process['stderr'].write(x + '\n');
    };
    var nodeFS = require('fs');
    var nodePath = require('path');
    Module['read'] = function read(filename, binary) {
      filename = nodePath['normalize'](filename);
      var ret = nodeFS['readFileSync'](filename);
      // The path is absolute if the normalized version is the same as the resolved.
      if (!ret && filename != nodePath['resolve'](filename)) {
        filename = path.join(__dirname, '..', 'src', filename);
        ret = nodeFS['readFileSync'](filename);
      }
      if (ret && !binary) ret = ret.toString();
      return ret;
    };
    Module['readBinary'] = function readBinary(filename) { return Module['read'](filename, true) };
    Module['load'] = function load(f) {
      globalEval(read(f));
    };
    Module['arguments'] = process['argv'].slice(2);
    module['exports'] = Module;
  }
  else if (ENVIRONMENT_IS_SHELL) {
    Module['print'] = print;
    if (typeof printErr != 'undefined') Module['printErr'] = printErr; // not present in v8 or older sm
    if (typeof read != 'undefined') {
      Module['read'] = read;
    } else {
      Module['read'] = function read() { throw 'no read() available (jsc?)' };
    }
    Module['readBinary'] = function readBinary(f) {
      return read(f, 'binary');
    };
    if (typeof scriptArgs != 'undefined') {
      Module['arguments'] = scriptArgs;
    } else if (typeof arguments != 'undefined') {
      Module['arguments'] = arguments;
    }
    this['Module'] = Module;
    eval("if (typeof gc === 'function' && gc.toString().indexOf('[native code]') > 0) var gc = undefined"); // wipe out the SpiderMonkey shell 'gc' function, which can confuse closure (uses it as a minified name, and it is then initted to a non-falsey value unexpectedly)
  }
  else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
    Module['read'] = function read(url) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);
      xhr.send(null);
      return xhr.responseText;
    };
    if (typeof arguments != 'undefined') {
      Module['arguments'] = arguments;
    }
    if (typeof console !== 'undefined') {
      Module['print'] = function print(x) {
        console.log(x);
      };
      Module['printErr'] = function printErr(x) {
        console.log(x);
      };
    } else {
      // Probably a worker, and without console.log. We can do very little here...
      var TRY_USE_DUMP = false;
      Module['print'] = (TRY_USE_DUMP && (typeof(dump) !== "undefined") ? (function(x) {
        dump(x);
      }) : (function(x) {
        // self.postMessage(x); // enable this if you want stdout to be sent as messages
      }));
    }
    if (ENVIRONMENT_IS_WEB) {
      this['Module'] = Module;
    } else {
      Module['load'] = importScripts;
    }
  }
  else {
    // Unreachable because SHELL is dependant on the others
    throw 'Unknown runtime environment. Where are we?';
  }
  function globalEval(x) {
    eval.call(null, x);
  }
  if (!Module['load'] == 'undefined' && Module['read']) {
    Module['load'] = function load(f) {
      globalEval(Module['read'](f));
    };
  }
  if (!Module['print']) {
    Module['print'] = function(){};
  }
  if (!Module['printErr']) {
    Module['printErr'] = Module['print'];
  }
  if (!Module['arguments']) {
    Module['arguments'] = [];
  }
  // *** Environment setup code ***
  // Closure helpers
  Module.print = Module['print'];
  Module.printErr = Module['printErr'];
  // Callbacks
  Module['preRun'] = [];
  Module['postRun'] = [];
  // Merge back in the overrides
  for (var key in moduleOverrides) {
    if (moduleOverrides.hasOwnProperty(key)) {
      Module[key] = moduleOverrides[key];
    }
  }
  // === Auto-generated preamble library stuff ===
  //========================================
  // Runtime code shared with compiler
  //========================================
  var Runtime = {
    stackSave: function () {
      return STACKTOP;
    },
    stackRestore: function (stackTop) {
      STACKTOP = stackTop;
    },
    forceAlign: function (target, quantum) {
      quantum = quantum || 4;
      if (quantum == 1) return target;
      if (isNumber(target) && isNumber(quantum)) {
        return Math.ceil(target/quantum)*quantum;
      } else if (isNumber(quantum) && isPowerOfTwo(quantum)) {
        return '(((' +target + ')+' + (quantum-1) + ')&' + -quantum + ')';
      }
      return 'Math.ceil((' + target + ')/' + quantum + ')*' + quantum;
    },
    isNumberType: function (type) {
      return type in Runtime.INT_TYPES || type in Runtime.FLOAT_TYPES;
    },
    isPointerType: function isPointerType(type) {
    return type[type.length-1] == '*';
  },
    isStructType: function isStructType(type) {
    if (isPointerType(type)) return false;
    if (isArrayType(type)) return true;
    if (/<?{ ?[^}]* ?}>?/.test(type)) return true; // { i32, i8 } etc. - anonymous struct types
    // See comment in isStructPointerType()
    return type[0] == '%';
  },
    INT_TYPES: {"i1":0,"i8":0,"i16":0,"i32":0,"i64":0},
    FLOAT_TYPES: {"float":0,"double":0},
    or64: function (x, y) {
      var l = (x | 0) | (y | 0);
      var h = (Math.round(x / 4294967296) | Math.round(y / 4294967296)) * 4294967296;
      return l + h;
    },
    and64: function (x, y) {
      var l = (x | 0) & (y | 0);
      var h = (Math.round(x / 4294967296) & Math.round(y / 4294967296)) * 4294967296;
      return l + h;
    },
    xor64: function (x, y) {
      var l = (x | 0) ^ (y | 0);
      var h = (Math.round(x / 4294967296) ^ Math.round(y / 4294967296)) * 4294967296;
      return l + h;
    },
    getNativeTypeSize: function (type) {
      switch (type) {
        case 'i1': case 'i8': return 1;
        case 'i16': return 2;
        case 'i32': return 4;
        case 'i64': return 8;
        case 'float': return 4;
        case 'double': return 8;
        default: {
          if (type[type.length-1] === '*') {
            return Runtime.QUANTUM_SIZE; // A pointer
          } else if (type[0] === 'i') {
            var bits = parseInt(type.substr(1));
            assert(bits % 8 === 0);
            return bits/8;
          } else {
            return 0;
          }
        }
      }
    },
    getNativeFieldSize: function (type) {
      return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE);
    },
    dedup: function dedup(items, ident) {
    var seen = {};
    if (ident) {
      return items.filter(function(item) {
        if (seen[item[ident]]) return false;
        seen[item[ident]] = true;
        return true;
      });
    } else {
      return items.filter(function(item) {
        if (seen[item]) return false;
        seen[item] = true;
        return true;
      });
    }
  },
    set: function set() {
    var args = typeof arguments[0] === 'object' ? arguments[0] : arguments;
    var ret = {};
    for (var i = 0; i < args.length; i++) {
      ret[args[i]] = 0;
    }
    return ret;
  },
    STACK_ALIGN: 8,
    getAlignSize: function (type, size, vararg) {
      // we align i64s and doubles on 64-bit boundaries, unlike x86
      if (vararg) return 8;
      if (!vararg && (type == 'i64' || type == 'double')) return 8;
      if (!type) return Math.min(size, 8); // align structures internally to 64 bits
      return Math.min(size || (type ? Runtime.getNativeFieldSize(type) : 0), Runtime.QUANTUM_SIZE);
    },
    calculateStructAlignment: function calculateStructAlignment(type) {
      type.flatSize = 0;
      type.alignSize = 0;
      var diffs = [];
      var prev = -1;
      var index = 0;
      type.flatIndexes = type.fields.map(function(field) {
        index++;
        var size, alignSize;
        if (Runtime.isNumberType(field) || Runtime.isPointerType(field)) {
          size = Runtime.getNativeTypeSize(field); // pack char; char; in structs, also char[X]s.
          alignSize = Runtime.getAlignSize(field, size);
        } else if (Runtime.isStructType(field)) {
          if (field[1] === '0') {
            // this is [0 x something]. When inside another structure like here, it must be at the end,
            // and it adds no size
            // XXX this happens in java-nbody for example... assert(index === type.fields.length, 'zero-length in the middle!');
            size = 0;
            if (Types.types[field]) {
              alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
            } else {
              alignSize = type.alignSize || QUANTUM_SIZE;
            }
          } else {
            size = Types.types[field].flatSize;
            alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
          }
        } else if (field[0] == 'b') {
          // bN, large number field, like a [N x i8]
          size = field.substr(1)|0;
          alignSize = 1;
        } else if (field[0] === '<') {
          // vector type
          size = alignSize = Types.types[field].flatSize; // fully aligned
        } else if (field[0] === 'i') {
          // illegal integer field, that could not be legalized because it is an internal structure field
          // it is ok to have such fields, if we just use them as markers of field size and nothing more complex
          size = alignSize = parseInt(field.substr(1))/8;
          assert(size % 1 === 0, 'cannot handle non-byte-size field ' + field);
        } else {
          assert(false, 'invalid type for calculateStructAlignment');
        }
        if (type.packed) alignSize = 1;
        type.alignSize = Math.max(type.alignSize, alignSize);
        var curr = Runtime.alignMemory(type.flatSize, alignSize); // if necessary, place this on aligned memory
        type.flatSize = curr + size;
        if (prev >= 0) {
          diffs.push(curr-prev);
        }
        prev = curr;
        return curr;
      });
      if (type.name_ && type.name_[0] === '[') {
        // arrays have 2 elements, so we get the proper difference. then we scale here. that way we avoid
        // allocating a potentially huge array for [999999 x i8] etc.
        type.flatSize = parseInt(type.name_.substr(1))*type.flatSize/2;
      }
      type.flatSize = Runtime.alignMemory(type.flatSize, type.alignSize);
      if (diffs.length == 0) {
        type.flatFactor = type.flatSize;
      } else if (Runtime.dedup(diffs).length == 1) {
        type.flatFactor = diffs[0];
      }
      type.needsFlattening = (type.flatFactor != 1);
      return type.flatIndexes;
    },
    generateStructInfo: function (struct, typeName, offset) {
      var type, alignment;
      if (typeName) {
        offset = offset || 0;
        type = (typeof Types === 'undefined' ? Runtime.typeInfo : Types.types)[typeName];
        if (!type) return null;
        if (type.fields.length != struct.length) {
          printErr('Number of named fields must match the type for ' + typeName + ': possibly duplicate struct names. Cannot return structInfo');
          return null;
        }
        alignment = type.flatIndexes;
      } else {
        var type = { fields: struct.map(function(item) { return item[0] }) };
        alignment = Runtime.calculateStructAlignment(type);
      }
      var ret = {
        __size__: type.flatSize
      };
      if (typeName) {
        struct.forEach(function(item, i) {
          if (typeof item === 'string') {
            ret[item] = alignment[i] + offset;
          } else {
            // embedded struct
            var key;
            for (var k in item) key = k;
            ret[key] = Runtime.generateStructInfo(item[key], type.fields[i], alignment[i]);
          }
        });
      } else {
        struct.forEach(function(item, i) {
          ret[item[1]] = alignment[i];
        });
      }
      return ret;
    },
    dynCall: function (sig, ptr, args) {
      if (args && args.length) {
        assert(args.length == sig.length-1);
        return FUNCTION_TABLE[ptr].apply(null, args);
      } else {
        assert(sig.length == 1);
        return FUNCTION_TABLE[ptr]();
      }
    },
    addFunction: function (func) {
      var table = FUNCTION_TABLE;
      var ret = table.length;
      assert(ret % 2 === 0);
      table.push(func);
      for (var i = 0; i < 2-1; i++) table.push(0);
      return ret;
    },
    removeFunction: function (index) {
      var table = FUNCTION_TABLE;
      table[index] = null;
    },
    getAsmConst: function (code, numArgs) {
      // code is a constant string on the heap, so we can cache these
      if (!Runtime.asmConstCache) Runtime.asmConstCache = {};
      var func = Runtime.asmConstCache[code];
      if (func) return func;
      var args = [];
      for (var i = 0; i < numArgs; i++) {
        args.push(String.fromCharCode(36) + i); // $0, $1 etc
      }
      return Runtime.asmConstCache[code] = eval('(function(' + args.join(',') + '){ ' + Pointer_stringify(code) + ' })'); // new Function does not allow upvars in node
    },
    warnOnce: function (text) {
      if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
      if (!Runtime.warnOnce.shown[text]) {
        Runtime.warnOnce.shown[text] = 1;
        Module.printErr(text);
      }
    },
    funcWrappers: {},
    getFuncWrapper: function (func, sig) {
      assert(sig);
      if (!Runtime.funcWrappers[func]) {
        Runtime.funcWrappers[func] = function dynCall_wrapper() {
          return Runtime.dynCall(sig, func, arguments);
        };
      }
      return Runtime.funcWrappers[func];
    },
    UTF8Processor: function () {
      var buffer = [];
      var needed = 0;
      this.processCChar = function (code) {
        code = code & 0xFF;
        if (buffer.length == 0) {
          if ((code & 0x80) == 0x00) {        // 0xxxxxxx
            return String.fromCharCode(code);
          }
          buffer.push(code);
          if ((code & 0xE0) == 0xC0) {        // 110xxxxx
            needed = 1;
          } else if ((code & 0xF0) == 0xE0) { // 1110xxxx
            needed = 2;
          } else {                            // 11110xxx
            needed = 3;
          }
          return '';
        }
        if (needed) {
          buffer.push(code);
          needed--;
          if (needed > 0) return '';
        }
        var c1 = buffer[0];
        var c2 = buffer[1];
        var c3 = buffer[2];
        var c4 = buffer[3];
        var ret;
        if (buffer.length == 2) {
          ret = String.fromCharCode(((c1 & 0x1F) << 6)  | (c2 & 0x3F));
        } else if (buffer.length == 3) {
          ret = String.fromCharCode(((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6)  | (c3 & 0x3F));
        } else {
          // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
          var codePoint = ((c1 & 0x07) << 18) | ((c2 & 0x3F) << 12) |
                          ((c3 & 0x3F) << 6)  | (c4 & 0x3F);
          ret = String.fromCharCode(
            Math.floor((codePoint - 0x10000) / 0x400) + 0xD800,
            (codePoint - 0x10000) % 0x400 + 0xDC00);
        }
        buffer.length = 0;
        return ret;
      }
      this.processJSString = function processJSString(string) {
        string = unescape(encodeURIComponent(string));
        var ret = [];
        for (var i = 0; i < string.length; i++) {
          ret.push(string.charCodeAt(i));
        }
        return ret;
      }
    },
    stackAlloc: function (size) { var ret = STACKTOP;STACKTOP = (STACKTOP + size)|0;STACKTOP = (((STACKTOP)+7)&-8);(assert((STACKTOP|0) < (STACK_MAX|0))|0); return ret; },
    staticAlloc: function (size) { var ret = STATICTOP;STATICTOP = (STATICTOP + (assert(!staticSealed),size))|0;STATICTOP = (((STATICTOP)+7)&-8); return ret; },
    dynamicAlloc: function (size) { var ret = DYNAMICTOP;DYNAMICTOP = (DYNAMICTOP + (assert(DYNAMICTOP > 0),size))|0;DYNAMICTOP = (((DYNAMICTOP)+7)&-8); if (DYNAMICTOP >= TOTAL_MEMORY) enlargeMemory();; return ret; },
    alignMemory: function (size,quantum) { var ret = size = Math.ceil((size)/(quantum ? quantum : 8))*(quantum ? quantum : 8); return ret; },
    makeBigInt: function (low,high,unsigned) { var ret = (unsigned ? ((low>>>0)+((high>>>0)*4294967296)) : ((low>>>0)+((high|0)*4294967296))); return ret; },
    GLOBAL_BASE: 8,
    QUANTUM_SIZE: 4,
    __dummy__: 0
  }
  //========================================
  // Runtime essentials
  //========================================
  var __THREW__ = 0; // Used in checking for thrown exceptions.
  var setjmpId = 1; // Used in setjmp/longjmp
  var setjmpLabels = {};
  var ABORT = false; // whether we are quitting the application. no code should run after this. set in exit() and abort()
  var EXITSTATUS = 0;
  var undef = 0;
  // tempInt is used for 32-bit signed values or smaller. tempBigInt is used
  // for 32-bit unsigned values or more than 32 bits. TODO: audit all uses of tempInt
  var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD, tempDouble, tempFloat;
  var tempI64, tempI64b;
  var tempRet0, tempRet1, tempRet2, tempRet3, tempRet4, tempRet5, tempRet6, tempRet7, tempRet8, tempRet9;
  function assert(condition, text) {
    if (!condition) {
      abort('Assertion failed: ' + text);
    }
  }
  var globalScope = this;
  // C calling interface. A convenient way to call C functions (in C files, or
  // defined with extern "C").
  //
  // Note: LLVM optimizations can inline and remove functions, after which you will not be
  //       able to call them. Closure can also do so. To avoid that, add your function to
  //       the exports using something like
  //
  //         -s EXPORTED_FUNCTIONS='["_main", "_myfunc"]'
  //
  // @param ident      The name of the C function (note that C++ functions will be name-mangled - use extern "C")
  // @param returnType The return type of the function, one of the JS types 'number', 'string' or 'array' (use 'number' for any C pointer, and
  //                   'array' for JavaScript arrays and typed arrays; note that arrays are 8-bit).
  // @param argTypes   An array of the types of arguments for the function (if there are no arguments, this can be ommitted). Types are as in returnType,
  //                   except that 'array' is not possible (there is no way for us to know the length of the array)
  // @param args       An array of the arguments to the function, as native JS values (as in returnType)
  //                   Note that string arguments will be stored on the stack (the JS string will become a C string on the stack).
  // @return           The return value, as a native JS value (as in returnType)
  function ccall(ident, returnType, argTypes, args) {
    return ccallFunc(getCFunc(ident), returnType, argTypes, args);
  }
  Module["ccall"] = ccall;
  // Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
  function getCFunc(ident) {
    try {
      var func = Module['_' + ident]; // closure exported function
      if (!func) func = eval('_' + ident); // explicit lookup
    } catch(e) {
    }
    assert(func, 'Cannot call unknown function ' + ident + ' (perhaps LLVM optimizations or closure removed it?)');
    return func;
  }
  // Internal function that does a C call using a function, not an identifier
  function ccallFunc(func, returnType, argTypes, args) {
    var stack = 0;
    function toC(value, type) {
      if (type == 'string') {
        if (value === null || value === undefined || value === 0) return 0; // null string
        value = intArrayFromString(value);
        type = 'array';
      }
      if (type == 'array') {
        if (!stack) stack = Runtime.stackSave();
        var ret = Runtime.stackAlloc(value.length);
        writeArrayToMemory(value, ret);
        return ret;
      }
      return value;
    }
    function fromC(value, type) {
      if (type == 'string') {
        return Pointer_stringify(value);
      }
      assert(type != 'array');
      return value;
    }
    var i = 0;
    var cArgs = args ? args.map(function(arg) {
      return toC(arg, argTypes[i++]);
    }) : [];
    var ret = fromC(func.apply(null, cArgs), returnType);
    if (stack) Runtime.stackRestore(stack);
    return ret;
  }
  // Returns a native JS wrapper for a C function. This is similar to ccall, but
  // returns a function you can call repeatedly in a normal way. For example:
  //
  //   var my_function = cwrap('my_c_function', 'number', ['number', 'number']);
  //   alert(my_function(5, 22));
  //   alert(my_function(99, 12));
  //
  function cwrap(ident, returnType, argTypes) {
    var func = getCFunc(ident);
    return function() {
      return ccallFunc(func, returnType, argTypes, Array.prototype.slice.call(arguments));
    }
  }
  Module["cwrap"] = cwrap;
  // Sets a value in memory in a dynamic way at run-time. Uses the
  // type data. This is the same as makeSetValue, except that
  // makeSetValue is done at compile-time and generates the needed
  // code then, whereas this function picks the right code at
  // run-time.
  // Note that setValue and getValue only do *aligned* writes and reads!
  // Note that ccall uses JS types as for defining types, while setValue and
  // getValue need LLVM types ('i8', 'i32') - this is a lower-level operation
  function setValue(ptr, value, type, noSafe) {
    type = type || 'i8';
    if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
      switch(type) {
        case 'i1': HEAP8[(ptr)]=value; break;
        case 'i8': HEAP8[(ptr)]=value; break;
        case 'i16': HEAP16[((ptr)>>1)]=value; break;
        case 'i32': HEAP32[((ptr)>>2)]=value; break;
        case 'i64': (tempI64 = [value>>>0,(tempDouble=value,Math_abs(tempDouble) >= 1 ? (tempDouble > 0 ? Math_min(Math_floor((tempDouble)/4294967296), 4294967295)>>>0 : (~~(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296)))>>>0) : 0)],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
        case 'float': HEAPF32[((ptr)>>2)]=value; break;
        case 'double': HEAPF64[((ptr)>>3)]=value; break;
        default: abort('invalid type for setValue: ' + type);
      }
  }
  Module['setValue'] = setValue;
  // Parallel to setValue.
  function getValue(ptr, type, noSafe) {
    type = type || 'i8';
    if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
      switch(type) {
        case 'i1': return HEAP8[(ptr)];
        case 'i8': return HEAP8[(ptr)];
        case 'i16': return HEAP16[((ptr)>>1)];
        case 'i32': return HEAP32[((ptr)>>2)];
        case 'i64': return HEAP32[((ptr)>>2)];
        case 'float': return HEAPF32[((ptr)>>2)];
        case 'double': return HEAPF64[((ptr)>>3)];
        default: abort('invalid type for setValue: ' + type);
      }
    return null;
  }
  Module['getValue'] = getValue;
  var ALLOC_NORMAL = 0; // Tries to use _malloc()
  var ALLOC_STACK = 1; // Lives for the duration of the current function call
  var ALLOC_STATIC = 2; // Cannot be freed
  var ALLOC_DYNAMIC = 3; // Cannot be freed except through sbrk
  var ALLOC_NONE = 4; // Do not allocate
  Module['ALLOC_NORMAL'] = ALLOC_NORMAL;
  Module['ALLOC_STACK'] = ALLOC_STACK;
  Module['ALLOC_STATIC'] = ALLOC_STATIC;
  Module['ALLOC_DYNAMIC'] = ALLOC_DYNAMIC;
  Module['ALLOC_NONE'] = ALLOC_NONE;
  // allocate(): This is for internal use. You can use it yourself as well, but the interface
  //             is a little tricky (see docs right below). The reason is that it is optimized
  //             for multiple syntaxes to save space in generated code. So you should
  //             normally not use allocate(), and instead allocate memory using _malloc(),
  //             initialize it with setValue(), and so forth.
  // @slab: An array of data, or a number. If a number, then the size of the block to allocate,
  //        in *bytes* (note that this is sometimes confusing: the next parameter does not
  //        affect this!)
  // @types: Either an array of types, one for each byte (or 0 if no type at that position),
  //         or a single type which is used for the entire block. This only matters if there
  //         is initial data - if @slab is a number, then this does not matter at all and is
  //         ignored.
  // @allocator: How to allocate memory, see ALLOC_*
  function allocate(slab, types, allocator, ptr) {
    var zeroinit, size;
    if (typeof slab === 'number') {
      zeroinit = true;
      size = slab;
    } else {
      zeroinit = false;
      size = slab.length;
    }
    var singleType = typeof types === 'string' ? types : null;
    var ret;
    if (allocator == ALLOC_NONE) {
      ret = ptr;
    } else {
      ret = [_malloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
    }
    if (zeroinit) {
      var ptr = ret, stop;
      assert((ret & 3) == 0);
      stop = ret + (size & ~3);
      for (; ptr < stop; ptr += 4) {
        HEAP32[((ptr)>>2)]=0;
      }
      stop = ret + size;
      while (ptr < stop) {
        HEAP8[((ptr++)|0)]=0;
      }
      return ret;
    }
    if (singleType === 'i8') {
      if (slab.subarray || slab.slice) {
        HEAPU8.set(slab, ret);
      } else {
        HEAPU8.set(new Uint8Array(slab), ret);
      }
      return ret;
    }
    var i = 0, type, typeSize, previousType;
    while (i < size) {
      var curr = slab[i];
      if (typeof curr === 'function') {
        curr = Runtime.getFunctionIndex(curr);
      }
      type = singleType || types[i];
      if (type === 0) {
        i++;
        continue;
      }
      assert(type, 'Must know what type to store in allocate!');
      if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later
      setValue(ret+i, curr, type);
      // no need to look up size unless type changes, so cache it
      if (previousType !== type) {
        typeSize = Runtime.getNativeTypeSize(type);
        previousType = type;
      }
      i += typeSize;
    }
    return ret;
  }
  Module['allocate'] = allocate;
  function Pointer_stringify(ptr, /* optional */ length) {
    // TODO: use TextDecoder
    // Find the length, and check for UTF while doing so
    var hasUtf = false;
    var t;
    var i = 0;
    while (1) {
      assert(ptr + i < TOTAL_MEMORY);
      t = HEAPU8[(((ptr)+(i))|0)];
      if (t >= 128) hasUtf = true;
      else if (t == 0 && !length) break;
      i++;
      if (length && i == length) break;
    }
    if (!length) length = i;
    var ret = '';
    if (!hasUtf) {
      var MAX_CHUNK = 1024; // split up into chunks, because .apply on a huge string can overflow the stack
      var curr;
      while (length > 0) {
        curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
        ret = ret ? ret + curr : curr;
        ptr += MAX_CHUNK;
        length -= MAX_CHUNK;
      }
      return ret;
    }
    var utf8 = new Runtime.UTF8Processor();
    for (i = 0; i < length; i++) {
      assert(ptr + i < TOTAL_MEMORY);
      t = HEAPU8[(((ptr)+(i))|0)];
      ret += utf8.processCChar(t);
    }
    return ret;
  }
  Module['Pointer_stringify'] = Pointer_stringify;
  // Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
  // a copy of that string as a Javascript String object.
  function UTF16ToString(ptr) {
    var i = 0;
    var str = '';
    while (1) {
      var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
      if (codeUnit == 0)
        return str;
      ++i;
      // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
      str += String.fromCharCode(codeUnit);
    }
  }
  Module['UTF16ToString'] = UTF16ToString;
  // Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
  // null-terminated and encoded in UTF16LE form. The copy will require at most (str.length*2+1)*2 bytes of space in the HEAP.
  function stringToUTF16(str, outPtr) {
    for(var i = 0; i < str.length; ++i) {
      // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
      var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
      HEAP16[(((outPtr)+(i*2))>>1)]=codeUnit;
    }
    // Null-terminate the pointer to the HEAP.
    HEAP16[(((outPtr)+(str.length*2))>>1)]=0;
  }
  Module['stringToUTF16'] = stringToUTF16;
  // Given a pointer 'ptr' to a null-terminated UTF32LE-encoded string in the emscripten HEAP, returns
  // a copy of that string as a Javascript String object.
  function UTF32ToString(ptr) {
    var i = 0;
    var str = '';
    while (1) {
      var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
      if (utf32 == 0)
        return str;
      ++i;
      // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
      if (utf32 >= 0x10000) {
        var ch = utf32 - 0x10000;
        str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
      } else {
        str += String.fromCharCode(utf32);
      }
    }
  }
  Module['UTF32ToString'] = UTF32ToString;
  // Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
  // null-terminated and encoded in UTF32LE form. The copy will require at most (str.length+1)*4 bytes of space in the HEAP,
  // but can use less, since str.length does not return the number of characters in the string, but the number of UTF-16 code units in the string.
  function stringToUTF32(str, outPtr) {
    var iChar = 0;
    for(var iCodeUnit = 0; iCodeUnit < str.length; ++iCodeUnit) {
      // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
      var codeUnit = str.charCodeAt(iCodeUnit); // possibly a lead surrogate
      if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
        var trailSurrogate = str.charCodeAt(++iCodeUnit);
        codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
      }
      HEAP32[(((outPtr)+(iChar*4))>>2)]=codeUnit;
      ++iChar;
    }
    // Null-terminate the pointer to the HEAP.
    HEAP32[(((outPtr)+(iChar*4))>>2)]=0;
  }
  Module['stringToUTF32'] = stringToUTF32;
  function demangle(func) {
    try {
      // Special-case the entry point, since its name differs from other name mangling.
      if (func == 'Object._main' || func == '_main') {
        return 'main()';
      }
      if (typeof func === 'number') func = Pointer_stringify(func);
      if (func[0] !== '_') return func;
      if (func[1] !== '_') return func; // C function
      if (func[2] !== 'Z') return func;
      switch (func[3]) {
        case 'n': return 'operator new()';
        case 'd': return 'operator delete()';
      }
      var i = 3;
      // params, etc.
      var basicTypes = {
        'v': 'void',
        'b': 'bool',
        'c': 'char',
        's': 'short',
        'i': 'int',
        'l': 'long',
        'f': 'float',
        'd': 'double',
        'w': 'wchar_t',
        'a': 'signed char',
        'h': 'unsigned char',
        't': 'unsigned short',
        'j': 'unsigned int',
        'm': 'unsigned long',
        'x': 'long long',
        'y': 'unsigned long long',
        'z': '...'
      };
      function dump(x) {
        //return;
        if (x) Module.print(x);
        Module.print(func);
        var pre = '';
        for (var a = 0; a < i; a++) pre += ' ';
        Module.print (pre + '^');
      }
      var subs = [];
      function parseNested() {
        i++;
        if (func[i] === 'K') i++; // ignore const
        var parts = [];
        while (func[i] !== 'E') {
          if (func[i] === 'S') { // substitution
            i++;
            var next = func.indexOf('_', i);
            var num = func.substring(i, next) || 0;
            parts.push(subs[num] || '?');
            i = next+1;
            continue;
          }
          if (func[i] === 'C') { // constructor
            parts.push(parts[parts.length-1]);
            i += 2;
            continue;
          }
          var size = parseInt(func.substr(i));
          var pre = size.toString().length;
          if (!size || !pre) { i--; break; } // counter i++ below us
          var curr = func.substr(i + pre, size);
          parts.push(curr);
          subs.push(curr);
          i += pre + size;
        }
        i++; // skip E
        return parts;
      }
      var first = true;
      function parse(rawList, limit, allowVoid) { // main parser
        limit = limit || Infinity;
        var ret = '', list = [];
        function flushList() {
          return '(' + list.join(', ') + ')';
        }
        var name;
        if (func[i] === 'N') {
          // namespaced N-E
          name = parseNested().join('::');
          limit--;
          if (limit === 0) return rawList ? [name] : name;
        } else {
          // not namespaced
          if (func[i] === 'K' || (first && func[i] === 'L')) i++; // ignore const and first 'L'
          var size = parseInt(func.substr(i));
          if (size) {
            var pre = size.toString().length;
            name = func.substr(i + pre, size);
            i += pre + size;
          }
        }
        first = false;
        if (func[i] === 'I') {
          i++;
          var iList = parse(true);
          var iRet = parse(true, 1, true);
          ret += iRet[0] + ' ' + name + '<' + iList.join(', ') + '>';
        } else {
          ret = name;
        }
        paramLoop: while (i < func.length && limit-- > 0) {
          //dump('paramLoop');
          var c = func[i++];
          if (c in basicTypes) {
            list.push(basicTypes[c]);
          } else {
            switch (c) {
              case 'P': list.push(parse(true, 1, true)[0] + '*'); break; // pointer
              case 'R': list.push(parse(true, 1, true)[0] + '&'); break; // reference
              case 'L': { // literal
                i++; // skip basic type
                var end = func.indexOf('E', i);
                var size = end - i;
                list.push(func.substr(i, size));
                i += size + 2; // size + 'EE'
                break;
              }
              case 'A': { // array
                var size = parseInt(func.substr(i));
                i += size.toString().length;
                if (func[i] !== '_') throw '?';
                i++; // skip _
                list.push(parse(true, 1, true)[0] + ' [' + size + ']');
                break;
              }
              case 'E': break paramLoop;
              default: ret += '?' + c; break paramLoop;
            }
          }
        }
        if (!allowVoid && list.length === 1 && list[0] === 'void') list = []; // avoid (void)
        return rawList ? list : ret + flushList();
      }
      return parse();
    } catch(e) {
      return func;
    }
  }
  function demangleAll(text) {
    return text.replace(/__Z[\w\d_]+/g, function(x) { var y = demangle(x); return x === y ? x : (x + ' [' + y + ']') });
  }
  function stackTrace() {
    var stack = new Error().stack;
    return stack ? demangleAll(stack) : '(no stack trace available)'; // Stack trace is not available at least on IE10 and Safari 6.
  }
  // Memory management
  var PAGE_SIZE = 4096;
  function alignMemoryPage(x) {
    return (x+4095)&-4096;
  }
  var HEAP;
  var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
  var STATIC_BASE = 0, STATICTOP = 0, staticSealed = false; // static area
  var STACK_BASE = 0, STACKTOP = 0, STACK_MAX = 0; // stack area
  var DYNAMIC_BASE = 0, DYNAMICTOP = 0; // dynamic area handled by sbrk
  function enlargeMemory() {
    abort('Cannot enlarge memory arrays. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value ' + TOTAL_MEMORY + ', (2) compile with ALLOW_MEMORY_GROWTH which adjusts the size at runtime but prevents some optimizations, or (3) set Module.TOTAL_MEMORY before the program runs.');
  }
  var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
  var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 16777216;
  var FAST_MEMORY = Module['FAST_MEMORY'] || 2097152;
  // Initialize the runtime's memory
  // check for full engine support (use string 'subarray' to avoid closure compiler confusion)
  assert(typeof Int32Array !== 'undefined' && typeof Float64Array !== 'undefined' && !!(new Int32Array(1)['subarray']) && !!(new Int32Array(1)['set']),
         'Cannot fallback to non-typed array case: Code is too specialized');
  var buffer = new ArrayBuffer(TOTAL_MEMORY);
  HEAP8 = new Int8Array(buffer);
  HEAP16 = new Int16Array(buffer);
  HEAP32 = new Int32Array(buffer);
  HEAPU8 = new Uint8Array(buffer);
  HEAPU16 = new Uint16Array(buffer);
  HEAPU32 = new Uint32Array(buffer);
  HEAPF32 = new Float32Array(buffer);
  HEAPF64 = new Float64Array(buffer);
  // Endianness check (note: assumes compiler arch was little-endian)
  HEAP32[0] = 255;
  assert(HEAPU8[0] === 255 && HEAPU8[3] === 0, 'Typed arrays 2 must be run on a little-endian system');
  Module['HEAP'] = HEAP;
  Module['HEAP8'] = HEAP8;
  Module['HEAP16'] = HEAP16;
  Module['HEAP32'] = HEAP32;
  Module['HEAPU8'] = HEAPU8;
  Module['HEAPU16'] = HEAPU16;
  Module['HEAPU32'] = HEAPU32;
  Module['HEAPF32'] = HEAPF32;
  Module['HEAPF64'] = HEAPF64;
  function callRuntimeCallbacks(callbacks) {
    while(callbacks.length > 0) {
      var callback = callbacks.shift();
      if (typeof callback == 'function') {
        callback();
        continue;
      }
      var func = callback.func;
      if (typeof func === 'number') {
        if (callback.arg === undefined) {
          Runtime.dynCall('v', func);
        } else {
          Runtime.dynCall('vi', func, [callback.arg]);
        }
      } else {
        func(callback.arg === undefined ? null : callback.arg);
      }
    }
  }
  var __ATPRERUN__  = []; // functions called before the runtime is initialized
  var __ATINIT__    = []; // functions called during startup
  var __ATMAIN__    = []; // functions called when main() is to be run
  var __ATEXIT__    = []; // functions called during shutdown
  var __ATPOSTRUN__ = []; // functions called after the runtime has exited
  var runtimeInitialized = false;
  function preRun() {
    // compatibility - merge in anything from Module['preRun'] at this time
    if (Module['preRun']) {
      if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
      while (Module['preRun'].length) {
        addOnPreRun(Module['preRun'].shift());
      }
    }
    callRuntimeCallbacks(__ATPRERUN__);
  }
  function ensureInitRuntime() {
    if (runtimeInitialized) return;
    runtimeInitialized = true;
    callRuntimeCallbacks(__ATINIT__);
  }
  function preMain() {
    callRuntimeCallbacks(__ATMAIN__);
  }
  function exitRuntime() {
    callRuntimeCallbacks(__ATEXIT__);
  }
  function postRun() {
    // compatibility - merge in anything from Module['postRun'] at this time
    if (Module['postRun']) {
      if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
      while (Module['postRun'].length) {
        addOnPostRun(Module['postRun'].shift());
      }
    }
    callRuntimeCallbacks(__ATPOSTRUN__);
  }
  function addOnPreRun(cb) {
    __ATPRERUN__.unshift(cb);
  }
  Module['addOnPreRun'] = Module.addOnPreRun = addOnPreRun;
  function addOnInit(cb) {
    __ATINIT__.unshift(cb);
  }
  Module['addOnInit'] = Module.addOnInit = addOnInit;
  function addOnPreMain(cb) {
    __ATMAIN__.unshift(cb);
  }
  Module['addOnPreMain'] = Module.addOnPreMain = addOnPreMain;
  function addOnExit(cb) {
    __ATEXIT__.unshift(cb);
  }
  Module['addOnExit'] = Module.addOnExit = addOnExit;
  function addOnPostRun(cb) {
    __ATPOSTRUN__.unshift(cb);
  }
  Module['addOnPostRun'] = Module.addOnPostRun = addOnPostRun;
  // Tools
  // This processes a JS string into a C-line array of numbers, 0-terminated.
  // For LLVM-originating strings, see parser.js:parseLLVMString function
  function intArrayFromString(stringy, dontAddNull, length /* optional */) {
    var ret = (new Runtime.UTF8Processor()).processJSString(stringy);
    if (length) {
      ret.length = length;
    }
    if (!dontAddNull) {
      ret.push(0);
    }
    return ret;
  }
  Module['intArrayFromString'] = intArrayFromString;
  function intArrayToString(array) {
    var ret = [];
    for (var i = 0; i < array.length; i++) {
      var chr = array[i];
      if (chr > 0xFF) {
          assert(false, 'Character code ' + chr + ' (' + String.fromCharCode(chr) + ')  at offset ' + i + ' not in 0x00-0xFF.');
        chr &= 0xFF;
      }
      ret.push(String.fromCharCode(chr));
    }
    return ret.join('');
  }
  Module['intArrayToString'] = intArrayToString;
  // Write a Javascript array to somewhere in the heap
  function writeStringToMemory(string, buffer, dontAddNull) {
    var array = intArrayFromString(string, dontAddNull);
    var i = 0;
    while (i < array.length) {
      var chr = array[i];
      HEAP8[(((buffer)+(i))|0)]=chr;
      i = i + 1;
    }
  }
  Module['writeStringToMemory'] = writeStringToMemory;
  function writeArrayToMemory(array, buffer) {
    for (var i = 0; i < array.length; i++) {
      HEAP8[(((buffer)+(i))|0)]=array[i];
    }
  }
  Module['writeArrayToMemory'] = writeArrayToMemory;
  function writeAsciiToMemory(str, buffer, dontAddNull) {
    for (var i = 0; i < str.length; i++) {
      assert(str.charCodeAt(i) === str.charCodeAt(i)&0xff);
      HEAP8[(((buffer)+(i))|0)]=str.charCodeAt(i);
    }
    if (!dontAddNull) HEAP8[(((buffer)+(str.length))|0)]=0;
  }
  Module['writeAsciiToMemory'] = writeAsciiToMemory;
  function unSign(value, bits, ignore, sig) {
    if (value >= 0) {
      return value;
    }
    return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                      : Math.pow(2, bits)         + value;
  }
  function reSign(value, bits, ignore, sig) {
    if (value <= 0) {
      return value;
    }
    var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                          : Math.pow(2, bits-1);
    if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                         // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                         // TODO: In i64 mode 1, resign the two parts separately and safely
      value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
    }
    return value;
  }
  if (!Math['imul']) Math['imul'] = function imul(a, b) {
    var ah  = a >>> 16;
    var al = a & 0xffff;
    var bh  = b >>> 16;
    var bl = b & 0xffff;
    return (al*bl + ((ah*bl + al*bh) << 16))|0;
  };
  Math.imul = Math['imul'];
  var Math_abs = Math.abs;
  var Math_cos = Math.cos;
  var Math_sin = Math.sin;
  var Math_tan = Math.tan;
  var Math_acos = Math.acos;
  var Math_asin = Math.asin;
  var Math_atan = Math.atan;
  var Math_atan2 = Math.atan2;
  var Math_exp = Math.exp;
  var Math_log = Math.log;
  var Math_sqrt = Math.sqrt;
  var Math_ceil = Math.ceil;
  var Math_floor = Math.floor;
  var Math_pow = Math.pow;
  var Math_imul = Math.imul;
  var Math_fround = Math.fround;
  var Math_min = Math.min;
  // A counter of dependencies for calling run(). If we need to
  // do asynchronous work before running, increment this and
  // decrement it. Incrementing must happen in a place like
  // PRE_RUN_ADDITIONS (used by emcc to add file preloading).
  // Note that you can add dependencies in preRun, even though
  // it happens right before run - run will be postponed until
  // the dependencies are met.
  var runDependencies = 0;
  var runDependencyWatcher = null;
  var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled
  var runDependencyTracking = {};
  function addRunDependency(id) {
    runDependencies++;
    if (Module['monitorRunDependencies']) {
      Module['monitorRunDependencies'](runDependencies);
    }
    if (id) {
      assert(!runDependencyTracking[id]);
      runDependencyTracking[id] = 1;
      if (runDependencyWatcher === null && typeof setInterval !== 'undefined') {
        // Check for missing dependencies every few seconds
        runDependencyWatcher = setInterval(function() {
          var shown = false;
          for (var dep in runDependencyTracking) {
            if (!shown) {
              shown = true;
              Module.printErr('still waiting on run dependencies:');
            }
            Module.printErr('dependency: ' + dep);
          }
          if (shown) {
            Module.printErr('(end of list)');
          }
        }, 10000);
      }
    } else {
      Module.printErr('warning: run dependency added without ID');
    }
  }
  Module['addRunDependency'] = addRunDependency;
  function removeRunDependency(id) {
    runDependencies--;
    if (Module['monitorRunDependencies']) {
      Module['monitorRunDependencies'](runDependencies);
    }
    if (id) {
      assert(runDependencyTracking[id]);
      delete runDependencyTracking[id];
    } else {
      Module.printErr('warning: run dependency removed without ID');
    }
    if (runDependencies == 0) {
      if (runDependencyWatcher !== null) {
        clearInterval(runDependencyWatcher);
        runDependencyWatcher = null;
      }
      if (dependenciesFulfilled) {
        var callback = dependenciesFulfilled;
        dependenciesFulfilled = null;
        callback(); // can add another dependenciesFulfilled
      }
    }
  }
  Module['removeRunDependency'] = removeRunDependency;
  Module["preloadedImages"] = {}; // maps url to image data
  Module["preloadedAudios"] = {}; // maps url to audio data
  var memoryInitializer = null;
  // === Body ===
  STATIC_BASE = 8;
  STATICTOP = STATIC_BASE + 232;
  /* global initializers */ __ATINIT__.push({ func: function() { runPostSets() } });
  /* memory initializer */ allocate([115,117,109,80,116,114,32,105,115,58,32,37,105,10,0,0,115,117,109,32,105,115,58,32,37,105,10,0,0,0,0,0,115,105,122,101,111,102,32,117,110,115,105,103,110,101,100,32,108,111,110,103,32,108,111,110,103,58,32,37,105,10,0,0,115,105,122,101,111,102,32,117,110,115,105,103,110,101,100,32,105,110,116,58,32,37,105,10,0,0,0,0,0,0,0,0,115,117,109,80,116,114,32,42,97,61,37,105,44,32,42,98,61,37,108,108,105,44,32,42,99,61,37,105,10,0,0,0,115,117,109,80,116,114,32,97,91,48,93,61,37,105,44,32,98,91,48,93,61,37,108,108,105,44,32,99,91,48,93,61,37,105,10,0,0,0,0,0,115,117,109,80,116,114,32,97,61,37,105,44,32,98,61,37,108,108,105,44,32,99,61,37,105,10,0,0,0,0,0,0,115,117,109,51,32,97,61,37,105,44,32,98,61,37,108,108,105,44,32,99,61,37,105,10,0,0,0,0,0,0,0,0], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE)
  function runPostSets() {
  }
  var tempDoublePtr = Runtime.alignMemory(allocate(12, "i8", ALLOC_STATIC), 8);
  assert(tempDoublePtr % 8 == 0);
  function copyTempFloat(ptr) { // functions, because inlining this code increases code size too much
    HEAP8[tempDoublePtr] = HEAP8[ptr];
    HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];
    HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];
    HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];
  }
  function copyTempDouble(ptr) {
    HEAP8[tempDoublePtr] = HEAP8[ptr];
    HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];
    HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];
    HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];
    HEAP8[tempDoublePtr+4] = HEAP8[ptr+4];
    HEAP8[tempDoublePtr+5] = HEAP8[ptr+5];
    HEAP8[tempDoublePtr+6] = HEAP8[ptr+6];
    HEAP8[tempDoublePtr+7] = HEAP8[ptr+7];
  }
    var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:42,EIDRM:43,ECHRNG:44,EL2NSYNC:45,EL3HLT:46,EL3RST:47,ELNRNG:48,EUNATCH:49,ENOCSI:50,EL2HLT:51,EDEADLK:35,ENOLCK:37,EBADE:52,EBADR:53,EXFULL:54,ENOANO:55,EBADRQC:56,EBADSLT:57,EDEADLOCK:35,EBFONT:59,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:72,EDOTDOT:73,EBADMSG:74,ENOTUNIQ:76,EBADFD:77,EREMCHG:78,ELIBACC:79,ELIBBAD:80,ELIBSCN:81,ELIBMAX:82,ELIBEXEC:83,ENOSYS:38,ENOTEMPTY:39,ENAMETOOLONG:36,ELOOP:40,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:97,EPROTOTYPE:91,ENOTSOCK:88,ENOPROTOOPT:92,ESHUTDOWN:108,ECONNREFUSED:111,EADDRINUSE:98,ECONNABORTED:103,ENETUNREACH:101,ENETDOWN:100,ETIMEDOUT:110,EHOSTDOWN:112,EHOSTUNREACH:113,EINPROGRESS:115,EALREADY:114,EDESTADDRREQ:89,EMSGSIZE:90,EPROTONOSUPPORT:93,ESOCKTNOSUPPORT:94,EADDRNOTAVAIL:99,ENETRESET:102,EISCONN:106,ENOTCONN:107,ETOOMANYREFS:109,EUSERS:87,EDQUOT:122,ESTALE:116,ENOTSUP:95,ENOMEDIUM:123,EILSEQ:84,EOVERFLOW:75,ECANCELED:125,ENOTRECOVERABLE:131,EOWNERDEAD:130,ESTRPIPE:86};
    var ERRNO_MESSAGES={0:"Success",1:"Not super-user",2:"No such file or directory",3:"No such process",4:"Interrupted system call",5:"I/O error",6:"No such device or address",7:"Arg list too long",8:"Exec format error",9:"Bad file number",10:"No children",11:"No more processes",12:"Not enough core",13:"Permission denied",14:"Bad address",15:"Block device required",16:"Mount device busy",17:"File exists",18:"Cross-device link",19:"No such device",20:"Not a directory",21:"Is a directory",22:"Invalid argument",23:"Too many open files in system",24:"Too many open files",25:"Not a typewriter",26:"Text file busy",27:"File too large",28:"No space left on device",29:"Illegal seek",30:"Read only file system",31:"Too many links",32:"Broken pipe",33:"Math arg out of domain of func",34:"Math result not representable",35:"File locking deadlock error",36:"File or path name too long",37:"No record locks available",38:"Function not implemented",39:"Directory not empty",40:"Too many symbolic links",42:"No message of desired type",43:"Identifier removed",44:"Channel number out of range",45:"Level 2 not synchronized",46:"Level 3 halted",47:"Level 3 reset",48:"Link number out of range",49:"Protocol driver not attached",50:"No CSI structure available",51:"Level 2 halted",52:"Invalid exchange",53:"Invalid request descriptor",54:"Exchange full",55:"No anode",56:"Invalid request code",57:"Invalid slot",59:"Bad font file fmt",60:"Device not a stream",61:"No data (for no delay io)",62:"Timer expired",63:"Out of streams resources",64:"Machine is not on the network",65:"Package not installed",66:"The object is remote",67:"The link has been severed",68:"Advertise error",69:"Srmount error",70:"Communication error on send",71:"Protocol error",72:"Multihop attempted",73:"Cross mount point (not really error)",74:"Trying to read unreadable message",75:"Value too large for defined data type",76:"Given log. name not unique",77:"f.d. invalid for this operation",78:"Remote address changed",79:"Can   access a needed shared lib",80:"Accessing a corrupted shared lib",81:".lib section in a.out corrupted",82:"Attempting to link in too many libs",83:"Attempting to exec a shared library",84:"Illegal byte sequence",86:"Streams pipe error",87:"Too many users",88:"Socket operation on non-socket",89:"Destination address required",90:"Message too long",91:"Protocol wrong type for socket",92:"Protocol not available",93:"Unknown protocol",94:"Socket type not supported",95:"Not supported",96:"Protocol family not supported",97:"Address family not supported by protocol family",98:"Address already in use",99:"Address not available",100:"Network interface is not configured",101:"Network is unreachable",102:"Connection reset by network",103:"Connection aborted",104:"Connection reset by peer",105:"No buffer space available",106:"Socket is already connected",107:"Socket is not connected",108:"Can't send after socket shutdown",109:"Too many references",110:"Connection timed out",111:"Connection refused",112:"Host is down",113:"Host is unreachable",114:"Socket already connected",115:"Connection already in progress",116:"Stale file handle",122:"Quota exceeded",123:"No medium (in tape drive)",125:"Operation canceled",130:"Previous owner died",131:"State not recoverable"};
    var ___errno_state=0;function ___setErrNo(value) {
        // For convenient setting and returning of errno.
        HEAP32[((___errno_state)>>2)]=value
        return value;
      }
    var PATH={splitPath:function (filename) {
          var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
          return splitPathRe.exec(filename).slice(1);
        },normalizeArray:function (parts, allowAboveRoot) {
          // if the path tries to go above the root, `up` ends up > 0
          var up = 0;
          for (var i = parts.length - 1; i >= 0; i--) {
            var last = parts[i];
            if (last === '.') {
              parts.splice(i, 1);
            } else if (last === '..') {
              parts.splice(i, 1);
              up++;
            } else if (up) {
              parts.splice(i, 1);
              up--;
            }
          }
          // if the path is allowed to go above the root, restore leading ..s
          if (allowAboveRoot) {
            for (; up--; up) {
              parts.unshift('..');
            }
          }
          return parts;
        },normalize:function (path) {
          var isAbsolute = path.charAt(0) === '/',
              trailingSlash = path.substr(-1) === '/';
          // Normalize the path
          path = PATH.normalizeArray(path.split('/').filter(function(p) {
            return !!p;
          }), !isAbsolute).join('/');
          if (!path && !isAbsolute) {
            path = '.';
          }
          if (path && trailingSlash) {
            path += '/';
          }
          return (isAbsolute ? '/' : '') + path;
        },dirname:function (path) {
          var result = PATH.splitPath(path),
              root = result[0],
              dir = result[1];
          if (!root && !dir) {
            // No dirname whatsoever
            return '.';
          }
          if (dir) {
            // It has a dirname, strip trailing slash
            dir = dir.substr(0, dir.length - 1);
          }
          return root + dir;
        },basename:function (path) {
          // EMSCRIPTEN return '/'' for '/', not an empty string
          if (path === '/') return '/';
          var lastSlash = path.lastIndexOf('/');
          if (lastSlash === -1) return path;
          return path.substr(lastSlash+1);
        },extname:function (path) {
          return PATH.splitPath(path)[3];
        },join:function () {
          var paths = Array.prototype.slice.call(arguments, 0);
          return PATH.normalize(paths.join('/'));
        },join2:function (l, r) {
          return PATH.normalize(l + '/' + r);
        },resolve:function () {
          var resolvedPath = '',
            resolvedAbsolute = false;
          for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path = (i >= 0) ? arguments[i] : FS.cwd();
            // Skip empty and invalid entries
            if (typeof path !== 'string') {
              throw new TypeError('Arguments to path.resolve must be strings');
            } else if (!path) {
              continue;
            }
            resolvedPath = path + '/' + resolvedPath;
            resolvedAbsolute = path.charAt(0) === '/';
          }
          // At this point the path should be resolved to a full absolute path, but
          // handle relative paths to be safe (might happen when process.cwd() fails)
          resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter(function(p) {
            return !!p;
          }), !resolvedAbsolute).join('/');
          return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
        },relative:function (from, to) {
          from = PATH.resolve(from).substr(1);
          to = PATH.resolve(to).substr(1);
          function trim(arr) {
            var start = 0;
            for (; start < arr.length; start++) {
              if (arr[start] !== '') break;
            }
            var end = arr.length - 1;
            for (; end >= 0; end--) {
              if (arr[end] !== '') break;
            }
            if (start > end) return [];
            return arr.slice(start, end - start + 1);
          }
          var fromParts = trim(from.split('/'));
          var toParts = trim(to.split('/'));
          var length = Math.min(fromParts.length, toParts.length);
          var samePartsLength = length;
          for (var i = 0; i < length; i++) {
            if (fromParts[i] !== toParts[i]) {
              samePartsLength = i;
              break;
            }
          }
          var outputParts = [];
          for (var i = samePartsLength; i < fromParts.length; i++) {
            outputParts.push('..');
          }
          outputParts = outputParts.concat(toParts.slice(samePartsLength));
          return outputParts.join('/');
        }};
    var TTY={ttys:[],init:function () {
          // https://github.com/kripken/emscripten/pull/1555
          // if (ENVIRONMENT_IS_NODE) {
          //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
          //   // device, it always assumes it's a TTY device. because of this, we're forcing
          //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
          //   // with text files until FS.init can be refactored.
          //   process['stdin']['setEncoding']('utf8');
          // }
        },shutdown:function () {
          // https://github.com/kripken/emscripten/pull/1555
          // if (ENVIRONMENT_IS_NODE) {
          //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
          //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
          //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
          //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
          //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
          //   process['stdin']['pause']();
          // }
        },register:function (dev, ops) {
          TTY.ttys[dev] = { input: [], output: [], ops: ops };
          FS.registerDevice(dev, TTY.stream_ops);
        },stream_ops:{open:function (stream) {
            var tty = TTY.ttys[stream.node.rdev];
            if (!tty) {
              throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
            }
            stream.tty = tty;
            stream.seekable = false;
          },close:function (stream) {
            // flush any pending line data
            if (stream.tty.output.length) {
              stream.tty.ops.put_char(stream.tty, 10);
            }
          },read:function (stream, buffer, offset, length, pos /* ignored */) {
            if (!stream.tty || !stream.tty.ops.get_char) {
              throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
            }
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = stream.tty.ops.get_char(stream.tty);
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },write:function (stream, buffer, offset, length, pos) {
            if (!stream.tty || !stream.tty.ops.put_char) {
              throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
            }
            for (var i = 0; i < length; i++) {
              try {
                stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }},default_tty_ops:{get_char:function (tty) {
            if (!tty.input.length) {
              var result = null;
              if (ENVIRONMENT_IS_NODE) {
                result = process['stdin']['read']();
                if (!result) {
                  if (process['stdin']['_readableState'] && process['stdin']['_readableState']['ended']) {
                    return null;  // EOF
                  }
                  return undefined;  // no data available
                }
              } else if (typeof window != 'undefined' &&
                typeof window.prompt == 'function') {
                // Browser.
                result = window.prompt('Input: ');  // returns null on cancel
                if (result !== null) {
                  result += '\n';
                }
              } else if (typeof readline == 'function') {
                // Command line.
                result = readline();
                if (result !== null) {
                  result += '\n';
                }
              }
              if (!result) {
                return null;
              }
              tty.input = intArrayFromString(result, true);
            }
            return tty.input.shift();
          },put_char:function (tty, val) {
            if (val === null || val === 10) {
              Module['print'](tty.output.join(''));
              tty.output = [];
            } else {
              tty.output.push(TTY.utf8.processCChar(val));
            }
          }},default_tty1_ops:{put_char:function (tty, val) {
            if (val === null || val === 10) {
              Module['printErr'](tty.output.join(''));
              tty.output = [];
            } else {
              tty.output.push(TTY.utf8.processCChar(val));
            }
          }}};
    var MEMFS={ops_table:null,CONTENT_OWNING:1,CONTENT_FLEXIBLE:2,CONTENT_FIXED:3,mount:function (mount) {
          return MEMFS.createNode(null, '/', 16384 | 0777, 0);
        },createNode:function (parent, name, mode, dev) {
          if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
            // no supported
            throw new FS.ErrnoError(ERRNO_CODES.EPERM);
          }
          if (!MEMFS.ops_table) {
            MEMFS.ops_table = {
              dir: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr,
                  lookup: MEMFS.node_ops.lookup,
                  mknod: MEMFS.node_ops.mknod,
                  mknod: MEMFS.node_ops.mknod,
                  rename: MEMFS.node_ops.rename,
                  unlink: MEMFS.node_ops.unlink,
                  rmdir: MEMFS.node_ops.rmdir,
                  readdir: MEMFS.node_ops.readdir,
                  symlink: MEMFS.node_ops.symlink
                },
                stream: {
                  llseek: MEMFS.stream_ops.llseek
                }
              },
              file: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr
                },
                stream: {
                  llseek: MEMFS.stream_ops.llseek,
                  read: MEMFS.stream_ops.read,
                  write: MEMFS.stream_ops.write,
                  allocate: MEMFS.stream_ops.allocate,
                  mmap: MEMFS.stream_ops.mmap
                }
              },
              link: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr,
                  readlink: MEMFS.node_ops.readlink
                },
                stream: {}
              },
              chrdev: {
                node: {
                  getattr: MEMFS.node_ops.getattr,
                  setattr: MEMFS.node_ops.setattr
                },
                stream: FS.chrdev_stream_ops
              },
            };
          }
          var node = FS.createNode(parent, name, mode, dev);
          if (FS.isDir(node.mode)) {
            node.node_ops = MEMFS.ops_table.dir.node;
            node.stream_ops = MEMFS.ops_table.dir.stream;
            node.contents = {};
          } else if (FS.isFile(node.mode)) {
            node.node_ops = MEMFS.ops_table.file.node;
            node.stream_ops = MEMFS.ops_table.file.stream;
            node.contents = [];
            node.contentMode = MEMFS.CONTENT_FLEXIBLE;
          } else if (FS.isLink(node.mode)) {
            node.node_ops = MEMFS.ops_table.link.node;
            node.stream_ops = MEMFS.ops_table.link.stream;
          } else if (FS.isChrdev(node.mode)) {
            node.node_ops = MEMFS.ops_table.chrdev.node;
            node.stream_ops = MEMFS.ops_table.chrdev.stream;
          }
          node.timestamp = Date.now();
          // add the new node to the parent
          if (parent) {
            parent.contents[name] = node;
          }
          return node;
        },ensureFlexible:function (node) {
          if (node.contentMode !== MEMFS.CONTENT_FLEXIBLE) {
            var contents = node.contents;
            node.contents = Array.prototype.slice.call(contents);
            node.contentMode = MEMFS.CONTENT_FLEXIBLE;
          }
        },node_ops:{getattr:function (node) {
            var attr = {};
            // device numbers reuse inode numbers.
            attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
            attr.ino = node.id;
            attr.mode = node.mode;
            attr.nlink = 1;
            attr.uid = 0;
            attr.gid = 0;
            attr.rdev = node.rdev;
            if (FS.isDir(node.mode)) {
              attr.size = 4096;
            } else if (FS.isFile(node.mode)) {
              attr.size = node.contents.length;
            } else if (FS.isLink(node.mode)) {
              attr.size = node.link.length;
            } else {
              attr.size = 0;
            }
            attr.atime = new Date(node.timestamp);
            attr.mtime = new Date(node.timestamp);
            attr.ctime = new Date(node.timestamp);
            // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
            //       but this is not required by the standard.
            attr.blksize = 4096;
            attr.blocks = Math.ceil(attr.size / attr.blksize);
            return attr;
          },setattr:function (node, attr) {
            if (attr.mode !== undefined) {
              node.mode = attr.mode;
            }
            if (attr.timestamp !== undefined) {
              node.timestamp = attr.timestamp;
            }
            if (attr.size !== undefined) {
              MEMFS.ensureFlexible(node);
              var contents = node.contents;
              if (attr.size < contents.length) contents.length = attr.size;
              else while (attr.size > contents.length) contents.push(0);
            }
          },lookup:function (parent, name) {
            throw FS.genericErrors[ERRNO_CODES.ENOENT];
          },mknod:function (parent, name, mode, dev) {
            return MEMFS.createNode(parent, name, mode, dev);
          },rename:function (old_node, new_dir, new_name) {
            // if we're overwriting a directory at new_name, make sure it's empty.
            if (FS.isDir(old_node.mode)) {
              var new_node;
              try {
                new_node = FS.lookupNode(new_dir, new_name);
              } catch (e) {
              }
              if (new_node) {
                for (var i in new_node.contents) {
                  throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
                }
              }
            }
            // do the internal rewiring
            delete old_node.parent.contents[old_node.name];
            old_node.name = new_name;
            new_dir.contents[new_name] = old_node;
            old_node.parent = new_dir;
          },unlink:function (parent, name) {
            delete parent.contents[name];
          },rmdir:function (parent, name) {
            var node = FS.lookupNode(parent, name);
            for (var i in node.contents) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
            }
            delete parent.contents[name];
          },readdir:function (node) {
            var entries = ['.', '..']
            for (var key in node.contents) {
              if (!node.contents.hasOwnProperty(key)) {
                continue;
              }
              entries.push(key);
            }
            return entries;
          },symlink:function (parent, newname, oldpath) {
            var node = MEMFS.createNode(parent, newname, 0777 | 40960, 0);
            node.link = oldpath;
            return node;
          },readlink:function (node) {
            if (!FS.isLink(node.mode)) {
              throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
            }
            return node.link;
          }},stream_ops:{read:function (stream, buffer, offset, length, position) {
            var contents = stream.node.contents;
            if (position >= contents.length)
              return 0;
            var size = Math.min(contents.length - position, length);
            assert(size >= 0);
            if (size > 8 && contents.subarray) { // non-trivial, and typed array
              buffer.set(contents.subarray(position, position + size), offset);
            } else
            {
              for (var i = 0; i < size; i++) {
                buffer[offset + i] = contents[position + i];
              }
            }
            return size;
          },write:function (stream, buffer, offset, length, position, canOwn) {
            var node = stream.node;
            node.timestamp = Date.now();
            var contents = node.contents;
            if (length && contents.length === 0 && position === 0 && buffer.subarray) {
              // just replace it with the new data
              assert(buffer.length);
              if (canOwn && offset === 0) {
                node.contents = buffer; // this could be a subarray of Emscripten HEAP, or allocated from some other source.
                node.contentMode = (buffer.buffer === HEAP8.buffer) ? MEMFS.CONTENT_OWNING : MEMFS.CONTENT_FIXED;
              } else {
                node.contents = new Uint8Array(buffer.subarray(offset, offset+length));
                node.contentMode = MEMFS.CONTENT_FIXED;
              }
              return length;
            }
            MEMFS.ensureFlexible(node);
            var contents = node.contents;
            while (contents.length < position) contents.push(0);
            for (var i = 0; i < length; i++) {
              contents[position + i] = buffer[offset + i];
            }
            return length;
          },llseek:function (stream, offset, whence) {
            var position = offset;
            if (whence === 1) {  // SEEK_CUR.
              position += stream.position;
            } else if (whence === 2) {  // SEEK_END.
              if (FS.isFile(stream.node.mode)) {
                position += stream.node.contents.length;
              }
            }
            if (position < 0) {
              throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
            }
            stream.ungotten = [];
            stream.position = position;
            return position;
          },allocate:function (stream, offset, length) {
            MEMFS.ensureFlexible(stream.node);
            var contents = stream.node.contents;
            var limit = offset + length;
            while (limit > contents.length) contents.push(0);
          },mmap:function (stream, buffer, offset, length, position, prot, flags) {
            if (!FS.isFile(stream.node.mode)) {
              throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
            }
            var ptr;
            var allocated;
            var contents = stream.node.contents;
            // Only make a new copy when MAP_PRIVATE is specified.
            if ( !(flags & 2) &&
                  (contents.buffer === buffer || contents.buffer === buffer.buffer) ) {
              // We can't emulate MAP_SHARED when the file is not backed by the buffer
              // we're mapping to (e.g. the HEAP buffer).
              allocated = false;
              ptr = contents.byteOffset;
            } else {
              // Try to avoid unnecessary slices.
              if (position > 0 || position + length < contents.length) {
                if (contents.subarray) {
                  contents = contents.subarray(position, position + length);
                } else {
                  contents = Array.prototype.slice.call(contents, position, position + length);
                }
              }
              allocated = true;
              ptr = _malloc(length);
              if (!ptr) {
                throw new FS.ErrnoError(ERRNO_CODES.ENOMEM);
              }
              buffer.set(contents, ptr);
            }
            return { ptr: ptr, allocated: allocated };
          }}};
    var IDBFS={dbs:{},indexedDB:function () {
          return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",mount:function (mount) {
          return MEMFS.mount.apply(null, arguments);
        },syncfs:function (mount, populate, callback) {
          IDBFS.getLocalSet(mount, function(err, local) {
            if (err) return callback(err);
            IDBFS.getRemoteSet(mount, function(err, remote) {
              if (err) return callback(err);
              var src = populate ? remote : local;
              var dst = populate ? local : remote;
              IDBFS.reconcile(src, dst, callback);
            });
          });
        },reconcile:function (src, dst, callback) {
          var total = 0;
          var create = {};
          for (var key in src.files) {
            if (!src.files.hasOwnProperty(key)) continue;
            var e = src.files[key];
            var e2 = dst.files[key];
            if (!e2 || e.timestamp > e2.timestamp) {
              create[key] = e;
              total++;
            }
          }
          var remove = {};
          for (var key in dst.files) {
            if (!dst.files.hasOwnProperty(key)) continue;
            var e = dst.files[key];
            var e2 = src.files[key];
            if (!e2) {
              remove[key] = e;
              total++;
            }
          }
          if (!total) {
            // early out
            return callback(null);
          }
          var completed = 0;
          function done(err) {
            if (err) return callback(err);
            if (++completed >= total) {
              return callback(null);
            }
          };
          // create a single transaction to handle and IDB reads / writes we'll need to do
          var db = src.type === 'remote' ? src.db : dst.db;
          var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readwrite');
          transaction.onerror = function transaction_onerror() { callback(this.error); };
          var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
          for (var path in create) {
            if (!create.hasOwnProperty(path)) continue;
            var entry = create[path];
            if (dst.type === 'local') {
              // save file to local
              try {
                if (FS.isDir(entry.mode)) {
                  FS.mkdir(path, entry.mode);
                } else if (FS.isFile(entry.mode)) {
                  var stream = FS.open(path, 'w+', 0666);
                  FS.write(stream, entry.contents, 0, entry.contents.length, 0, true /* canOwn */);
                  FS.close(stream);
                }
                done(null);
              } catch (e) {
                return done(e);
              }
            } else {
              // save file to IDB
              var req = store.put(entry, path);
              req.onsuccess = function req_onsuccess() { done(null); };
              req.onerror = function req_onerror() { done(this.error); };
            }
          }
          for (var path in remove) {
            if (!remove.hasOwnProperty(path)) continue;
            var entry = remove[path];
            if (dst.type === 'local') {
              // delete file from local
              try {
                if (FS.isDir(entry.mode)) {
                  // TODO recursive delete?
                  FS.rmdir(path);
                } else if (FS.isFile(entry.mode)) {
                  FS.unlink(path);
                }
                done(null);
              } catch (e) {
                return done(e);
              }
            } else {
              // delete file from IDB
              var req = store.delete(path);
              req.onsuccess = function req_onsuccess() { done(null); };
              req.onerror = function req_onerror() { done(this.error); };
            }
          }
        },getLocalSet:function (mount, callback) {
          var files = {};
          function isRealDir(p) {
            return p !== '.' && p !== '..';
          };
          function toAbsolute(root) {
            return function(p) {
              return PATH.join2(root, p);
            }
          };
          var check = FS.readdir(mount.mountpoint)
            .filter(isRealDir)
            .map(toAbsolute(mount.mountpoint));
          while (check.length) {
            var path = check.pop();
            var stat, node;
            try {
              var lookup = FS.lookupPath(path);
              node = lookup.node;
              stat = FS.stat(path);
            } catch (e) {
              return callback(e);
            }
            if (FS.isDir(stat.mode)) {
              check.push.apply(check, FS.readdir(path)
                .filter(isRealDir)
                .map(toAbsolute(path)));
              files[path] = { mode: stat.mode, timestamp: stat.mtime };
            } else if (FS.isFile(stat.mode)) {
              files[path] = { contents: node.contents, mode: stat.mode, timestamp: stat.mtime };
            } else {
              return callback(new Error('node type not supported'));
            }
          }
          return callback(null, { type: 'local', files: files });
        },getDB:function (name, callback) {
          // look it up in the cache
          var db = IDBFS.dbs[name];
          if (db) {
            return callback(null, db);
          }
          var req;
          try {
            req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
          } catch (e) {
            return onerror(e);
          }
          req.onupgradeneeded = function req_onupgradeneeded() {
            db = req.result;
            db.createObjectStore(IDBFS.DB_STORE_NAME);
          };
          req.onsuccess = function req_onsuccess() {
            db = req.result;
            // add to the cache
            IDBFS.dbs[name] = db;
            callback(null, db);
          };
          req.onerror = function req_onerror() {
            callback(this.error);
          };
        },getRemoteSet:function (mount, callback) {
          var files = {};
          IDBFS.getDB(mount.mountpoint, function(err, db) {
            if (err) return callback(err);
            var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readonly');
            transaction.onerror = function transaction_onerror() { callback(this.error); };
            var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
            store.openCursor().onsuccess = function store_openCursor_onsuccess(event) {
              var cursor = event.target.result;
              if (!cursor) {
                return callback(null, { type: 'remote', db: db, files: files });
              }
              files[cursor.key] = cursor.value;
              cursor.continue();
            };
          });
        }};
    var NODEFS={isWindows:false,staticInit:function () {
          NODEFS.isWindows = !!process.platform.match(/^win/);
        },mount:function (mount) {
          assert(ENVIRONMENT_IS_NODE);
          return NODEFS.createNode(null, '/', NODEFS.getMode(mount.opts.root), 0);
        },createNode:function (parent, name, mode, dev) {
          if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          var node = FS.createNode(parent, name, mode);
          node.node_ops = NODEFS.node_ops;
          node.stream_ops = NODEFS.stream_ops;
          return node;
        },getMode:function (path) {
          var stat;
          try {
            stat = fs.lstatSync(path);
            if (NODEFS.isWindows) {
              // On Windows, directories return permission bits 'rw-rw-rw-', even though they have 'rwxrwxrwx', so 
              // propagate write bits to execute bits.
              stat.mode = stat.mode | ((stat.mode & 146) >> 1);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return stat.mode;
        },realPath:function (node) {
          var parts = [];
          while (node.parent !== node) {
            parts.push(node.name);
            node = node.parent;
          }
          parts.push(node.mount.opts.root);
          parts.reverse();
          return PATH.join.apply(null, parts);
        },flagsToPermissionStringMap:{0:"r",1:"r+",2:"r+",64:"r",65:"r+",66:"r+",129:"rx+",193:"rx+",514:"w+",577:"w",578:"w+",705:"wx",706:"wx+",1024:"a",1025:"a",1026:"a+",1089:"a",1090:"a+",1153:"ax",1154:"ax+",1217:"ax",1218:"ax+",4096:"rs",4098:"rs+"},flagsToPermissionString:function (flags) {
          if (flags in NODEFS.flagsToPermissionStringMap) {
            return NODEFS.flagsToPermissionStringMap[flags];
          } else {
            return flags;
          }
        },node_ops:{getattr:function (node) {
            var path = NODEFS.realPath(node);
            var stat;
            try {
              stat = fs.lstatSync(path);
            } catch (e) {
              if (!e.code) throw e;
              throw new FS.ErrnoError(ERRNO_CODES[e.code]);
            }
            // node.js v0.10.20 doesn't report blksize and blocks on Windows. Fake them with default blksize of 4096.
            // See http://support.microsoft.com/kb/140365
            if (NODEFS.isWindows && !stat.blksize) {
              stat.blksize = 4096;
            }
            if (NODEFS.isWindows && !stat.blocks) {
              stat.blocks = (stat.size+stat.blksize-1)/stat.blksize|0;
            }
            return {
              dev: stat.dev,
              ino: stat.ino,
              mode: stat.mode,
              nlink: stat.nlink,
              uid: stat.uid,
              gid: stat.gid,
              rdev: stat.rdev,
              size: stat.size,
              atime: stat.atime,
              mtime: stat.mtime,
              ctime: stat.ctime,
              blksize: stat.blksize,
              blocks: stat.blocks
            };
          },setattr:function (node, attr) {
            var path = NODEFS.realPath(node);
            try {
              if (attr.mode !== undefined) {
                fs.chmodSync(path, attr.mode);
                // update the common node structure mode as well
                node.mode = attr.mode;
              }
              if (attr.timestamp !== undefined) {
                var date = new Date(attr.timestamp);
                fs.utimesSync(path, date, date);
              }
              if (attr.size !== undefined) {
                fs.truncateSync(path, attr.size);
              }
            } catch (e) {
              if (!e.code) throw e;
              throw new FS.ErrnoError(ERRNO_CODES[e.code]);
            }
          },lookup:function (parent, name) {
            var path = PATH.join2(NODEFS.realPath(parent), name);
            var mode = NODEFS.getMode(path);
            return NODEFS.createNode(parent, name, mode);
          },mknod:function (parent, name, mode, dev) {
            var node = NODEFS.createNode(parent, name, mode, dev);
            // create the backing node for this in the fs root as well
            var path = NODEFS.realPath(node);
            try {
              if (FS.isDir(node.mode)) {
                fs.mkdirSync(path, node.mode);
              } else {
                fs.writeFileSync(path, '', { mode: node.mode });
              }
            } catch (e) {
              if (!e.code) throw e;
              throw new FS.ErrnoError(ERRNO_CODES[e.code]);
            }
            return node;
          },rename:function (oldNode, newDir, newName) {
            var oldPath = NODEFS.realPath(oldNode);
            var newPath = PATH.join2(NODEFS.realPath(newDir), newName);
            try {
              fs.renameSync(oldPath, newPath);
            } catch (e) {
              if (!e.code) throw e;
              throw new FS.ErrnoError(ERRNO_CODES[e.code]);
            }
          },unlink:function (parent, name) {
            var path = PATH.join2(NODEFS.realPath(parent), name);
            try {
              fs.unlinkSync(path);
            } catch (e) {
              if (!e.code) throw e;
              throw new FS.ErrnoError(ERRNO_CODES[e.code]);
            }
          },rmdir:function (parent, name) {
            var path = PATH.join2(NODEFS.realPath(parent), name);
            try {
              fs.rmdirSync(path);
            } catch (e) {
              if (!e.code) throw e;
              throw new FS.ErrnoError(ERRNO_CODES[e.code]);
            }
          },readdir:function (node) {
            var path = NODEFS.realPath(node);
            try {
              return fs.readdirSync(path);
            } catch (e) {
              if (!e.code) throw e;
              throw new FS.ErrnoError(ERRNO_CODES[e.code]);
            }
          },symlink:function (parent, newName, oldPath) {
            var newPath = PATH.join2(NODEFS.realPath(parent), newName);
            try {
              fs.symlinkSync(oldPath, newPath);
            } catch (e) {
              if (!e.code) throw e;
              throw new FS.ErrnoError(ERRNO_CODES[e.code]);
            }
          },readlink:function (node) {
            var path = NODEFS.realPath(node);
            try {
              return fs.readlinkSync(path);
            } catch (e) {
              if (!e.code) throw e;
              throw new FS.ErrnoError(ERRNO_CODES[e.code]);
            }
          }},stream_ops:{open:function (stream) {
            var path = NODEFS.realPath(stream.node);
            try {
              if (FS.isFile(stream.node.mode)) {
                stream.nfd = fs.openSync(path, NODEFS.flagsToPermissionString(stream.flags));
              }
            } catch (e) {
              if (!e.code) throw e;
              throw new FS.ErrnoError(ERRNO_CODES[e.code]);
            }
          },close:function (stream) {
            try {
              if (FS.isFile(stream.node.mode) && stream.nfd) {
                fs.closeSync(stream.nfd);
              }
            } catch (e) {
              if (!e.code) throw e;
              throw new FS.ErrnoError(ERRNO_CODES[e.code]);
            }
          },read:function (stream, buffer, offset, length, position) {
            // FIXME this is terrible.
            var nbuffer = new Buffer(length);
            var res;
            try {
              res = fs.readSync(stream.nfd, nbuffer, 0, length, position);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES[e.code]);
            }
            if (res > 0) {
              for (var i = 0; i < res; i++) {
                buffer[offset + i] = nbuffer[i];
              }
            }
            return res;
          },write:function (stream, buffer, offset, length, position) {
            // FIXME this is terrible.
            var nbuffer = new Buffer(buffer.subarray(offset, offset + length));
            var res;
            try {
              res = fs.writeSync(stream.nfd, nbuffer, 0, length, position);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES[e.code]);
            }
            return res;
          },llseek:function (stream, offset, whence) {
            var position = offset;
            if (whence === 1) {  // SEEK_CUR.
              position += stream.position;
            } else if (whence === 2) {  // SEEK_END.
              if (FS.isFile(stream.node.mode)) {
                try {
                  var stat = fs.fstatSync(stream.nfd);
                  position += stat.size;
                } catch (e) {
                  throw new FS.ErrnoError(ERRNO_CODES[e.code]);
                }
              }
            }
            if (position < 0) {
              throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
            }
            stream.position = position;
            return position;
          }}};
    var _stdin=allocate(1, "i32*", ALLOC_STATIC);
    var _stdout=allocate(1, "i32*", ALLOC_STATIC);
    var _stderr=allocate(1, "i32*", ALLOC_STATIC);
    function _fflush(stream) {
        // int fflush(FILE *stream);
        // http://pubs.opengroup.org/onlinepubs/000095399/functions/fflush.html
        // we don't currently perform any user-space buffering of data
      }var FS={root:null,mounts:[],devices:[null],streams:[null],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,ErrnoError:null,genericErrors:{},handleFSError:function (e) {
          if (!(e instanceof FS.ErrnoError)) throw e + ' : ' + stackTrace();
          return ___setErrNo(e.errno);
        },lookupPath:function (path, opts) {
          path = PATH.resolve(FS.cwd(), path);
          opts = opts || { recurse_count: 0 };
          if (opts.recurse_count > 8) {  // max recursive lookup of 8
            throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
          }
          // split the path
          var parts = PATH.normalizeArray(path.split('/').filter(function(p) {
            return !!p;
          }), false);
          // start at the root
          var current = FS.root;
          var current_path = '/';
          for (var i = 0; i < parts.length; i++) {
            var islast = (i === parts.length-1);
            if (islast && opts.parent) {
              // stop resolving
              break;
            }
            current = FS.lookupNode(current, parts[i]);
            current_path = PATH.join2(current_path, parts[i]);
            // jump to the mount's root node if this is a mountpoint
            if (FS.isMountpoint(current)) {
              current = current.mount.root;
            }
            // follow symlinks
            // by default, lookupPath will not follow a symlink if it is the final path component.
            // setting opts.follow = true will override this behavior.
            if (!islast || opts.follow) {
              var count = 0;
              while (FS.isLink(current.mode)) {
                var link = FS.readlink(current_path);
                current_path = PATH.resolve(PATH.dirname(current_path), link);
                var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count });
                current = lookup.node;
                if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                  throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
                }
              }
            }
          }
          return { path: current_path, node: current };
        },getPath:function (node) {
          var path;
          while (true) {
            if (FS.isRoot(node)) {
              var mount = node.mount.mountpoint;
              if (!path) return mount;
              return mount[mount.length-1] !== '/' ? mount + '/' + path : mount + path;
            }
            path = path ? node.name + '/' + path : node.name;
            node = node.parent;
          }
        },hashName:function (parentid, name) {
          var hash = 0;
          for (var i = 0; i < name.length; i++) {
            hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
          }
          return ((parentid + hash) >>> 0) % FS.nameTable.length;
        },hashAddNode:function (node) {
          var hash = FS.hashName(node.parent.id, node.name);
          node.name_next = FS.nameTable[hash];
          FS.nameTable[hash] = node;
        },hashRemoveNode:function (node) {
          var hash = FS.hashName(node.parent.id, node.name);
          if (FS.nameTable[hash] === node) {
            FS.nameTable[hash] = node.name_next;
          } else {
            var current = FS.nameTable[hash];
            while (current) {
              if (current.name_next === node) {
                current.name_next = node.name_next;
                break;
              }
              current = current.name_next;
            }
          }
        },lookupNode:function (parent, name) {
          var err = FS.mayLookup(parent);
          if (err) {
            throw new FS.ErrnoError(err);
          }
          var hash = FS.hashName(parent.id, name);
          for (var node = FS.nameTable[hash]; node; node = node.name_next) {
            var nodeName = node.name;
            if (node.parent.id === parent.id && nodeName === name) {
              return node;
            }
          }
          // if we failed to find it in the cache, call into the VFS
          return FS.lookup(parent, name);
        },createNode:function (parent, name, mode, rdev) {
          if (!FS.FSNode) {
            FS.FSNode = function(parent, name, mode, rdev) {
              this.id = FS.nextInode++;
              this.name = name;
              this.mode = mode;
              this.node_ops = {};
              this.stream_ops = {};
              this.rdev = rdev;
              this.parent = null;
              this.mount = null;
              if (!parent) {
                parent = this;  // root node sets parent to itself
              }
              this.parent = parent;
              this.mount = parent.mount;
              FS.hashAddNode(this);
            };
            // compatibility
            var readMode = 292 | 73;
            var writeMode = 146;
            FS.FSNode.prototype = {};
            // NOTE we must use Object.defineProperties instead of individual calls to
            // Object.defineProperty in order to make closure compiler happy
            Object.defineProperties(FS.FSNode.prototype, {
              read: {
                get: function() { return (this.mode & readMode) === readMode; },
                set: function(val) { val ? this.mode |= readMode : this.mode &= ~readMode; }
              },
              write: {
                get: function() { return (this.mode & writeMode) === writeMode; },
                set: function(val) { val ? this.mode |= writeMode : this.mode &= ~writeMode; }
              },
              isFolder: {
                get: function() { return FS.isDir(this.mode); },
              },
              isDevice: {
                get: function() { return FS.isChrdev(this.mode); },
              },
            });
          }
          return new FS.FSNode(parent, name, mode, rdev);
        },destroyNode:function (node) {
          FS.hashRemoveNode(node);
        },isRoot:function (node) {
          return node === node.parent;
        },isMountpoint:function (node) {
          return node.mounted;
        },isFile:function (mode) {
          return (mode & 61440) === 32768;
        },isDir:function (mode) {
          return (mode & 61440) === 16384;
        },isLink:function (mode) {
          return (mode & 61440) === 40960;
        },isChrdev:function (mode) {
          return (mode & 61440) === 8192;
        },isBlkdev:function (mode) {
          return (mode & 61440) === 24576;
        },isFIFO:function (mode) {
          return (mode & 61440) === 4096;
        },isSocket:function (mode) {
          return (mode & 49152) === 49152;
        },flagModes:{"r":0,"rs":1052672,"r+":2,"w":577,"wx":705,"xw":705,"w+":578,"wx+":706,"xw+":706,"a":1089,"ax":1217,"xa":1217,"a+":1090,"ax+":1218,"xa+":1218},modeStringToFlags:function (str) {
          var flags = FS.flagModes[str];
          if (typeof flags === 'undefined') {
            throw new Error('Unknown file open mode: ' + str);
          }
          return flags;
        },flagsToPermissionString:function (flag) {
          var accmode = flag & 2097155;
          var perms = ['r', 'w', 'rw'][accmode];
          if ((flag & 512)) {
            perms += 'w';
          }
          return perms;
        },nodePermissions:function (node, perms) {
          if (FS.ignorePermissions) {
            return 0;
          }
          // return 0 if any user, group or owner bits are set.
          if (perms.indexOf('r') !== -1 && !(node.mode & 292)) {
            return ERRNO_CODES.EACCES;
          } else if (perms.indexOf('w') !== -1 && !(node.mode & 146)) {
            return ERRNO_CODES.EACCES;
          } else if (perms.indexOf('x') !== -1 && !(node.mode & 73)) {
            return ERRNO_CODES.EACCES;
          }
          return 0;
        },mayLookup:function (dir) {
          return FS.nodePermissions(dir, 'x');
        },mayCreate:function (dir, name) {
          try {
            var node = FS.lookupNode(dir, name);
            return ERRNO_CODES.EEXIST;
          } catch (e) {
          }
          return FS.nodePermissions(dir, 'wx');
        },mayDelete:function (dir, name, isdir) {
          var node;
          try {
            node = FS.lookupNode(dir, name);
          } catch (e) {
            return e.errno;
          }
          var err = FS.nodePermissions(dir, 'wx');
          if (err) {
            return err;
          }
          if (isdir) {
            if (!FS.isDir(node.mode)) {
              return ERRNO_CODES.ENOTDIR;
            }
            if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
              return ERRNO_CODES.EBUSY;
            }
          } else {
            if (FS.isDir(node.mode)) {
              return ERRNO_CODES.EISDIR;
            }
          }
          return 0;
        },mayOpen:function (node, flags) {
          if (!node) {
            return ERRNO_CODES.ENOENT;
          }
          if (FS.isLink(node.mode)) {
            return ERRNO_CODES.ELOOP;
          } else if (FS.isDir(node.mode)) {
            if ((flags & 2097155) !== 0 ||  // opening for write
                (flags & 512)) {
              return ERRNO_CODES.EISDIR;
            }
          }
          return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
        },MAX_OPEN_FDS:4096,nextfd:function (fd_start, fd_end) {
          fd_start = fd_start || 1;
          fd_end = fd_end || FS.MAX_OPEN_FDS;
          for (var fd = fd_start; fd <= fd_end; fd++) {
            if (!FS.streams[fd]) {
              return fd;
            }
          }
          throw new FS.ErrnoError(ERRNO_CODES.EMFILE);
        },getStream:function (fd) {
          return FS.streams[fd];
        },createStream:function (stream, fd_start, fd_end) {
          if (!FS.FSStream) {
            FS.FSStream = function(){};
            FS.FSStream.prototype = {};
            // compatibility
            Object.defineProperties(FS.FSStream.prototype, {
              object: {
                get: function() { return this.node; },
                set: function(val) { this.node = val; }
              },
              isRead: {
                get: function() { return (this.flags & 2097155) !== 1; }
              },
              isWrite: {
                get: function() { return (this.flags & 2097155) !== 0; }
              },
              isAppend: {
                get: function() { return (this.flags & 1024); }
              }
            });
          }
          if (stream.__proto__) {
            // reuse the object
            stream.__proto__ = FS.FSStream.prototype;
          } else {
            var newStream = new FS.FSStream();
            for (var p in stream) {
              newStream[p] = stream[p];
            }
            stream = newStream;
          }
          var fd = FS.nextfd(fd_start, fd_end);
          stream.fd = fd;
          FS.streams[fd] = stream;
          return stream;
        },closeStream:function (fd) {
          FS.streams[fd] = null;
        },chrdev_stream_ops:{open:function (stream) {
            var device = FS.getDevice(stream.node.rdev);
            // override node's stream ops with the device's
            stream.stream_ops = device.stream_ops;
            // forward the open call
            if (stream.stream_ops.open) {
              stream.stream_ops.open(stream);
            }
          },llseek:function () {
            throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
          }},major:function (dev) {
          return ((dev) >> 8);
        },minor:function (dev) {
          return ((dev) & 0xff);
        },makedev:function (ma, mi) {
          return ((ma) << 8 | (mi));
        },registerDevice:function (dev, ops) {
          FS.devices[dev] = { stream_ops: ops };
        },getDevice:function (dev) {
          return FS.devices[dev];
        },syncfs:function (populate, callback) {
          if (typeof(populate) === 'function') {
            callback = populate;
            populate = false;
          }
          var completed = 0;
          var total = FS.mounts.length;
          function done(err) {
            if (err) {
              return callback(err);
            }
            if (++completed >= total) {
              callback(null);
            }
          };
          // sync all mounts
          for (var i = 0; i < FS.mounts.length; i++) {
            var mount = FS.mounts[i];
            if (!mount.type.syncfs) {
              done(null);
              continue;
            }
            mount.type.syncfs(mount, populate, done);
          }
        },mount:function (type, opts, mountpoint) {
          var lookup;
          if (mountpoint) {
            lookup = FS.lookupPath(mountpoint, { follow: false });
            mountpoint = lookup.path;  // use the absolute path
          }
          var mount = {
            type: type,
            opts: opts,
            mountpoint: mountpoint,
            root: null
          };
          // create a root node for the fs
          var root = type.mount(mount);
          root.mount = mount;
          mount.root = root;
          // assign the mount info to the mountpoint's node
          if (lookup) {
            lookup.node.mount = mount;
            lookup.node.mounted = true;
            // compatibility update FS.root if we mount to /
            if (mountpoint === '/') {
              FS.root = mount.root;
            }
          }
          // add to our cached list of mounts
          FS.mounts.push(mount);
          return root;
        },lookup:function (parent, name) {
          return parent.node_ops.lookup(parent, name);
        },mknod:function (path, mode, dev) {
          var lookup = FS.lookupPath(path, { parent: true });
          var parent = lookup.node;
          var name = PATH.basename(path);
          var err = FS.mayCreate(parent, name);
          if (err) {
            throw new FS.ErrnoError(err);
          }
          if (!parent.node_ops.mknod) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM);
          }
          return parent.node_ops.mknod(parent, name, mode, dev);
        },create:function (path, mode) {
          mode = mode !== undefined ? mode : 0666;
          mode &= 4095;
          mode |= 32768;
          return FS.mknod(path, mode, 0);
        },mkdir:function (path, mode) {
          mode = mode !== undefined ? mode : 0777;
          mode &= 511 | 512;
          mode |= 16384;
          return FS.mknod(path, mode, 0);
        },mkdev:function (path, mode, dev) {
          if (typeof(dev) === 'undefined') {
            dev = mode;
            mode = 0666;
          }
          mode |= 8192;
          return FS.mknod(path, mode, dev);
        },symlink:function (oldpath, newpath) {
          var lookup = FS.lookupPath(newpath, { parent: true });
          var parent = lookup.node;
          var newname = PATH.basename(newpath);
          var err = FS.mayCreate(parent, newname);
          if (err) {
            throw new FS.ErrnoError(err);
          }
          if (!parent.node_ops.symlink) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM);
          }
          return parent.node_ops.symlink(parent, newname, oldpath);
        },rename:function (old_path, new_path) {
          var old_dirname = PATH.dirname(old_path);
          var new_dirname = PATH.dirname(new_path);
          var old_name = PATH.basename(old_path);
          var new_name = PATH.basename(new_path);
          // parents must exist
          var lookup, old_dir, new_dir;
          try {
            lookup = FS.lookupPath(old_path, { parent: true });
            old_dir = lookup.node;
            lookup = FS.lookupPath(new_path, { parent: true });
            new_dir = lookup.node;
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
          }
          // need to be part of the same mount
          if (old_dir.mount !== new_dir.mount) {
            throw new FS.ErrnoError(ERRNO_CODES.EXDEV);
          }
          // source must exist
          var old_node = FS.lookupNode(old_dir, old_name);
          // old path should not be an ancestor of the new path
          var relative = PATH.relative(old_path, new_dirname);
          if (relative.charAt(0) !== '.') {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          // new path should not be an ancestor of the old path
          relative = PATH.relative(new_path, old_dirname);
          if (relative.charAt(0) !== '.') {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
          }
          // see if the new path already exists
          var new_node;
          try {
            new_node = FS.lookupNode(new_dir, new_name);
          } catch (e) {
            // not fatal
          }
          // early out if nothing needs to change
          if (old_node === new_node) {
            return;
          }
          // we'll need to delete the old entry
          var isdir = FS.isDir(old_node.mode);
          var err = FS.mayDelete(old_dir, old_name, isdir);
          if (err) {
            throw new FS.ErrnoError(err);
          }
          // need delete permissions if we'll be overwriting.
          // need create permissions if new doesn't already exist.
          err = new_node ?
            FS.mayDelete(new_dir, new_name, isdir) :
            FS.mayCreate(new_dir, new_name);
          if (err) {
            throw new FS.ErrnoError(err);
          }
          if (!old_dir.node_ops.rename) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM);
          }
          if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
            throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
          }
          // if we are going to change the parent, check write permissions
          if (new_dir !== old_dir) {
            err = FS.nodePermissions(old_dir, 'w');
            if (err) {
              throw new FS.ErrnoError(err);
            }
          }
          // remove the node from the lookup hash
          FS.hashRemoveNode(old_node);
          // do the underlying fs rename
          try {
            old_dir.node_ops.rename(old_node, new_dir, new_name);
          } catch (e) {
            throw e;
          } finally {
            // add the node back to the hash (in case node_ops.rename
            // changed its name)
            FS.hashAddNode(old_node);
          }
        },rmdir:function (path) {
          var lookup = FS.lookupPath(path, { parent: true });
          var parent = lookup.node;
          var name = PATH.basename(path);
          var node = FS.lookupNode(parent, name);
          var err = FS.mayDelete(parent, name, true);
          if (err) {
            throw new FS.ErrnoError(err);
          }
          if (!parent.node_ops.rmdir) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM);
          }
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
          }
          parent.node_ops.rmdir(parent, name);
          FS.destroyNode(node);
        },readdir:function (path) {
          var lookup = FS.lookupPath(path, { follow: true });
          var node = lookup.node;
          if (!node.node_ops.readdir) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
          }
          return node.node_ops.readdir(node);
        },unlink:function (path) {
          var lookup = FS.lookupPath(path, { parent: true });
          var parent = lookup.node;
          var name = PATH.basename(path);
          var node = FS.lookupNode(parent, name);
          var err = FS.mayDelete(parent, name, false);
          if (err) {
            // POSIX says unlink should set EPERM, not EISDIR
            if (err === ERRNO_CODES.EISDIR) err = ERRNO_CODES.EPERM;
            throw new FS.ErrnoError(err);
          }
          if (!parent.node_ops.unlink) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM);
          }
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
          }
          parent.node_ops.unlink(parent, name);
          FS.destroyNode(node);
        },readlink:function (path) {
          var lookup = FS.lookupPath(path, { follow: false });
          var link = lookup.node;
          if (!link.node_ops.readlink) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          return link.node_ops.readlink(link);
        },stat:function (path, dontFollow) {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          var node = lookup.node;
          if (!node.node_ops.getattr) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM);
          }
          return node.node_ops.getattr(node);
        },lstat:function (path) {
          return FS.stat(path, true);
        },chmod:function (path, mode, dontFollow) {
          var node;
          if (typeof path === 'string') {
            var lookup = FS.lookupPath(path, { follow: !dontFollow });
            node = lookup.node;
          } else {
            node = path;
          }
          if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM);
          }
          node.node_ops.setattr(node, {
            mode: (mode & 4095) | (node.mode & ~4095),
            timestamp: Date.now()
          });
        },lchmod:function (path, mode) {
          FS.chmod(path, mode, true);
        },fchmod:function (fd, mode) {
          var stream = FS.getStream(fd);
          if (!stream) {
            throw new FS.ErrnoError(ERRNO_CODES.EBADF);
          }
          FS.chmod(stream.node, mode);
        },chown:function (path, uid, gid, dontFollow) {
          var node;
          if (typeof path === 'string') {
            var lookup = FS.lookupPath(path, { follow: !dontFollow });
            node = lookup.node;
          } else {
            node = path;
          }
          if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM);
          }
          node.node_ops.setattr(node, {
            timestamp: Date.now()
            // we ignore the uid / gid for now
          });
        },lchown:function (path, uid, gid) {
          FS.chown(path, uid, gid, true);
        },fchown:function (fd, uid, gid) {
          var stream = FS.getStream(fd);
          if (!stream) {
            throw new FS.ErrnoError(ERRNO_CODES.EBADF);
          }
          FS.chown(stream.node, uid, gid);
        },truncate:function (path, len) {
          if (len < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          var node;
          if (typeof path === 'string') {
            var lookup = FS.lookupPath(path, { follow: true });
            node = lookup.node;
          } else {
            node = path;
          }
          if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM);
          }
          if (FS.isDir(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
          }
          if (!FS.isFile(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          var err = FS.nodePermissions(node, 'w');
          if (err) {
            throw new FS.ErrnoError(err);
          }
          node.node_ops.setattr(node, {
            size: len,
            timestamp: Date.now()
          });
        },ftruncate:function (fd, len) {
          var stream = FS.getStream(fd);
          if (!stream) {
            throw new FS.ErrnoError(ERRNO_CODES.EBADF);
          }
          if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          FS.truncate(stream.node, len);
        },utime:function (path, atime, mtime) {
          var lookup = FS.lookupPath(path, { follow: true });
          var node = lookup.node;
          node.node_ops.setattr(node, {
            timestamp: Math.max(atime, mtime)
          });
        },open:function (path, flags, mode, fd_start, fd_end) {
          flags = typeof flags === 'string' ? FS.modeStringToFlags(flags) : flags;
          mode = typeof mode === 'undefined' ? 0666 : mode;
          if ((flags & 64)) {
            mode = (mode & 4095) | 32768;
          } else {
            mode = 0;
          }
          var node;
          if (typeof path === 'object') {
            node = path;
          } else {
            path = PATH.normalize(path);
            try {
              var lookup = FS.lookupPath(path, {
                follow: !(flags & 131072)
              });
              node = lookup.node;
            } catch (e) {
              // ignore
            }
          }
          // perhaps we need to create the node
          if ((flags & 64)) {
            if (node) {
              // if O_CREAT and O_EXCL are set, error out if the node already exists
              if ((flags & 128)) {
                throw new FS.ErrnoError(ERRNO_CODES.EEXIST);
              }
            } else {
              // node doesn't exist, try to create it
              node = FS.mknod(path, mode, 0);
            }
          }
          if (!node) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
          }
          // can't truncate a device
          if (FS.isChrdev(node.mode)) {
            flags &= ~512;
          }
          // check permissions
          var err = FS.mayOpen(node, flags);
          if (err) {
            throw new FS.ErrnoError(err);
          }
          // do truncation if necessary
          if ((flags & 512)) {
            FS.truncate(node, 0);
          }
          // we've already handled these, don't pass down to the underlying vfs
          flags &= ~(128 | 512);
          // register the stream with the filesystem
          var stream = FS.createStream({
            node: node,
            path: FS.getPath(node),  // we want the absolute path to the node
            flags: flags,
            seekable: true,
            position: 0,
            stream_ops: node.stream_ops,
            // used by the file family libc calls (fopen, fwrite, ferror, etc.)
            ungotten: [],
            error: false
          }, fd_start, fd_end);
          // call the new stream's open function
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
          if (Module['logReadFiles'] && !(flags & 1)) {
            if (!FS.readFiles) FS.readFiles = {};
            if (!(path in FS.readFiles)) {
              FS.readFiles[path] = 1;
              Module['printErr']('read file: ' + path);
            }
          }
          return stream;
        },close:function (stream) {
          try {
            if (stream.stream_ops.close) {
              stream.stream_ops.close(stream);
            }
          } catch (e) {
            throw e;
          } finally {
            FS.closeStream(stream.fd);
          }
        },llseek:function (stream, offset, whence) {
          if (!stream.seekable || !stream.stream_ops.llseek) {
            throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
          }
          return stream.stream_ops.llseek(stream, offset, whence);
        },read:function (stream, buffer, offset, length, position) {
          if (length < 0 || position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(ERRNO_CODES.EBADF);
          }
          if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
          }
          if (!stream.stream_ops.read) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          var seeking = true;
          if (typeof position === 'undefined') {
            position = stream.position;
            seeking = false;
          } else if (!stream.seekable) {
            throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
          }
          var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
          if (!seeking) stream.position += bytesRead;
          return bytesRead;
        },write:function (stream, buffer, offset, length, position, canOwn) {
          if (length < 0 || position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EBADF);
          }
          if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
          }
          if (!stream.stream_ops.write) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          var seeking = true;
          if (typeof position === 'undefined') {
            position = stream.position;
            seeking = false;
          } else if (!stream.seekable) {
            throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
          }
          if (stream.flags & 1024) {
            // seek to the end before writing in append mode
            FS.llseek(stream, 0, 2);
          }
          var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
          if (!seeking) stream.position += bytesWritten;
          return bytesWritten;
        },allocate:function (stream, offset, length) {
          if (offset < 0 || length <= 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EBADF);
          }
          if (!FS.isFile(stream.node.mode) && !FS.isDir(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          if (!stream.stream_ops.allocate) {
            throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
          }
          stream.stream_ops.allocate(stream, offset, length);
        },mmap:function (stream, buffer, offset, length, position, prot, flags) {
          // TODO if PROT is PROT_WRITE, make sure we have write access
          if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(ERRNO_CODES.EACCES);
          }
          if (!stream.stream_ops.mmap) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags);
        },ioctl:function (stream, cmd, arg) {
          if (!stream.stream_ops.ioctl) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTTY);
          }
          return stream.stream_ops.ioctl(stream, cmd, arg);
        },readFile:function (path, opts) {
          opts = opts || {};
          opts.flags = opts.flags || 'r';
          opts.encoding = opts.encoding || 'binary';
          var ret;
          var stream = FS.open(path, opts.flags);
          var stat = FS.stat(path);
          var length = stat.size;
          var buf = new Uint8Array(length);
          FS.read(stream, buf, 0, length, 0);
          if (opts.encoding === 'utf8') {
            ret = '';
            var utf8 = new Runtime.UTF8Processor();
            for (var i = 0; i < length; i++) {
              ret += utf8.processCChar(buf[i]);
            }
          } else if (opts.encoding === 'binary') {
            ret = buf;
          } else {
            throw new Error('Invalid encoding type "' + opts.encoding + '"');
          }
          FS.close(stream);
          return ret;
        },writeFile:function (path, data, opts) {
          opts = opts || {};
          opts.flags = opts.flags || 'w';
          opts.encoding = opts.encoding || 'utf8';
          var stream = FS.open(path, opts.flags, opts.mode);
          if (opts.encoding === 'utf8') {
            var utf8 = new Runtime.UTF8Processor();
            var buf = new Uint8Array(utf8.processJSString(data));
            FS.write(stream, buf, 0, buf.length, 0);
          } else if (opts.encoding === 'binary') {
            FS.write(stream, data, 0, data.length, 0);
          } else {
            throw new Error('Invalid encoding type "' + opts.encoding + '"');
          }
          FS.close(stream);
        },cwd:function () {
          return FS.currentPath;
        },chdir:function (path) {
          var lookup = FS.lookupPath(path, { follow: true });
          if (!FS.isDir(lookup.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
          }
          var err = FS.nodePermissions(lookup.node, 'x');
          if (err) {
            throw new FS.ErrnoError(err);
          }
          FS.currentPath = lookup.path;
        },createDefaultDirectories:function () {
          FS.mkdir('/tmp');
        },createDefaultDevices:function () {
          // create /dev
          FS.mkdir('/dev');
          // setup /dev/null
          FS.registerDevice(FS.makedev(1, 3), {
            read: function() { return 0; },
            write: function() { return 0; }
          });
          FS.mkdev('/dev/null', FS.makedev(1, 3));
          // setup /dev/tty and /dev/tty1
          // stderr needs to print output using Module['printErr']
          // so we register a second tty just for it.
          TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
          TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
          FS.mkdev('/dev/tty', FS.makedev(5, 0));
          FS.mkdev('/dev/tty1', FS.makedev(6, 0));
          // we're not going to emulate the actual shm device,
          // just create the tmp dirs that reside in it commonly
          FS.mkdir('/dev/shm');
          FS.mkdir('/dev/shm/tmp');
        },createStandardStreams:function () {
          // TODO deprecate the old functionality of a single
          // input / output callback and that utilizes FS.createDevice
          // and instead require a unique set of stream ops
          // by default, we symlink the standard streams to the
          // default tty devices. however, if the standard streams
          // have been overwritten we create a unique device for
          // them instead.
          if (Module['stdin']) {
            FS.createDevice('/dev', 'stdin', Module['stdin']);
          } else {
            FS.symlink('/dev/tty', '/dev/stdin');
          }
          if (Module['stdout']) {
            FS.createDevice('/dev', 'stdout', null, Module['stdout']);
          } else {
            FS.symlink('/dev/tty', '/dev/stdout');
          }
          if (Module['stderr']) {
            FS.createDevice('/dev', 'stderr', null, Module['stderr']);
          } else {
            FS.symlink('/dev/tty1', '/dev/stderr');
          }
          // open default streams for the stdin, stdout and stderr devices
          var stdin = FS.open('/dev/stdin', 'r');
          HEAP32[((_stdin)>>2)]=stdin.fd;
          assert(stdin.fd === 1, 'invalid handle for stdin (' + stdin.fd + ')');
          var stdout = FS.open('/dev/stdout', 'w');
          HEAP32[((_stdout)>>2)]=stdout.fd;
          assert(stdout.fd === 2, 'invalid handle for stdout (' + stdout.fd + ')');
          var stderr = FS.open('/dev/stderr', 'w');
          HEAP32[((_stderr)>>2)]=stderr.fd;
          assert(stderr.fd === 3, 'invalid handle for stderr (' + stderr.fd + ')');
        },ensureErrnoError:function () {
          if (FS.ErrnoError) return;
          FS.ErrnoError = function ErrnoError(errno) {
            this.errno = errno;
            for (var key in ERRNO_CODES) {
              if (ERRNO_CODES[key] === errno) {
                this.code = key;
                break;
              }
            }
            this.message = ERRNO_MESSAGES[errno];
            this.stack = stackTrace();
          };
          FS.ErrnoError.prototype = new Error();
          FS.ErrnoError.prototype.constructor = FS.ErrnoError;
          // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
          [ERRNO_CODES.ENOENT].forEach(function(code) {
            FS.genericErrors[code] = new FS.ErrnoError(code);
            FS.genericErrors[code].stack = '<generic error, no stack>';
          });
        },staticInit:function () {
          FS.ensureErrnoError();
          FS.nameTable = new Array(4096);
          FS.root = FS.createNode(null, '/', 16384 | 0777, 0);
          FS.mount(MEMFS, {}, '/');
          FS.createDefaultDirectories();
          FS.createDefaultDevices();
        },init:function (input, output, error) {
          assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
          FS.init.initialized = true;
          FS.ensureErrnoError();
          // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
          Module['stdin'] = input || Module['stdin'];
          Module['stdout'] = output || Module['stdout'];
          Module['stderr'] = error || Module['stderr'];
          FS.createStandardStreams();
        },quit:function () {
          FS.init.initialized = false;
          for (var i = 0; i < FS.streams.length; i++) {
            var stream = FS.streams[i];
            if (!stream) {
              continue;
            }
            FS.close(stream);
          }
        },getMode:function (canRead, canWrite) {
          var mode = 0;
          if (canRead) mode |= 292 | 73;
          if (canWrite) mode |= 146;
          return mode;
        },joinPath:function (parts, forceRelative) {
          var path = PATH.join.apply(null, parts);
          if (forceRelative && path[0] == '/') path = path.substr(1);
          return path;
        },absolutePath:function (relative, base) {
          return PATH.resolve(base, relative);
        },standardizePath:function (path) {
          return PATH.normalize(path);
        },findObject:function (path, dontResolveLastLink) {
          var ret = FS.analyzePath(path, dontResolveLastLink);
          if (ret.exists) {
            return ret.object;
          } else {
            ___setErrNo(ret.error);
            return null;
          }
        },analyzePath:function (path, dontResolveLastLink) {
          // operate from within the context of the symlink's target
          try {
            var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
            path = lookup.path;
          } catch (e) {
          }
          var ret = {
            isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
            parentExists: false, parentPath: null, parentObject: null
          };
          try {
            var lookup = FS.lookupPath(path, { parent: true });
            ret.parentExists = true;
            ret.parentPath = lookup.path;
            ret.parentObject = lookup.node;
            ret.name = PATH.basename(path);
            lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
            ret.exists = true;
            ret.path = lookup.path;
            ret.object = lookup.node;
            ret.name = lookup.node.name;
            ret.isRoot = lookup.path === '/';
          } catch (e) {
            ret.error = e.errno;
          };
          return ret;
        },createFolder:function (parent, name, canRead, canWrite) {
          var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
          var mode = FS.getMode(canRead, canWrite);
          return FS.mkdir(path, mode);
        },createPath:function (parent, path, canRead, canWrite) {
          parent = typeof parent === 'string' ? parent : FS.getPath(parent);
          var parts = path.split('/').reverse();
          while (parts.length) {
            var part = parts.pop();
            if (!part) continue;
            var current = PATH.join2(parent, part);
            try {
              FS.mkdir(current);
            } catch (e) {
              // ignore EEXIST
            }
            parent = current;
          }
          return current;
        },createFile:function (parent, name, properties, canRead, canWrite) {
          var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
          var mode = FS.getMode(canRead, canWrite);
          return FS.create(path, mode);
        },createDataFile:function (parent, name, data, canRead, canWrite, canOwn) {
          var path = name ? PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name) : parent;
          var mode = FS.getMode(canRead, canWrite);
          var node = FS.create(path, mode);
          if (data) {
            if (typeof data === 'string') {
              var arr = new Array(data.length);
              for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
              data = arr;
            }
            // make sure we can write to the file
            FS.chmod(node, mode | 146);
            var stream = FS.open(node, 'w');
            FS.write(stream, data, 0, data.length, 0, canOwn);
            FS.close(stream);
            FS.chmod(node, mode);
          }
          return node;
        },createDevice:function (parent, name, input, output) {
          var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
          var mode = FS.getMode(!!input, !!output);
          if (!FS.createDevice.major) FS.createDevice.major = 64;
          var dev = FS.makedev(FS.createDevice.major++, 0);
          // Create a fake device that a set of stream ops to emulate
          // the old behavior.
          FS.registerDevice(dev, {
            open: function(stream) {
              stream.seekable = false;
            },
            close: function(stream) {
              // flush any pending line data
              if (output && output.buffer && output.buffer.length) {
                output(10);
              }
            },
            read: function(stream, buffer, offset, length, pos /* ignored */) {
              var bytesRead = 0;
              for (var i = 0; i < length; i++) {
                var result;
                try {
                  result = input();
                } catch (e) {
                  throw new FS.ErrnoError(ERRNO_CODES.EIO);
                }
                if (result === undefined && bytesRead === 0) {
                  throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
                }
                if (result === null || result === undefined) break;
                bytesRead++;
                buffer[offset+i] = result;
              }
              if (bytesRead) {
                stream.node.timestamp = Date.now();
              }
              return bytesRead;
            },
            write: function(stream, buffer, offset, length, pos) {
              for (var i = 0; i < length; i++) {
                try {
                  output(buffer[offset+i]);
                } catch (e) {
                  throw new FS.ErrnoError(ERRNO_CODES.EIO);
                }
              }
              if (length) {
                stream.node.timestamp = Date.now();
              }
              return i;
            }
          });
          return FS.mkdev(path, mode, dev);
        },createLink:function (parent, name, target, canRead, canWrite) {
          var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
          return FS.symlink(target, path);
        },forceLoadFile:function (obj) {
          if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
          var success = true;
          if (typeof XMLHttpRequest !== 'undefined') {
            throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
          } else if (Module['read']) {
            // Command-line.
            try {
              // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
              //          read() will try to parse UTF8.
              obj.contents = intArrayFromString(Module['read'](obj.url), true);
            } catch (e) {
              success = false;
            }
          } else {
            throw new Error('Cannot load without read() or XMLHttpRequest.');
          }
          if (!success) ___setErrNo(ERRNO_CODES.EIO);
          return success;
        },createLazyFile:function (parent, name, url, canRead, canWrite) {
          if (typeof XMLHttpRequest !== 'undefined') {
            if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
            // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
            function LazyUint8Array() {
              this.lengthKnown = false;
              this.chunks = []; // Loaded chunks. Index is the chunk number
            }
            LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
              if (idx > this.length-1 || idx < 0) {
                return undefined;
              }
              var chunkOffset = idx % this.chunkSize;
              var chunkNum = Math.floor(idx / this.chunkSize);
              return this.getter(chunkNum)[chunkOffset];
            }
            LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
              this.getter = getter;
            }
            LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
                // Find length
                var xhr = new XMLHttpRequest();
                xhr.open('HEAD', url, false);
                xhr.send(null);
                if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                var datalength = Number(xhr.getResponseHeader("Content-length"));
                var header;
                var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
                var chunkSize = 1024*1024; // Chunk size in bytes
                if (!hasByteServing) chunkSize = datalength;
                // Function to get a range from the remote URL.
                var doXHR = (function(from, to) {
                  if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                  if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
                  // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
                  var xhr = new XMLHttpRequest();
                  xhr.open('GET', url, false);
                  if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
                  // Some hints to the browser that we want binary data.
                  if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
                  if (xhr.overrideMimeType) {
                    xhr.overrideMimeType('text/plain; charset=x-user-defined');
                  }
                  xhr.send(null);
                  if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                  if (xhr.response !== undefined) {
                    return new Uint8Array(xhr.response || []);
                  } else {
                    return intArrayFromString(xhr.responseText || '', true);
                  }
                });
                var lazyArray = this;
                lazyArray.setDataGetter(function(chunkNum) {
                  var start = chunkNum * chunkSize;
                  var end = (chunkNum+1) * chunkSize - 1; // including this byte
                  end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
                  if (typeof(lazyArray.chunks[chunkNum]) === "undefined") {
                    lazyArray.chunks[chunkNum] = doXHR(start, end);
                  }
                  if (typeof(lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
                  return lazyArray.chunks[chunkNum];
                });
                this._length = datalength;
                this._chunkSize = chunkSize;
                this.lengthKnown = true;
            }
            var lazyArray = new LazyUint8Array();
            Object.defineProperty(lazyArray, "length", {
                get: function() {
                    if(!this.lengthKnown) {
                        this.cacheLength();
                    }
                    return this._length;
                }
            });
            Object.defineProperty(lazyArray, "chunkSize", {
                get: function() {
                    if(!this.lengthKnown) {
                        this.cacheLength();
                    }
                    return this._chunkSize;
                }
            });
            var properties = { isDevice: false, contents: lazyArray };
          } else {
            var properties = { isDevice: false, url: url };
          }
          var node = FS.createFile(parent, name, properties, canRead, canWrite);
          // This is a total hack, but I want to get this lazy file code out of the
          // core of MEMFS. If we want to keep this lazy file concept I feel it should
          // be its own thin LAZYFS proxying calls to MEMFS.
          if (properties.contents) {
            node.contents = properties.contents;
          } else if (properties.url) {
            node.contents = null;
            node.url = properties.url;
          }
          // override each stream op with one that tries to force load the lazy file first
          var stream_ops = {};
          var keys = Object.keys(node.stream_ops);
          keys.forEach(function(key) {
            var fn = node.stream_ops[key];
            stream_ops[key] = function forceLoadLazyFile() {
              if (!FS.forceLoadFile(node)) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
              return fn.apply(null, arguments);
            };
          });
          // use a custom read function
          stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
            if (!FS.forceLoadFile(node)) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            var contents = stream.node.contents;
            if (position >= contents.length)
              return 0;
            var size = Math.min(contents.length - position, length);
            assert(size >= 0);
            if (contents.slice) { // normal array
              for (var i = 0; i < size; i++) {
                buffer[offset + i] = contents[position + i];
              }
            } else {
              for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
                buffer[offset + i] = contents.get(position + i);
              }
            }
            return size;
          };
          node.stream_ops = stream_ops;
          return node;
        },createPreloadedFile:function (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn) {
          Browser.init();
          // TODO we should allow people to just pass in a complete filename instead
          // of parent and name being that we just join them anyways
          var fullname = name ? PATH.resolve(PATH.join2(parent, name)) : parent;
          function processData(byteArray) {
            function finish(byteArray) {
              if (!dontCreateFile) {
                FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
              }
              if (onload) onload();
              removeRunDependency('cp ' + fullname);
            }
            var handled = false;
            Module['preloadPlugins'].forEach(function(plugin) {
              if (handled) return;
              if (plugin['canHandle'](fullname)) {
                plugin['handle'](byteArray, fullname, finish, function() {
                  if (onerror) onerror();
                  removeRunDependency('cp ' + fullname);
                });
                handled = true;
              }
            });
            if (!handled) finish(byteArray);
          }
          addRunDependency('cp ' + fullname);
          if (typeof url == 'string') {
            Browser.asyncLoad(url, function(byteArray) {
              processData(byteArray);
            }, onerror);
          } else {
            processData(url);
          }
        },indexedDB:function () {
          return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        },DB_NAME:function () {
          return 'EM_FS_' + window.location.pathname;
        },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:function (paths, onload, onerror) {
          onload = onload || function(){};
          onerror = onerror || function(){};
          var indexedDB = FS.indexedDB();
          try {
            var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
          } catch (e) {
            return onerror(e);
          }
          openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
            console.log('creating db');
            var db = openRequest.result;
            db.createObjectStore(FS.DB_STORE_NAME);
          };
          openRequest.onsuccess = function openRequest_onsuccess() {
            var db = openRequest.result;
            var transaction = db.transaction([FS.DB_STORE_NAME], 'readwrite');
            var files = transaction.objectStore(FS.DB_STORE_NAME);
            var ok = 0, fail = 0, total = paths.length;
            function finish() {
              if (fail == 0) onload(); else onerror();
            }
            paths.forEach(function(path) {
              var putRequest = files.put(FS.analyzePath(path).object.contents, path);
              putRequest.onsuccess = function putRequest_onsuccess() { ok++; if (ok + fail == total) finish() };
              putRequest.onerror = function putRequest_onerror() { fail++; if (ok + fail == total) finish() };
            });
            transaction.onerror = onerror;
          };
          openRequest.onerror = onerror;
        },loadFilesFromDB:function (paths, onload, onerror) {
          onload = onload || function(){};
          onerror = onerror || function(){};
          var indexedDB = FS.indexedDB();
          try {
            var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
          } catch (e) {
            return onerror(e);
          }
          openRequest.onupgradeneeded = onerror; // no database to load from
          openRequest.onsuccess = function openRequest_onsuccess() {
            var db = openRequest.result;
            try {
              var transaction = db.transaction([FS.DB_STORE_NAME], 'readonly');
            } catch(e) {
              onerror(e);
              return;
            }
            var files = transaction.objectStore(FS.DB_STORE_NAME);
            var ok = 0, fail = 0, total = paths.length;
            function finish() {
              if (fail == 0) onload(); else onerror();
            }
            paths.forEach(function(path) {
              var getRequest = files.get(path);
              getRequest.onsuccess = function getRequest_onsuccess() {
                if (FS.analyzePath(path).exists) {
                  FS.unlink(path);
                }
                FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
                ok++;
                if (ok + fail == total) finish();
              };
              getRequest.onerror = function getRequest_onerror() { fail++; if (ok + fail == total) finish() };
            });
            transaction.onerror = onerror;
          };
          openRequest.onerror = onerror;
        }};
    var _mkport=undefined;var SOCKFS={mount:function (mount) {
          return FS.createNode(null, '/', 16384 | 0777, 0);
        },createSocket:function (family, type, protocol) {
          var streaming = type == 1;
          if (protocol) {
            assert(streaming == (protocol == 6)); // if SOCK_STREAM, must be tcp
          }
          // create our internal socket structure
          var sock = {
            family: family,
            type: type,
            protocol: protocol,
            server: null,
            peers: {},
            pending: [],
            recv_queue: [],
            sock_ops: SOCKFS.websocket_sock_ops
          };
          // create the filesystem node to store the socket structure
          var name = SOCKFS.nextname();
          var node = FS.createNode(SOCKFS.root, name, 49152, 0);
          node.sock = sock;
          // and the wrapping stream that enables library functions such
          // as read and write to indirectly interact with the socket
          var stream = FS.createStream({
            path: name,
            node: node,
            flags: FS.modeStringToFlags('r+'),
            seekable: false,
            stream_ops: SOCKFS.stream_ops
          });
          // map the new stream to the socket structure (sockets have a 1:1
          // relationship with a stream)
          sock.stream = stream;
          return sock;
        },getSocket:function (fd) {
          var stream = FS.getStream(fd);
          if (!stream || !FS.isSocket(stream.node.mode)) {
            return null;
          }
          return stream.node.sock;
        },stream_ops:{poll:function (stream) {
            var sock = stream.node.sock;
            return sock.sock_ops.poll(sock);
          },ioctl:function (stream, request, varargs) {
            var sock = stream.node.sock;
            return sock.sock_ops.ioctl(sock, request, varargs);
          },read:function (stream, buffer, offset, length, position /* ignored */) {
            var sock = stream.node.sock;
            var msg = sock.sock_ops.recvmsg(sock, length);
            if (!msg) {
              // socket is closed
              return 0;
            }
            buffer.set(msg.buffer, offset);
            return msg.buffer.length;
          },write:function (stream, buffer, offset, length, position /* ignored */) {
            var sock = stream.node.sock;
            return sock.sock_ops.sendmsg(sock, buffer, offset, length);
          },close:function (stream) {
            var sock = stream.node.sock;
            sock.sock_ops.close(sock);
          }},nextname:function () {
          if (!SOCKFS.nextname.current) {
            SOCKFS.nextname.current = 0;
          }
          return 'socket[' + (SOCKFS.nextname.current++) + ']';
        },websocket_sock_ops:{createPeer:function (sock, addr, port) {
            var ws;
            if (typeof addr === 'object') {
              ws = addr;
              addr = null;
              port = null;
            }
            if (ws) {
              // for sockets that've already connected (e.g. we're the server)
              // we can inspect the _socket property for the address
              if (ws._socket) {
                addr = ws._socket.remoteAddress;
                port = ws._socket.remotePort;
              }
              // if we're just now initializing a connection to the remote,
              // inspect the url property
              else {
                var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
                if (!result) {
                  throw new Error('WebSocket URL must be in the format ws(s)://address:port');
                }
                addr = result[1];
                port = parseInt(result[2], 10);
              }
            } else {
              // create the actual websocket object and connect
              try {
                var url = 'ws://' + addr + ':' + port;
                // the node ws library API is slightly different than the browser's
                var opts = ENVIRONMENT_IS_NODE ? {headers: {'websocket-protocol': ['binary']}} : ['binary'];
                // If node we use the ws library.
                var WebSocket = ENVIRONMENT_IS_NODE ? require('ws') : window['WebSocket'];
                ws = new WebSocket(url, opts);
                ws.binaryType = 'arraybuffer';
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EHOSTUNREACH);
              }
            }
            var peer = {
              addr: addr,
              port: port,
              socket: ws,
              dgram_send_queue: []
            };
            SOCKFS.websocket_sock_ops.addPeer(sock, peer);
            SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer);
            // if this is a bound dgram socket, send the port number first to allow
            // us to override the ephemeral port reported to us by remotePort on the
            // remote end.
            if (sock.type === 2 && typeof sock.sport !== 'undefined') {
              peer.dgram_send_queue.push(new Uint8Array([
                  255, 255, 255, 255,
                  'p'.charCodeAt(0), 'o'.charCodeAt(0), 'r'.charCodeAt(0), 't'.charCodeAt(0),
                  ((sock.sport & 0xff00) >> 8) , (sock.sport & 0xff)
              ]));
            }
            return peer;
          },getPeer:function (sock, addr, port) {
            return sock.peers[addr + ':' + port];
          },addPeer:function (sock, peer) {
            sock.peers[peer.addr + ':' + peer.port] = peer;
          },removePeer:function (sock, peer) {
            delete sock.peers[peer.addr + ':' + peer.port];
          },handlePeerEvents:function (sock, peer) {
            var first = true;
            var handleOpen = function () {
              try {
                var queued = peer.dgram_send_queue.shift();
                while (queued) {
                  peer.socket.send(queued);
                  queued = peer.dgram_send_queue.shift();
                }
              } catch (e) {
                // not much we can do here in the way of proper error handling as we've already
                // lied and said this data was sent. shut it down.
                peer.socket.close();
              }
            };
            function handleMessage(data) {
              assert(typeof data !== 'string' && data.byteLength !== undefined);  // must receive an ArrayBuffer
              data = new Uint8Array(data);  // make a typed array view on the array buffer
              // if this is the port message, override the peer's port with it
              var wasfirst = first;
              first = false;
              if (wasfirst &&
                  data.length === 10 &&
                  data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255 &&
                  data[4] === 'p'.charCodeAt(0) && data[5] === 'o'.charCodeAt(0) && data[6] === 'r'.charCodeAt(0) && data[7] === 't'.charCodeAt(0)) {
                // update the peer's port and it's key in the peer map
                var newport = ((data[8] << 8) | data[9]);
                SOCKFS.websocket_sock_ops.removePeer(sock, peer);
                peer.port = newport;
                SOCKFS.websocket_sock_ops.addPeer(sock, peer);
                return;
              }
              sock.recv_queue.push({ addr: peer.addr, port: peer.port, data: data });
            };
            if (ENVIRONMENT_IS_NODE) {
              peer.socket.on('open', handleOpen);
              peer.socket.on('message', function(data, flags) {
                if (!flags.binary) {
                  return;
                }
                handleMessage((new Uint8Array(data)).buffer);  // copy from node Buffer -> ArrayBuffer
              });
              peer.socket.on('error', function() {
                // don't throw
              });
            } else {
              peer.socket.onopen = handleOpen;
              peer.socket.onmessage = function peer_socket_onmessage(event) {
                handleMessage(event.data);
              };
            }
          },poll:function (sock) {
            if (sock.type === 1 && sock.server) {
              // listen sockets should only say they're available for reading
              // if there are pending clients.
              return sock.pending.length ? (64 | 1) : 0;
            }
            var mask = 0;
            var dest = sock.type === 1 ?  // we only care about the socket state for connection-based sockets
              SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) :
              null;
            if (sock.recv_queue.length ||
                !dest ||  // connection-less sockets are always ready to read
                (dest && dest.socket.readyState === dest.socket.CLOSING) ||
                (dest && dest.socket.readyState === dest.socket.CLOSED)) {  // let recv return 0 once closed
              mask |= (64 | 1);
            }
            if (!dest ||  // connection-less sockets are always ready to write
                (dest && dest.socket.readyState === dest.socket.OPEN)) {
              mask |= 4;
            }
            if ((dest && dest.socket.readyState === dest.socket.CLOSING) ||
                (dest && dest.socket.readyState === dest.socket.CLOSED)) {
              mask |= 16;
            }
            return mask;
          },ioctl:function (sock, request, arg) {
            switch (request) {
              case 21531:
                var bytes = 0;
                if (sock.recv_queue.length) {
                  bytes = sock.recv_queue[0].data.length;
                }
                HEAP32[((arg)>>2)]=bytes;
                return 0;
              default:
                return ERRNO_CODES.EINVAL;
            }
          },close:function (sock) {
            // if we've spawned a listen server, close it
            if (sock.server) {
              try {
                sock.server.close();
              } catch (e) {
              }
              sock.server = null;
            }
            // close any peer connections
            var peers = Object.keys(sock.peers);
            for (var i = 0; i < peers.length; i++) {
              var peer = sock.peers[peers[i]];
              try {
                peer.socket.close();
              } catch (e) {
              }
              SOCKFS.websocket_sock_ops.removePeer(sock, peer);
            }
            return 0;
          },bind:function (sock, addr, port) {
            if (typeof sock.saddr !== 'undefined' || typeof sock.sport !== 'undefined') {
              throw new FS.ErrnoError(ERRNO_CODES.EINVAL);  // already bound
            }
            sock.saddr = addr;
            sock.sport = port || _mkport();
            // in order to emulate dgram sockets, we need to launch a listen server when
            // binding on a connection-less socket
            // note: this is only required on the server side
            if (sock.type === 2) {
              // close the existing server if it exists
              if (sock.server) {
                sock.server.close();
                sock.server = null;
              }
              // swallow error operation not supported error that occurs when binding in the
              // browser where this isn't supported
              try {
                sock.sock_ops.listen(sock, 0);
              } catch (e) {
                if (!(e instanceof FS.ErrnoError)) throw e;
                if (e.errno !== ERRNO_CODES.EOPNOTSUPP) throw e;
              }
            }
          },connect:function (sock, addr, port) {
            if (sock.server) {
              throw new FS.ErrnoError(ERRNO_CODS.EOPNOTSUPP);
            }
            // TODO autobind
            // if (!sock.addr && sock.type == 2) {
            // }
            // early out if we're already connected / in the middle of connecting
            if (typeof sock.daddr !== 'undefined' && typeof sock.dport !== 'undefined') {
              var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
              if (dest) {
                if (dest.socket.readyState === dest.socket.CONNECTING) {
                  throw new FS.ErrnoError(ERRNO_CODES.EALREADY);
                } else {
                  throw new FS.ErrnoError(ERRNO_CODES.EISCONN);
                }
              }
            }
            // add the socket to our peer list and set our
            // destination address / port to match
            var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
            sock.daddr = peer.addr;
            sock.dport = peer.port;
            // always "fail" in non-blocking mode
            throw new FS.ErrnoError(ERRNO_CODES.EINPROGRESS);
          },listen:function (sock, backlog) {
            if (!ENVIRONMENT_IS_NODE) {
              throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
            }
            if (sock.server) {
               throw new FS.ErrnoError(ERRNO_CODES.EINVAL);  // already listening
            }
            var WebSocketServer = require('ws').Server;
            var host = sock.saddr;
            sock.server = new WebSocketServer({
              host: host,
              port: sock.sport
              // TODO support backlog
            });
            sock.server.on('connection', function(ws) {
              if (sock.type === 1) {
                var newsock = SOCKFS.createSocket(sock.family, sock.type, sock.protocol);
                // create a peer on the new socket
                var peer = SOCKFS.websocket_sock_ops.createPeer(newsock, ws);
                newsock.daddr = peer.addr;
                newsock.dport = peer.port;
                // push to queue for accept to pick up
                sock.pending.push(newsock);
              } else {
                // create a peer on the listen socket so calling sendto
                // with the listen socket and an address will resolve
                // to the correct client
                SOCKFS.websocket_sock_ops.createPeer(sock, ws);
              }
            });
            sock.server.on('closed', function() {
              sock.server = null;
            });
            sock.server.on('error', function() {
              // don't throw
            });
          },accept:function (listensock) {
            if (!listensock.server) {
              throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
            }
            var newsock = listensock.pending.shift();
            newsock.stream.flags = listensock.stream.flags;
            return newsock;
          },getname:function (sock, peer) {
            var addr, port;
            if (peer) {
              if (sock.daddr === undefined || sock.dport === undefined) {
                throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
              }
              addr = sock.daddr;
              port = sock.dport;
            } else {
              // TODO saddr and sport will be set for bind()'d UDP sockets, but what
              // should we be returning for TCP sockets that've been connect()'d?
              addr = sock.saddr || 0;
              port = sock.sport || 0;
            }
            return { addr: addr, port: port };
          },sendmsg:function (sock, buffer, offset, length, addr, port) {
            if (sock.type === 2) {
              // connection-less sockets will honor the message address,
              // and otherwise fall back to the bound destination address
              if (addr === undefined || port === undefined) {
                addr = sock.daddr;
                port = sock.dport;
              }
              // if there was no address to fall back to, error out
              if (addr === undefined || port === undefined) {
                throw new FS.ErrnoError(ERRNO_CODES.EDESTADDRREQ);
              }
            } else {
              // connection-based sockets will only use the bound
              addr = sock.daddr;
              port = sock.dport;
            }
            // find the peer for the destination address
            var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);
            // early out if not connected with a connection-based socket
            if (sock.type === 1) {
              if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
              } else if (dest.socket.readyState === dest.socket.CONNECTING) {
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
            }
            // create a copy of the incoming data to send, as the WebSocket API
            // doesn't work entirely with an ArrayBufferView, it'll just send
            // the entire underlying buffer
            var data;
            if (buffer instanceof Array || buffer instanceof ArrayBuffer) {
              data = buffer.slice(offset, offset + length);
            } else {  // ArrayBufferView
              data = buffer.buffer.slice(buffer.byteOffset + offset, buffer.byteOffset + offset + length);
            }
            // if we're emulating a connection-less dgram socket and don't have
            // a cached connection, queue the buffer to send upon connect and
            // lie, saying the data was sent now.
            if (sock.type === 2) {
              if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
                // if we're not connected, open a new connection
                if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                  dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
                }
                dest.dgram_send_queue.push(data);
                return length;
              }
            }
            try {
              // send the actual data
              dest.socket.send(data);
              return length;
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
            }
          },recvmsg:function (sock, length) {
            // http://pubs.opengroup.org/onlinepubs/7908799/xns/recvmsg.html
            if (sock.type === 1 && sock.server) {
              // tcp servers should not be recv()'ing on the listen socket
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            }
            var queued = sock.recv_queue.shift();
            if (!queued) {
              if (sock.type === 1) {
                var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
                if (!dest) {
                  // if we have a destination address but are not connected, error out
                  throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
                }
                else if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                  // return null if the socket has closed
                  return null;
                }
                else {
                  // else, our socket is in a valid state but truly has nothing available
                  throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
                }
              } else {
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
            }
            // queued.data will be an ArrayBuffer if it's unadulterated, but if it's
            // requeued TCP data it'll be an ArrayBufferView
            var queuedLength = queued.data.byteLength || queued.data.length;
            var queuedOffset = queued.data.byteOffset || 0;
            var queuedBuffer = queued.data.buffer || queued.data;
            var bytesRead = Math.min(length, queuedLength);
            var res = {
              buffer: new Uint8Array(queuedBuffer, queuedOffset, bytesRead),
              addr: queued.addr,
              port: queued.port
            };
            // push back any unread data for TCP connections
            if (sock.type === 1 && bytesRead < queuedLength) {
              var bytesRemaining = queuedLength - bytesRead;
              queued.data = new Uint8Array(queuedBuffer, queuedOffset + bytesRead, bytesRemaining);
              sock.recv_queue.unshift(queued);
            }
            return res;
          }}};function _send(fd, buf, len, flags) {
        var sock = SOCKFS.getSocket(fd);
        if (!sock) {
          ___setErrNo(ERRNO_CODES.EBADF);
          return -1;
        }
        // TODO honor flags
        return _write(fd, buf, len);
      }
    function _pwrite(fildes, buf, nbyte, offset) {
        // ssize_t pwrite(int fildes, const void *buf, size_t nbyte, off_t offset);
        // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
        var stream = FS.getStream(fildes);
        if (!stream) {
          ___setErrNo(ERRNO_CODES.EBADF);
          return -1;
        }
        try {
          var slab = HEAP8;
          return FS.write(stream, slab, buf, nbyte, offset);
        } catch (e) {
          FS.handleFSError(e);
          return -1;
        }
      }function _write(fildes, buf, nbyte) {
        // ssize_t write(int fildes, const void *buf, size_t nbyte);
        // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
        var stream = FS.getStream(fildes);
        if (!stream) {
          ___setErrNo(ERRNO_CODES.EBADF);
          return -1;
        }
        try {
          var slab = HEAP8;
          return FS.write(stream, slab, buf, nbyte);
        } catch (e) {
          FS.handleFSError(e);
          return -1;
        }
      }function _fwrite(ptr, size, nitems, stream) {
        // size_t fwrite(const void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
        // http://pubs.opengroup.org/onlinepubs/000095399/functions/fwrite.html
        var bytesToWrite = nitems * size;
        if (bytesToWrite == 0) return 0;
        var bytesWritten = _write(stream, ptr, bytesToWrite);
        if (bytesWritten == -1) {
          var streamObj = FS.getStream(stream);
          if (streamObj) streamObj.error = true;
          return 0;
        } else {
          return Math.floor(bytesWritten / size);
        }
      }
    function _strlen(ptr) {
        ptr = ptr|0;
        var curr = 0;
        curr = ptr;
        while (HEAP8[(curr)]) {
          curr = (curr + 1)|0;
        }
        return (curr - ptr)|0;
      }
    function __reallyNegative(x) {
        return x < 0 || (x === 0 && (1/x) === -Infinity);
      }function __formatString(format, varargs) {
        var textIndex = format;
        var argIndex = 0;
        function getNextArg(type) {
          // NOTE: Explicitly ignoring type safety. Otherwise this fails:
          //       int x = 4; printf("%c\n", (char)x);
          var ret;
          if (type === 'double') {
            ret = HEAPF64[(((varargs)+(argIndex))>>3)];
          } else if (type == 'i64') {
            ret = [HEAP32[(((varargs)+(argIndex))>>2)],
                   HEAP32[(((varargs)+(argIndex+8))>>2)]];
            argIndex += 8; // each 32-bit chunk is in a 64-bit block
          } else {
            type = 'i32'; // varargs are always i32, i64, or double
            ret = HEAP32[(((varargs)+(argIndex))>>2)];
          }
          argIndex += Math.max(Runtime.getNativeFieldSize(type), Runtime.getAlignSize(type, null, true));
          return ret;
        }
        var ret = [];
        var curr, next, currArg;
        while(1) {
          var startTextIndex = textIndex;
          curr = HEAP8[(textIndex)];
          if (curr === 0) break;
          next = HEAP8[((textIndex+1)|0)];
          if (curr == 37) {
            // Handle flags.
            var flagAlwaysSigned = false;
            var flagLeftAlign = false;
            var flagAlternative = false;
            var flagZeroPad = false;
            var flagPadSign = false;
            flagsLoop: while (1) {
              switch (next) {
                case 43:
                  flagAlwaysSigned = true;
                  break;
                case 45:
                  flagLeftAlign = true;
                  break;
                case 35:
                  flagAlternative = true;
                  break;
                case 48:
                  if (flagZeroPad) {
                    break flagsLoop;
                  } else {
                    flagZeroPad = true;
                    break;
                  }
                case 32:
                  flagPadSign = true;
                  break;
                default:
                  break flagsLoop;
              }
              textIndex++;
              next = HEAP8[((textIndex+1)|0)];
            }
            // Handle width.
            var width = 0;
            if (next == 42) {
              width = getNextArg('i32');
              textIndex++;
              next = HEAP8[((textIndex+1)|0)];
            } else {
              while (next >= 48 && next <= 57) {
                width = width * 10 + (next - 48);
                textIndex++;
                next = HEAP8[((textIndex+1)|0)];
              }
            }
            // Handle precision.
            var precisionSet = false;
            if (next == 46) {
              var precision = 0;
              precisionSet = true;
              textIndex++;
              next = HEAP8[((textIndex+1)|0)];
              if (next == 42) {
                precision = getNextArg('i32');
                textIndex++;
              } else {
                while(1) {
                  var precisionChr = HEAP8[((textIndex+1)|0)];
                  if (precisionChr < 48 ||
                      precisionChr > 57) break;
                  precision = precision * 10 + (precisionChr - 48);
                  textIndex++;
                }
              }
              next = HEAP8[((textIndex+1)|0)];
            } else {
              var precision = 6; // Standard default.
            }
            // Handle integer sizes. WARNING: These assume a 32-bit architecture!
            var argSize;
            switch (String.fromCharCode(next)) {
              case 'h':
                var nextNext = HEAP8[((textIndex+2)|0)];
                if (nextNext == 104) {
                  textIndex++;
                  argSize = 1; // char (actually i32 in varargs)
                } else {
                  argSize = 2; // short (actually i32 in varargs)
                }
                break;
              case 'l':
                var nextNext = HEAP8[((textIndex+2)|0)];
                if (nextNext == 108) {
                  textIndex++;
                  argSize = 8; // long long
                } else {
                  argSize = 4; // long
                }
                break;
              case 'L': // long long
              case 'q': // int64_t
              case 'j': // intmax_t
                argSize = 8;
                break;
              case 'z': // size_t
              case 't': // ptrdiff_t
              case 'I': // signed ptrdiff_t or unsigned size_t
                argSize = 4;
                break;
              default:
                argSize = null;
            }
            if (argSize) textIndex++;
            next = HEAP8[((textIndex+1)|0)];
            // Handle type specifier.
            switch (String.fromCharCode(next)) {
              case 'd': case 'i': case 'u': case 'o': case 'x': case 'X': case 'p': {
                // Integer.
                var signed = next == 100 || next == 105;
                argSize = argSize || 4;
                var currArg = getNextArg('i' + (argSize * 8));
                var origArg = currArg;
                var argText;
                // Flatten i64-1 [low, high] into a (slightly rounded) double
                if (argSize == 8) {
                  currArg = Runtime.makeBigInt(currArg[0], currArg[1], next == 117);
                }
                // Truncate to requested size.
                if (argSize <= 4) {
                  var limit = Math.pow(256, argSize) - 1;
                  currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8);
                }
                // Format the number.
                var currAbsArg = Math.abs(currArg);
                var prefix = '';
                if (next == 100 || next == 105) {
                  if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], null); else
                  argText = reSign(currArg, 8 * argSize, 1).toString(10);
                } else if (next == 117) {
                  if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], true); else
                  argText = unSign(currArg, 8 * argSize, 1).toString(10);
                  currArg = Math.abs(currArg);
                } else if (next == 111) {
                  argText = (flagAlternative ? '0' : '') + currAbsArg.toString(8);
                } else if (next == 120 || next == 88) {
                  prefix = (flagAlternative && currArg != 0) ? '0x' : '';
                  if (argSize == 8 && i64Math) {
                    if (origArg[1]) {
                      argText = (origArg[1]>>>0).toString(16);
                      var lower = (origArg[0]>>>0).toString(16);
                      while (lower.length < 8) lower = '0' + lower;
                      argText += lower;
                    } else {
                      argText = (origArg[0]>>>0).toString(16);
                    }
                  } else
                  if (currArg < 0) {
                    // Represent negative numbers in hex as 2's complement.
                    currArg = -currArg;
                    argText = (currAbsArg - 1).toString(16);
                    var buffer = [];
                    for (var i = 0; i < argText.length; i++) {
                      buffer.push((0xF - parseInt(argText[i], 16)).toString(16));
                    }
                    argText = buffer.join('');
                    while (argText.length < argSize * 2) argText = 'f' + argText;
                  } else {
                    argText = currAbsArg.toString(16);
                  }
                  if (next == 88) {
                    prefix = prefix.toUpperCase();
                    argText = argText.toUpperCase();
                  }
                } else if (next == 112) {
                  if (currAbsArg === 0) {
                    argText = '(nil)';
                  } else {
                    prefix = '0x';
                    argText = currAbsArg.toString(16);
                  }
                }
                if (precisionSet) {
                  while (argText.length < precision) {
                    argText = '0' + argText;
                  }
                }
                // Add sign if needed
                if (currArg >= 0) {
                  if (flagAlwaysSigned) {
                    prefix = '+' + prefix;
                  } else if (flagPadSign) {
                    prefix = ' ' + prefix;
                  }
                }
                // Move sign to prefix so we zero-pad after the sign
                if (argText.charAt(0) == '-') {
                  prefix = '-' + prefix;
                  argText = argText.substr(1);
                }
                // Add padding.
                while (prefix.length + argText.length < width) {
                  if (flagLeftAlign) {
                    argText += ' ';
                  } else {
                    if (flagZeroPad) {
                      argText = '0' + argText;
                    } else {
                      prefix = ' ' + prefix;
                    }
                  }
                }
                // Insert the result into the buffer.
                argText = prefix + argText;
                argText.split('').forEach(function(chr) {
                  ret.push(chr.charCodeAt(0));
                });
                break;
              }
              case 'f': case 'F': case 'e': case 'E': case 'g': case 'G': {
                // Float.
                var currArg = getNextArg('double');
                var argText;
                if (isNaN(currArg)) {
                  argText = 'nan';
                  flagZeroPad = false;
                } else if (!isFinite(currArg)) {
                  argText = (currArg < 0 ? '-' : '') + 'inf';
                  flagZeroPad = false;
                } else {
                  var isGeneral = false;
                  var effectivePrecision = Math.min(precision, 20);
                  // Convert g/G to f/F or e/E, as per:
                  // http://pubs.opengroup.org/onlinepubs/9699919799/functions/printf.html
                  if (next == 103 || next == 71) {
                    isGeneral = true;
                    precision = precision || 1;
                    var exponent = parseInt(currArg.toExponential(effectivePrecision).split('e')[1], 10);
                    if (precision > exponent && exponent >= -4) {
                      next = ((next == 103) ? 'f' : 'F').charCodeAt(0);
                      precision -= exponent + 1;
                    } else {
                      next = ((next == 103) ? 'e' : 'E').charCodeAt(0);
                      precision--;
                    }
                    effectivePrecision = Math.min(precision, 20);
                  }
                  if (next == 101 || next == 69) {
                    argText = currArg.toExponential(effectivePrecision);
                    // Make sure the exponent has at least 2 digits.
                    if (/[eE][-+]\d$/.test(argText)) {
                      argText = argText.slice(0, -1) + '0' + argText.slice(-1);
                    }
                  } else if (next == 102 || next == 70) {
                    argText = currArg.toFixed(effectivePrecision);
                    if (currArg === 0 && __reallyNegative(currArg)) {
                      argText = '-' + argText;
                    }
                  }
                  var parts = argText.split('e');
                  if (isGeneral && !flagAlternative) {
                    // Discard trailing zeros and periods.
                    while (parts[0].length > 1 && parts[0].indexOf('.') != -1 &&
                           (parts[0].slice(-1) == '0' || parts[0].slice(-1) == '.')) {
                      parts[0] = parts[0].slice(0, -1);
                    }
                  } else {
                    // Make sure we have a period in alternative mode.
                    if (flagAlternative && argText.indexOf('.') == -1) parts[0] += '.';
                    // Zero pad until required precision.
                    while (precision > effectivePrecision++) parts[0] += '0';
                  }
                  argText = parts[0] + (parts.length > 1 ? 'e' + parts[1] : '');
                  // Capitalize 'E' if needed.
                  if (next == 69) argText = argText.toUpperCase();
                  // Add sign.
                  if (currArg >= 0) {
                    if (flagAlwaysSigned) {
                      argText = '+' + argText;
                    } else if (flagPadSign) {
                      argText = ' ' + argText;
                    }
                  }
                }
                // Add padding.
                while (argText.length < width) {
                  if (flagLeftAlign) {
                    argText += ' ';
                  } else {
                    if (flagZeroPad && (argText[0] == '-' || argText[0] == '+')) {
                      argText = argText[0] + '0' + argText.slice(1);
                    } else {
                      argText = (flagZeroPad ? '0' : ' ') + argText;
                    }
                  }
                }
                // Adjust case.
                if (next < 97) argText = argText.toUpperCase();
                // Insert the result into the buffer.
                argText.split('').forEach(function(chr) {
                  ret.push(chr.charCodeAt(0));
                });
                break;
              }
              case 's': {
                // String.
                var arg = getNextArg('i8*');
                var argLength = arg ? _strlen(arg) : '(null)'.length;
                if (precisionSet) argLength = Math.min(argLength, precision);
                if (!flagLeftAlign) {
                  while (argLength < width--) {
                    ret.push(32);
                  }
                }
                if (arg) {
                  for (var i = 0; i < argLength; i++) {
                    ret.push(HEAPU8[((arg++)|0)]);
                  }
                } else {
                  ret = ret.concat(intArrayFromString('(null)'.substr(0, argLength), true));
                }
                if (flagLeftAlign) {
                  while (argLength < width--) {
                    ret.push(32);
                  }
                }
                break;
              }
              case 'c': {
                // Character.
                if (flagLeftAlign) ret.push(getNextArg('i8'));
                while (--width > 0) {
                  ret.push(32);
                }
                if (!flagLeftAlign) ret.push(getNextArg('i8'));
                break;
              }
              case 'n': {
                // Write the length written so far to the next parameter.
                var ptr = getNextArg('i32*');
                HEAP32[((ptr)>>2)]=ret.length
                break;
              }
              case '%': {
                // Literal percent sign.
                ret.push(curr);
                break;
              }
              default: {
                // Unknown specifiers remain untouched.
                for (var i = startTextIndex; i < textIndex + 2; i++) {
                  ret.push(HEAP8[(i)]);
                }
              }
            }
            textIndex += 2;
            // TODO: Support a/A (hex float) and m (last error) specifiers.
            // TODO: Support %1${specifier} for arg selection.
          } else {
            ret.push(curr);
            textIndex += 1;
          }
        }
        return ret;
      }function _fprintf(stream, format, varargs) {
        // int fprintf(FILE *restrict stream, const char *restrict format, ...);
        // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
        var result = __formatString(format, varargs);
        var stack = Runtime.stackSave();
        var ret = _fwrite(allocate(result, 'i8', ALLOC_STACK), 1, result.length, stream);
        Runtime.stackRestore(stack);
        return ret;
      }function _printf(format, varargs) {
        // int printf(const char *restrict format, ...);
        // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
        var stdout = HEAP32[((_stdout)>>2)];
        return _fprintf(stdout, format, varargs);
      }
    function _memcpy(dest, src, num) {
        dest = dest|0; src = src|0; num = num|0;
        var ret = 0;
        ret = dest|0;
        if ((dest&3) == (src&3)) {
          while (dest & 3) {
            if ((num|0) == 0) return ret|0;
            HEAP8[(dest)]=HEAP8[(src)];
            dest = (dest+1)|0;
            src = (src+1)|0;
            num = (num-1)|0;
          }
          while ((num|0) >= 4) {
            HEAP32[((dest)>>2)]=HEAP32[((src)>>2)];
            dest = (dest+4)|0;
            src = (src+4)|0;
            num = (num-4)|0;
          }
        }
        while ((num|0) > 0) {
          HEAP8[(dest)]=HEAP8[(src)];
          dest = (dest+1)|0;
          src = (src+1)|0;
          num = (num-1)|0;
        }
        return ret|0;
      }
    function _memset(ptr, value, num) {
        ptr = ptr|0; value = value|0; num = num|0;
        var stop = 0, value4 = 0, stop4 = 0, unaligned = 0;
        stop = (ptr + num)|0;
        if ((num|0) >= 20) {
          // This is unaligned, but quite large, so work hard to get to aligned settings
          value = value & 0xff;
          unaligned = ptr & 3;
          value4 = value | (value << 8) | (value << 16) | (value << 24);
          stop4 = stop & ~3;
          if (unaligned) {
            unaligned = (ptr + 4 - unaligned)|0;
            while ((ptr|0) < (unaligned|0)) { // no need to check for stop, since we have large num
              HEAP8[(ptr)]=value;
              ptr = (ptr+1)|0;
            }
          }
          while ((ptr|0) < (stop4|0)) {
            HEAP32[((ptr)>>2)]=value4;
            ptr = (ptr+4)|0;
          }
        }
        while ((ptr|0) < (stop|0)) {
          HEAP8[(ptr)]=value;
          ptr = (ptr+1)|0;
        }
        return (ptr-num)|0;
      }
    function _malloc(bytes) {
        /* Over-allocate to make sure it is byte-aligned by 8.
         * This will leak memory, but this is only the dummy
         * implementation (replaced by dlmalloc normally) so
         * not an issue.
         */
        var ptr = Runtime.dynamicAlloc(bytes + 8);
        return (ptr+8) & 0xFFFFFFF8;
      }
    Module["_malloc"] = _malloc;
    function _free() {
    }
    Module["_free"] = _free;
    var Browser={mainLoop:{scheduler:null,shouldPause:false,paused:false,queue:[],pause:function () {
            Browser.mainLoop.shouldPause = true;
          },resume:function () {
            if (Browser.mainLoop.paused) {
              Browser.mainLoop.paused = false;
              Browser.mainLoop.scheduler();
            }
            Browser.mainLoop.shouldPause = false;
          },updateStatus:function () {
            if (Module['setStatus']) {
              var message = Module['statusMessage'] || 'Please wait...';
              var remaining = Browser.mainLoop.remainingBlockers;
              var expected = Browser.mainLoop.expectedBlockers;
              if (remaining) {
                if (remaining < expected) {
                  Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
                } else {
                  Module['setStatus'](message);
                }
              } else {
                Module['setStatus']('');
              }
            }
          }},isFullScreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function () {
          if (!Module["preloadPlugins"]) Module["preloadPlugins"] = []; // needs to exist even in workers
          if (Browser.initted || ENVIRONMENT_IS_WORKER) return;
          Browser.initted = true;
          try {
            new Blob();
            Browser.hasBlobConstructor = true;
          } catch(e) {
            Browser.hasBlobConstructor = false;
            console.log("warning: no blob constructor, cannot create blobs with mimetypes");
          }
          Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null));
          Browser.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : undefined;
          if (!Module.noImageDecoding && typeof Browser.URLObject === 'undefined') {
            console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
            Module.noImageDecoding = true;
          }
          // Support for plugins that can process preloaded files. You can add more of these to
          // your app by creating and appending to Module.preloadPlugins.
          //
          // Each plugin is asked if it can handle a file based on the file's name. If it can,
          // it is given the file's raw data. When it is done, it calls a callback with the file's
          // (possibly modified) data. For example, a plugin might decompress a file, or it
          // might create some side data structure for use later (like an Image element, etc.).
          var imagePlugin = {};
          imagePlugin['canHandle'] = function imagePlugin_canHandle(name) {
            return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
          };
          imagePlugin['handle'] = function imagePlugin_handle(byteArray, name, onload, onerror) {
            var b = null;
            if (Browser.hasBlobConstructor) {
              try {
                b = new Blob([byteArray], { type: Browser.getMimetype(name) });
                if (b.size !== byteArray.length) { // Safari bug #118630
                  // Safari's Blob can only take an ArrayBuffer
                  b = new Blob([(new Uint8Array(byteArray)).buffer], { type: Browser.getMimetype(name) });
                }
              } catch(e) {
                Runtime.warnOnce('Blob constructor present but fails: ' + e + '; falling back to blob builder');
              }
            }
            if (!b) {
              var bb = new Browser.BlobBuilder();
              bb.append((new Uint8Array(byteArray)).buffer); // we need to pass a buffer, and must copy the array to get the right data range
              b = bb.getBlob();
            }
            var url = Browser.URLObject.createObjectURL(b);
            assert(typeof url == 'string', 'createObjectURL must return a url as a string');
            var img = new Image();
            img.onload = function img_onload() {
              assert(img.complete, 'Image ' + name + ' could not be decoded');
              var canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              var ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0);
              Module["preloadedImages"][name] = canvas;
              Browser.URLObject.revokeObjectURL(url);
              if (onload) onload(byteArray);
            };
            img.onerror = function img_onerror(event) {
              console.log('Image ' + url + ' could not be decoded');
              if (onerror) onerror();
            };
            img.src = url;
          };
          Module['preloadPlugins'].push(imagePlugin);
          var audioPlugin = {};
          audioPlugin['canHandle'] = function audioPlugin_canHandle(name) {
            return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
          };
          audioPlugin['handle'] = function audioPlugin_handle(byteArray, name, onload, onerror) {
            var done = false;
            function finish(audio) {
              if (done) return;
              done = true;
              Module["preloadedAudios"][name] = audio;
              if (onload) onload(byteArray);
            }
            function fail() {
              if (done) return;
              done = true;
              Module["preloadedAudios"][name] = new Audio(); // empty shim
              if (onerror) onerror();
            }
            if (Browser.hasBlobConstructor) {
              try {
                var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
              } catch(e) {
                return fail();
              }
              var url = Browser.URLObject.createObjectURL(b); // XXX we never revoke this!
              assert(typeof url == 'string', 'createObjectURL must return a url as a string');
              var audio = new Audio();
              audio.addEventListener('canplaythrough', function() { finish(audio) }, false); // use addEventListener due to chromium bug 124926
              audio.onerror = function audio_onerror(event) {
                if (done) return;
                console.log('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
                function encode64(data) {
                  var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                  var PAD = '=';
                  var ret = '';
                  var leftchar = 0;
                  var leftbits = 0;
                  for (var i = 0; i < data.length; i++) {
                    leftchar = (leftchar << 8) | data[i];
                    leftbits += 8;
                    while (leftbits >= 6) {
                      var curr = (leftchar >> (leftbits-6)) & 0x3f;
                      leftbits -= 6;
                      ret += BASE[curr];
                    }
                  }
                  if (leftbits == 2) {
                    ret += BASE[(leftchar&3) << 4];
                    ret += PAD + PAD;
                  } else if (leftbits == 4) {
                    ret += BASE[(leftchar&0xf) << 2];
                    ret += PAD;
                  }
                  return ret;
                }
                audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
                finish(audio); // we don't wait for confirmation this worked - but it's worth trying
              };
              audio.src = url;
              // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
              Browser.safeSetTimeout(function() {
                finish(audio); // try to use it even though it is not necessarily ready to play
              }, 10000);
            } else {
              return fail();
            }
          };
          Module['preloadPlugins'].push(audioPlugin);
          // Canvas event setup
          var canvas = Module['canvas'];
          canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                      canvas['mozRequestPointerLock'] ||
                                      canvas['webkitRequestPointerLock'];
          canvas.exitPointerLock = document['exitPointerLock'] ||
                                   document['mozExitPointerLock'] ||
                                   document['webkitExitPointerLock'] ||
                                   function(){}; // no-op if function does not exist
          canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
          function pointerLockChange() {
            Browser.pointerLock = document['pointerLockElement'] === canvas ||
                                  document['mozPointerLockElement'] === canvas ||
                                  document['webkitPointerLockElement'] === canvas;
          }
          document.addEventListener('pointerlockchange', pointerLockChange, false);
          document.addEventListener('mozpointerlockchange', pointerLockChange, false);
          document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
          if (Module['elementPointerLock']) {
            canvas.addEventListener("click", function(ev) {
              if (!Browser.pointerLock && canvas.requestPointerLock) {
                canvas.requestPointerLock();
                ev.preventDefault();
              }
            }, false);
          }
        },createContext:function (canvas, useWebGL, setInModule, webGLContextAttributes) {
          var ctx;
          try {
            if (useWebGL) {
              var contextAttributes = {
                antialias: false,
                alpha: false
              };
              if (webGLContextAttributes) {
                for (var attribute in webGLContextAttributes) {
                  contextAttributes[attribute] = webGLContextAttributes[attribute];
                }
              }
              var errorInfo = '?';
              function onContextCreationError(event) {
                errorInfo = event.statusMessage || errorInfo;
              }
              canvas.addEventListener('webglcontextcreationerror', onContextCreationError, false);
              try {
                ['experimental-webgl', 'webgl'].some(function(webglId) {
                  return ctx = canvas.getContext(webglId, contextAttributes);
                });
              } finally {
                canvas.removeEventListener('webglcontextcreationerror', onContextCreationError, false);
              }
            } else {
              ctx = canvas.getContext('2d');
            }
            if (!ctx) throw ':(';
          } catch (e) {
            Module.print('Could not create canvas: ' + [errorInfo, e]);
            return null;
          }
          if (useWebGL) {
            // Set the background of the WebGL canvas to black
            canvas.style.backgroundColor = "black";
            // Warn on context loss
            canvas.addEventListener('webglcontextlost', function(event) {
              alert('WebGL context lost. You will need to reload the page.');
            }, false);
          }
          if (setInModule) {
            Module.ctx = ctx;
            Module.useWebGL = useWebGL;
            Browser.moduleContextCreatedCallbacks.forEach(function(callback) { callback() });
            Browser.init();
          }
          return ctx;
        },destroyContext:function (canvas, useWebGL, setInModule) {},fullScreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullScreen:function (lockPointer, resizeCanvas) {
          Browser.lockPointer = lockPointer;
          Browser.resizeCanvas = resizeCanvas;
          if (typeof Browser.lockPointer === 'undefined') Browser.lockPointer = true;
          if (typeof Browser.resizeCanvas === 'undefined') Browser.resizeCanvas = false;
          var canvas = Module['canvas'];
          function fullScreenChange() {
            Browser.isFullScreen = false;
            if ((document['webkitFullScreenElement'] || document['webkitFullscreenElement'] ||
                 document['mozFullScreenElement'] || document['mozFullscreenElement'] ||
                 document['fullScreenElement'] || document['fullscreenElement']) === canvas) {
              canvas.cancelFullScreen = document['cancelFullScreen'] ||
                                        document['mozCancelFullScreen'] ||
                                        document['webkitCancelFullScreen'];
              canvas.cancelFullScreen = canvas.cancelFullScreen.bind(document);
              if (Browser.lockPointer) canvas.requestPointerLock();
              Browser.isFullScreen = true;
              if (Browser.resizeCanvas) Browser.setFullScreenCanvasSize();
            } else if (Browser.resizeCanvas){
              Browser.setWindowedCanvasSize();
            }
            if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullScreen);
          }
          if (!Browser.fullScreenHandlersInstalled) {
            Browser.fullScreenHandlersInstalled = true;
            document.addEventListener('fullscreenchange', fullScreenChange, false);
            document.addEventListener('mozfullscreenchange', fullScreenChange, false);
            document.addEventListener('webkitfullscreenchange', fullScreenChange, false);
          }
          canvas.requestFullScreen = canvas['requestFullScreen'] ||
                                     canvas['mozRequestFullScreen'] ||
                                     (canvas['webkitRequestFullScreen'] ? function() { canvas['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);
          canvas.requestFullScreen();
        },requestAnimationFrame:function requestAnimationFrame(func) {
          if (typeof window === 'undefined') { // Provide fallback to setTimeout if window is undefined (e.g. in Node.js)
            setTimeout(func, 1000/60);
          } else {
            if (!window.requestAnimationFrame) {
              window.requestAnimationFrame = window['requestAnimationFrame'] ||
                                             window['mozRequestAnimationFrame'] ||
                                             window['webkitRequestAnimationFrame'] ||
                                             window['msRequestAnimationFrame'] ||
                                             window['oRequestAnimationFrame'] ||
                                             window['setTimeout'];
            }
            window.requestAnimationFrame(func);
          }
        },safeCallback:function (func) {
          return function() {
            if (!ABORT) return func.apply(null, arguments);
          };
        },safeRequestAnimationFrame:function (func) {
          return Browser.requestAnimationFrame(function() {
            if (!ABORT) func();
          });
        },safeSetTimeout:function (func, timeout) {
          return setTimeout(function() {
            if (!ABORT) func();
          }, timeout);
        },safeSetInterval:function (func, timeout) {
          return setInterval(function() {
            if (!ABORT) func();
          }, timeout);
        },getMimetype:function (name) {
          return {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'bmp': 'image/bmp',
            'ogg': 'audio/ogg',
            'wav': 'audio/wav',
            'mp3': 'audio/mpeg'
          }[name.substr(name.lastIndexOf('.')+1)];
        },getUserMedia:function (func) {
          if(!window.getUserMedia) {
            window.getUserMedia = navigator['getUserMedia'] ||
                                  navigator['mozGetUserMedia'];
          }
          window.getUserMedia(func);
        },getMovementX:function (event) {
          return event['movementX'] ||
                 event['mozMovementX'] ||
                 event['webkitMovementX'] ||
                 0;
        },getMovementY:function (event) {
          return event['movementY'] ||
                 event['mozMovementY'] ||
                 event['webkitMovementY'] ||
                 0;
        },mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,calculateMouseEvent:function (event) { // event should be mousemove, mousedown or mouseup
          if (Browser.pointerLock) {
            // When the pointer is locked, calculate the coordinates
            // based on the movement of the mouse.
            // Workaround for Firefox bug 764498
            if (event.type != 'mousemove' &&
                ('mozMovementX' in event)) {
              Browser.mouseMovementX = Browser.mouseMovementY = 0;
            } else {
              Browser.mouseMovementX = Browser.getMovementX(event);
              Browser.mouseMovementY = Browser.getMovementY(event);
            }
            // check if SDL is available
            if (typeof SDL != "undefined") {
              Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
              Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
            } else {
              // just add the mouse delta to the current absolut mouse position
              // FIXME: ideally this should be clamped against the canvas size and zero
              Browser.mouseX += Browser.mouseMovementX;
              Browser.mouseY += Browser.mouseMovementY;
            }        
          } else {
            // Otherwise, calculate the movement based on the changes
            // in the coordinates.
            var rect = Module["canvas"].getBoundingClientRect();
            var x, y;
            if (event.type == 'touchstart' ||
                event.type == 'touchend' ||
                event.type == 'touchmove') {
              var t = event.touches.item(0);
              if (t) {
                x = t.pageX - (window.scrollX + rect.left);
                y = t.pageY - (window.scrollY + rect.top);
              } else {
                return;
              }
            } else {
              x = event.pageX - (window.scrollX + rect.left);
              y = event.pageY - (window.scrollY + rect.top);
            }
            // the canvas might be CSS-scaled compared to its backbuffer;
            // SDL-using content will want mouse coordinates in terms
            // of backbuffer units.
            var cw = Module["canvas"].width;
            var ch = Module["canvas"].height;
            x = x * (cw / rect.width);
            y = y * (ch / rect.height);
            Browser.mouseMovementX = x - Browser.mouseX;
            Browser.mouseMovementY = y - Browser.mouseY;
            Browser.mouseX = x;
            Browser.mouseY = y;
          }
        },xhrLoad:function (url, onload, onerror) {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.responseType = 'arraybuffer';
          xhr.onload = function xhr_onload() {
            if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
              onload(xhr.response);
            } else {
              onerror();
            }
          };
          xhr.onerror = onerror;
          xhr.send(null);
        },asyncLoad:function (url, onload, onerror, noRunDep) {
          Browser.xhrLoad(url, function(arrayBuffer) {
            assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
            onload(new Uint8Array(arrayBuffer));
            if (!noRunDep) removeRunDependency('al ' + url);
          }, function(event) {
            if (onerror) {
              onerror();
            } else {
              throw 'Loading data file "' + url + '" failed.';
            }
          });
          if (!noRunDep) addRunDependency('al ' + url);
        },resizeListeners:[],updateResizeListeners:function () {
          var canvas = Module['canvas'];
          Browser.resizeListeners.forEach(function(listener) {
            listener(canvas.width, canvas.height);
          });
        },setCanvasSize:function (width, height, noUpdates) {
          var canvas = Module['canvas'];
          canvas.width = width;
          canvas.height = height;
          if (!noUpdates) Browser.updateResizeListeners();
        },windowedWidth:0,windowedHeight:0,setFullScreenCanvasSize:function () {
          var canvas = Module['canvas'];
          this.windowedWidth = canvas.width;
          this.windowedHeight = canvas.height;
          canvas.width = screen.width;
          canvas.height = screen.height;
          // check if SDL is available   
          if (typeof SDL != "undefined") {
            var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
            flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
            HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
          }
          Browser.updateResizeListeners();
        },setWindowedCanvasSize:function () {
          var canvas = Module['canvas'];
          canvas.width = this.windowedWidth;
          canvas.height = this.windowedHeight;
          // check if SDL is available       
          if (typeof SDL != "undefined") {
            var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
            flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
            HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
          }
          Browser.updateResizeListeners();
        }};
  FS.staticInit();__ATINIT__.unshift({ func: function() { if (!Module["noFSInit"] && !FS.init.initialized) FS.init() } });__ATMAIN__.push({ func: function() { FS.ignorePermissions = false } });__ATEXIT__.push({ func: function() { FS.quit() } });Module["FS_createFolder"] = FS.createFolder;Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createPreloadedFile"] = FS.createPreloadedFile;Module["FS_createLazyFile"] = FS.createLazyFile;Module["FS_createLink"] = FS.createLink;Module["FS_createDevice"] = FS.createDevice;
  ___errno_state = Runtime.staticAlloc(4); HEAP32[((___errno_state)>>2)]=0;
  __ATINIT__.unshift({ func: function() { TTY.init() } });__ATEXIT__.push({ func: function() { TTY.shutdown() } });TTY.utf8 = new Runtime.UTF8Processor();
  if (ENVIRONMENT_IS_NODE) { var fs = require("fs"); NODEFS.staticInit(); }
  __ATINIT__.push({ func: function() { SOCKFS.root = FS.mount(SOCKFS, {}, null); } });
  Module["requestFullScreen"] = function Module_requestFullScreen(lockPointer, resizeCanvas) { Browser.requestFullScreen(lockPointer, resizeCanvas) };
    Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) { Browser.requestAnimationFrame(func) };
    Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) { Browser.setCanvasSize(width, height, noUpdates) };
    Module["pauseMainLoop"] = function Module_pauseMainLoop() { Browser.mainLoop.pause() };
    Module["resumeMainLoop"] = function Module_resumeMainLoop() { Browser.mainLoop.resume() };
    Module["getUserMedia"] = function Module_getUserMedia() { Browser.getUserMedia() }
  STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);
  staticSealed = true; // seal the static portion of memory
  STACK_MAX = STACK_BASE + 5242880;
  DYNAMIC_BASE = DYNAMICTOP = Runtime.alignMemory(STACK_MAX);
  assert(DYNAMIC_BASE < TOTAL_MEMORY, "TOTAL_MEMORY not big enough for stack");
  var FUNCTION_TABLE = [0, 0];
  // EMSCRIPTEN_START_FUNCS
  function _sizeofUInt(){
   var label=0;
   return 4;
  }
  Module["_sizeofUInt"] = _sizeofUInt;
  function _sizeofULongLong(){
   var label=0;
   return 8;
  }
  Module["_sizeofULongLong"] = _sizeofULongLong;
  function _sum3($a,$b$0,$b$1,$c){
   var label=0;
   var tempVarArgs=0;
   var sp=STACKTOP;STACKTOP=(STACKTOP+8)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
   var $1;
   var $2=sp;
   var $3;
   $1=$a;
   var $st$0$0=(($2)|0);
   HEAP32[(($st$0$0)>>2)]=$b$0;
   var $st$1$1=(($2+4)|0);
   HEAP32[(($st$1$1)>>2)]=$b$1;
   $3=$c;
   var $4=$1;
   var $ld$2$0=(($2)|0);
   var $5$0=HEAP32[(($ld$2$0)>>2)];
   var $ld$3$1=(($2+4)|0);
   var $5$1=HEAP32[(($ld$3$1)>>2)];
   var $6=$3;
   var $$etemp$4=208;
   var $7=_printf($$etemp$4,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 32)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$4,HEAP32[(((tempVarArgs)+(8))>>2)]=$5$0,HEAP32[(((tempVarArgs)+(16))>>2)]=$5$1,HEAP32[(((tempVarArgs)+(24))>>2)]=$6,tempVarArgs)); STACKTOP=tempVarArgs;
   var $8=$1;
   var $9$0=$8;
   var $9$1=0;
   var $ld$5$0=(($2)|0);
   var $10$0=HEAP32[(($ld$5$0)>>2)];
   var $ld$6$1=(($2+4)|0);
   var $10$1=HEAP32[(($ld$6$1)>>2)];
   var $11$0=_i64Add($9$0,$9$1,$10$0,$10$1);var $11$1=tempRet0;
   var $12=$3;
   var $13$0=$12;
   var $13$1=0;
   var $14$0=_i64Add($11$0,$11$1,$13$0,$13$1);var $14$1=tempRet0;
   var $15$0=$14$0;
   var $15=$15$0;
   STACKTOP=sp;return $15;
  }
  Module["_sum3"] = _sum3;
  function _sumPtr($a,$b,$c){
   var label=0;
   var tempVarArgs=0;
   var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
   var $1;
   var $2;
   var $3;
   $1=$a;
   $2=$b;
   $3=$c;
   var $4=$1;
   var $5=$2;
   var $6=$3;
   var $7=_printf(176,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 24)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$4,HEAP32[(((tempVarArgs)+(8))>>2)]=$5,HEAP32[(((tempVarArgs)+(16))>>2)]=$6,tempVarArgs)); STACKTOP=tempVarArgs;
   var $8=$1;
   var $9=(($8)|0);
   var $10=HEAP32[(($9)>>2)];
   var $11=$2;
   var $12=(($11)|0);
   var $ld$0$0=(($12)|0);
   var $13$0=HEAP32[(($ld$0$0)>>2)];
   var $ld$1$1=(($12+4)|0);
   var $13$1=HEAP32[(($ld$1$1)>>2)];
   var $14=$3;
   var $15=(($14)|0);
   var $16=HEAP32[(($15)>>2)];
   var $$etemp$2=136;
   var $17=_printf($$etemp$2,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 32)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$10,HEAP32[(((tempVarArgs)+(8))>>2)]=$13$0,HEAP32[(((tempVarArgs)+(16))>>2)]=$13$1,HEAP32[(((tempVarArgs)+(24))>>2)]=$16,tempVarArgs)); STACKTOP=tempVarArgs;
   var $18=$1;
   var $19=HEAP32[(($18)>>2)];
   var $20=$2;
   var $ld$3$0=(($20)|0);
   var $21$0=HEAP32[(($ld$3$0)>>2)];
   var $ld$4$1=(($20+4)|0);
   var $21$1=HEAP32[(($ld$4$1)>>2)];
   var $22=$3;
   var $23=HEAP32[(($22)>>2)];
   var $$etemp$5=104;
   var $24=_printf($$etemp$5,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 32)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$19,HEAP32[(((tempVarArgs)+(8))>>2)]=$21$0,HEAP32[(((tempVarArgs)+(16))>>2)]=$21$1,HEAP32[(((tempVarArgs)+(24))>>2)]=$23,tempVarArgs)); STACKTOP=tempVarArgs;
   var $25=$1;
   var $26=HEAP32[(($25)>>2)];
   var $27=$2;
   var $ld$6$0=(($27)|0);
   var $28$0=HEAP32[(($ld$6$0)>>2)];
   var $ld$7$1=(($27+4)|0);
   var $28$1=HEAP32[(($ld$7$1)>>2)];
   var $29=$3;
   var $30=HEAP32[(($29)>>2)];
   var $31=_sum3($26,$28$0,$28$1,$30);
   STACKTOP=sp;return $31;
  }
  Module["_sumPtr"] = _sumPtr;
  function _main(){
   var label=0;
   var tempVarArgs=0;
   var sp=STACKTOP;STACKTOP=(STACKTOP+24)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
   var $1;
   var $v3=sp;
   var $v30=(sp)+(8);
   var $v300=(sp)+(16);
   $1=0;
   var $2=_sizeofUInt();
   var $3=_printf(72,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$2,tempVarArgs)); STACKTOP=tempVarArgs;
   var $4=_sizeofULongLong();
   var $5=_printf(40,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$4,tempVarArgs)); STACKTOP=tempVarArgs;
   var $$etemp$0$0=20;
   var $$etemp$0$1=0;
   var $6=_sum3(2,$$etemp$0$0,$$etemp$0$1,200);
   var $7=_printf(24,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$6,tempVarArgs)); STACKTOP=tempVarArgs;
   HEAP32[(($v3)>>2)]=3;
   var $$etemp$1$0=30;
   var $$etemp$1$1=0;
   var $st$2$0=(($v30)|0);
   HEAP32[(($st$2$0)>>2)]=$$etemp$1$0;
   var $st$3$1=(($v30+4)|0);
   HEAP32[(($st$3$1)>>2)]=$$etemp$1$1;
   HEAP32[(($v300)>>2)]=300;
   var $8=_sumPtr($v3,$v30,$v300);
   var $9=_printf(8,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$8,tempVarArgs)); STACKTOP=tempVarArgs;
   STACKTOP=sp;return 0;
  }
  Module["_main"] = _main;
  // EMSCRIPTEN_END_FUNCS
  function _i64Add(a, b, c, d) {
      /*
        x = a + b*2^32
        y = c + d*2^32
        result = l + h*2^32
      */
      a = a|0; b = b|0; c = c|0; d = d|0;
      var l = 0, h = 0;
      l = (a + c)>>>0;
      h = (b + d + (((l>>>0) < (a>>>0))|0))>>>0; // Add carry from low word to high word on overflow.
      return tempRet0 = h,l|0;
    }
  function _i64Subtract(a, b, c, d) {
      a = a|0; b = b|0; c = c|0; d = d|0;
      var l = 0, h = 0;
      l = (a - c)>>>0;
      h = (b - d)>>>0;
      h = (b - d - (((c>>>0) > (a>>>0))|0))>>>0; // Borrow one from high word to low word on underflow.
      return tempRet0 = h,l|0;
    }
  function _bitshift64Shl(low, high, bits) {
      low = low|0; high = high|0; bits = bits|0;
      var ander = 0;
      if ((bits|0) < 32) {
        ander = ((1 << bits) - 1)|0;
        tempRet0 = (high << bits) | ((low&(ander << (32 - bits))) >>> (32 - bits));
        return low << bits;
      }
      tempRet0 = low << (bits - 32);
      return 0;
    }
  function _bitshift64Lshr(low, high, bits) {
      low = low|0; high = high|0; bits = bits|0;
      var ander = 0;
      if ((bits|0) < 32) {
        ander = ((1 << bits) - 1)|0;
        tempRet0 = high >>> bits;
        return (low >>> bits) | ((high&ander) << (32 - bits));
      }
      tempRet0 = 0;
      return (high >>> (bits - 32))|0;
    }
  function _bitshift64Ashr(low, high, bits) {
      low = low|0; high = high|0; bits = bits|0;
      var ander = 0;
      if ((bits|0) < 32) {
        ander = ((1 << bits) - 1)|0;
        tempRet0 = high >> bits;
        return (low >>> bits) | ((high&ander) << (32 - bits));
      }
      tempRet0 = (high|0) < 0 ? -1 : 0;
      return (high >> (bits - 32))|0;
    }
  function _llvm_ctlz_i32(x) {
      x = x|0;
      var ret = 0;
      ret = HEAP8[(((ctlz_i8)+(x >>> 24))|0)];
      if ((ret|0) < 8) return ret|0;
      ret = HEAP8[(((ctlz_i8)+((x >> 16)&0xff))|0)];
      if ((ret|0) < 8) return (ret + 8)|0;
      ret = HEAP8[(((ctlz_i8)+((x >> 8)&0xff))|0)];
      if ((ret|0) < 8) return (ret + 16)|0;
      return (HEAP8[(((ctlz_i8)+(x&0xff))|0)] + 24)|0;
    }
  /* PRE_ASM */ var ctlz_i8 = allocate([8,7,6,6,5,5,5,5,4,4,4,4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_DYNAMIC);
  function _llvm_cttz_i32(x) {
      x = x|0;
      var ret = 0;
      ret = HEAP8[(((cttz_i8)+(x & 0xff))|0)];
      if ((ret|0) < 8) return ret|0;
      ret = HEAP8[(((cttz_i8)+((x >> 8)&0xff))|0)];
      if ((ret|0) < 8) return (ret + 8)|0;
      ret = HEAP8[(((cttz_i8)+((x >> 16)&0xff))|0)];
      if ((ret|0) < 8) return (ret + 16)|0;
      return (HEAP8[(((cttz_i8)+(x >>> 24))|0)] + 24)|0;
    }
  /* PRE_ASM */ var cttz_i8 = allocate([8,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,7,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0], "i8", ALLOC_DYNAMIC);
  // ======== compiled code from system/lib/compiler-rt , see readme therein
  function ___muldsi3($a, $b) {
    $a = $a | 0;
    $b = $b | 0;
    var $1 = 0, $2 = 0, $3 = 0, $6 = 0, $8 = 0, $11 = 0, $12 = 0;
    $1 = $a & 65535;
    $2 = $b & 65535;
    $3 = Math_imul($2, $1) | 0;
    $6 = $a >>> 16;
    $8 = ($3 >>> 16) + (Math_imul($2, $6) | 0) | 0;
    $11 = $b >>> 16;
    $12 = Math_imul($11, $1) | 0;
    return (tempRet0 = (($8 >>> 16) + (Math_imul($11, $6) | 0) | 0) + ((($8 & 65535) + $12 | 0) >>> 16) | 0, 0 | ($8 + $12 << 16 | $3 & 65535)) | 0;
  }
  function ___divdi3($a$0, $a$1, $b$0, $b$1) {
    $a$0 = $a$0 | 0;
    $a$1 = $a$1 | 0;
    $b$0 = $b$0 | 0;
    $b$1 = $b$1 | 0;
    var $1$0 = 0, $1$1 = 0, $2$0 = 0, $2$1 = 0, $4$0 = 0, $4$1 = 0, $6$0 = 0, $7$0 = 0, $7$1 = 0, $8$0 = 0, $10$0 = 0;
    $1$0 = $a$1 >> 31 | (($a$1 | 0) < 0 ? -1 : 0) << 1;
    $1$1 = (($a$1 | 0) < 0 ? -1 : 0) >> 31 | (($a$1 | 0) < 0 ? -1 : 0) << 1;
    $2$0 = $b$1 >> 31 | (($b$1 | 0) < 0 ? -1 : 0) << 1;
    $2$1 = (($b$1 | 0) < 0 ? -1 : 0) >> 31 | (($b$1 | 0) < 0 ? -1 : 0) << 1;
    $4$0 = _i64Subtract($1$0 ^ $a$0, $1$1 ^ $a$1, $1$0, $1$1) | 0;
    $4$1 = tempRet0;
    $6$0 = _i64Subtract($2$0 ^ $b$0, $2$1 ^ $b$1, $2$0, $2$1) | 0;
    $7$0 = $2$0 ^ $1$0;
    $7$1 = $2$1 ^ $1$1;
    $8$0 = ___udivmoddi4($4$0, $4$1, $6$0, tempRet0, 0) | 0;
    $10$0 = _i64Subtract($8$0 ^ $7$0, tempRet0 ^ $7$1, $7$0, $7$1) | 0;
    return (tempRet0 = tempRet0, $10$0) | 0;
  }
  function ___remdi3($a$0, $a$1, $b$0, $b$1) {
    $a$0 = $a$0 | 0;
    $a$1 = $a$1 | 0;
    $b$0 = $b$0 | 0;
    $b$1 = $b$1 | 0;
    var $rem = 0, $1$0 = 0, $1$1 = 0, $2$0 = 0, $2$1 = 0, $4$0 = 0, $4$1 = 0, $6$0 = 0, $10$0 = 0, $10$1 = 0, __stackBase__ = 0;
    __stackBase__ = STACKTOP;
    STACKTOP = STACKTOP + 8 | 0;
    $rem = __stackBase__ | 0;
    $1$0 = $a$1 >> 31 | (($a$1 | 0) < 0 ? -1 : 0) << 1;
    $1$1 = (($a$1 | 0) < 0 ? -1 : 0) >> 31 | (($a$1 | 0) < 0 ? -1 : 0) << 1;
    $2$0 = $b$1 >> 31 | (($b$1 | 0) < 0 ? -1 : 0) << 1;
    $2$1 = (($b$1 | 0) < 0 ? -1 : 0) >> 31 | (($b$1 | 0) < 0 ? -1 : 0) << 1;
    $4$0 = _i64Subtract($1$0 ^ $a$0, $1$1 ^ $a$1, $1$0, $1$1) | 0;
    $4$1 = tempRet0;
    $6$0 = _i64Subtract($2$0 ^ $b$0, $2$1 ^ $b$1, $2$0, $2$1) | 0;
    ___udivmoddi4($4$0, $4$1, $6$0, tempRet0, $rem) | 0;
    $10$0 = _i64Subtract(HEAP32[$rem >> 2] ^ $1$0, HEAP32[$rem + 4 >> 2] ^ $1$1, $1$0, $1$1) | 0;
    $10$1 = tempRet0;
    STACKTOP = __stackBase__;
    return (tempRet0 = $10$1, $10$0) | 0;
  }
  function ___muldi3($a$0, $a$1, $b$0, $b$1) {
    $a$0 = $a$0 | 0;
    $a$1 = $a$1 | 0;
    $b$0 = $b$0 | 0;
    $b$1 = $b$1 | 0;
    var $x_sroa_0_0_extract_trunc = 0, $y_sroa_0_0_extract_trunc = 0, $1$0 = 0, $1$1 = 0, $2 = 0;
    $x_sroa_0_0_extract_trunc = $a$0;
    $y_sroa_0_0_extract_trunc = $b$0;
    $1$0 = ___muldsi3($x_sroa_0_0_extract_trunc, $y_sroa_0_0_extract_trunc) | 0;
    $1$1 = tempRet0;
    $2 = Math_imul($a$1, $y_sroa_0_0_extract_trunc) | 0;
    return (tempRet0 = ((Math_imul($b$1, $x_sroa_0_0_extract_trunc) | 0) + $2 | 0) + $1$1 | $1$1 & 0, 0 | $1$0 & -1) | 0;
  }
  function ___udivdi3($a$0, $a$1, $b$0, $b$1) {
    $a$0 = $a$0 | 0;
    $a$1 = $a$1 | 0;
    $b$0 = $b$0 | 0;
    $b$1 = $b$1 | 0;
    var $1$0 = 0;
    $1$0 = ___udivmoddi4($a$0, $a$1, $b$0, $b$1, 0) | 0;
    return (tempRet0 = tempRet0, $1$0) | 0;
  }
  function ___uremdi3($a$0, $a$1, $b$0, $b$1) {
    $a$0 = $a$0 | 0;
    $a$1 = $a$1 | 0;
    $b$0 = $b$0 | 0;
    $b$1 = $b$1 | 0;
    var $rem = 0, __stackBase__ = 0;
    __stackBase__ = STACKTOP;
    STACKTOP = STACKTOP + 8 | 0;
    $rem = __stackBase__ | 0;
    ___udivmoddi4($a$0, $a$1, $b$0, $b$1, $rem) | 0;
    STACKTOP = __stackBase__;
    return (tempRet0 = HEAP32[$rem + 4 >> 2] | 0, HEAP32[$rem >> 2] | 0) | 0;
  }
  function ___udivmoddi4($a$0, $a$1, $b$0, $b$1, $rem) {
    $a$0 = $a$0 | 0;
    $a$1 = $a$1 | 0;
    $b$0 = $b$0 | 0;
    $b$1 = $b$1 | 0;
    $rem = $rem | 0;
    var $n_sroa_0_0_extract_trunc = 0, $n_sroa_1_4_extract_shift$0 = 0, $n_sroa_1_4_extract_trunc = 0, $d_sroa_0_0_extract_trunc = 0, $d_sroa_1_4_extract_shift$0 = 0, $d_sroa_1_4_extract_trunc = 0, $4 = 0, $17 = 0, $37 = 0, $49 = 0, $51 = 0, $57 = 0, $58 = 0, $66 = 0, $78 = 0, $86 = 0, $88 = 0, $89 = 0, $91 = 0, $92 = 0, $95 = 0, $105 = 0, $117 = 0, $119 = 0, $125 = 0, $126 = 0, $130 = 0, $q_sroa_1_1_ph = 0, $q_sroa_0_1_ph = 0, $r_sroa_1_1_ph = 0, $r_sroa_0_1_ph = 0, $sr_1_ph = 0, $d_sroa_0_0_insert_insert99$0 = 0, $d_sroa_0_0_insert_insert99$1 = 0, $137$0 = 0, $137$1 = 0, $carry_0203 = 0, $sr_1202 = 0, $r_sroa_0_1201 = 0, $r_sroa_1_1200 = 0, $q_sroa_0_1199 = 0, $q_sroa_1_1198 = 0, $147 = 0, $149 = 0, $r_sroa_0_0_insert_insert42$0 = 0, $r_sroa_0_0_insert_insert42$1 = 0, $150$1 = 0, $151$0 = 0, $152 = 0, $154$0 = 0, $r_sroa_0_0_extract_trunc = 0, $r_sroa_1_4_extract_trunc = 0, $155 = 0, $carry_0_lcssa$0 = 0, $carry_0_lcssa$1 = 0, $r_sroa_0_1_lcssa = 0, $r_sroa_1_1_lcssa = 0, $q_sroa_0_1_lcssa = 0, $q_sroa_1_1_lcssa = 0, $q_sroa_0_0_insert_ext75$0 = 0, $q_sroa_0_0_insert_ext75$1 = 0, $q_sroa_0_0_insert_insert77$1 = 0, $_0$0 = 0, $_0$1 = 0;
    $n_sroa_0_0_extract_trunc = $a$0;
    $n_sroa_1_4_extract_shift$0 = $a$1;
    $n_sroa_1_4_extract_trunc = $n_sroa_1_4_extract_shift$0;
    $d_sroa_0_0_extract_trunc = $b$0;
    $d_sroa_1_4_extract_shift$0 = $b$1;
    $d_sroa_1_4_extract_trunc = $d_sroa_1_4_extract_shift$0;
    if (($n_sroa_1_4_extract_trunc | 0) == 0) {
      $4 = ($rem | 0) != 0;
      if (($d_sroa_1_4_extract_trunc | 0) == 0) {
        if ($4) {
          HEAP32[$rem >> 2] = ($n_sroa_0_0_extract_trunc >>> 0) % ($d_sroa_0_0_extract_trunc >>> 0);
          HEAP32[$rem + 4 >> 2] = 0;
        }
        $_0$1 = 0;
        $_0$0 = ($n_sroa_0_0_extract_trunc >>> 0) / ($d_sroa_0_0_extract_trunc >>> 0) >>> 0;
        return (tempRet0 = $_0$1, $_0$0) | 0;
      } else {
        if (!$4) {
          $_0$1 = 0;
          $_0$0 = 0;
          return (tempRet0 = $_0$1, $_0$0) | 0;
        }
        HEAP32[$rem >> 2] = $a$0 & -1;
        HEAP32[$rem + 4 >> 2] = $a$1 & 0;
        $_0$1 = 0;
        $_0$0 = 0;
        return (tempRet0 = $_0$1, $_0$0) | 0;
      }
    }
    $17 = ($d_sroa_1_4_extract_trunc | 0) == 0;
    do {
      if (($d_sroa_0_0_extract_trunc | 0) == 0) {
        if ($17) {
          if (($rem | 0) != 0) {
            HEAP32[$rem >> 2] = ($n_sroa_1_4_extract_trunc >>> 0) % ($d_sroa_0_0_extract_trunc >>> 0);
            HEAP32[$rem + 4 >> 2] = 0;
          }
          $_0$1 = 0;
          $_0$0 = ($n_sroa_1_4_extract_trunc >>> 0) / ($d_sroa_0_0_extract_trunc >>> 0) >>> 0;
          return (tempRet0 = $_0$1, $_0$0) | 0;
        }
        if (($n_sroa_0_0_extract_trunc | 0) == 0) {
          if (($rem | 0) != 0) {
            HEAP32[$rem >> 2] = 0;
            HEAP32[$rem + 4 >> 2] = ($n_sroa_1_4_extract_trunc >>> 0) % ($d_sroa_1_4_extract_trunc >>> 0);
          }
          $_0$1 = 0;
          $_0$0 = ($n_sroa_1_4_extract_trunc >>> 0) / ($d_sroa_1_4_extract_trunc >>> 0) >>> 0;
          return (tempRet0 = $_0$1, $_0$0) | 0;
        }
        $37 = $d_sroa_1_4_extract_trunc - 1 | 0;
        if (($37 & $d_sroa_1_4_extract_trunc | 0) == 0) {
          if (($rem | 0) != 0) {
            HEAP32[$rem >> 2] = 0 | $a$0 & -1;
            HEAP32[$rem + 4 >> 2] = $37 & $n_sroa_1_4_extract_trunc | $a$1 & 0;
          }
          $_0$1 = 0;
          $_0$0 = $n_sroa_1_4_extract_trunc >>> ((_llvm_cttz_i32($d_sroa_1_4_extract_trunc | 0) | 0) >>> 0);
          return (tempRet0 = $_0$1, $_0$0) | 0;
        }
        $49 = _llvm_ctlz_i32($d_sroa_1_4_extract_trunc | 0) | 0;
        $51 = $49 - (_llvm_ctlz_i32($n_sroa_1_4_extract_trunc | 0) | 0) | 0;
        if ($51 >>> 0 <= 30) {
          $57 = $51 + 1 | 0;
          $58 = 31 - $51 | 0;
          $sr_1_ph = $57;
          $r_sroa_0_1_ph = $n_sroa_1_4_extract_trunc << $58 | $n_sroa_0_0_extract_trunc >>> ($57 >>> 0);
          $r_sroa_1_1_ph = $n_sroa_1_4_extract_trunc >>> ($57 >>> 0);
          $q_sroa_0_1_ph = 0;
          $q_sroa_1_1_ph = $n_sroa_0_0_extract_trunc << $58;
          break;
        }
        if (($rem | 0) == 0) {
          $_0$1 = 0;
          $_0$0 = 0;
          return (tempRet0 = $_0$1, $_0$0) | 0;
        }
        HEAP32[$rem >> 2] = 0 | $a$0 & -1;
        HEAP32[$rem + 4 >> 2] = $n_sroa_1_4_extract_shift$0 | $a$1 & 0;
        $_0$1 = 0;
        $_0$0 = 0;
        return (tempRet0 = $_0$1, $_0$0) | 0;
      } else {
        if (!$17) {
          $117 = _llvm_ctlz_i32($d_sroa_1_4_extract_trunc | 0) | 0;
          $119 = $117 - (_llvm_ctlz_i32($n_sroa_1_4_extract_trunc | 0) | 0) | 0;
          if ($119 >>> 0 <= 31) {
            $125 = $119 + 1 | 0;
            $126 = 31 - $119 | 0;
            $130 = $119 - 31 >> 31;
            $sr_1_ph = $125;
            $r_sroa_0_1_ph = $n_sroa_0_0_extract_trunc >>> ($125 >>> 0) & $130 | $n_sroa_1_4_extract_trunc << $126;
            $r_sroa_1_1_ph = $n_sroa_1_4_extract_trunc >>> ($125 >>> 0) & $130;
            $q_sroa_0_1_ph = 0;
            $q_sroa_1_1_ph = $n_sroa_0_0_extract_trunc << $126;
            break;
          }
          if (($rem | 0) == 0) {
            $_0$1 = 0;
            $_0$0 = 0;
            return (tempRet0 = $_0$1, $_0$0) | 0;
          }
          HEAP32[$rem >> 2] = 0 | $a$0 & -1;
          HEAP32[$rem + 4 >> 2] = $n_sroa_1_4_extract_shift$0 | $a$1 & 0;
          $_0$1 = 0;
          $_0$0 = 0;
          return (tempRet0 = $_0$1, $_0$0) | 0;
        }
        $66 = $d_sroa_0_0_extract_trunc - 1 | 0;
        if (($66 & $d_sroa_0_0_extract_trunc | 0) != 0) {
          $86 = (_llvm_ctlz_i32($d_sroa_0_0_extract_trunc | 0) | 0) + 33 | 0;
          $88 = $86 - (_llvm_ctlz_i32($n_sroa_1_4_extract_trunc | 0) | 0) | 0;
          $89 = 64 - $88 | 0;
          $91 = 32 - $88 | 0;
          $92 = $91 >> 31;
          $95 = $88 - 32 | 0;
          $105 = $95 >> 31;
          $sr_1_ph = $88;
          $r_sroa_0_1_ph = $91 - 1 >> 31 & $n_sroa_1_4_extract_trunc >>> ($95 >>> 0) | ($n_sroa_1_4_extract_trunc << $91 | $n_sroa_0_0_extract_trunc >>> ($88 >>> 0)) & $105;
          $r_sroa_1_1_ph = $105 & $n_sroa_1_4_extract_trunc >>> ($88 >>> 0);
          $q_sroa_0_1_ph = $n_sroa_0_0_extract_trunc << $89 & $92;
          $q_sroa_1_1_ph = ($n_sroa_1_4_extract_trunc << $89 | $n_sroa_0_0_extract_trunc >>> ($95 >>> 0)) & $92 | $n_sroa_0_0_extract_trunc << $91 & $88 - 33 >> 31;
          break;
        }
        if (($rem | 0) != 0) {
          HEAP32[$rem >> 2] = $66 & $n_sroa_0_0_extract_trunc;
          HEAP32[$rem + 4 >> 2] = 0;
        }
        if (($d_sroa_0_0_extract_trunc | 0) == 1) {
          $_0$1 = $n_sroa_1_4_extract_shift$0 | $a$1 & 0;
          $_0$0 = 0 | $a$0 & -1;
          return (tempRet0 = $_0$1, $_0$0) | 0;
        } else {
          $78 = _llvm_cttz_i32($d_sroa_0_0_extract_trunc | 0) | 0;
          $_0$1 = 0 | $n_sroa_1_4_extract_trunc >>> ($78 >>> 0);
          $_0$0 = $n_sroa_1_4_extract_trunc << 32 - $78 | $n_sroa_0_0_extract_trunc >>> ($78 >>> 0) | 0;
          return (tempRet0 = $_0$1, $_0$0) | 0;
        }
      }
    } while (0);
    if (($sr_1_ph | 0) == 0) {
      $q_sroa_1_1_lcssa = $q_sroa_1_1_ph;
      $q_sroa_0_1_lcssa = $q_sroa_0_1_ph;
      $r_sroa_1_1_lcssa = $r_sroa_1_1_ph;
      $r_sroa_0_1_lcssa = $r_sroa_0_1_ph;
      $carry_0_lcssa$1 = 0;
      $carry_0_lcssa$0 = 0;
    } else {
      $d_sroa_0_0_insert_insert99$0 = 0 | $b$0 & -1;
      $d_sroa_0_0_insert_insert99$1 = $d_sroa_1_4_extract_shift$0 | $b$1 & 0;
      $137$0 = _i64Add($d_sroa_0_0_insert_insert99$0, $d_sroa_0_0_insert_insert99$1, -1, -1) | 0;
      $137$1 = tempRet0;
      $q_sroa_1_1198 = $q_sroa_1_1_ph;
      $q_sroa_0_1199 = $q_sroa_0_1_ph;
      $r_sroa_1_1200 = $r_sroa_1_1_ph;
      $r_sroa_0_1201 = $r_sroa_0_1_ph;
      $sr_1202 = $sr_1_ph;
      $carry_0203 = 0;
      while (1) {
        $147 = $q_sroa_0_1199 >>> 31 | $q_sroa_1_1198 << 1;
        $149 = $carry_0203 | $q_sroa_0_1199 << 1;
        $r_sroa_0_0_insert_insert42$0 = 0 | ($r_sroa_0_1201 << 1 | $q_sroa_1_1198 >>> 31);
        $r_sroa_0_0_insert_insert42$1 = $r_sroa_0_1201 >>> 31 | $r_sroa_1_1200 << 1 | 0;
        _i64Subtract($137$0, $137$1, $r_sroa_0_0_insert_insert42$0, $r_sroa_0_0_insert_insert42$1) | 0;
        $150$1 = tempRet0;
        $151$0 = $150$1 >> 31 | (($150$1 | 0) < 0 ? -1 : 0) << 1;
        $152 = $151$0 & 1;
        $154$0 = _i64Subtract($r_sroa_0_0_insert_insert42$0, $r_sroa_0_0_insert_insert42$1, $151$0 & $d_sroa_0_0_insert_insert99$0, ((($150$1 | 0) < 0 ? -1 : 0) >> 31 | (($150$1 | 0) < 0 ? -1 : 0) << 1) & $d_sroa_0_0_insert_insert99$1) | 0;
        $r_sroa_0_0_extract_trunc = $154$0;
        $r_sroa_1_4_extract_trunc = tempRet0;
        $155 = $sr_1202 - 1 | 0;
        if (($155 | 0) == 0) {
          break;
        } else {
          $q_sroa_1_1198 = $147;
          $q_sroa_0_1199 = $149;
          $r_sroa_1_1200 = $r_sroa_1_4_extract_trunc;
          $r_sroa_0_1201 = $r_sroa_0_0_extract_trunc;
          $sr_1202 = $155;
          $carry_0203 = $152;
        }
      }
      $q_sroa_1_1_lcssa = $147;
      $q_sroa_0_1_lcssa = $149;
      $r_sroa_1_1_lcssa = $r_sroa_1_4_extract_trunc;
      $r_sroa_0_1_lcssa = $r_sroa_0_0_extract_trunc;
      $carry_0_lcssa$1 = 0;
      $carry_0_lcssa$0 = $152;
    }
    $q_sroa_0_0_insert_ext75$0 = $q_sroa_0_1_lcssa;
    $q_sroa_0_0_insert_ext75$1 = 0;
    $q_sroa_0_0_insert_insert77$1 = $q_sroa_1_1_lcssa | $q_sroa_0_0_insert_ext75$1;
    if (($rem | 0) != 0) {
      HEAP32[$rem >> 2] = 0 | $r_sroa_0_1_lcssa;
      HEAP32[$rem + 4 >> 2] = $r_sroa_1_1_lcssa | 0;
    }
    $_0$1 = (0 | $q_sroa_0_0_insert_ext75$0) >>> 31 | $q_sroa_0_0_insert_insert77$1 << 1 | ($q_sroa_0_0_insert_ext75$1 << 1 | $q_sroa_0_0_insert_ext75$0 >>> 31) & 0 | $carry_0_lcssa$1;
    $_0$0 = ($q_sroa_0_0_insert_ext75$0 << 1 | 0 >>> 31) & -2 | $carry_0_lcssa$0;
    return (tempRet0 = $_0$1, $_0$0) | 0;
  }
  // =======================================================================
  // EMSCRIPTEN_END_FUNCS
  // TODO: strip out parts of this we do not need
  //======= begin closure i64 code =======
  // Copyright 2009 The Closure Library Authors. All Rights Reserved.
  //
  // Licensed under the Apache License, Version 2.0 (the "License");
  // you may not use this file except in compliance with the License.
  // You may obtain a copy of the License at
  //
  //      http://www.apache.org/licenses/LICENSE-2.0
  //
  // Unless required by applicable law or agreed to in writing, software
  // distributed under the License is distributed on an "AS-IS" BASIS,
  // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  // See the License for the specific language governing permissions and
  // limitations under the License.
  /**
   * @fileoverview Defines a Long class for representing a 64-bit two's-complement
   * integer value, which faithfully simulates the behavior of a Java "long". This
   * implementation is derived from LongLib in GWT.
   *
   */
  var i64Math = (function() { // Emscripten wrapper
    var goog = { math: {} };
    /**
     * Constructs a 64-bit two's-complement integer, given its low and high 32-bit
     * values as *signed* integers.  See the from* functions below for more
     * convenient ways of constructing Longs.
     *
     * The internal representation of a long is the two given signed, 32-bit values.
     * We use 32-bit pieces because these are the size of integers on which
     * Javascript performs bit-operations.  For operations like addition and
     * multiplication, we split each number into 16-bit pieces, which can easily be
     * multiplied within Javascript's floating-point representation without overflow
     * or change in sign.
     *
     * In the algorithms below, we frequently reduce the negative case to the
     * positive case by negating the input(s) and then post-processing the result.
     * Note that we must ALWAYS check specially whether those values are MIN_VALUE
     * (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
     * a positive number, it overflows back into a negative).  Not handling this
     * case would often result in infinite recursion.
     *
     * @param {number} low  The low (signed) 32 bits of the long.
     * @param {number} high  The high (signed) 32 bits of the long.
     * @constructor
     */
    goog.math.Long = function(low, high) {
      /**
       * @type {number}
       * @private
       */
      this.low_ = low | 0;  // force into 32 signed bits.
      /**
       * @type {number}
       * @private
       */
      this.high_ = high | 0;  // force into 32 signed bits.
    };
    // NOTE: Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the
    // from* methods on which they depend.
    /**
     * A cache of the Long representations of small integer values.
     * @type {!Object}
     * @private
     */
    goog.math.Long.IntCache_ = {};
    /**
     * Returns a Long representing the given (32-bit) integer value.
     * @param {number} value The 32-bit integer in question.
     * @return {!goog.math.Long} The corresponding Long value.
     */
    goog.math.Long.fromInt = function(value) {
      if (-128 <= value && value < 128) {
        var cachedObj = goog.math.Long.IntCache_[value];
        if (cachedObj) {
          return cachedObj;
        }
      }
      var obj = new goog.math.Long(value | 0, value < 0 ? -1 : 0);
      if (-128 <= value && value < 128) {
        goog.math.Long.IntCache_[value] = obj;
      }
      return obj;
    };
    /**
     * Returns a Long representing the given value, provided that it is a finite
     * number.  Otherwise, zero is returned.
     * @param {number} value The number in question.
     * @return {!goog.math.Long} The corresponding Long value.
     */
    goog.math.Long.fromNumber = function(value) {
      if (isNaN(value) || !isFinite(value)) {
        return goog.math.Long.ZERO;
      } else if (value <= -goog.math.Long.TWO_PWR_63_DBL_) {
        return goog.math.Long.MIN_VALUE;
      } else if (value + 1 >= goog.math.Long.TWO_PWR_63_DBL_) {
        return goog.math.Long.MAX_VALUE;
      } else if (value < 0) {
        return goog.math.Long.fromNumber(-value).negate();
      } else {
        return new goog.math.Long(
            (value % goog.math.Long.TWO_PWR_32_DBL_) | 0,
            (value / goog.math.Long.TWO_PWR_32_DBL_) | 0);
      }
    };
    /**
     * Returns a Long representing the 64-bit integer that comes by concatenating
     * the given high and low bits.  Each is assumed to use 32 bits.
     * @param {number} lowBits The low 32-bits.
     * @param {number} highBits The high 32-bits.
     * @return {!goog.math.Long} The corresponding Long value.
     */
    goog.math.Long.fromBits = function(lowBits, highBits) {
      return new goog.math.Long(lowBits, highBits);
    };
    /**
     * Returns a Long representation of the given string, written using the given
     * radix.
     * @param {string} str The textual representation of the Long.
     * @param {number=} opt_radix The radix in which the text is written.
     * @return {!goog.math.Long} The corresponding Long value.
     */
    goog.math.Long.fromString = function(str, opt_radix) {
      if (str.length == 0) {
        throw Error('number format error: empty string');
      }
      var radix = opt_radix || 10;
      if (radix < 2 || 36 < radix) {
        throw Error('radix out of range: ' + radix);
      }
      if (str.charAt(0) == '-') {
        return goog.math.Long.fromString(str.substring(1), radix).negate();
      } else if (str.indexOf('-') >= 0) {
        throw Error('number format error: interior "-" character: ' + str);
      }
      // Do several (8) digits each time through the loop, so as to
      // minimize the calls to the very expensive emulated div.
      var radixToPower = goog.math.Long.fromNumber(Math.pow(radix, 8));
      var result = goog.math.Long.ZERO;
      for (var i = 0; i < str.length; i += 8) {
        var size = Math.min(8, str.length - i);
        var value = parseInt(str.substring(i, i + size), radix);
        if (size < 8) {
          var power = goog.math.Long.fromNumber(Math.pow(radix, size));
          result = result.multiply(power).add(goog.math.Long.fromNumber(value));
        } else {
          result = result.multiply(radixToPower);
          result = result.add(goog.math.Long.fromNumber(value));
        }
      }
      return result;
    };
    // NOTE: the compiler should inline these constant values below and then remove
    // these variables, so there should be no runtime penalty for these.
    /**
     * Number used repeated below in calculations.  This must appear before the
     * first call to any from* function below.
     * @type {number}
     * @private
     */
    goog.math.Long.TWO_PWR_16_DBL_ = 1 << 16;
    /**
     * @type {number}
     * @private
     */
    goog.math.Long.TWO_PWR_24_DBL_ = 1 << 24;
    /**
     * @type {number}
     * @private
     */
    goog.math.Long.TWO_PWR_32_DBL_ =
        goog.math.Long.TWO_PWR_16_DBL_ * goog.math.Long.TWO_PWR_16_DBL_;
    /**
     * @type {number}
     * @private
     */
    goog.math.Long.TWO_PWR_31_DBL_ =
        goog.math.Long.TWO_PWR_32_DBL_ / 2;
    /**
     * @type {number}
     * @private
     */
    goog.math.Long.TWO_PWR_48_DBL_ =
        goog.math.Long.TWO_PWR_32_DBL_ * goog.math.Long.TWO_PWR_16_DBL_;
    /**
     * @type {number}
     * @private
     */
    goog.math.Long.TWO_PWR_64_DBL_ =
        goog.math.Long.TWO_PWR_32_DBL_ * goog.math.Long.TWO_PWR_32_DBL_;
    /**
     * @type {number}
     * @private
     */
    goog.math.Long.TWO_PWR_63_DBL_ =
        goog.math.Long.TWO_PWR_64_DBL_ / 2;
    /** @type {!goog.math.Long} */
    goog.math.Long.ZERO = goog.math.Long.fromInt(0);
    /** @type {!goog.math.Long} */
    goog.math.Long.ONE = goog.math.Long.fromInt(1);
    /** @type {!goog.math.Long} */
    goog.math.Long.NEG_ONE = goog.math.Long.fromInt(-1);
    /** @type {!goog.math.Long} */
    goog.math.Long.MAX_VALUE =
        goog.math.Long.fromBits(0xFFFFFFFF | 0, 0x7FFFFFFF | 0);
    /** @type {!goog.math.Long} */
    goog.math.Long.MIN_VALUE = goog.math.Long.fromBits(0, 0x80000000 | 0);
    /**
     * @type {!goog.math.Long}
     * @private
     */
    goog.math.Long.TWO_PWR_24_ = goog.math.Long.fromInt(1 << 24);
    /** @return {number} The value, assuming it is a 32-bit integer. */
    goog.math.Long.prototype.toInt = function() {
      return this.low_;
    };
    /** @return {number} The closest floating-point representation to this value. */
    goog.math.Long.prototype.toNumber = function() {
      return this.high_ * goog.math.Long.TWO_PWR_32_DBL_ +
             this.getLowBitsUnsigned();
    };
    /**
     * @param {number=} opt_radix The radix in which the text should be written.
     * @return {string} The textual representation of this value.
     */
    goog.math.Long.prototype.toString = function(opt_radix) {
      var radix = opt_radix || 10;
      if (radix < 2 || 36 < radix) {
        throw Error('radix out of range: ' + radix);
      }
      if (this.isZero()) {
        return '0';
      }
      if (this.isNegative()) {
        if (this.equals(goog.math.Long.MIN_VALUE)) {
          // We need to change the Long value before it can be negated, so we remove
          // the bottom-most digit in this base and then recurse to do the rest.
          var radixLong = goog.math.Long.fromNumber(radix);
          var div = this.div(radixLong);
          var rem = div.multiply(radixLong).subtract(this);
          return div.toString(radix) + rem.toInt().toString(radix);
        } else {
          return '-' + this.negate().toString(radix);
        }
      }
      // Do several (6) digits each time through the loop, so as to
      // minimize the calls to the very expensive emulated div.
      var radixToPower = goog.math.Long.fromNumber(Math.pow(radix, 6));
      var rem = this;
      var result = '';
      while (true) {
        var remDiv = rem.div(radixToPower);
        var intval = rem.subtract(remDiv.multiply(radixToPower)).toInt();
        var digits = intval.toString(radix);
        rem = remDiv;
        if (rem.isZero()) {
          return digits + result;
        } else {
          while (digits.length < 6) {
            digits = '0' + digits;
          }
          result = '' + digits + result;
        }
      }
    };
    /** @return {number} The high 32-bits as a signed value. */
    goog.math.Long.prototype.getHighBits = function() {
      return this.high_;
    };
    /** @return {number} The low 32-bits as a signed value. */
    goog.math.Long.prototype.getLowBits = function() {
      return this.low_;
    };
    /** @return {number} The low 32-bits as an unsigned value. */
    goog.math.Long.prototype.getLowBitsUnsigned = function() {
      return (this.low_ >= 0) ?
          this.low_ : goog.math.Long.TWO_PWR_32_DBL_ + this.low_;
    };
    /**
     * @return {number} Returns the number of bits needed to represent the absolute
     *     value of this Long.
     */
    goog.math.Long.prototype.getNumBitsAbs = function() {
      if (this.isNegative()) {
        if (this.equals(goog.math.Long.MIN_VALUE)) {
          return 64;
        } else {
          return this.negate().getNumBitsAbs();
        }
      } else {
        var val = this.high_ != 0 ? this.high_ : this.low_;
        for (var bit = 31; bit > 0; bit--) {
          if ((val & (1 << bit)) != 0) {
            break;
          }
        }
        return this.high_ != 0 ? bit + 33 : bit + 1;
      }
    };
    /** @return {boolean} Whether this value is zero. */
    goog.math.Long.prototype.isZero = function() {
      return this.high_ == 0 && this.low_ == 0;
    };
    /** @return {boolean} Whether this value is negative. */
    goog.math.Long.prototype.isNegative = function() {
      return this.high_ < 0;
    };
    /** @return {boolean} Whether this value is odd. */
    goog.math.Long.prototype.isOdd = function() {
      return (this.low_ & 1) == 1;
    };
    /**
     * @param {goog.math.Long} other Long to compare against.
     * @return {boolean} Whether this Long equals the other.
     */
    goog.math.Long.prototype.equals = function(other) {
      return (this.high_ == other.high_) && (this.low_ == other.low_);
    };
    /**
     * @param {goog.math.Long} other Long to compare against.
     * @return {boolean} Whether this Long does not equal the other.
     */
    goog.math.Long.prototype.notEquals = function(other) {
      return (this.high_ != other.high_) || (this.low_ != other.low_);
    };
    /**
     * @param {goog.math.Long} other Long to compare against.
     * @return {boolean} Whether this Long is less than the other.
     */
    goog.math.Long.prototype.lessThan = function(other) {
      return this.compare(other) < 0;
    };
    /**
     * @param {goog.math.Long} other Long to compare against.
     * @return {boolean} Whether this Long is less than or equal to the other.
     */
    goog.math.Long.prototype.lessThanOrEqual = function(other) {
      return this.compare(other) <= 0;
    };
    /**
     * @param {goog.math.Long} other Long to compare against.
     * @return {boolean} Whether this Long is greater than the other.
     */
    goog.math.Long.prototype.greaterThan = function(other) {
      return this.compare(other) > 0;
    };
    /**
     * @param {goog.math.Long} other Long to compare against.
     * @return {boolean} Whether this Long is greater than or equal to the other.
     */
    goog.math.Long.prototype.greaterThanOrEqual = function(other) {
      return this.compare(other) >= 0;
    };
    /**
     * Compares this Long with the given one.
     * @param {goog.math.Long} other Long to compare against.
     * @return {number} 0 if they are the same, 1 if the this is greater, and -1
     *     if the given one is greater.
     */
    goog.math.Long.prototype.compare = function(other) {
      if (this.equals(other)) {
        return 0;
      }
      var thisNeg = this.isNegative();
      var otherNeg = other.isNegative();
      if (thisNeg && !otherNeg) {
        return -1;
      }
      if (!thisNeg && otherNeg) {
        return 1;
      }
      // at this point, the signs are the same, so subtraction will not overflow
      if (this.subtract(other).isNegative()) {
        return -1;
      } else {
        return 1;
      }
    };
    /** @return {!goog.math.Long} The negation of this value. */
    goog.math.Long.prototype.negate = function() {
      if (this.equals(goog.math.Long.MIN_VALUE)) {
        return goog.math.Long.MIN_VALUE;
      } else {
        return this.not().add(goog.math.Long.ONE);
      }
    };
    /**
     * Returns the sum of this and the given Long.
     * @param {goog.math.Long} other Long to add to this one.
     * @return {!goog.math.Long} The sum of this and the given Long.
     */
    goog.math.Long.prototype.add = function(other) {
      // Divide each number into 4 chunks of 16 bits, and then sum the chunks.
      var a48 = this.high_ >>> 16;
      var a32 = this.high_ & 0xFFFF;
      var a16 = this.low_ >>> 16;
      var a00 = this.low_ & 0xFFFF;
      var b48 = other.high_ >>> 16;
      var b32 = other.high_ & 0xFFFF;
      var b16 = other.low_ >>> 16;
      var b00 = other.low_ & 0xFFFF;
      var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
      c00 += a00 + b00;
      c16 += c00 >>> 16;
      c00 &= 0xFFFF;
      c16 += a16 + b16;
      c32 += c16 >>> 16;
      c16 &= 0xFFFF;
      c32 += a32 + b32;
      c48 += c32 >>> 16;
      c32 &= 0xFFFF;
      c48 += a48 + b48;
      c48 &= 0xFFFF;
      return goog.math.Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
    };
    /**
     * Returns the difference of this and the given Long.
     * @param {goog.math.Long} other Long to subtract from this.
     * @return {!goog.math.Long} The difference of this and the given Long.
     */
    goog.math.Long.prototype.subtract = function(other) {
      return this.add(other.negate());
    };
    /**
     * Returns the product of this and the given long.
     * @param {goog.math.Long} other Long to multiply with this.
     * @return {!goog.math.Long} The product of this and the other.
     */
    goog.math.Long.prototype.multiply = function(other) {
      if (this.isZero()) {
        return goog.math.Long.ZERO;
      } else if (other.isZero()) {
        return goog.math.Long.ZERO;
      }
      if (this.equals(goog.math.Long.MIN_VALUE)) {
        return other.isOdd() ? goog.math.Long.MIN_VALUE : goog.math.Long.ZERO;
      } else if (other.equals(goog.math.Long.MIN_VALUE)) {
        return this.isOdd() ? goog.math.Long.MIN_VALUE : goog.math.Long.ZERO;
      }
      if (this.isNegative()) {
        if (other.isNegative()) {
          return this.negate().multiply(other.negate());
        } else {
          return this.negate().multiply(other).negate();
        }
      } else if (other.isNegative()) {
        return this.multiply(other.negate()).negate();
      }
      // If both longs are small, use float multiplication
      if (this.lessThan(goog.math.Long.TWO_PWR_24_) &&
          other.lessThan(goog.math.Long.TWO_PWR_24_)) {
        return goog.math.Long.fromNumber(this.toNumber() * other.toNumber());
      }
      // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
      // We can skip products that would overflow.
      var a48 = this.high_ >>> 16;
      var a32 = this.high_ & 0xFFFF;
      var a16 = this.low_ >>> 16;
      var a00 = this.low_ & 0xFFFF;
      var b48 = other.high_ >>> 16;
      var b32 = other.high_ & 0xFFFF;
      var b16 = other.low_ >>> 16;
      var b00 = other.low_ & 0xFFFF;
      var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
      c00 += a00 * b00;
      c16 += c00 >>> 16;
      c00 &= 0xFFFF;
      c16 += a16 * b00;
      c32 += c16 >>> 16;
      c16 &= 0xFFFF;
      c16 += a00 * b16;
      c32 += c16 >>> 16;
      c16 &= 0xFFFF;
      c32 += a32 * b00;
      c48 += c32 >>> 16;
      c32 &= 0xFFFF;
      c32 += a16 * b16;
      c48 += c32 >>> 16;
      c32 &= 0xFFFF;
      c32 += a00 * b32;
      c48 += c32 >>> 16;
      c32 &= 0xFFFF;
      c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
      c48 &= 0xFFFF;
      return goog.math.Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
    };
    /**
     * Returns this Long divided by the given one.
     * @param {goog.math.Long} other Long by which to divide.
     * @return {!goog.math.Long} This Long divided by the given one.
     */
    goog.math.Long.prototype.div = function(other) {
      if (other.isZero()) {
        throw Error('division by zero');
      } else if (this.isZero()) {
        return goog.math.Long.ZERO;
      }
      if (this.equals(goog.math.Long.MIN_VALUE)) {
        if (other.equals(goog.math.Long.ONE) ||
            other.equals(goog.math.Long.NEG_ONE)) {
          return goog.math.Long.MIN_VALUE;  // recall that -MIN_VALUE == MIN_VALUE
        } else if (other.equals(goog.math.Long.MIN_VALUE)) {
          return goog.math.Long.ONE;
        } else {
          // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
          var halfThis = this.shiftRight(1);
          var approx = halfThis.div(other).shiftLeft(1);
          if (approx.equals(goog.math.Long.ZERO)) {
            return other.isNegative() ? goog.math.Long.ONE : goog.math.Long.NEG_ONE;
          } else {
            var rem = this.subtract(other.multiply(approx));
            var result = approx.add(rem.div(other));
            return result;
          }
        }
      } else if (other.equals(goog.math.Long.MIN_VALUE)) {
        return goog.math.Long.ZERO;
      }
      if (this.isNegative()) {
        if (other.isNegative()) {
          return this.negate().div(other.negate());
        } else {
          return this.negate().div(other).negate();
        }
      } else if (other.isNegative()) {
        return this.div(other.negate()).negate();
      }
      // Repeat the following until the remainder is less than other:  find a
      // floating-point that approximates remainder / other *from below*, add this
      // into the result, and subtract it from the remainder.  It is critical that
      // the approximate value is less than or equal to the real value so that the
      // remainder never becomes negative.
      var res = goog.math.Long.ZERO;
      var rem = this;
      while (rem.greaterThanOrEqual(other)) {
        // Approximate the result of division. This may be a little greater or
        // smaller than the actual value.
        var approx = Math.max(1, Math.floor(rem.toNumber() / other.toNumber()));
        // We will tweak the approximate result by changing it in the 48-th digit or
        // the smallest non-fractional digit, whichever is larger.
        var log2 = Math.ceil(Math.log(approx) / Math.LN2);
        var delta = (log2 <= 48) ? 1 : Math.pow(2, log2 - 48);
        // Decrease the approximation until it is smaller than the remainder.  Note
        // that if it is too large, the product overflows and is negative.
        var approxRes = goog.math.Long.fromNumber(approx);
        var approxRem = approxRes.multiply(other);
        while (approxRem.isNegative() || approxRem.greaterThan(rem)) {
          approx -= delta;
          approxRes = goog.math.Long.fromNumber(approx);
          approxRem = approxRes.multiply(other);
        }
        // We know the answer can't be zero... and actually, zero would cause
        // infinite recursion since we would make no progress.
        if (approxRes.isZero()) {
          approxRes = goog.math.Long.ONE;
        }
        res = res.add(approxRes);
        rem = rem.subtract(approxRem);
      }
      return res;
    };
    /**
     * Returns this Long modulo the given one.
     * @param {goog.math.Long} other Long by which to mod.
     * @return {!goog.math.Long} This Long modulo the given one.
     */
    goog.math.Long.prototype.modulo = function(other) {
      return this.subtract(this.div(other).multiply(other));
    };
    /** @return {!goog.math.Long} The bitwise-NOT of this value. */
    goog.math.Long.prototype.not = function() {
      return goog.math.Long.fromBits(~this.low_, ~this.high_);
    };
    /**
     * Returns the bitwise-AND of this Long and the given one.
     * @param {goog.math.Long} other The Long with which to AND.
     * @return {!goog.math.Long} The bitwise-AND of this and the other.
     */
    goog.math.Long.prototype.and = function(other) {
      return goog.math.Long.fromBits(this.low_ & other.low_,
                                     this.high_ & other.high_);
    };
    /**
     * Returns the bitwise-OR of this Long and the given one.
     * @param {goog.math.Long} other The Long with which to OR.
     * @return {!goog.math.Long} The bitwise-OR of this and the other.
     */
    goog.math.Long.prototype.or = function(other) {
      return goog.math.Long.fromBits(this.low_ | other.low_,
                                     this.high_ | other.high_);
    };
    /**
     * Returns the bitwise-XOR of this Long and the given one.
     * @param {goog.math.Long} other The Long with which to XOR.
     * @return {!goog.math.Long} The bitwise-XOR of this and the other.
     */
    goog.math.Long.prototype.xor = function(other) {
      return goog.math.Long.fromBits(this.low_ ^ other.low_,
                                     this.high_ ^ other.high_);
    };
    /**
     * Returns this Long with bits shifted to the left by the given amount.
     * @param {number} numBits The number of bits by which to shift.
     * @return {!goog.math.Long} This shifted to the left by the given amount.
     */
    goog.math.Long.prototype.shiftLeft = function(numBits) {
      numBits &= 63;
      if (numBits == 0) {
        return this;
      } else {
        var low = this.low_;
        if (numBits < 32) {
          var high = this.high_;
          return goog.math.Long.fromBits(
              low << numBits,
              (high << numBits) | (low >>> (32 - numBits)));
        } else {
          return goog.math.Long.fromBits(0, low << (numBits - 32));
        }
      }
    };
    /**
     * Returns this Long with bits shifted to the right by the given amount.
     * @param {number} numBits The number of bits by which to shift.
     * @return {!goog.math.Long} This shifted to the right by the given amount.
     */
    goog.math.Long.prototype.shiftRight = function(numBits) {
      numBits &= 63;
      if (numBits == 0) {
        return this;
      } else {
        var high = this.high_;
        if (numBits < 32) {
          var low = this.low_;
          return goog.math.Long.fromBits(
              (low >>> numBits) | (high << (32 - numBits)),
              high >> numBits);
        } else {
          return goog.math.Long.fromBits(
              high >> (numBits - 32),
              high >= 0 ? 0 : -1);
        }
      }
    };
    /**
     * Returns this Long with bits shifted to the right by the given amount, with
     * the new top bits matching the current sign bit.
     * @param {number} numBits The number of bits by which to shift.
     * @return {!goog.math.Long} This shifted to the right by the given amount, with
     *     zeros placed into the new leading bits.
     */
    goog.math.Long.prototype.shiftRightUnsigned = function(numBits) {
      numBits &= 63;
      if (numBits == 0) {
        return this;
      } else {
        var high = this.high_;
        if (numBits < 32) {
          var low = this.low_;
          return goog.math.Long.fromBits(
              (low >>> numBits) | (high << (32 - numBits)),
              high >>> numBits);
        } else if (numBits == 32) {
          return goog.math.Long.fromBits(high, 0);
        } else {
          return goog.math.Long.fromBits(high >>> (numBits - 32), 0);
        }
      }
    };
    //======= begin jsbn =======
    var navigator = { appName: 'Modern Browser' }; // polyfill a little
    // Copyright (c) 2005  Tom Wu
    // All Rights Reserved.
    // http://www-cs-students.stanford.edu/~tjw/jsbn/
    /*
     * Copyright (c) 2003-2005  Tom Wu
     * All Rights Reserved.
     *
     * Permission is hereby granted, free of charge, to any person obtaining
     * a copy of this software and associated documentation files (the
     * "Software"), to deal in the Software without restriction, including
     * without limitation the rights to use, copy, modify, merge, publish,
     * distribute, sublicense, and/or sell copies of the Software, and to
     * permit persons to whom the Software is furnished to do so, subject to
     * the following conditions:
     *
     * The above copyright notice and this permission notice shall be
     * included in all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS-IS" AND WITHOUT WARRANTY OF ANY KIND, 
     * EXPRESS, IMPLIED OR OTHERWISE, INCLUDING WITHOUT LIMITATION, ANY 
     * WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.  
     *
     * IN NO EVENT SHALL TOM WU BE LIABLE FOR ANY SPECIAL, INCIDENTAL,
     * INDIRECT OR CONSEQUENTIAL DAMAGES OF ANY KIND, OR ANY DAMAGES WHATSOEVER
     * RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER OR NOT ADVISED OF
     * THE POSSIBILITY OF DAMAGE, AND ON ANY THEORY OF LIABILITY, ARISING OUT
     * OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
     *
     * In addition, the following condition applies:
     *
     * All redistributions must retain an intact copy of this copyright notice
     * and disclaimer.
     */
    // Basic JavaScript BN library - subset useful for RSA encryption.
    // Bits per digit
    var dbits;
    // JavaScript engine analysis
    var canary = 0xdeadbeefcafe;
    var j_lm = ((canary&0xffffff)==0xefcafe);
    // (public) Constructor
    function BigInteger(a,b,c) {
      if(a != null)
        if("number" == typeof a) this.fromNumber(a,b,c);
        else if(b == null && "string" != typeof a) this.fromString(a,256);
        else this.fromString(a,b);
    }
    // return new, unset BigInteger
    function nbi() { return new BigInteger(null); }
    // am: Compute w_j += (x*this_i), propagate carries,
    // c is initial carry, returns final carry.
    // c < 3*dvalue, x < 2*dvalue, this_i < dvalue
    // We need to select the fastest one that works in this environment.
    // am1: use a single mult and divide to get the high bits,
    // max digit bits should be 26 because
    // max internal value = 2*dvalue^2-2*dvalue (< 2^53)
    function am1(i,x,w,j,c,n) {
      while(--n >= 0) {
        var v = x*this[i++]+w[j]+c;
        c = Math.floor(v/0x4000000);
        w[j++] = v&0x3ffffff;
      }
      return c;
    }
    // am2 avoids a big mult-and-extract completely.
    // Max digit bits should be <= 30 because we do bitwise ops
    // on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
    function am2(i,x,w,j,c,n) {
      var xl = x&0x7fff, xh = x>>15;
      while(--n >= 0) {
        var l = this[i]&0x7fff;
        var h = this[i++]>>15;
        var m = xh*l+h*xl;
        l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
        c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
        w[j++] = l&0x3fffffff;
      }
      return c;
    }
    // Alternately, set max digit bits to 28 since some
    // browsers slow down when dealing with 32-bit numbers.
    function am3(i,x,w,j,c,n) {
      var xl = x&0x3fff, xh = x>>14;
      while(--n >= 0) {
        var l = this[i]&0x3fff;
        var h = this[i++]>>14;
        var m = xh*l+h*xl;
        l = xl*l+((m&0x3fff)<<14)+w[j]+c;
        c = (l>>28)+(m>>14)+xh*h;
        w[j++] = l&0xfffffff;
      }
      return c;
    }
    if(j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
      BigInteger.prototype.am = am2;
      dbits = 30;
    }
    else if(j_lm && (navigator.appName != "Netscape")) {
      BigInteger.prototype.am = am1;
      dbits = 26;
    }
    else { // Mozilla/Netscape seems to prefer am3
      BigInteger.prototype.am = am3;
      dbits = 28;
    }
    BigInteger.prototype.DB = dbits;
    BigInteger.prototype.DM = ((1<<dbits)-1);
    BigInteger.prototype.DV = (1<<dbits);
    var BI_FP = 52;
    BigInteger.prototype.FV = Math.pow(2,BI_FP);
    BigInteger.prototype.F1 = BI_FP-dbits;
    BigInteger.prototype.F2 = 2*dbits-BI_FP;
    // Digit conversions
    var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
    var BI_RC = new Array();
    var rr,vv;
    rr = "0".charCodeAt(0);
    for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
    rr = "a".charCodeAt(0);
    for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
    rr = "A".charCodeAt(0);
    for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
    function int2char(n) { return BI_RM.charAt(n); }
    function intAt(s,i) {
      var c = BI_RC[s.charCodeAt(i)];
      return (c==null)?-1:c;
    }
    // (protected) copy this to r
    function bnpCopyTo(r) {
      for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
      r.t = this.t;
      r.s = this.s;
    }
    // (protected) set from integer value x, -DV <= x < DV
    function bnpFromInt(x) {
      this.t = 1;
      this.s = (x<0)?-1:0;
      if(x > 0) this[0] = x;
      else if(x < -1) this[0] = x+DV;
      else this.t = 0;
    }
    // return bigint initialized to value
    function nbv(i) { var r = nbi(); r.fromInt(i); return r; }
    // (protected) set from string and radix
    function bnpFromString(s,b) {
      var k;
      if(b == 16) k = 4;
      else if(b == 8) k = 3;
      else if(b == 256) k = 8; // byte array
      else if(b == 2) k = 1;
      else if(b == 32) k = 5;
      else if(b == 4) k = 2;
      else { this.fromRadix(s,b); return; }
      this.t = 0;
      this.s = 0;
      var i = s.length, mi = false, sh = 0;
      while(--i >= 0) {
        var x = (k==8)?s[i]&0xff:intAt(s,i);
        if(x < 0) {
          if(s.charAt(i) == "-") mi = true;
          continue;
        }
        mi = false;
        if(sh == 0)
          this[this.t++] = x;
        else if(sh+k > this.DB) {
          this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
          this[this.t++] = (x>>(this.DB-sh));
        }
        else
          this[this.t-1] |= x<<sh;
        sh += k;
        if(sh >= this.DB) sh -= this.DB;
      }
      if(k == 8 && (s[0]&0x80) != 0) {
        this.s = -1;
        if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
      }
      this.clamp();
      if(mi) BigInteger.ZERO.subTo(this,this);
    }
    // (protected) clamp off excess high words
    function bnpClamp() {
      var c = this.s&this.DM;
      while(this.t > 0 && this[this.t-1] == c) --this.t;
    }
    // (public) return string representation in given radix
    function bnToString(b) {
      if(this.s < 0) return "-"+this.negate().toString(b);
      var k;
      if(b == 16) k = 4;
      else if(b == 8) k = 3;
      else if(b == 2) k = 1;
      else if(b == 32) k = 5;
      else if(b == 4) k = 2;
      else return this.toRadix(b);
      var km = (1<<k)-1, d, m = false, r = "", i = this.t;
      var p = this.DB-(i*this.DB)%k;
      if(i-- > 0) {
        if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
        while(i >= 0) {
          if(p < k) {
            d = (this[i]&((1<<p)-1))<<(k-p);
            d |= this[--i]>>(p+=this.DB-k);
          }
          else {
            d = (this[i]>>(p-=k))&km;
            if(p <= 0) { p += this.DB; --i; }
          }
          if(d > 0) m = true;
          if(m) r += int2char(d);
        }
      }
      return m?r:"0";
    }
    // (public) -this
    function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }
    // (public) |this|
    function bnAbs() { return (this.s<0)?this.negate():this; }
    // (public) return + if this > a, - if this < a, 0 if equal
    function bnCompareTo(a) {
      var r = this.s-a.s;
      if(r != 0) return r;
      var i = this.t;
      r = i-a.t;
      if(r != 0) return (this.s<0)?-r:r;
      while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
      return 0;
    }
    // returns bit length of the integer x
    function nbits(x) {
      var r = 1, t;
      if((t=x>>>16) != 0) { x = t; r += 16; }
      if((t=x>>8) != 0) { x = t; r += 8; }
      if((t=x>>4) != 0) { x = t; r += 4; }
      if((t=x>>2) != 0) { x = t; r += 2; }
      if((t=x>>1) != 0) { x = t; r += 1; }
      return r;
    }
    // (public) return the number of bits in "this"
    function bnBitLength() {
      if(this.t <= 0) return 0;
      return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
    }
    // (protected) r = this << n*DB
    function bnpDLShiftTo(n,r) {
      var i;
      for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
      for(i = n-1; i >= 0; --i) r[i] = 0;
      r.t = this.t+n;
      r.s = this.s;
    }
    // (protected) r = this >> n*DB
    function bnpDRShiftTo(n,r) {
      for(var i = n; i < this.t; ++i) r[i-n] = this[i];
      r.t = Math.max(this.t-n,0);
      r.s = this.s;
    }
    // (protected) r = this << n
    function bnpLShiftTo(n,r) {
      var bs = n%this.DB;
      var cbs = this.DB-bs;
      var bm = (1<<cbs)-1;
      var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
      for(i = this.t-1; i >= 0; --i) {
        r[i+ds+1] = (this[i]>>cbs)|c;
        c = (this[i]&bm)<<bs;
      }
      for(i = ds-1; i >= 0; --i) r[i] = 0;
      r[ds] = c;
      r.t = this.t+ds+1;
      r.s = this.s;
      r.clamp();
    }
    // (protected) r = this >> n
    function bnpRShiftTo(n,r) {
      r.s = this.s;
      var ds = Math.floor(n/this.DB);
      if(ds >= this.t) { r.t = 0; return; }
      var bs = n%this.DB;
      var cbs = this.DB-bs;
      var bm = (1<<bs)-1;
      r[0] = this[ds]>>bs;
      for(var i = ds+1; i < this.t; ++i) {
        r[i-ds-1] |= (this[i]&bm)<<cbs;
        r[i-ds] = this[i]>>bs;
      }
      if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
      r.t = this.t-ds;
      r.clamp();
    }
    // (protected) r = this - a
    function bnpSubTo(a,r) {
      var i = 0, c = 0, m = Math.min(a.t,this.t);
      while(i < m) {
        c += this[i]-a[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      if(a.t < this.t) {
        c -= a.s;
        while(i < this.t) {
          c += this[i];
          r[i++] = c&this.DM;
          c >>= this.DB;
        }
        c += this.s;
      }
      else {
        c += this.s;
        while(i < a.t) {
          c -= a[i];
          r[i++] = c&this.DM;
          c >>= this.DB;
        }
        c -= a.s;
      }
      r.s = (c<0)?-1:0;
      if(c < -1) r[i++] = this.DV+c;
      else if(c > 0) r[i++] = c;
      r.t = i;
      r.clamp();
    }
    // (protected) r = this * a, r != this,a (HAC 14.12)
    // "this" should be the larger one if appropriate.
    function bnpMultiplyTo(a,r) {
      var x = this.abs(), y = a.abs();
      var i = x.t;
      r.t = i+y.t;
      while(--i >= 0) r[i] = 0;
      for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
      r.s = 0;
      r.clamp();
      if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
    }
    // (protected) r = this^2, r != this (HAC 14.16)
    function bnpSquareTo(r) {
      var x = this.abs();
      var i = r.t = 2*x.t;
      while(--i >= 0) r[i] = 0;
      for(i = 0; i < x.t-1; ++i) {
        var c = x.am(i,x[i],r,2*i,0,1);
        if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
          r[i+x.t] -= x.DV;
          r[i+x.t+1] = 1;
        }
      }
      if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
      r.s = 0;
      r.clamp();
    }
    // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
    // r != q, this != m.  q or r may be null.
    function bnpDivRemTo(m,q,r) {
      var pm = m.abs();
      if(pm.t <= 0) return;
      var pt = this.abs();
      if(pt.t < pm.t) {
        if(q != null) q.fromInt(0);
        if(r != null) this.copyTo(r);
        return;
      }
      if(r == null) r = nbi();
      var y = nbi(), ts = this.s, ms = m.s;
      var nsh = this.DB-nbits(pm[pm.t-1]);	// normalize modulus
      if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
      else { pm.copyTo(y); pt.copyTo(r); }
      var ys = y.t;
      var y0 = y[ys-1];
      if(y0 == 0) return;
      var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
      var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
      var i = r.t, j = i-ys, t = (q==null)?nbi():q;
      y.dlShiftTo(j,t);
      if(r.compareTo(t) >= 0) {
        r[r.t++] = 1;
        r.subTo(t,r);
      }
      BigInteger.ONE.dlShiftTo(ys,t);
      t.subTo(y,y);	// "negative" y so we can replace sub with am later
      while(y.t < ys) y[y.t++] = 0;
      while(--j >= 0) {
        // Estimate quotient digit
        var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
        if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {	// Try it out
          y.dlShiftTo(j,t);
          r.subTo(t,r);
          while(r[i] < --qd) r.subTo(t,r);
        }
      }
      if(q != null) {
        r.drShiftTo(ys,q);
        if(ts != ms) BigInteger.ZERO.subTo(q,q);
      }
      r.t = ys;
      r.clamp();
      if(nsh > 0) r.rShiftTo(nsh,r);	// Denormalize remainder
      if(ts < 0) BigInteger.ZERO.subTo(r,r);
    }
    // (public) this mod a
    function bnMod(a) {
      var r = nbi();
      this.abs().divRemTo(a,null,r);
      if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
      return r;
    }
    // Modular reduction using "classic" algorithm
    function Classic(m) { this.m = m; }
    function cConvert(x) {
      if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
      else return x;
    }
    function cRevert(x) { return x; }
    function cReduce(x) { x.divRemTo(this.m,null,x); }
    function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
    function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }
    Classic.prototype.convert = cConvert;
    Classic.prototype.revert = cRevert;
    Classic.prototype.reduce = cReduce;
    Classic.prototype.mulTo = cMulTo;
    Classic.prototype.sqrTo = cSqrTo;
    // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
    // justification:
    //         xy == 1 (mod m)
    //         xy =  1+km
    //   xy(2-xy) = (1+km)(1-km)
    // x[y(2-xy)] = 1-k^2m^2
    // x[y(2-xy)] == 1 (mod m^2)
    // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
    // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
    // JS multiply "overflows" differently from C/C++, so care is needed here.
    function bnpInvDigit() {
      if(this.t < 1) return 0;
      var x = this[0];
      if((x&1) == 0) return 0;
      var y = x&3;		// y == 1/x mod 2^2
      y = (y*(2-(x&0xf)*y))&0xf;	// y == 1/x mod 2^4
      y = (y*(2-(x&0xff)*y))&0xff;	// y == 1/x mod 2^8
      y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;	// y == 1/x mod 2^16
      // last step - calculate inverse mod DV directly;
      // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
      y = (y*(2-x*y%this.DV))%this.DV;		// y == 1/x mod 2^dbits
      // we really want the negative inverse, and -DV < y < DV
      return (y>0)?this.DV-y:-y;
    }
    // Montgomery reduction
    function Montgomery(m) {
      this.m = m;
      this.mp = m.invDigit();
      this.mpl = this.mp&0x7fff;
      this.mph = this.mp>>15;
      this.um = (1<<(m.DB-15))-1;
      this.mt2 = 2*m.t;
    }
    // xR mod m
    function montConvert(x) {
      var r = nbi();
      x.abs().dlShiftTo(this.m.t,r);
      r.divRemTo(this.m,null,r);
      if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
      return r;
    }
    // x/R mod m
    function montRevert(x) {
      var r = nbi();
      x.copyTo(r);
      this.reduce(r);
      return r;
    }
    // x = x/R mod m (HAC 14.32)
    function montReduce(x) {
      while(x.t <= this.mt2)	// pad x so am has enough room later
        x[x.t++] = 0;
      for(var i = 0; i < this.m.t; ++i) {
        // faster way of calculating u0 = x[i]*mp mod DV
        var j = x[i]&0x7fff;
        var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
        // use am to combine the multiply-shift-add into one call
        j = i+this.m.t;
        x[j] += this.m.am(0,u0,x,i,0,this.m.t);
        // propagate carry
        while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
      }
      x.clamp();
      x.drShiftTo(this.m.t,x);
      if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
    }
    // r = "x^2/R mod m"; x != r
    function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }
    // r = "xy/R mod m"; x,y != r
    function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
    Montgomery.prototype.convert = montConvert;
    Montgomery.prototype.revert = montRevert;
    Montgomery.prototype.reduce = montReduce;
    Montgomery.prototype.mulTo = montMulTo;
    Montgomery.prototype.sqrTo = montSqrTo;
    // (protected) true iff this is even
    function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }
    // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
    function bnpExp(e,z) {
      if(e > 0xffffffff || e < 1) return BigInteger.ONE;
      var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
      g.copyTo(r);
      while(--i >= 0) {
        z.sqrTo(r,r2);
        if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
        else { var t = r; r = r2; r2 = t; }
      }
      return z.revert(r);
    }
    // (public) this^e % m, 0 <= e < 2^32
    function bnModPowInt(e,m) {
      var z;
      if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
      return this.exp(e,z);
    }
    // protected
    BigInteger.prototype.copyTo = bnpCopyTo;
    BigInteger.prototype.fromInt = bnpFromInt;
    BigInteger.prototype.fromString = bnpFromString;
    BigInteger.prototype.clamp = bnpClamp;
    BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
    BigInteger.prototype.drShiftTo = bnpDRShiftTo;
    BigInteger.prototype.lShiftTo = bnpLShiftTo;
    BigInteger.prototype.rShiftTo = bnpRShiftTo;
    BigInteger.prototype.subTo = bnpSubTo;
    BigInteger.prototype.multiplyTo = bnpMultiplyTo;
    BigInteger.prototype.squareTo = bnpSquareTo;
    BigInteger.prototype.divRemTo = bnpDivRemTo;
    BigInteger.prototype.invDigit = bnpInvDigit;
    BigInteger.prototype.isEven = bnpIsEven;
    BigInteger.prototype.exp = bnpExp;
    // public
    BigInteger.prototype.toString = bnToString;
    BigInteger.prototype.negate = bnNegate;
    BigInteger.prototype.abs = bnAbs;
    BigInteger.prototype.compareTo = bnCompareTo;
    BigInteger.prototype.bitLength = bnBitLength;
    BigInteger.prototype.mod = bnMod;
    BigInteger.prototype.modPowInt = bnModPowInt;
    // "constants"
    BigInteger.ZERO = nbv(0);
    BigInteger.ONE = nbv(1);
    // jsbn2 stuff
    // (protected) convert from radix string
    function bnpFromRadix(s,b) {
      this.fromInt(0);
      if(b == null) b = 10;
      var cs = this.chunkSize(b);
      var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
      for(var i = 0; i < s.length; ++i) {
        var x = intAt(s,i);
        if(x < 0) {
          if(s.charAt(i) == "-" && this.signum() == 0) mi = true;
          continue;
        }
        w = b*w+x;
        if(++j >= cs) {
          this.dMultiply(d);
          this.dAddOffset(w,0);
          j = 0;
          w = 0;
        }
      }
      if(j > 0) {
        this.dMultiply(Math.pow(b,j));
        this.dAddOffset(w,0);
      }
      if(mi) BigInteger.ZERO.subTo(this,this);
    }
    // (protected) return x s.t. r^x < DV
    function bnpChunkSize(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); }
    // (public) 0 if this == 0, 1 if this > 0
    function bnSigNum() {
      if(this.s < 0) return -1;
      else if(this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
      else return 1;
    }
    // (protected) this *= n, this >= 0, 1 < n < DV
    function bnpDMultiply(n) {
      this[this.t] = this.am(0,n-1,this,0,0,this.t);
      ++this.t;
      this.clamp();
    }
    // (protected) this += n << w words, this >= 0
    function bnpDAddOffset(n,w) {
      if(n == 0) return;
      while(this.t <= w) this[this.t++] = 0;
      this[w] += n;
      while(this[w] >= this.DV) {
        this[w] -= this.DV;
        if(++w >= this.t) this[this.t++] = 0;
        ++this[w];
      }
    }
    // (protected) convert to radix string
    function bnpToRadix(b) {
      if(b == null) b = 10;
      if(this.signum() == 0 || b < 2 || b > 36) return "0";
      var cs = this.chunkSize(b);
      var a = Math.pow(b,cs);
      var d = nbv(a), y = nbi(), z = nbi(), r = "";
      this.divRemTo(d,y,z);
      while(y.signum() > 0) {
        r = (a+z.intValue()).toString(b).substr(1) + r;
        y.divRemTo(d,y,z);
      }
      return z.intValue().toString(b) + r;
    }
    // (public) return value as integer
    function bnIntValue() {
      if(this.s < 0) {
        if(this.t == 1) return this[0]-this.DV;
        else if(this.t == 0) return -1;
      }
      else if(this.t == 1) return this[0];
      else if(this.t == 0) return 0;
      // assumes 16 < DB < 32
      return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];
    }
    // (protected) r = this + a
    function bnpAddTo(a,r) {
      var i = 0, c = 0, m = Math.min(a.t,this.t);
      while(i < m) {
        c += this[i]+a[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      if(a.t < this.t) {
        c += a.s;
        while(i < this.t) {
          c += this[i];
          r[i++] = c&this.DM;
          c >>= this.DB;
        }
        c += this.s;
      }
      else {
        c += this.s;
        while(i < a.t) {
          c += a[i];
          r[i++] = c&this.DM;
          c >>= this.DB;
        }
        c += a.s;
      }
      r.s = (c<0)?-1:0;
      if(c > 0) r[i++] = c;
      else if(c < -1) r[i++] = this.DV+c;
      r.t = i;
      r.clamp();
    }
    BigInteger.prototype.fromRadix = bnpFromRadix;
    BigInteger.prototype.chunkSize = bnpChunkSize;
    BigInteger.prototype.signum = bnSigNum;
    BigInteger.prototype.dMultiply = bnpDMultiply;
    BigInteger.prototype.dAddOffset = bnpDAddOffset;
    BigInteger.prototype.toRadix = bnpToRadix;
    BigInteger.prototype.intValue = bnIntValue;
    BigInteger.prototype.addTo = bnpAddTo;
    //======= end jsbn =======
    // Emscripten wrapper
    var Wrapper = {
      abs: function(l, h) {
        var x = new goog.math.Long(l, h);
        var ret;
        if (x.isNegative()) {
          ret = x.negate();
        } else {
          ret = x;
        }
        HEAP32[tempDoublePtr>>2] = ret.low_;
        HEAP32[tempDoublePtr+4>>2] = ret.high_;
      },
      ensureTemps: function() {
        if (Wrapper.ensuredTemps) return;
        Wrapper.ensuredTemps = true;
        Wrapper.two32 = new BigInteger();
        Wrapper.two32.fromString('4294967296', 10);
        Wrapper.two64 = new BigInteger();
        Wrapper.two64.fromString('18446744073709551616', 10);
        Wrapper.temp1 = new BigInteger();
        Wrapper.temp2 = new BigInteger();
      },
      lh2bignum: function(l, h) {
        var a = new BigInteger();
        a.fromString(h.toString(), 10);
        var b = new BigInteger();
        a.multiplyTo(Wrapper.two32, b);
        var c = new BigInteger();
        c.fromString(l.toString(), 10);
        var d = new BigInteger();
        c.addTo(b, d);
        return d;
      },
      stringify: function(l, h, unsigned) {
        var ret = new goog.math.Long(l, h).toString();
        if (unsigned && ret[0] == '-') {
          // unsign slowly using jsbn bignums
          Wrapper.ensureTemps();
          var bignum = new BigInteger();
          bignum.fromString(ret, 10);
          ret = new BigInteger();
          Wrapper.two64.addTo(bignum, ret);
          ret = ret.toString(10);
        }
        return ret;
      },
      fromString: function(str, base, min, max, unsigned) {
        Wrapper.ensureTemps();
        var bignum = new BigInteger();
        bignum.fromString(str, base);
        var bigmin = new BigInteger();
        bigmin.fromString(min, 10);
        var bigmax = new BigInteger();
        bigmax.fromString(max, 10);
        if (unsigned && bignum.compareTo(BigInteger.ZERO) < 0) {
          var temp = new BigInteger();
          bignum.addTo(Wrapper.two64, temp);
          bignum = temp;
        }
        var error = false;
        if (bignum.compareTo(bigmin) < 0) {
          bignum = bigmin;
          error = true;
        } else if (bignum.compareTo(bigmax) > 0) {
          bignum = bigmax;
          error = true;
        }
        var ret = goog.math.Long.fromString(bignum.toString()); // min-max checks should have clamped this to a range goog.math.Long can handle well
        HEAP32[tempDoublePtr>>2] = ret.low_;
        HEAP32[tempDoublePtr+4>>2] = ret.high_;
        if (error) throw 'range error';
      }
    };
    return Wrapper;
  })();
  //======= end closure i64 code =======
  // === Auto-generated postamble setup entry stuff ===
  if (memoryInitializer) {
    function applyData(data) {
      HEAPU8.set(data, STATIC_BASE);
    }
    if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
      applyData(Module['readBinary'](memoryInitializer));
    } else {
      addRunDependency('memory initializer');
      Browser.asyncLoad(memoryInitializer, function(data) {
        applyData(data);
        removeRunDependency('memory initializer');
      }, function(data) {
        throw 'could not load memory initializer ' + memoryInitializer;
      });
    }
  }
  function ExitStatus(status) {
    this.name = "ExitStatus";
    this.message = "Program terminated with exit(" + status + ")";
    this.status = status;
  };
  ExitStatus.prototype = new Error();
  ExitStatus.prototype.constructor = ExitStatus;
  var initialStackTop;
  var preloadStartTime = null;
  var calledMain = false;
  dependenciesFulfilled = function runCaller() {
    // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
    if (!Module['calledRun'] && shouldRunNow) run();
    if (!Module['calledRun']) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
  }
  Module['callMain'] = Module.callMain = function callMain(args) {
    assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on __ATMAIN__)');
    assert(__ATPRERUN__.length == 0, 'cannot call main when preRun functions remain to be called');
    args = args || [];
    if (ENVIRONMENT_IS_WEB && preloadStartTime !== null) {
      Module.printErr('preload time: ' + (Date.now() - preloadStartTime) + ' ms');
    }
    ensureInitRuntime();
    var argc = args.length+1;
    function pad() {
      for (var i = 0; i < 4-1; i++) {
        argv.push(0);
      }
    }
    var argv = [allocate(intArrayFromString("/bin/this.program"), 'i8', ALLOC_NORMAL) ];
    pad();
    for (var i = 0; i < argc-1; i = i + 1) {
      argv.push(allocate(intArrayFromString(args[i]), 'i8', ALLOC_NORMAL));
      pad();
    }
    argv.push(0);
    argv = allocate(argv, 'i32', ALLOC_NORMAL);
    initialStackTop = STACKTOP;
    try {
      var ret = Module['_main'](argc, argv, 0);
      // if we're not running an evented main loop, it's time to exit
      if (!Module['noExitRuntime']) {
        exit(ret);
      }
    }
    catch(e) {
      if (e instanceof ExitStatus) {
        // exit() throws this once it's done to make sure execution
        // has been stopped completely
        return;
      } else if (e == 'SimulateInfiniteLoop') {
        // running an evented main loop, don't immediately exit
        Module['noExitRuntime'] = true;
        return;
      } else {
        if (e && typeof e === 'object' && e.stack) Module.printErr('exception thrown: ' + [e, e.stack]);
        throw e;
      }
    } finally {
      calledMain = true;
    }
  }
  function run(args) {
    args = args || Module['arguments'];
    if (preloadStartTime === null) preloadStartTime = Date.now();
    if (runDependencies > 0) {
      Module.printErr('run() called, but dependencies remain, so not running');
      return;
    }
    preRun();
    if (runDependencies > 0) {
      // a preRun added a dependency, run will be called later
      return;
    }
    function doRun() {
      ensureInitRuntime();
      preMain();
      Module['calledRun'] = true;
      if (Module['_main'] && shouldRunNow) {
        Module['callMain'](args);
      }
      postRun();
    }
    if (Module['setStatus']) {
      Module['setStatus']('Running...');
      setTimeout(function() {
        setTimeout(function() {
          Module['setStatus']('');
        }, 1);
        if (!ABORT) doRun();
      }, 1);
    } else {
      doRun();
    }
  }
  Module['run'] = Module.run = run;
  function exit(status) {
    ABORT = true;
    EXITSTATUS = status;
    STACKTOP = initialStackTop;
    // exit the runtime
    exitRuntime();
    // TODO We should handle this differently based on environment.
    // In the browser, the best we can do is throw an exception
    // to halt execution, but in node we could process.exit and
    // I'd imagine SM shell would have something equivalent.
    // This would let us set a proper exit status (which
    // would be great for checking test exit statuses).
    // https://github.com/kripken/emscripten/issues/1371
    // throw an exception to halt the current execution
    throw new ExitStatus(status);
  }
  Module['exit'] = Module.exit = exit;
  function abort(text) {
    if (text) {
      Module.print(text);
      Module.printErr(text);
    }
    ABORT = true;
    EXITSTATUS = 1;
    throw 'abort() at ' + stackTrace();
  }
  Module['abort'] = Module.abort = abort;
  // {{PRE_RUN_ADDITIONS}}
  if (Module['preInit']) {
    if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
    while (Module['preInit'].length > 0) {
      Module['preInit'].pop()();
    }
  }
  // shouldRunNow refers to calling main(), not run().
  var shouldRunNow = true;
  if (Module['noInitialRun']) {
    shouldRunNow = false;
  }
  run();
  // {{POST_RUN_ADDITIONS}}
  // {{MODULE_ADDITIONS}}
  //@ sourceMappingURL=params_ptrs.js.map

})(CParamsPtrs)

