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
STATICTOP = STATIC_BASE + 36672;
/* global initializers */ __ATINIT__.push({ func: function() { runPostSets() } });
/* memory initializer */ allocate([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,7,0,0,0,0,0,0,0,0,0,0,0,0,36,64,0,0,0,0,0,0,89,64,0,0,0,0,0,136,195,64,0,0,0,0,132,215,151,65,0,128,224,55,121,195,65,67,23,110,5,181,181,184,147,70,245,249,63,233,3,79,56,77,50,29,48,249,72,119,130,90,60,191,115,127,221,79,21,117,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,224,3,0,0,45,1,0,0,112,3,0,0,46,1,0,0,208,2,0,0,47,1,0,0,216,15,0,0,48,1,0,0,120,15,0,0,49,1,0,0,0,15,0,0,50,1,0,0,152,14,0,0,53,1,0,0,16,14,0,0,54,1,0,0,144,13,0,0,55,1,0,0,48,13,0,0,56,1,0,0,240,12,0,0,57,1,0,0,192,12,0,0,58,1,0,0,88,12,0,0,59,1,0,0,40,12,0,0,60,1,0,0,240,11,0,0,61,1,0,0,120,11,0,0,62,1,0,0,80,11,0,0,63,1,0,0,32,11,0,0,64,1,0,0,176,10,0,0,65,1,0,0,128,10,0,0,66,1,0,0,40,10,0,0,67,1,0,0,248,9,0,0,68,1,0,0,160,9,0,0,69,1,0,0,40,9,0,0,70,1,0,0,232,8,0,0,71,1,0,0,88,8,0,0,72,1,0,0,40,8,0,0,73,1,0,0,152,7,0,0,74,1,0,0,88,7,0,0,75,1,0,0,240,6,0,0,76,1,0,0,216,6,0,0,77,1,0,0,200,6,0,0,78,1,0,0,144,6,0,0,79,1,0,0,72,6,0,0,80,1,0,0,40,6,0,0,81,1,0,0,224,5,0,0,82,1,0,0,216,5,0,0,83,1,0,0,176,5,0,0,84,1,0,0,136,5,0,0,85,1,0,0,120,5,0,0,86,1,0,0,104,5,0,0,87,1,0,0,88,5,0,0,88,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,216,4,0,0,72,4,0,0,248,3,0,0,160,3,0,0,64,3,0,0,0,16,0,0,176,15,0,0,32,15,0,0,168,14,0,0,0,0,0,0,104,12,0,0,56,12,0,0,8,12,0,0,152,11,0,0,104,11,0,0,48,11,0,0,192,10,0,0,144,10,0,0,56,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,77,105,110,105,109,117,109,0,66,89,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,37,115,32,98,101,102,111,114,101,32,101,110,100,32,111,102,32,115,116,97,116,101,109,101,110,116,0,0,0,0,0,82,101,103,114,101,115,115,105,111,110,32,109,111,100,101,108,32,107,97,112,117,116,44,32,112,32,61,32,37,100,44,32,110,32,61,32,37,100,44,32,109,117,115,116,32,104,97,118,101,32,48,32,60,32,112,32,60,32,110,0,0,0,0,0,37,48,46,52,102,0,0,0,80,114,32,62,32,70,0,0,77,101,97,110,0,0,0,0,70,32,86,97,108,117,101,0,78,111,32,100,97,116,97,32,115,101,116,0,0,0,0,0,65,78,79,86,65,0,0,0,69,120,112,101,99,116,101,100,32,37,115,32,98,101,102,111,114,101,32,101,110,100,32,111,102,32,112,114,111,103,114,97,109,0,0,0,0,0,0,0,37,48,46,51,102,0,0,0,77,117,108,116,105,112,108,101,32,73,78,70,73,76,69,32,115,116,97,116,101,109,101,110,116,115,0,0,0,0,0,0,77,97,120,105,109,117,109,0,77,101,97,110,32,83,113,117,97,114,101,0,0,0,0,0,65,76,80,72,65,0,0,0,79,117,116,32,111,102,32,109,101,109,111,114,121,0,0,0,37,48,46,50,102,0,0,0,101,110,100,32,111,102,32,115,116,97,116,109,101,110,116,0,37,103,37,37,32,76,67,76,77,0,0,0,0,0,0,0,65,110,111,118,97,32,83,83,0,0,0,0,0,0,0,0,42,42,0,0,0,0,0,0,78,117,109,98,101,114,32,101,120,112,101,99,116,101,100,0,37,48,46,49,102,0,0,0,101,110,100,32,111,102,32,115,116,97,116,101,109,101,110,116,0,0,0,0,0,0,0,0,37,103,37,37,32,67,76,77,32,77,65,88,0,0,0,0,68,70,0,0,0,0,0,0,101,110,100,32,111,102,32,115,116,97,116,101,109,101,110,116,32,111,114,32,100,97,116,97,61,110,97,109,101,0,0,0,84,111,111,32,109,97,110,121,32,108,101,118,101,108,115,0,64,64,0,0,0,0,0,0,77,101,97,110,32,37,115,0,68,65,84,65,61,78,65,77,69,32,101,120,112,101,99,116,101,100,0,0,0,0,0,0,37,48,46,48,102,0,0,0,78,0,0,0,0,0,0,0,77,101,97,110,32,82,101,115,112,111,110,115,101,0,0,0,84,111,111,32,109,97,110,121,32,118,97,114,105,97,98,108,101,115,0,0,0,0,0,0,66,117,102,102,101,114,32,111,118,101,114,114,117,110,0,0,76,101,97,115,116,32,83,105,103,110,105,102,105,99,97,110,116,32,68,105,102,102,101,114,101,110,99,101,32,84,101,115,116,0,0,0,0,0,0,0,37,103,37,37,32,67,76,77,32,77,73,78,0,0,0,0,87,69,76,67,72,0,0,0,37,48,46,52,102,32,42,0,86,65,82,0,0,0,0,0,37,48,46,52,102,32,32,0,85,67,76,77,0,0,0,0,46,32,32,0,0,0,0,0,84,84,69,83,84,0,0,0,80,114,32,62,32,124,116,124,32,32,0,0,0,0,0,0,83,111,117,114,99,101,0,0,116,32,86,97,108,117,101,0,84,73,84,76,69,51,0,0,78,111,32,100,97,116,97,32,115,101,116,0,0,0,0,0,37,103,37,37,32,67,73,32,77,65,88,0,0,0,0,0,84,73,84,76,69,50,0,0,84,73,84,76,69,49,0,0,83,116,114,105,110,103,32,116,111,111,32,108,111,110,103,0,37,103,37,37,32,67,73,32,77,73,78,0,0,0,0,0,39,61,39,32,101,120,112,101,99,116,101,100,0,0,0,0,112,114,111,99,32,114,101,103,32,111,112,116,105,111,110,0,84,73,84,76,69,0,0,0,46,0,0,0,0,0,0,0,68,101,108,116,97,32,37,115,0,0,0,0,0,0,0,0,84,0,0,0,0,0,0,0,84,119,111,32,83,97,109,112,108,101,32,116,45,84,101,115,116,0,0,0,0,0,0,0,67,97,110,110,111,116,32,111,112,101,110,32,37,115,0,0,115,116,97,116,101,109,101,110,116,32,111,112,116,105,111,110,0,0,0,0,0,0,0,0,83,85,77,0,0,0,0,0,118,97,114,105,97,98,108,101,32,110,97,109,101,0,0,0,66,117,102,102,101,114,32,111,118,101,114,114,117,110,0,0,86,97,114,105,97,98,108,101,0,0,0,0,0,0,0,0,83,84,68,77,69,65,78,0,114,0,0,0,0,0,0,0,83,84,68,69,82,82,0,0,78,111,116,32,99,97,116,101,103,111,114,105,99,97,108,0,83,84,68,68,69,86,0,0,78,111,116,32,105,110,32,100,97,116,97,32,115,101,116,0,84,104,101,32,118,97,114,105,97,98,108,101,32,34,37,115,34,32,105,115,32,110,117,109,101,114,105,99,44,32,112,108,101,97,115,101,32,99,104,97,110,103,101,32,116,111,32,99,97,116,101,103,111,114,105,99,97,108,32,105,110,32,116,104,101,32,100,97,116,97,32,115,116,101,112,0,0,0,0,0,83,84,68,0,0,0,0,0,46,0,0,0,0,0,0,0,84,104,101,32,118,97,114,105,97,98,108,101,32,110,97,109,101,32,34,37,115,34,32,105,115,32,110,111,116,32,105,110,32,116,104,101,32,100,97,116,97,32,115,101,116,0,0,0,82,85,78,0,0,0,0,0,39,59,39,32,111,114,32,77,79,68,69,76,32,111,112,116,105,111,110,32,101,120,112,101,99,116,101,100,0,0,0,0,65,100,106,32,82,45,83,113,0,0,0,0,0,0,0,0,65,110,32,97,114,105,116,104,101,109,101,116,105,99,32,101,120,112,114,101,115,115,105,111,110,32,99,97,110,110,111,116,32,117,115,101,32,97,32,99,97,116,101,103,111,114,121,32,118,97,114,105,97,98,108,101,0,0,0,0,0,0,0,0,84,111,111,32,109,97,110,121,32,118,97,114,105,97,98,108,101,32,110,97,109,101,115,0,82,69,71,0,0,0,0,0,82,45,83,113,117,97,114,101,0,0,0,0,0,0,0,0,86,97,114,105,97,98,108,101,32,110,111,116,32,102,111,117,110,100,0,0,0,0,0,0,82,65,78,71,69,0,0,0,82,117,110,97,119,97,121,32,115,116,114,105,110,103,0,0,67,111,101,102,102,32,86,97,114,0,0,0,0,0,0,0,66,121,116,101,99,111,100,101,32,98,117,102,102,101,114,32,111,118,101,114,114,117,110,0,110,117,109,98,101,114,32,98,101,116,119,101,101,110,32,48,32,97,110,100,32,49,0,0,84,111,111,32,109,97,110,121,32,101,120,112,108,97,110,97,116,111,114,121,32,118,97,114,105,97,98,108,101,115,0,0,80,97,114,97,109,101,116,101,114,32,69,115,116,105,109,97,116,101,115,0,0,0,0,0,80,82,79,67,0,0,0,0,68,101,112,101,110,100,101,110,116,32,77,101,97,110,0,0,37,100,0,0,0,0,0,0,41,0,0,0,0,0,0,0,114,105,103,104,116,32,112,97,114,101,110,116,104,101,115,105,115,32,39,41,39,0,0,0,80,82,73,78,84,0,0,0,82,111,111,116,32,77,83,69,0,0,0,0,0,0,0,0,83,121,110,116,97,120,32,101,114,114,111,114,0,0,0,0,86,97,114,105,97,98,108,101,32,110,97,109,101,32,101,120,112,101,99,116,101,100,0,0,84,111,111,32,109,97,110,121,32,105,110,116,101,114,97,99,116,105,111,110,32,116,101,114,109,115,0,0,0,0,0,0,86,97,114,105,97,98,108,101,32,110,97,109,101,32,101,120,112,101,99,116,101,100,0,0,78,79,73,78,84,0,0,0,84,111,116,97,108,0,0,0,76,79,71,0,0,0,0,0,39,59,39,32,111,114,32,77,79,68,69,76,32,111,112,116,105,111,110,32,101,120,112,101,99,116,101,100,0,0,0,0,112,114,111,99,32,109,101,97,110,115,32,111,112,116,105,111,110,0,0,0,0,0,0,0,115,116,114,105,110,103,0,0,78,0,0,0,0,0,0,0,69,114,114,111,114,0,0,0,39,59,39,32,101,120,112,101,99,116,101,100,0,0,0,0,101,113,117,97,108,115,32,115,105,103,110,0,0,0,0,0,77,79,68,69,76,0,0,0,37,100,0,0,0,0,0,0,37,48,46,56,102,0,0,0,68,97,116,97,115,101,116,32,37,115,63,0,0,0,0,0,68,97,116,97,108,105,110,101,115,32,97,102,116,101,114,32,105,110,102,105,108,101,63,0,110,117,109,101,114,105,99,32,118,97,114,105,97,98,108,101,0,0,0,0,0,0,0,0,77,73,78,0,0,0,0,0,77,111,100,101,108,0,0,0,37,48,46,55,102,0,0,0,118,97,114,105,97,98,108,101,32,105,110,32,100,97,116,97,32,115,101,116,0,0,0,0,77,69,65,78,83,0,0,0,80,114,32,62,32,70,0,0,37,48,46,54,102,0,0,0,84,104,101,32,118,97,114,105,97,98,108,101,32,37,115,32,105,115,32,110,111,116,32,97,32,99,97,116,101,103,111,114,105,99,97,108,32,118,97,114,105,97,98,108,101,0,0,0,65,110,97,108,121,115,105,115,32,111,102,32,86,97,114,105,97,110,99,101,0,0,0,0,118,97,114,105,97,98,108,101,32,110,97,109,101,0,0,0,77,69,65,78,0,0,0,0,70,32,86,97,108,117,101,0,37,48,46,53,102,0,0,0,101,113,117,97,108,115,32,115,105,103,110,0,0,0,0,0,84,111,116,97,108,0,0,0,77,65,88,68,69,67,0,0,77,101,97,110,32,83,113,117,97,114,101,0,0,0,0,0,37,48,46,52,102,0,0,0,69,114,114,111,114,0,0,0,77,65,88,0,0,0,0,0,37,108,103,0,0,0,0,0,83,117,109,32,111,102,32,83,113,117,97,114,101,115,0,0,37,48,46,51,102,0,0,0,78,97,109,101,32,116,111,111,32,108,111,110,103,0,0,0,73,110,32,116,104,101,32,111,98,115,101,114,118,101,100,32,100,97,116,97,44,32,97,32,108,101,118,101,108,32,110,97,109,101,32,105,115,32,116,111,111,32,108,111,110,103,0,0,110,117,109,98,101,114,0,0,77,111,100,101,108,0,0,0,76,83,68,0,0,0,0,0,68,70,0,0,0,0,0,0,79,98,115,0,0,0,0,0,37,48,46,50,102,0,0,0,37,108,103,0,0,0,0,0,83,117,109,32,111,102,32,83,113,117,97,114,101,115,0,0,76,67,76,77,0,0,0,0,37,48,46,52,102,0,0,0,37,48,46,49,102,0,0,0,66,121,116,101,99,111,100,101,32,101,114,114,111,114,0,0,37,48,46,54,102,0,0,0,73,78,80,85,84,0,0,0,37,48,46,50,102,0,0,0,37,48,46,48,102,0,0,0,85,110,101,120,112,101,99,116,101,100,32,116,111,107,101,110,0,0,0,0,0,0,0,0,83,116,97,99,107,32,117,110,100,101,114,114,117,110,0,0,37,115,32,77,101,97,110,0,84,111,111,32,109,97,110,121,32,115,116,97,116,105,115,116,105,99,115,32,107,101,121,119,111,114,100,115,0,0,0,0,73,78,70,73,76,69,0,0,37,48,46,53,102,0,0,0,83,116,97,99,107,32,111,118,101,114,102,108,111,119,0,0,82,111,111,116,32,77,83,69,0,0,0,0,0,0,0,0,70,73,82,83,84,79,66,83,0,0,0,0,0,0,0,0,46,0,0,0,0,0,0,0,46,0,0,0,0,0,0,0,100,97,116,97,108,105,110,101,115,32,100,97,116,97,0,0,67,111,101,102,102,32,86,97,114,0,0,0,0,0,0,0,68,76,77,0,0,0,0,0,37,115,32,37,115,0,0,0,86,97,114,105,97,110,99,101,0,0,0,0,0,0,0,0,69,114,114,111,114,32,105,110,32,110,117,109,98,101,114,32,115,121,110,116,97,120,0,0,105,110,102,105,108,101,32,111,114,32,100,97,116,97,108,105,110,101,115,0,0,0,0,0,82,45,83,113,117,97,114,101,0,0,0,0,0,0,0,0,68,69,76,73,77,73,84,69,82,0,0,0,0,0,0,0,73,110,116,101,114,99,101,112,116,0,0,0,0,0,0,0,37,103,37,37,32,85,67,76,77,0,0,0,0,0,0,0,37,100,0,0,0,0,0,0,83,116,100,32,69,114,114,0,110,117,109,98,101,114,0,0,37,100,32,111,98,115,101,114,118,97,116,105,111,110,115,32,100,101,108,101,116,101,100,32,100,117,101,32,116,111,32,109,105,115,115,105,110,103,32,100,97,116,97,0,0,0,0,0,37,48,46,52,102,0,0,0,68,65,84,65,76,73,78,69,83,0,0,0,0,0,0,0,80,114,32,62,32,124,116,124,0,0,0,0,0,0,0,0,86,97,114,105,97,98,108,101,32,37,115,32,110,111,116,32,105,110,32,100,97,116,97,115,101,116,0,0,0,0,0,0,84,104,101,32,118,97,114,105,97,98,108,101,32,37,115,32,110,111,116,32,105,110,32,116,104,101,32,100,97,116,97,115,101,116,0,0,0,0,0,0,83,116,100,32,68,101,118,0,37,48,46,50,102,0,0,0,112,114,111,99,101,100,117,114,101,32,110,97,109,101,0,0,68,65,84,65,0,0,0,0,116,32,86,97,108,117,101,0,37,48,46,56,102,0,0,0,115,116,114,105,110,103,32,116,111,111,32,108,111,110,103,0,83,117,109,0,0,0,0,0,86,97,114,105,97,98,108,101,32,37,115,63,0,0,0,0,78,111,32,100,97,116,97,32,115,101,116,0,0,0,0,0,39,59,39,32,101,120,112,101,99,116,101,100,0,0,0,0,37,48,46,56,102,0,0,0,67,76,77,0,0,0,0,0,78,117,109,98,101,114,32,102,111,114,109,97,116,63,0,0,83,116,100,32,69,114,114,0,37,48,46,55,102,0,0,0,115,116,114,105,110,103,0,0,82,97,110,103,101,0,0,0,101,113,117,97,108,115,32,115,105,103,110,0,0,0,0,0,46,0,0,0,0,0,0,0,65,110,97,108,121,115,105,115,32,111,102,32,86,97,114,105,97,110,99,101,0,0,0,0,78,111,32,100,97,116,97,32,115,101,116,0,0,0,0,0,67,76,65,83,83,0,0,0,39,59,39,32,101,120,112,101,99,116,101,100,0,0,0,0,69,115,116,105,109,97,116,101,0,0,0,0,0,0,0,0,39,59,39,32,101,120,112,101,99,116,101,100,0,0,0,0,37,48,46,54,102,0,0,0,101,113,117,97,108,115,32,115,105,103,110,0,0,0,0,0,78,0,0,0,0,0,0,0,37,100,0,0,0,0,0,0,67,65,82,68,83,0,0,0,69,120,112,101,99,116,101,100,32,37,115,32,105,110,115,116,101,97,100,32,111,102,32,34,37,115,34,0,0,0,0,0,37,48,46,53,102,0,0,0,102,105,108,101,32,110,97,109,101,0,0,0,0,0,0,0], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE)
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
  function _strncmp(px, py, n) {
      var i = 0;
      while (i < n) {
        var x = HEAPU8[(((px)+(i))|0)];
        var y = HEAPU8[(((py)+(i))|0)];
        if (x == y && x == 0) return 0;
        if (x == 0) return -1;
        if (y == 0) return 1;
        if (x == y) {
          i ++;
          continue;
        } else {
          return x > y ? 1 : -1;
        }
      }
      return 0;
    }function _strcmp(px, py) {
      return _strncmp(px, py, TOTAL_MEMORY);
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
    }function _snprintf(s, n, format, varargs) {
      // int snprintf(char *restrict s, size_t n, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var limit = (n === undefined) ? result.length
                                    : Math.min(result.length, Math.max(n - 1, 0));
      if (s < 0) {
        s = -s;
        var buf = _malloc(limit+1);
        HEAP32[((s)>>2)]=buf;
        s = buf;
      }
      for (var i = 0; i < limit; i++) {
        HEAP8[(((s)+(i))|0)]=result[i];
      }
      if (limit < n || (n === undefined)) HEAP8[(((s)+(i))|0)]=0;
      return result.length;
    }function _sprintf(s, format, varargs) {
      // int sprintf(char *restrict s, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      return _snprintf(s, undefined, format, varargs);
    }
  function _strcpy(pdest, psrc) {
      pdest = pdest|0; psrc = psrc|0;
      var i = 0;
      do {
        HEAP8[(((pdest+i)|0)|0)]=HEAP8[(((psrc+i)|0)|0)];
        i = (i+1)|0;
      } while (HEAP8[(((psrc)+(i-1))|0)]);
      return pdest|0;
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
  function _open(path, oflag, varargs) {
      // int open(const char *path, int oflag, ...);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/open.html
      var mode = HEAP32[((varargs)>>2)];
      path = Pointer_stringify(path);
      try {
        var stream = FS.open(path, oflag, mode);
        return stream.fd;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fopen(filename, mode) {
      // FILE *fopen(const char *restrict filename, const char *restrict mode);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fopen.html
      var flags;
      mode = Pointer_stringify(mode);
      if (mode[0] == 'r') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 0;
        }
      } else if (mode[0] == 'w') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 1;
        }
        flags |= 64;
        flags |= 512;
      } else if (mode[0] == 'a') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 1;
        }
        flags |= 64;
        flags |= 1024;
      } else {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return 0;
      }
      var ret = _open(filename, flags, allocate([0x1FF, 0, 0, 0], 'i32', ALLOC_STACK));  // All creation permissions.
      return (ret == -1) ? 0 : ret;
    }
  function _close(fildes) {
      // int close(int fildes);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/close.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        FS.close(stream);
        return 0;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }
  function _fsync(fildes) {
      // int fsync(int fildes);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fsync.html
      var stream = FS.getStream(fildes);
      if (stream) {
        // We write directly to the file system, so there's nothing to do here.
        return 0;
      } else {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
    }function _fclose(stream) {
      // int fclose(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fclose.html
      _fsync(stream);
      return _close(stream);
    }
  function _strdup(ptr) {
      var len = _strlen(ptr);
      var newStr = _malloc(len + 1);
      (_memcpy(newStr, ptr, len)|0);
      HEAP8[(((newStr)+(len))|0)]=0;
      return newStr;
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
    }var _llvm_memset_p0i8_i32=_memset;
  function _strcat(pdest, psrc) {
      pdest = pdest|0; psrc = psrc|0;
      var i = 0;
      var pdestEnd = 0;
      pdestEnd = (pdest + (_strlen(pdest)|0))|0;
      do {
        HEAP8[((pdestEnd+i)|0)]=HEAP8[((psrc+i)|0)];
        i = (i+1)|0;
      } while (HEAP8[(((psrc)+(i-1))|0)]);
      return pdest|0;
    }
  function __getFloat(text) {
      return /^[+-]?[0-9]*\.?[0-9]+([eE][+-]?[0-9]+)?/.exec(text);
    }function __scanString(format, get, unget, varargs) {
      if (!__scanString.whiteSpace) {
        __scanString.whiteSpace = {};
        __scanString.whiteSpace[32] = 1;
        __scanString.whiteSpace[9] = 1;
        __scanString.whiteSpace[10] = 1;
        __scanString.whiteSpace[11] = 1;
        __scanString.whiteSpace[12] = 1;
        __scanString.whiteSpace[13] = 1;
      }
      // Supports %x, %4x, %d.%d, %lld, %s, %f, %lf.
      // TODO: Support all format specifiers.
      format = Pointer_stringify(format);
      var soFar = 0;
      if (format.indexOf('%n') >= 0) {
        // need to track soFar
        var _get = get;
        get = function get() {
          soFar++;
          return _get();
        }
        var _unget = unget;
        unget = function unget() {
          soFar--;
          return _unget();
        }
      }
      var formatIndex = 0;
      var argsi = 0;
      var fields = 0;
      var argIndex = 0;
      var next;
      mainLoop:
      for (var formatIndex = 0; formatIndex < format.length;) {
        if (format[formatIndex] === '%' && format[formatIndex+1] == 'n') {
          var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
          argIndex += Runtime.getAlignSize('void*', null, true);
          HEAP32[((argPtr)>>2)]=soFar;
          formatIndex += 2;
          continue;
        }
        if (format[formatIndex] === '%') {
          var nextC = format.indexOf('c', formatIndex+1);
          if (nextC > 0) {
            var maxx = 1;
            if (nextC > formatIndex+1) {
              var sub = format.substring(formatIndex+1, nextC);
              maxx = parseInt(sub);
              if (maxx != sub) maxx = 0;
            }
            if (maxx) {
              var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
              argIndex += Runtime.getAlignSize('void*', null, true);
              fields++;
              for (var i = 0; i < maxx; i++) {
                next = get();
                HEAP8[((argPtr++)|0)]=next;
              }
              formatIndex += nextC - formatIndex + 1;
              continue;
            }
          }
        }
        // handle %[...]
        if (format[formatIndex] === '%' && format.indexOf('[', formatIndex+1) > 0) {
          var match = /\%([0-9]*)\[(\^)?(\]?[^\]]*)\]/.exec(format.substring(formatIndex));
          if (match) {
            var maxNumCharacters = parseInt(match[1]) || Infinity;
            var negateScanList = (match[2] === '^');
            var scanList = match[3];
            // expand "middle" dashs into character sets
            var middleDashMatch;
            while ((middleDashMatch = /([^\-])\-([^\-])/.exec(scanList))) {
              var rangeStartCharCode = middleDashMatch[1].charCodeAt(0);
              var rangeEndCharCode = middleDashMatch[2].charCodeAt(0);
              for (var expanded = ''; rangeStartCharCode <= rangeEndCharCode; expanded += String.fromCharCode(rangeStartCharCode++));
              scanList = scanList.replace(middleDashMatch[1] + '-' + middleDashMatch[2], expanded);
            }
            var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
            argIndex += Runtime.getAlignSize('void*', null, true);
            fields++;
            for (var i = 0; i < maxNumCharacters; i++) {
              next = get();
              if (negateScanList) {
                if (scanList.indexOf(String.fromCharCode(next)) < 0) {
                  HEAP8[((argPtr++)|0)]=next;
                } else {
                  unget();
                  break;
                }
              } else {
                if (scanList.indexOf(String.fromCharCode(next)) >= 0) {
                  HEAP8[((argPtr++)|0)]=next;
                } else {
                  unget();
                  break;
                }
              }
            }
            // write out null-terminating character
            HEAP8[((argPtr++)|0)]=0;
            formatIndex += match[0].length;
            continue;
          }
        }      
        // remove whitespace
        while (1) {
          next = get();
          if (next == 0) return fields;
          if (!(next in __scanString.whiteSpace)) break;
        }
        unget();
        if (format[formatIndex] === '%') {
          formatIndex++;
          var suppressAssignment = false;
          if (format[formatIndex] == '*') {
            suppressAssignment = true;
            formatIndex++;
          }
          var maxSpecifierStart = formatIndex;
          while (format[formatIndex].charCodeAt(0) >= 48 &&
                 format[formatIndex].charCodeAt(0) <= 57) {
            formatIndex++;
          }
          var max_;
          if (formatIndex != maxSpecifierStart) {
            max_ = parseInt(format.slice(maxSpecifierStart, formatIndex), 10);
          }
          var long_ = false;
          var half = false;
          var longLong = false;
          if (format[formatIndex] == 'l') {
            long_ = true;
            formatIndex++;
            if (format[formatIndex] == 'l') {
              longLong = true;
              formatIndex++;
            }
          } else if (format[formatIndex] == 'h') {
            half = true;
            formatIndex++;
          }
          var type = format[formatIndex];
          formatIndex++;
          var curr = 0;
          var buffer = [];
          // Read characters according to the format. floats are trickier, they may be in an unfloat state in the middle, then be a valid float later
          if (type == 'f' || type == 'e' || type == 'g' ||
              type == 'F' || type == 'E' || type == 'G') {
            next = get();
            while (next > 0 && (!(next in __scanString.whiteSpace)))  {
              buffer.push(String.fromCharCode(next));
              next = get();
            }
            var m = __getFloat(buffer.join(''));
            var last = m ? m[0].length : 0;
            for (var i = 0; i < buffer.length - last + 1; i++) {
              unget();
            }
            buffer.length = last;
          } else {
            next = get();
            var first = true;
            // Strip the optional 0x prefix for %x.
            if ((type == 'x' || type == 'X') && (next == 48)) {
              var peek = get();
              if (peek == 120 || peek == 88) {
                next = get();
              } else {
                unget();
              }
            }
            while ((curr < max_ || isNaN(max_)) && next > 0) {
              if (!(next in __scanString.whiteSpace) && // stop on whitespace
                  (type == 's' ||
                   ((type === 'd' || type == 'u' || type == 'i') && ((next >= 48 && next <= 57) ||
                                                                     (first && next == 45))) ||
                   ((type === 'x' || type === 'X') && (next >= 48 && next <= 57 ||
                                     next >= 97 && next <= 102 ||
                                     next >= 65 && next <= 70))) &&
                  (formatIndex >= format.length || next !== format[formatIndex].charCodeAt(0))) { // Stop when we read something that is coming up
                buffer.push(String.fromCharCode(next));
                next = get();
                curr++;
                first = false;
              } else {
                break;
              }
            }
            unget();
          }
          if (buffer.length === 0) return 0;  // Failure.
          if (suppressAssignment) continue;
          var text = buffer.join('');
          var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
          argIndex += Runtime.getAlignSize('void*', null, true);
          switch (type) {
            case 'd': case 'u': case 'i':
              if (half) {
                HEAP16[((argPtr)>>1)]=parseInt(text, 10);
              } else if (longLong) {
                (tempI64 = [parseInt(text, 10)>>>0,(tempDouble=parseInt(text, 10),Math_abs(tempDouble) >= 1 ? (tempDouble > 0 ? Math_min(Math_floor((tempDouble)/4294967296), 4294967295)>>>0 : (~~(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296)))>>>0) : 0)],HEAP32[((argPtr)>>2)]=tempI64[0],HEAP32[(((argPtr)+(4))>>2)]=tempI64[1]);
              } else {
                HEAP32[((argPtr)>>2)]=parseInt(text, 10);
              }
              break;
            case 'X':
            case 'x':
              HEAP32[((argPtr)>>2)]=parseInt(text, 16)
              break;
            case 'F':
            case 'f':
            case 'E':
            case 'e':
            case 'G':
            case 'g':
            case 'E':
              // fallthrough intended
              if (long_) {
                HEAPF64[((argPtr)>>3)]=parseFloat(text)
              } else {
                HEAPF32[((argPtr)>>2)]=parseFloat(text)
              }
              break;
            case 's':
              var array = intArrayFromString(text);
              for (var j = 0; j < array.length; j++) {
                HEAP8[(((argPtr)+(j))|0)]=array[j]
              }
              break;
          }
          fields++;
        } else if (format[formatIndex].charCodeAt(0) in __scanString.whiteSpace) {
          next = get();
          while (next in __scanString.whiteSpace) {
            if (next <= 0) break mainLoop;  // End of input.
            next = get();
          }
          unget(next);
          formatIndex++;
        } else {
          // Not a specifier.
          next = get();
          if (format[formatIndex].charCodeAt(0) !== next) {
            unget(next);
            break mainLoop;
          }
          formatIndex++;
        }
      }
      return fields;
    }function _sscanf(s, format, varargs) {
      // int sscanf(const char *restrict s, const char *restrict format, ... );
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/scanf.html
      var index = 0;
      function get() { return HEAP8[(((s)+(index++))|0)]; };
      function unget() { index--; };
      return __scanString(format, get, unget, varargs);
    }
  function _isspace(chr) {
      return (chr == 32) || (chr >= 9 && chr <= 13);
    }
  var _llvm_pow_f64=Math_pow;
  var _log=Math_log;
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
        }}};function _recv(fd, buf, len, flags) {
      var sock = SOCKFS.getSocket(fd);
      if (!sock) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      // TODO honor flags
      return _read(fd, buf, len);
    }
  function _pread(fildes, buf, nbyte, offset) {
      // ssize_t pread(int fildes, void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.read(stream, slab, buf, nbyte, offset);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _read(fildes, buf, nbyte) {
      // ssize_t read(int fildes, void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.read(stream, slab, buf, nbyte);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fread(ptr, size, nitems, stream) {
      // size_t fread(void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fread.html
      var bytesToRead = nitems * size;
      if (bytesToRead == 0) {
        return 0;
      }
      var bytesRead = 0;
      var streamObj = FS.getStream(stream);
      if (!streamObj) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return 0;
      }
      while (streamObj.ungotten.length && bytesToRead > 0) {
        HEAP8[((ptr++)|0)]=streamObj.ungotten.pop()
        bytesToRead--;
        bytesRead++;
      }
      var err = _read(stream, ptr, bytesToRead);
      if (err == -1) {
        if (streamObj) streamObj.error = true;
        return 0;
      }
      bytesRead += err;
      if (bytesRead < bytesToRead) streamObj.eof = true;
      return Math.floor(bytesRead / size);
    }function _fgetc(stream) {
      // int fgetc(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fgetc.html
      var streamObj = FS.getStream(stream);
      if (!streamObj) return -1;
      if (streamObj.eof || streamObj.error) return -1;
      var ret = _fread(_fgetc.ret, 1, 1, stream);
      if (ret == 0) {
        return -1;
      } else if (ret == -1) {
        streamObj.error = true;
        return -1;
      } else {
        return HEAPU8[((_fgetc.ret)|0)];
      }
    }function _fgets(s, n, stream) {
      // char *fgets(char *restrict s, int n, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fgets.html
      var streamObj = FS.getStream(stream);
      if (!streamObj) return 0;
      if (streamObj.error || streamObj.eof) return 0;
      var byte_;
      for (var i = 0; i < n - 1 && byte_ != 10; i++) {
        byte_ = _fgetc(stream);
        if (byte_ == -1) {
          if (streamObj.error || (streamObj.eof && i == 0)) return 0;
          else if (streamObj.eof) break;
        }
        HEAP8[(((s)+(i))|0)]=byte_
      }
      HEAP8[(((s)+(i))|0)]=0
      return s;
    }
  function _strchr(ptr, chr) {
      ptr--;
      do {
        ptr++;
        var val = HEAP8[(ptr)];
        if (val == chr) return ptr;
      } while (val);
      return 0;
    }
  function _send(fd, buf, len, flags) {
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
    }function _fputc(c, stream) {
      // int fputc(int c, FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fputc.html
      var chr = unSign(c & 0xFF);
      HEAP8[((_fputc.ret)|0)]=chr
      var ret = _write(stream, _fputc.ret, 1);
      if (ret == -1) {
        var streamObj = FS.getStream(stream);
        if (streamObj) streamObj.error = true;
        return -1;
      } else {
        return chr;
      }
    }function _putchar(c) {
      // int putchar(int c);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/putchar.html
      return _fputc(c, HEAP32[((_stdout)>>2)]);
    }
  function _fputs(s, stream) {
      // int fputs(const char *restrict s, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fputs.html
      return _write(stream, s, _strlen(s));
    }function _puts(s) {
      // int puts(const char *s);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/puts.html
      // NOTE: puts() always writes an extra newline.
      var stdout = HEAP32[((_stdout)>>2)];
      var ret = _fputs(s, stdout);
      if (ret < 0) {
        return ret;
      } else {
        var newlineRet = _fputc(10, stdout);
        return (newlineRet < 0) ? -1 : ret + 1;
      }
    }
  var _sqrt=Math_sqrt;
  var _fabs=Math_abs;
  var _llvm_memset_p0i8_i64=_memset;
  function _nan(x) {
      return NaN;
    }
  function _longjmp(env, value) {
      throw { longjmp: true, id: HEAP32[((env)>>2)], value: value || 1 };
    }
  var _setjmp=undefined;
  function _isalpha(chr) {
      return (chr >= 97 && chr <= 122) ||
             (chr >= 65 && chr <= 90);
    }
  function _isalnum(chr) {
      return (chr >= 48 && chr <= 57) ||
             (chr >= 97 && chr <= 122) ||
             (chr >= 65 && chr <= 90);
    }
  function _toupper(chr) {
      if (chr >= 97 && chr <= 122) {
        return chr - 97 + 65;
      } else {
        return chr;
      }
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
    }var _llvm_memcpy_p0i8_p0i8_i32=_memcpy;
  var _exp=Math_exp;
  function _abort() {
      Module['abort']();
    }
  function ___errno_location() {
      return ___errno_state;
    }
  function _sbrk(bytes) {
      // Implement a Linux-like 'memory area' for our 'process'.
      // Changes the size of the memory area by |bytes|; returns the
      // address of the previous top ('break') of the memory area
      // We control the "dynamic" memory - DYNAMIC_BASE to DYNAMICTOP
      var self = _sbrk;
      if (!self.called) {
        DYNAMICTOP = alignMemoryPage(DYNAMICTOP); // make sure we start out aligned
        self.called = true;
        assert(Runtime.dynamicAlloc);
        self.alloc = Runtime.dynamicAlloc;
        Runtime.dynamicAlloc = function() { abort('cannot dynamically allocate, sbrk now has control') };
      }
      var ret = DYNAMICTOP;
      if (bytes != 0) self.alloc(bytes);
      return ret;  // Previous break location.
    }
  function _sysconf(name) {
      // long sysconf(int name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/sysconf.html
      switch(name) {
        case 30: return PAGE_SIZE;
        case 132:
        case 133:
        case 12:
        case 137:
        case 138:
        case 15:
        case 235:
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
        case 149:
        case 13:
        case 10:
        case 236:
        case 153:
        case 9:
        case 21:
        case 22:
        case 159:
        case 154:
        case 14:
        case 77:
        case 78:
        case 139:
        case 80:
        case 81:
        case 79:
        case 82:
        case 68:
        case 67:
        case 164:
        case 11:
        case 29:
        case 47:
        case 48:
        case 95:
        case 52:
        case 51:
        case 46:
          return 200809;
        case 27:
        case 246:
        case 127:
        case 128:
        case 23:
        case 24:
        case 160:
        case 161:
        case 181:
        case 182:
        case 242:
        case 183:
        case 184:
        case 243:
        case 244:
        case 245:
        case 165:
        case 178:
        case 179:
        case 49:
        case 50:
        case 168:
        case 169:
        case 175:
        case 170:
        case 171:
        case 172:
        case 97:
        case 76:
        case 32:
        case 173:
        case 35:
          return -1;
        case 176:
        case 177:
        case 7:
        case 155:
        case 8:
        case 157:
        case 125:
        case 126:
        case 92:
        case 93:
        case 129:
        case 130:
        case 131:
        case 94:
        case 91:
          return 1;
        case 74:
        case 60:
        case 69:
        case 70:
        case 4:
          return 1024;
        case 31:
        case 42:
        case 72:
          return 32;
        case 87:
        case 26:
        case 33:
          return 2147483647;
        case 34:
        case 1:
          return 47839;
        case 38:
        case 36:
          return 99;
        case 43:
        case 37:
          return 2048;
        case 0: return 2097152;
        case 3: return 65536;
        case 28: return 32768;
        case 44: return 32767;
        case 75: return 16384;
        case 39: return 1000;
        case 89: return 700;
        case 71: return 256;
        case 40: return 255;
        case 2: return 100;
        case 180: return 64;
        case 25: return 20;
        case 5: return 16;
        case 6: return 6;
        case 73: return 4;
        case 84: return 1;
      }
      ___setErrNo(ERRNO_CODES.EINVAL);
      return -1;
    }
  function _time(ptr) {
      var ret = Math.floor(Date.now()/1000);
      if (ptr) {
        HEAP32[((ptr)>>2)]=ret
      }
      return ret;
    }
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
_fgetc.ret = allocate([0], "i8", ALLOC_STATIC);
__ATINIT__.push({ func: function() { SOCKFS.root = FS.mount(SOCKFS, {}, null); } });
_fputc.ret = allocate([0], "i8", ALLOC_STATIC);
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
function _class_stmt(){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 label=2;break;
 case 2: 
 _scan();
 var $2=HEAP32[((6944)>>2)];
 if(($2|0)==59){ label=12;break;}else if(($2|0)==1001){ label=4;break;}else{label=3;break;}
 case 3: 
 _stop(2384);
 label=4;break;
 case 4: 
 var $4=HEAP32[((14112)>>2)];
 var $5=(($4+8)|0);
 var $6=HEAP32[(($5)>>2)];
 var $i_0=0;label=5;break;
 case 5: 
 var $i_0;
 var $8=($i_0|0)<($6|0);
 if($8){label=6;break;}else{label=7;break;}
 case 6: 
 var $10=(($4+20+((($i_0)*(24))&-1))|0);
 var $11=HEAP32[(($10)>>2)];
 var $12=_strcmp($11,6984);
 var $13=($12|0)==0;
 var $14=((($i_0)+(1))|0);
 if($13){label=7;break;}else{var $i_0=$14;label=5;break;}
 case 7: 
 var $16=($i_0|0)==($6|0);
 if($16){label=8;break;}else{var $20=$4;label=9;break;}
 case 8: 
 var $18=_sprintf(12576,3664,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=6984,tempVarArgs)); STACKTOP=tempVarArgs;
 _stop(12576);
 var $_pre=HEAP32[((14112)>>2)];
 var $20=$_pre;label=9;break;
 case 9: 
 var $20;
 var $21=(($20+20+((($i_0)*(24))&-1)+12)|0);
 var $22=HEAP32[(($21)>>2)];
 var $23=($22|0)==0;
 if($23){label=10;break;}else{label=11;break;}
 case 10: 
 var $25=_sprintf(12576,2760,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=6984,tempVarArgs)); STACKTOP=tempVarArgs;
 _stop(12576);
 label=11;break;
 case 11: 
 var $27=HEAP32[((9104)>>2)];
 var $28=((($27)+(1))|0);
 HEAP32[((9104)>>2)]=$28;
 var $29=((14520+($27<<2))|0);
 HEAP32[(($29)>>2)]=$i_0;
 label=2;break;
 case 12: 
 _scan();
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }
}
function _comment_stmt(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $_pre=HEAP32[((11032)>>2)];
 var $2=$_pre;label=2;break;
 case 2: 
 var $2;
 var $3=HEAP8[($2)];
 if((($3<<24)>>24)==0|(($3<<24)>>24)==59|(($3<<24)>>24)==10|(($3<<24)>>24)==13){ label=4;break;}else{label=3;break;}
 case 3: 
 var $5=(($2+1)|0);
 HEAP32[((11032)>>2)]=$5;
 var $2=$5;label=2;break;
 case 4: 
 _scan();
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _data_step(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 HEAP32[((11168)>>2)]=1;
 HEAP32[((9112)>>2)]=0;
 HEAP8[(11576)]=0;
 HEAP32[((14000)>>2)]=2891785;
 var $1=_xmalloc(2420);
 var $2=$1;
 _memset($1, 0, 2420)|0;
 var $3=HEAP32[((14104)>>2)];
 var $4=$1;
 HEAP32[(($4)>>2)]=$3;
 HEAP32[((14104)>>2)]=$2;
 var $5=(($1+16)|0);
 var $6=$5;
 HEAP32[(($6)>>2)]=100;
 _scan();
 var $7=HEAP32[((6944)>>2)];
 var $8=($7|0)==1001;
 if($8){label=2;break;}else{var $14=$7;label=3;break;}
 case 2: 
 var $10=_strdup(6984);
 var $11=(($1+4)|0);
 var $12=$11;
 HEAP32[(($12)>>2)]=$10;
 _scan();
 var $_pr_i=HEAP32[((6944)>>2)];
 var $14=$_pr_i;label=3;break;
 case 3: 
 var $14;
 var $15=($14|0)==59;
 if($15){label=5;break;}else{label=4;break;}
 case 4: 
 _expected(1024);
 label=5;break;
 case 5: 
 _scan();
 _parse_data_body();
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _parse_data_body(){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 label=2;break;
 case 2: 
 var $1=HEAP32[((6944)>>2)];
 var $2=($1|0)==1001;
 if($2){label=3;break;}else{label=7;break;}
 case 3: 
 var $_pre=HEAP32[((11032)>>2)];
 var $4=$_pre;label=4;break;
 case 4: 
 var $4;
 var $5=HEAP8[($4)];
 if((($5<<24)>>24)==32|(($5<<24)>>24)==9){ label=5;break;}else if((($5<<24)>>24)==61){ label=6;break;}else{label=7;break;}
 case 5: 
 var $7=(($4+1)|0);
 HEAP32[((11032)>>2)]=$7;
 var $4=$7;label=4;break;
 case 6: 
 _parse_data_expr();
 label=2;break;
 case 7: 
 _keyword();
 var $9=HEAP32[((6944)>>2)];
 switch(($9|0)){case 310:{ label=13;break;}case 315:{ label=16;break;}case 314:{ label=17;break;}case 0:case 309:case 327:case 330:{ label=8;break;}default:{label=18;break;}}break;
 case 8: 
 var $11=HEAP8[(11576)];
 var $12=(($11<<24)>>24)==0;
 if($12){label=9;break;}else{label=10;break;}
 case 9: 
 _expected(3432);
 label=10;break;
 case 10: 
 var $15=_fopen(11576,1744);
 HEAP32[((11040)>>2)]=$15;
 var $16=($15|0)==0;
 if($16){label=11;break;}else{label=12;break;}
 case 11: 
 var $18=_sprintf(12576,1640,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=11576,tempVarArgs)); STACKTOP=tempVarArgs;
 _stop(12576);
 label=12;break;
 case 12: 
 _get_data();
 var $19=HEAP32[((11040)>>2)];
 var $20=_fclose($19);
 HEAP32[((11040)>>2)]=0;
 label=19;break;
 case 13: 
 var $22=HEAP8[(11576)];
 var $23=(($22<<24)>>24)==0;
 if($23){label=15;break;}else{label=14;break;}
 case 14: 
 _stop(2640);
 label=15;break;
 case 15: 
 _datalines_stmt();
 label=19;break;
 case 16: 
 _input_stmt();
 label=2;break;
 case 17: 
 _infile_stmt();
 label=2;break;
 case 18: 
 _parse_default();
 label=2;break;
 case 19: 
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }
}
function _input_stmt(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 _scan();
 label=2;break;
 case 2: 
 var $1=HEAP32[((6944)>>2)];
 if(($1|0)==1004){ label=16;break;}else if(($1|0)==1001){ label=3;break;}else{label=19;break;}
 case 3: 
 var $3=HEAP32[((14104)>>2)];
 var $4=(($3+8)|0);
 var $5=HEAP32[(($4)>>2)];
 var $6=($5|0)==100;
 if($6){label=4;break;}else{var $10=$3;var $9=$5;label=5;break;}
 case 4: 
 _stop(1272);
 var $_pre=HEAP32[((14104)>>2)];
 var $_phi_trans_insert=(($_pre+8)|0);
 var $_pre18=HEAP32[(($_phi_trans_insert)>>2)];
 var $10=$_pre;var $9=$_pre18;label=5;break;
 case 5: 
 var $9;
 var $10;
 var $11=(($10+8)|0);
 var $12=((($9)+(1))|0);
 HEAP32[(($11)>>2)]=$12;
 var $13=_strdup(6984);
 var $14=HEAP32[((14104)>>2)];
 var $15=(($14+20+((($9)*(24))&-1))|0);
 HEAP32[(($15)>>2)]=$13;
 _scan();
 var $16=HEAP32[((6944)>>2)];
 var $17=($16|0)==36;
 var $18=HEAP32[((14104)>>2)];
 var $19=(($18+20+((($9)*(24))&-1)+4)|0);
 if($17){label=6;break;}else{label=11;break;}
 case 6: 
 HEAP32[(($19)>>2)]=10;
 var $21=HEAP32[((14104)>>2)];
 var $22=(($21+20+((($9)*(24))&-1)+8)|0);
 HEAP32[(($22)>>2)]=0;
 var $23=_xmalloc(40);
 var $24=$23;
 var $25=HEAP32[((14104)>>2)];
 var $26=(($25+20+((($9)*(24))&-1)+12)|0);
 HEAP32[(($26)>>2)]=$24;
 var $27=HEAP32[((9112)>>2)];
 var $28=($27|0)==10000;
 if($28){label=7;break;}else{var $30=$27;label=8;break;}
 case 7: 
 _stop(2176);
 var $_pre_i=HEAP32[((9112)>>2)];
 var $30=$_pre_i;label=8;break;
 case 8: 
 var $30;
 var $31=((($30)+(1))|0);
 HEAP32[((9112)>>2)]=$31;
 var $32=((14920+$30)|0);
 HEAP8[($32)]=1;
 var $33=($31|0)==10000;
 if($33){label=9;break;}else{var $35=$31;label=10;break;}
 case 9: 
 _stop(2176);
 var $_pre_i8=HEAP32[((9112)>>2)];
 var $35=$_pre_i8;label=10;break;
 case 10: 
 var $35;
 var $36=(($9)&255);
 var $37=((($35)+(1))|0);
 HEAP32[((9112)>>2)]=$37;
 var $38=((14920+$35)|0);
 HEAP8[($38)]=$36;
 _scan();
 label=2;break;
 case 11: 
 HEAP32[(($19)>>2)]=0;
 var $40=HEAP32[((14104)>>2)];
 var $41=(($40+20+((($9)*(24))&-1)+8)|0);
 HEAP32[(($41)>>2)]=0;
 var $42=HEAP32[((14104)>>2)];
 var $43=(($42+20+((($9)*(24))&-1)+12)|0);
 HEAP32[(($43)>>2)]=0;
 var $44=HEAP32[((9112)>>2)];
 var $45=($44|0)==10000;
 if($45){label=12;break;}else{var $47=$44;label=13;break;}
 case 12: 
 _stop(2176);
 var $_pre_i10=HEAP32[((9112)>>2)];
 var $47=$_pre_i10;label=13;break;
 case 13: 
 var $47;
 var $48=((($47)+(1))|0);
 HEAP32[((9112)>>2)]=$48;
 var $49=((14920+$47)|0);
 HEAP8[($49)]=0;
 var $50=($48|0)==10000;
 if($50){label=14;break;}else{var $52=$48;label=15;break;}
 case 14: 
 _stop(2176);
 var $_pre_i12=HEAP32[((9112)>>2)];
 var $52=$_pre_i12;label=15;break;
 case 15: 
 var $52;
 var $53=(($9)&255);
 var $54=((($52)+(1))|0);
 HEAP32[((9112)>>2)]=$54;
 var $55=((14920+$52)|0);
 HEAP8[($55)]=$53;
 label=2;break;
 case 16: 
 var $57=HEAP32[((9112)>>2)];
 var $58=($57|0)==10000;
 if($58){label=17;break;}else{var $60=$57;label=18;break;}
 case 17: 
 _stop(2176);
 var $_pre_i14=HEAP32[((9112)>>2)];
 var $60=$_pre_i14;label=18;break;
 case 18: 
 var $60;
 var $61=((($60)+(1))|0);
 HEAP32[((9112)>>2)]=$61;
 var $62=((14920+$60)|0);
 HEAP8[($62)]=13;
 _scan();
 label=22;break;
 case 19: 
 var $64=HEAP32[((9112)>>2)];
 var $65=($64|0)==10000;
 if($65){label=20;break;}else{var $67=$64;label=21;break;}
 case 20: 
 _stop(2176);
 var $_pre_i16=HEAP32[((9112)>>2)];
 var $67=$_pre_i16;label=21;break;
 case 21: 
 var $67;
 var $68=((($67)+(1))|0);
 HEAP32[((9112)>>2)]=$68;
 var $69=((14920+$67)|0);
 HEAP8[($69)]=12;
 label=22;break;
 case 22: 
 var $71=HEAP32[((6944)>>2)];
 var $72=($71|0)==59;
 if($72){label=24;break;}else{label=23;break;}
 case 23: 
 _expected(1104);
 label=24;break;
 case 24: 
 _scan();
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _infile_stmt(){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP8[(11576)];
 var $2=(($1<<24)>>24)==0;
 if($2){label=3;break;}else{label=2;break;}
 case 2: 
 _stop(936);
 label=3;break;
 case 3: 
 _get_next_token();
 var $5=HEAP32[((6944)>>2)];
 if(($5|0)==1003){ label=4;break;}else if(($5|0)==304|($5|0)==310){ label=8;break;}else{label=7;break;}
 case 4: 
 var $7=HEAP8[(6984)];
 var $8=(($7<<24)>>24)==47;
 if($8){label=5;break;}else{label=6;break;}
 case 5: 
 var $10=_strcpy(11576,6984);
 label=8;break;
 case 6: 
 var $12=HEAP32[((120)>>2)];
 var $13=_strcpy(11576,$12);
 var $strlen=_strlen(11576);
 var $endptr=((11576+$strlen)|0);
 var $14=$endptr;
 tempBigInt=47;HEAP8[($14)]=tempBigInt&0xff;tempBigInt = tempBigInt>>8;HEAP8[((($14)+(1))|0)]=tempBigInt&0xff;
 var $15=_strcat(11576,6984);
 label=8;break;
 case 7: 
 _expected(4104);
 label=8;break;
 case 8: 
 _scan();
 _keyword();
 var $17=HEAP32[((6944)>>2)];
 if(($17|0)==312|($17|0)==311){ label=10;break;}else if(($17|0)==313){ label=17;break;}else if(($17|0)==59){ label=9;break;}else{label=23;break;}
 case 9: 
 _scan();
 STACKTOP=sp;return;
 case 10: 
 _scan();
 var $20=HEAP32[((6944)>>2)];
 var $21=($20|0)==61;
 if($21){label=12;break;}else{label=11;break;}
 case 11: 
 _expected(4024);
 label=12;break;
 case 12: 
 _scan();
 var $24=HEAP32[((6944)>>2)];
 var $25=($24|0)==1003;
 if($25){label=14;break;}else{label=13;break;}
 case 13: 
 _expected(3880);
 label=14;break;
 case 14: 
 var $28=_strlen(6984);
 var $29=($28>>>0)>99;
 if($29){label=15;break;}else{label=16;break;}
 case 15: 
 _stop(3760);
 label=16;break;
 case 16: 
 var $32=_strcpy(14000,6984);
 label=8;break;
 case 17: 
 _scan();
 var $34=HEAP32[((6944)>>2)];
 var $35=($34|0)==61;
 if($35){label=19;break;}else{label=18;break;}
 case 18: 
 _expected(4024);
 label=19;break;
 case 19: 
 _scan();
 var $38=HEAP32[((6944)>>2)];
 var $39=($38|0)==1002;
 if($39){label=21;break;}else{label=20;break;}
 case 20: 
 _expected(3536);
 label=21;break;
 case 21: 
 var $42=_sscanf(6984,3520,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=11168,tempVarArgs)); STACKTOP=tempVarArgs;
 var $43=($42|0)==1;
 if($43){label=8;break;}else{label=22;break;}
 case 22: 
 _stop(3408);
 label=8;break;
 case 23: 
 _expected(1104);
 label=8;break;
  default: assert(0, "bad label: " + label);
 }
}
function _datalines_stmt(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP32[((11032)>>2)];
 var $2=HEAP8[($1)];
 var $3=(($2<<24)>>24);
 var $4=_isspace($3);
 var $5=($4|0)==0;
 var $6=HEAP32[((11032)>>2)];
 if($5){var $16=$6;label=4;break;}else{var $7=$6;label=2;break;}
 case 2: 
 var $7;
 var $8=HEAP8[($7)];
 if((($8<<24)>>24)==13|(($8<<24)>>24)==10){ var $16=$7;label=4;break;}else{label=3;break;}
 case 3: 
 var $10=(($7+1)|0);
 HEAP32[((11032)>>2)]=$10;
 var $11=HEAP8[($10)];
 var $12=(($11<<24)>>24);
 var $13=_isspace($12);
 var $14=($13|0)==0;
 var $15=HEAP32[((11032)>>2)];
 if($14){var $16=$15;label=4;break;}else{var $7=$15;label=2;break;}
 case 4: 
 var $16;
 var $17=HEAP8[($16)];
 var $18=(($17<<24)>>24)==59;
 if($18){var $_pn=$16;label=5;break;}else{var $24=$17;label=7;break;}
 case 5: 
 var $_pn;
 var $storemerge=(($_pn+1)|0);
 HEAP32[((11032)>>2)]=$storemerge;
 var $19=HEAP8[($storemerge)];
 var $20=(($19<<24)>>24);
 var $21=_isspace($20);
 var $22=($21|0)==0;
 var $_pre_pre=HEAP32[((11032)>>2)];
 var $_pre4_pre=HEAP8[($_pre_pre)];
 if($22){var $24=$_pre4_pre;label=7;break;}else{label=6;break;}
 case 6: 
 if((($_pre4_pre<<24)>>24)==10|(($_pre4_pre<<24)>>24)==13){ var $24=$_pre4_pre;label=7;break;}else{var $_pn=$_pre_pre;label=5;break;}
 case 7: 
 var $24;
 if((($24<<24)>>24)==10|(($24<<24)>>24)==13){ label=9;break;}else{label=8;break;}
 case 8: 
 _scan();
 _expected(3344);
 label=9;break;
 case 9: 
 _get_data();
 _scan();
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _get_data(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP32[((14104)>>2)];
 var $2=(($1+8)|0);
 var $3=HEAP32[(($2)>>2)];
 var $4=($3|0)>0;
 if($4){var $i_04_i=0;var $5=$1;label=2;break;}else{label=5;break;}
 case 2: 
 var $5;
 var $i_04_i;
 var $6=(($5+20+((($i_04_i)*(24))&-1)+20)|0);
 var $7=HEAP32[(($6)>>2)];
 var $8=($7|0)==0;
 if($8){label=3;break;}else{var $18=$5;label=4;break;}
 case 3: 
 var $10=(($5+16)|0);
 var $11=HEAP32[(($10)>>2)];
 var $12=$11<<3;
 var $13=_xmalloc($12);
 var $14=$13;
 var $15=HEAP32[((14104)>>2)];
 var $16=(($15+20+((($i_04_i)*(24))&-1)+20)|0);
 HEAP32[(($16)>>2)]=$14;
 var $_pre_i=HEAP32[((14104)>>2)];
 var $18=$_pre_i;label=4;break;
 case 4: 
 var $18;
 var $19=((($i_04_i)+(1))|0);
 var $20=(($18+8)|0);
 var $21=HEAP32[(($20)>>2)];
 var $22=($19|0)<($21|0);
 if($22){var $i_04_i=$19;var $5=$18;label=2;break;}else{label=5;break;}
 case 5: 
 _getbuf();
 var $23=HEAP32[((11048)>>2)];
 var $24=($23|0)==0;
 if($24){label=13;break;}else{label=6;break;}
 case 6: 
 var $25=HEAP32[((14104)>>2)];
 var $26=(($25+12)|0);
 var $27=HEAP32[(($26)>>2)];
 var $28=(($25+16)|0);
 var $29=HEAP32[(($28)>>2)];
 var $30=($27|0)<($29|0);
 if($30){label=12;break;}else{label=7;break;}
 case 7: 
 var $32=($29|0)<10000;
 if($32){label=8;break;}else{label=9;break;}
 case 8: 
 var $34=((($29)*(10))&-1);
 var $storemerge_i=$34;label=10;break;
 case 9: 
 var $36=((($29)+(10000))|0);
 var $storemerge_i=$36;label=10;break;
 case 10: 
 var $storemerge_i;
 HEAP32[(($28)>>2)]=$storemerge_i;
 var $38=HEAP32[((14104)>>2)];
 var $39=(($38+8)|0);
 var $40=HEAP32[(($39)>>2)];
 var $41=($40|0)>0;
 if($41){var $i_04_i1=0;var $42=$38;label=11;break;}else{label=12;break;}
 case 11: 
 var $42;
 var $i_04_i1;
 var $43=(($42+20+((($i_04_i1)*(24))&-1)+20)|0);
 var $44=HEAP32[(($43)>>2)];
 var $45=$44;
 var $46=(($42+16)|0);
 var $47=HEAP32[(($46)>>2)];
 var $48=$47<<3;
 var $49=_xrealloc($45,$48);
 var $50=$49;
 var $51=HEAP32[((14104)>>2)];
 var $52=(($51+20+((($i_04_i1)*(24))&-1)+20)|0);
 HEAP32[(($52)>>2)]=$50;
 var $53=((($i_04_i1)+(1))|0);
 var $54=HEAP32[((14104)>>2)];
 var $55=(($54+8)|0);
 var $56=HEAP32[(($55)>>2)];
 var $57=($53|0)<($56|0);
 if($57){var $i_04_i1=$53;var $42=$54;label=11;break;}else{label=12;break;}
 case 12: 
 _get_data1();
 var $58=HEAP32[((14104)>>2)];
 var $59=(($58+12)|0);
 var $60=HEAP32[(($59)>>2)];
 var $61=((($60)+(1))|0);
 HEAP32[(($59)>>2)]=$61;
 var $62=HEAP32[((11048)>>2)];
 var $63=($62|0)==0;
 if($63){label=13;break;}else{label=6;break;}
 case 13: 
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _get_data1(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP32[((14104)>>2)];
 var $2=(($1+12)|0);
 var $3=HEAP32[(($2)>>2)];
 HEAP32[((6928)>>2)]=0;
 var $4=HEAP32[((9112)>>2)];
 var $5=($4|0)>0;
 if($5){var $i_026=0;label=2;break;}else{label=50;break;}
 case 2: 
 var $i_026;
 var $6=((14920+$i_026)|0);
 var $7=HEAP8[($6)];
 var $8=($7&255);
 switch(($8|0)){case 1:{ label=11;break;}case 10:{ label=12;break;}case 11:{ label=15;break;}case 9:{ label=18;break;}case 2:{ label=21;break;}case 3:{ label=24;break;}case 4:{ label=27;break;}case 0:{ label=3;break;}case 5:{ label=30;break;}case 6:{ label=33;break;}case 7:{ label=36;break;}case 8:{ label=39;break;}case 12:{ label=42;break;}case 13:{ label=43;break;}default:{label=48;break;}}break;
 case 3: 
 var $10=((($i_026)+(1))|0);
 var $11=((14920+$10)|0);
 var $12=HEAP8[($11)];
 var $13=($12&255);
 var $14=HEAP32[((11048)>>2)];
 var $s_0_i=$14;label=4;break;
 case 4: 
 var $s_0_i;
 var $16=HEAP8[($s_0_i)];
 var $17=(($16<<24)>>24);
 var $18=_strchr(14000,$17);
 var $19=($18|0)==0;
 var $20=(($16<<24)>>24)==46;
 if($19){label=5;break;}else{label=6;break;}
 case 5: 
 var $22=(($s_0_i+1)|0);
 if($20){var $s_1_i=$s_0_i;var $n_0_i=0;label=7;break;}else{var $s_0_i=$22;label=4;break;}
 case 6: 
 if($20){var $s_1_i=$s_0_i;var $n_0_i=0;label=7;break;}else{var $_0_i=0;label=8;break;}
 case 7: 
 var $n_0_i;
 var $s_1_i;
 var $23=(($s_1_i+1)|0);
 var $24=HEAP8[($23)];
 var $25=(($24<<24)>>24);
 var $isdigittmp_i=((($25)-(48))|0);
 var $26=($n_0_i|0)<8;
 var $not__i=($isdigittmp_i>>>0)<10;
 var $27=$26&$not__i;
 var $28=((($n_0_i)+(1))|0);
 if($27){var $s_1_i=$23;var $n_0_i=$28;label=7;break;}else{var $_0_i=$n_0_i;label=8;break;}
 case 8: 
 var $_0_i;
 var $29=_get_number();
 var $30=HEAP32[((14104)>>2)];
 var $31=(($30+20+((($13)*(24))&-1)+16)|0);
 var $32=HEAP32[(($31)>>2)];
 var $33=($_0_i|0)>($32|0);
 if($33){label=9;break;}else{var $36=$30;label=10;break;}
 case 9: 
 HEAP32[(($31)>>2)]=$_0_i;
 var $_pre=HEAP32[((14104)>>2)];
 var $36=$_pre;label=10;break;
 case 10: 
 var $36;
 var $37=(($36+20+((($13)*(24))&-1)+20)|0);
 var $38=HEAP32[(($37)>>2)];
 var $39=(($38+($3<<3))|0);
 HEAPF64[(($39)>>3)]=$29;
 var $i_2=$10;label=49;break;
 case 11: 
 var $41=((($i_026)+(1))|0);
 var $42=((14920+$41)|0);
 var $43=HEAP8[($42)];
 var $44=($43&255);
 _get_string();
 _catvar($44,$3);
 var $i_2=$41;label=49;break;
 case 12: 
 var $46=HEAP32[((6928)>>2)];
 var $47=($46|0)==100;
 if($47){label=13;break;}else{var $49=$46;label=14;break;}
 case 13: 
 _stop(3280);
 var $_pre32=HEAP32[((6928)>>2)];
 var $49=$_pre32;label=14;break;
 case 14: 
 var $49;
 var $50=((($i_026)+(1))|0);
 var $51=((14920+$50)|0);
 var $52=HEAP8[($51)];
 var $53=($52&255);
 var $54=HEAP32[((14104)>>2)];
 var $55=(($54+20+((($53)*(24))&-1)+20)|0);
 var $56=HEAP32[(($55)>>2)];
 var $57=(($56+($3<<3))|0);
 var $58=HEAPF64[(($57)>>3)];
 var $59=((($49)+(1))|0);
 HEAP32[((6928)>>2)]=$59;
 var $60=((7136+($49<<3))|0);
 HEAPF64[(($60)>>3)]=$58;
 var $i_2=$50;label=49;break;
 case 15: 
 var $62=HEAP32[((6928)>>2)];
 var $63=($62|0)==0;
 if($63){label=16;break;}else{var $65=$62;label=17;break;}
 case 16: 
 _stop(3208);
 var $_pre33=HEAP32[((6928)>>2)];
 var $65=$_pre33;label=17;break;
 case 17: 
 var $65;
 var $66=((($i_026)+(1))|0);
 var $67=((14920+$66)|0);
 var $68=HEAP8[($67)];
 var $69=($68&255);
 var $70=((($65)-(1))|0);
 HEAP32[((6928)>>2)]=$70;
 var $71=((7136+($70<<3))|0);
 var $72=HEAPF64[(($71)>>3)];
 var $73=HEAP32[((14104)>>2)];
 var $74=(($73+20+((($69)*(24))&-1)+16)|0);
 HEAP32[(($74)>>2)]=4;
 var $75=HEAP32[((14104)>>2)];
 var $76=(($75+20+((($69)*(24))&-1)+20)|0);
 var $77=HEAP32[(($76)>>2)];
 var $78=(($77+($3<<3))|0);
 HEAPF64[(($78)>>3)]=$72;
 var $i_2=$66;label=49;break;
 case 18: 
 var $80=HEAP32[((6928)>>2)];
 var $81=($80|0)==100;
 if($81){label=19;break;}else{var $83=$80;label=20;break;}
 case 19: 
 _stop(3280);
 var $_pre34=HEAP32[((6928)>>2)];
 var $83=$_pre34;label=20;break;
 case 20: 
 var $83;
 var $_sum=((($i_026)+(1))|0);
 var $scevgep=((14920+$_sum)|0);
 var $84=$scevgep;
 var $85=(HEAP32[((tempDoublePtr)>>2)]=((((HEAPU8[($84)])|(HEAPU8[((($84)+(1))|0)]<<8)|(HEAPU8[((($84)+(2))|0)]<<16)|(HEAPU8[((($84)+(3))|0)]<<24))|0)),HEAP32[(((tempDoublePtr)+(4))>>2)]=((((HEAPU8[((($84)+(4))|0)])|(HEAPU8[((($84)+(5))|0)]<<8)|(HEAPU8[((($84)+(6))|0)]<<16)|(HEAPU8[((($84)+(7))|0)]<<24))|0)),HEAPF64[(tempDoublePtr)>>3]);
 var $86=((($i_026)+(8))|0);
 var $87=((($83)+(1))|0);
 HEAP32[((6928)>>2)]=$87;
 var $88=((7136+($83<<3))|0);
 HEAPF64[(($88)>>3)]=$85;
 var $i_2=$86;label=49;break;
 case 21: 
 var $90=HEAP32[((6928)>>2)];
 var $91=($90|0)==0;
 if($91){label=22;break;}else{var $94=$90;label=23;break;}
 case 22: 
 _stop(3208);
 var $_pre35=HEAP32[((6928)>>2)];
 var $94=$_pre35;label=23;break;
 case 23: 
 var $94;
 var $95=((($94)-(1))|0);
 var $96=((7136+($95<<3))|0);
 var $97=HEAPF64[(($96)>>3)];
 var $98=((-.0))-($97);
 HEAPF64[(($96)>>3)]=$98;
 var $i_2=$i_026;label=49;break;
 case 24: 
 var $100=HEAP32[((6928)>>2)];
 var $101=($100|0)<2;
 if($101){label=25;break;}else{var $104=$100;label=26;break;}
 case 25: 
 _stop(3208);
 var $_pre36=HEAP32[((6928)>>2)];
 var $104=$_pre36;label=26;break;
 case 26: 
 var $104;
 var $105=((($104)-(1))|0);
 HEAP32[((6928)>>2)]=$105;
 var $106=((7136+($105<<3))|0);
 var $107=HEAPF64[(($106)>>3)];
 var $108=((($104)-(2))|0);
 var $109=((7136+($108<<3))|0);
 var $110=HEAPF64[(($109)>>3)];
 var $111=($107)+($110);
 HEAPF64[(($109)>>3)]=$111;
 var $i_2=$i_026;label=49;break;
 case 27: 
 var $113=HEAP32[((6928)>>2)];
 var $114=($113|0)<2;
 if($114){label=28;break;}else{var $117=$113;label=29;break;}
 case 28: 
 _stop(3208);
 var $_pre37=HEAP32[((6928)>>2)];
 var $117=$_pre37;label=29;break;
 case 29: 
 var $117;
 var $118=((($117)-(1))|0);
 HEAP32[((6928)>>2)]=$118;
 var $119=((7136+($118<<3))|0);
 var $120=HEAPF64[(($119)>>3)];
 var $121=((($117)-(2))|0);
 var $122=((7136+($121<<3))|0);
 var $123=HEAPF64[(($122)>>3)];
 var $124=($123)-($120);
 HEAPF64[(($122)>>3)]=$124;
 var $i_2=$i_026;label=49;break;
 case 30: 
 var $126=HEAP32[((6928)>>2)];
 var $127=($126|0)<2;
 if($127){label=31;break;}else{var $130=$126;label=32;break;}
 case 31: 
 _stop(3208);
 var $_pre38=HEAP32[((6928)>>2)];
 var $130=$_pre38;label=32;break;
 case 32: 
 var $130;
 var $131=((($130)-(1))|0);
 HEAP32[((6928)>>2)]=$131;
 var $132=((7136+($131<<3))|0);
 var $133=HEAPF64[(($132)>>3)];
 var $134=((($130)-(2))|0);
 var $135=((7136+($134<<3))|0);
 var $136=HEAPF64[(($135)>>3)];
 var $137=($133)*($136);
 HEAPF64[(($135)>>3)]=$137;
 var $i_2=$i_026;label=49;break;
 case 33: 
 var $139=HEAP32[((6928)>>2)];
 var $140=($139|0)<2;
 if($140){label=34;break;}else{var $143=$139;label=35;break;}
 case 34: 
 _stop(3208);
 var $_pre39=HEAP32[((6928)>>2)];
 var $143=$_pre39;label=35;break;
 case 35: 
 var $143;
 var $144=((($143)-(1))|0);
 HEAP32[((6928)>>2)]=$144;
 var $145=((7136+($144<<3))|0);
 var $146=HEAPF64[(($145)>>3)];
 var $147=((($143)-(2))|0);
 var $148=((7136+($147<<3))|0);
 var $149=HEAPF64[(($148)>>3)];
 var $150=($149)/($146);
 HEAPF64[(($148)>>3)]=$150;
 var $i_2=$i_026;label=49;break;
 case 36: 
 var $152=HEAP32[((6928)>>2)];
 var $153=($152|0)<2;
 if($153){label=37;break;}else{var $156=$152;label=38;break;}
 case 37: 
 _stop(3208);
 var $_pre40=HEAP32[((6928)>>2)];
 var $156=$_pre40;label=38;break;
 case 38: 
 var $156;
 var $157=((($156)-(1))|0);
 HEAP32[((6928)>>2)]=$157;
 var $158=((7136+($157<<3))|0);
 var $159=HEAPF64[(($158)>>3)];
 var $160=((($156)-(2))|0);
 var $161=((7136+($160<<3))|0);
 var $162=HEAPF64[(($161)>>3)];
 var $163=Math_pow($162,$159);
 HEAPF64[(($161)>>3)]=$163;
 var $i_2=$i_026;label=49;break;
 case 39: 
 var $165=HEAP32[((6928)>>2)];
 var $166=($165|0)<1;
 if($166){label=40;break;}else{var $169=$165;label=41;break;}
 case 40: 
 _stop(3208);
 var $_pre41=HEAP32[((6928)>>2)];
 var $169=$_pre41;label=41;break;
 case 41: 
 var $169;
 var $170=((($169)-(1))|0);
 var $171=((7136+($170<<3))|0);
 var $172=HEAPF64[(($171)>>3)];
 var $173=Math_log($172);
 HEAPF64[(($171)>>3)]=$173;
 var $i_2=$i_026;label=49;break;
 case 42: 
 _getbuf();
 var $i_2=$i_026;label=49;break;
 case 43: 
 var $176=HEAP32[((11048)>>2)];
 var $177=($176|0)==0;
 if($177){var $i_2=$i_026;label=49;break;}else{label=44;break;}
 case 44: 
 var $178=HEAP8[($176)];
 var $179=(($178<<24)>>24);
 var $180=_isspace($179);
 var $181=($180|0)==0;
 var $182=HEAP32[((11048)>>2)];
 if($181){var $_lcssa_i=$182;label=46;break;}else{var $183=$182;label=45;break;}
 case 45: 
 var $183;
 var $184=(($183+1)|0);
 HEAP32[((11048)>>2)]=$184;
 var $185=HEAP8[($184)];
 var $186=(($185<<24)>>24);
 var $187=_isspace($186);
 var $188=($187|0)==0;
 var $189=HEAP32[((11048)>>2)];
 if($188){var $_lcssa_i=$189;label=46;break;}else{var $183=$189;label=45;break;}
 case 46: 
 var $_lcssa_i;
 var $190=HEAP8[($_lcssa_i)];
 var $191=(($190<<24)>>24)==0;
 if($191){label=47;break;}else{var $i_2=$i_026;label=49;break;}
 case 47: 
 _getbuf();
 var $i_2=$i_026;label=49;break;
 case 48: 
 _stop(3136);
 var $i_2=$i_026;label=49;break;
 case 49: 
 var $i_2;
 var $194=((($i_2)+(1))|0);
 var $195=HEAP32[((9112)>>2)];
 var $196=($194|0)<($195|0);
 if($196){var $i_026=$194;label=2;break;}else{label=50;break;}
 case 50: 
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _catvar($x,$obs){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP8[(9968)];
 var $2=(($1<<24)>>24)==0;
 var $3=HEAP32[((14104)>>2)];
 if($2){label=2;break;}else{label=3;break;}
 case 2: 
 var $5=(($3+20+((($x)*(24))&-1)+20)|0);
 var $6=HEAP32[(($5)>>2)];
 var $7=(($6+($obs<<3))|0);
 HEAPF64[(($7)>>3)]=NaN;
 label=11;break;
 case 3: 
 var $9=(($3+20+((($x)*(24))&-1)+4)|0);
 var $10=HEAP32[(($9)>>2)];
 var $11=(($3+20+((($x)*(24))&-1)+8)|0);
 var $12=HEAP32[(($11)>>2)];
 var $13=(($3+20+((($x)*(24))&-1)+12)|0);
 var $i_0=0;label=4;break;
 case 4: 
 var $i_0;
 var $15=($i_0|0)<($12|0);
 if($15){label=5;break;}else{label=6;break;}
 case 5: 
 var $17=HEAP32[(($13)>>2)];
 var $18=(($17+($i_0<<2))|0);
 var $19=HEAP32[(($18)>>2)];
 var $20=_strcmp($19,9968);
 var $21=($20|0)==0;
 var $22=((($i_0)+(1))|0);
 if($21){label=6;break;}else{var $i_0=$22;label=4;break;}
 case 6: 
 var $24=($i_0|0)==($12|0);
 if($24){label=7;break;}else{var $49=$3;label=10;break;}
 case 7: 
 var $26=($10|0)==($12|0);
 if($26){label=8;break;}else{label=9;break;}
 case 8: 
 var $28=((($10)+(100))|0);
 HEAP32[(($9)>>2)]=$28;
 var $29=HEAP32[((14104)>>2)];
 var $30=(($29+20+((($x)*(24))&-1)+12)|0);
 var $31=HEAP32[(($30)>>2)];
 var $32=$31;
 var $33=$28<<2;
 var $34=_xrealloc($32,$33);
 var $35=$34;
 var $36=HEAP32[((14104)>>2)];
 var $37=(($36+20+((($x)*(24))&-1)+12)|0);
 HEAP32[(($37)>>2)]=$35;
 label=9;break;
 case 9: 
 var $39=_strdup(9968);
 var $40=HEAP32[((14104)>>2)];
 var $41=(($40+20+((($x)*(24))&-1)+12)|0);
 var $42=HEAP32[(($41)>>2)];
 var $43=(($42+($12<<2))|0);
 HEAP32[(($43)>>2)]=$39;
 var $44=HEAP32[((14104)>>2)];
 var $45=(($44+20+((($x)*(24))&-1)+8)|0);
 var $46=HEAP32[(($45)>>2)];
 var $47=((($46)+(1))|0);
 HEAP32[(($45)>>2)]=$47;
 var $_pre=HEAP32[((14104)>>2)];
 var $49=$_pre;label=10;break;
 case 10: 
 var $49;
 var $50=($i_0|0);
 var $51=(($49+20+((($x)*(24))&-1)+20)|0);
 var $52=HEAP32[(($51)>>2)];
 var $53=(($52+($obs<<3))|0);
 HEAPF64[(($53)>>3)]=$50;
 label=11;break;
 case 11: 
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _getbuf(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 label=2;break;
 case 2: 
 var $2=HEAP32[((11040)>>2)];
 var $3=($2|0)==0;
 if($3){label=5;break;}else{label=3;break;}
 case 3: 
 var $4=_fgets(26024,10001,$2);
 HEAP32[((11048)>>2)]=$4;
 var $5=($4|0)==0;
 var $6=HEAP32[((11168)>>2)];
 var $7=($6|0)<2;
 var $or_cond2=$5|$7;
 if($or_cond2){var $17=$4;label=6;break;}else{var $8=$6;label=4;break;}
 case 4: 
 var $8;
 var $9=((($8)-(1))|0);
 HEAP32[((11168)>>2)]=$9;
 var $10=HEAP32[((11040)>>2)];
 var $11=_fgets(26024,10001,$10);
 HEAP32[((11048)>>2)]=$11;
 var $12=($11|0)==0;
 var $13=HEAP32[((11168)>>2)];
 var $14=($13|0)<2;
 var $or_cond=$12|$14;
 if($or_cond){var $17=$11;label=6;break;}else{var $8=$13;label=4;break;}
 case 5: 
 var $16=_get_dataline(26024,10001);
 HEAP32[((11048)>>2)]=$16;
 var $17=$16;label=6;break;
 case 6: 
 var $17;
 var $18=($17|0)==0;
 if($18){label=10;break;}else{label=7;break;}
 case 7: 
 var $19=HEAP8[($17)];
 var $20=(($19<<24)>>24);
 var $21=_isspace($20);
 var $22=($21|0)==0;
 var $23=HEAP32[((11048)>>2)];
 if($22){var $_lcssa4=$23;label=9;break;}else{var $24=$23;label=8;break;}
 case 8: 
 var $24;
 var $25=(($24+1)|0);
 HEAP32[((11048)>>2)]=$25;
 var $26=HEAP8[($25)];
 var $27=(($26<<24)>>24);
 var $28=_isspace($27);
 var $29=($28|0)==0;
 var $30=HEAP32[((11048)>>2)];
 if($29){var $_lcssa4=$30;label=9;break;}else{var $24=$30;label=8;break;}
 case 9: 
 var $_lcssa4;
 var $31=HEAP8[($_lcssa4)];
 var $32=(($31<<24)>>24)==0;
 if($32){label=2;break;}else{label=10;break;}
 case 10: 
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _get_number(){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+8)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $d=sp;
 HEAPF64[(($d)>>3)]=NaN;
 var $1=HEAP32[((11048)>>2)];
 var $2=($1|0)==0;
 if($2){var $_0=NaN;label=13;break;}else{label=2;break;}
 case 2: 
 var $3=HEAP8[($1)];
 var $4=(($3<<24)>>24);
 var $5=_isspace($4);
 var $6=($5|0)==0;
 var $7=HEAP32[((11048)>>2)];
 if($6){var $_lcssa3=$7;label=4;break;}else{var $8=$7;label=3;break;}
 case 3: 
 var $8;
 var $9=(($8+1)|0);
 HEAP32[((11048)>>2)]=$9;
 var $10=HEAP8[($9)];
 var $11=(($10<<24)>>24);
 var $12=_isspace($11);
 var $13=($12|0)==0;
 var $14=HEAP32[((11048)>>2)];
 if($13){var $_lcssa3=$14;label=4;break;}else{var $8=$14;label=3;break;}
 case 4: 
 var $_lcssa3;
 var $15=HEAP8[($_lcssa3)];
 var $16=(($15<<24)>>24)==0;
 if($16){label=5;break;}else{label=6;break;}
 case 5: 
 var $18=HEAPF64[(($d)>>3)];
 var $_0=$18;label=13;break;
 case 6: 
 var $20=(($15<<24)>>24);
 var $21=_strchr(14000,$20);
 var $22=($21|0)==0;
 if($22){label=8;break;}else{label=7;break;}
 case 7: 
 var $24=(($_lcssa3+1)|0);
 HEAP32[((11048)>>2)]=$24;
 var $25=HEAPF64[(($d)>>3)];
 var $_0=$25;label=13;break;
 case 8: 
 var $27=_sscanf($_lcssa3,3088,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$d,tempVarArgs)); STACKTOP=tempVarArgs;
 var $28=HEAP32[((11048)>>2)];
 var $29=HEAP8[($28)];
 var $30=(($29<<24)>>24);
 var $31=_strchr(14000,$30);
 var $32=($31|0)==0;
 if($32){var $33=$28;label=9;break;}else{var $_lcssa=$28;var $_lcssa1=$29;label=10;break;}
 case 9: 
 var $33;
 var $34=(($33+1)|0);
 HEAP32[((11048)>>2)]=$34;
 var $35=HEAP8[($34)];
 var $36=(($35<<24)>>24);
 var $37=_strchr(14000,$36);
 var $38=($37|0)==0;
 if($38){var $33=$34;label=9;break;}else{var $_lcssa=$34;var $_lcssa1=$35;label=10;break;}
 case 10: 
 var $_lcssa1;
 var $_lcssa;
 var $39=(($_lcssa1<<24)>>24)==0;
 if($39){label=12;break;}else{label=11;break;}
 case 11: 
 var $41=(($_lcssa+1)|0);
 HEAP32[((11048)>>2)]=$41;
 label=12;break;
 case 12: 
 var $43=HEAPF64[(($d)>>3)];
 var $_0=$43;label=13;break;
 case 13: 
 var $_0;
 STACKTOP=sp;return $_0;
  default: assert(0, "bad label: " + label);
 }
}
function _get_string(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 HEAP8[(9968)]=0;
 var $1=HEAP32[((11048)>>2)];
 var $2=($1|0)==0;
 if($2){label=17;break;}else{label=2;break;}
 case 2: 
 var $3=HEAP8[($1)];
 var $4=(($3<<24)>>24);
 var $5=_isspace($4);
 var $6=($5|0)==0;
 var $7=HEAP32[((11048)>>2)];
 if($6){var $15=$7;label=4;break;}else{var $8=$7;label=3;break;}
 case 3: 
 var $8;
 var $9=(($8+1)|0);
 HEAP32[((11048)>>2)]=$9;
 var $10=HEAP8[($9)];
 var $11=(($10<<24)>>24);
 var $12=_isspace($11);
 var $13=($12|0)==0;
 var $14=HEAP32[((11048)>>2)];
 if($13){var $15=$14;label=4;break;}else{var $8=$14;label=3;break;}
 case 4: 
 var $15;
 var $16=HEAP8[($15)];
 var $17=(($16<<24)>>24)==0;
 if($17){label=17;break;}else{label=5;break;}
 case 5: 
 var $19=(($16<<24)>>24);
 var $20=_strchr(14000,$19);
 var $21=($20|0)==0;
 if($21){var $24=$15;label=7;break;}else{label=6;break;}
 case 6: 
 var $23=(($15+1)|0);
 HEAP32[((11048)>>2)]=$23;
 label=17;break;
 case 7: 
 var $24;
 var $25=(($24+1)|0);
 HEAP32[((11048)>>2)]=$25;
 var $26=HEAP8[($25)];
 var $27=(($26<<24)>>24);
 var $28=_strchr(14000,$27);
 var $29=($28|0)==0;
 if($29){var $24=$25;label=7;break;}else{var $t_0=$25;label=8;break;}
 case 8: 
 var $t_0;
 var $30=((($t_0)-(1))|0);
 var $31=HEAP8[($30)];
 var $32=(($31<<24)>>24);
 var $33=_isspace($32);
 var $34=($33|0)==0;
 if($34){label=9;break;}else{var $t_0=$30;label=8;break;}
 case 9: 
 var $36=$t_0;
 var $37=$15;
 var $38=((($36)-($37))|0);
 var $39=((($38)+(1))|0);
 var $40=($39>>>0)>100;
 if($40){label=10;break;}else{label=11;break;}
 case 10: 
 _stop(2992);
 label=11;break;
 case 11: 
 var $43=($38|0)==1;
 if($43){label=12;break;}else{label=13;break;}
 case 12: 
 var $45=HEAP8[($15)];
 var $46=(($45<<24)>>24)==46;
 if($46){label=17;break;}else{var $i_010=0;label=14;break;}
 case 13: 
 var $47=($38|0)>0;
 if($47){var $i_010=0;label=14;break;}else{label=15;break;}
 case 14: 
 var $i_010;
 var $48=(($15+$i_010)|0);
 var $49=HEAP8[($48)];
 var $50=((9968+$i_010)|0);
 HEAP8[($50)]=$49;
 var $51=((($i_010)+(1))|0);
 var $52=($51|0)<($38|0);
 if($52){var $i_010=$51;label=14;break;}else{label=15;break;}
 case 15: 
 var $53=((9968+$38)|0);
 HEAP8[($53)]=0;
 var $54=HEAP32[((11048)>>2)];
 var $55=HEAP8[($54)];
 var $56=(($55<<24)>>24)==0;
 if($56){label=17;break;}else{label=16;break;}
 case 16: 
 var $58=(($54+1)|0);
 HEAP32[((11048)>>2)]=$58;
 label=17;break;
 case 17: 
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _free_datasets(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP32[((14104)>>2)];
 var $2=($1|0)==0;
 if($2){label=12;break;}else{var $3=$1;label=2;break;}
 case 2: 
 var $3;
 var $4=(($3)|0);
 var $5=HEAP32[(($4)>>2)];
 HEAP32[((14104)>>2)]=$5;
 var $6=(($3+4)|0);
 var $7=HEAP32[(($6)>>2)];
 var $8=($7|0)==0;
 if($8){var $i_016=0;label=4;break;}else{label=3;break;}
 case 3: 
 _free($7);
 var $i_016=0;label=4;break;
 case 4: 
 var $i_016;
 var $10=(($3+20+((($i_016)*(24))&-1))|0);
 var $11=HEAP32[(($10)>>2)];
 var $12=($11|0)==0;
 if($12){label=6;break;}else{label=5;break;}
 case 5: 
 _free($11);
 label=6;break;
 case 6: 
 var $15=(($3+20+((($i_016)*(24))&-1)+20)|0);
 var $16=HEAP32[(($15)>>2)];
 var $17=($16|0)==0;
 if($17){label=8;break;}else{label=7;break;}
 case 7: 
 var $19=$16;
 _free($19);
 label=8;break;
 case 8: 
 var $21=(($3+20+((($i_016)*(24))&-1)+12)|0);
 var $22=HEAP32[(($21)>>2)];
 var $23=($22|0)==0;
 if($23){label=10;break;}else{label=9;break;}
 case 9: 
 var $25=$22;
 _free($25);
 label=10;break;
 case 10: 
 var $27=((($i_016)+(1))|0);
 var $28=($27|0)<100;
 if($28){var $i_016=$27;label=4;break;}else{label=11;break;}
 case 11: 
 var $30=$3;
 _free($30);
 var $31=HEAP32[((14104)>>2)];
 var $32=($31|0)==0;
 if($32){label=12;break;}else{var $3=$31;label=2;break;}
 case 12: 
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _select_dataset($s){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP32[((14104)>>2)];
 HEAP32[((14112)>>2)]=$1;
 var $2=($s|0)==0;
 if($2){label=7;break;}else{label=2;break;}
 case 2: 
 var $3=($1|0)==0;
 if($3){label=6;break;}else{var $4=$1;label=3;break;}
 case 3: 
 var $4;
 var $5=(($4+4)|0);
 var $6=HEAP32[(($5)>>2)];
 var $7=($6|0)==0;
 if($7){label=5;break;}else{label=4;break;}
 case 4: 
 var $9=_strcmp($6,$s);
 var $10=($9|0)==0;
 if($10){label=7;break;}else{label=5;break;}
 case 5: 
 var $12=(($4)|0);
 var $13=HEAP32[(($12)>>2)];
 HEAP32[((14112)>>2)]=$13;
 var $14=($13|0)==0;
 if($14){label=6;break;}else{var $4=$13;label=3;break;}
 case 6: 
 var $15=_sprintf(12576,2624,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$s,tempVarArgs)); STACKTOP=tempVarArgs;
 _stop(12576);
 label=7;break;
 case 7: 
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }
}
function _parse_data_expr(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP32[((14104)>>2)];
 var $2=(($1+8)|0);
 var $3=HEAP32[(($2)>>2)];
 var $4=($3|0)==100;
 if($4){label=2;break;}else{label=3;break;}
 case 2: 
 _stop(1272);
 label=3;break;
 case 3: 
 var $7=_strdup(6984);
 var $8=HEAP32[((14104)>>2)];
 var $9=(($8+8)|0);
 var $10=HEAP32[(($9)>>2)];
 var $11=(($8+20+((($10)*(24))&-1))|0);
 HEAP32[(($11)>>2)]=$7;
 _scan();
 _scan();
 _parse_expr();
 var $12=HEAP32[((6944)>>2)];
 var $13=($12|0)==59;
 if($13){label=5;break;}else{label=4;break;}
 case 4: 
 _stop(2568);
 label=5;break;
 case 5: 
 _scan();
 var $16=HEAP32[((9112)>>2)];
 var $17=($16|0)==10000;
 if($17){label=6;break;}else{var $19=$16;label=7;break;}
 case 6: 
 _stop(2176);
 var $_pre_i=HEAP32[((9112)>>2)];
 var $19=$_pre_i;label=7;break;
 case 7: 
 var $19;
 var $20=((($19)+(1))|0);
 HEAP32[((9112)>>2)]=$20;
 var $21=((14920+$19)|0);
 HEAP8[($21)]=11;
 var $22=HEAP32[((14104)>>2)];
 var $23=(($22+8)|0);
 var $24=HEAP32[(($23)>>2)];
 var $25=($20|0)==10000;
 if($25){label=8;break;}else{var $28=$20;var $27=$22;label=9;break;}
 case 8: 
 _stop(2176);
 var $_pre_i1=HEAP32[((9112)>>2)];
 var $_pre=HEAP32[((14104)>>2)];
 var $28=$_pre_i1;var $27=$_pre;label=9;break;
 case 9: 
 var $27;
 var $28;
 var $29=(($24)&255);
 var $30=((($28)+(1))|0);
 HEAP32[((9112)>>2)]=$30;
 var $31=((14920+$28)|0);
 HEAP8[($31)]=$29;
 var $32=(($27+8)|0);
 var $33=HEAP32[(($32)>>2)];
 var $34=((($33)+(1))|0);
 HEAP32[(($32)>>2)]=$34;
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _parse_expr(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP32[((6944)>>2)];
 if(($1|0)==43){ label=2;break;}else if(($1|0)==45){ label=3;break;}else{label=6;break;}
 case 2: 
 _scan();
 _parse_term();
 label=7;break;
 case 3: 
 _scan();
 _parse_term();
 var $4=HEAP32[((9112)>>2)];
 var $5=($4|0)==10000;
 if($5){label=4;break;}else{var $7=$4;label=5;break;}
 case 4: 
 _stop(2176);
 var $_pre_i3=HEAP32[((9112)>>2)];
 var $7=$_pre_i3;label=5;break;
 case 5: 
 var $7;
 var $8=((($7)+(1))|0);
 HEAP32[((9112)>>2)]=$8;
 var $9=((14920+$7)|0);
 HEAP8[($9)]=2;
 label=7;break;
 case 6: 
 _parse_term();
 label=7;break;
 case 7: 
 var $11=HEAP32[((6944)>>2)];
 if(($11|0)==45){ label=11;break;}else if(($11|0)==43){ label=8;break;}else{label=14;break;}
 case 8: 
 _scan();
 _parse_term();
 var $13=HEAP32[((9112)>>2)];
 var $14=($13|0)==10000;
 if($14){label=9;break;}else{var $16=$13;label=10;break;}
 case 9: 
 _stop(2176);
 var $_pre_i1=HEAP32[((9112)>>2)];
 var $16=$_pre_i1;label=10;break;
 case 10: 
 var $16;
 var $17=((($16)+(1))|0);
 HEAP32[((9112)>>2)]=$17;
 var $18=((14920+$16)|0);
 HEAP8[($18)]=3;
 label=7;break;
 case 11: 
 _scan();
 _parse_term();
 var $20=HEAP32[((9112)>>2)];
 var $21=($20|0)==10000;
 if($21){label=12;break;}else{var $23=$20;label=13;break;}
 case 12: 
 _stop(2176);
 var $_pre_i=HEAP32[((9112)>>2)];
 var $23=$_pre_i;label=13;break;
 case 13: 
 var $23;
 var $24=((($23)+(1))|0);
 HEAP32[((9112)>>2)]=$24;
 var $25=((14920+$23)|0);
 HEAP8[($25)]=4;
 label=7;break;
 case 14: 
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _parse_term(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 _parse_factor();
 label=2;break;
 case 2: 
 var $1=HEAP32[((6944)>>2)];
 if(($1|0)==42){ label=3;break;}else if(($1|0)==47){ label=6;break;}else{label=9;break;}
 case 3: 
 _scan();
 _parse_factor();
 var $3=HEAP32[((9112)>>2)];
 var $4=($3|0)==10000;
 if($4){label=4;break;}else{var $6=$3;label=5;break;}
 case 4: 
 _stop(2176);
 var $_pre_i1=HEAP32[((9112)>>2)];
 var $6=$_pre_i1;label=5;break;
 case 5: 
 var $6;
 var $7=((($6)+(1))|0);
 HEAP32[((9112)>>2)]=$7;
 var $8=((14920+$6)|0);
 HEAP8[($8)]=5;
 label=2;break;
 case 6: 
 _scan();
 _parse_factor();
 var $10=HEAP32[((9112)>>2)];
 var $11=($10|0)==10000;
 if($11){label=7;break;}else{var $13=$10;label=8;break;}
 case 7: 
 _stop(2176);
 var $_pre_i=HEAP32[((9112)>>2)];
 var $13=$_pre_i;label=8;break;
 case 8: 
 var $13;
 var $14=((($13)+(1))|0);
 HEAP32[((9112)>>2)]=$14;
 var $15=((14920+$13)|0);
 HEAP8[($15)]=6;
 label=2;break;
 case 9: 
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _parse_factor(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP32[((6944)>>2)];
 if(($1|0)==1001){ label=2;break;}else if(($1|0)==1002){ label=5;break;}else if(($1|0)==40){ label=6;break;}else{label=9;break;}
 case 2: 
 var $3=_strcmp(6984,2480);
 var $4=($3|0)==0;
 if($4){label=3;break;}else{label=4;break;}
 case 3: 
 _parse_log();
 label=10;break;
 case 4: 
 _emit_variable();
 _scan();
 label=10;break;
 case 5: 
 _emit_number();
 _scan();
 label=10;break;
 case 6: 
 _scan();
 _parse_expr();
 var $9=HEAP32[((6944)>>2)];
 var $10=($9|0)==41;
 if($10){label=8;break;}else{label=7;break;}
 case 7: 
 _stop(2368);
 label=8;break;
 case 8: 
 _scan();
 label=10;break;
 case 9: 
 _stop(2368);
 label=10;break;
 case 10: 
 var $15=HEAP32[((6944)>>2)];
 var $16=($15|0)==1005;
 if($16){label=11;break;}else{label=20;break;}
 case 11: 
 _scan();
 var $18=HEAP32[((6944)>>2)];
 if(($18|0)==43){ label=12;break;}else if(($18|0)==45){ label=13;break;}else{label=16;break;}
 case 12: 
 _scan();
 _parse_factor();
 label=17;break;
 case 13: 
 _scan();
 _parse_factor();
 var $21=HEAP32[((9112)>>2)];
 var $22=($21|0)==10000;
 if($22){label=14;break;}else{var $24=$21;label=15;break;}
 case 14: 
 _stop(2176);
 var $_pre_i=HEAP32[((9112)>>2)];
 var $24=$_pre_i;label=15;break;
 case 15: 
 var $24;
 var $25=((($24)+(1))|0);
 HEAP32[((9112)>>2)]=$25;
 var $26=((14920+$24)|0);
 HEAP8[($26)]=2;
 label=17;break;
 case 16: 
 _parse_factor();
 label=17;break;
 case 17: 
 var $29=HEAP32[((9112)>>2)];
 var $30=($29|0)==10000;
 if($30){label=18;break;}else{var $32=$29;label=19;break;}
 case 18: 
 _stop(2176);
 var $_pre_i1=HEAP32[((9112)>>2)];
 var $32=$_pre_i1;label=19;break;
 case 19: 
 var $32;
 var $33=((($32)+(1))|0);
 HEAP32[((9112)>>2)]=$33;
 var $34=((14920+$32)|0);
 HEAP8[($34)]=7;
 label=20;break;
 case 20: 
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _parse_log(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP32[((11032)>>2)];
 var $2=HEAP8[($1)];
 var $3=(($2<<24)>>24);
 var $4=_isspace($3);
 var $5=($4|0)==0;
 var $6=HEAP32[((11032)>>2)];
 if($5){var $16=$6;label=4;break;}else{var $7=$6;label=2;break;}
 case 2: 
 var $7;
 var $8=HEAP8[($7)];
 if((($8<<24)>>24)==13|(($8<<24)>>24)==10){ var $16=$7;label=4;break;}else{label=3;break;}
 case 3: 
 var $10=(($7+1)|0);
 HEAP32[((11032)>>2)]=$10;
 var $11=HEAP8[($10)];
 var $12=(($11<<24)>>24);
 var $13=_isspace($12);
 var $14=($13|0)==0;
 var $15=HEAP32[((11032)>>2)];
 if($14){var $16=$15;label=4;break;}else{var $7=$15;label=2;break;}
 case 4: 
 var $16;
 var $17=HEAP8[($16)];
 var $18=(($17<<24)>>24)==40;
 if($18){label=6;break;}else{label=5;break;}
 case 5: 
 _emit_variable();
 _scan();
 label=11;break;
 case 6: 
 _scan();
 _scan();
 _parse_expr();
 var $21=HEAP32[((6944)>>2)];
 var $22=($21|0)==41;
 if($22){label=8;break;}else{label=7;break;}
 case 7: 
 _expected(2312);
 label=8;break;
 case 8: 
 _scan();
 var $25=HEAP32[((9112)>>2)];
 var $26=($25|0)==10000;
 if($26){label=9;break;}else{var $28=$25;label=10;break;}
 case 9: 
 _stop(2176);
 var $_pre_i=HEAP32[((9112)>>2)];
 var $28=$_pre_i;label=10;break;
 case 10: 
 var $28;
 var $29=((($28)+(1))|0);
 HEAP32[((9112)>>2)]=$29;
 var $30=((14920+$28)|0);
 HEAP8[($30)]=8;
 label=11;break;
 case 11: 
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _emit_variable(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP32[((14104)>>2)];
 var $2=(($1+8)|0);
 var $3=HEAP32[(($2)>>2)];
 var $i_0=0;label=2;break;
 case 2: 
 var $i_0;
 var $5=($i_0|0)<($3|0);
 if($5){label=3;break;}else{label=4;break;}
 case 3: 
 var $7=(($1+20+((($i_0)*(24))&-1))|0);
 var $8=HEAP32[(($7)>>2)];
 var $9=_strcmp($8,6984);
 var $10=($9|0)==0;
 var $11=((($i_0)+(1))|0);
 if($10){label=4;break;}else{var $i_0=$11;label=2;break;}
 case 4: 
 var $13=($i_0|0)==($3|0);
 if($13){label=5;break;}else{var $16=$1;label=6;break;}
 case 5: 
 _stop(2112);
 var $_pre=HEAP32[((14104)>>2)];
 var $16=$_pre;label=6;break;
 case 6: 
 var $16;
 var $17=(($16+20+((($i_0)*(24))&-1)+12)|0);
 var $18=HEAP32[(($17)>>2)];
 var $19=($18|0)==0;
 if($19){label=8;break;}else{label=7;break;}
 case 7: 
 _stop(2000);
 label=8;break;
 case 8: 
 var $22=HEAP32[((9112)>>2)];
 var $23=($22|0)==10000;
 if($23){label=9;break;}else{var $25=$22;label=10;break;}
 case 9: 
 _stop(2176);
 var $_pre_i=HEAP32[((9112)>>2)];
 var $25=$_pre_i;label=10;break;
 case 10: 
 var $25;
 var $26=((($25)+(1))|0);
 HEAP32[((9112)>>2)]=$26;
 var $27=((14920+$25)|0);
 HEAP8[($27)]=10;
 var $28=($26|0)==10000;
 if($28){label=11;break;}else{var $30=$26;label=12;break;}
 case 11: 
 _stop(2176);
 var $_pre_i6=HEAP32[((9112)>>2)];
 var $30=$_pre_i6;label=12;break;
 case 12: 
 var $30;
 var $31=(($i_0)&255);
 var $32=((($30)+(1))|0);
 HEAP32[((9112)>>2)]=$32;
 var $33=((14920+$30)|0);
 HEAP8[($33)]=$31;
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _emit_number(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP32[((9112)>>2)];
 var $2=($1|0)==10000;
 if($2){label=2;break;}else{var $4=$1;label=3;break;}
 case 2: 
 _stop(2176);
 var $_pre_i=HEAP32[((9112)>>2)];
 var $4=$_pre_i;label=3;break;
 case 3: 
 var $4;
 var $5=((($4)+(1))|0);
 HEAP32[((9112)>>2)]=$5;
 var $6=((14920+$4)|0);
 HEAP8[($6)]=9;
 var $7=HEAP8[(24)];
 var $8=($5|0)==10000;
 if($8){label=4;break;}else{var $10=$5;label=5;break;}
 case 4: 
 _stop(2176);
 var $_pre_i3=HEAP32[((9112)>>2)];
 var $10=$_pre_i3;label=5;break;
 case 5: 
 var $10;
 var $11=((($10)+(1))|0);
 HEAP32[((9112)>>2)]=$11;
 var $12=((14920+$10)|0);
 HEAP8[($12)]=$7;
 var $13=HEAP8[(25)];
 var $14=($11|0)==10000;
 if($14){label=6;break;}else{var $16=$11;label=7;break;}
 case 6: 
 _stop(2176);
 var $_pre_i3_1=HEAP32[((9112)>>2)];
 var $16=$_pre_i3_1;label=7;break;
 case 7: 
 var $16;
 var $17=((($16)+(1))|0);
 HEAP32[((9112)>>2)]=$17;
 var $18=((14920+$16)|0);
 HEAP8[($18)]=$13;
 var $19=HEAP8[(26)];
 var $20=($17|0)==10000;
 if($20){label=8;break;}else{var $22=$17;label=9;break;}
 case 8: 
 _stop(2176);
 var $_pre_i3_2=HEAP32[((9112)>>2)];
 var $22=$_pre_i3_2;label=9;break;
 case 9: 
 var $22;
 var $23=((($22)+(1))|0);
 HEAP32[((9112)>>2)]=$23;
 var $24=((14920+$22)|0);
 HEAP8[($24)]=$19;
 var $25=HEAP8[(27)];
 var $26=($23|0)==10000;
 if($26){label=10;break;}else{var $28=$23;label=11;break;}
 case 10: 
 _stop(2176);
 var $_pre_i3_3=HEAP32[((9112)>>2)];
 var $28=$_pre_i3_3;label=11;break;
 case 11: 
 var $28;
 var $29=((($28)+(1))|0);
 HEAP32[((9112)>>2)]=$29;
 var $30=((14920+$28)|0);
 HEAP8[($30)]=$25;
 var $31=HEAP8[(28)];
 var $32=($29|0)==10000;
 if($32){label=12;break;}else{var $34=$29;label=13;break;}
 case 12: 
 _stop(2176);
 var $_pre_i3_4=HEAP32[((9112)>>2)];
 var $34=$_pre_i3_4;label=13;break;
 case 13: 
 var $34;
 var $35=((($34)+(1))|0);
 HEAP32[((9112)>>2)]=$35;
 var $36=((14920+$34)|0);
 HEAP8[($36)]=$31;
 var $37=HEAP8[(29)];
 var $38=($35|0)==10000;
 if($38){label=14;break;}else{var $40=$35;label=15;break;}
 case 14: 
 _stop(2176);
 var $_pre_i3_5=HEAP32[((9112)>>2)];
 var $40=$_pre_i3_5;label=15;break;
 case 15: 
 var $40;
 var $41=((($40)+(1))|0);
 HEAP32[((9112)>>2)]=$41;
 var $42=((14920+$40)|0);
 HEAP8[($42)]=$37;
 var $43=HEAP8[(30)];
 var $44=($41|0)==10000;
 if($44){label=16;break;}else{var $46=$41;label=17;break;}
 case 16: 
 _stop(2176);
 var $_pre_i3_6=HEAP32[((9112)>>2)];
 var $46=$_pre_i3_6;label=17;break;
 case 17: 
 var $46;
 var $47=((($46)+(1))|0);
 HEAP32[((9112)>>2)]=$47;
 var $48=((14920+$46)|0);
 HEAP8[($48)]=$43;
 var $49=HEAP8[(31)];
 var $50=($47|0)==10000;
 if($50){label=18;break;}else{var $52=$47;label=19;break;}
 case 18: 
 _stop(2176);
 var $_pre_i3_7=HEAP32[((9112)>>2)];
 var $52=$_pre_i3_7;label=19;break;
 case 19: 
 var $52;
 var $53=((($52)+(1))|0);
 HEAP32[((9112)>>2)]=$53;
 var $54=((14920+$52)|0);
 HEAP8[($54)]=$49;
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _emit_line($s){
 var label=0;
 var $puts=_puts($s);
 return;
}
function _emit_line_center($s){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=_strlen($s);
 var $2=(((80)-($1))|0);
 var $3=(((($2|0))/(2))&-1);
 var $4=($2|0)>1;
 if($4){var $i_04=0;label=2;break;}else{label=3;break;}
 case 2: 
 var $i_04;
 var $putchar=_putchar(32);
 var $5=((($i_04)+(1))|0);
 var $6=($5|0)<($3|0);
 if($6){var $i_04=$5;label=2;break;}else{label=3;break;}
 case 3: 
 var $puts=_puts($s);
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _model_stmt(){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 HEAP32[((9056)>>2)]=0;
 HEAP32[((9008)>>2)]=0;
 HEAP32[((9000)>>2)]=0;
 _scan();
 var $1=HEAP32[((6944)>>2)];
 var $2=($1|0)==1001;
 if($2){label=3;break;}else{label=2;break;}
 case 2: 
 _expected(1688);
 label=3;break;
 case 3: 
 var $4=HEAP32[((14112)>>2)];
 var $5=(($4+8)|0);
 var $6=HEAP32[(($5)>>2)];
 var $i_0=0;label=4;break;
 case 4: 
 var $i_0;
 var $8=($i_0|0)<($6|0);
 if($8){label=5;break;}else{label=6;break;}
 case 5: 
 var $10=(($4+20+((($i_0)*(24))&-1))|0);
 var $11=HEAP32[(($10)>>2)];
 var $12=_strcmp($11,6984);
 var $13=($12|0)==0;
 var $14=((($i_0)+(1))|0);
 if($13){label=6;break;}else{var $i_0=$14;label=4;break;}
 case 6: 
 var $16=($i_0|0)==($6|0);
 if($16){label=7;break;}else{label=8;break;}
 case 7: 
 var $18=_sprintf(12576,3632,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=6984,tempVarArgs)); STACKTOP=tempVarArgs;
 _stop(12576);
 label=8;break;
 case 8: 
 var $20=HEAP32[((9000)>>2)];
 var $21=((($20)+(1))|0);
 HEAP32[((9000)>>2)]=$21;
 var $22=((4128+($20<<2))|0);
 HEAP32[(($22)>>2)]=$i_0;
 _scan();
 var $23=HEAP32[((6944)>>2)];
 var $24=($23|0)==61;
 if($24){label=10;break;}else{label=9;break;}
 case 9: 
 _expected(2872);
 label=10;break;
 case 10: 
 _scan();
 var $26=HEAP32[((6944)>>2)];
 var $27=($26|0)==59;
 var $28=($26|0)==47;
 var $or_cond14=$27|$28;
 var $29=HEAP32[((9008)>>2)];
 var $30=($29|0)!=0;
 var $or_cond315=$or_cond14&$30;
 if($or_cond315){var $_lcssa=$28;label=19;break;}else{var $31=$26;label=11;break;}
 case 11: 
 var $31;
 var $32=($31|0)==1001;
 if($32){label=13;break;}else{label=12;break;}
 case 12: 
 _expected(1688);
 label=13;break;
 case 13: 
 var $34=HEAP32[((14112)>>2)];
 var $35=(($34+8)|0);
 var $36=HEAP32[(($35)>>2)];
 var $i_1=0;label=14;break;
 case 14: 
 var $i_1;
 var $38=($i_1|0)<($36|0);
 if($38){label=15;break;}else{label=16;break;}
 case 15: 
 var $40=(($34+20+((($i_1)*(24))&-1))|0);
 var $41=HEAP32[(($40)>>2)];
 var $42=_strcmp($41,6984);
 var $43=($42|0)==0;
 var $44=((($i_1)+(1))|0);
 if($43){label=16;break;}else{var $i_1=$44;label=14;break;}
 case 16: 
 var $46=($i_1|0)==($36|0);
 if($46){label=17;break;}else{label=18;break;}
 case 17: 
 var $48=_sprintf(12576,3632,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=6984,tempVarArgs)); STACKTOP=tempVarArgs;
 _stop(12576);
 label=18;break;
 case 18: 
 var $49=HEAP32[((9008)>>2)];
 var $50=((($49)+(1))|0);
 HEAP32[((9008)>>2)]=$50;
 var $51=((5328+($49<<2))|0);
 HEAP32[(($51)>>2)]=$i_1;
 _scan();
 var $52=HEAP32[((6944)>>2)];
 var $53=($52|0)==59;
 var $54=($52|0)==47;
 var $or_cond=$53|$54;
 var $55=HEAP32[((9008)>>2)];
 var $56=($55|0)!=0;
 var $or_cond3=$or_cond&$56;
 if($or_cond3){var $_lcssa=$54;label=19;break;}else{var $31=$52;label=11;break;}
 case 19: 
 var $_lcssa;
 if($_lcssa){label=20;break;}else{label=23;break;}
 case 20: 
 _scan();
 _keyword();
 var $57=HEAP32[((6944)>>2)];
 if(($57|0)==325){ label=21;break;}else if(($57|0)==59){ label=23;break;}else{label=22;break;}
 case 21: 
 HEAP32[((9056)>>2)]=1;
 label=20;break;
 case 22: 
 _stop(1952);
 label=20;break;
 case 23: 
 _scan();
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }
}
function _print_table_and_free($a,$nrow,$ncol,$fmt){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 _print_table($a,$nrow,$ncol,$fmt);
 var $1=($nrow|0)>0;
 var $2=($ncol|0)>0;
 var $or_cond=$1&$2;
 if($or_cond){var $i_014_us=0;label=4;break;}else{label=5;break;}
 case 2: 
 var $4=((($i_014_us)+(1))|0);
 var $5=($4|0)<($nrow|0);
 if($5){var $i_014_us=$4;label=4;break;}else{label=5;break;}
 case 3: 
 var $j_013_us;
 var $_sum_us=((($j_013_us)+($11))|0);
 var $7=(($a+($_sum_us<<2))|0);
 var $8=HEAP32[(($7)>>2)];
 _free($8);
 var $9=((($j_013_us)+(1))|0);
 var $10=($9|0)<($ncol|0);
 if($10){var $j_013_us=$9;label=3;break;}else{label=2;break;}
 case 4: 
 var $i_014_us;
 var $11=(Math_imul($i_014_us,$ncol)|0);
 var $j_013_us=0;label=3;break;
 case 5: 
 var $12=$a;
 _free($12);
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _print_table($a,$nrow,$ncol,$fmt){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=$ncol<<2;
 var $2=_xmalloc($1);
 var $3=$2;
 var $4=($ncol|0)>0;
 if($4){label=2;break;}else{var $nsp_297=0;var $t_198=0;label=13;break;}
 case 2: 
 var $5=($nrow|0)>0;
 if($5){var $j_088_us=0;var $t_090_us=0;label=8;break;}else{var $j_088=0;label=9;break;}
 case 3: 
 var $7=((($21)+($t_090_us))|0);
 var $8=((($j_088_us)+(1))|0);
 var $9=($8|0)<($ncol|0);
 if($9){var $j_088_us=$8;var $t_090_us=$7;label=8;break;}else{var $t_0_lcssa=$7;label=10;break;}
 case 4: 
 var $11;
 var $i_084_us;
 var $12=(Math_imul($i_084_us,$ncol)|0);
 var $_sum77_us=((($12)+($j_088_us))|0);
 var $13=(($a+($_sum77_us<<2))|0);
 var $14=HEAP32[(($13)>>2)];
 var $15=($14|0)==0;
 if($15){var $21=$11;label=7;break;}else{label=5;break;}
 case 5: 
 var $17=_strlen($14);
 var $18=($17|0)>($11|0);
 if($18){label=6;break;}else{var $21=$11;label=7;break;}
 case 6: 
 HEAP32[(($24)>>2)]=$17;
 var $21=$17;label=7;break;
 case 7: 
 var $21;
 var $22=((($i_084_us)+(1))|0);
 var $23=($22|0)<($nrow|0);
 if($23){var $i_084_us=$22;var $11=$21;label=4;break;}else{label=3;break;}
 case 8: 
 var $t_090_us;
 var $j_088_us;
 var $24=(($3+($j_088_us<<2))|0);
 HEAP32[(($24)>>2)]=0;
 var $i_084_us=0;var $11=0;label=4;break;
 case 9: 
 var $j_088;
 var $26=(($3+($j_088<<2))|0);
 HEAP32[(($26)>>2)]=0;
 var $27=((($j_088)+(1))|0);
 var $28=($27|0)<($ncol|0);
 if($28){var $j_088=$27;label=9;break;}else{var $t_0_lcssa=0;label=10;break;}
 case 10: 
 var $t_0_lcssa;
 var $29=($ncol|0)>1;
 if($29){label=11;break;}else{var $t_1=$t_0_lcssa;var $nsp_2=0;label=12;break;}
 case 11: 
 var $31=(((80)-($t_0_lcssa))|0);
 var $32=((($ncol)-(1))|0);
 var $33=(((($31|0))/(($32|0)))&-1);
 var $34=($33|0)<2;
 var $_=($34?2:$33);
 var $35=($_|0)>5;
 var $nsp_1=($35?5:$_);
 var $36=(Math_imul($nsp_1,$32)|0);
 var $37=((($36)+($t_0_lcssa))|0);
 var $t_1=$37;var $nsp_2=$nsp_1;label=12;break;
 case 12: 
 var $nsp_2;
 var $t_1;
 var $39=($t_1|0)<80;
 if($39){var $nsp_297=$nsp_2;var $t_198=$t_1;label=13;break;}else{var $c_0=0;var $nsp_296=$nsp_2;var $t_199=$t_1;label=14;break;}
 case 13: 
 var $t_198;
 var $nsp_297;
 var $40=(((80)-($t_198))|0);
 var $41=(((($40|0))/(2))&-1);
 var $c_0=$41;var $nsp_296=$nsp_297;var $t_199=$t_198;label=14;break;
 case 14: 
 var $t_199;
 var $nsp_296;
 var $c_0;
 var $43=((($t_199)+(1))|0);
 var $44=((($43)+($c_0))|0);
 var $45=_xmalloc($44);
 _memset($45, 32, $c_0)|0;
 var $46=($nrow|0)>0;
 if($46){label=15;break;}else{label=27;break;}
 case 15: 
 var $47=(($45+$c_0)|0);
 if($4){var $i_180_us=0;label=25;break;}else{var $i_180=0;label=26;break;}
 case 16: 
 HEAP8[($b_2_us)]=0;
 _emit_line($45);
 var $49=((($i_180_us)+(1))|0);
 var $50=($49|0)<($nrow|0);
 if($50){var $i_180_us=$49;label=25;break;}else{label=27;break;}
 case 17: 
 var $b_079_us;
 var $j_178_us;
 var $52=($j_178_us|0)>0;
 if($52){label=18;break;}else{var $b_1_us=$b_079_us;label=19;break;}
 case 18: 
 _memset($b_079_us, 32, $nsp_296)|0;
 var $54=(($b_079_us+$nsp_296)|0);
 var $b_1_us=$54;label=19;break;
 case 19: 
 var $b_1_us;
 var $_sum_us=((($j_178_us)+($83))|0);
 var $56=(($a+($_sum_us<<2))|0);
 var $57=HEAP32[(($56)>>2)];
 var $58=($57|0)==0;
 if($58){label=23;break;}else{label=20;break;}
 case 20: 
 var $60=_strlen($57);
 var $61=(($3+($j_178_us<<2))|0);
 var $62=HEAP32[(($61)>>2)];
 var $63=((($62)-($60))|0);
 var $64=(($fmt+$j_178_us)|0);
 var $65=HEAP8[($64)];
 var $66=(($65<<24)>>24);
 if(($66|0)==1){ label=21;break;}else if(($66|0)==0){ label=22;break;}else{var $b_2_us=$b_1_us;label=24;break;}
 case 21: 
 var $68=_strcpy($b_1_us,$57);
 var $69=(($b_1_us+$60)|0);
 _memset($69, 32, $63)|0;
 var $70=(($b_1_us+$62)|0);
 var $b_2_us=$70;label=24;break;
 case 22: 
 _memset($b_1_us, 32, $63)|0;
 var $72=(($b_1_us+$63)|0);
 var $73=_strcpy($72,$57);
 var $74=(($b_1_us+$62)|0);
 var $b_2_us=$74;label=24;break;
 case 23: 
 var $76=(($3+($j_178_us<<2))|0);
 var $77=HEAP32[(($76)>>2)];
 _memset($b_1_us, 32, $77)|0;
 var $78=HEAP32[(($76)>>2)];
 var $79=(($b_1_us+$78)|0);
 var $b_2_us=$79;label=24;break;
 case 24: 
 var $b_2_us;
 var $81=((($j_178_us)+(1))|0);
 var $82=($81|0)<($ncol|0);
 if($82){var $j_178_us=$81;var $b_079_us=$b_2_us;label=17;break;}else{label=16;break;}
 case 25: 
 var $i_180_us;
 var $83=(Math_imul($i_180_us,$ncol)|0);
 var $j_178_us=0;var $b_079_us=$47;label=17;break;
 case 26: 
 var $i_180;
 HEAP8[($47)]=0;
 _emit_line($45);
 var $85=((($i_180)+(1))|0);
 var $86=($85|0)<($nrow|0);
 if($86){var $i_180=$85;label=26;break;}else{label=27;break;}
 case 27: 
 _free($45);
 _free($2);
 _emit_line(36040);
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _print_title(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP32[((6976)>>2)];
 var $2=($1|0)==0;
 if($2){label=3;break;}else{label=2;break;}
 case 2: 
 _emit_line_center($1);
 label=3;break;
 case 3: 
 var $5=HEAP32[((6968)>>2)];
 var $6=($5|0)==0;
 if($6){label=5;break;}else{label=4;break;}
 case 4: 
 _emit_line_center($5);
 label=5;break;
 case 5: 
 var $9=HEAP32[((6960)>>2)];
 var $10=($9|0)==0;
 if($10){label=7;break;}else{label=6;break;}
 case 6: 
 _emit_line_center($9);
 label=7;break;
 case 7: 
 var $13=HEAP32[((6952)>>2)];
 var $14=($13|0)==0;
 if($14){var $16=0;label=9;break;}else{label=8;break;}
 case 8: 
 _emit_line_center($13);
 var $_pre=HEAP32[((6952)>>2)];
 var $phitmp=($_pre|0)!=0;
 var $16=$phitmp;label=9;break;
 case 9: 
 var $16;
 var $17=HEAP32[((6976)>>2)];
 var $18=($17|0)!=0;
 var $19=HEAP32[((6968)>>2)];
 var $20=($19|0)!=0;
 var $or_cond=$18|$20;
 var $21=HEAP32[((6960)>>2)];
 var $22=($21|0)!=0;
 var $or_cond3=$or_cond|$22;
 var $or_cond5=$or_cond3|$16;
 if($or_cond5){label=10;break;}else{label=11;break;}
 case 10: 
 _emit_line(36040);
 label=11;break;
 case 11: 
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _proc_anova(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 HEAP32[((8984)>>2)]=0;
 label=2;break;
 case 2: 
 _scan();
 _keyword();
 var $1=HEAP32[((6944)>>2)];
 if(($1|0)==309){ label=3;break;}else if(($1|0)==59){ label=5;break;}else{label=4;break;}
 case 3: 
 _parse_data_option();
 label=2;break;
 case 4: 
 _expected(1152);
 label=2;break;
 case 5: 
 _scan();
 var $4=HEAP32[((14112)>>2)];
 var $5=($4|0)==0;
 if($5){label=6;break;}else{label=7;break;}
 case 6: 
 _stop(1464);
 label=7;break;
 case 7: 
 _parse_proc_anova_body();
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _parse_proc_anova_body(){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 label=2;break;
 case 2: 
 _keyword();
 var $1=HEAP32[((6944)>>2)];
 switch(($1|0)){case 305:{ label=2;break;}case 0:case 309:case 327:case 330:{ label=3;break;}case 321:{ label=4;break;}case 323:{ label=98;break;}default:{label=251;break;}}break;
 case 3: 
 STACKTOP=sp;return;
 case 4: 
 HEAPF64[((696)>>3)]=0.05;
 _scan();
 var $n_0_i=0;label=5;break;
 case 5: 
 var $n_0_i;
 var $5=HEAP32[((6944)>>2)];
 if(($5|0)==47){ label=25;break;}else if(($5|0)==59){ var $lsd_2_i=0;var $ttest_2_i=0;label=31;break;}else if(($5|0)==1001){ label=7;break;}else{label=6;break;}
 case 6: 
 _expected(2832);
 label=7;break;
 case 7: 
 var $8=_strlen(6984);
 var $9=((($8)+(1))|0);
 var $10=($9>>>0)>1000;
 if($10){label=8;break;}else{label=9;break;}
 case 8: 
 _stop(1704);
 label=9;break;
 case 9: 
 var $13=_strcpy(24920,6984);
 _scan();
 var $14=HEAP32[((6944)>>2)];
 var $15=($14|0)==42;
 if($15){label=10;break;}else{label=15;break;}
 case 10: 
 _scan();
 var $16=HEAP32[((6944)>>2)];
 var $17=($16|0)==1001;
 if($17){label=12;break;}else{label=11;break;}
 case 11: 
 _expected(2832);
 label=12;break;
 case 12: 
 var $20=_strlen(24920);
 var $21=_strlen(6984);
 var $22=((($20)+(2))|0);
 var $23=((($22)+($21))|0);
 var $24=($23>>>0)>1000;
 if($24){label=13;break;}else{label=14;break;}
 case 13: 
 _stop(1704);
 label=14;break;
 case 14: 
 var $strlen_i_i=_strlen(24920);
 var $endptr_i_i=((24920+$strlen_i_i)|0);
 var $27=$endptr_i_i;
 tempBigInt=42;HEAP8[($27)]=tempBigInt&0xff;tempBigInt = tempBigInt>>8;HEAP8[((($27)+(1))|0)]=tempBigInt&0xff;
 var $28=_strcat(24920,6984);
 _scan();
 var $29=HEAP32[((6944)>>2)];
 var $30=($29|0)==42;
 if($30){label=10;break;}else{label=15;break;}
 case 15: 
 var $31=HEAP32[((14112)>>2)];
 var $32=(($31+8)|0);
 var $33=HEAP32[(($32)>>2)];
 var $i_0_i=0;label=16;break;
 case 16: 
 var $i_0_i;
 var $34=($i_0_i|0)<($33|0);
 if($34){label=17;break;}else{label=18;break;}
 case 17: 
 var $36=(($31+20+((($i_0_i)*(24))&-1))|0);
 var $37=HEAP32[(($36)>>2)];
 var $38=_strcmp($37,24920);
 var $39=($38|0)==0;
 var $40=((($i_0_i)+(1))|0);
 if($39){label=18;break;}else{var $i_0_i=$40;label=16;break;}
 case 18: 
 var $42=($i_0_i|0)==($33|0);
 if($42){label=19;break;}else{var $45=$31;label=20;break;}
 case 19: 
 _stop(1784);
 var $_pre_i=HEAP32[((14112)>>2)];
 var $45=$_pre_i;label=20;break;
 case 20: 
 var $45;
 var $46=(($45+20+((($i_0_i)*(24))&-1)+12)|0);
 var $47=HEAP32[(($46)>>2)];
 var $48=($47|0)==0;
 if($48){label=21;break;}else{label=22;break;}
 case 21: 
 _stop(1760);
 label=22;break;
 case 22: 
 var $51=($n_0_i|0)==100;
 if($51){label=23;break;}else{label=24;break;}
 case 23: 
 _stop(1704);
 label=24;break;
 case 24: 
 var $54=((($n_0_i)+(1))|0);
 var $55=((10632+($n_0_i<<2))|0);
 HEAP32[(($55)>>2)]=$i_0_i;
 var $n_0_i=$54;label=5;break;
 case 25: 
 _scan();
 var $57=HEAP32[((6944)>>2)];
 var $58=($57|0)==59;
 if($58){var $lsd_2_i=0;var $ttest_2_i=0;label=31;break;}else{var $ttest_034_i=0;var $lsd_035_i=0;label=26;break;}
 case 26: 
 var $lsd_035_i;
 var $ttest_034_i;
 _keyword();
 var $59=HEAP32[((6944)>>2)];
 if(($59|0)==301){ label=27;break;}else if(($59|0)==341){ label=28;break;}else if(($59|0)==336|($59|0)==317){ var $lsd_1_i=1;var $ttest_1_i=$ttest_034_i;label=30;break;}else{label=29;break;}
 case 27: 
 _parse_alpha_option();
 var $lsd_1_i=$lsd_035_i;var $ttest_1_i=$ttest_034_i;label=30;break;
 case 28: 
 var $lsd_1_i=$lsd_035_i;var $ttest_1_i=1;label=30;break;
 case 29: 
 _expected(1656);
 var $lsd_1_i=$lsd_035_i;var $ttest_1_i=$ttest_034_i;label=30;break;
 case 30: 
 var $ttest_1_i;
 var $lsd_1_i;
 _scan();
 var $64=HEAP32[((6944)>>2)];
 var $65=($64|0)==59;
 if($65){var $lsd_2_i=$lsd_1_i;var $ttest_2_i=$ttest_1_i;label=31;break;}else{var $ttest_034_i=$ttest_1_i;var $lsd_035_i=$lsd_1_i;label=26;break;}
 case 31: 
 var $ttest_2_i;
 var $lsd_2_i;
 _scan();
 var $66=($n_0_i|0)>0;
 if($66){label=32;break;}else{label=2;break;}
 case 32: 
 var $67=($lsd_2_i|0)==0;
 var $68=($ttest_2_i|0)==0;
 var $i_133_i=0;label=33;break;
 case 33: 
 var $i_133_i;
 var $70=((10632+($i_133_i<<2))|0);
 var $71=HEAP32[(($70)>>2)];
 var $72=HEAP32[((14112)>>2)];
 var $73=(($72+20+((($71)*(24))&-1)+8)|0);
 var $74=HEAP32[(($73)>>2)];
 var $75=($74|0)>100;
 if($75){label=34;break;}else{label=35;break;}
 case 34: 
 _stop(1184);
 var $_pre51_pre_i=HEAP32[((14112)>>2)];
 var $_pre51_i=$_pre51_pre_i;label=36;break;
 case 35: 
 var $76=($74|0)>0;
 if($76){var $_pre51_i=$72;label=36;break;}else{var $80=0;var $79=$72;label=37;break;}
 case 36: 
 var $_pre51_i;
 var $77=$74<<3;
 _memset(9160, 0, $77)|0;
 _memset(5728, 0, $77)|0;
 var $78=$74<<2;
 _memset(14120, 0, $78)|0;
 var $80=1;var $79=$_pre51_i;label=37;break;
 case 37: 
 var $79;
 var $80;
 var $81=(($79+12)|0);
 var $82=HEAP32[(($81)>>2)];
 var $83=($82|0)>0;
 if($83){label=38;break;}else{label=39;break;}
 case 38: 
 var $_pre_i_i=HEAP32[((9152)>>2)];
 var $84=(($79+20+((($71)*(24))&-1)+20)|0);
 var $i_127_i_i=0;var $86=$82;label=40;break;
 case 39: 
 if($80){var $i_225_i_i=0;label=43;break;}else{label=44;break;}
 case 40: 
 var $86;
 var $i_127_i_i;
 var $87=(($_pre_i_i+($i_127_i_i<<2))|0);
 var $88=HEAP32[(($87)>>2)];
 var $89=($88|0)==0;
 if($89){label=41;break;}else{var $115=$86;label=42;break;}
 case 41: 
 var $91=HEAP32[((4120)>>2)];
 var $92=(($79+20+((($91)*(24))&-1)+20)|0);
 var $93=HEAP32[(($92)>>2)];
 var $94=(($93+($i_127_i_i<<3))|0);
 var $95=HEAPF64[(($94)>>3)];
 var $ld$0$0=(($94)|0);
 var $95$$SHADOW$0=HEAP32[(($ld$0$0)>>2)];
 var $ld$1$1=(($94+4)|0);
 var $95$$SHADOW$1=HEAP32[(($ld$1$1)>>2)];
 var $96=HEAP32[(($84)>>2)];
 var $97=(($96+($i_127_i_i<<3))|0);
 var $98=HEAPF64[(($97)>>3)];
 var $ld$2$0=(($97)|0);
 var $98$$SHADOW$0=HEAP32[(($ld$2$0)>>2)];
 var $ld$3$1=(($97+4)|0);
 var $98$$SHADOW$1=HEAP32[(($ld$3$1)>>2)];
 var $99=(($98)&-1);
 var $100=((14120+($99<<2))|0);
 var $101=HEAP32[(($100)>>2)];
 var $102=((($101)+(1))|0);
 HEAP32[(($100)>>2)]=$102;
 var $103=((9160+($99<<3))|0);
 var $104=HEAPF64[(($103)>>3)];
 var $ld$4$0=(($103)|0);
 var $104$$SHADOW$0=HEAP32[(($ld$4$0)>>2)];
 var $ld$5$1=(($103+4)|0);
 var $104$$SHADOW$1=HEAP32[(($ld$5$1)>>2)];
 var $105=($95)-($104);
 var $106=($102|0);
 var $107=($105)/($106);
 var $108=($104)+($107);
 HEAPF64[(($103)>>3)]=$108;
 var $109=($95)-($108);
 var $110=($105)*($109);
 var $111=((5728+($99<<3))|0);
 var $112=HEAPF64[(($111)>>3)];
 var $ld$6$0=(($111)|0);
 var $112$$SHADOW$0=HEAP32[(($ld$6$0)>>2)];
 var $ld$7$1=(($111+4)|0);
 var $112$$SHADOW$1=HEAP32[(($ld$7$1)>>2)];
 var $113=($112)+($110);
 HEAPF64[(($111)>>3)]=$113;
 var $_pre32_i_i=HEAP32[(($81)>>2)];
 var $115=$_pre32_i_i;label=42;break;
 case 42: 
 var $115;
 var $116=((($i_127_i_i)+(1))|0);
 var $117=($116|0)<($115|0);
 if($117){var $i_127_i_i=$116;var $86=$115;label=40;break;}else{label=39;break;}
 case 43: 
 var $i_225_i_i;
 var $118=((14120+($i_225_i_i<<2))|0);
 var $119=HEAP32[(($118)>>2)];
 var $120=((($119)-(1))|0);
 var $121=($120|0);
 var $122=((5728+($i_225_i_i<<3))|0);
 var $123=HEAPF64[(($122)>>3)];
 var $ld$8$0=(($122)|0);
 var $123$$SHADOW$0=HEAP32[(($ld$8$0)>>2)];
 var $ld$9$1=(($122+4)|0);
 var $123$$SHADOW$1=HEAP32[(($ld$9$1)>>2)];
 var $124=($123)/($121);
 HEAPF64[(($122)>>3)]=$124;
 var $125=((($i_225_i_i)+(1))|0);
 var $126=($125|0)<($74|0);
 if($126){var $i_225_i_i=$125;label=43;break;}else{label=44;break;}
 case 44: 
 var $127=HEAPF64[((696)>>3)];
 var $ld$10$0=696;
 var $127$$SHADOW$0=HEAP32[(($ld$10$0)>>2)];
 var $ld$11$1=700;
 var $127$$SHADOW$1=HEAP32[(($ld$11$1)>>2)];
 var $128=($127)*((0.5));
 var $129=(1)-($128);
 var $130=HEAPF64[((664)>>3)];
 var $ld$12$0=664;
 var $130$$SHADOW$0=HEAP32[(($ld$12$0)>>2)];
 var $ld$13$1=668;
 var $130$$SHADOW$1=HEAP32[(($ld$13$1)>>2)];
 var $131=_qt($129,$130);
 _emit_line_center(1256);
 _emit_line(36048);
 var $132=HEAP32[((14112)>>2)];
 var $133=(($132+20+((($71)*(24))&-1))|0);
 var $134=HEAP32[(($133)>>2)];
 var $135=HEAP8[($134)];
 var $136=(($135<<24)>>24)==0;
 if($136){var $m_0_lcssa_i_i=0;label=46;break;}else{var $m_0133_i_i=0;var $s_0134_i_i=$134;var $137=$135;label=45;break;}
 case 45: 
 var $137;
 var $s_0134_i_i;
 var $m_0133_i_i;
 var $138=(($s_0134_i_i+1)|0);
 var $139=(($137<<24)>>24)==42;
 var $140=($139&1);
 var $_m_0_i_i=((($140)+($m_0133_i_i))|0);
 var $141=HEAP8[($138)];
 var $142=(($141<<24)>>24)==0;
 if($142){var $m_0_lcssa_i_i=$_m_0_i_i;label=46;break;}else{var $m_0133_i_i=$_m_0_i_i;var $s_0134_i_i=$138;var $137=$141;label=45;break;}
 case 46: 
 var $m_0_lcssa_i_i;
 var $143=(($132+20+((($71)*(24))&-1)+8)|0);
 var $144=HEAP32[(($143)>>2)];
 var $145=((($m_0_lcssa_i_i)+(5))|0);
 var $146=((($144)+(1))|0);
 var $147=$145<<2;
 var $148=(Math_imul($147,$146)|0);
 var $149=_xmalloc($148);
 var $150=$149;
 var $151=((($m_0_lcssa_i_i)+(1))|0);
 var $152=($151|0)>0;
 if($152){label=47;break;}else{label=51;break;}
 case 47: 
 var $153=HEAP32[((14112)>>2)];
 var $154=(($153+20+((($71)*(24))&-1))|0);
 var $155=HEAP32[(($154)>>2)];
 var $i_0129_i_i=0;var $s_1130_i_i=$155;label=48;break;
 case 48: 
 var $s_1130_i_i;
 var $i_0129_i_i;
 var $156=HEAP8[($s_1130_i_i)];
 var $157=(($156<<24)>>24)==0;
 var $158=(($156<<24)>>24)!=42;
 var $not_98119_i_i=$157^1;
 var $_120_i_i=$158&$not_98119_i_i;
 var $159=(($s_1130_i_i+1)|0);
 if($_120_i_i){var $b_0121_i_i=24920;var $161=$156;var $160=$159;label=49;break;}else{var $b_0_lcssa_i_i=24920;var $s_2_lcssa_i_i=$s_1130_i_i;var $_lcssa117_i_i=$157;var $_lcssa118_i_i=$159;label=50;break;}
 case 49: 
 var $160;
 var $161;
 var $b_0121_i_i;
 var $162=(($b_0121_i_i+1)|0);
 HEAP8[($b_0121_i_i)]=$161;
 var $163=HEAP8[($160)];
 var $164=(($163<<24)>>24)==0;
 var $165=(($163<<24)>>24)!=42;
 var $not_98_i_i=$164^1;
 var $__i_i=$165&$not_98_i_i;
 var $166=(($160+1)|0);
 if($__i_i){var $b_0121_i_i=$162;var $161=$163;var $160=$166;label=49;break;}else{var $b_0_lcssa_i_i=$162;var $s_2_lcssa_i_i=$160;var $_lcssa117_i_i=$164;var $_lcssa118_i_i=$166;label=50;break;}
 case 50: 
 var $_lcssa118_i_i;
 var $_lcssa117_i_i;
 var $s_2_lcssa_i_i;
 var $b_0_lcssa_i_i;
 var $s_2__i_i=($_lcssa117_i_i?$s_2_lcssa_i_i:$_lcssa118_i_i);
 HEAP8[($b_0_lcssa_i_i)]=0;
 var $167=_strdup(24920);
 var $168=(($150+($i_0129_i_i<<2))|0);
 HEAP32[(($168)>>2)]=$167;
 var $169=((($i_0129_i_i)+(1))|0);
 var $170=($169|0)<($151|0);
 if($170){var $i_0129_i_i=$169;var $s_1130_i_i=$s_2__i_i;label=48;break;}else{label=51;break;}
 case 51: 
 var $171=_strdup(1248);
 var $172=(($150+($151<<2))|0);
 HEAP32[(($172)>>2)]=$171;
 var $173=HEAP32[((4120)>>2)];
 var $174=HEAP32[((14112)>>2)];
 var $175=(($174+20+((($173)*(24))&-1))|0);
 var $176=HEAP32[(($175)>>2)];
 var $177=_sprintf(24920,1208,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$176,tempVarArgs)); STACKTOP=tempVarArgs;
 var $178=_strdup(24920);
 var $179=((($m_0_lcssa_i_i)+(2))|0);
 var $180=(($150+($179<<2))|0);
 HEAP32[(($180)>>2)]=$178;
 var $181=HEAPF64[((696)>>3)];
 var $ld$14$0=696;
 var $181$$SHADOW$0=HEAP32[(($ld$14$0)>>2)];
 var $ld$15$1=700;
 var $181$$SHADOW$1=HEAP32[(($ld$15$1)>>2)];
 var $182=(1)-($181);
 var $183=($182)*(100);
 var $184=_sprintf(24920,1528,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$183,tempVarArgs)); STACKTOP=tempVarArgs;
 var $185=_strdup(24920);
 var $186=((($m_0_lcssa_i_i)+(3))|0);
 var $187=(($150+($186<<2))|0);
 HEAP32[(($187)>>2)]=$185;
 var $188=HEAPF64[((696)>>3)];
 var $ld$16$0=696;
 var $188$$SHADOW$0=HEAP32[(($ld$16$0)>>2)];
 var $ld$17$1=700;
 var $188$$SHADOW$1=HEAP32[(($ld$17$1)>>2)];
 var $189=(1)-($188);
 var $190=($189)*(100);
 var $191=_sprintf(24920,1480,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$190,tempVarArgs)); STACKTOP=tempVarArgs;
 var $192=_strdup(24920);
 var $193=((($m_0_lcssa_i_i)+(4))|0);
 var $194=(($150+($193<<2))|0);
 HEAP32[(($194)>>2)]=$192;
 var $195=($144|0)>0;
 if($195){label=52;break;}else{label=61;break;}
 case 52: 
 if($152){var $i_1113_us_i_i=0;label=59;break;}else{var $i_1113_i_i=0;label=63;break;}
 case 53: 
 var $197=((14120+($i_1113_us_i_i<<2))|0);
 var $198=HEAP32[(($197)>>2)];
 var $199=_sprintf(24920,4048,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$198,tempVarArgs)); STACKTOP=tempVarArgs;
 var $200=_strdup(24920);
 var $_sum_us_i_i=((($254)+($151))|0);
 var $201=(($150+($_sum_us_i_i<<2))|0);
 HEAP32[(($201)>>2)]=$200;
 var $202=HEAP32[(($197)>>2)];
 var $203=($202|0)<1;
 if($203){label=55;break;}else{label=54;break;}
 case 54: 
 var $205=((9160+($i_1113_us_i_i<<3))|0);
 var $206=HEAPF64[(($205)>>3)];
 var $ld$18$0=(($205)|0);
 var $206$$SHADOW$0=HEAP32[(($ld$18$0)>>2)];
 var $ld$19$1=(($205+4)|0);
 var $206$$SHADOW$1=HEAP32[(($ld$19$1)>>2)];
 var $207=_sprintf(24920,3152,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$206,tempVarArgs)); STACKTOP=tempVarArgs;
 var $208=_strdup(24920);
 var $_sum90_us_i_i=((($254)+($179))|0);
 var $209=(($150+($_sum90_us_i_i<<2))|0);
 HEAP32[(($209)>>2)]=$208;
 var $210=HEAPF64[((224)>>3)];
 var $ld$20$0=224;
 var $210$$SHADOW$0=HEAP32[(($ld$20$0)>>2)];
 var $ld$21$1=228;
 var $210$$SHADOW$1=HEAP32[(($ld$21$1)>>2)];
 var $211=HEAP32[(($197)>>2)];
 var $212=($211|0);
 var $213=($210)/($212);
 var $214=Math_sqrt($213);
 var $215=($131)*($214);
 var $216=HEAPF64[(($205)>>3)];
 var $ld$22$0=(($205)|0);
 var $216$$SHADOW$0=HEAP32[(($ld$22$0)>>2)];
 var $ld$23$1=(($205+4)|0);
 var $216$$SHADOW$1=HEAP32[(($ld$23$1)>>2)];
 var $217=($216)-($215);
 var $218=_sprintf(24920,3152,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$217,tempVarArgs)); STACKTOP=tempVarArgs;
 var $219=_strdup(24920);
 var $_sum91_us_i_i=((($254)+($186))|0);
 var $220=(($150+($_sum91_us_i_i<<2))|0);
 HEAP32[(($220)>>2)]=$219;
 var $221=HEAPF64[(($205)>>3)];
 var $ld$24$0=(($205)|0);
 var $221$$SHADOW$0=HEAP32[(($ld$24$0)>>2)];
 var $ld$25$1=(($205+4)|0);
 var $221$$SHADOW$1=HEAP32[(($ld$25$1)>>2)];
 var $222=($215)+($221);
 var $223=_sprintf(24920,3152,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$222,tempVarArgs)); STACKTOP=tempVarArgs;
 var $224=_strdup(24920);
 var $_sum92_us_i_i=((($254)+($193))|0);
 var $225=(($150+($_sum92_us_i_i<<2))|0);
 HEAP32[(($225)>>2)]=$224;
 label=60;break;
 case 55: 
 var $227=_strdup(3912);
 var $_sum93_us_i_i=((($254)+($179))|0);
 var $228=(($150+($_sum93_us_i_i<<2))|0);
 HEAP32[(($228)>>2)]=$227;
 var $229=_strdup(3912);
 var $_sum94_us_i_i=((($254)+($186))|0);
 var $230=(($150+($_sum94_us_i_i<<2))|0);
 HEAP32[(($230)>>2)]=$229;
 var $231=_strdup(3912);
 var $_sum95_us_i_i=((($254)+($193))|0);
 var $232=(($150+($_sum95_us_i_i<<2))|0);
 HEAP32[(($232)>>2)]=$231;
 label=60;break;
 case 56: 
 var $_lcssa101_us_i_i;
 var $_lcssa_us_i_i;
 var $s_5_lcssa_us_i_i;
 var $b_1_lcssa_us_i_i;
 var $s_5__us_i_i=($_lcssa_us_i_i?$s_5_lcssa_us_i_i:$_lcssa101_us_i_i);
 HEAP8[($b_1_lcssa_us_i_i)]=0;
 var $233=_strdup(24920);
 var $_sum96_us_i_i=((($j_0110_us_i_i)+($254))|0);
 var $234=(($150+($_sum96_us_i_i<<2))|0);
 HEAP32[(($234)>>2)]=$233;
 var $235=((($j_0110_us_i_i)+(1))|0);
 var $236=($235|0)<($151|0);
 if($236){var $j_0110_us_i_i=$235;var $s_4111_us_i_i=$s_5__us_i_i;label=58;break;}else{label=53;break;}
 case 57: 
 var $237;
 var $238;
 var $b_1104_us_i_i;
 var $239=(($b_1104_us_i_i+1)|0);
 HEAP8[($b_1104_us_i_i)]=$238;
 var $240=HEAP8[($237)];
 var $241=(($240<<24)>>24)==0;
 var $242=(($240<<24)>>24)!=42;
 var $not__us_i_i=$241^1;
 var $_97_us_i_i=$242&$not__us_i_i;
 var $243=(($237+1)|0);
 if($_97_us_i_i){var $b_1104_us_i_i=$239;var $238=$240;var $237=$243;label=57;break;}else{var $b_1_lcssa_us_i_i=$239;var $s_5_lcssa_us_i_i=$237;var $_lcssa_us_i_i=$241;var $_lcssa101_us_i_i=$243;label=56;break;}
 case 58: 
 var $s_4111_us_i_i;
 var $j_0110_us_i_i;
 var $244=HEAP8[($s_4111_us_i_i)];
 var $245=(($244<<24)>>24)==0;
 var $246=(($244<<24)>>24)!=42;
 var $not_102_us_i_i=$245^1;
 var $_97103_us_i_i=$246&$not_102_us_i_i;
 var $247=(($s_4111_us_i_i+1)|0);
 if($_97103_us_i_i){var $b_1104_us_i_i=24920;var $238=$244;var $237=$247;label=57;break;}else{var $b_1_lcssa_us_i_i=24920;var $s_5_lcssa_us_i_i=$s_4111_us_i_i;var $_lcssa_us_i_i=$245;var $_lcssa101_us_i_i=$247;label=56;break;}
 case 59: 
 var $i_1113_us_i_i;
 var $248=HEAP32[((14112)>>2)];
 var $249=(($248+20+((($71)*(24))&-1)+12)|0);
 var $250=HEAP32[(($249)>>2)];
 var $251=(($250+($i_1113_us_i_i<<2))|0);
 var $252=HEAP32[(($251)>>2)];
 var $253=((($i_1113_us_i_i)+(1))|0);
 var $254=(Math_imul($253,$145)|0);
 var $j_0110_us_i_i=0;var $s_4111_us_i_i=$252;label=58;break;
 case 60: 
 var $255=($253|0)<($144|0);
 if($255){var $i_1113_us_i_i=$253;label=59;break;}else{label=61;break;}
 case 61: 
 if($152){label=62;break;}else{label=67;break;}
 case 62: 
 _memset(24920, 1, $151)|0;
 label=67;break;
 case 63: 
 var $i_1113_i_i;
 var $256=((14120+($i_1113_i_i<<2))|0);
 var $257=HEAP32[(($256)>>2)];
 var $258=_sprintf(24920,4048,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$257,tempVarArgs)); STACKTOP=tempVarArgs;
 var $259=_strdup(24920);
 var $260=((($i_1113_i_i)+(1))|0);
 var $261=(Math_imul($260,$145)|0);
 var $_sum_i_i=((($261)+($151))|0);
 var $262=(($150+($_sum_i_i<<2))|0);
 HEAP32[(($262)>>2)]=$259;
 var $263=HEAP32[(($256)>>2)];
 var $264=($263|0)<1;
 if($264){label=64;break;}else{label=65;break;}
 case 64: 
 var $266=_strdup(3912);
 var $_sum93_i_i=((($261)+($179))|0);
 var $267=(($150+($_sum93_i_i<<2))|0);
 HEAP32[(($267)>>2)]=$266;
 var $268=_strdup(3912);
 var $_sum94_i_i=((($261)+($186))|0);
 var $269=(($150+($_sum94_i_i<<2))|0);
 HEAP32[(($269)>>2)]=$268;
 var $270=_strdup(3912);
 var $_sum95_i_i=((($261)+($193))|0);
 var $271=(($150+($_sum95_i_i<<2))|0);
 HEAP32[(($271)>>2)]=$270;
 label=66;break;
 case 65: 
 var $273=((9160+($i_1113_i_i<<3))|0);
 var $274=HEAPF64[(($273)>>3)];
 var $ld$26$0=(($273)|0);
 var $274$$SHADOW$0=HEAP32[(($ld$26$0)>>2)];
 var $ld$27$1=(($273+4)|0);
 var $274$$SHADOW$1=HEAP32[(($ld$27$1)>>2)];
 var $275=_sprintf(24920,3152,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$274,tempVarArgs)); STACKTOP=tempVarArgs;
 var $276=_strdup(24920);
 var $_sum90_i_i=((($261)+($179))|0);
 var $277=(($150+($_sum90_i_i<<2))|0);
 HEAP32[(($277)>>2)]=$276;
 var $278=HEAPF64[((224)>>3)];
 var $ld$28$0=224;
 var $278$$SHADOW$0=HEAP32[(($ld$28$0)>>2)];
 var $ld$29$1=228;
 var $278$$SHADOW$1=HEAP32[(($ld$29$1)>>2)];
 var $279=HEAP32[(($256)>>2)];
 var $280=($279|0);
 var $281=($278)/($280);
 var $282=Math_sqrt($281);
 var $283=($131)*($282);
 var $284=HEAPF64[(($273)>>3)];
 var $ld$30$0=(($273)|0);
 var $284$$SHADOW$0=HEAP32[(($ld$30$0)>>2)];
 var $ld$31$1=(($273+4)|0);
 var $284$$SHADOW$1=HEAP32[(($ld$31$1)>>2)];
 var $285=($284)-($283);
 var $286=_sprintf(24920,3152,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$285,tempVarArgs)); STACKTOP=tempVarArgs;
 var $287=_strdup(24920);
 var $_sum91_i_i=((($261)+($186))|0);
 var $288=(($150+($_sum91_i_i<<2))|0);
 HEAP32[(($288)>>2)]=$287;
 var $289=HEAPF64[(($273)>>3)];
 var $ld$32$0=(($273)|0);
 var $289$$SHADOW$0=HEAP32[(($ld$32$0)>>2)];
 var $ld$33$1=(($273+4)|0);
 var $289$$SHADOW$1=HEAP32[(($ld$33$1)>>2)];
 var $290=($283)+($289);
 var $291=_sprintf(24920,3152,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$290,tempVarArgs)); STACKTOP=tempVarArgs;
 var $292=_strdup(24920);
 var $_sum92_i_i=((($261)+($193))|0);
 var $293=(($150+($_sum92_i_i<<2))|0);
 HEAP32[(($293)>>2)]=$292;
 label=66;break;
 case 66: 
 var $294=($260|0)<($144|0);
 if($294){var $i_1113_i_i=$260;label=63;break;}else{label=61;break;}
 case 67: 
 var $295=((24920+$151)|0);
 HEAP8[($295)]=0;
 var $296=((24920+$179)|0);
 HEAP8[($296)]=0;
 var $297=((24920+$186)|0);
 HEAP8[($297)]=0;
 var $298=((24920+$193)|0);
 HEAP8[($298)]=0;
 _print_table_and_free($150,$146,$145,24920);
 if($67){label=81;break;}else{label=68;break;}
 case 68: 
 _emit_line_center(1312);
 _emit_line(36048);
 var $300=HEAPF64[((696)>>3)];
 var $ld$34$0=696;
 var $300$$SHADOW$0=HEAP32[(($ld$34$0)>>2)];
 var $ld$35$1=700;
 var $300$$SHADOW$1=HEAP32[(($ld$35$1)>>2)];
 var $301=($300)*((0.5));
 var $302=(1)-($301);
 var $303=HEAPF64[((664)>>3)];
 var $ld$36$0=664;
 var $303$$SHADOW$0=HEAP32[(($ld$36$0)>>2)];
 var $ld$37$1=668;
 var $303$$SHADOW$1=HEAP32[(($ld$37$1)>>2)];
 var $304=_qt($302,$303);
 var $305=HEAP32[((14112)>>2)];
 var $306=(($305+20+((($71)*(24))&-1)+8)|0);
 var $307=HEAP32[(($306)>>2)];
 var $308=((($307)-(1))|0);
 var $309=(Math_imul($308,$307)|0);
 var $310=((($309)+(1))|0);
 var $311=((($310)*(28))&-1);
 var $312=_xmalloc($311);
 var $313=$312;
 var $314=HEAP32[((14112)>>2)];
 var $315=(($314+20+((($71)*(24))&-1))|0);
 var $316=HEAP32[(($315)>>2)];
 var $317=_strdup($316);
 HEAP32[(($313)>>2)]=$317;
 var $318=_strdup($316);
 var $319=(($312+4)|0);
 var $320=$319;
 HEAP32[(($320)>>2)]=$318;
 var $321=HEAP32[((4120)>>2)];
 var $322=HEAP32[((14112)>>2)];
 var $323=(($322+20+((($321)*(24))&-1))|0);
 var $324=HEAP32[(($323)>>2)];
 var $325=_sprintf(24920,1592,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$324,tempVarArgs)); STACKTOP=tempVarArgs;
 var $326=_strdup(24920);
 var $327=(($312+8)|0);
 var $328=$327;
 HEAP32[(($328)>>2)]=$326;
 var $329=HEAPF64[((696)>>3)];
 var $ld$38$0=696;
 var $329$$SHADOW$0=HEAP32[(($ld$38$0)>>2)];
 var $ld$39$1=700;
 var $329$$SHADOW$1=HEAP32[(($ld$39$1)>>2)];
 var $330=(1)-($329);
 var $331=($330)*(100);
 var $332=_sprintf(24920,1528,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$331,tempVarArgs)); STACKTOP=tempVarArgs;
 var $333=_strdup(24920);
 var $334=(($312+12)|0);
 var $335=$334;
 HEAP32[(($335)>>2)]=$333;
 var $336=HEAPF64[((696)>>3)];
 var $ld$40$0=696;
 var $336$$SHADOW$0=HEAP32[(($ld$40$0)>>2)];
 var $ld$41$1=700;
 var $336$$SHADOW$1=HEAP32[(($ld$41$1)>>2)];
 var $337=(1)-($336);
 var $338=($337)*(100);
 var $339=_sprintf(24920,1480,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$338,tempVarArgs)); STACKTOP=tempVarArgs;
 var $340=_strdup(24920);
 var $341=(($312+16)|0);
 var $342=$341;
 HEAP32[(($342)>>2)]=$340;
 var $343=_strdup(1448);
 var $344=(($312+20)|0);
 var $345=$344;
 HEAP32[(($345)>>2)]=$343;
 var $346=_strdup(1424);
 var $347=(($312+24)|0);
 var $348=$347;
 HEAP32[(($348)>>2)]=$346;
 var $349=($307|0)>0;
 if($349){var $k_093_i_i=0;var $i_094_i_i=0;label=69;break;}else{label=80;break;}
 case 69: 
 var $i_094_i_i;
 var $k_093_i_i;
 var $350=((14120+($i_094_i_i<<2))|0);
 var $351=((9160+($i_094_i_i<<3))|0);
 var $k_191_i_i=$k_093_i_i;var $j_092_i_i=0;label=70;break;
 case 70: 
 var $j_092_i_i;
 var $k_191_i_i;
 var $353=($i_094_i_i|0)==($j_092_i_i|0);
 if($353){var $k_2_i_i=$k_191_i_i;label=78;break;}else{label=71;break;}
 case 71: 
 var $355=((($k_191_i_i)+(1))|0);
 var $356=HEAP32[((14112)>>2)];
 var $357=(($356+20+((($71)*(24))&-1)+12)|0);
 var $358=HEAP32[(($357)>>2)];
 var $359=(($358+($i_094_i_i<<2))|0);
 var $360=HEAP32[(($359)>>2)];
 var $361=_strdup($360);
 var $362=((($355)*(7))&-1);
 var $363=(($313+($362<<2))|0);
 HEAP32[(($363)>>2)]=$361;
 var $364=HEAP32[((14112)>>2)];
 var $365=(($364+20+((($71)*(24))&-1)+12)|0);
 var $366=HEAP32[(($365)>>2)];
 var $367=(($366+($j_092_i_i<<2))|0);
 var $368=HEAP32[(($367)>>2)];
 var $369=_strdup($368);
 var $_sum_i19_i=((($362)+(1))|0);
 var $370=(($313+($_sum_i19_i<<2))|0);
 HEAP32[(($370)>>2)]=$369;
 var $371=HEAP32[(($350)>>2)];
 var $372=($371|0)==0;
 if($372){label=73;break;}else{label=72;break;}
 case 72: 
 var $374=((14120+($j_092_i_i<<2))|0);
 var $375=HEAP32[(($374)>>2)];
 var $376=($375|0)==0;
 if($376){label=73;break;}else{label=74;break;}
 case 73: 
 var $378=_strdup(3912);
 var $_sum86_i_i=((($362)+(2))|0);
 var $379=(($313+($_sum86_i_i<<2))|0);
 HEAP32[(($379)>>2)]=$378;
 var $380=_strdup(3912);
 var $_sum87_i_i=((($362)+(3))|0);
 var $381=(($313+($_sum87_i_i<<2))|0);
 HEAP32[(($381)>>2)]=$380;
 var $382=_strdup(3912);
 var $_sum88_i_i=((($362)+(4))|0);
 var $383=(($313+($_sum88_i_i<<2))|0);
 HEAP32[(($383)>>2)]=$382;
 var $384=_strdup(3912);
 var $_sum89_i_i=((($362)+(5))|0);
 var $385=(($313+($_sum89_i_i<<2))|0);
 HEAP32[(($385)>>2)]=$384;
 var $386=_strdup(1408);
 var $_sum90_i20_i=((($362)+(6))|0);
 var $387=(($313+($_sum90_i20_i<<2))|0);
 HEAP32[(($387)>>2)]=$386;
 var $k_2_i_i=$355;label=78;break;
 case 74: 
 var $389=HEAPF64[(($351)>>3)];
 var $ld$42$0=(($351)|0);
 var $389$$SHADOW$0=HEAP32[(($ld$42$0)>>2)];
 var $ld$43$1=(($351+4)|0);
 var $389$$SHADOW$1=HEAP32[(($ld$43$1)>>2)];
 var $390=((9160+($j_092_i_i<<3))|0);
 var $391=HEAPF64[(($390)>>3)];
 var $ld$44$0=(($390)|0);
 var $391$$SHADOW$0=HEAP32[(($ld$44$0)>>2)];
 var $ld$45$1=(($390+4)|0);
 var $391$$SHADOW$1=HEAP32[(($ld$45$1)>>2)];
 var $392=($389)-($391);
 var $393=_sprintf(24920,3152,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$392,tempVarArgs)); STACKTOP=tempVarArgs;
 var $394=_strdup(24920);
 var $_sum81_i_i=((($362)+(2))|0);
 var $395=(($313+($_sum81_i_i<<2))|0);
 HEAP32[(($395)>>2)]=$394;
 var $396=HEAPF64[((224)>>3)];
 var $ld$46$0=224;
 var $396$$SHADOW$0=HEAP32[(($ld$46$0)>>2)];
 var $ld$47$1=228;
 var $396$$SHADOW$1=HEAP32[(($ld$47$1)>>2)];
 var $397=HEAP32[(($350)>>2)];
 var $398=($397|0);
 var $399=(1)/($398);
 var $400=HEAP32[(($374)>>2)];
 var $401=($400|0);
 var $402=(1)/($401);
 var $403=($399)+($402);
 var $404=($396)*($403);
 var $405=Math_sqrt($404);
 var $406=($304)*($405);
 var $407=($392)/($405);
 var $408=Math_abs($407);
 var $409=HEAPF64[((664)>>3)];
 var $ld$48$0=664;
 var $409$$SHADOW$0=HEAP32[(($ld$48$0)>>2)];
 var $ld$49$1=668;
 var $409$$SHADOW$1=HEAP32[(($ld$49$1)>>2)];
 var $410=_tdist($408,$409);
 var $411=(1)-($410);
 var $412=($411)*(2);
 var $413=($392)-($406);
 var $414=_sprintf(24920,3152,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$413,tempVarArgs)); STACKTOP=tempVarArgs;
 var $415=_strdup(24920);
 var $_sum82_i_i=((($362)+(3))|0);
 var $416=(($313+($_sum82_i_i<<2))|0);
 HEAP32[(($416)>>2)]=$415;
 var $417=($392)+($406);
 var $418=_sprintf(24920,3152,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$417,tempVarArgs)); STACKTOP=tempVarArgs;
 var $419=_strdup(24920);
 var $_sum83_i_i=((($362)+(4))|0);
 var $420=(($313+($_sum83_i_i<<2))|0);
 HEAP32[(($420)>>2)]=$419;
 var $421=_sprintf(24920,3712,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$407,tempVarArgs)); STACKTOP=tempVarArgs;
 var $422=_strdup(24920);
 var $_sum84_i_i=((($362)+(5))|0);
 var $423=(($313+($_sum84_i_i<<2))|0);
 HEAP32[(($423)>>2)]=$422;
 var $424=HEAPF64[((696)>>3)];
 var $ld$50$0=696;
 var $424$$SHADOW$0=HEAP32[(($ld$50$0)>>2)];
 var $ld$51$1=700;
 var $424$$SHADOW$1=HEAP32[(($ld$51$1)>>2)];
 var $425=$412>$424;
 if($425){label=75;break;}else{label=76;break;}
 case 75: 
 var $427=_sprintf(24920,1392,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$412,tempVarArgs)); STACKTOP=tempVarArgs;
 label=77;break;
 case 76: 
 var $429=_sprintf(24920,1376,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$412,tempVarArgs)); STACKTOP=tempVarArgs;
 label=77;break;
 case 77: 
 var $431=_strdup(24920);
 var $_sum85_i_i=((($362)+(6))|0);
 var $432=(($313+($_sum85_i_i<<2))|0);
 HEAP32[(($432)>>2)]=$431;
 var $k_2_i_i=$355;label=78;break;
 case 78: 
 var $k_2_i_i;
 var $434=((($j_092_i_i)+(1))|0);
 var $435=($434|0)<($307|0);
 if($435){var $k_191_i_i=$k_2_i_i;var $j_092_i_i=$434;label=70;break;}else{label=79;break;}
 case 79: 
 var $436=((($i_094_i_i)+(1))|0);
 var $437=($436|0)<($307|0);
 if($437){var $k_093_i_i=$k_2_i_i;var $i_094_i_i=$436;label=69;break;}else{label=80;break;}
 case 80: 
 HEAP8[(24920)]=1;
 HEAP8[(24921)]=1;
 HEAP16[((24922)>>1)]=0; HEAP16[((24924)>>1)]=0; HEAP8[(24926)]=0;
 _print_table_and_free($313,$310,7,24920);
 label=81;break;
 case 81: 
 if($68){label=97;break;}else{label=82;break;}
 case 82: 
 _emit_line_center(1616);
 _emit_line(36048);
 var $440=HEAP32[((14112)>>2)];
 var $441=(($440+20+((($71)*(24))&-1)+8)|0);
 var $442=HEAP32[(($441)>>2)];
 var $443=((($442)-(1))|0);
 var $444=(Math_imul($443,$442)|0);
 var $445=((($444)+(1))|0);
 var $446=((($445)*(28))&-1);
 var $447=_xmalloc($446);
 var $448=$447;
 var $449=HEAP32[((14112)>>2)];
 var $450=(($449+20+((($71)*(24))&-1))|0);
 var $451=HEAP32[(($450)>>2)];
 var $452=_strdup($451);
 HEAP32[(($448)>>2)]=$452;
 var $453=_strdup($451);
 var $454=(($447+4)|0);
 var $455=$454;
 HEAP32[(($455)>>2)]=$453;
 var $456=HEAP32[((4120)>>2)];
 var $457=HEAP32[((14112)>>2)];
 var $458=(($457+20+((($456)*(24))&-1))|0);
 var $459=HEAP32[(($458)>>2)];
 var $460=_sprintf(24920,1592,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$459,tempVarArgs)); STACKTOP=tempVarArgs;
 var $461=_strdup(24920);
 var $462=(($447+8)|0);
 var $463=$462;
 HEAP32[(($463)>>2)]=$461;
 var $464=HEAPF64[((696)>>3)];
 var $ld$52$0=696;
 var $464$$SHADOW$0=HEAP32[(($ld$52$0)>>2)];
 var $ld$53$1=700;
 var $464$$SHADOW$1=HEAP32[(($ld$53$1)>>2)];
 var $465=(1)-($464);
 var $466=($465)*(100);
 var $467=_sprintf(24920,1528,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$466,tempVarArgs)); STACKTOP=tempVarArgs;
 var $468=_strdup(24920);
 var $469=(($447+12)|0);
 var $470=$469;
 HEAP32[(($470)>>2)]=$468;
 var $471=HEAPF64[((696)>>3)];
 var $ld$54$0=696;
 var $471$$SHADOW$0=HEAP32[(($ld$54$0)>>2)];
 var $ld$55$1=700;
 var $471$$SHADOW$1=HEAP32[(($ld$55$1)>>2)];
 var $472=(1)-($471);
 var $473=($472)*(100);
 var $474=_sprintf(24920,1480,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$473,tempVarArgs)); STACKTOP=tempVarArgs;
 var $475=_strdup(24920);
 var $476=(($447+16)|0);
 var $477=$476;
 HEAP32[(($477)>>2)]=$475;
 var $478=_strdup(1448);
 var $479=(($447+20)|0);
 var $480=$479;
 HEAP32[(($480)>>2)]=$478;
 var $481=_strdup(1424);
 var $482=(($447+24)|0);
 var $483=$482;
 HEAP32[(($483)>>2)]=$481;
 var $484=($442|0)>0;
 if($484){var $k_0119_i_i=0;var $i_0120_i_i=0;label=83;break;}else{label=96;break;}
 case 83: 
 var $i_0120_i_i;
 var $k_0119_i_i;
 var $485=((14120+($i_0120_i_i<<2))|0);
 var $486=((9160+($i_0120_i_i<<3))|0);
 var $487=((5728+($i_0120_i_i<<3))|0);
 var $k_1117_i_i=$k_0119_i_i;var $j_0118_i_i=0;label=84;break;
 case 84: 
 var $j_0118_i_i;
 var $k_1117_i_i;
 var $489=($i_0120_i_i|0)==($j_0118_i_i|0);
 if($489){var $k_2_i23_i=$k_1117_i_i;label=94;break;}else{label=85;break;}
 case 85: 
 var $491=((($k_1117_i_i)+(1))|0);
 var $492=HEAP32[((14112)>>2)];
 var $493=(($492+20+((($71)*(24))&-1)+12)|0);
 var $494=HEAP32[(($493)>>2)];
 var $495=(($494+($i_0120_i_i<<2))|0);
 var $496=HEAP32[(($495)>>2)];
 var $497=_strdup($496);
 var $498=((($491)*(7))&-1);
 var $499=(($448+($498<<2))|0);
 HEAP32[(($499)>>2)]=$497;
 var $500=HEAP32[((14112)>>2)];
 var $501=(($500+20+((($71)*(24))&-1)+12)|0);
 var $502=HEAP32[(($501)>>2)];
 var $503=(($502+($j_0118_i_i<<2))|0);
 var $504=HEAP32[(($503)>>2)];
 var $505=_strdup($504);
 var $_sum_i22_i=((($498)+(1))|0);
 var $506=(($448+($_sum_i22_i<<2))|0);
 HEAP32[(($506)>>2)]=$505;
 var $507=HEAP32[(($485)>>2)];
 var $508=($507|0)==0;
 if($508){label=87;break;}else{label=86;break;}
 case 86: 
 var $510=((14120+($j_0118_i_i<<2))|0);
 var $511=HEAP32[(($510)>>2)];
 var $512=($511|0)==0;
 if($512){label=87;break;}else{label=88;break;}
 case 87: 
 var $514=_strdup(3912);
 var $_sum112_i_i=((($498)+(2))|0);
 var $515=(($448+($_sum112_i_i<<2))|0);
 HEAP32[(($515)>>2)]=$514;
 var $516=_strdup(3912);
 var $_sum113_i_i=((($498)+(3))|0);
 var $517=(($448+($_sum113_i_i<<2))|0);
 HEAP32[(($517)>>2)]=$516;
 var $518=_strdup(3912);
 var $_sum114_i_i=((($498)+(4))|0);
 var $519=(($448+($_sum114_i_i<<2))|0);
 HEAP32[(($519)>>2)]=$518;
 var $520=_strdup(3912);
 var $_sum115_i_i=((($498)+(5))|0);
 var $521=(($448+($_sum115_i_i<<2))|0);
 HEAP32[(($521)>>2)]=$520;
 var $522=_strdup(1408);
 var $_sum116_i_i=((($498)+(6))|0);
 var $523=(($448+($_sum116_i_i<<2))|0);
 HEAP32[(($523)>>2)]=$522;
 var $k_2_i23_i=$491;label=94;break;
 case 88: 
 var $525=HEAPF64[(($486)>>3)];
 var $ld$56$0=(($486)|0);
 var $525$$SHADOW$0=HEAP32[(($ld$56$0)>>2)];
 var $ld$57$1=(($486+4)|0);
 var $525$$SHADOW$1=HEAP32[(($ld$57$1)>>2)];
 var $526=((9160+($j_0118_i_i<<3))|0);
 var $527=HEAPF64[(($526)>>3)];
 var $ld$58$0=(($526)|0);
 var $527$$SHADOW$0=HEAP32[(($ld$58$0)>>2)];
 var $ld$59$1=(($526+4)|0);
 var $527$$SHADOW$1=HEAP32[(($ld$59$1)>>2)];
 var $528=($525)-($527);
 var $529=_sprintf(24920,3152,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$528,tempVarArgs)); STACKTOP=tempVarArgs;
 var $530=_strdup(24920);
 var $_sum103_i_i=((($498)+(2))|0);
 var $531=(($448+($_sum103_i_i<<2))|0);
 HEAP32[(($531)>>2)]=$530;
 var $532=HEAP32[(($485)>>2)];
 var $533=HEAP32[(($510)>>2)];
 var $534=((($533)+($532))|0);
 var $535=($534|0)<3;
 if($535){label=89;break;}else{label=90;break;}
 case 89: 
 var $537=_strdup(3912);
 var $_sum108_i_i=((($498)+(3))|0);
 var $538=(($448+($_sum108_i_i<<2))|0);
 HEAP32[(($538)>>2)]=$537;
 var $539=_strdup(3912);
 var $_sum109_i_i=((($498)+(4))|0);
 var $540=(($448+($_sum109_i_i<<2))|0);
 HEAP32[(($540)>>2)]=$539;
 var $541=_strdup(3912);
 var $_sum110_i_i=((($498)+(5))|0);
 var $542=(($448+($_sum110_i_i<<2))|0);
 HEAP32[(($542)>>2)]=$541;
 var $543=_strdup(1408);
 var $_sum111_i_i=((($498)+(6))|0);
 var $544=(($448+($_sum111_i_i<<2))|0);
 HEAP32[(($544)>>2)]=$543;
 var $k_2_i23_i=$491;label=94;break;
 case 90: 
 var $546=HEAPF64[(($487)>>3)];
 var $ld$60$0=(($487)|0);
 var $546$$SHADOW$0=HEAP32[(($ld$60$0)>>2)];
 var $ld$61$1=(($487+4)|0);
 var $546$$SHADOW$1=HEAP32[(($ld$61$1)>>2)];
 var $547=((($532)-(1))|0);
 var $548=($547|0);
 var $549=($548)*($546);
 var $550=((5728+($j_0118_i_i<<3))|0);
 var $551=HEAPF64[(($550)>>3)];
 var $ld$62$0=(($550)|0);
 var $551$$SHADOW$0=HEAP32[(($ld$62$0)>>2)];
 var $ld$63$1=(($550+4)|0);
 var $551$$SHADOW$1=HEAP32[(($ld$63$1)>>2)];
 var $552=((($533)-(1))|0);
 var $553=($552|0);
 var $554=($553)*($551);
 var $555=($549)+($554);
 var $556=((($534)-(2))|0);
 var $557=($556|0);
 var $558=($555)/($557);
 var $559=($532|0);
 var $560=(1)/($559);
 var $561=($533|0);
 var $562=(1)/($561);
 var $563=($560)+($562);
 var $564=($558)*($563);
 var $565=Math_sqrt($564);
 var $566=($528)/($565);
 var $567=Math_abs($566);
 var $568=_tdist($567,$557);
 var $569=(1)-($568);
 var $570=($569)*(2);
 var $571=HEAPF64[((696)>>3)];
 var $ld$64$0=696;
 var $571$$SHADOW$0=HEAP32[(($ld$64$0)>>2)];
 var $ld$65$1=700;
 var $571$$SHADOW$1=HEAP32[(($ld$65$1)>>2)];
 var $572=($571)*((0.5));
 var $573=(1)-($572);
 var $574=_qt($573,$557);
 var $575=($565)*($574);
 var $576=($528)-($575);
 var $577=_sprintf(24920,3152,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$576,tempVarArgs)); STACKTOP=tempVarArgs;
 var $578=_strdup(24920);
 var $_sum104_i_i=((($498)+(3))|0);
 var $579=(($448+($_sum104_i_i<<2))|0);
 HEAP32[(($579)>>2)]=$578;
 var $580=($528)+($575);
 var $581=_sprintf(24920,3152,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$580,tempVarArgs)); STACKTOP=tempVarArgs;
 var $582=_strdup(24920);
 var $_sum105_i_i=((($498)+(4))|0);
 var $583=(($448+($_sum105_i_i<<2))|0);
 HEAP32[(($583)>>2)]=$582;
 var $584=_sprintf(24920,3712,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$566,tempVarArgs)); STACKTOP=tempVarArgs;
 var $585=_strdup(24920);
 var $_sum106_i_i=((($498)+(5))|0);
 var $586=(($448+($_sum106_i_i<<2))|0);
 HEAP32[(($586)>>2)]=$585;
 var $587=HEAPF64[((696)>>3)];
 var $ld$66$0=696;
 var $587$$SHADOW$0=HEAP32[(($ld$66$0)>>2)];
 var $ld$67$1=700;
 var $587$$SHADOW$1=HEAP32[(($ld$67$1)>>2)];
 var $588=$570>$587;
 if($588){label=91;break;}else{label=92;break;}
 case 91: 
 var $590=_sprintf(24920,1392,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$570,tempVarArgs)); STACKTOP=tempVarArgs;
 label=93;break;
 case 92: 
 var $592=_sprintf(24920,1376,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$570,tempVarArgs)); STACKTOP=tempVarArgs;
 label=93;break;
 case 93: 
 var $594=_strdup(24920);
 var $_sum107_i_i=((($498)+(6))|0);
 var $595=(($448+($_sum107_i_i<<2))|0);
 HEAP32[(($595)>>2)]=$594;
 var $k_2_i23_i=$491;label=94;break;
 case 94: 
 var $k_2_i23_i;
 var $597=((($j_0118_i_i)+(1))|0);
 var $598=($597|0)<($442|0);
 if($598){var $k_1117_i_i=$k_2_i23_i;var $j_0118_i_i=$597;label=84;break;}else{label=95;break;}
 case 95: 
 var $599=((($i_0120_i_i)+(1))|0);
 var $600=($599|0)<($442|0);
 if($600){var $k_0119_i_i=$k_2_i23_i;var $i_0120_i_i=$599;label=83;break;}else{label=96;break;}
 case 96: 
 HEAP8[(24920)]=1;
 HEAP8[(24921)]=1;
 HEAP16[((24922)>>1)]=0; HEAP16[((24924)>>1)]=0; HEAP8[(24926)]=0;
 _print_table_and_free($448,$445,7,24920);
 label=97;break;
 case 97: 
 var $602=((($i_133_i)+(1))|0);
 var $603=($602|0)<($n_0_i|0);
 if($603){var $i_133_i=$602;label=33;break;}else{label=2;break;}
 case 98: 
 HEAP32[((8984)>>2)]=0;
 _scan();
 var $605=HEAP32[((6944)>>2)];
 var $606=($605|0)==1001;
 if($606){label=100;break;}else{label=99;break;}
 case 99: 
 _expected(2832);
 label=100;break;
 case 100: 
 var $608=HEAP32[((14112)>>2)];
 var $609=(($608+8)|0);
 var $610=HEAP32[(($609)>>2)];
 var $i_0_i2=0;label=101;break;
 case 101: 
 var $i_0_i2;
 var $612=($i_0_i2|0)<($610|0);
 if($612){label=102;break;}else{label=103;break;}
 case 102: 
 var $614=(($608+20+((($i_0_i2)*(24))&-1))|0);
 var $615=HEAP32[(($614)>>2)];
 var $616=_strcmp($615,6984);
 var $617=($616|0)==0;
 var $618=((($i_0_i2)+(1))|0);
 if($617){label=103;break;}else{var $i_0_i2=$618;label=101;break;}
 case 103: 
 var $620=($i_0_i2|0)==($610|0);
 if($620){label=104;break;}else{var $623=$608;label=105;break;}
 case 104: 
 _expected(2712);
 var $_pre_i3=HEAP32[((14112)>>2)];
 var $623=$_pre_i3;label=105;break;
 case 105: 
 var $623;
 var $624=(($623+20+((($i_0_i2)*(24))&-1)+12)|0);
 var $625=HEAP32[(($624)>>2)];
 var $626=($625|0)==0;
 if($626){label=107;break;}else{label=106;break;}
 case 106: 
 _expected(2664);
 label=107;break;
 case 107: 
 HEAP32[((4120)>>2)]=$i_0_i2;
 _scan();
 var $629=HEAP32[((6944)>>2)];
 var $630=($629|0)==61;
 if($630){label=109;break;}else{label=108;break;}
 case 108: 
 _expected(2584);
 label=109;break;
 case 109: 
 _scan();
 label=110;break;
 case 110: 
 var $_pr_i=HEAP32[((6944)>>2)];
 var $633=$_pr_i;label=111;break;
 case 111: 
 var $633;
 if(($633|0)==1001){ label=113;break;}else if(($633|0)==47){ label=177;break;}else if(($633|0)==59){ label=179;break;}else{label=112;break;}
 case 112: 
 _expected(2832);
 label=113;break;
 case 113: 
 var $636=_get_var_index();
 HEAP32[((4528)>>2)]=$636;
 _scan();
 var $637=HEAP32[((6944)>>2)];
 if(($637|0)==42){ var $n_0_i_i=1;label=114;break;}else if(($637|0)==124){ var $n_1_i_i=1;label=162;break;}else if(($637|0)==40){ label=167;break;}else{label=174;break;}
 case 114: 
 var $n_0_i_i;
 _scan();
 var $638=HEAP32[((6944)>>2)];
 var $639=($638|0)==1001;
 if($639){label=116;break;}else{label=115;break;}
 case 115: 
 _expected(2832);
 label=116;break;
 case 116: 
 var $642=($n_0_i_i|0)==100;
 if($642){label=117;break;}else{label=118;break;}
 case 117: 
 _stop(2408);
 label=118;break;
 case 118: 
 var $645=_get_var_index();
 var $646=((($n_0_i_i)+(1))|0);
 var $647=((4528+($n_0_i_i<<2))|0);
 HEAP32[(($647)>>2)]=$645;
 _scan();
 var $648=HEAP32[((6944)>>2)];
 var $649=($648|0)==42;
 if($649){var $n_0_i_i=$646;label=114;break;}else{label=119;break;}
 case 119: 
 var $651=($646|0)>0;
 if($651){label=121;break;}else{label=120;break;}
 case 120: 
 var $652=_xmalloc($646);
 HEAP8[($652)]=0;
 var $664=$652;label=124;break;
 case 121: 
 var $653=HEAP32[((14112)>>2)];
 var $len_066_i_i_i=$646;var $i_067_i_i_i=0;label=122;break;
 case 122: 
 var $i_067_i_i_i;
 var $len_066_i_i_i;
 var $655=((4528+($i_067_i_i_i<<2))|0);
 var $656=HEAP32[(($655)>>2)];
 var $657=(($653+20+((($656)*(24))&-1))|0);
 var $658=HEAP32[(($657)>>2)];
 var $659=_strlen($658);
 var $660=((($659)+($len_066_i_i_i))|0);
 var $661=((($i_067_i_i_i)+(1))|0);
 var $662=($661|0)<($646|0);
 if($662){var $len_066_i_i_i=$660;var $i_067_i_i_i=$661;label=122;break;}else{label=123;break;}
 case 123: 
 var $663=_xmalloc($660);
 HEAP8[($663)]=0;
 var $i_163_i_i_i=0;label=125;break;
 case 124: 
 var $664;
 var $665=HEAP32[((14112)>>2)];
 var $666=(($665+8)|0);
 var $667=HEAP32[(($666)>>2)];
 var $m_0_i_i_i=0;label=128;break;
 case 125: 
 var $i_163_i_i_i;
 var $668=($i_163_i_i_i|0)>0;
 if($668){label=126;break;}else{label=127;break;}
 case 126: 
 var $strlen_i_i_i=_strlen($663);
 var $endptr_i_i_i=(($663+$strlen_i_i_i)|0);
 var $670=$endptr_i_i_i;
 tempBigInt=42;HEAP8[($670)]=tempBigInt&0xff;tempBigInt = tempBigInt>>8;HEAP8[((($670)+(1))|0)]=tempBigInt&0xff;
 label=127;break;
 case 127: 
 var $672=((4528+($i_163_i_i_i<<2))|0);
 var $673=HEAP32[(($672)>>2)];
 var $674=HEAP32[((14112)>>2)];
 var $675=(($674+20+((($673)*(24))&-1))|0);
 var $676=HEAP32[(($675)>>2)];
 var $677=_strcat($663,$676);
 var $678=((($i_163_i_i_i)+(1))|0);
 var $679=($678|0)<($646|0);
 if($679){var $i_163_i_i_i=$678;label=125;break;}else{var $664=$663;label=124;break;}
 case 128: 
 var $m_0_i_i_i;
 var $681=($m_0_i_i_i|0)<($667|0);
 if($681){label=129;break;}else{label=131;break;}
 case 129: 
 var $683=(($665+20+((($m_0_i_i_i)*(24))&-1))|0);
 var $684=HEAP32[(($683)>>2)];
 var $685=_strcmp($664,$684);
 var $686=($685|0)==0;
 var $687=((($m_0_i_i_i)+(1))|0);
 if($686){label=130;break;}else{var $m_0_i_i_i=$687;label=128;break;}
 case 130: 
 _free($664);
 var $m_1_i_i_i=$m_0_i_i_i;label=156;break;
 case 131: 
 var $690=($667|0)==100;
 if($690){label=132;break;}else{var $694=$665;var $693=$667;label=133;break;}
 case 132: 
 _stop(2064);
 var $_pre75_i_i_i=HEAP32[((14112)>>2)];
 var $_phi_trans_insert_i_i_i=(($_pre75_i_i_i+8)|0);
 var $_pre76_i_i_i=HEAP32[(($_phi_trans_insert_i_i_i)>>2)];
 var $694=$_pre75_i_i_i;var $693=$_pre76_i_i_i;label=133;break;
 case 133: 
 var $693;
 var $694;
 var $695=(($694+8)|0);
 var $696=((($693)+(1))|0);
 HEAP32[(($695)>>2)]=$696;
 var $697=HEAP32[((14112)>>2)];
 var $698=(($697+20+((($693)*(24))&-1))|0);
 HEAP32[(($698)>>2)]=$664;
 if($651){label=134;break;}else{var $k_0_lcssa_i_i_i=1;label=136;break;}
 case 134: 
 var $699=HEAP32[((14112)>>2)];
 var $k_056_i_i_i=1;var $i_257_i_i_i=0;label=135;break;
 case 135: 
 var $i_257_i_i_i;
 var $k_056_i_i_i;
 var $701=((4528+($i_257_i_i_i<<2))|0);
 var $702=HEAP32[(($701)>>2)];
 var $703=(($699+20+((($702)*(24))&-1)+8)|0);
 var $704=HEAP32[(($703)>>2)];
 var $705=(Math_imul($704,$k_056_i_i_i)|0);
 var $706=((($i_257_i_i_i)+(1))|0);
 var $707=($706|0)<($646|0);
 if($707){var $k_056_i_i_i=$705;var $i_257_i_i_i=$706;label=135;break;}else{var $k_0_lcssa_i_i_i=$705;label=136;break;}
 case 136: 
 var $k_0_lcssa_i_i_i;
 var $708=$k_0_lcssa_i_i_i<<2;
 var $709=_xmalloc($708);
 var $710=$709;
 var $711=HEAP32[((14112)>>2)];
 var $712=(($711+20+((($693)*(24))&-1)+12)|0);
 HEAP32[(($712)>>2)]=$710;
 var $713=HEAP32[((14112)>>2)];
 var $714=(($713+20+((($693)*(24))&-1)+4)|0);
 HEAP32[(($714)>>2)]=$k_0_lcssa_i_i_i;
 var $715=HEAP32[((14112)>>2)];
 var $716=(($715+20+((($693)*(24))&-1)+8)|0);
 HEAP32[(($716)>>2)]=$k_0_lcssa_i_i_i;
 var $717=HEAP32[((14112)>>2)];
 var $718=(($717+16)|0);
 var $719=HEAP32[(($718)>>2)];
 var $720=$719<<3;
 var $721=_xmalloc($720);
 var $722=$721;
 var $723=HEAP32[((14112)>>2)];
 var $724=(($723+20+((($693)*(24))&-1)+20)|0);
 HEAP32[(($724)>>2)]=$722;
 var $725=HEAP32[((14112)>>2)];
 var $726=(($725+8)|0);
 var $727=HEAP32[(($726)>>2)];
 var $728=((($727)-(1))|0);
 if($651){label=137;break;}else{label=138;break;}
 case 137: 
 var $729=$646<<2;
 _memset(10072, 0, $729)|0;
 label=138;break;
 case 138: 
 var $730=(($725+20+((($728)*(24))&-1)+8)|0);
 var $731=HEAP32[(($730)>>2)];
 var $732=($731|0)>0;
 if($732){var $i_145_i_i_i_i=0;var $733=$725;label=139;break;}else{var $788=$725;label=150;break;}
 case 139: 
 var $733;
 var $i_145_i_i_i_i;
 if($651){var $len_032_i_i_i_i=$646;var $j_033_i_i_i_i=0;label=140;break;}else{label=145;break;}
 case 140: 
 var $j_033_i_i_i_i;
 var $len_032_i_i_i_i;
 var $734=((4528+($j_033_i_i_i_i<<2))|0);
 var $735=HEAP32[(($734)>>2)];
 var $736=((10072+($j_033_i_i_i_i<<2))|0);
 var $737=HEAP32[(($736)>>2)];
 var $738=(($733+20+((($735)*(24))&-1)+12)|0);
 var $739=HEAP32[(($738)>>2)];
 var $740=(($739+($737<<2))|0);
 var $741=HEAP32[(($740)>>2)];
 var $742=_strlen($741);
 var $743=((($742)+($len_032_i_i_i_i))|0);
 var $744=((($j_033_i_i_i_i)+(1))|0);
 var $745=($744|0)<($646|0);
 if($745){var $len_032_i_i_i_i=$743;var $j_033_i_i_i_i=$744;label=140;break;}else{label=141;break;}
 case 141: 
 var $746=_xmalloc($743);
 HEAP8[($746)]=0;
 var $j_134_i_i_i_i=0;label=142;break;
 case 142: 
 var $j_134_i_i_i_i;
 var $747=($j_134_i_i_i_i|0)>0;
 if($747){label=143;break;}else{label=144;break;}
 case 143: 
 var $strlen_i_i_i_i=_strlen($746);
 var $endptr_i_i_i_i=(($746+$strlen_i_i_i_i)|0);
 var $749=$endptr_i_i_i_i;
 tempBigInt=42;HEAP8[($749)]=tempBigInt&0xff;tempBigInt = tempBigInt>>8;HEAP8[((($749)+(1))|0)]=tempBigInt&0xff;
 label=144;break;
 case 144: 
 var $751=((4528+($j_134_i_i_i_i<<2))|0);
 var $752=HEAP32[(($751)>>2)];
 var $753=((10072+($j_134_i_i_i_i<<2))|0);
 var $754=HEAP32[(($753)>>2)];
 var $755=HEAP32[((14112)>>2)];
 var $756=(($755+20+((($752)*(24))&-1)+12)|0);
 var $757=HEAP32[(($756)>>2)];
 var $758=(($757+($754<<2))|0);
 var $759=HEAP32[(($758)>>2)];
 var $760=_strcat($746,$759);
 var $761=((($j_134_i_i_i_i)+(1))|0);
 var $762=($761|0)<($646|0);
 if($762){var $j_134_i_i_i_i=$761;label=142;break;}else{label=146;break;}
 case 145: 
 var $763=_xmalloc($646);
 HEAP8[($763)]=0;
 var $764=HEAP32[((14112)>>2)];
 var $765=(($764+20+((($728)*(24))&-1)+12)|0);
 var $766=HEAP32[(($765)>>2)];
 var $767=(($766+($i_145_i_i_i_i<<2))|0);
 HEAP32[(($767)>>2)]=$763;
 var $_pre51_i_i_i_i=HEAP32[((14112)>>2)];
 var $783=$_pre51_i_i_i_i;label=149;break;
 case 146: 
 var $768=HEAP32[((14112)>>2)];
 var $769=(($768+20+((($728)*(24))&-1)+12)|0);
 var $770=HEAP32[(($769)>>2)];
 var $771=(($770+($i_145_i_i_i_i<<2))|0);
 HEAP32[(($771)>>2)]=$746;
 var $_pre_i_i_i_i=HEAP32[((14112)>>2)];
 var $j_239_in_i_i_i_i=$646;label=147;break;
 case 147: 
 var $j_239_in_i_i_i_i;
 var $j_239_i_i_i_i=((($j_239_in_i_i_i_i)-(1))|0);
 var $773=((4528+($j_239_i_i_i_i<<2))|0);
 var $774=HEAP32[(($773)>>2)];
 var $775=((10072+($j_239_i_i_i_i<<2))|0);
 var $776=HEAP32[(($775)>>2)];
 var $777=((($776)+(1))|0);
 HEAP32[(($775)>>2)]=$777;
 var $778=(($_pre_i_i_i_i+20+((($774)*(24))&-1)+8)|0);
 var $779=HEAP32[(($778)>>2)];
 var $780=($777|0)<($779|0);
 if($780){var $783=$_pre_i_i_i_i;label=149;break;}else{label=148;break;}
 case 148: 
 HEAP32[(($775)>>2)]=0;
 var $782=($j_239_i_i_i_i|0)>0;
 if($782){var $j_239_in_i_i_i_i=$j_239_i_i_i_i;label=147;break;}else{var $783=$_pre_i_i_i_i;label=149;break;}
 case 149: 
 var $783;
 var $784=((($i_145_i_i_i_i)+(1))|0);
 var $785=(($783+20+((($728)*(24))&-1)+8)|0);
 var $786=HEAP32[(($785)>>2)];
 var $787=($784|0)<($786|0);
 if($787){var $i_145_i_i_i_i=$784;var $733=$783;label=139;break;}else{var $788=$783;label=150;break;}
 case 150: 
 var $788;
 var $789=(($788+12)|0);
 var $790=HEAP32[(($789)>>2)];
 var $791=($790|0)>0;
 if($791){label=151;break;}else{var $m_1_i_i_i=$693;label=156;break;}
 case 151: 
 if($651){var $i_354_us_i_i_i=0;var $814=$788;label=154;break;}else{var $i_354_i_i_i=0;var $815=$788;label=155;break;}
 case 152: 
 var $792=(($814+20+((($693)*(24))&-1)+20)|0);
 var $793=HEAP32[(($792)>>2)];
 var $794=(($793+($i_354_us_i_i_i<<3))|0);
 HEAPF64[(($794)>>3)]=$811;
 var $795=((($i_354_us_i_i_i)+(1))|0);
 var $796=HEAP32[((14112)>>2)];
 var $797=(($796+12)|0);
 var $798=HEAP32[(($797)>>2)];
 var $799=($795|0)<($798|0);
 if($799){var $i_354_us_i_i_i=$795;var $814=$796;label=154;break;}else{var $m_1_i_i_i=$693;label=156;break;}
 case 153: 
 var $d_052_us_i_i_i;
 var $j_051_us_i_i_i;
 var $801=((4528+($j_051_us_i_i_i<<2))|0);
 var $802=HEAP32[(($801)>>2)];
 var $803=(($814+20+((($802)*(24))&-1)+8)|0);
 var $804=HEAP32[(($803)>>2)];
 var $805=($804|0);
 var $806=($d_052_us_i_i_i)*($805);
 var $807=(($814+20+((($802)*(24))&-1)+20)|0);
 var $808=HEAP32[(($807)>>2)];
 var $809=(($808+($i_354_us_i_i_i<<3))|0);
 var $810=HEAPF64[(($809)>>3)];
 var $ld$68$0=(($809)|0);
 var $810$$SHADOW$0=HEAP32[(($ld$68$0)>>2)];
 var $ld$69$1=(($809+4)|0);
 var $810$$SHADOW$1=HEAP32[(($ld$69$1)>>2)];
 var $811=($806)+($810);
 var $812=((($j_051_us_i_i_i)+(1))|0);
 var $813=($812|0)<($646|0);
 if($813){var $j_051_us_i_i_i=$812;var $d_052_us_i_i_i=$811;label=153;break;}else{label=152;break;}
 case 154: 
 var $814;
 var $i_354_us_i_i_i;
 var $j_051_us_i_i_i=0;var $d_052_us_i_i_i=0;label=153;break;
 case 155: 
 var $815;
 var $i_354_i_i_i;
 var $816=(($815+20+((($693)*(24))&-1)+20)|0);
 var $817=HEAP32[(($816)>>2)];
 var $818=(($817+($i_354_i_i_i<<3))|0);
 HEAPF64[(($818)>>3)]=0;
 var $819=((($i_354_i_i_i)+(1))|0);
 var $820=HEAP32[((14112)>>2)];
 var $821=(($820+12)|0);
 var $822=HEAP32[(($821)>>2)];
 var $823=($819|0)<($822|0);
 if($823){var $i_354_i_i_i=$819;var $815=$820;label=155;break;}else{var $m_1_i_i_i=$693;label=156;break;}
 case 156: 
 var $m_1_i_i_i;
 var $824=HEAP32[((8984)>>2)];
 var $i_4_i_i_i=0;label=157;break;
 case 157: 
 var $i_4_i_i_i;
 var $826=($i_4_i_i_i|0)<($824|0);
 if($826){label=158;break;}else{label=159;break;}
 case 158: 
 var $828=((4928+($i_4_i_i_i<<2))|0);
 var $829=HEAP32[(($828)>>2)];
 var $830=($829|0)==($m_1_i_i_i|0);
 var $831=((($i_4_i_i_i)+(1))|0);
 if($830){label=110;break;}else{var $i_4_i_i_i=$831;label=157;break;}
 case 159: 
 var $833=($824|0)==100;
 if($833){label=160;break;}else{var $836=$824;label=161;break;}
 case 160: 
 _stop(2224);
 var $_pre_i_i_i=HEAP32[((8984)>>2)];
 var $836=$_pre_i_i_i;label=161;break;
 case 161: 
 var $836;
 var $837=((($836)+(1))|0);
 HEAP32[((8984)>>2)]=$837;
 var $838=((4928+($836<<2))|0);
 HEAP32[(($838)>>2)]=$m_1_i_i_i;
 label=110;break;
 case 162: 
 var $n_1_i_i;
 _scan();
 var $839=HEAP32[((6944)>>2)];
 var $840=($839|0)==1001;
 if($840){label=164;break;}else{label=163;break;}
 case 163: 
 _expected(2832);
 label=164;break;
 case 164: 
 var $843=($n_1_i_i|0)==100;
 if($843){label=165;break;}else{label=166;break;}
 case 165: 
 _stop(2408);
 label=166;break;
 case 166: 
 var $846=_get_var_index();
 var $847=((($n_1_i_i)+(1))|0);
 var $848=((4528+($n_1_i_i<<2))|0);
 HEAP32[(($848)>>2)]=$846;
 _scan();
 var $849=HEAP32[((6944)>>2)];
 var $850=($849|0)==124;
 if($850){var $n_1_i_i=$847;label=162;break;}else{var $633=$849;label=111;break;}
 case 167: 
 _scan();
 var $n_2_i_i=1;label=168;break;
 case 168: 
 var $n_2_i_i;
 var $853=HEAP32[((6944)>>2)];
 if(($853|0)==1001){ label=169;break;}else if(($853|0)==41){ label=173;break;}else{label=172;break;}
 case 169: 
 var $855=($n_2_i_i|0)==100;
 if($855){label=170;break;}else{label=171;break;}
 case 170: 
 _stop(2408);
 label=171;break;
 case 171: 
 var $858=_get_var_index();
 var $859=((($n_2_i_i)+(1))|0);
 var $860=((4528+($n_2_i_i<<2))|0);
 HEAP32[(($860)>>2)]=$858;
 _scan();
 var $n_2_i_i=$859;label=168;break;
 case 172: 
 _expected(2320);
 label=173;break;
 case 173: 
 _scan();
 label=110;break;
 case 174: 
 var $863=HEAP32[((8984)>>2)];
 var $864=($863|0)==100;
 if($864){label=175;break;}else{var $867=$863;label=176;break;}
 case 175: 
 _stop(2224);
 var $_pre_i_i5=HEAP32[((8984)>>2)];
 var $867=$_pre_i_i5;label=176;break;
 case 176: 
 var $867;
 var $868=HEAP32[((4528)>>2)];
 var $869=((($867)+(1))|0);
 HEAP32[((8984)>>2)]=$869;
 var $870=((4928+($867<<2))|0);
 HEAP32[(($870)>>2)]=$868;
 label=110;break;
 case 177: 
 _scan();
 _keyword();
 var $872=HEAP32[((6944)>>2)];
 var $cond1_i_i=($872|0)==59;
 if($cond1_i_i){label=179;break;}else{label=178;break;}
 case 178: 
 _stop(2488);
 _scan();
 _keyword();
 var $873=HEAP32[((6944)>>2)];
 var $cond_i_i=($873|0)==59;
 if($cond_i_i){label=179;break;}else{label=178;break;}
 case 179: 
 _scan();
 var $874=HEAP32[((9152)>>2)];
 var $875=($874|0)==0;
 if($875){label=181;break;}else{label=180;break;}
 case 180: 
 var $877=$874;
 _free($877);
 label=181;break;
 case 181: 
 var $879=HEAP32[((14112)>>2)];
 var $880=(($879+12)|0);
 var $881=HEAP32[(($880)>>2)];
 var $882=$881<<2;
 var $883=_xmalloc($882);
 var $884=$883;
 HEAP32[((9152)>>2)]=$884;
 HEAP32[((9072)>>2)]=0;
 var $885=HEAP32[((14112)>>2)];
 var $886=(($885+12)|0);
 var $887=HEAP32[(($886)>>2)];
 var $888=($887|0)>0;
 if($888){var $i_039_i_i_i=0;var $889=$884;label=182;break;}else{var $_lcssa38_i_i_i=$887;var $930=0;var $929=$885;label=191;break;}
 case 182: 
 var $889;
 var $i_039_i_i_i;
 var $890=(($889+($i_039_i_i_i<<2))|0);
 HEAP32[(($890)>>2)]=0;
 var $891=HEAP32[((4120)>>2)];
 var $892=HEAP32[((14112)>>2)];
 var $893=(($892+20+((($891)*(24))&-1)+20)|0);
 var $894=HEAP32[(($893)>>2)];
 var $895=(($894+($i_039_i_i_i<<3))|0);
 var $896=HEAPF64[(($895)>>3)];
 var $ld$70$0=(($895)|0);
 var $896$$SHADOW$0=HEAP32[(($ld$70$0)>>2)];
 var $ld$71$1=(($895+4)|0);
 var $896$$SHADOW$1=HEAP32[(($ld$71$1)>>2)];
 var $897$0=$896$$SHADOW$0;
 var $897$1=$896$$SHADOW$1;
 var $$etemp$72$0=-1;
 var $$etemp$72$1=2147483647;
 var $898$0=$897$0&$$etemp$72$0;
 var $898$1=$897$1&$$etemp$72$1;
 var $$etemp$73$0=0;
 var $$etemp$73$1=2146435072;
 var $899=(($898$1>>>0) > ($$etemp$73$1>>>0)) | (((($898$1>>>0) == ($$etemp$73$1>>>0) & ($898$0>>>0) >  ($$etemp$73$0>>>0))));
 if($899){label=184;break;}else{label=183;break;}
 case 183: 
 var $900=HEAP32[((8984)>>2)];
 var $j_0_i_i_i=0;label=185;break;
 case 184: 
 var $902=HEAP32[((9152)>>2)];
 var $903=(($902+($i_039_i_i_i<<2))|0);
 HEAP32[(($903)>>2)]=1;
 var $904=HEAP32[((9072)>>2)];
 var $905=((($904)+(1))|0);
 HEAP32[((9072)>>2)]=$905;
 label=188;break;
 case 185: 
 var $j_0_i_i_i;
 var $907=($j_0_i_i_i|0)<($900|0);
 if($907){label=186;break;}else{label=188;break;}
 case 186: 
 var $909=((4928+($j_0_i_i_i<<2))|0);
 var $910=HEAP32[(($909)>>2)];
 var $911=(($892+20+((($910)*(24))&-1)+20)|0);
 var $912=HEAP32[(($911)>>2)];
 var $913=(($912+($i_039_i_i_i<<3))|0);
 var $914=HEAPF64[(($913)>>3)];
 var $ld$74$0=(($913)|0);
 var $914$$SHADOW$0=HEAP32[(($ld$74$0)>>2)];
 var $ld$75$1=(($913+4)|0);
 var $914$$SHADOW$1=HEAP32[(($ld$75$1)>>2)];
 var $915$0=$914$$SHADOW$0;
 var $915$1=$914$$SHADOW$1;
 var $$etemp$76$0=-1;
 var $$etemp$76$1=2147483647;
 var $916$0=$915$0&$$etemp$76$0;
 var $916$1=$915$1&$$etemp$76$1;
 var $$etemp$77$0=0;
 var $$etemp$77$1=2146435072;
 var $917=(($916$1>>>0) > ($$etemp$77$1>>>0)) | (((($916$1>>>0) == ($$etemp$77$1>>>0) & ($916$0>>>0) >  ($$etemp$77$0>>>0))));
 var $918=((($j_0_i_i_i)+(1))|0);
 if($917){label=187;break;}else{var $j_0_i_i_i=$918;label=185;break;}
 case 187: 
 var $920=HEAP32[((9152)>>2)];
 var $921=(($920+($i_039_i_i_i<<2))|0);
 HEAP32[(($921)>>2)]=1;
 var $922=HEAP32[((9072)>>2)];
 var $923=((($922)+(1))|0);
 HEAP32[((9072)>>2)]=$923;
 label=188;break;
 case 188: 
 var $924=((($i_039_i_i_i)+(1))|0);
 var $925=HEAP32[((14112)>>2)];
 var $926=(($925+12)|0);
 var $927=HEAP32[(($926)>>2)];
 var $928=($924|0)<($927|0);
 if($928){label=189;break;}else{label=190;break;}
 case 189: 
 var $_pre51_i_i_i=HEAP32[((9152)>>2)];
 var $i_039_i_i_i=$924;var $889=$_pre51_i_i_i;label=182;break;
 case 190: 
 var $_pre_i_i_i7=HEAP32[((9072)>>2)];
 var $_lcssa38_i_i_i=$927;var $930=$_pre_i_i_i7;var $929=$925;label=191;break;
 case 191: 
 var $929;
 var $930;
 var $_lcssa38_i_i_i;
 var $931=((($_lcssa38_i_i_i)-($930))|0);
 HEAP32[((9064)>>2)]=$931;
 HEAP32[((9096)>>2)]=1;
 var $932=HEAP32[((8984)>>2)];
 var $933=($932|0)>0;
 if($933){var $i_134_i_i_i=0;var $934=1;label=192;break;}else{var $942=1;label=193;break;}
 case 192: 
 var $934;
 var $i_134_i_i_i;
 var $935=((4928+($i_134_i_i_i<<2))|0);
 var $936=HEAP32[(($935)>>2)];
 var $937=(($929+20+((($936)*(24))&-1)+8)|0);
 var $938=HEAP32[(($937)>>2)];
 var $939=((($938)+($934))|0);
 HEAP32[((9096)>>2)]=$939;
 var $940=((($i_134_i_i_i)+(1))|0);
 var $941=($940|0)<($932|0);
 if($941){var $i_134_i_i_i=$940;var $934=$939;label=192;break;}else{var $942=$939;label=193;break;}
 case 193: 
 var $942;
 var $943=HEAP32[((36672)>>2)];
 var $944=($943|0)==0;
 if($944){var $958=$942;label=195;break;}else{label=194;break;}
 case 194: 
 var $946=$943;
 _free($946);
 var $947=HEAP32[((36656)>>2)];
 var $948=$947;
 _free($948);
 var $949=HEAP32[((36632)>>2)];
 var $950=$949;
 _free($950);
 var $951=HEAP32[((36616)>>2)];
 var $952=$951;
 _free($952);
 var $953=HEAP32[((36608)>>2)];
 var $954=$953;
 _free($954);
 var $955=HEAP32[((36592)>>2)];
 var $956=$955;
 _free($956);
 var $_pre46_i_i_i=HEAP32[((9096)>>2)];
 var $958=$_pre46_i_i_i;label=195;break;
 case 195: 
 var $958;
 var $959=$958<<3;
 var $960=_xmalloc($959);
 var $961=$960;
 HEAP32[((36672)>>2)]=$961;
 var $962=HEAP32[((9096)>>2)];
 var $963=$962<<3;
 var $964=(Math_imul($963,$962)|0);
 var $965=_xmalloc($964);
 var $966=$965;
 HEAP32[((36656)>>2)]=$966;
 var $967=HEAP32[((9096)>>2)];
 var $968=$967<<3;
 var $969=(Math_imul($968,$967)|0);
 var $970=_xmalloc($969);
 var $971=$970;
 HEAP32[((36632)>>2)]=$971;
 var $972=HEAP32[((9064)>>2)];
 var $973=HEAP32[((9096)>>2)];
 var $974=$972<<3;
 var $975=(Math_imul($974,$973)|0);
 var $976=_xmalloc($975);
 var $977=$976;
 HEAP32[((36616)>>2)]=$977;
 var $978=HEAP32[((9064)>>2)];
 var $979=$978<<3;
 var $980=_xmalloc($979);
 var $981=$980;
 HEAP32[((36608)>>2)]=$981;
 var $982=HEAP32[((9064)>>2)];
 var $983=$982<<3;
 var $984=_xmalloc($983);
 var $985=$984;
 HEAP32[((36592)>>2)]=$985;
 var $986=HEAP32[((14112)>>2)];
 var $987=(($986+12)|0);
 var $988=HEAP32[(($987)>>2)];
 var $989=($988|0)>0;
 if($989){var $i_229_i_i_i=0;var $k_030_i_i_i=0;var $990=$986;label=196;break;}else{label=199;break;}
 case 196: 
 var $990;
 var $k_030_i_i_i;
 var $i_229_i_i_i;
 var $991=HEAP32[((9152)>>2)];
 var $992=(($991+($i_229_i_i_i<<2))|0);
 var $993=HEAP32[(($992)>>2)];
 var $994=($993|0)==0;
 if($994){label=197;break;}else{var $k_1_i_i_i=$k_030_i_i_i;var $1005=$990;label=198;break;}
 case 197: 
 var $996=HEAP32[((4120)>>2)];
 var $997=(($990+20+((($996)*(24))&-1)+20)|0);
 var $998=HEAP32[(($997)>>2)];
 var $999=(($998+($i_229_i_i_i<<3))|0);
 var $1000=HEAPF64[(($999)>>3)];
 var $ld$78$0=(($999)|0);
 var $1000$$SHADOW$0=HEAP32[(($ld$78$0)>>2)];
 var $ld$79$1=(($999+4)|0);
 var $1000$$SHADOW$1=HEAP32[(($ld$79$1)>>2)];
 var $1001=((($k_030_i_i_i)+(1))|0);
 var $1002=HEAP32[((36608)>>2)];
 var $1003=(($1002+($k_030_i_i_i<<3))|0);
 HEAPF64[(($1003)>>3)]=$1000;
 var $_pre47_i_i_i=HEAP32[((14112)>>2)];
 var $k_1_i_i_i=$1001;var $1005=$_pre47_i_i_i;label=198;break;
 case 198: 
 var $1005;
 var $k_1_i_i_i;
 var $1006=((($i_229_i_i_i)+(1))|0);
 var $1007=(($1005+12)|0);
 var $1008=HEAP32[(($1007)>>2)];
 var $1009=($1006|0)<($1008|0);
 if($1009){var $i_229_i_i_i=$1006;var $k_030_i_i_i=$k_1_i_i_i;var $990=$1005;label=196;break;}else{label=199;break;}
 case 199: 
 HEAPF64[((16)>>3)]=0;
 var $1010=HEAP32[((9064)>>2)];
 var $1011=($1010|0)>0;
 if($1011){label=201;break;}else{label=200;break;}
 case 200: 
 var $1012=($1010|0);
 var $1013=(0)/($1012);
 HEAPF64[((16)>>3)]=$1013;
 HEAPF64[((688)>>3)]=0;
 label=207;break;
 case 201: 
 var $1014=HEAP32[((36608)>>2)];
 var $i_325_i_i_i=0;var $1016=0;label=202;break;
 case 202: 
 var $1016;
 var $i_325_i_i_i;
 var $1017=(($1014+($i_325_i_i_i<<3))|0);
 var $1018=HEAPF64[(($1017)>>3)];
 var $ld$80$0=(($1017)|0);
 var $1018$$SHADOW$0=HEAP32[(($ld$80$0)>>2)];
 var $ld$81$1=(($1017+4)|0);
 var $1018$$SHADOW$1=HEAP32[(($ld$81$1)>>2)];
 var $1019=($1016)+($1018);
 HEAPF64[((16)>>3)]=$1019;
 var $1020=((($i_325_i_i_i)+(1))|0);
 var $1021=($1020|0)<($1010|0);
 if($1021){var $i_325_i_i_i=$1020;var $1016=$1019;label=202;break;}else{label=203;break;}
 case 203: 
 var $1022=($1010|0);
 var $1023=($1019)/($1022);
 HEAPF64[((16)>>3)]=$1023;
 HEAPF64[((688)>>3)]=0;
 var $i_424_i_i_i=0;var $1025=0;label=204;break;
 case 204: 
 var $1025;
 var $i_424_i_i_i;
 var $1026=(($1014+($i_424_i_i_i<<3))|0);
 var $1027=HEAPF64[(($1026)>>3)];
 var $ld$82$0=(($1026)|0);
 var $1027$$SHADOW$0=HEAP32[(($ld$82$0)>>2)];
 var $ld$83$1=(($1026+4)|0);
 var $1027$$SHADOW$1=HEAP32[(($ld$83$1)>>2)];
 var $1028=($1027)-($1023);
 var $1029=($1028)*($1028);
 var $1030=($1025)+($1029);
 HEAPF64[((688)>>3)]=$1030;
 var $1031=((($i_424_i_i_i)+(1))|0);
 var $1032=($1031|0)<($1010|0);
 if($1032){var $i_424_i_i_i=$1031;var $1025=$1030;label=204;break;}else{label=205;break;}
 case 205: 
 var $1033=HEAP32[((36616)>>2)];
 var $1034=HEAP32[((9096)>>2)];
 var $i_040_i_i_i=0;label=206;break;
 case 206: 
 var $i_040_i_i_i;
 var $1036=(Math_imul($i_040_i_i_i,$1034)|0);
 var $1037=(($1033+($1036<<3))|0);
 HEAPF64[(($1037)>>3)]=1;
 var $1038=((($i_040_i_i_i)+(1))|0);
 var $1039=($1038|0)<($1010|0);
 if($1039){var $i_040_i_i_i=$1038;label=206;break;}else{label=207;break;}
 case 207: 
 HEAP32[((9048)>>2)]=1;
 var $1040=HEAP32[((8984)>>2)];
 var $1041=($1040|0)>0;
 if($1041){var $i_137_i_i_i=0;var $1045=1;label=209;break;}else{var $_lcssa36_i_i_i=$1040;var $1043=$1010;var $1042=1;label=208;break;}
 case 208: 
 var $1042;
 var $1043;
 var $_lcssa36_i_i_i;
 var $i_227_i_i_i=((($_lcssa36_i_i_i)-(1))|0);
 var $1044=($i_227_i_i_i|0)>0;
 if($1044){var $i_2_in28_i_i_i=$_lcssa36_i_i_i;var $i_229_i10_i_i=$i_227_i_i_i;label=242;break;}else{label=243;break;}
 case 209: 
 var $1045;
 var $i_137_i_i_i;
 var $1046=((4928+($i_137_i_i_i<<2))|0);
 var $1047=HEAP32[(($1046)>>2)];
 var $1048=HEAP32[((14112)>>2)];
 var $1049=(($1048+20+((($1047)*(24))&-1)+8)|0);
 var $1050=HEAP32[(($1049)>>2)];
 var $1051=($1050|0)>0;
 if($1051){var $j_030_i_i_i=0;var $1052=$1048;label=211;break;}else{label=210;break;}
 case 210: 
 var $_pre49_i_i_i=HEAP32[((11160)>>2)];
 var $1093=$1045;var $1092=$_pre49_i_i_i;label=221;break;
 case 211: 
 var $1052;
 var $j_030_i_i_i;
 var $1053=(($1052+12)|0);
 var $1054=HEAP32[(($1053)>>2)];
 var $1055=($1054|0)>0;
 if($1055){label=212;break;}else{label=216;break;}
 case 212: 
 var $1056=($j_030_i_i_i|0);
 var $i_05_i_i_i_i=0;var $k_06_i_i_i_i=0;var $1057=$1052;label=213;break;
 case 213: 
 var $1057;
 var $k_06_i_i_i_i;
 var $i_05_i_i_i_i;
 var $1058=HEAP32[((9152)>>2)];
 var $1059=(($1058+($i_05_i_i_i_i<<2))|0);
 var $1060=HEAP32[(($1059)>>2)];
 var $1061=($1060|0)==0;
 if($1061){label=214;break;}else{var $k_1_i_i_i_i=$k_06_i_i_i_i;var $1077=$1057;label=215;break;}
 case 214: 
 var $1063=(($1057+20+((($1047)*(24))&-1)+20)|0);
 var $1064=HEAP32[(($1063)>>2)];
 var $1065=(($1064+($i_05_i_i_i_i<<3))|0);
 var $1066=HEAPF64[(($1065)>>3)];
 var $ld$84$0=(($1065)|0);
 var $1066$$SHADOW$0=HEAP32[(($ld$84$0)>>2)];
 var $ld$85$1=(($1065+4)|0);
 var $1066$$SHADOW$1=HEAP32[(($ld$85$1)>>2)];
 var $1067=$1066==$1056;
 var $1068=($1067&1);
 var $1069=($1068|0);
 var $1070=HEAP32[((9048)>>2)];
 var $1071=HEAP32[((36616)>>2)];
 var $1072=((($k_06_i_i_i_i)+(1))|0);
 var $1073=HEAP32[((9096)>>2)];
 var $1074=(Math_imul($1073,$k_06_i_i_i_i)|0);
 var $_sum_i_i_i_i=((($1074)+($1070))|0);
 var $1075=(($1071+($_sum_i_i_i_i<<3))|0);
 HEAPF64[(($1075)>>3)]=$1069;
 var $_pre_i_i_i_i9=HEAP32[((14112)>>2)];
 var $k_1_i_i_i_i=$1072;var $1077=$_pre_i_i_i_i9;label=215;break;
 case 215: 
 var $1077;
 var $k_1_i_i_i_i;
 var $1078=((($i_05_i_i_i_i)+(1))|0);
 var $1079=(($1077+12)|0);
 var $1080=HEAP32[(($1079)>>2)];
 var $1081=($1078|0)<($1080|0);
 if($1081){var $i_05_i_i_i_i=$1078;var $k_06_i_i_i_i=$k_1_i_i_i_i;var $1057=$1077;label=213;break;}else{label=216;break;}
 case 216: 
 var $1082=HEAP32[((9048)>>2)];
 var $1083=((($1082)+(1))|0);
 HEAP32[((9048)>>2)]=$1083;
 var $1084=_compute_G181();
 HEAP32[((11160)>>2)]=$1084;
 var $1085=($1084|0)==-1;
 if($1085){label=217;break;}else{label=218;break;}
 case 217: 
 var $1087=HEAP32[((9048)>>2)];
 var $1088=((($1087)-(1))|0);
 HEAP32[((9048)>>2)]=$1088;
 label=218;break;
 case 218: 
 var $1089=((($j_030_i_i_i)+(1))|0);
 var $1090=($1089|0)<($1050|0);
 if($1090){label=219;break;}else{label=220;break;}
 case 219: 
 var $_pre51_i6_i_i=HEAP32[((14112)>>2)];
 var $j_030_i_i_i=$1089;var $1052=$_pre51_i6_i_i;label=211;break;
 case 220: 
 var $_pre_i7_i_i=HEAP32[((9048)>>2)];
 var $1093=$_pre_i7_i_i;var $1092=$1084;label=221;break;
 case 221: 
 var $1092;
 var $1093;
 var $1094=((13600+($i_137_i_i_i<<2))|0);
 HEAP32[(($1094)>>2)]=$1093;
 var $1095=($1092|0)==-1;
 if($1095){label=222;break;}else{var $1098=$1093;label=223;break;}
 case 222: 
 var $1097=_compute_G181();
 var $_pre47_i9_i_i=HEAP32[((9048)>>2)];
 var $1098=$_pre47_i9_i_i;label=223;break;
 case 223: 
 var $1098;
 var $1099=($1098|0)>0;
 var $1100=HEAP32[((9064)>>2)];
 if($1099){label=224;break;}else{label=232;break;}
 case 224: 
 var $1101=($1100|0)>0;
 var $1102=HEAP32[((36632)>>2)];
 var $1103=HEAP32[((36616)>>2)];
 var $1104=HEAP32[((9096)>>2)];
 var $1105=HEAP32[((36608)>>2)];
 var $i_030_i_i_i_i=0;label=225;break;
 case 225: 
 var $i_030_i_i_i_i;
 if($1101){var $j_025_i_i_i_i=0;var $t_026_i_i_i_i=0;label=227;break;}else{var $t_0_lcssa_i_i_i_i=0;label=228;break;}
 case 226: 
 var $1106=HEAP32[((36672)>>2)];
 var $1107=HEAP32[((36656)>>2)];
 var $i_122_i_i_i_i=0;label=229;break;
 case 227: 
 var $t_026_i_i_i_i;
 var $j_025_i_i_i_i;
 var $1108=(Math_imul($j_025_i_i_i_i,$1104)|0);
 var $_sum18_i_i_i_i=((($1108)+($i_030_i_i_i_i))|0);
 var $1109=(($1103+($_sum18_i_i_i_i<<3))|0);
 var $1110=HEAPF64[(($1109)>>3)];
 var $ld$86$0=(($1109)|0);
 var $1110$$SHADOW$0=HEAP32[(($ld$86$0)>>2)];
 var $ld$87$1=(($1109+4)|0);
 var $1110$$SHADOW$1=HEAP32[(($ld$87$1)>>2)];
 var $1111=(($1105+($j_025_i_i_i_i<<3))|0);
 var $1112=HEAPF64[(($1111)>>3)];
 var $ld$88$0=(($1111)|0);
 var $1112$$SHADOW$0=HEAP32[(($ld$88$0)>>2)];
 var $ld$89$1=(($1111+4)|0);
 var $1112$$SHADOW$1=HEAP32[(($ld$89$1)>>2)];
 var $1113=($1110)*($1112);
 var $1114=($t_026_i_i_i_i)+($1113);
 var $1115=((($j_025_i_i_i_i)+(1))|0);
 var $1116=($1115|0)<($1100|0);
 if($1116){var $j_025_i_i_i_i=$1115;var $t_026_i_i_i_i=$1114;label=227;break;}else{var $t_0_lcssa_i_i_i_i=$1114;label=228;break;}
 case 228: 
 var $t_0_lcssa_i_i_i_i;
 var $1117=(($1102+($i_030_i_i_i_i<<3))|0);
 HEAPF64[(($1117)>>3)]=$t_0_lcssa_i_i_i_i;
 var $1118=((($i_030_i_i_i_i)+(1))|0);
 var $1119=($1118|0)<($1098|0);
 if($1119){var $i_030_i_i_i_i=$1118;label=225;break;}else{label=226;break;}
 case 229: 
 var $i_122_i_i_i_i;
 var $1120=(Math_imul($i_122_i_i_i_i,$1104)|0);
 var $j_119_i_i_i_i=0;var $t_120_i_i_i_i=0;label=230;break;
 case 230: 
 var $t_120_i_i_i_i;
 var $j_119_i_i_i_i;
 var $_sum_i18_i_i_i=((($j_119_i_i_i_i)+($1120))|0);
 var $1122=(($1107+($_sum_i18_i_i_i<<3))|0);
 var $1123=HEAPF64[(($1122)>>3)];
 var $ld$90$0=(($1122)|0);
 var $1123$$SHADOW$0=HEAP32[(($ld$90$0)>>2)];
 var $ld$91$1=(($1122+4)|0);
 var $1123$$SHADOW$1=HEAP32[(($ld$91$1)>>2)];
 var $1124=(($1102+($j_119_i_i_i_i<<3))|0);
 var $1125=HEAPF64[(($1124)>>3)];
 var $ld$92$0=(($1124)|0);
 var $1125$$SHADOW$0=HEAP32[(($ld$92$0)>>2)];
 var $ld$93$1=(($1124+4)|0);
 var $1125$$SHADOW$1=HEAP32[(($ld$93$1)>>2)];
 var $1126=($1123)*($1125);
 var $1127=($t_120_i_i_i_i)+($1126);
 var $1128=((($j_119_i_i_i_i)+(1))|0);
 var $1129=($1128|0)<($1098|0);
 if($1129){var $j_119_i_i_i_i=$1128;var $t_120_i_i_i_i=$1127;label=230;break;}else{label=231;break;}
 case 231: 
 var $1130=(($1106+($i_122_i_i_i_i<<3))|0);
 HEAPF64[(($1130)>>3)]=$1127;
 var $1131=((($i_122_i_i_i_i)+(1))|0);
 var $1132=($1131|0)<($1098|0);
 if($1132){var $i_122_i_i_i_i=$1131;label=229;break;}else{label=232;break;}
 case 232: 
 var $1133=($1100|0)>0;
 if($1133){label=234;break;}else{label=233;break;}
 case 233: 
 HEAPF64[((48)>>3)]=0;
 HEAPF64[((64)>>3)]=0;
 var $1168=0;label=241;break;
 case 234: 
 var $1134=HEAP32[((36592)>>2)];
 var $1135=HEAP32[((36616)>>2)];
 var $1136=HEAP32[((9096)>>2)];
 var $1137=HEAP32[((36672)>>2)];
 var $i_010_i_i_i_i=0;label=235;break;
 case 235: 
 var $i_010_i_i_i_i;
 if($1099){label=236;break;}else{var $t_0_lcssa_i25_i_i_i=0;label=238;break;}
 case 236: 
 var $1138=(Math_imul($i_010_i_i_i_i,$1136)|0);
 var $j_08_i_i_i_i=0;var $t_09_i_i_i_i=0;label=237;break;
 case 237: 
 var $t_09_i_i_i_i;
 var $j_08_i_i_i_i;
 var $_sum_i24_i_i_i=((($j_08_i_i_i_i)+($1138))|0);
 var $1140=(($1135+($_sum_i24_i_i_i<<3))|0);
 var $1141=HEAPF64[(($1140)>>3)];
 var $ld$94$0=(($1140)|0);
 var $1141$$SHADOW$0=HEAP32[(($ld$94$0)>>2)];
 var $ld$95$1=(($1140+4)|0);
 var $1141$$SHADOW$1=HEAP32[(($ld$95$1)>>2)];
 var $1142=(($1137+($j_08_i_i_i_i<<3))|0);
 var $1143=HEAPF64[(($1142)>>3)];
 var $ld$96$0=(($1142)|0);
 var $1143$$SHADOW$0=HEAP32[(($ld$96$0)>>2)];
 var $ld$97$1=(($1142+4)|0);
 var $1143$$SHADOW$1=HEAP32[(($ld$97$1)>>2)];
 var $1144=($1141)*($1143);
 var $1145=($t_09_i_i_i_i)+($1144);
 var $1146=((($j_08_i_i_i_i)+(1))|0);
 var $1147=($1146|0)<($1098|0);
 if($1147){var $j_08_i_i_i_i=$1146;var $t_09_i_i_i_i=$1145;label=237;break;}else{var $t_0_lcssa_i25_i_i_i=$1145;label=238;break;}
 case 238: 
 var $t_0_lcssa_i25_i_i_i;
 var $1148=(($1134+($i_010_i_i_i_i<<3))|0);
 HEAPF64[(($1148)>>3)]=$t_0_lcssa_i25_i_i_i;
 var $1149=((($i_010_i_i_i_i)+(1))|0);
 var $1150=($1149|0)<($1100|0);
 if($1150){var $i_010_i_i_i_i=$1149;label=235;break;}else{label=239;break;}
 case 239: 
 HEAPF64[((48)>>3)]=0;
 HEAPF64[((64)>>3)]=0;
 var $1151=HEAP32[((36608)>>2)];
 var $_pre_i19_i_i_i=HEAPF64[((16)>>3)];
 var $ld$98$0=16;
 var $_pre_i19_i_i_i$$SHADOW$0=HEAP32[(($ld$98$0)>>2)];
 var $ld$99$1=20;
 var $_pre_i19_i_i_i$$SHADOW$1=HEAP32[(($ld$99$1)>>2)];
 var $i_08_i_i_i_i=0;var $1154=0;var $1153=0;label=240;break;
 case 240: 
 var $1153;
 var $1154;
 var $i_08_i_i_i_i;
 var $1155=(($1134+($i_08_i_i_i_i<<3))|0);
 var $1156=HEAPF64[(($1155)>>3)];
 var $ld$100$0=(($1155)|0);
 var $1156$$SHADOW$0=HEAP32[(($ld$100$0)>>2)];
 var $ld$101$1=(($1155+4)|0);
 var $1156$$SHADOW$1=HEAP32[(($ld$101$1)>>2)];
 var $1157=($1156)-($_pre_i19_i_i_i);
 var $1158=($1157)*($1157);
 var $1159=($1154)+($1158);
 HEAPF64[((48)>>3)]=$1159;
 var $1160=(($1151+($i_08_i_i_i_i<<3))|0);
 var $1161=HEAPF64[(($1160)>>3)];
 var $ld$102$0=(($1160)|0);
 var $1161$$SHADOW$0=HEAP32[(($ld$102$0)>>2)];
 var $ld$103$1=(($1160+4)|0);
 var $1161$$SHADOW$1=HEAP32[(($ld$103$1)>>2)];
 var $1162=HEAPF64[(($1155)>>3)];
 var $ld$104$0=(($1155)|0);
 var $1162$$SHADOW$0=HEAP32[(($ld$104$0)>>2)];
 var $ld$105$1=(($1155+4)|0);
 var $1162$$SHADOW$1=HEAP32[(($ld$105$1)>>2)];
 var $1163=($1161)-($1162);
 var $1164=($1163)*($1163);
 var $1165=($1153)+($1164);
 HEAPF64[((64)>>3)]=$1165;
 var $1166=((($i_08_i_i_i_i)+(1))|0);
 var $1167=($1166|0)<($1100|0);
 if($1167){var $i_08_i_i_i_i=$1166;var $1154=$1159;var $1153=$1165;label=240;break;}else{var $1168=$1159;label=241;break;}
 case 241: 
 var $1168;
 var $1169=((7936+($i_137_i_i_i<<3))|0);
 HEAPF64[(($1169)>>3)]=$1168;
 var $1170=((($i_137_i_i_i)+(1))|0);
 var $1171=HEAP32[((8984)>>2)];
 var $1172=($1170|0)<($1171|0);
 if($1172){var $i_137_i_i_i=$1170;var $1045=$1098;label=209;break;}else{var $_lcssa36_i_i_i=$1171;var $1043=$1100;var $1042=$1098;label=208;break;}
 case 242: 
 var $i_229_i10_i_i;
 var $i_2_in28_i_i_i;
 var $1173=((($i_2_in28_i_i_i)-(2))|0);
 var $1174=((13600+($1173<<2))|0);
 var $1175=HEAP32[(($1174)>>2)];
 var $1176=((13600+($i_229_i10_i_i<<2))|0);
 var $1177=HEAP32[(($1176)>>2)];
 var $1178=((($1177)-($1175))|0);
 HEAP32[(($1176)>>2)]=$1178;
 var $1179=((7936+($1173<<3))|0);
 var $1180=HEAPF64[(($1179)>>3)];
 var $ld$106$0=(($1179)|0);
 var $1180$$SHADOW$0=HEAP32[(($ld$106$0)>>2)];
 var $ld$107$1=(($1179+4)|0);
 var $1180$$SHADOW$1=HEAP32[(($ld$107$1)>>2)];
 var $1181=((7936+($i_229_i10_i_i<<3))|0);
 var $1182=HEAPF64[(($1181)>>3)];
 var $ld$108$0=(($1181)|0);
 var $1182$$SHADOW$0=HEAP32[(($ld$108$0)>>2)];
 var $ld$109$1=(($1181+4)|0);
 var $1182$$SHADOW$1=HEAP32[(($ld$109$1)>>2)];
 var $1183=($1182)-($1180);
 HEAPF64[(($1181)>>3)]=$1183;
 var $i_2_i_i_i=((($i_229_i10_i_i)-(1))|0);
 var $1184=($i_2_i_i_i|0)>0;
 if($1184){var $i_2_in28_i_i_i=$i_229_i10_i_i;var $i_229_i10_i_i=$i_2_i_i_i;label=242;break;}else{label=243;break;}
 case 243: 
 var $1185=HEAP32[((13600)>>2)];
 var $1186=((($1185)-(1))|0);
 HEAP32[((13600)>>2)]=$1186;
 var $1187=((($1043)-($1042))|0);
 var $1188=($1187|0);
 HEAPF64[((664)>>3)]=$1188;
 var $1189=HEAPF64[((64)>>3)];
 var $ld$110$0=64;
 var $1189$$SHADOW$0=HEAP32[(($ld$110$0)>>2)];
 var $ld$111$1=68;
 var $1189$$SHADOW$1=HEAP32[(($ld$111$1)>>2)];
 var $1190=($1189)/($1188);
 HEAPF64[((224)>>3)]=$1190;
 var $1191=Math_sqrt($1190);
 HEAPF64[((96)>>3)]=$1191;
 var $1192=HEAPF64[((48)>>3)];
 var $ld$112$0=48;
 var $1192$$SHADOW$0=HEAP32[(($ld$112$0)>>2)];
 var $ld$113$1=52;
 var $1192$$SHADOW$1=HEAP32[(($ld$113$1)>>2)];
 var $1193=((($1042)-(1))|0);
 var $1194=($1193|0);
 var $1195=($1192)/($1194);
 HEAPF64[((208)>>3)]=$1195;
 var $1196=($1195)/($1190);
 HEAPF64[((576)>>3)]=$1196;
 var $1197=_fdist($1196,$1194,$1188);
 var $1198=(1)-($1197);
 HEAPF64[((112)>>3)]=$1198;
 var $1199=HEAPF64[((64)>>3)];
 var $ld$114$0=64;
 var $1199$$SHADOW$0=HEAP32[(($ld$114$0)>>2)];
 var $ld$115$1=68;
 var $1199$$SHADOW$1=HEAP32[(($ld$115$1)>>2)];
 var $1200=HEAPF64[((688)>>3)];
 var $ld$116$0=688;
 var $1200$$SHADOW$0=HEAP32[(($ld$116$0)>>2)];
 var $ld$117$1=692;
 var $1200$$SHADOW$1=HEAP32[(($ld$117$1)>>2)];
 var $1201=($1199)/($1200);
 var $1202=(1)-($1201);
 HEAPF64[((80)>>3)]=$1202;
 var $1203=HEAPF64[((96)>>3)];
 var $ld$118$0=96;
 var $1203$$SHADOW$0=HEAP32[(($ld$118$0)>>2)];
 var $ld$119$1=100;
 var $1203$$SHADOW$1=HEAP32[(($ld$119$1)>>2)];
 var $1204=($1203)*(100);
 var $1205=HEAPF64[((16)>>3)];
 var $ld$120$0=16;
 var $1205$$SHADOW$0=HEAP32[(($ld$120$0)>>2)];
 var $ld$121$1=20;
 var $1205$$SHADOW$1=HEAP32[(($ld$121$1)>>2)];
 var $1206=($1204)/($1205);
 HEAPF64[((680)>>3)]=$1206;
 _print_title();
 var $1207=HEAP32[((9072)>>2)];
 var $1208=($1207|0)==0;
 if($1208){label=245;break;}else{label=244;break;}
 case 244: 
 var $1210=_sprintf(24920,3544,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$1207,tempVarArgs)); STACKTOP=tempVarArgs;
 _emit_line(24920);
 label=245;break;
 case 245: 
 _emit_line_center(2808);
 _emit_line(36048);
 var $1212=_xmalloc(96);
 var $1213=$1212;
 var $1214=_strdup(1440);
 HEAP32[(($1213)>>2)]=$1214;
 var $1215=_strdup(1144);
 var $1216=(($1212+4)|0);
 var $1217=$1216;
 HEAP32[(($1217)>>2)]=$1215;
 var $1218=_strdup(3096);
 var $1219=(($1212+8)|0);
 var $1220=$1219;
 HEAP32[(($1220)>>2)]=$1218;
 var $1221=_strdup(976);
 var $1222=(($1212+12)|0);
 var $1223=$1222;
 HEAP32[(($1223)>>2)]=$1221;
 var $1224=_strdup(856);
 var $1225=(($1212+16)|0);
 var $1226=$1225;
 HEAP32[(($1226)>>2)]=$1224;
 var $1227=_strdup(840);
 var $1228=(($1212+20)|0);
 var $1229=$1228;
 HEAP32[(($1229)>>2)]=$1227;
 var $1230=_strdup(3048);
 var $1231=(($1212+24)|0);
 var $1232=$1231;
 HEAP32[(($1232)>>2)]=$1230;
 var $1233=HEAP32[((9048)>>2)];
 var $1234=((($1233)-(1))|0);
 var $1235=_sprintf(24920,4048,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$1234,tempVarArgs)); STACKTOP=tempVarArgs;
 var $1236=_strdup(24920);
 var $1237=(($1212+28)|0);
 var $1238=$1237;
 HEAP32[(($1238)>>2)]=$1236;
 var $1239=HEAPF64[((48)>>3)];
 var $ld$122$0=48;
 var $1239$$SHADOW$0=HEAP32[(($ld$122$0)>>2)];
 var $ld$123$1=52;
 var $1239$$SHADOW$1=HEAP32[(($ld$123$1)>>2)];
 var $1240=_sprintf(24920,3832,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$1239,tempVarArgs)); STACKTOP=tempVarArgs;
 var $1241=_strdup(24920);
 var $1242=(($1212+32)|0);
 var $1243=$1242;
 HEAP32[(($1243)>>2)]=$1241;
 var $1244=HEAPF64[((208)>>3)];
 var $ld$124$0=208;
 var $1244$$SHADOW$0=HEAP32[(($ld$124$0)>>2)];
 var $ld$125$1=212;
 var $1244$$SHADOW$1=HEAP32[(($ld$125$1)>>2)];
 var $1245=_sprintf(24920,3832,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$1244,tempVarArgs)); STACKTOP=tempVarArgs;
 var $1246=_strdup(24920);
 var $1247=(($1212+36)|0);
 var $1248=$1247;
 HEAP32[(($1248)>>2)]=$1246;
 var $1249=HEAPF64[((576)>>3)];
 var $ld$126$0=576;
 var $1249$$SHADOW$0=HEAP32[(($ld$126$0)>>2)];
 var $ld$127$1=580;
 var $1249$$SHADOW$1=HEAP32[(($ld$127$1)>>2)];
 var $1250=_sprintf(24920,3712,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$1249,tempVarArgs)); STACKTOP=tempVarArgs;
 var $1251=_strdup(24920);
 var $1252=(($1212+40)|0);
 var $1253=$1252;
 HEAP32[(($1253)>>2)]=$1251;
 var $1254=HEAPF64[((112)>>3)];
 var $ld$128$0=112;
 var $1254$$SHADOW$0=HEAP32[(($ld$128$0)>>2)];
 var $ld$129$1=116;
 var $1254$$SHADOW$1=HEAP32[(($ld$129$1)>>2)];
 var $1255=_sprintf(24920,3592,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$1254,tempVarArgs)); STACKTOP=tempVarArgs;
 var $1256=_strdup(24920);
 var $1257=(($1212+44)|0);
 var $1258=$1257;
 HEAP32[(($1258)>>2)]=$1256;
 var $1259=_strdup(2928);
 var $1260=(($1212+48)|0);
 var $1261=$1260;
 HEAP32[(($1261)>>2)]=$1259;
 var $1262=HEAP32[((9064)>>2)];
 var $1263=HEAP32[((9048)>>2)];
 var $1264=((($1262)-($1263))|0);
 var $1265=_sprintf(24920,4048,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$1264,tempVarArgs)); STACKTOP=tempVarArgs;
 var $1266=_strdup(24920);
 var $1267=(($1212+52)|0);
 var $1268=$1267;
 HEAP32[(($1268)>>2)]=$1266;
 var $1269=HEAPF64[((64)>>3)];
 var $ld$130$0=64;
 var $1269$$SHADOW$0=HEAP32[(($ld$130$0)>>2)];
 var $ld$131$1=68;
 var $1269$$SHADOW$1=HEAP32[(($ld$131$1)>>2)];
 var $1270=_sprintf(24920,3832,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$1269,tempVarArgs)); STACKTOP=tempVarArgs;
 var $1271=_strdup(24920);
 var $1272=(($1212+56)|0);
 var $1273=$1272;
 HEAP32[(($1273)>>2)]=$1271;
 var $1274=HEAPF64[((224)>>3)];
 var $ld$132$0=224;
 var $1274$$SHADOW$0=HEAP32[(($ld$132$0)>>2)];
 var $ld$133$1=228;
 var $1274$$SHADOW$1=HEAP32[(($ld$133$1)>>2)];
 var $1275=_sprintf(24920,3832,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$1274,tempVarArgs)); STACKTOP=tempVarArgs;
 var $1276=_strdup(24920);
 var $1277=(($1212+60)|0);
 var $1278=$1277;
 HEAP32[(($1278)>>2)]=$1276;
 var $1279=_strdup(36048);
 var $1280=(($1212+64)|0);
 var $1281=$1280;
 HEAP32[(($1281)>>2)]=$1279;
 var $1282=_strdup(36048);
 var $1283=(($1212+68)|0);
 var $1284=$1283;
 HEAP32[(($1284)>>2)]=$1282;
 var $1285=_strdup(2888);
 var $1286=(($1212+72)|0);
 var $1287=$1286;
 HEAP32[(($1287)>>2)]=$1285;
 var $1288=HEAP32[((9064)>>2)];
 var $1289=((($1288)-(1))|0);
 var $1290=_sprintf(24920,4048,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$1289,tempVarArgs)); STACKTOP=tempVarArgs;
 var $1291=_strdup(24920);
 var $1292=(($1212+76)|0);
 var $1293=$1292;
 HEAP32[(($1293)>>2)]=$1291;
 var $1294=HEAPF64[((688)>>3)];
 var $ld$134$0=688;
 var $1294$$SHADOW$0=HEAP32[(($ld$134$0)>>2)];
 var $ld$135$1=692;
 var $1294$$SHADOW$1=HEAP32[(($ld$135$1)>>2)];
 var $1295=_sprintf(24920,3832,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$1294,tempVarArgs)); STACKTOP=tempVarArgs;
 var $1296=_strdup(24920);
 var $1297=(($1212+80)|0);
 var $1298=$1297;
 HEAP32[(($1298)>>2)]=$1296;
 var $1299=_strdup(36048);
 var $1300=(($1212+84)|0);
 var $1301=$1300;
 HEAP32[(($1301)>>2)]=$1299;
 var $1302=_strdup(36048);
 var $1303=(($1212+88)|0);
 var $1304=$1303;
 HEAP32[(($1304)>>2)]=$1302;
 var $1305=_strdup(36048);
 var $1306=(($1212+92)|0);
 var $1307=$1306;
 HEAP32[(($1307)>>2)]=$1305;
 HEAP8[(24920)]=1;
 HEAP8[(24921)]=0; HEAP8[(24922)]=0; HEAP8[(24923)]=0; HEAP8[(24924)]=0; HEAP8[(24925)]=0;
 _print_table_and_free($1213,4,6,24920);
 var $1308=_xmalloc(32);
 var $1309=$1308;
 var $1310=_strdup(3456);
 HEAP32[(($1309)>>2)]=$1310;
 var $1311=_strdup(3360);
 var $1312=(($1308+4)|0);
 var $1313=$1312;
 HEAP32[(($1313)>>2)]=$1311;
 var $1314=_strdup(3296);
 var $1315=(($1308+8)|0);
 var $1316=$1315;
 HEAP32[(($1316)>>2)]=$1314;
 var $1317=HEAP32[((4120)>>2)];
 var $1318=HEAP32[((14112)>>2)];
 var $1319=(($1318+20+((($1317)*(24))&-1))|0);
 var $1320=HEAP32[(($1319)>>2)];
 var $1321=_sprintf(24920,3224,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$1320,tempVarArgs)); STACKTOP=tempVarArgs;
 var $1322=_strdup(24920);
 var $1323=(($1308+12)|0);
 var $1324=$1323;
 HEAP32[(($1324)>>2)]=$1322;
 var $1325=HEAPF64[((80)>>3)];
 var $ld$136$0=80;
 var $1325$$SHADOW$0=HEAP32[(($ld$136$0)>>2)];
 var $ld$137$1=84;
 var $1325$$SHADOW$1=HEAP32[(($ld$137$1)>>2)];
 var $1326=_sprintf(24920,3152,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$1325,tempVarArgs)); STACKTOP=tempVarArgs;
 var $1327=_strdup(24920);
 var $1328=(($1308+16)|0);
 var $1329=$1328;
 HEAP32[(($1329)>>2)]=$1327;
 var $1330=HEAPF64[((680)>>3)];
 var $ld$138$0=680;
 var $1330$$SHADOW$0=HEAP32[(($ld$138$0)>>2)];
 var $ld$139$1=684;
 var $1330$$SHADOW$1=HEAP32[(($ld$139$1)>>2)];
 var $1331=_sprintf(24920,3152,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$1330,tempVarArgs)); STACKTOP=tempVarArgs;
 var $1332=_strdup(24920);
 var $1333=(($1308+20)|0);
 var $1334=$1333;
 HEAP32[(($1334)>>2)]=$1332;
 var $1335=HEAPF64[((96)>>3)];
 var $ld$140$0=96;
 var $1335$$SHADOW$0=HEAP32[(($ld$140$0)>>2)];
 var $ld$141$1=100;
 var $1335$$SHADOW$1=HEAP32[(($ld$141$1)>>2)];
 var $1336=_sprintf(24920,3152,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$1335,tempVarArgs)); STACKTOP=tempVarArgs;
 var $1337=_strdup(24920);
 var $1338=(($1308+24)|0);
 var $1339=$1338;
 HEAP32[(($1339)>>2)]=$1337;
 var $1340=HEAPF64[((16)>>3)];
 var $ld$142$0=16;
 var $1340$$SHADOW$0=HEAP32[(($ld$142$0)>>2)];
 var $ld$143$1=20;
 var $1340$$SHADOW$1=HEAP32[(($ld$143$1)>>2)];
 var $1341=_sprintf(24920,3152,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$1340,tempVarArgs)); STACKTOP=tempVarArgs;
 var $1342=_strdup(24920);
 var $1343=(($1308+28)|0);
 var $1344=$1343;
 HEAP32[(($1344)>>2)]=$1342;
 HEAP32[((24920)>>2)]=0;
 _print_table_and_free($1309,2,4,24920);
 var $1345=HEAP32[((8984)>>2)];
 var $1346=((($1345)*(24))&-1);
 var $1347=((($1346)+(24))|0);
 var $1348=_xmalloc($1347);
 var $1349=$1348;
 var $1350=_strdup(1440);
 HEAP32[(($1349)>>2)]=$1350;
 var $1351=_strdup(1144);
 var $1352=(($1348+4)|0);
 var $1353=$1352;
 HEAP32[(($1353)>>2)]=$1351;
 var $1354=_strdup(1056);
 var $1355=(($1348+8)|0);
 var $1356=$1355;
 HEAP32[(($1356)>>2)]=$1354;
 var $1357=_strdup(976);
 var $1358=(($1348+12)|0);
 var $1359=$1358;
 HEAP32[(($1359)>>2)]=$1357;
 var $1360=_strdup(856);
 var $1361=(($1348+16)|0);
 var $1362=$1361;
 HEAP32[(($1362)>>2)]=$1360;
 var $1363=_strdup(840);
 var $1364=(($1348+20)|0);
 var $1365=$1364;
 HEAP32[(($1365)>>2)]=$1363;
 var $1366=HEAP32[((8984)>>2)];
 var $1367=($1366|0)>0;
 if($1367){var $i_045_i_i=0;label=246;break;}else{var $1424=$1366;label=250;break;}
 case 246: 
 var $i_045_i_i;
 var $1368=((4928+($i_045_i_i<<2))|0);
 var $1369=HEAP32[(($1368)>>2)];
 var $1370=HEAP32[((14112)>>2)];
 var $1371=(($1370+20+((($1369)*(24))&-1))|0);
 var $1372=HEAP32[(($1371)>>2)];
 var $1373=_strdup($1372);
 var $1374=((($i_045_i_i)+(1))|0);
 var $1375=((($1374)*(6))&-1);
 var $1376=(($1349+($1375<<2))|0);
 HEAP32[(($1376)>>2)]=$1373;
 var $1377=((13600+($i_045_i_i<<2))|0);
 var $1378=HEAP32[(($1377)>>2)];
 var $1379=_sprintf(24920,4048,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$1378,tempVarArgs)); STACKTOP=tempVarArgs;
 var $1380=_strdup(24920);
 var $_sum37_i_i=$1375|1;
 var $1381=(($1349+($_sum37_i_i<<2))|0);
 HEAP32[(($1381)>>2)]=$1380;
 var $1382=HEAP32[(($1377)>>2)];
 var $1383=($1382|0)==0;
 if($1383){label=247;break;}else{label=248;break;}
 case 247: 
 var $1385=_strdup(3912);
 var $_sum41_i_i=((($1375)+(2))|0);
 var $1386=(($1349+($_sum41_i_i<<2))|0);
 HEAP32[(($1386)>>2)]=$1385;
 var $1387=_strdup(3912);
 var $_sum42_i_i=((($1375)+(3))|0);
 var $1388=(($1349+($_sum42_i_i<<2))|0);
 HEAP32[(($1388)>>2)]=$1387;
 var $1389=_strdup(3912);
 var $_sum43_i_i=((($1375)+(4))|0);
 var $1390=(($1349+($_sum43_i_i<<2))|0);
 HEAP32[(($1390)>>2)]=$1389;
 var $1391=_strdup(3912);
 var $_sum44_i_i=((($1375)+(5))|0);
 var $1392=(($1349+($_sum44_i_i<<2))|0);
 HEAP32[(($1392)>>2)]=$1391;
 label=249;break;
 case 248: 
 var $1394=((7936+($i_045_i_i<<3))|0);
 var $1395=HEAPF64[(($1394)>>3)];
 var $ld$144$0=(($1394)|0);
 var $1395$$SHADOW$0=HEAP32[(($ld$144$0)>>2)];
 var $ld$145$1=(($1394+4)|0);
 var $1395$$SHADOW$1=HEAP32[(($ld$145$1)>>2)];
 var $1396=_sprintf(24920,3832,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$1395,tempVarArgs)); STACKTOP=tempVarArgs;
 var $1397=_strdup(24920);
 var $_sum_i_i13=((($1375)+(2))|0);
 var $1398=(($1349+($_sum_i_i13<<2))|0);
 HEAP32[(($1398)>>2)]=$1397;
 var $1399=HEAPF64[(($1394)>>3)];
 var $ld$146$0=(($1394)|0);
 var $1399$$SHADOW$0=HEAP32[(($ld$146$0)>>2)];
 var $ld$147$1=(($1394+4)|0);
 var $1399$$SHADOW$1=HEAP32[(($ld$147$1)>>2)];
 var $1400=HEAP32[(($1377)>>2)];
 var $1401=($1400|0);
 var $1402=($1399)/($1401);
 var $1403=_sprintf(24920,3832,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$1402,tempVarArgs)); STACKTOP=tempVarArgs;
 var $1404=_strdup(24920);
 var $_sum38_i_i=((($1375)+(3))|0);
 var $1405=(($1349+($_sum38_i_i<<2))|0);
 HEAP32[(($1405)>>2)]=$1404;
 var $1406=HEAPF64[((224)>>3)];
 var $ld$148$0=224;
 var $1406$$SHADOW$0=HEAP32[(($ld$148$0)>>2)];
 var $ld$149$1=228;
 var $1406$$SHADOW$1=HEAP32[(($ld$149$1)>>2)];
 var $1407=($1402)/($1406);
 var $1408=_sprintf(24920,3712,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$1407,tempVarArgs)); STACKTOP=tempVarArgs;
 var $1409=_strdup(24920);
 var $_sum39_i_i=((($1375)+(4))|0);
 var $1410=(($1349+($_sum39_i_i<<2))|0);
 HEAP32[(($1410)>>2)]=$1409;
 var $1411=HEAP32[(($1377)>>2)];
 var $1412=($1411|0);
 var $1413=HEAP32[((9064)>>2)];
 var $1414=HEAP32[((9048)>>2)];
 var $1415=((($1413)-($1414))|0);
 var $1416=($1415|0);
 var $1417=_fdist($1407,$1412,$1416);
 var $1418=(1)-($1417);
 var $1419=_sprintf(24920,3592,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$1418,tempVarArgs)); STACKTOP=tempVarArgs;
 var $1420=_strdup(24920);
 var $_sum40_i_i=((($1375)+(5))|0);
 var $1421=(($1349+($_sum40_i_i<<2))|0);
 HEAP32[(($1421)>>2)]=$1420;
 label=249;break;
 case 249: 
 var $1422=HEAP32[((8984)>>2)];
 var $1423=($1374|0)<($1422|0);
 if($1423){var $i_045_i_i=$1374;label=246;break;}else{var $1424=$1422;label=250;break;}
 case 250: 
 var $1424;
 HEAP8[(24920)]=1;
 var $1425=((($1424)+(1))|0);
 HEAP8[(24921)]=0; HEAP8[(24922)]=0; HEAP8[(24923)]=0; HEAP8[(24924)]=0; HEAP8[(24925)]=0;
 _print_table_and_free($1349,$1425,6,24920);
 label=2;break;
 case 251: 
 _parse_default();
 label=2;break;
  default: assert(0, "bad label: " + label);
 }
}
function _compute_G181(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP32[((9048)>>2)];
 var $2=($1|0)>0;
 if($2){label=2;break;}else{var $max_0_lcssa=0;var $min_0_lcssa=0;label=16;break;}
 case 2: 
 var $3=HEAP32[((36656)>>2)];
 var $4=HEAP32[((9096)>>2)];
 var $i_0193_us=0;label=5;break;
 case 3: 
 var $6=((($i_0193_us)+(1))|0);
 var $7=($6|0)<($1|0);
 if($7){var $i_0193_us=$6;label=5;break;}else{label=6;break;}
 case 4: 
 var $j_0190_us;
 var $9=($i_0193_us|0)==($j_0190_us|0);
 var $_sum126_us=((($13)+($j_0190_us))|0);
 var $10=(($3+($_sum126_us<<3))|0);
 var $__us=($9?1:0);
 HEAPF64[(($10)>>3)]=$__us;
 var $11=((($j_0190_us)+(1))|0);
 var $12=($11|0)<($1|0);
 if($12){var $j_0190_us=$11;label=4;break;}else{label=3;break;}
 case 5: 
 var $i_0193_us;
 var $13=(Math_imul($4,$i_0193_us)|0);
 var $j_0190_us=0;label=4;break;
 case 6: 
 if($2){label=7;break;}else{var $max_0_lcssa=0;var $min_0_lcssa=0;label=16;break;}
 case 7: 
 var $14=HEAP32[((9064)>>2)];
 var $15=($14|0)>0;
 var $16=HEAP32[((36632)>>2)];
 var $17=HEAP32[((9096)>>2)];
 var $18=HEAP32[((36616)>>2)];
 var $i_1187=0;label=8;break;
 case 8: 
 var $i_1187;
 var $19=(Math_imul($17,$i_1187)|0);
 var $j_1183=0;label=11;break;
 case 9: 
 if($2){label=10;break;}else{var $max_0_lcssa=0;var $min_0_lcssa=0;label=16;break;}
 case 10: 
 var $20=HEAP32[((36632)>>2)];
 var $21=HEAP32[((9096)>>2)];
 var $22=HEAP32[((36656)>>2)];
 var $d_0169=0;var $max_0170=0;var $min_0171=0;label=18;break;
 case 11: 
 var $j_1183;
 if($15){var $k_0177=0;var $t_0178=0;label=12;break;}else{var $t_0_lcssa=0;label=13;break;}
 case 12: 
 var $t_0178;
 var $k_0177;
 var $23=(Math_imul($17,$k_0177)|0);
 var $_sum124=((($23)+($i_1187))|0);
 var $24=(($18+($_sum124<<3))|0);
 var $25=HEAPF64[(($24)>>3)];
 var $_sum125=((($23)+($j_1183))|0);
 var $26=(($18+($_sum125<<3))|0);
 var $27=HEAPF64[(($26)>>3)];
 var $28=($25)*($27);
 var $29=($t_0178)+($28);
 var $30=((($k_0177)+(1))|0);
 var $31=($30|0)<($14|0);
 if($31){var $k_0177=$30;var $t_0178=$29;label=12;break;}else{var $t_0_lcssa=$29;label=13;break;}
 case 13: 
 var $t_0_lcssa;
 var $_sum123=((($19)+($j_1183))|0);
 var $32=(($16+($_sum123<<3))|0);
 HEAPF64[(($32)>>3)]=$t_0_lcssa;
 var $33=((($j_1183)+(1))|0);
 var $34=($33|0)<($1|0);
 if($34){var $j_1183=$33;label=11;break;}else{label=14;break;}
 case 14: 
 var $35=((($i_1187)+(1))|0);
 var $36=($35|0)<($1|0);
 if($36){var $i_1187=$35;label=8;break;}else{label=9;break;}
 case 15: 
 if($43){var $d_0169=$42;var $max_0170=$max_1;var $min_0171=$min_1;label=18;break;}else{var $max_0_lcssa=$max_1;var $min_0_lcssa=$min_1;label=16;break;}
 case 16: 
 var $min_0_lcssa;
 var $max_0_lcssa;
 var $d_1132=((($1)-(1))|0);
 var $37=($d_1132|0)>0;
 if($37){label=17;break;}else{label=40;break;}
 case 17: 
 var $38=HEAP32[((36632)>>2)];
 var $39=HEAP32[((9096)>>2)];
 var $40=HEAP32[((36656)>>2)];
 var $d_1133=$d_1132;label=36;break;
 case 18: 
 var $min_0171;
 var $max_0170;
 var $d_0169;
 var $42=((($d_0169)+(1))|0);
 var $43=($42|0)<($1|0);
 if($43){var $i_2135=$42;var $k_1136=$d_0169;label=19;break;}else{label=26;break;}
 case 19: 
 var $k_1136;
 var $i_2135;
 var $44=(Math_imul($21,$i_2135)|0);
 var $_sum121=((($44)+($d_0169))|0);
 var $45=(($20+($_sum121<<3))|0);
 var $46=HEAPF64[(($45)>>3)];
 var $47=Math_abs($46);
 var $48=(Math_imul($21,$k_1136)|0);
 var $_sum122=((($48)+($d_0169))|0);
 var $49=(($20+($_sum122<<3))|0);
 var $50=HEAPF64[(($49)>>3)];
 var $51=Math_abs($50);
 var $52=$47>$51;
 var $k_2=($52?$i_2135:$k_1136);
 var $53=((($i_2135)+(1))|0);
 var $54=($53|0)<($1|0);
 if($54){var $i_2135=$53;var $k_1136=$k_2;label=19;break;}else{label=20;break;}
 case 20: 
 var $55=($k_2|0)==($d_0169|0);
 if($55){label=26;break;}else{label=21;break;}
 case 21: 
 var $56=($d_0169|0)<($1|0);
 if($56){label=22;break;}else{label=24;break;}
 case 22: 
 var $57=(Math_imul($21,$d_0169)|0);
 var $58=(Math_imul($21,$k_2)|0);
 var $j_2142=$d_0169;label=23;break;
 case 23: 
 var $j_2142;
 var $_sum118=((($57)+($j_2142))|0);
 var $60=(($20+($_sum118<<3))|0);
 var $61=HEAPF64[(($60)>>3)];
 var $_sum119=((($58)+($j_2142))|0);
 var $62=(($20+($_sum119<<3))|0);
 var $63=HEAPF64[(($62)>>3)];
 HEAPF64[(($60)>>3)]=$63;
 HEAPF64[(($62)>>3)]=$61;
 var $64=((($j_2142)+(1))|0);
 var $65=($64|0)<($1|0);
 if($65){var $j_2142=$64;label=23;break;}else{label=24;break;}
 case 24: 
 var $66=(Math_imul($21,$d_0169)|0);
 var $67=(Math_imul($21,$k_2)|0);
 var $j_3145=0;label=25;break;
 case 25: 
 var $j_3145;
 var $_sum115=((($66)+($j_3145))|0);
 var $69=(($22+($_sum115<<3))|0);
 var $70=HEAPF64[(($69)>>3)];
 var $_sum116=((($67)+($j_3145))|0);
 var $71=(($22+($_sum116<<3))|0);
 var $72=HEAPF64[(($71)>>3)];
 HEAPF64[(($69)>>3)]=$72;
 HEAPF64[(($71)>>3)]=$70;
 var $73=((($j_3145)+(1))|0);
 var $74=($73|0)<($1|0);
 if($74){var $j_3145=$73;label=25;break;}else{label=26;break;}
 case 26: 
 var $75=(Math_imul($21,$d_0169)|0);
 var $_sum107=((($75)+($d_0169))|0);
 var $76=(($20+($_sum107<<3))|0);
 var $77=HEAPF64[(($76)>>3)];
 var $78=$77==0;
 if($78){var $_0=-1;label=41;break;}else{label=27;break;}
 case 27: 
 var $80=Math_abs($77);
 var $81=$80>$max_0170;
 var $max_1=($81?$80:$max_0170);
 var $82=(1)/($77);
 var $83=Math_abs($82);
 var $84=$83>$min_0171;
 var $min_1=($84?$83:$min_0171);
 var $85=($d_0169|0)<($1|0);
 if($85){var $j_4148=$d_0169;label=28;break;}else{var $j_5152=0;label=29;break;}
 case 28: 
 var $j_4148;
 var $_sum114=((($75)+($j_4148))|0);
 var $86=(($20+($_sum114<<3))|0);
 var $87=HEAPF64[(($86)>>3)];
 var $88=($82)*($87);
 HEAPF64[(($86)>>3)]=$88;
 var $89=((($j_4148)+(1))|0);
 var $90=($89|0)<($1|0);
 if($90){var $j_4148=$89;label=28;break;}else{var $j_5152=0;label=29;break;}
 case 29: 
 var $j_5152;
 var $_sum113=((($75)+($j_5152))|0);
 var $91=(($22+($_sum113<<3))|0);
 var $92=HEAPF64[(($91)>>3)];
 var $93=($82)*($92);
 HEAPF64[(($91)>>3)]=$93;
 var $94=((($j_5152)+(1))|0);
 var $95=($94|0)<($1|0);
 if($95){var $j_5152=$94;label=29;break;}else{label=30;break;}
 case 30: 
 if($43){var $i_3162=$42;label=31;break;}else{var $max_0_lcssa=$max_1;var $min_0_lcssa=$min_1;label=16;break;}
 case 31: 
 var $i_3162;
 var $96=(Math_imul($21,$i_3162)|0);
 var $_sum108=((($96)+($d_0169))|0);
 var $97=(($20+($_sum108<<3))|0);
 var $98=HEAPF64[(($97)>>3)];
 var $99=((-.0))-($98);
 if($85){var $j_6155=$d_0169;label=32;break;}else{var $j_7158=0;label=33;break;}
 case 32: 
 var $j_6155;
 var $_sum111=((($75)+($j_6155))|0);
 var $100=(($20+($_sum111<<3))|0);
 var $101=HEAPF64[(($100)>>3)];
 var $102=($101)*($99);
 var $_sum112=((($96)+($j_6155))|0);
 var $103=(($20+($_sum112<<3))|0);
 var $104=HEAPF64[(($103)>>3)];
 var $105=($104)+($102);
 HEAPF64[(($103)>>3)]=$105;
 var $106=((($j_6155)+(1))|0);
 var $107=($106|0)<($1|0);
 if($107){var $j_6155=$106;label=32;break;}else{var $j_7158=0;label=33;break;}
 case 33: 
 var $j_7158;
 var $_sum109=((($75)+($j_7158))|0);
 var $108=(($22+($_sum109<<3))|0);
 var $109=HEAPF64[(($108)>>3)];
 var $110=($109)*($99);
 var $_sum110=((($96)+($j_7158))|0);
 var $111=(($22+($_sum110<<3))|0);
 var $112=HEAPF64[(($111)>>3)];
 var $113=($112)+($110);
 HEAPF64[(($111)>>3)]=$113;
 var $114=((($j_7158)+(1))|0);
 var $115=($114|0)<($1|0);
 if($115){var $j_7158=$114;label=33;break;}else{label=34;break;}
 case 34: 
 var $116=((($i_3162)+(1))|0);
 var $117=($116|0)<($1|0);
 if($117){var $i_3162=$116;label=31;break;}else{label=15;break;}
 case 35: 
 var $d_1=((($d_1133)-(1))|0);
 var $118=($d_1|0)>0;
 if($118){var $d_1133=$d_1;label=36;break;}else{label=40;break;}
 case 36: 
 var $d_1133;
 var $119=(Math_imul($39,$d_1133)|0);
 var $i_4129=0;label=37;break;
 case 37: 
 var $i_4129;
 var $121=(Math_imul($39,$i_4129)|0);
 var $_sum=((($121)+($d_1133))|0);
 var $122=(($38+($_sum<<3))|0);
 var $123=HEAPF64[(($122)>>3)];
 var $124=((-.0))-($123);
 if($2){var $j_8128=0;label=38;break;}else{label=39;break;}
 case 38: 
 var $j_8128;
 var $_sum105=((($119)+($j_8128))|0);
 var $125=(($40+($_sum105<<3))|0);
 var $126=HEAPF64[(($125)>>3)];
 var $127=($126)*($124);
 var $_sum106=((($121)+($j_8128))|0);
 var $128=(($40+($_sum106<<3))|0);
 var $129=HEAPF64[(($128)>>3)];
 var $130=($129)+($127);
 HEAPF64[(($128)>>3)]=$130;
 var $131=((($j_8128)+(1))|0);
 var $132=($131|0)<($1|0);
 if($132){var $j_8128=$131;label=38;break;}else{label=39;break;}
 case 39: 
 var $133=((($i_4129)+(1))|0);
 var $134=($133|0)<($d_1133|0);
 if($134){var $i_4129=$133;label=37;break;}else{label=35;break;}
 case 40: 
 var $135=($max_0_lcssa)*($min_0_lcssa);
 var $not_=$135>=10000000000;
 var $_127=(($not_<<31)>>31);
 var $_0=$_127;label=41;break;
 case 41: 
 var $_0;
 return $_0;
  default: assert(0, "bad label: " + label);
 }
}
function _get_var_index(){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP32[((14112)>>2)];
 var $2=(($1+8)|0);
 var $3=HEAP32[(($2)>>2)];
 var $i_0=0;label=2;break;
 case 2: 
 var $i_0;
 var $5=($i_0|0)<($3|0);
 if($5){label=3;break;}else{label=4;break;}
 case 3: 
 var $7=(($1+20+((($i_0)*(24))&-1))|0);
 var $8=HEAP32[(($7)>>2)];
 var $9=_strcmp($8,6984);
 var $10=($9|0)==0;
 var $11=((($i_0)+(1))|0);
 if($10){label=4;break;}else{var $i_0=$11;label=2;break;}
 case 4: 
 var $13=($i_0|0)==($3|0);
 if($13){label=5;break;}else{var $17=$1;label=6;break;}
 case 5: 
 var $15=_sprintf(24920,1896,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=6984,tempVarArgs)); STACKTOP=tempVarArgs;
 _stop(24920);
 var $_pre=HEAP32[((14112)>>2)];
 var $17=$_pre;label=6;break;
 case 6: 
 var $17;
 var $18=(($17+20+((($i_0)*(24))&-1)+12)|0);
 var $19=HEAP32[(($18)>>2)];
 var $20=($19|0)==0;
 if($20){label=7;break;}else{label=8;break;}
 case 7: 
 var $22=_sprintf(24920,1800,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=6984,tempVarArgs)); STACKTOP=tempVarArgs;
 _stop(24920);
 label=8;break;
 case 8: 
 STACKTOP=sp;return $i_0;
  default: assert(0, "bad label: " + label);
 }
}
function _proc_means(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 _parse_proc_means_stmt();
 var $1=HEAP32[((14112)>>2)];
 var $2=($1|0)==0;
 if($2){label=2;break;}else{label=3;break;}
 case 2: 
 _stop(864);
 label=3;break;
 case 3: 
 _keyword();
 var $4=HEAP32[((6944)>>2)];
 switch(($4|0)){case 305:{ label=4;break;}case 343:{ label=5;break;}case 0:case 309:case 327:case 330:{ label=7;break;}default:{label=6;break;}}break;
 case 4: 
 _class_stmt();
 label=3;break;
 case 5: 
 _var_stmt();
 label=3;break;
 case 6: 
 _parse_default();
 label=3;break;
 case 7: 
 _print_title();
 _run_proc_means();
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _parse_proc_means_stmt(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 label=2;break;
 case 2: 
 _scan();
 _keyword();
 var $1=HEAP32[((6944)>>2)];
 switch(($1|0)){case 316:case 318:case 320:case 322:case 324:case 335:case 331:case 332:case 333:case 334:case 342:case 343:{ label=10;break;}case 59:{ label=3;break;}case 301:{ label=4;break;}case 309:{ label=5;break;}case 319:{ label=6;break;}case 306:{ label=7;break;}default:{label=13;break;}}break;
 case 3: 
 _scan();
 return;
 case 4: 
 _parse_alpha_option();
 label=2;break;
 case 5: 
 _parse_data_option();
 label=2;break;
 case 6: 
 _parse_maxdec_option();
 label=2;break;
 case 7: 
 var $7=HEAP32[((9016)>>2)];
 var $8=((($7)+(2))|0);
 var $9=($8|0)>12;
 if($9){label=8;break;}else{var $12=$7;label=9;break;}
 case 8: 
 _stop(3232);
 var $_pre=HEAP32[((9016)>>2)];
 var $12=$_pre;label=9;break;
 case 9: 
 var $12;
 var $13=((($12)+(1))|0);
 var $14=((7088+($12<<2))|0);
 HEAP32[(($14)>>2)]=307;
 var $15=((($12)+(2))|0);
 HEAP32[((9016)>>2)]=$15;
 var $16=((7088+($13<<2))|0);
 HEAP32[(($16)>>2)]=308;
 label=2;break;
 case 10: 
 var $18=HEAP32[((9016)>>2)];
 var $19=($18|0)==12;
 if($19){label=11;break;}else{var $23=$1;var $22=$18;label=12;break;}
 case 11: 
 _stop(3232);
 var $_pre1=HEAP32[((6944)>>2)];
 var $_pre2=HEAP32[((9016)>>2)];
 var $23=$_pre1;var $22=$_pre2;label=12;break;
 case 12: 
 var $22;
 var $23;
 var $24=((($22)+(1))|0);
 HEAP32[((9016)>>2)]=$24;
 var $25=((7088+($22<<2))|0);
 HEAP32[(($25)>>2)]=$23;
 label=2;break;
 case 13: 
 _expected(2520);
 label=2;break;
  default: assert(0, "bad label: " + label);
 }
}
function _run_proc_means(){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP32[((8992)>>2)];
 var $2=($1|0)==0;
 if($2){label=2;break;}else{var $19=$1;label=7;break;}
 case 2: 
 var $3=HEAP32[((14112)>>2)];
 var $4=(($3+8)|0);
 var $5=HEAP32[(($4)>>2)];
 var $6=($5|0)>0;
 if($6){var $k_049=0;var $i_050=0;var $7=$5;label=3;break;}else{var $k_0_lcssa=0;label=6;break;}
 case 3: 
 var $7;
 var $i_050;
 var $k_049;
 var $8=(($3+20+((($i_050)*(24))&-1)+12)|0);
 var $9=HEAP32[(($8)>>2)];
 var $10=($9|0)==0;
 if($10){label=4;break;}else{var $k_1=$k_049;var $15=$7;label=5;break;}
 case 4: 
 var $12=((($k_049)+(1))|0);
 var $13=((6528+($k_049<<2))|0);
 HEAP32[(($13)>>2)]=$i_050;
 var $_pre56=HEAP32[(($4)>>2)];
 var $k_1=$12;var $15=$_pre56;label=5;break;
 case 5: 
 var $15;
 var $k_1;
 var $16=((($i_050)+(1))|0);
 var $17=($16|0)<($15|0);
 if($17){var $k_049=$k_1;var $i_050=$16;var $7=$15;label=3;break;}else{var $k_0_lcssa=$k_1;label=6;break;}
 case 6: 
 var $k_0_lcssa;
 HEAP32[((8992)>>2)]=$k_0_lcssa;
 var $19=$k_0_lcssa;label=7;break;
 case 7: 
 var $19;
 var $20=HEAP32[((9016)>>2)];
 var $21=($20|0)==0;
 if($21){label=8;break;}else{var $24=$20;label=9;break;}
 case 8: 
 HEAP32[((9016)>>2)]=5;
 HEAP32[((7088)>>2)]=324;
 HEAP32[((7092)>>2)]=320;
 HEAP32[((7096)>>2)]=331;
 HEAP32[((7100)>>2)]=322;
 HEAP32[((7104)>>2)]=318;
 var $24=5;label=9;break;
 case 9: 
 var $24;
 var $25=HEAP32[((9104)>>2)];
 var $26=((($25)+(1))|0);
 var $27=((($26)+($24))|0);
 HEAP32[((9080)>>2)]=$27;
 HEAP32[((9032)>>2)]=$19;
 var $28=($25|0)>0;
 if($28){label=10;break;}else{var $38=$19;label=12;break;}
 case 10: 
 var $_pre55=HEAP32[((14112)>>2)];
 var $i_144=0;var $30=$19;label=11;break;
 case 11: 
 var $30;
 var $i_144;
 var $31=((14520+($i_144<<2))|0);
 var $32=HEAP32[(($31)>>2)];
 var $33=(($_pre55+20+((($32)*(24))&-1)+8)|0);
 var $34=HEAP32[(($33)>>2)];
 var $35=(Math_imul($30,$34)|0);
 HEAP32[((9032)>>2)]=$35;
 var $36=((($i_144)+(1))|0);
 var $37=($36|0)<($25|0);
 if($37){var $i_144=$36;var $30=$35;label=11;break;}else{var $38=$35;label=12;break;}
 case 12: 
 var $38;
 var $39=((($38)+(1))|0);
 HEAP32[((9032)>>2)]=$39;
 var $40=$27<<2;
 var $41=(Math_imul($40,$39)|0);
 var $42=_xmalloc($41);
 var $43=$42;
 HEAP32[((36032)>>2)]=$43;
 var $44=HEAP32[((9104)>>2)];
 var $45=($44|0)>0;
 if($45){var $i_240=0;label=13;break;}else{label=14;break;}
 case 13: 
 var $i_240;
 var $46=((14520+($i_240<<2))|0);
 var $47=HEAP32[(($46)>>2)];
 var $48=HEAP32[((14112)>>2)];
 var $49=(($48+20+((($47)*(24))&-1))|0);
 var $50=HEAP32[(($49)>>2)];
 var $51=_strdup($50);
 var $52=HEAP32[((36032)>>2)];
 var $53=(($52+($i_240<<2))|0);
 HEAP32[(($53)>>2)]=$51;
 var $54=((($i_240)+(1))|0);
 var $55=HEAP32[((9104)>>2)];
 var $56=($54|0)<($55|0);
 if($56){var $i_240=$54;label=13;break;}else{label=14;break;}
 case 14: 
 var $57=_strdup(1720);
 var $58=HEAP32[((9104)>>2)];
 var $59=HEAP32[((36032)>>2)];
 var $60=(($59+($58<<2))|0);
 HEAP32[(($60)>>2)]=$57;
 var $61=HEAP32[((9016)>>2)];
 var $62=($61|0)>0;
 if($62){var $i_336=0;label=15;break;}else{label=30;break;}
 case 15: 
 var $i_336;
 var $63=((7088+($i_336<<2))|0);
 var $64=HEAP32[(($63)>>2)];
 switch(($64|0)){case 307:{ label=16;break;}case 308:{ label=17;break;}case 316:{ label=18;break;}case 320:{ label=19;break;}case 322:{ label=20;break;}case 324:{ label=21;break;}case 328:{ label=22;break;}case 335:{ label=23;break;}case 331:case 332:{ label=24;break;}case 333:case 334:{ label=25;break;}case 342:{ label=26;break;}case 343:{ label=27;break;}case 318:{ var $t_0=968;label=29;break;}default:{label=28;break;}}break;
 case 16: 
 var $66=HEAPF64[((696)>>3)];
 var $67=(1)-($66);
 var $68=($67)*(100);
 var $69=_sprintf(8744,1352,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$68,tempVarArgs)); STACKTOP=tempVarArgs;
 var $t_0=8744;label=29;break;
 case 17: 
 var $71=HEAPF64[((696)>>3)];
 var $72=(1)-($71);
 var $73=($72)*(100);
 var $74=_sprintf(8744,1128,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$73,tempVarArgs)); STACKTOP=tempVarArgs;
 var $t_0=8744;label=29;break;
 case 18: 
 var $76=HEAPF64[((696)>>3)];
 var $77=(1)-($76);
 var $78=($77)*(100);
 var $79=_sprintf(8744,1040,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$78,tempVarArgs)); STACKTOP=tempVarArgs;
 var $t_0=8744;label=29;break;
 case 19: 
 var $t_0=848;label=29;break;
 case 20: 
 var $t_0=712;label=29;break;
 case 21: 
 var $t_0=4040;label=29;break;
 case 22: 
 var $t_0=3888;label=29;break;
 case 23: 
 var $t_0=3776;label=29;break;
 case 24: 
 var $t_0=3704;label=29;break;
 case 25: 
 var $t_0=3528;label=29;break;
 case 26: 
 var $88=HEAPF64[((696)>>3)];
 var $89=(1)-($88);
 var $90=($89)*(100);
 var $91=_sprintf(8744,3504,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$90,tempVarArgs)); STACKTOP=tempVarArgs;
 var $t_0=8744;label=29;break;
 case 27: 
 var $t_0=3392;label=29;break;
 case 28: 
 var $t_0=3336;label=29;break;
 case 29: 
 var $t_0;
 var $95=_strdup($t_0);
 var $96=HEAP32[((9104)>>2)];
 var $97=((($i_336)+(1))|0);
 var $98=((($97)+($96))|0);
 var $99=HEAP32[((36032)>>2)];
 var $100=(($99+($98<<2))|0);
 HEAP32[(($100)>>2)]=$95;
 var $101=HEAP32[((9016)>>2)];
 var $102=($97|0)<($101|0);
 if($102){var $i_336=$97;label=15;break;}else{label=30;break;}
 case 30: 
 HEAP32[((8864)>>2)]=1;
 _f(0);
 var $103=HEAP32[((9080)>>2)];
 var $104=($103|0)>0;
 if($104){label=31;break;}else{label=33;break;}
 case 31: 
 var $105=HEAP32[((9104)>>2)];
 var $106=((($105)+(1))|0);
 var $i_432=0;label=32;break;
 case 32: 
 var $i_432;
 var $108=($i_432|0)<($106|0);
 var $109=((8744+$i_432)|0);
 var $_=($108&1);
 HEAP8[($109)]=$_;
 var $110=((($i_432)+(1))|0);
 var $111=($110|0)<($103|0);
 if($111){var $i_432=$110;label=32;break;}else{label=33;break;}
 case 33: 
 var $112=HEAP32[((36032)>>2)];
 var $113=HEAP32[((9032)>>2)];
 _print_table($112,$113,$103,8744);
 var $114=HEAP32[((9032)>>2)];
 var $115=($114|0)>0;
 if($115){label=34;break;}else{label=39;break;}
 case 34: 
 var $_pre=HEAP32[((9080)>>2)];
 var $i_529=0;var $117=$_pre;var $116=$114;label=35;break;
 case 35: 
 var $116;
 var $117;
 var $i_529;
 var $118=($117|0)>0;
 if($118){var $j_028=0;var $119=$117;label=36;break;}else{var $129=$117;var $128=$116;label=38;break;}
 case 36: 
 var $119;
 var $j_028;
 var $120=HEAP32[((36032)>>2)];
 var $121=(Math_imul($119,$i_529)|0);
 var $_sum=((($121)+($j_028))|0);
 var $122=(($120+($_sum<<2))|0);
 var $123=HEAP32[(($122)>>2)];
 _free($123);
 var $124=((($j_028)+(1))|0);
 var $125=HEAP32[((9080)>>2)];
 var $126=($124|0)<($125|0);
 if($126){var $j_028=$124;var $119=$125;label=36;break;}else{label=37;break;}
 case 37: 
 var $_pre54=HEAP32[((9032)>>2)];
 var $129=$125;var $128=$_pre54;label=38;break;
 case 38: 
 var $128;
 var $129;
 var $130=((($i_529)+(1))|0);
 var $131=($130|0)<($128|0);
 if($131){var $i_529=$130;var $117=$129;var $116=$128;label=35;break;}else{label=39;break;}
 case 39: 
 var $132=HEAP32[((36032)>>2)];
 var $133=$132;
 _free($133);
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }
}
function _f($k){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP32[((9104)>>2)];
 var $2=($1|0)==($k|0);
 if($2){label=2;break;}else{label=44;break;}
 case 2: 
 var $4=HEAP32[((8992)>>2)];
 var $5=($4|0)>0;
 if($5){var $i_020_i=0;var $6=$k;label=3;break;}else{label=47;break;}
 case 3: 
 var $6;
 var $i_020_i;
 var $7=($i_020_i|0)==0;
 var $8=($6|0)>0;
 if($7){label=4;break;}else{label=5;break;}
 case 4: 
 if($8){var $j_018_i=0;label=6;break;}else{label=8;break;}
 case 5: 
 if($8){var $j_115_i=0;label=7;break;}else{label=8;break;}
 case 6: 
 var $j_018_i;
 var $9=((14520+($j_018_i<<2))|0);
 var $10=HEAP32[(($9)>>2)];
 var $11=((11176+($j_018_i<<2))|0);
 var $12=HEAP32[(($11)>>2)];
 var $13=HEAP32[((14112)>>2)];
 var $14=(($13+20+((($10)*(24))&-1)+12)|0);
 var $15=HEAP32[(($14)>>2)];
 var $16=(($15+($12<<2))|0);
 var $17=HEAP32[(($16)>>2)];
 var $18=_strdup($17);
 var $19=HEAP32[((36032)>>2)];
 var $20=HEAP32[((8864)>>2)];
 var $21=HEAP32[((9080)>>2)];
 var $22=(Math_imul($21,$20)|0);
 var $_sum14_i=((($22)+($j_018_i))|0);
 var $23=(($19+($_sum14_i<<2))|0);
 HEAP32[(($23)>>2)]=$18;
 var $24=((($j_018_i)+(1))|0);
 var $25=HEAP32[((9104)>>2)];
 var $26=($24|0)<($25|0);
 if($26){var $j_018_i=$24;label=6;break;}else{label=8;break;}
 case 7: 
 var $j_115_i;
 var $27=_strdup(36064);
 var $28=HEAP32[((36032)>>2)];
 var $29=HEAP32[((8864)>>2)];
 var $30=HEAP32[((9080)>>2)];
 var $31=(Math_imul($30,$29)|0);
 var $_sum13_i=((($31)+($j_115_i))|0);
 var $32=(($28+($_sum13_i<<2))|0);
 HEAP32[(($32)>>2)]=$27;
 var $33=((($j_115_i)+(1))|0);
 var $34=HEAP32[((9104)>>2)];
 var $35=($33|0)<($34|0);
 if($35){var $j_115_i=$33;label=7;break;}else{label=8;break;}
 case 8: 
 var $36=((6528+($i_020_i<<2))|0);
 var $37=HEAP32[(($36)>>2)];
 var $38=HEAP32[((14112)>>2)];
 var $39=(($38+20+((($37)*(24))&-1))|0);
 var $40=HEAP32[(($39)>>2)];
 var $41=_strdup($40);
 var $42=HEAP32[((9104)>>2)];
 var $43=HEAP32[((36032)>>2)];
 var $44=HEAP32[((8864)>>2)];
 var $45=HEAP32[((9080)>>2)];
 var $46=(Math_imul($45,$44)|0);
 var $_sum_i=((($46)+($42))|0);
 var $47=(($43+($_sum_i<<2))|0);
 HEAP32[(($47)>>2)]=$41;
 var $48=HEAP32[((14112)>>2)];
 var $49=(($48+12)|0);
 var $50=HEAP32[(($49)>>2)];
 var $51=($50|0)>0;
 if($51){label=9;break;}else{var $stderr_0_lcssa80_i_i=NaN;var $stddev_0_lcssa81_i_i=NaN;var $sum_0_lcssa83_i_i=NaN;var $max_0_lcssa85_i_i=NaN;var $min_0_lcssa87_i_i=NaN;var $variance_0_lcssa88_i_i=NaN;var $mean_0_lcssa90_i_i=NaN;var $n_0_lcssa91_i_i=0;var $100=NaN;label=20;break;}
 case 9: 
 var $52=HEAP32[((9104)>>2)];
 var $53=(($48+20+((($37)*(24))&-1)+12)|0);
 var $54=(($48+20+((($37)*(24))&-1)+20)|0);
 var $i_061_i_i=0;var $n_062_i_i=0;var $mean_063_i_i=NaN;var $variance_064_i_i=NaN;var $min_065_i_i=NaN;var $max_066_i_i=NaN;var $sum_067_i_i=NaN;var $stddev_068_i_i=NaN;var $stderr_069_i_i=NaN;label=10;break;
 case 10: 
 var $stderr_069_i_i;
 var $stddev_068_i_i;
 var $sum_067_i_i;
 var $max_066_i_i;
 var $min_065_i_i;
 var $variance_064_i_i;
 var $mean_063_i_i;
 var $n_062_i_i;
 var $i_061_i_i;
 var $j_0_i_i=0;label=11;break;
 case 11: 
 var $j_0_i_i;
 var $56=($j_0_i_i|0)<($52|0);
 if($56){label=12;break;}else{label=13;break;}
 case 12: 
 var $58=((14520+($j_0_i_i<<2))|0);
 var $59=HEAP32[(($58)>>2)];
 var $60=(($48+20+((($59)*(24))&-1)+20)|0);
 var $61=HEAP32[(($60)>>2)];
 var $62=(($61+($i_061_i_i<<3))|0);
 var $63=HEAPF64[(($62)>>3)];
 var $ld$0$0=(($62)|0);
 var $63$$SHADOW$0=HEAP32[(($ld$0$0)>>2)];
 var $ld$1$1=(($62+4)|0);
 var $63$$SHADOW$1=HEAP32[(($ld$1$1)>>2)];
 var $64=((11176+($j_0_i_i<<2))|0);
 var $65=HEAP32[(($64)>>2)];
 var $66=($65|0);
 var $67=$63!=$66;
 var $68=((($j_0_i_i)+(1))|0);
 if($67){var $stderr_2_i_i=$stderr_069_i_i;var $stddev_2_i_i=$stddev_068_i_i;var $sum_2_i_i=$sum_067_i_i;var $max_3_i_i=$max_066_i_i;var $min_3_i_i=$min_065_i_i;var $variance_2_i_i=$variance_064_i_i;var $mean_2_i_i=$mean_063_i_i;var $n_1_i_i=$n_062_i_i;label=18;break;}else{var $j_0_i_i=$68;label=11;break;}
 case 13: 
 var $70=HEAP32[(($53)>>2)];
 var $71=($70|0)==0;
 var $72=HEAP32[(($54)>>2)];
 var $73=(($72+($i_061_i_i<<3))|0);
 var $74=HEAPF64[(($73)>>3)];
 var $ld$2$0=(($73)|0);
 var $74$$SHADOW$0=HEAP32[(($ld$2$0)>>2)];
 var $ld$3$1=(($73+4)|0);
 var $74$$SHADOW$1=HEAP32[(($ld$3$1)>>2)];
 if($71){label=16;break;}else{label=14;break;}
 case 14: 
 var $76=$74!=0;
 if($76){label=15;break;}else{var $stderr_2_i_i=$stderr_069_i_i;var $stddev_2_i_i=$stddev_068_i_i;var $sum_2_i_i=$sum_067_i_i;var $max_3_i_i=$max_066_i_i;var $min_3_i_i=$min_065_i_i;var $variance_2_i_i=$variance_064_i_i;var $mean_2_i_i=$mean_063_i_i;var $n_1_i_i=$n_062_i_i;label=18;break;}
 case 15: 
 var $78=((($n_062_i_i)+(1))|0);
 var $stderr_2_i_i=$stderr_069_i_i;var $stddev_2_i_i=$stddev_068_i_i;var $sum_2_i_i=$sum_067_i_i;var $max_3_i_i=$max_066_i_i;var $min_3_i_i=$min_065_i_i;var $variance_2_i_i=$variance_064_i_i;var $mean_2_i_i=$mean_063_i_i;var $n_1_i_i=$78;label=18;break;
 case 16: 
 var $80$0=$74$$SHADOW$0;
 var $80$1=$74$$SHADOW$1;
 var $$etemp$4$0=-1;
 var $$etemp$4$1=2147483647;
 var $81$0=$80$0&$$etemp$4$0;
 var $81$1=$80$1&$$etemp$4$1;
 var $$etemp$5$0=0;
 var $$etemp$5$1=2146435072;
 var $82=(($81$1>>>0) > ($$etemp$5$1>>>0)) | (((($81$1>>>0) == ($$etemp$5$1>>>0) & ($81$0>>>0) >  ($$etemp$5$0>>>0))));
 if($82){var $stderr_2_i_i=$stderr_069_i_i;var $stddev_2_i_i=$stddev_068_i_i;var $sum_2_i_i=$sum_067_i_i;var $max_3_i_i=$max_066_i_i;var $min_3_i_i=$min_065_i_i;var $variance_2_i_i=$variance_064_i_i;var $mean_2_i_i=$mean_063_i_i;var $n_1_i_i=$n_062_i_i;label=18;break;}else{label=17;break;}
 case 17: 
 var $84=((($n_062_i_i)+(1))|0);
 var $85=($n_062_i_i|0)==0;
 var $_mean_0_i_i=($85?$74:$mean_063_i_i);
 var $_variance_0_i_i=($85?0:$variance_064_i_i);
 var $_min_0_i_i=($85?$74:$min_065_i_i);
 var $_max_0_i_i=($85?$74:$max_066_i_i);
 var $_sum_0_i_i=($85?0:$sum_067_i_i);
 var $_stddev_0_i_i=($85?0:$stddev_068_i_i);
 var $_stderr_0_i_i=($85?0:$stderr_069_i_i);
 var $86=($74)-($_mean_0_i_i);
 var $87=($84|0);
 var $88=($86)/($87);
 var $89=($_mean_0_i_i)+($88);
 var $90=($74)-($89);
 var $91=($86)*($90);
 var $92=($_variance_0_i_i)+($91);
 var $93=$74<$_min_0_i_i;
 var $min_2_i_i=($93?$74:$_min_0_i_i);
 var $94=$74>$_max_0_i_i;
 var $max_2_i_i=($94?$74:$_max_0_i_i);
 var $95=($_sum_0_i_i)+($74);
 var $stderr_2_i_i=$_stderr_0_i_i;var $stddev_2_i_i=$_stddev_0_i_i;var $sum_2_i_i=$95;var $max_3_i_i=$max_2_i_i;var $min_3_i_i=$min_2_i_i;var $variance_2_i_i=$92;var $mean_2_i_i=$89;var $n_1_i_i=$84;label=18;break;
 case 18: 
 var $n_1_i_i;
 var $mean_2_i_i;
 var $variance_2_i_i;
 var $min_3_i_i;
 var $max_3_i_i;
 var $sum_2_i_i;
 var $stddev_2_i_i;
 var $stderr_2_i_i;
 var $96=((($i_061_i_i)+(1))|0);
 var $97=($96|0)<($50|0);
 if($97){var $i_061_i_i=$96;var $n_062_i_i=$n_1_i_i;var $mean_063_i_i=$mean_2_i_i;var $variance_064_i_i=$variance_2_i_i;var $min_065_i_i=$min_3_i_i;var $max_066_i_i=$max_3_i_i;var $sum_067_i_i=$sum_2_i_i;var $stddev_068_i_i=$stddev_2_i_i;var $stderr_069_i_i=$stderr_2_i_i;label=10;break;}else{label=19;break;}
 case 19: 
 var $98=($max_3_i_i)-($min_3_i_i);
 var $99=($n_1_i_i|0)>1;
 if($99){label=21;break;}else{var $stderr_0_lcssa80_i_i=$stderr_2_i_i;var $stddev_0_lcssa81_i_i=$stddev_2_i_i;var $sum_0_lcssa83_i_i=$sum_2_i_i;var $max_0_lcssa85_i_i=$max_3_i_i;var $min_0_lcssa87_i_i=$min_3_i_i;var $variance_0_lcssa88_i_i=$variance_2_i_i;var $mean_0_lcssa90_i_i=$mean_2_i_i;var $n_0_lcssa91_i_i=$n_1_i_i;var $100=$98;label=20;break;}
 case 20: 
 var $100;
 var $n_0_lcssa91_i_i;
 var $mean_0_lcssa90_i_i;
 var $variance_0_lcssa88_i_i;
 var $min_0_lcssa87_i_i;
 var $max_0_lcssa85_i_i;
 var $sum_0_lcssa83_i_i;
 var $stddev_0_lcssa81_i_i;
 var $stderr_0_lcssa80_i_i;
 var $_pre_i_i=($n_0_lcssa91_i_i|0);
 var $stderr_3_i_i=$stderr_0_lcssa80_i_i;var $stddev_3_i_i=$stddev_0_lcssa81_i_i;var $variance_3_i_i=$variance_0_lcssa88_i_i;var $_pre_phi_i_i=$_pre_i_i;var $sum_0_lcssa82_i_i=$sum_0_lcssa83_i_i;var $max_0_lcssa84_i_i=$max_0_lcssa85_i_i;var $min_0_lcssa86_i_i=$min_0_lcssa87_i_i;var $mean_0_lcssa89_i_i=$mean_0_lcssa90_i_i;var $110=$100;label=22;break;
 case 21: 
 var $102=((($n_1_i_i)-(1))|0);
 var $103=($102|0);
 var $104=($variance_2_i_i)/($103);
 var $105=Math_sqrt($104);
 var $106=($n_1_i_i|0);
 var $107=Math_sqrt($106);
 var $108=($105)/($107);
 var $stderr_3_i_i=$108;var $stddev_3_i_i=$105;var $variance_3_i_i=$104;var $_pre_phi_i_i=$106;var $sum_0_lcssa82_i_i=$sum_2_i_i;var $max_0_lcssa84_i_i=$max_3_i_i;var $min_0_lcssa86_i_i=$min_3_i_i;var $mean_0_lcssa89_i_i=$mean_2_i_i;var $110=$98;label=22;break;
 case 22: 
 var $110;
 var $mean_0_lcssa89_i_i;
 var $min_0_lcssa86_i_i;
 var $max_0_lcssa84_i_i;
 var $sum_0_lcssa82_i_i;
 var $_pre_phi_i_i;
 var $variance_3_i_i;
 var $stddev_3_i_i;
 var $stderr_3_i_i;
 var $111=HEAPF64[((696)>>3)];
 var $ld$6$0=696;
 var $111$$SHADOW$0=HEAP32[(($ld$6$0)>>2)];
 var $ld$7$1=700;
 var $111$$SHADOW$1=HEAP32[(($ld$7$1)>>2)];
 var $112=(1)-($111);
 var $113=($_pre_phi_i_i)-(1);
 var $114=_qt($112,$113);
 var $115=HEAPF64[((696)>>3)];
 var $ld$8$0=696;
 var $115$$SHADOW$0=HEAP32[(($ld$8$0)>>2)];
 var $ld$9$1=700;
 var $115$$SHADOW$1=HEAP32[(($ld$9$1)>>2)];
 var $116=($115)*((0.5));
 var $117=(1)-($116);
 var $118=_qt($117,$113);
 var $119=HEAP32[((9016)>>2)];
 var $120=($119|0)>0;
 if($120){label=23;break;}else{label=42;break;}
 case 23: 
 var $121=($stderr_3_i_i)*($118);
 var $122=($mean_0_lcssa89_i_i)-($121);
 var $123=($mean_0_lcssa89_i_i)+($121);
 var $124=($stderr_3_i_i)*($114);
 var $125=($mean_0_lcssa89_i_i)-($124);
 var $126=($mean_0_lcssa89_i_i)+($124);
 var $i_160_i_i=0;label=24;break;
 case 24: 
 var $i_160_i_i;
 var $128=HEAP32[((9960)>>2)];
 var $129=((7088+($i_160_i_i<<2))|0);
 var $130=HEAP32[(($129)>>2)];
 switch(($130|0)){case 307:{ label=25;break;}case 308:{ label=26;break;}case 316:{ label=27;break;}case 320:{ label=28;break;}case 322:{ label=29;break;}case 324:{ label=30;break;}case 328:{ label=31;break;}case 335:{ label=32;break;}case 331:case 332:{ label=33;break;}case 333:case 334:{ label=34;break;}case 342:{ label=35;break;}case 343:{ label=36;break;}case 318:{ var $x_0_i_i=$max_0_lcssa84_i_i;var $w_0_i_i=$128;label=38;break;}default:{label=37;break;}}break;
 case 25: 
 var $x_0_i_i=$122;var $w_0_i_i=$128;label=38;break;
 case 26: 
 var $x_0_i_i=$123;var $w_0_i_i=$128;label=38;break;
 case 27: 
 var $x_0_i_i=$125;var $w_0_i_i=$128;label=38;break;
 case 28: 
 var $x_0_i_i=$mean_0_lcssa89_i_i;var $w_0_i_i=$128;label=38;break;
 case 29: 
 var $x_0_i_i=$min_0_lcssa86_i_i;var $w_0_i_i=$128;label=38;break;
 case 30: 
 var $x_0_i_i=$_pre_phi_i_i;var $w_0_i_i=0;label=38;break;
 case 31: 
 var $x_0_i_i=$110;var $w_0_i_i=$128;label=38;break;
 case 32: 
 var $x_0_i_i=$sum_0_lcssa82_i_i;var $w_0_i_i=$128;label=38;break;
 case 33: 
 var $x_0_i_i=$stddev_3_i_i;var $w_0_i_i=$128;label=38;break;
 case 34: 
 var $x_0_i_i=$stderr_3_i_i;var $w_0_i_i=$128;label=38;break;
 case 35: 
 var $x_0_i_i=$126;var $w_0_i_i=$128;label=38;break;
 case 36: 
 var $x_0_i_i=$variance_3_i_i;var $w_0_i_i=$128;label=38;break;
 case 37: 
 var $144=_nan(0);
 var $x_0_i_i=$144;var $w_0_i_i=$128;label=38;break;
 case 38: 
 var $w_0_i_i;
 var $x_0_i_i;
 HEAPF64[(tempDoublePtr)>>3]=$x_0_i_i; var $146$0=HEAP32[((tempDoublePtr)>>2)];var $146$1=HEAP32[(((tempDoublePtr)+(4))>>2)];
 var $$etemp$10$0=-1;
 var $$etemp$10$1=2147483647;
 var $147$0=$146$0&$$etemp$10$0;
 var $147$1=$146$1&$$etemp$10$1;
 var $$etemp$11$0=0;
 var $$etemp$11$1=2146435072;
 var $148=(($147$1>>>0) > ($$etemp$11$1>>>0)) | (((($147$1>>>0) == ($$etemp$11$1>>>0) & ($147$0>>>0) >  ($$etemp$11$0>>>0))));
 if($148){label=39;break;}else{label=40;break;}
 case 39: 
 var $150=_strdup(3336);
 var $151=HEAP32[((9104)>>2)];
 var $152=HEAP32[((36032)>>2)];
 var $153=HEAP32[((8864)>>2)];
 var $154=HEAP32[((9080)>>2)];
 var $155=(Math_imul($154,$153)|0);
 var $156=((($i_160_i_i)+(1))|0);
 var $157=((($156)+($151))|0);
 var $_sum59_i_i=((($157)+($155))|0);
 var $158=(($152+($_sum59_i_i<<2))|0);
 HEAP32[(($158)>>2)]=$150;
 label=41;break;
 case 40: 
 var $160=((624+($w_0_i_i<<2))|0);
 var $161=HEAP32[(($160)>>2)];
 var $162=_sprintf(11056,$161,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$x_0_i_i,tempVarArgs)); STACKTOP=tempVarArgs;
 var $163=_strdup(11056);
 var $164=HEAP32[((9104)>>2)];
 var $165=HEAP32[((36032)>>2)];
 var $166=HEAP32[((8864)>>2)];
 var $167=HEAP32[((9080)>>2)];
 var $168=(Math_imul($167,$166)|0);
 var $169=((($i_160_i_i)+(1))|0);
 var $170=((($169)+($164))|0);
 var $_sum_i_i=((($170)+($168))|0);
 var $171=(($165+($_sum_i_i<<2))|0);
 HEAP32[(($171)>>2)]=$163;
 label=41;break;
 case 41: 
 var $173=((($i_160_i_i)+(1))|0);
 var $174=HEAP32[((9016)>>2)];
 var $175=($173|0)<($174|0);
 if($175){var $i_160_i_i=$173;label=24;break;}else{label=42;break;}
 case 42: 
 var $176=HEAP32[((8864)>>2)];
 var $177=((($176)+(1))|0);
 HEAP32[((8864)>>2)]=$177;
 var $178=((($i_020_i)+(1))|0);
 var $179=HEAP32[((8992)>>2)];
 var $180=($178|0)<($179|0);
 if($180){label=43;break;}else{label=47;break;}
 case 43: 
 var $_pre=HEAP32[((9104)>>2)];
 var $i_020_i=$178;var $6=$_pre;label=3;break;
 case 44: 
 var $182=((14520+($k<<2))|0);
 var $183=HEAP32[(($182)>>2)];
 var $184=HEAP32[((14112)>>2)];
 var $185=(($184+20+((($183)*(24))&-1)+8)|0);
 var $186=HEAP32[(($185)>>2)];
 var $187=($186|0)>0;
 if($187){label=45;break;}else{label=47;break;}
 case 45: 
 var $188=((11176+($k<<2))|0);
 var $189=((($k)+(1))|0);
 var $i_08=0;label=46;break;
 case 46: 
 var $i_08;
 HEAP32[(($188)>>2)]=$i_08;
 _f($189);
 var $191=((($i_08)+(1))|0);
 var $192=($191|0)<($186|0);
 if($192){var $i_08=$191;label=46;break;}else{label=47;break;}
 case 47: 
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }
}
function _proc_print(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 label=2;break;
 case 2: 
 _get_next_token();
 var $1=HEAP32[((6944)>>2)];
 if(($1|0)==309){ label=3;break;}else if(($1|0)==59){ label=5;break;}else{label=4;break;}
 case 3: 
 _parse_data_option();
 label=2;break;
 case 4: 
 _stop(4000);
 label=2;break;
 case 5: 
 _scan();
 var $4=HEAP32[((14112)>>2)];
 var $5=($4|0)==0;
 if($5){label=6;break;}else{label=7;break;}
 case 6: 
 _stop(3944);
 label=7;break;
 case 7: 
 _keyword();
 var $7=HEAP32[((6944)>>2)];
 switch(($7|0)){case 0:case 309:case 327:case 330:{ label=10;break;}case 343:{ label=8;break;}default:{label=9;break;}}break;
 case 8: 
 _var_stmt();
 label=7;break;
 case 9: 
 _parse_default();
 label=7;break;
 case 10: 
 _run_proc_print();
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _run_proc_print(){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 _print_title();
 var $1=HEAP32[((14112)>>2)];
 var $2=(($1+12)|0);
 var $3=HEAP32[(($2)>>2)];
 var $4=HEAP32[((8992)>>2)];
 var $5=($4|0)==0;
 if($5){label=2;break;}else{var $13=$4;label=4;break;}
 case 2: 
 var $7=(($1+8)|0);
 var $8=HEAP32[(($7)>>2)];
 HEAP32[((8992)>>2)]=$8;
 var $9=($8|0)>0;
 if($9){var $i_067=0;label=3;break;}else{var $13=$8;label=4;break;}
 case 3: 
 var $i_067;
 var $10=((6528+($i_067<<2))|0);
 HEAP32[(($10)>>2)]=$i_067;
 var $11=((($i_067)+(1))|0);
 var $12=($11|0)<($8|0);
 if($12){var $i_067=$11;label=3;break;}else{var $13=$8;label=4;break;}
 case 4: 
 var $13;
 var $14=((($3)+(1))|0);
 var $15=((($13)+(1))|0);
 var $16=$14<<2;
 var $17=(Math_imul($16,$15)|0);
 var $18=_xmalloc($17);
 var $19=$18;
 var $20=_strdup(3072);
 HEAP32[(($19)>>2)]=$20;
 var $21=HEAP32[((8992)>>2)];
 var $22=($21|0)>0;
 if($22){var $j_063=0;label=6;break;}else{var $23=$21;label=5;break;}
 case 5: 
 var $23;
 var $24=($3|0)>0;
 if($24){var $i_160=0;label=8;break;}else{var $79=$23;label=14;break;}
 case 6: 
 var $j_063;
 var $25=((6528+($j_063<<2))|0);
 var $26=HEAP32[(($25)>>2)];
 var $27=HEAP32[((14112)>>2)];
 var $28=(($27+20+((($26)*(24))&-1))|0);
 var $29=HEAP32[(($28)>>2)];
 var $30=_strdup($29);
 var $31=((($j_063)+(1))|0);
 var $32=(($19+($31<<2))|0);
 HEAP32[(($32)>>2)]=$30;
 var $33=HEAP32[((8992)>>2)];
 var $34=($31|0)<($33|0);
 if($34){var $j_063=$31;label=6;break;}else{var $23=$33;label=5;break;}
 case 7: 
 var $35;
 var $36=($37|0)<($3|0);
 if($36){var $i_160=$37;label=8;break;}else{var $79=$35;label=14;break;}
 case 8: 
 var $i_160;
 var $37=((($i_160)+(1))|0);
 var $38=_sprintf(25920,2304,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$37,tempVarArgs)); STACKTOP=tempVarArgs;
 var $39=_strdup(25920);
 var $40=HEAP32[((8992)>>2)];
 var $41=((($40)+(1))|0);
 var $42=(Math_imul($41,$37)|0);
 var $43=(($19+($42<<2))|0);
 HEAP32[(($43)>>2)]=$39;
 var $44=HEAP32[((8992)>>2)];
 var $45=($44|0)>0;
 if($45){var $j_156=0;label=9;break;}else{var $35=$44;label=7;break;}
 case 9: 
 var $j_156;
 var $46=((6528+($j_156<<2))|0);
 var $47=HEAP32[(($46)>>2)];
 var $48=HEAP32[((14112)>>2)];
 var $49=(($48+20+((($47)*(24))&-1)+20)|0);
 var $50=HEAP32[(($49)>>2)];
 var $51=(($50+($i_160<<3))|0);
 var $52=HEAPF64[(($51)>>3)];
 var $ld$0$0=(($51)|0);
 var $52$$SHADOW$0=HEAP32[(($ld$0$0)>>2)];
 var $ld$1$1=(($51+4)|0);
 var $52$$SHADOW$1=HEAP32[(($ld$1$1)>>2)];
 var $53$0=$52$$SHADOW$0;
 var $53$1=$52$$SHADOW$1;
 var $$etemp$2$0=-1;
 var $$etemp$2$1=2147483647;
 var $54$0=$53$0&$$etemp$2$0;
 var $54$1=$53$1&$$etemp$2$1;
 var $$etemp$3$0=0;
 var $$etemp$3$1=2146435072;
 var $55=(($54$1>>>0) > ($$etemp$3$1>>>0)) | (((($54$1>>>0) == ($$etemp$3$1>>>0) & ($54$0>>>0) >  ($$etemp$3$0>>>0))));
 if($55){var $s_0=1584;label=13;break;}else{label=10;break;}
 case 10: 
 var $57=(($48+20+((($47)*(24))&-1)+12)|0);
 var $58=HEAP32[(($57)>>2)];
 var $59=($58|0)==0;
 if($59){label=11;break;}else{label=12;break;}
 case 11: 
 var $61=(($48+20+((($47)*(24))&-1)+16)|0);
 var $62=HEAP32[(($61)>>2)];
 var $63=((584+($62<<2))|0);
 var $64=HEAP32[(($63)>>2)];
 var $65=_sprintf(25920,$64,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$52,tempVarArgs)); STACKTOP=tempVarArgs;
 var $s_0=25920;label=13;break;
 case 12: 
 var $67=(($52)&-1);
 var $68=(($58+($67<<2))|0);
 var $69=HEAP32[(($68)>>2)];
 var $s_0=$69;label=13;break;
 case 13: 
 var $s_0;
 var $71=_strdup($s_0);
 var $72=((($j_156)+(1))|0);
 var $73=HEAP32[((8992)>>2)];
 var $74=((($73)+(1))|0);
 var $75=(Math_imul($74,$37)|0);
 var $_sum47=((($75)+($72))|0);
 var $76=(($19+($_sum47<<2))|0);
 HEAP32[(($76)>>2)]=$71;
 var $77=HEAP32[((8992)>>2)];
 var $78=($72|0)<($77|0);
 if($78){var $j_156=$72;label=9;break;}else{var $35=$77;label=7;break;}
 case 14: 
 var $79;
 var $80=((($79)+(1))|0);
 var $81=_xmalloc($80);
 HEAP8[($81)]=0;
 var $82=HEAP32[((8992)>>2)];
 var $83=($82|0)>0;
 if($83){var $j_252=0;label=15;break;}else{var $_lcssa=$82;label=16;break;}
 case 15: 
 var $j_252;
 var $84=((6528+($j_252<<2))|0);
 var $85=HEAP32[(($84)>>2)];
 var $86=HEAP32[((14112)>>2)];
 var $87=(($86+20+((($85)*(24))&-1)+12)|0);
 var $88=HEAP32[(($87)>>2)];
 var $89=((($j_252)+(1))|0);
 var $90=(($81+$89)|0);
 var $not_=($88|0)!=0;
 var $_=($not_&1);
 HEAP8[($90)]=$_;
 var $91=HEAP32[((8992)>>2)];
 var $92=($89|0)<($91|0);
 if($92){var $j_252=$89;label=15;break;}else{var $_lcssa=$91;label=16;break;}
 case 16: 
 var $_lcssa;
 var $93=((($_lcssa)+(1))|0);
 _print_table($19,$14,$93,$81);
 _free($81);
 var $94=($14|0)>0;
 if($94){label=17;break;}else{label=21;break;}
 case 17: 
 var $_pre=HEAP32[((8992)>>2)];
 var $i_249=0;var $95=$_pre;label=18;break;
 case 18: 
 var $95;
 var $i_249;
 var $96=((($95)+(1))|0);
 var $97=($96|0)>0;
 if($97){var $j_348=0;var $98=$96;label=19;break;}else{var $106=$95;label=20;break;}
 case 19: 
 var $98;
 var $j_348;
 var $99=(Math_imul($98,$i_249)|0);
 var $_sum=((($99)+($j_348))|0);
 var $100=(($19+($_sum<<2))|0);
 var $101=HEAP32[(($100)>>2)];
 _free($101);
 var $102=((($j_348)+(1))|0);
 var $103=HEAP32[((8992)>>2)];
 var $104=((($103)+(1))|0);
 var $105=($102|0)<($104|0);
 if($105){var $j_348=$102;var $98=$104;label=19;break;}else{var $106=$103;label=20;break;}
 case 20: 
 var $106;
 var $107=((($i_249)+(1))|0);
 var $108=($107|0)<($14|0);
 if($108){var $i_249=$107;var $95=$106;label=18;break;}else{label=21;break;}
 case 21: 
 _free($18);
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }
}
function _proc_reg(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 HEAP32[((9008)>>2)]=0;
 HEAP32[((9000)>>2)]=0;
 label=2;break;
 case 2: 
 _scan();
 _keyword();
 var $1=HEAP32[((6944)>>2)];
 if(($1|0)==301){ label=3;break;}else if(($1|0)==309){ label=4;break;}else if(($1|0)==59){ label=6;break;}else{label=5;break;}
 case 3: 
 _parse_alpha_option();
 label=2;break;
 case 4: 
 _parse_data_option();
 label=2;break;
 case 5: 
 _expected(1560);
 label=2;break;
 case 6: 
 _scan();
 var $5=HEAP32[((14112)>>2)];
 var $6=($5|0)==0;
 if($6){label=7;break;}else{label=8;break;}
 case 7: 
 _stop(3800);
 label=8;break;
 case 8: 
 _keyword();
 var $8=HEAP32[((6944)>>2)];
 switch(($8|0)){case 0:case 309:case 327:case 330:{ label=11;break;}case 323:{ label=9;break;}default:{label=10;break;}}break;
 case 9: 
 _model_stmt();
 label=8;break;
 case 10: 
 _parse_default();
 label=8;break;
 case 11: 
 _regress();
 _print_title();
 _emit_line_center(3920);
 _emit_line(36056);
 _print_anova_table();
 _print_diag_table();
 _emit_line_center(2256);
 _emit_line(36056);
 _print_parameter_estimates();
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _proc_step(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 HEAP32[((9120)>>2)]=0;
 HEAP32[((8992)>>2)]=0;
 HEAP32[((9016)>>2)]=0;
 HEAP32[((9104)>>2)]=0;
 HEAP32[((9960)>>2)]=3;
 HEAPF64[((696)>>3)]=0.05;
 _select_dataset(0);
 _scan();
 _keyword();
 var $1=HEAP32[((6944)>>2)];
 if(($1|0)==302){ label=2;break;}else if(($1|0)==321){ label=3;break;}else if(($1|0)==326){ label=4;break;}else if(($1|0)==329){ label=5;break;}else{label=6;break;}
 case 2: 
 _proc_anova();
 label=7;break;
 case 3: 
 _proc_means();
 label=7;break;
 case 4: 
 _proc_print();
 label=7;break;
 case 5: 
 _proc_reg();
 label=7;break;
 case 6: 
 _expected(3720);
 label=7;break;
 case 7: 
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _compute_X(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP32[((9024)>>2)];
 var $2=($1|0)>0;
 if($2){var $l_031=0;var $i_032=0;label=2;break;}else{var $l_0_lcssa=0;label=16;break;}
 case 2: 
 var $i_032;
 var $l_031;
 var $3=HEAP32[((4128)>>2)];
 var $4=HEAP32[((14112)>>2)];
 var $5=(($4+20+((($3)*(24))&-1)+20)|0);
 var $6=HEAP32[(($5)>>2)];
 var $7=(($6+($i_032<<3))|0);
 var $8=HEAPF64[(($7)>>3)];
 var $ld$0$0=(($7)|0);
 var $8$$SHADOW$0=HEAP32[(($ld$0$0)>>2)];
 var $ld$1$1=(($7+4)|0);
 var $8$$SHADOW$1=HEAP32[(($ld$1$1)>>2)];
 var $9$0=$8$$SHADOW$0;
 var $9$1=$8$$SHADOW$1;
 var $$etemp$2$0=-1;
 var $$etemp$2$1=2147483647;
 var $10$0=$9$0&$$etemp$2$0;
 var $10$1=$9$1&$$etemp$2$1;
 var $$etemp$3$0=0;
 var $$etemp$3$1=2146435072;
 var $11=(($10$1>>>0) > ($$etemp$3$1>>>0)) | (((($10$1>>>0) == ($$etemp$3$1>>>0) & ($10$0>>>0) >  ($$etemp$3$0>>>0))));
 if($11){var $l_1=$l_031;label=15;break;}else{label=3;break;}
 case 3: 
 var $13=HEAP32[((36600)>>2)];
 var $14=(($13+($l_031<<3))|0);
 HEAPF64[(($14)>>3)]=$8;
 var $15=HEAP32[((9056)>>2)];
 var $16=($15|0)==0;
 if($16){label=4;break;}else{var $m_1_ph=0;label=5;break;}
 case 4: 
 var $18=HEAP32[((36552)>>2)];
 var $19=HEAP32[((9088)>>2)];
 var $20=(Math_imul($19,$l_031)|0);
 var $21=(($18+($20<<3))|0);
 HEAPF64[(($21)>>3)]=1;
 var $m_1_ph=1;label=5;break;
 case 5: 
 var $m_1_ph;
 var $22=HEAP32[((9008)>>2)];
 var $23=($22|0)>0;
 if($23){var $m_126=$m_1_ph;var $j_027=0;var $24=$22;label=6;break;}else{var $j_0_lcssa=0;var $64=$22;label=14;break;}
 case 6: 
 var $24;
 var $j_027;
 var $m_126;
 var $25=((5328+($j_027<<2))|0);
 var $26=HEAP32[(($25)>>2)];
 var $27=HEAP32[((14112)>>2)];
 var $28=(($27+20+((($26)*(24))&-1)+20)|0);
 var $29=HEAP32[(($28)>>2)];
 var $30=(($29+($i_032<<3))|0);
 var $31=HEAPF64[(($30)>>3)];
 var $ld$4$0=(($30)|0);
 var $31$$SHADOW$0=HEAP32[(($ld$4$0)>>2)];
 var $ld$5$1=(($30+4)|0);
 var $31$$SHADOW$1=HEAP32[(($ld$5$1)>>2)];
 var $32$0=$31$$SHADOW$0;
 var $32$1=$31$$SHADOW$1;
 var $$etemp$6$0=-1;
 var $$etemp$6$1=2147483647;
 var $33$0=$32$0&$$etemp$6$0;
 var $33$1=$32$1&$$etemp$6$1;
 var $$etemp$7$0=0;
 var $$etemp$7$1=2146435072;
 var $34=(($33$1>>>0) > ($$etemp$7$1>>>0)) | (((($33$1>>>0) == ($$etemp$7$1>>>0) & ($33$0>>>0) >  ($$etemp$7$0>>>0))));
 if($34){var $j_0_lcssa=$j_027;var $64=$24;label=14;break;}else{label=7;break;}
 case 7: 
 var $36=(($27+20+((($26)*(24))&-1)+12)|0);
 var $37=HEAP32[(($36)>>2)];
 var $38=($37|0)==0;
 if($38){label=8;break;}else{label=9;break;}
 case 8: 
 var $40=((($m_126)+(1))|0);
 var $41=HEAP32[((36552)>>2)];
 var $42=HEAP32[((9088)>>2)];
 var $43=(Math_imul($42,$l_031)|0);
 var $_sum24=((($43)+($m_126))|0);
 var $44=(($41+($_sum24<<3))|0);
 HEAPF64[(($44)>>3)]=$31;
 var $m_2=$40;label=13;break;
 case 9: 
 var $46=(($27+20+((($26)*(24))&-1)+8)|0);
 var $47=HEAP32[(($46)>>2)];
 var $48=($47|0)>0;
 if($48){label=10;break;}else{label=12;break;}
 case 10: 
 var $49=HEAP32[((36552)>>2)];
 var $50=HEAP32[((9088)>>2)];
 var $51=(Math_imul($50,$l_031)|0);
 var $k_025=0;label=11;break;
 case 11: 
 var $k_025;
 var $53=($k_025|0);
 var $54=$53==$31;
 var $55=((($k_025)+($m_126))|0);
 var $_sum=((($55)+($51))|0);
 var $56=(($49+($_sum<<3))|0);
 var $_=($54?1:0);
 HEAPF64[(($56)>>3)]=$_;
 var $57=((($k_025)+(1))|0);
 var $58=($57|0)<($47|0);
 if($58){var $k_025=$57;label=11;break;}else{label=12;break;}
 case 12: 
 var $59=((($47)+($m_126))|0);
 var $m_2=$59;label=13;break;
 case 13: 
 var $m_2;
 var $61=((($j_027)+(1))|0);
 var $62=HEAP32[((9008)>>2)];
 var $63=($61|0)<($62|0);
 if($63){var $m_126=$m_2;var $j_027=$61;var $24=$62;label=6;break;}else{var $j_0_lcssa=$61;var $64=$62;label=14;break;}
 case 14: 
 var $64;
 var $j_0_lcssa;
 var $65=($j_0_lcssa|0)==($64|0);
 var $66=($65&1);
 var $_l_0=((($66)+($l_031))|0);
 var $l_1=$_l_0;label=15;break;
 case 15: 
 var $l_1;
 var $68=((($i_032)+(1))|0);
 var $69=($68|0)<($1|0);
 if($69){var $l_031=$l_1;var $i_032=$68;label=2;break;}else{var $l_0_lcssa=$l_1;label=16;break;}
 case 16: 
 var $l_0_lcssa;
 HEAP32[((9024)>>2)]=$l_0_lcssa;
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _compute_G(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP32[((9040)>>2)];
 var $2=($1|0)>0;
 if($2){label=2;break;}else{var $max_0_lcssa=0;var $min_0_lcssa=0;label=9;break;}
 case 2: 
 var $3=HEAP32[((36568)>>2)];
 var $4=HEAP32[((9088)>>2)];
 var $i_0172_us=0;label=5;break;
 case 3: 
 var $6=((($i_0172_us)+(1))|0);
 var $7=($6|0)<($1|0);
 if($7){var $i_0172_us=$6;label=5;break;}else{label=6;break;}
 case 4: 
 var $j_0169_us;
 var $9=($i_0172_us|0)==($j_0169_us|0);
 var $_sum109_us=((($13)+($j_0169_us))|0);
 var $10=(($3+($_sum109_us<<3))|0);
 var $__us=($9?1:0);
 HEAPF64[(($10)>>3)]=$__us;
 var $11=((($j_0169_us)+(1))|0);
 var $12=($11|0)<($1|0);
 if($12){var $j_0169_us=$11;label=4;break;}else{label=3;break;}
 case 5: 
 var $i_0172_us;
 var $13=(Math_imul($4,$i_0172_us)|0);
 var $j_0169_us=0;label=4;break;
 case 6: 
 if($2){label=7;break;}else{var $max_0_lcssa=0;var $min_0_lcssa=0;label=9;break;}
 case 7: 
 var $14=HEAP32[((36560)>>2)];
 var $15=HEAP32[((9088)>>2)];
 var $16=HEAP32[((36568)>>2)];
 var $d_0161=0;var $max_0162=0;var $min_0163=0;label=16;break;
 case 8: 
 if($41){var $d_0161=$40;var $max_0162=$max_1;var $min_0163=$min_1;label=16;break;}else{var $max_0_lcssa=$max_1;var $min_0_lcssa=$min_1;label=9;break;}
 case 9: 
 var $min_0_lcssa;
 var $max_0_lcssa;
 var $d_1115=((($1)-(1))|0);
 var $17=($d_1115|0)>0;
 if($17){label=10;break;}else{label=33;break;}
 case 10: 
 var $18=HEAP32[((36560)>>2)];
 var $19=HEAP32[((9088)>>2)];
 var $20=HEAP32[((36568)>>2)];
 if($2){var $d_1116_us=$d_1115;label=15;break;}else{label=33;break;}
 case 11: 
 var $d_1_us=((($d_1116_us)-(1))|0);
 var $21=($d_1_us|0)>0;
 if($21){var $d_1116_us=$d_1_us;label=15;break;}else{label=33;break;}
 case 12: 
 var $23=((($i_3112_us_us)+(1))|0);
 var $24=($23|0)<($d_1116_us|0);
 if($24){var $i_3112_us_us=$23;label=13;break;}else{label=11;break;}
 case 13: 
 var $i_3112_us_us;
 var $25=(Math_imul($19,$i_3112_us_us)|0);
 var $_sum_us_us=((($25)+($d_1116_us))|0);
 var $26=(($18+($_sum_us_us<<3))|0);
 var $27=HEAPF64[(($26)>>3)];
 var $28=((-.0))-($27);
 var $j_7111_us_us=0;label=14;break;
 case 14: 
 var $j_7111_us_us;
 var $_sum91_us_us=((($38)+($j_7111_us_us))|0);
 var $30=(($20+($_sum91_us_us<<3))|0);
 var $31=HEAPF64[(($30)>>3)];
 var $32=($31)*($28);
 var $_sum92_us_us=((($25)+($j_7111_us_us))|0);
 var $33=(($20+($_sum92_us_us<<3))|0);
 var $34=HEAPF64[(($33)>>3)];
 var $35=($34)+($32);
 HEAPF64[(($33)>>3)]=$35;
 var $36=((($j_7111_us_us)+(1))|0);
 var $37=($36|0)<($1|0);
 if($37){var $j_7111_us_us=$36;label=14;break;}else{label=12;break;}
 case 15: 
 var $d_1116_us;
 var $38=(Math_imul($19,$d_1116_us)|0);
 var $i_3112_us_us=0;label=13;break;
 case 16: 
 var $min_0163;
 var $max_0162;
 var $d_0161;
 var $40=((($d_0161)+(1))|0);
 var $41=($40|0)<($1|0);
 if($41){var $i_1127=$40;var $k_0128=$d_0161;label=17;break;}else{label=24;break;}
 case 17: 
 var $k_0128;
 var $i_1127;
 var $42=(Math_imul($15,$i_1127)|0);
 var $_sum107=((($42)+($d_0161))|0);
 var $43=(($14+($_sum107<<3))|0);
 var $44=HEAPF64[(($43)>>3)];
 var $45=Math_abs($44);
 var $46=(Math_imul($15,$k_0128)|0);
 var $_sum108=((($46)+($d_0161))|0);
 var $47=(($14+($_sum108<<3))|0);
 var $48=HEAPF64[(($47)>>3)];
 var $49=Math_abs($48);
 var $50=$45>$49;
 var $k_1=($50?$i_1127:$k_0128);
 var $51=((($i_1127)+(1))|0);
 var $52=($51|0)<($1|0);
 if($52){var $i_1127=$51;var $k_0128=$k_1;label=17;break;}else{label=18;break;}
 case 18: 
 var $53=($k_1|0)==($d_0161|0);
 if($53){label=24;break;}else{label=19;break;}
 case 19: 
 var $54=($d_0161|0)<($1|0);
 if($54){label=20;break;}else{label=22;break;}
 case 20: 
 var $55=(Math_imul($15,$d_0161)|0);
 var $56=(Math_imul($15,$k_1)|0);
 var $j_1134=$d_0161;label=21;break;
 case 21: 
 var $j_1134;
 var $_sum104=((($55)+($j_1134))|0);
 var $58=(($14+($_sum104<<3))|0);
 var $59=HEAPF64[(($58)>>3)];
 var $_sum105=((($56)+($j_1134))|0);
 var $60=(($14+($_sum105<<3))|0);
 var $61=HEAPF64[(($60)>>3)];
 HEAPF64[(($58)>>3)]=$61;
 HEAPF64[(($60)>>3)]=$59;
 var $62=((($j_1134)+(1))|0);
 var $63=($62|0)<($1|0);
 if($63){var $j_1134=$62;label=21;break;}else{label=22;break;}
 case 22: 
 var $64=(Math_imul($15,$d_0161)|0);
 var $65=(Math_imul($15,$k_1)|0);
 var $j_2137=0;label=23;break;
 case 23: 
 var $j_2137;
 var $_sum101=((($64)+($j_2137))|0);
 var $67=(($16+($_sum101<<3))|0);
 var $68=HEAPF64[(($67)>>3)];
 var $_sum102=((($65)+($j_2137))|0);
 var $69=(($16+($_sum102<<3))|0);
 var $70=HEAPF64[(($69)>>3)];
 HEAPF64[(($67)>>3)]=$70;
 HEAPF64[(($69)>>3)]=$68;
 var $71=((($j_2137)+(1))|0);
 var $72=($71|0)<($1|0);
 if($72){var $j_2137=$71;label=23;break;}else{label=24;break;}
 case 24: 
 var $73=(Math_imul($15,$d_0161)|0);
 var $_sum93=((($73)+($d_0161))|0);
 var $74=(($14+($_sum93<<3))|0);
 var $75=HEAPF64[(($74)>>3)];
 var $76=$75==0;
 if($76){var $_0=-1;label=34;break;}else{label=25;break;}
 case 25: 
 var $78=Math_abs($75);
 var $79=$78>$max_0162;
 var $max_1=($79?$78:$max_0162);
 var $80=(1)/($75);
 var $81=Math_abs($80);
 var $82=$81>$min_0163;
 var $min_1=($82?$81:$min_0163);
 var $83=($d_0161|0)<($1|0);
 if($83){var $j_3140=$d_0161;label=26;break;}else{var $j_4144=0;label=27;break;}
 case 26: 
 var $j_3140;
 var $_sum100=((($73)+($j_3140))|0);
 var $84=(($14+($_sum100<<3))|0);
 var $85=HEAPF64[(($84)>>3)];
 var $86=($80)*($85);
 HEAPF64[(($84)>>3)]=$86;
 var $87=((($j_3140)+(1))|0);
 var $88=($87|0)<($1|0);
 if($88){var $j_3140=$87;label=26;break;}else{var $j_4144=0;label=27;break;}
 case 27: 
 var $j_4144;
 var $_sum99=((($73)+($j_4144))|0);
 var $89=(($16+($_sum99<<3))|0);
 var $90=HEAPF64[(($89)>>3)];
 var $91=($80)*($90);
 HEAPF64[(($89)>>3)]=$91;
 var $92=((($j_4144)+(1))|0);
 var $93=($92|0)<($1|0);
 if($93){var $j_4144=$92;label=27;break;}else{label=28;break;}
 case 28: 
 if($41){var $i_2154=$40;label=29;break;}else{var $max_0_lcssa=$max_1;var $min_0_lcssa=$min_1;label=9;break;}
 case 29: 
 var $i_2154;
 var $94=(Math_imul($15,$i_2154)|0);
 var $_sum94=((($94)+($d_0161))|0);
 var $95=(($14+($_sum94<<3))|0);
 var $96=HEAPF64[(($95)>>3)];
 var $97=((-.0))-($96);
 if($83){var $j_5147=$d_0161;label=30;break;}else{var $j_6150=0;label=31;break;}
 case 30: 
 var $j_5147;
 var $_sum97=((($73)+($j_5147))|0);
 var $98=(($14+($_sum97<<3))|0);
 var $99=HEAPF64[(($98)>>3)];
 var $100=($99)*($97);
 var $_sum98=((($94)+($j_5147))|0);
 var $101=(($14+($_sum98<<3))|0);
 var $102=HEAPF64[(($101)>>3)];
 var $103=($102)+($100);
 HEAPF64[(($101)>>3)]=$103;
 var $104=((($j_5147)+(1))|0);
 var $105=($104|0)<($1|0);
 if($105){var $j_5147=$104;label=30;break;}else{var $j_6150=0;label=31;break;}
 case 31: 
 var $j_6150;
 var $_sum95=((($73)+($j_6150))|0);
 var $106=(($16+($_sum95<<3))|0);
 var $107=HEAPF64[(($106)>>3)];
 var $108=($107)*($97);
 var $_sum96=((($94)+($j_6150))|0);
 var $109=(($16+($_sum96<<3))|0);
 var $110=HEAPF64[(($109)>>3)];
 var $111=($110)+($108);
 HEAPF64[(($109)>>3)]=$111;
 var $112=((($j_6150)+(1))|0);
 var $113=($112|0)<($1|0);
 if($113){var $j_6150=$112;label=31;break;}else{label=32;break;}
 case 32: 
 var $114=((($i_2154)+(1))|0);
 var $115=($114|0)<($1|0);
 if($115){var $i_2154=$114;label=29;break;}else{label=8;break;}
 case 33: 
 var $116=($max_0_lcssa)*($min_0_lcssa);
 var $not_=$116>=10000000000;
 var $_110=(($not_<<31)>>31);
 var $_0=$_110;label=34;break;
 case 34: 
 var $_0;
 return $_0;
  default: assert(0, "bad label: " + label);
 }
}
function _compute_mse(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP32[((9040)>>2)];
 var $2=((($1)-(1))|0);
 HEAP32[((13584)>>2)]=$2;
 var $3=HEAP32[((9024)>>2)];
 var $4=((($3)-($1))|0);
 HEAP32[((13592)>>2)]=$4;
 var $5=((($3)-(1))|0);
 HEAP32[((13576)>>2)]=$5;
 HEAPF64[((8)>>3)]=0;
 var $6=($3|0)>0;
 if($6){label=3;break;}else{label=2;break;}
 case 2: 
 HEAPF64[((40)>>3)]=0;
 HEAPF64[((56)>>3)]=0;
 HEAPF64[((32)>>3)]=0;
 var $56=0;var $55=0;label=13;break;
 case 3: 
 var $7=HEAP32[((36600)>>2)];
 var $storemerge24=0;var $i_025=0;label=4;break;
 case 4: 
 var $i_025;
 var $storemerge24;
 var $9=(($7+($i_025<<3))|0);
 var $10=HEAPF64[(($9)>>3)];
 var $11=($10)-($storemerge24);
 var $12=((($i_025)+(1))|0);
 var $13=($12|0);
 var $14=($11)/($13);
 var $15=($storemerge24)+($14);
 HEAPF64[((8)>>3)]=$15;
 var $16=($12|0)<($3|0);
 if($16){var $storemerge24=$15;var $i_025=$12;label=4;break;}else{label=5;break;}
 case 5: 
 HEAPF64[((40)>>3)]=0;
 HEAPF64[((56)>>3)]=0;
 HEAPF64[((32)>>3)]=0;
 if($6){label=6;break;}else{var $56=0;var $55=0;label=13;break;}
 case 6: 
 var $_pre=HEAP32[((9088)>>2)];
 var $i_121=0;var $19=0;var $18=0;var $17=0;label=7;break;
 case 7: 
 var $17;
 var $18;
 var $19;
 var $i_121;
 var $20=($_pre|0)>0;
 if($20){label=8;break;}else{var $yhat_0_lcssa=0;label=12;break;}
 case 8: 
 var $21=HEAP32[((36584)>>2)];
 var $22=HEAP32[((36552)>>2)];
 var $23=HEAP32[((36664)>>2)];
 var $j_018=0;var $k_019=0;var $yhat_020=0;label=9;break;
 case 9: 
 var $yhat_020;
 var $k_019;
 var $j_018;
 var $25=(($21+($j_018<<2))|0);
 var $26=HEAP32[(($25)>>2)];
 var $27=($26|0)==0;
 if($27){label=10;break;}else{var $yhat_1=$yhat_020;var $k_1=$k_019;label=11;break;}
 case 10: 
 var $29=(Math_imul($_pre,$i_121)|0);
 var $_sum=((($29)+($j_018))|0);
 var $30=(($22+($_sum<<3))|0);
 var $31=HEAPF64[(($30)>>3)];
 var $32=((($k_019)+(1))|0);
 var $33=(($23+($k_019<<3))|0);
 var $34=HEAPF64[(($33)>>3)];
 var $35=($31)*($34);
 var $36=($yhat_020)+($35);
 var $yhat_1=$36;var $k_1=$32;label=11;break;
 case 11: 
 var $k_1;
 var $yhat_1;
 var $38=((($j_018)+(1))|0);
 var $39=($38|0)<($_pre|0);
 if($39){var $j_018=$38;var $k_019=$k_1;var $yhat_020=$yhat_1;label=9;break;}else{var $yhat_0_lcssa=$yhat_1;label=12;break;}
 case 12: 
 var $yhat_0_lcssa;
 var $40=($yhat_0_lcssa)-($15);
 var $41=($40)*($40);
 var $42=($19)+($41);
 HEAPF64[((40)>>3)]=$42;
 var $43=HEAP32[((36600)>>2)];
 var $44=(($43+($i_121<<3))|0);
 var $45=HEAPF64[(($44)>>3)];
 var $46=($45)-($yhat_0_lcssa);
 var $47=($46)*($46);
 var $48=($18)+($47);
 HEAPF64[((56)>>3)]=$48;
 var $49=HEAPF64[(($44)>>3)];
 var $50=($49)-($15);
 var $51=($50)*($50);
 var $52=($17)+($51);
 HEAPF64[((32)>>3)]=$52;
 var $53=((($i_121)+(1))|0);
 var $54=($53|0)<($3|0);
 if($54){var $i_121=$53;var $19=$42;var $18=$48;var $17=$52;label=7;break;}else{var $56=$48;var $55=$42;label=13;break;}
 case 13: 
 var $55;
 var $56;
 var $57=($4|0);
 var $58=($56)/($57);
 HEAPF64[((216)>>3)]=$58;
 var $59=Math_sqrt($58);
 HEAPF64[((88)>>3)]=$59;
 var $60=($2|0);
 var $61=($55)/($60);
 HEAPF64[((200)>>3)]=$61;
 var $62=($61)/($58);
 HEAPF64[((568)>>3)]=$62;
 var $63=_fdist($62,$60,$57);
 var $64=(1)-($63);
 HEAPF64[((104)>>3)]=$64;
 var $65=HEAPF64[((56)>>3)];
 var $66=HEAPF64[((32)>>3)];
 var $67=($65)/($66);
 var $68=(1)-($67);
 HEAPF64[((72)>>3)]=$68;
 var $69=HEAP32[((13576)>>2)];
 var $70=($69|0);
 var $71=HEAP32[((13592)>>2)];
 var $72=($71|0);
 var $73=($70)/($72);
 var $74=($73)*($65);
 var $75=($74)/($66);
 var $76=(1)-($75);
 HEAPF64[((704)>>3)]=$76;
 var $77=HEAPF64[((88)>>3)];
 var $78=($77)*(100);
 var $79=HEAPF64[((8)>>3)];
 var $80=($78)/($79);
 HEAPF64[((672)>>3)]=$80;
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _regress(){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP32[((14112)>>2)];
 var $2=(($1+12)|0);
 var $3=HEAP32[(($2)>>2)];
 HEAP32[((9024)>>2)]=$3;
 var $4=HEAP32[((9056)>>2)];
 var $5=($4|0)==0;
 var $_=($5&1);
 HEAP32[((9088)>>2)]=$_;
 var $6=HEAP32[((9008)>>2)];
 var $7=($6|0)>0;
 if($7){var $i_092=0;var $8=$_;label=2;break;}else{var $20=$_;label=5;break;}
 case 2: 
 var $8;
 var $i_092;
 var $9=((5328+($i_092<<2))|0);
 var $10=HEAP32[(($9)>>2)];
 var $11=(($1+20+((($10)*(24))&-1)+12)|0);
 var $12=HEAP32[(($11)>>2)];
 var $13=($12|0)==0;
 if($13){var $_pn=1;label=4;break;}else{label=3;break;}
 case 3: 
 var $15=(($1+20+((($10)*(24))&-1)+8)|0);
 var $16=HEAP32[(($15)>>2)];
 var $_pn=$16;label=4;break;
 case 4: 
 var $_pn;
 var $storemerge14=((($8)+($_pn))|0);
 HEAP32[((9088)>>2)]=$storemerge14;
 var $18=((($i_092)+(1))|0);
 var $19=($18|0)<($6|0);
 if($19){var $i_092=$18;var $8=$storemerge14;label=2;break;}else{var $20=$storemerge14;label=5;break;}
 case 5: 
 var $20;
 var $21=HEAP32[((36584)>>2)];
 var $22=($21|0)==0;
 if($22){var $44=$20;label=7;break;}else{label=6;break;}
 case 6: 
 var $24=$21;
 _free($24);
 var $25=HEAP32[((36600)>>2)];
 var $26=$25;
 _free($26);
 var $27=HEAP32[((36664)>>2)];
 var $28=$27;
 _free($28);
 var $29=HEAP32[((36640)>>2)];
 var $30=$29;
 _free($30);
 var $31=HEAP32[((36624)>>2)];
 var $32=$31;
 _free($32);
 var $33=HEAP32[((36648)>>2)];
 var $34=$33;
 _free($34);
 var $35=HEAP32[((36576)>>2)];
 var $36=$35;
 _free($36);
 var $37=HEAP32[((36568)>>2)];
 var $38=$37;
 _free($38);
 var $39=HEAP32[((36560)>>2)];
 var $40=$39;
 _free($40);
 var $41=HEAP32[((36552)>>2)];
 var $42=$41;
 _free($42);
 var $_pre=HEAP32[((9088)>>2)];
 var $44=$_pre;label=7;break;
 case 7: 
 var $44;
 var $45=$44<<2;
 var $46=_xmalloc($45);
 var $47=$46;
 HEAP32[((36584)>>2)]=$47;
 var $48=HEAP32[((9024)>>2)];
 var $49=$48<<3;
 var $50=_xmalloc($49);
 var $51=$50;
 HEAP32[((36600)>>2)]=$51;
 var $52=HEAP32[((9088)>>2)];
 var $53=$52<<3;
 var $54=_xmalloc($53);
 var $55=$54;
 HEAP32[((36664)>>2)]=$55;
 var $56=HEAP32[((9088)>>2)];
 var $57=$56<<3;
 var $58=_xmalloc($57);
 var $59=$58;
 HEAP32[((36640)>>2)]=$59;
 var $60=HEAP32[((9088)>>2)];
 var $61=$60<<3;
 var $62=_xmalloc($61);
 var $63=$62;
 HEAP32[((36624)>>2)]=$63;
 var $64=HEAP32[((9088)>>2)];
 var $65=$64<<3;
 var $66=_xmalloc($65);
 var $67=$66;
 HEAP32[((36648)>>2)]=$67;
 var $68=HEAP32[((9088)>>2)];
 var $69=$68<<3;
 var $70=(Math_imul($69,$68)|0);
 var $71=_xmalloc($70);
 var $72=$71;
 HEAP32[((36576)>>2)]=$72;
 var $73=HEAP32[((9088)>>2)];
 var $74=$73<<3;
 var $75=(Math_imul($74,$73)|0);
 var $76=_xmalloc($75);
 var $77=$76;
 HEAP32[((36568)>>2)]=$77;
 var $78=HEAP32[((9088)>>2)];
 var $79=$78<<3;
 var $80=(Math_imul($79,$78)|0);
 var $81=_xmalloc($80);
 var $82=$81;
 HEAP32[((36560)>>2)]=$82;
 var $83=HEAP32[((9024)>>2)];
 var $84=HEAP32[((9088)>>2)];
 var $85=$83<<3;
 var $86=(Math_imul($85,$84)|0);
 var $87=_xmalloc($86);
 var $88=$87;
 HEAP32[((36552)>>2)]=$88;
 _compute_X();
 var $89=HEAP32[((9088)>>2)];
 HEAP32[((9040)>>2)]=$89;
 var $90=($89|0)>0;
 if($90){var $i_187=0;label=8;break;}else{label=21;break;}
 case 8: 
 var $i_187;
 var $91=HEAP32[((36584)>>2)];
 var $92=(($91+($i_187<<2))|0);
 HEAP32[(($92)>>2)]=0;
 var $93=((($i_187)+(1))|0);
 var $_pr=HEAP32[((9088)>>2)];
 var $94=($93|0)<($_pr|0);
 if($94){var $i_187=$93;label=8;break;}else{label=9;break;}
 case 9: 
 var $95=($_pr|0)>0;
 if($95){label=10;break;}else{label=21;break;}
 case 10: 
 var $_pre_i=HEAP32[((36584)>>2)];
 var $i_024_i=0;var $l_027_i=0;label=11;break;
 case 11: 
 var $l_027_i;
 var $i_024_i;
 var $97=(($_pre_i+($i_024_i<<2))|0);
 var $98=HEAP32[(($97)>>2)];
 var $99=($98|0)==0;
 if($99){label=12;break;}else{var $l_1_i=$l_027_i;label=20;break;}
 case 12: 
 var $100=(Math_imul($l_027_i,$_pr)|0);
 var $j_018_i=0;var $m_021_i=0;label=13;break;
 case 13: 
 var $m_021_i;
 var $j_018_i;
 var $101=(($_pre_i+($j_018_i<<2))|0);
 var $102=HEAP32[(($101)>>2)];
 var $103=($102|0)==0;
 if($103){label=14;break;}else{var $m_1_i=$m_021_i;label=18;break;}
 case 14: 
 var $104=HEAP32[((9024)>>2)];
 var $105=($104|0)>0;
 if($105){label=15;break;}else{var $t_0_lcssa_i=0;label=17;break;}
 case 15: 
 var $106=HEAP32[((36552)>>2)];
 var $k_015_i=0;var $t_016_i=0;label=16;break;
 case 16: 
 var $t_016_i;
 var $k_015_i;
 var $108=(Math_imul($k_015_i,$_pr)|0);
 var $_sum13_i=((($108)+($i_024_i))|0);
 var $109=(($106+($_sum13_i<<3))|0);
 var $110=HEAPF64[(($109)>>3)];
 var $_sum14_i=((($108)+($j_018_i))|0);
 var $111=(($106+($_sum14_i<<3))|0);
 var $112=HEAPF64[(($111)>>3)];
 var $113=($110)*($112);
 var $114=($t_016_i)+($113);
 var $115=((($k_015_i)+(1))|0);
 var $116=($115|0)<($104|0);
 if($116){var $k_015_i=$115;var $t_016_i=$114;label=16;break;}else{var $t_0_lcssa_i=$114;label=17;break;}
 case 17: 
 var $t_0_lcssa_i;
 var $117=HEAP32[((36560)>>2)];
 var $_sum_i=((($m_021_i)+($100))|0);
 var $118=(($117+($_sum_i<<3))|0);
 HEAPF64[(($118)>>3)]=$t_0_lcssa_i;
 var $119=((($m_021_i)+(1))|0);
 var $m_1_i=$119;label=18;break;
 case 18: 
 var $m_1_i;
 var $121=((($j_018_i)+(1))|0);
 var $122=($121|0)<($_pr|0);
 if($122){var $j_018_i=$121;var $m_021_i=$m_1_i;label=13;break;}else{label=19;break;}
 case 19: 
 var $123=((($l_027_i)+(1))|0);
 var $l_1_i=$123;label=20;break;
 case 20: 
 var $l_1_i;
 var $125=((($i_024_i)+(1))|0);
 var $126=($125|0)<($_pr|0);
 if($126){var $i_024_i=$125;var $l_027_i=$l_1_i;label=11;break;}else{label=21;break;}
 case 21: 
 var $127=_compute_G();
 var $128=($127|0)==-1;
 if($128){label=22;break;}else{label=53;break;}
 case 22: 
 HEAP32[((9040)>>2)]=0;
 var $130=HEAP32[((9088)>>2)];
 var $131=($130|0)>0;
 if($131){var $i_281=0;label=24;break;}else{var $_lcssa78=$130;label=40;break;}
 case 23: 
 var $132=($136|0)>0;
 if($132){var $i_379=0;label=25;break;}else{var $_lcssa78=$136;label=40;break;}
 case 24: 
 var $i_281;
 var $133=HEAP32[((36584)>>2)];
 var $134=(($133+($i_281<<2))|0);
 HEAP32[(($134)>>2)]=1;
 var $135=((($i_281)+(1))|0);
 var $136=HEAP32[((9088)>>2)];
 var $137=($135|0)<($136|0);
 if($137){var $i_281=$135;label=24;break;}else{label=23;break;}
 case 25: 
 var $i_379;
 var $138=HEAP32[((9040)>>2)];
 var $139=((($138)+(1))|0);
 HEAP32[((9040)>>2)]=$139;
 var $140=HEAP32[((36584)>>2)];
 var $141=(($140+($i_379<<2))|0);
 HEAP32[(($141)>>2)]=0;
 var $142=HEAP32[((9088)>>2)];
 var $143=($142|0)>0;
 if($143){label=26;break;}else{label=37;break;}
 case 26: 
 var $_pre_i17=HEAP32[((36584)>>2)];
 var $i_024_i20=0;var $l_027_i19=0;label=27;break;
 case 27: 
 var $l_027_i19;
 var $i_024_i20;
 var $145=(($_pre_i17+($i_024_i20<<2))|0);
 var $146=HEAP32[(($145)>>2)];
 var $147=($146|0)==0;
 if($147){label=28;break;}else{var $l_1_i35=$l_027_i19;label=36;break;}
 case 28: 
 var $148=(Math_imul($l_027_i19,$142)|0);
 var $j_018_i22=0;var $m_021_i21=0;label=29;break;
 case 29: 
 var $m_021_i21;
 var $j_018_i22;
 var $149=(($_pre_i17+($j_018_i22<<2))|0);
 var $150=HEAP32[(($149)>>2)];
 var $151=($150|0)==0;
 if($151){label=30;break;}else{var $m_1_i33=$m_021_i21;label=34;break;}
 case 30: 
 var $152=HEAP32[((9024)>>2)];
 var $153=($152|0)>0;
 if($153){label=31;break;}else{var $t_0_lcssa_i30=0;label=33;break;}
 case 31: 
 var $154=HEAP32[((36552)>>2)];
 var $k_015_i27=0;var $t_016_i26=0;label=32;break;
 case 32: 
 var $t_016_i26;
 var $k_015_i27;
 var $156=(Math_imul($k_015_i27,$142)|0);
 var $_sum13_i28=((($156)+($i_024_i20))|0);
 var $157=(($154+($_sum13_i28<<3))|0);
 var $158=HEAPF64[(($157)>>3)];
 var $_sum14_i29=((($156)+($j_018_i22))|0);
 var $159=(($154+($_sum14_i29<<3))|0);
 var $160=HEAPF64[(($159)>>3)];
 var $161=($158)*($160);
 var $162=($t_016_i26)+($161);
 var $163=((($k_015_i27)+(1))|0);
 var $164=($163|0)<($152|0);
 if($164){var $k_015_i27=$163;var $t_016_i26=$162;label=32;break;}else{var $t_0_lcssa_i30=$162;label=33;break;}
 case 33: 
 var $t_0_lcssa_i30;
 var $165=HEAP32[((36560)>>2)];
 var $_sum_i31=((($m_021_i21)+($148))|0);
 var $166=(($165+($_sum_i31<<3))|0);
 HEAPF64[(($166)>>3)]=$t_0_lcssa_i30;
 var $167=((($m_021_i21)+(1))|0);
 var $m_1_i33=$167;label=34;break;
 case 34: 
 var $m_1_i33;
 var $169=((($j_018_i22)+(1))|0);
 var $170=($169|0)<($142|0);
 if($170){var $j_018_i22=$169;var $m_021_i21=$m_1_i33;label=29;break;}else{label=35;break;}
 case 35: 
 var $171=((($l_027_i19)+(1))|0);
 var $l_1_i35=$171;label=36;break;
 case 36: 
 var $l_1_i35;
 var $173=((($i_024_i20)+(1))|0);
 var $174=($173|0)<($142|0);
 if($174){var $i_024_i20=$173;var $l_027_i19=$l_1_i35;label=27;break;}else{label=37;break;}
 case 37: 
 var $175=_compute_G();
 var $176=($175|0)==-1;
 if($176){label=38;break;}else{label=39;break;}
 case 38: 
 var $178=HEAP32[((9040)>>2)];
 var $179=((($178)-(1))|0);
 HEAP32[((9040)>>2)]=$179;
 var $180=HEAP32[((36584)>>2)];
 var $181=(($180+($i_379<<2))|0);
 HEAP32[(($181)>>2)]=1;
 label=39;break;
 case 39: 
 var $183=((($i_379)+(1))|0);
 var $_pr71=HEAP32[((9088)>>2)];
 var $184=($183|0)<($_pr71|0);
 if($184){var $i_379=$183;label=25;break;}else{var $_lcssa78=$_pr71;label=40;break;}
 case 40: 
 var $_lcssa78;
 var $185=((($_lcssa78)-(1))|0);
 var $186=HEAP32[((36584)>>2)];
 var $187=(($186+($185<<2))|0);
 var $188=HEAP32[(($187)>>2)];
 var $189=($188|0)==0;
 if($189){label=53;break;}else{label=41;break;}
 case 41: 
 var $191=($_lcssa78|0)>0;
 if($191){var $i_024_i40=0;var $l_027_i39=0;label=42;break;}else{label=52;break;}
 case 42: 
 var $l_027_i39;
 var $i_024_i40;
 var $192=(($186+($i_024_i40<<2))|0);
 var $193=HEAP32[(($192)>>2)];
 var $194=($193|0)==0;
 if($194){label=43;break;}else{var $l_1_i55=$l_027_i39;label=51;break;}
 case 43: 
 var $195=(Math_imul($l_027_i39,$_lcssa78)|0);
 var $j_018_i42=0;var $m_021_i41=0;label=44;break;
 case 44: 
 var $m_021_i41;
 var $j_018_i42;
 var $196=(($186+($j_018_i42<<2))|0);
 var $197=HEAP32[(($196)>>2)];
 var $198=($197|0)==0;
 if($198){label=45;break;}else{var $m_1_i53=$m_021_i41;label=49;break;}
 case 45: 
 var $199=HEAP32[((9024)>>2)];
 var $200=($199|0)>0;
 if($200){label=46;break;}else{var $t_0_lcssa_i50=0;label=48;break;}
 case 46: 
 var $201=HEAP32[((36552)>>2)];
 var $k_015_i47=0;var $t_016_i46=0;label=47;break;
 case 47: 
 var $t_016_i46;
 var $k_015_i47;
 var $203=(Math_imul($k_015_i47,$_lcssa78)|0);
 var $_sum13_i48=((($203)+($i_024_i40))|0);
 var $204=(($201+($_sum13_i48<<3))|0);
 var $205=HEAPF64[(($204)>>3)];
 var $_sum14_i49=((($203)+($j_018_i42))|0);
 var $206=(($201+($_sum14_i49<<3))|0);
 var $207=HEAPF64[(($206)>>3)];
 var $208=($205)*($207);
 var $209=($t_016_i46)+($208);
 var $210=((($k_015_i47)+(1))|0);
 var $211=($210|0)<($199|0);
 if($211){var $k_015_i47=$210;var $t_016_i46=$209;label=47;break;}else{var $t_0_lcssa_i50=$209;label=48;break;}
 case 48: 
 var $t_0_lcssa_i50;
 var $212=HEAP32[((36560)>>2)];
 var $_sum_i51=((($m_021_i41)+($195))|0);
 var $213=(($212+($_sum_i51<<3))|0);
 HEAPF64[(($213)>>3)]=$t_0_lcssa_i50;
 var $214=((($m_021_i41)+(1))|0);
 var $m_1_i53=$214;label=49;break;
 case 49: 
 var $m_1_i53;
 var $216=((($j_018_i42)+(1))|0);
 var $217=($216|0)<($_lcssa78|0);
 if($217){var $j_018_i42=$216;var $m_021_i41=$m_1_i53;label=44;break;}else{label=50;break;}
 case 50: 
 var $218=((($l_027_i39)+(1))|0);
 var $l_1_i55=$218;label=51;break;
 case 51: 
 var $l_1_i55;
 var $220=((($i_024_i40)+(1))|0);
 var $221=($220|0)<($_lcssa78|0);
 if($221){var $i_024_i40=$220;var $l_027_i39=$l_1_i55;label=42;break;}else{label=52;break;}
 case 52: 
 var $222=_compute_G();
 label=53;break;
 case 53: 
 var $223=HEAP32[((9040)>>2)];
 var $224=($223|0)>0;
 var $225=HEAP32[((9024)>>2)];
 var $226=($223|0)<($225|0);
 var $or_cond=$224&$226;
 if($or_cond){label=55;break;}else{label=54;break;}
 case 54: 
 var $228=_sprintf(12576,768,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 16)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$223,HEAP32[(((tempVarArgs)+(8))>>2)]=$225,tempVarArgs)); STACKTOP=tempVarArgs;
 _stop(12576);
 label=55;break;
 case 55: 
 var $229=HEAP32[((9088)>>2)];
 var $230=($229|0)>0;
 if($230){label=56;break;}else{label=57;break;}
 case 56: 
 var $_pre_i61=HEAP32[((36584)>>2)];
 var $i_030_i=0;var $l_033_i=0;label=59;break;
 case 57: 
 var $231=HEAP32[((9040)>>2)];
 var $232=($231|0)>0;
 if($232){label=58;break;}else{label=68;break;}
 case 58: 
 var $233=HEAP32[((36664)>>2)];
 var $234=HEAP32[((36568)>>2)];
 var $235=HEAP32[((36560)>>2)];
 var $i_122_i=0;label=65;break;
 case 59: 
 var $l_033_i;
 var $i_030_i;
 var $237=(($_pre_i61+($i_030_i<<2))|0);
 var $238=HEAP32[(($237)>>2)];
 var $239=($238|0)==0;
 if($239){label=60;break;}else{var $l_1_i63=$l_033_i;label=64;break;}
 case 60: 
 var $240=HEAP32[((9024)>>2)];
 var $241=($240|0)>0;
 if($241){label=61;break;}else{var $t_0_lcssa_i62=0;label=63;break;}
 case 61: 
 var $242=HEAP32[((36552)>>2)];
 var $243=HEAP32[((36600)>>2)];
 var $j_025_i=0;var $t_026_i=0;label=62;break;
 case 62: 
 var $t_026_i;
 var $j_025_i;
 var $245=(Math_imul($j_025_i,$229)|0);
 var $_sum18_i=((($245)+($i_030_i))|0);
 var $246=(($242+($_sum18_i<<3))|0);
 var $247=HEAPF64[(($246)>>3)];
 var $248=(($243+($j_025_i<<3))|0);
 var $249=HEAPF64[(($248)>>3)];
 var $250=($247)*($249);
 var $251=($t_026_i)+($250);
 var $252=((($j_025_i)+(1))|0);
 var $253=($252|0)<($240|0);
 if($253){var $j_025_i=$252;var $t_026_i=$251;label=62;break;}else{var $t_0_lcssa_i62=$251;label=63;break;}
 case 63: 
 var $t_0_lcssa_i62;
 var $254=((($l_033_i)+(1))|0);
 var $255=HEAP32[((36560)>>2)];
 var $256=(($255+($l_033_i<<3))|0);
 HEAPF64[(($256)>>3)]=$t_0_lcssa_i62;
 var $l_1_i63=$254;label=64;break;
 case 64: 
 var $l_1_i63;
 var $258=((($i_030_i)+(1))|0);
 var $259=($258|0)<($229|0);
 if($259){var $i_030_i=$258;var $l_033_i=$l_1_i63;label=59;break;}else{label=57;break;}
 case 65: 
 var $i_122_i;
 var $260=(Math_imul($i_122_i,$229)|0);
 var $j_119_i=0;var $t_120_i=0;label=66;break;
 case 66: 
 var $t_120_i;
 var $j_119_i;
 var $_sum_i65=((($j_119_i)+($260))|0);
 var $262=(($234+($_sum_i65<<3))|0);
 var $263=HEAPF64[(($262)>>3)];
 var $264=(($235+($j_119_i<<3))|0);
 var $265=HEAPF64[(($264)>>3)];
 var $266=($263)*($265);
 var $267=($t_120_i)+($266);
 var $268=((($j_119_i)+(1))|0);
 var $269=($268|0)<($231|0);
 if($269){var $j_119_i=$268;var $t_120_i=$267;label=66;break;}else{label=67;break;}
 case 67: 
 var $270=(($233+($i_122_i<<3))|0);
 HEAPF64[(($270)>>3)]=$267;
 var $271=((($i_122_i)+(1))|0);
 var $272=($271|0)<($231|0);
 if($272){var $i_122_i=$271;label=65;break;}else{label=68;break;}
 case 68: 
 _compute_mse();
 var $273=HEAP32[((9040)>>2)];
 var $274=($273|0)>0;
 if($274){label=69;break;}else{label=80;break;}
 case 69: 
 var $275=HEAP32[((36568)>>2)];
 var $276=HEAP32[((9088)>>2)];
 var $277=HEAP32[((36576)>>2)];
 var $i_09_i=0;label=70;break;
 case 70: 
 var $i_09_i;
 var $278=(Math_imul($i_09_i,$276)|0);
 var $j_08_i=0;label=71;break;
 case 71: 
 var $j_08_i;
 var $280=HEAPF64[((216)>>3)];
 var $_sum_i69=((($j_08_i)+($278))|0);
 var $281=(($275+($_sum_i69<<3))|0);
 var $282=HEAPF64[(($281)>>3)];
 var $283=($280)*($282);
 var $284=(($277+($_sum_i69<<3))|0);
 HEAPF64[(($284)>>3)]=$283;
 var $285=((($j_08_i)+(1))|0);
 var $286=($285|0)<($273|0);
 if($286){var $j_08_i=$285;label=71;break;}else{label=72;break;}
 case 72: 
 var $287=((($i_09_i)+(1))|0);
 var $288=($287|0)<($273|0);
 if($288){var $i_09_i=$287;label=70;break;}else{label=73;break;}
 case 73: 
 var $289=HEAP32[((36640)>>2)];
 var $i_05_i59=0;label=74;break;
 case 74: 
 var $i_05_i59;
 var $291=(Math_imul($i_05_i59,$276)|0);
 var $_sum_i60=((($291)+($i_05_i59))|0);
 var $292=(($277+($_sum_i60<<3))|0);
 var $293=HEAPF64[(($292)>>3)];
 var $294=Math_sqrt($293);
 var $295=(($289+($i_05_i59<<3))|0);
 HEAPF64[(($295)>>3)]=$294;
 var $296=((($i_05_i59)+(1))|0);
 var $297=($296|0)<($273|0);
 if($297){var $i_05_i59=$296;label=74;break;}else{label=75;break;}
 case 75: 
 var $298=HEAP32[((36664)>>2)];
 var $299=HEAP32[((36624)>>2)];
 var $i_05_i=0;label=76;break;
 case 76: 
 var $i_05_i;
 var $301=(($298+($i_05_i<<3))|0);
 var $302=HEAPF64[(($301)>>3)];
 var $303=(($289+($i_05_i<<3))|0);
 var $304=HEAPF64[(($303)>>3)];
 var $305=($302)/($304);
 var $306=(($299+($i_05_i<<3))|0);
 HEAPF64[(($306)>>3)]=$305;
 var $307=((($i_05_i)+(1))|0);
 var $308=($307|0)<($273|0);
 if($308){var $i_05_i=$307;label=76;break;}else{label=77;break;}
 case 77: 
 var $309=HEAP32[((9024)>>2)];
 var $310=((($309)-($273))|0);
 var $311=($310|0);
 var $i_04_i=0;var $313=$299;label=78;break;
 case 78: 
 var $313;
 var $i_04_i;
 var $314=(($313+($i_04_i<<3))|0);
 var $315=HEAPF64[(($314)>>3)];
 var $316=Math_abs($315);
 var $317=_tdist($316,$311);
 var $318=(1)-($317);
 var $319=($318)*(2);
 var $320=HEAP32[((36648)>>2)];
 var $321=(($320+($i_04_i<<3))|0);
 HEAPF64[(($321)>>3)]=$319;
 var $322=((($i_04_i)+(1))|0);
 var $323=HEAP32[((9040)>>2)];
 var $324=($322|0)<($323|0);
 if($324){label=79;break;}else{label=80;break;}
 case 79: 
 var $_pre105=HEAP32[((36624)>>2)];
 var $i_04_i=$322;var $313=$_pre105;label=78;break;
 case 80: 
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }
}
function _print_parameter_estimates(){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP32[((9088)>>2)];
 var $2=((($1)+(1))|0);
 var $3=((($2)*(20))&-1);
 var $4=_xmalloc($3);
 var $5=$4;
 var $6=_strdup(36072);
 HEAP32[(($5)>>2)]=$6;
 var $7=_strdup(3984);
 var $8=(($4+4)|0);
 var $9=$8;
 HEAP32[(($9)>>2)]=$7;
 var $10=_strdup(3864);
 var $11=(($4+8)|0);
 var $12=$11;
 HEAP32[(($12)>>2)]=$10;
 var $13=_strdup(3744);
 var $14=(($4+12)|0);
 var $15=$14;
 HEAP32[(($15)>>2)]=$13;
 var $16=_strdup(3616);
 var $17=(($4+16)|0);
 var $18=$17;
 HEAP32[(($18)>>2)]=$16;
 var $19=HEAP32[((9056)>>2)];
 var $20=($19|0)==0;
 if($20){label=2;break;}else{var $k_1_ph=1;label=3;break;}
 case 2: 
 var $22=_strdup(3488);
 var $23=(($4+20)|0);
 var $24=$23;
 HEAP32[(($24)>>2)]=$22;
 var $k_1_ph=2;label=3;break;
 case 3: 
 var $k_1_ph;
 var $25=HEAP32[((9008)>>2)];
 var $26=($25|0)>0;
 if($26){var $k_172=$k_1_ph;var $i_073=0;label=5;break;}else{label=4;break;}
 case 4: 
 var $27=($1|0)>0;
 if($27){var $k_464=0;var $i_165=1;label=12;break;}else{label=16;break;}
 case 5: 
 var $i_073;
 var $k_172;
 var $28=((5328+($i_073<<2))|0);
 var $29=HEAP32[(($28)>>2)];
 var $30=HEAP32[((14112)>>2)];
 var $31=(($30+20+((($29)*(24))&-1)+12)|0);
 var $32=HEAP32[(($31)>>2)];
 var $33=($32|0)==0;
 if($33){label=6;break;}else{label=7;break;}
 case 6: 
 var $35=(($30+20+((($29)*(24))&-1))|0);
 var $36=HEAP32[(($35)>>2)];
 var $37=_strdup($36);
 var $38=((($k_172)+(1))|0);
 var $39=((($k_172)*(5))&-1);
 var $40=(($5+($39<<2))|0);
 HEAP32[(($40)>>2)]=$37;
 var $k_3=$38;label=11;break;
 case 7: 
 var $42=(($30+20+((($29)*(24))&-1)+8)|0);
 var $43=HEAP32[(($42)>>2)];
 var $44=($43|0)>0;
 if($44){var $k_267=$k_172;var $j_068=0;var $46=$30;var $45=$32;label=8;break;}else{var $k_3=$k_172;label=11;break;}
 case 8: 
 var $45;
 var $46;
 var $j_068;
 var $k_267;
 var $47=(($46+20+((($29)*(24))&-1))|0);
 var $48=HEAP32[(($47)>>2)];
 var $49=(($45+($j_068<<2))|0);
 var $50=HEAP32[(($49)>>2)];
 var $51=_sprintf(8872,3384,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 16)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$48,HEAP32[(((tempVarArgs)+(8))>>2)]=$50,tempVarArgs)); STACKTOP=tempVarArgs;
 var $52=_strdup(8872);
 var $53=((($k_267)*(5))&-1);
 var $54=(($5+($53<<2))|0);
 HEAP32[(($54)>>2)]=$52;
 var $55=((($j_068)+(1))|0);
 var $56=($55|0)<($43|0);
 if($56){label=9;break;}else{label=10;break;}
 case 9: 
 var $57=((($k_267)+(1))|0);
 var $_pre=HEAP32[((14112)>>2)];
 var $_phi_trans_insert=(($_pre+20+((($29)*(24))&-1)+12)|0);
 var $_pre77=HEAP32[(($_phi_trans_insert)>>2)];
 var $k_267=$57;var $j_068=$55;var $46=$_pre;var $45=$_pre77;label=8;break;
 case 10: 
 var $58=((($k_172)+($43))|0);
 var $k_3=$58;label=11;break;
 case 11: 
 var $k_3;
 var $59=((($i_073)+(1))|0);
 var $60=HEAP32[((9008)>>2)];
 var $61=($59|0)<($60|0);
 if($61){var $k_172=$k_3;var $i_073=$59;label=5;break;}else{label=4;break;}
 case 12: 
 var $i_165;
 var $k_464;
 var $62=((($i_165)-(1))|0);
 var $63=HEAP32[((36584)>>2)];
 var $64=(($63+($62<<2))|0);
 var $65=HEAP32[(($64)>>2)];
 var $66=($65|0)==0;
 if($66){label=14;break;}else{label=13;break;}
 case 13: 
 var $68=_strdup(3328);
 var $69=((($i_165)*(5))&-1);
 var $_sum57=((($69)+(1))|0);
 var $70=(($5+($_sum57<<2))|0);
 HEAP32[(($70)>>2)]=$68;
 var $71=_strdup(3328);
 var $_sum58=((($69)+(2))|0);
 var $72=(($5+($_sum58<<2))|0);
 HEAP32[(($72)>>2)]=$71;
 var $73=_strdup(3328);
 var $_sum59=((($69)+(3))|0);
 var $74=(($5+($_sum59<<2))|0);
 HEAP32[(($74)>>2)]=$73;
 var $75=_strdup(3328);
 var $_sum60=((($69)+(4))|0);
 var $76=(($5+($_sum60<<2))|0);
 HEAP32[(($76)>>2)]=$75;
 var $k_5=$k_464;label=15;break;
 case 14: 
 var $78=HEAP32[((36664)>>2)];
 var $79=(($78+($k_464<<3))|0);
 var $80=HEAPF64[(($79)>>3)];
 var $81=_sprintf(8872,3272,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$80,tempVarArgs)); STACKTOP=tempVarArgs;
 var $82=_strdup(8872);
 var $83=((($i_165)*(5))&-1);
 var $_sum53=((($83)+(1))|0);
 var $84=(($5+($_sum53<<2))|0);
 HEAP32[(($84)>>2)]=$82;
 var $85=HEAP32[((36640)>>2)];
 var $86=(($85+($k_464<<3))|0);
 var $87=HEAPF64[(($86)>>3)];
 var $88=_sprintf(8872,3272,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$87,tempVarArgs)); STACKTOP=tempVarArgs;
 var $89=_strdup(8872);
 var $_sum54=((($83)+(2))|0);
 var $90=(($5+($_sum54<<2))|0);
 HEAP32[(($90)>>2)]=$89;
 var $91=HEAP32[((36624)>>2)];
 var $92=(($91+($k_464<<3))|0);
 var $93=HEAPF64[(($92)>>3)];
 var $94=_sprintf(8872,3168,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$93,tempVarArgs)); STACKTOP=tempVarArgs;
 var $95=_strdup(8872);
 var $_sum55=((($83)+(3))|0);
 var $96=(($5+($_sum55<<2))|0);
 HEAP32[(($96)>>2)]=$95;
 var $97=HEAP32[((36648)>>2)];
 var $98=(($97+($k_464<<3))|0);
 var $99=HEAPF64[(($98)>>3)];
 var $100=_sprintf(8872,3120,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$99,tempVarArgs)); STACKTOP=tempVarArgs;
 var $101=_strdup(8872);
 var $_sum56=((($83)+(4))|0);
 var $102=(($5+($_sum56<<2))|0);
 HEAP32[(($102)>>2)]=$101;
 var $103=((($k_464)+(1))|0);
 var $k_5=$103;label=15;break;
 case 15: 
 var $k_5;
 var $105=((($i_165)+(1))|0);
 var $106=($105|0)<($2|0);
 if($106){var $k_464=$k_5;var $i_165=$105;label=12;break;}else{label=16;break;}
 case 16: 
 HEAP8[(8872)]=1;
 tempBigInt=0;HEAP8[(8873)]=tempBigInt&0xff;tempBigInt = tempBigInt>>8;HEAP8[(8874)]=tempBigInt&0xff;tempBigInt = tempBigInt>>8;HEAP8[(8875)]=tempBigInt&0xff;tempBigInt = tempBigInt>>8;HEAP8[(8876)]=tempBigInt&0xff;
 _print_table($5,$2,5,8872);
 var $107=($2|0)>0;
 if($107){var $i_262=0;label=17;break;}else{label=18;break;}
 case 17: 
 var $i_262;
 var $108=((($i_262)*(5))&-1);
 var $109=(($5+($108<<2))|0);
 var $110=HEAP32[(($109)>>2)];
 _free($110);
 var $_sum_1=((($108)+(1))|0);
 var $111=(($5+($_sum_1<<2))|0);
 var $112=HEAP32[(($111)>>2)];
 _free($112);
 var $_sum_2=((($108)+(2))|0);
 var $113=(($5+($_sum_2<<2))|0);
 var $114=HEAP32[(($113)>>2)];
 _free($114);
 var $_sum_3=((($108)+(3))|0);
 var $115=(($5+($_sum_3<<2))|0);
 var $116=HEAP32[(($115)>>2)];
 _free($116);
 var $_sum_4=((($108)+(4))|0);
 var $117=(($5+($_sum_4<<2))|0);
 var $118=HEAP32[(($117)>>2)];
 _free($118);
 var $119=((($i_262)+(1))|0);
 var $120=($119|0)<($2|0);
 if($120){var $i_262=$119;label=17;break;}else{label=18;break;}
 case 18: 
 _free($4);
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }
}
function _print_anova_table(){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+104)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $s=sp;
 var $0=_xmalloc(96);
 var $1=$0;
 var $2=_strdup(36072);
 HEAP32[(($1)>>2)]=$2;
 var $3=_strdup(3064);
 var $4=(($0+4)|0);
 var $5=$4;
 HEAP32[(($5)>>2)]=$3;
 var $6=_strdup(2952);
 var $7=(($0+8)|0);
 var $8=$7;
 HEAP32[(($8)>>2)]=$6;
 var $9=_strdup(2904);
 var $10=(($0+12)|0);
 var $11=$10;
 HEAP32[(($11)>>2)]=$9;
 var $12=_strdup(2856);
 var $13=(($0+16)|0);
 var $14=$13;
 HEAP32[(($14)>>2)]=$12;
 var $15=_strdup(2744);
 var $16=(($0+20)|0);
 var $17=$16;
 HEAP32[(($17)>>2)]=$15;
 var $18=_strdup(2696);
 var $19=(($0+24)|0);
 var $20=$19;
 HEAP32[(($20)>>2)]=$18;
 var $21=(($s)|0);
 var $22=HEAP32[((13584)>>2)];
 var $23=_sprintf($21,2608,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$22,tempVarArgs)); STACKTOP=tempVarArgs;
 var $24=_strdup($21);
 var $25=(($0+28)|0);
 var $26=$25;
 HEAP32[(($26)>>2)]=$24;
 var $27=HEAPF64[((40)>>3)];
 var $28=_sprintf($21,3272,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$27,tempVarArgs)); STACKTOP=tempVarArgs;
 var $29=_strdup($21);
 var $30=(($0+32)|0);
 var $31=$30;
 HEAP32[(($31)>>2)]=$29;
 var $32=HEAPF64[((200)>>3)];
 var $33=_sprintf($21,3272,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$32,tempVarArgs)); STACKTOP=tempVarArgs;
 var $34=_strdup($21);
 var $35=(($0+36)|0);
 var $36=$35;
 HEAP32[(($36)>>2)]=$34;
 var $37=HEAPF64[((568)>>3)];
 var $38=_sprintf($21,3168,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$37,tempVarArgs)); STACKTOP=tempVarArgs;
 var $39=_strdup($21);
 var $40=(($0+40)|0);
 var $41=$40;
 HEAP32[(($41)>>2)]=$39;
 var $42=HEAPF64[((104)>>3)];
 var $43=_sprintf($21,3120,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$42,tempVarArgs)); STACKTOP=tempVarArgs;
 var $44=_strdup($21);
 var $45=(($0+44)|0);
 var $46=$45;
 HEAP32[(($46)>>2)]=$44;
 var $47=_strdup(2560);
 var $48=(($0+48)|0);
 var $49=$48;
 HEAP32[(($49)>>2)]=$47;
 var $50=HEAP32[((13592)>>2)];
 var $51=_sprintf($21,2608,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$50,tempVarArgs)); STACKTOP=tempVarArgs;
 var $52=_strdup($21);
 var $53=(($0+52)|0);
 var $54=$53;
 HEAP32[(($54)>>2)]=$52;
 var $55=HEAPF64[((56)>>3)];
 var $56=_sprintf($21,3272,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$55,tempVarArgs)); STACKTOP=tempVarArgs;
 var $57=_strdup($21);
 var $58=(($0+56)|0);
 var $59=$58;
 HEAP32[(($59)>>2)]=$57;
 var $60=HEAPF64[((216)>>3)];
 var $61=_sprintf($21,3272,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$60,tempVarArgs)); STACKTOP=tempVarArgs;
 var $62=_strdup($21);
 var $63=(($0+60)|0);
 var $64=$63;
 HEAP32[(($64)>>2)]=$62;
 var $65=_strdup(36072);
 var $66=(($0+64)|0);
 var $67=$66;
 HEAP32[(($67)>>2)]=$65;
 var $68=_strdup(36072);
 var $69=(($0+68)|0);
 var $70=$69;
 HEAP32[(($70)>>2)]=$68;
 var $71=_strdup(2472);
 var $72=(($0+72)|0);
 var $73=$72;
 HEAP32[(($73)>>2)]=$71;
 var $74=HEAP32[((13576)>>2)];
 var $75=_sprintf($21,2608,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$74,tempVarArgs)); STACKTOP=tempVarArgs;
 var $76=_strdup($21);
 var $77=(($0+76)|0);
 var $78=$77;
 HEAP32[(($78)>>2)]=$76;
 var $79=HEAPF64[((32)>>3)];
 var $80=_sprintf($21,3272,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$79,tempVarArgs)); STACKTOP=tempVarArgs;
 var $81=_strdup($21);
 var $82=(($0+80)|0);
 var $83=$82;
 HEAP32[(($83)>>2)]=$81;
 var $84=_strdup(36072);
 var $85=(($0+84)|0);
 var $86=$85;
 HEAP32[(($86)>>2)]=$84;
 var $87=_strdup(36072);
 var $88=(($0+88)|0);
 var $89=$88;
 HEAP32[(($89)>>2)]=$87;
 var $90=_strdup(36072);
 var $91=(($0+92)|0);
 var $92=$91;
 HEAP32[(($92)>>2)]=$90;
 HEAP8[($21)]=1;
 var $93=(($s+1)|0);
 HEAP8[($93)]=0; HEAP8[((($93)+(1))|0)]=0; HEAP8[((($93)+(2))|0)]=0; HEAP8[((($93)+(3))|0)]=0; HEAP8[((($93)+(4))|0)]=0;
 _print_table($1,4,6,$21);
 var $94=HEAP32[(($1)>>2)];
 _free($94);
 var $95=(($0+4)|0);
 var $96=$95;
 var $97=HEAP32[(($96)>>2)];
 _free($97);
 var $98=(($0+8)|0);
 var $99=$98;
 var $100=HEAP32[(($99)>>2)];
 _free($100);
 var $101=(($0+12)|0);
 var $102=$101;
 var $103=HEAP32[(($102)>>2)];
 _free($103);
 var $104=(($0+16)|0);
 var $105=$104;
 var $106=HEAP32[(($105)>>2)];
 _free($106);
 var $107=(($0+20)|0);
 var $108=$107;
 var $109=HEAP32[(($108)>>2)];
 _free($109);
 var $110=(($0+24)|0);
 var $111=$110;
 var $112=HEAP32[(($111)>>2)];
 _free($112);
 var $113=(($0+28)|0);
 var $114=$113;
 var $115=HEAP32[(($114)>>2)];
 _free($115);
 var $116=(($0+32)|0);
 var $117=$116;
 var $118=HEAP32[(($117)>>2)];
 _free($118);
 var $119=(($0+36)|0);
 var $120=$119;
 var $121=HEAP32[(($120)>>2)];
 _free($121);
 var $122=(($0+40)|0);
 var $123=$122;
 var $124=HEAP32[(($123)>>2)];
 _free($124);
 var $125=(($0+44)|0);
 var $126=$125;
 var $127=HEAP32[(($126)>>2)];
 _free($127);
 var $128=(($0+48)|0);
 var $129=$128;
 var $130=HEAP32[(($129)>>2)];
 _free($130);
 var $131=(($0+52)|0);
 var $132=$131;
 var $133=HEAP32[(($132)>>2)];
 _free($133);
 var $134=(($0+56)|0);
 var $135=$134;
 var $136=HEAP32[(($135)>>2)];
 _free($136);
 var $137=(($0+60)|0);
 var $138=$137;
 var $139=HEAP32[(($138)>>2)];
 _free($139);
 var $140=(($0+64)|0);
 var $141=$140;
 var $142=HEAP32[(($141)>>2)];
 _free($142);
 var $143=(($0+68)|0);
 var $144=$143;
 var $145=HEAP32[(($144)>>2)];
 _free($145);
 var $146=(($0+72)|0);
 var $147=$146;
 var $148=HEAP32[(($147)>>2)];
 _free($148);
 var $149=(($0+76)|0);
 var $150=$149;
 var $151=HEAP32[(($150)>>2)];
 _free($151);
 var $152=(($0+80)|0);
 var $153=$152;
 var $154=HEAP32[(($153)>>2)];
 _free($154);
 var $155=(($0+84)|0);
 var $156=$155;
 var $157=HEAP32[(($156)>>2)];
 _free($157);
 var $158=(($0+88)|0);
 var $159=$158;
 var $160=HEAP32[(($159)>>2)];
 _free($160);
 var $161=(($0+92)|0);
 var $162=$161;
 var $163=HEAP32[(($162)>>2)];
 _free($163);
 _free($0);
 STACKTOP=sp;return;
}
function _print_diag_table(){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+152)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $a=sp;
 var $s=(sp)+(48);
 var $1=(($a)|0);
 HEAP32[(($1)>>2)]=2352;
 var $2=(($a+16)|0);
 HEAP32[(($2)>>2)]=2288;
 var $3=(($a+32)|0);
 HEAP32[(($3)>>2)]=2160;
 var $4=(($a+8)|0);
 HEAP32[(($4)>>2)]=2096;
 var $5=(($a+24)|0);
 HEAP32[(($5)>>2)]=1984;
 var $6=(($a+40)|0);
 HEAP32[(($6)>>2)]=36072;
 var $7=(($s)|0);
 var $8=HEAPF64[((88)>>3)];
 var $9=_sprintf($7,3272,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$8,tempVarArgs)); STACKTOP=tempVarArgs;
 var $10=_strdup($7);
 var $11=(($a+4)|0);
 HEAP32[(($11)>>2)]=$10;
 var $12=HEAPF64[((8)>>3)];
 var $13=_sprintf($7,3272,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$12,tempVarArgs)); STACKTOP=tempVarArgs;
 var $14=_strdup($7);
 var $15=(($a+20)|0);
 HEAP32[(($15)>>2)]=$14;
 var $16=HEAPF64[((672)>>3)];
 var $17=_sprintf($7,3272,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$16,tempVarArgs)); STACKTOP=tempVarArgs;
 var $18=_strdup($7);
 var $19=(($a+36)|0);
 HEAP32[(($19)>>2)]=$18;
 var $20=HEAPF64[((72)>>3)];
 var $21=_sprintf($7,3120,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$20,tempVarArgs)); STACKTOP=tempVarArgs;
 var $22=_strdup($7);
 var $23=(($a+12)|0);
 HEAP32[(($23)>>2)]=$22;
 var $24=HEAPF64[((704)>>3)];
 var $25=_sprintf($7,3120,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAPF64[((tempVarArgs)>>3)]=$24,tempVarArgs)); STACKTOP=tempVarArgs;
 var $26=_strdup($7);
 var $27=(($a+28)|0);
 HEAP32[(($27)>>2)]=$26;
 var $28=(($a+44)|0);
 HEAP32[(($28)>>2)]=36072;
 HEAP8[($7)]=1;
 var $29=(($s+1)|0);
 HEAP8[($29)]=0;
 var $30=(($s+2)|0);
 HEAP8[($30)]=1;
 var $31=(($s+3)|0);
 HEAP8[($31)]=0;
 _print_table($1,3,4,$7);
 var $32=HEAP32[(($11)>>2)];
 _free($32);
 var $33=HEAP32[(($15)>>2)];
 _free($33);
 var $34=HEAP32[(($19)>>2)];
 _free($34);
 var $35=HEAP32[(($23)>>2)];
 _free($35);
 var $36=HEAP32[(($27)>>2)];
 _free($36);
 STACKTOP=sp;return;
}
function _run($s){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=($s|0)==0;
 if($1){label=5;break;}else{label=2;break;}
 case 2: 
 _run1($s);
 var $3=HEAP32[((11040)>>2)];
 var $4=($3|0)==0;
 if($4){label=4;break;}else{label=3;break;}
 case 3: 
 var $6=_fclose($3);
 HEAP32[((11040)>>2)]=0;
 label=4;break;
 case 4: 
 _free_datasets();
 label=5;break;
 case 5: 
 return 0;
  default: assert(0, "bad label: " + label);
 }
}
Module["_run"] = _run;
function _run1($s){
 var label=0;
 label = 1; 
 var mySetjmpIds = {};
 var setjmpTable = {"1": function(value) { label = 17; $1 = value },dummy: 0};
 while(1)try { switch(label){
 case 1: 
 var $1=(tempInt = setjmpId++, mySetjmpIds[tempInt] = 1, setjmpLabels[tempInt] = label,HEAP32[((10472)>>2)]=tempInt, 0);
 label=17;break;
 case 17: 
 var $2=($1|0)==0;
 if($2){label=2;break;}else{label=16;break;}
 case 2: 
 HEAP32[((8976)>>2)]=$s;
 HEAP32[((11032)>>2)]=$s;
 _scan();
 label=3;break;
 case 3: 
 _keyword();
 var $4=HEAP32[((6944)>>2)];
 switch(($4|0)){case 42:{ label=10;break;}case 337:{ label=11;break;}case 338:{ label=12;break;}case 339:{ label=13;break;}case 340:{ label=14;break;}case 0:{ label=16;break;}case 309:{ label=4;break;}case 327:{ label=5;break;}case 330:{ label=6;break;}case 59:{ label=9;break;}default:{label=15;break;}}break;
 case 4: 
 _data_step();
 label=3;break;
 case 5: 
 _proc_step();
 label=3;break;
 case 6: 
 _scan();
 var $8=HEAP32[((6944)>>2)];
 var $9=($8|0)==59;
 if($9){label=8;break;}else{label=7;break;}
 case 7: 
 _stop(3968);
 throw "Reached an unreachable!";
 case 8: 
 _scan();
 label=3;break;
 case 9: 
 _scan();
 label=3;break;
 case 10: 
 _comment_stmt();
 label=3;break;
 case 11: 
 _title_stmt();
 label=3;break;
 case 12: 
 _title1_stmt();
 label=3;break;
 case 13: 
 _title2_stmt();
 label=3;break;
 case 14: 
 _title3_stmt();
 label=3;break;
 case 15: 
 _stop(3184);
 throw "Reached an unreachable!";
 case 16: 
 return;
  default: assert(0, "bad label: " + label);
 }
 } catch(e) { if (!e.longjmp || !(e.id in mySetjmpIds)) throw(e); setjmpTable[setjmpLabels[e.id]](e.value) }
}
function _parse_default(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP32[((6944)>>2)];
 switch(($1|0)){case 59:{ label=2;break;}case 42:{ label=3;break;}case 337:{ label=4;break;}case 338:{ label=5;break;}case 339:{ label=6;break;}case 340:{ label=7;break;}default:{label=8;break;}}break;
 case 2: 
 _scan();
 label=9;break;
 case 3: 
 _comment_stmt();
 label=9;break;
 case 4: 
 _title_stmt();
 label=9;break;
 case 5: 
 _title1_stmt();
 label=9;break;
 case 6: 
 _title2_stmt();
 label=9;break;
 case 7: 
 _title3_stmt();
 label=9;break;
 case 8: 
 _stop(3184);
 throw "Reached an unreachable!";
 case 9: 
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _stop($s){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP32[((8976)>>2)];
 var $2=HEAP8[($1)];
 var $3=(($2<<24)>>24)==0;
 var $4=HEAP32[((11032)>>2)];
 var $5=($1|0)==($4|0);
 var $or_cond_i3=$3|$5;
 if($or_cond_i3){label=10;break;}else{var $s_0_i4=$1;var $7=$2;var $6=$4;label=2;break;}
 case 2: 
 var $6;
 var $7;
 var $s_0_i4;
 if((($7<<24)>>24)==13|(($7<<24)>>24)==10){ label=3;break;}else{var $s_121_i=$s_0_i4;var $14=$7;label=5;break;}
 case 3: 
 var $9=(($s_0_i4+1)|0);
 var $_pre=HEAP8[($9)];
 var $s_0_i_be=$9;var $11=$_pre;var $10=$6;label=4;break;
 case 4: 
 var $10;
 var $11;
 var $s_0_i_be;
 var $12=(($11<<24)>>24)==0;
 var $13=($s_0_i_be|0)==($10|0);
 var $or_cond_i=$12|$13;
 if($or_cond_i){label=10;break;}else{var $s_0_i4=$s_0_i_be;var $7=$11;var $6=$10;label=2;break;}
 case 5: 
 var $14;
 var $s_121_i;
 if((($14<<24)>>24)==10|(($14<<24)>>24)==0|(($14<<24)>>24)==13){ var $s_1_lcssa_i=$s_121_i;var $18=$14;label=9;break;}else{label=6;break;}
 case 6: 
 var $16=(($s_121_i+1)|0);
 var $17=($16|0)==($6|0);
 if($17){label=8;break;}else{label=7;break;}
 case 7: 
 var $_pre23_i=HEAP8[($16)];
 var $s_121_i=$16;var $14=$_pre23_i;label=5;break;
 case 8: 
 var $_pre_i=HEAP8[($6)];
 var $s_1_lcssa_i=$6;var $18=$_pre_i;label=9;break;
 case 9: 
 var $18;
 var $s_1_lcssa_i;
 HEAP8[($s_1_lcssa_i)]=0;
 _emit_line($s_0_i4);
 HEAP8[($s_1_lcssa_i)]=$18;
 var $_pre7=HEAP32[((11032)>>2)];
 var $s_0_i_be=$s_1_lcssa_i;var $11=$18;var $10=$_pre7;label=4;break;
 case 10: 
 _emit_line($s);
 _longjmp(10472,1);
 throw "Reached an unreachable!";
  default: assert(0, "bad label: " + label);
 }
}
function _parse_alpha_option(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 _scan();
 var $1=HEAP32[((6944)>>2)];
 var $2=($1|0)==61;
 if($2){label=3;break;}else{label=2;break;}
 case 2: 
 _expected(3896);
 throw "Reached an unreachable!";
 case 3: 
 _scan();
 var $5=HEAP32[((6944)>>2)];
 var $6=($5|0)==1002;
 if($6){label=5;break;}else{label=4;break;}
 case 4: 
 _expected(3040);
 throw "Reached an unreachable!";
 case 5: 
 var $9=_atof(6984);
 HEAPF64[((696)>>3)]=$9;
 var $10=$9<0;
 var $11=$9>1;
 var $or_cond=$10|$11;
 if($or_cond){label=6;break;}else{label=7;break;}
 case 6: 
 _expected(2200);
 throw "Reached an unreachable!";
 case 7: 
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _expected($s){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP32[((6944)>>2)];
 if(($1|0)==0){ label=2;break;}else if(($1|0)==59){ label=3;break;}else{label=4;break;}
 case 2: 
 var $3=_sprintf(12576,888,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$s,tempVarArgs)); STACKTOP=tempVarArgs;
 label=5;break;
 case 3: 
 var $5=_sprintf(12576,728,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$s,tempVarArgs)); STACKTOP=tempVarArgs;
 label=5;break;
 case 4: 
 var $7=_sprintf(12576,4064,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 16)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$s,HEAP32[(((tempVarArgs)+(8))>>2)]=6984,tempVarArgs)); STACKTOP=tempVarArgs;
 label=5;break;
 case 5: 
 _stop(12576);
 throw "Reached an unreachable!";
  default: assert(0, "bad label: " + label);
 }
}
function _parse_data_option(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 _scan();
 var $1=HEAP32[((6944)>>2)];
 var $2=($1|0)==61;
 if($2){label=3;break;}else{label=2;break;}
 case 2: 
 _stop(1544);
 throw "Reached an unreachable!";
 case 3: 
 _scan();
 var $5=HEAP32[((6944)>>2)];
 var $6=($5|0)==1001;
 if($6){label=5;break;}else{label=4;break;}
 case 4: 
 _stop(1216);
 throw "Reached an unreachable!";
 case 5: 
 _select_dataset(6984);
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _parse_maxdec_option(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 _scan();
 var $1=HEAP32[((6944)>>2)];
 var $2=($1|0)==61;
 if($2){label=3;break;}else{label=2;break;}
 case 2: 
 _stop(1544);
 throw "Reached an unreachable!";
 case 3: 
 _scan();
 var $5=HEAP32[((6944)>>2)];
 var $6=($5|0)==1002;
 if($6){label=5;break;}else{label=4;break;}
 case 4: 
 _stop(1080);
 throw "Reached an unreachable!";
 case 5: 
 var $9=HEAPF64[((24)>>3)];
 var $10=(($9)&-1);
 var $11=($10|0)<0;
 var $_=($11?0:$10);
 var $12=($_|0)>8;
 var $storemerge1=($12?8:$_);
 HEAP32[((9960)>>2)]=$storemerge1;
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _xmalloc($size){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=_malloc($size);
 var $2=($1|0)==0;
 if($2){label=2;break;}else{label=3;break;}
 case 2: 
 _stop(1000);
 throw "Reached an unreachable!";
 case 3: 
 return $1;
  default: assert(0, "bad label: " + label);
 }
}
function _xrealloc($p,$size){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=_realloc($p,$size);
 var $2=($1|0)==0;
 if($2){label=2;break;}else{label=3;break;}
 case 2: 
 _stop(1000);
 throw "Reached an unreachable!";
 case 3: 
 return $1;
  default: assert(0, "bad label: " + label);
 }
}
function _scan(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP32[((11032)>>2)];
 var $2=HEAP32[((8976)>>2)];
 var $3=($1|0)==($2|0);
 var $4=HEAP32[((6944)>>2)];
 var $storemerge=($3?0:$4);
 HEAP32[((8736)>>2)]=$storemerge;
 var $5=_scan1();
 HEAP32[((6944)>>2)]=$5;
 var $6=($5|0)==0;
 if($6){label=2;break;}else{label=4;break;}
 case 2: 
 var $7=HEAP32[((8736)>>2)];
 if(($7|0)==59|($7|0)==0){ label=4;break;}else{label=3;break;}
 case 3: 
 HEAP8[(6984)]=59;
 HEAP8[(6985)]=0;
 HEAP32[((6944)>>2)]=59;
 label=4;break;
 case 4: 
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _scan1(){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $_pre=HEAP32[((11032)>>2)];
 var $2=$_pre;label=2;break;
 case 2: 
 var $2;
 var $3=HEAP8[($2)];
 if((($3<<24)>>24)==32|(($3<<24)>>24)==9){ label=3;break;}else{label=4;break;}
 case 3: 
 var $5=(($2+1)|0);
 HEAP32[((11032)>>2)]=$5;
 var $2=$5;label=2;break;
 case 4: 
 HEAP32[((6936)>>2)]=$2;
 var $7=HEAP8[($2)];
 if((($7<<24)>>24)==10|(($7<<24)>>24)==13){ label=5;break;}else if((($7<<24)>>24)==0){ label=6;break;}else{label=9;break;}
 case 5: 
 var $8=(($7<<24)>>24);
 var $9=_isspace($8);
 var $10=($9|0)==0;
 if($10){label=8;break;}else{label=7;break;}
 case 6: 
 HEAP8[(6984)]=0;
 var $_0=0;label=73;break;
 case 7: 
 var $12=HEAP32[((11032)>>2)];
 var $13=(($12+1)|0);
 HEAP32[((11032)>>2)]=$13;
 var $14=HEAP8[($13)];
 var $15=(($14<<24)>>24);
 var $16=_isspace($15);
 var $17=($16|0)==0;
 if($17){label=8;break;}else{label=7;break;}
 case 8: 
 HEAP8[(6984)]=59;
 HEAP8[(6985)]=0;
 var $_0=59;label=73;break;
 case 9: 
 var $19=(($7<<24)>>24);
 var $20=_isalpha($19);
 var $21=($20|0)==0;
 if($21){label=10;break;}else{var $i_035=0;label=11;break;}
 case 10: 
 var $23=HEAP32[((11032)>>2)];
 var $24=HEAP8[($23)];
 var $25=(($24<<24)>>24)==95;
 if($25){var $i_035=0;label=11;break;}else{label=17;break;}
 case 11: 
 var $i_035;
 var $26=HEAP32[((11032)>>2)];
 var $27=HEAP8[($26)];
 var $28=(($27<<24)>>24);
 var $29=_isalnum($28);
 var $30=($29|0)==0;
 var $31=HEAP32[((11032)>>2)];
 if($30){label=12;break;}else{label=13;break;}
 case 12: 
 var $33=HEAP8[($31)];
 var $34=(($33<<24)>>24)==95;
 if($34){label=13;break;}else{var $i_0_lcssa=$i_035;label=14;break;}
 case 13: 
 var $35=(($31+1)|0);
 HEAP32[((11032)>>2)]=$35;
 var $36=HEAP8[($31)];
 var $37=(($36<<24)>>24);
 var $38=_toupper($37);
 var $39=(($38)&255);
 var $40=((6984+$i_035)|0);
 HEAP8[($40)]=$39;
 var $41=((($i_035)+(1))|0);
 var $42=($41>>>0)<100;
 if($42){var $i_035=$41;label=11;break;}else{var $i_0_lcssa=$41;label=14;break;}
 case 14: 
 var $i_0_lcssa;
 var $44=($i_0_lcssa|0)==100;
 if($44){label=15;break;}else{label=16;break;}
 case 15: 
 _stop(2976);
 label=16;break;
 case 16: 
 var $47=((6984+$i_0_lcssa)|0);
 HEAP8[($47)]=0;
 var $_0=1001;label=73;break;
 case 17: 
 var $49=(($24<<24)>>24);
 var $isdigittmp=((($49)-(48))|0);
 var $isdigit=($isdigittmp>>>0)<10;
 if($isdigit){label=23;break;}else{label=18;break;}
 case 18: 
 switch((($24<<24)>>24)){case 46:{ label=19;break;}case 43:case 45:{ label=20;break;}case 39:{ label=43;break;}case 34:{ label=55;break;}case 64:{ label=67;break;}case 42:{ label=70;break;}default:{label=69;break;}}break;
 case 19: 
 var $52=(($23+1)|0);
 var $53=HEAP8[($52)];
 var $54=(($53<<24)>>24);
 var $isdigittmp23=((($54)-(48))|0);
 var $isdigit24=($isdigittmp23>>>0)<10;
 if($isdigit24){var $67=$23;var $66=46;label=25;break;}else{label=69;break;}
 case 20: 
 var $55=(($23+1)|0);
 var $56=HEAP8[($55)];
 var $57=(($56<<24)>>24);
 var $isdigittmp25=((($57)-(48))|0);
 var $isdigit26=($isdigittmp25>>>0)<10;
 if($isdigit26){label=23;break;}else{label=21;break;}
 case 21: 
 var $59=(($56<<24)>>24)==46;
 if($59){label=22;break;}else{label=42;break;}
 case 22: 
 var $61=(($23+2)|0);
 var $62=HEAP8[($61)];
 var $63=(($62<<24)>>24);
 var $isdigittmp27=((($63)-(48))|0);
 var $isdigit28=($isdigittmp27>>>0)<10;
 if($isdigit28){label=23;break;}else{label=42;break;}
 case 23: 
 if((($24<<24)>>24)==43|(($24<<24)>>24)==45){ label=24;break;}else{var $67=$23;var $66=$24;label=25;break;}
 case 24: 
 var $65=(($23+1)|0);
 HEAP32[((11032)>>2)]=$65;
 var $_pre65=HEAP8[($65)];
 var $67=$65;var $66=$_pre65;label=25;break;
 case 25: 
 var $66;
 var $67;
 var $68=(($66<<24)>>24);
 var $isdigittmp2949=((($68)-(48))|0);
 var $isdigit3050=($isdigittmp2949>>>0)<10;
 if($isdigit3050){var $69=$67;label=26;break;}else{var $74=$66;var $73=$67;label=27;break;}
 case 26: 
 var $69;
 var $70=(($69+1)|0);
 HEAP32[((11032)>>2)]=$70;
 var $71=HEAP8[($70)];
 var $72=(($71<<24)>>24);
 var $isdigittmp29=((($72)-(48))|0);
 var $isdigit30=($isdigittmp29>>>0)<10;
 if($isdigit30){var $69=$70;label=26;break;}else{var $74=$71;var $73=$70;label=27;break;}
 case 27: 
 var $73;
 var $74;
 var $75=(($74<<24)>>24)==46;
 if($75){label=28;break;}else{var $82=$73;var $81=$74;label=30;break;}
 case 28: 
 var $storemerge44=(($73+1)|0);
 HEAP32[((11032)>>2)]=$storemerge44;
 var $76=HEAP8[($storemerge44)];
 var $77=(($76<<24)>>24);
 var $isdigittmp3145=((($77)-(48))|0);
 var $isdigit3246=($isdigittmp3145>>>0)<10;
 if($isdigit3246){var $78=$storemerge44;label=29;break;}else{var $82=$storemerge44;var $81=$76;label=30;break;}
 case 29: 
 var $78;
 var $storemerge=(($78+1)|0);
 HEAP32[((11032)>>2)]=$storemerge;
 var $79=HEAP8[($storemerge)];
 var $80=(($79<<24)>>24);
 var $isdigittmp31=((($80)-(48))|0);
 var $isdigit32=($isdigittmp31>>>0)<10;
 if($isdigit32){var $78=$storemerge;label=29;break;}else{var $82=$storemerge;var $81=$79;label=30;break;}
 case 30: 
 var $81;
 var $82;
 if((($81<<24)>>24)==69|(($81<<24)>>24)==101){ label=31;break;}else{var $95=$82;label=35;break;}
 case 31: 
 var $84=(($82+1)|0);
 HEAP32[((11032)>>2)]=$84;
 var $85=HEAP8[($84)];
 if((($85<<24)>>24)==43|(($85<<24)>>24)==45){ label=32;break;}else{var $89=$84;var $88=$85;label=33;break;}
 case 32: 
 var $87=(($82+2)|0);
 HEAP32[((11032)>>2)]=$87;
 var $_pre67=HEAP8[($87)];
 var $89=$87;var $88=$_pre67;label=33;break;
 case 33: 
 var $88;
 var $89;
 var $90=(($88<<24)>>24);
 var $isdigittmp3339=((($90)-(48))|0);
 var $isdigit3440=($isdigittmp3339>>>0)<10;
 if($isdigit3440){var $91=$89;label=34;break;}else{var $95=$89;label=35;break;}
 case 34: 
 var $91;
 var $92=(($91+1)|0);
 HEAP32[((11032)>>2)]=$92;
 var $93=HEAP8[($92)];
 var $94=(($93<<24)>>24);
 var $isdigittmp33=((($94)-(48))|0);
 var $isdigit34=($isdigittmp33>>>0)<10;
 if($isdigit34){var $91=$92;label=34;break;}else{var $95=$92;label=35;break;}
 case 35: 
 var $95;
 var $96=HEAP32[((6936)>>2)];
 var $97=$95;
 var $98=$96;
 var $99=((($97)-($98))|0);
 var $100=($99>>>0)>99;
 if($100){label=36;break;}else{label=37;break;}
 case 36: 
 _stop(3848);
 label=37;break;
 case 37: 
 var $102=($99|0)>0;
 if($102){label=38;break;}else{var $i_1_lcssa=0;label=40;break;}
 case 38: 
 var $_pre66=HEAP32[((6936)>>2)];
 var $i_137=0;label=39;break;
 case 39: 
 var $i_137;
 var $104=(($_pre66+$i_137)|0);
 var $105=HEAP8[($104)];
 var $106=((6984+$i_137)|0);
 HEAP8[($106)]=$105;
 var $107=((($i_137)+(1))|0);
 var $108=($107|0)<($99|0);
 if($108){var $i_137=$107;label=39;break;}else{var $i_1_lcssa=$99;label=40;break;}
 case 40: 
 var $i_1_lcssa;
 var $109=((6984+$i_1_lcssa)|0);
 HEAP8[($109)]=0;
 var $110=_sscanf(6984,2944,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=24,tempVarArgs)); STACKTOP=tempVarArgs;
 var $111=($110|0)<1;
 if($111){label=41;break;}else{var $_0=1002;label=73;break;}
 case 41: 
 _stop(3848);
 var $_0=1002;label=73;break;
 case 42: 
 if((($24<<24)>>24)==39){ label=43;break;}else if((($24<<24)>>24)==34){ label=55;break;}else if((($24<<24)>>24)==64){ label=67;break;}else if((($24<<24)>>24)==42){ label=70;break;}else{label=69;break;}
 case 43: 
 var $114=(($23+1)|0);
 HEAP32[((11032)>>2)]=$114;
 var $i_254=0;var $116=$114;label=44;break;
 case 44: 
 var $116;
 var $i_254;
 var $117=HEAP8[($116)];
 if((($117<<24)>>24)==13|(($117<<24)>>24)==10){ label=45;break;}else if((($117<<24)>>24)==0){ var $i_2_lcssa=$i_254;label=52;break;}else{var $121=$116;var $120=$117;label=46;break;}
 case 45: 
 _stop(2144);
 var $_pre68=HEAP32[((11032)>>2)];
 var $_pre69=HEAP8[($_pre68)];
 var $121=$_pre68;var $120=$_pre69;label=46;break;
 case 46: 
 var $120;
 var $121;
 var $122=(($120<<24)>>24)==39;
 var $123=(($121+1)|0);
 if($122){label=47;break;}else{label=50;break;}
 case 47: 
 var $125=HEAP8[($123)];
 var $126=(($125<<24)>>24)==39;
 if($126){label=49;break;}else{label=48;break;}
 case 48: 
 HEAP32[((11032)>>2)]=$123;
 var $i_2_lcssa=$i_254;label=52;break;
 case 49: 
 var $128=((6984+$i_254)|0);
 HEAP8[($128)]=39;
 var $129=(($121+2)|0);
 HEAP32[((11032)>>2)]=$129;
 var $134=$129;label=51;break;
 case 50: 
 HEAP32[((11032)>>2)]=$123;
 var $131=HEAP8[($121)];
 var $132=((6984+$i_254)|0);
 HEAP8[($132)]=$131;
 var $134=$123;label=51;break;
 case 51: 
 var $134;
 var $135=((($i_254)+(1))|0);
 var $136=($135>>>0)<100;
 if($136){var $i_254=$135;var $116=$134;label=44;break;}else{var $i_2_lcssa=$135;label=52;break;}
 case 52: 
 var $i_2_lcssa;
 var $138=($i_2_lcssa|0)==100;
 if($138){label=53;break;}else{label=54;break;}
 case 53: 
 _stop(1512);
 label=54;break;
 case 54: 
 var $141=((6984+$i_2_lcssa)|0);
 HEAP8[($141)]=0;
 var $_0=1003;label=73;break;
 case 55: 
 var $143=(($23+1)|0);
 HEAP32[((11032)>>2)]=$143;
 var $i_356=0;var $145=$143;label=56;break;
 case 56: 
 var $145;
 var $i_356;
 var $146=HEAP8[($145)];
 if((($146<<24)>>24)==13|(($146<<24)>>24)==10){ label=57;break;}else if((($146<<24)>>24)==0){ var $i_3_lcssa=$i_356;label=64;break;}else{var $150=$145;var $149=$146;label=58;break;}
 case 57: 
 _stop(2144);
 var $_pre70=HEAP32[((11032)>>2)];
 var $_pre71=HEAP8[($_pre70)];
 var $150=$_pre70;var $149=$_pre71;label=58;break;
 case 58: 
 var $149;
 var $150;
 var $151=(($149<<24)>>24)==34;
 var $152=(($150+1)|0);
 if($151){label=59;break;}else{label=62;break;}
 case 59: 
 var $154=HEAP8[($152)];
 var $155=(($154<<24)>>24)==34;
 if($155){label=61;break;}else{label=60;break;}
 case 60: 
 HEAP32[((11032)>>2)]=$152;
 var $i_3_lcssa=$i_356;label=64;break;
 case 61: 
 var $157=((6984+$i_356)|0);
 HEAP8[($157)]=34;
 var $158=(($150+2)|0);
 HEAP32[((11032)>>2)]=$158;
 var $163=$158;label=63;break;
 case 62: 
 HEAP32[((11032)>>2)]=$152;
 var $160=HEAP8[($150)];
 var $161=((6984+$i_356)|0);
 HEAP8[($161)]=$160;
 var $163=$152;label=63;break;
 case 63: 
 var $163;
 var $164=((($i_356)+(1))|0);
 var $165=($164>>>0)<100;
 if($165){var $i_356=$164;var $145=$163;label=56;break;}else{var $i_3_lcssa=$164;label=64;break;}
 case 64: 
 var $i_3_lcssa;
 var $167=($i_3_lcssa|0)==100;
 if($167){label=65;break;}else{label=66;break;}
 case 65: 
 _stop(1512);
 label=66;break;
 case 66: 
 var $170=((6984+$i_3_lcssa)|0);
 HEAP8[($170)]=0;
 var $_0=1003;label=73;break;
 case 67: 
 var $172=(($23+1)|0);
 var $173=HEAP8[($172)];
 var $174=(($173<<24)>>24)==64;
 if($174){label=68;break;}else{label=69;break;}
 case 68: 
 assert(3 % 1 === 0);HEAP8[(6984)]=HEAP8[(1200)];HEAP8[(6985)]=HEAP8[(1201)];HEAP8[(6986)]=HEAP8[(1202)];
 var $176=(($23+2)|0);
 HEAP32[((11032)>>2)]=$176;
 var $_0=1004;label=73;break;
 case 69: 
 var $_pre84=(($23+1)|0);
 var $_pre_phi=$_pre84;label=72;break;
 case 70: 
 var $178=(($23+1)|0);
 var $179=HEAP8[($178)];
 var $180=(($179<<24)>>24)==42;
 if($180){label=71;break;}else{var $_pre_phi=$178;label=72;break;}
 case 71: 
 assert(3 % 1 === 0);HEAP8[(6984)]=HEAP8[(1072)];HEAP8[(6985)]=HEAP8[(1073)];HEAP8[(6986)]=HEAP8[(1074)];
 var $182=(($23+2)|0);
 HEAP32[((11032)>>2)]=$182;
 var $_0=1005;label=73;break;
 case 72: 
 var $_pre_phi;
 HEAP8[(6984)]=$24;
 HEAP8[(6985)]=0;
 HEAP32[((11032)>>2)]=$_pre_phi;
 var $184=HEAP8[($23)];
 var $185=(($184<<24)>>24);
 var $_0=$185;label=73;break;
 case 73: 
 var $_0;
 STACKTOP=sp;return $_0;
  default: assert(0, "bad label: " + label);
 }
}
function _keyword(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP32[((6944)>>2)];
 var $2=($1|0)==1001;
 if($2){var $i_0=0;label=2;break;}else{label=5;break;}
 case 2: 
 var $i_0;
 var $3=($i_0|0)<42;
 if($3){label=3;break;}else{label=5;break;}
 case 3: 
 var $5=((232+($i_0<<3))|0);
 var $6=HEAP32[(($5)>>2)];
 var $7=_strcmp(6984,$6);
 var $8=($7|0)==0;
 var $9=((($i_0)+(1))|0);
 if($8){label=4;break;}else{var $i_0=$9;label=2;break;}
 case 4: 
 var $11=((232+($i_0<<3)+4)|0);
 var $12=HEAP32[(($11)>>2)];
 HEAP32[((6944)>>2)]=$12;
 label=5;break;
 case 5: 
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _get_dataline($buf,$len){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $_pre=HEAP32[((11032)>>2)];
 var $2=$_pre;label=2;break;
 case 2: 
 var $2;
 var $3=HEAP8[($2)];
 if((($3<<24)>>24)==0|(($3<<24)>>24)==59){ var $_0=0;label=16;break;}else if((($3<<24)>>24)==10){ label=4;break;}else if((($3<<24)>>24)==13){ label=5;break;}else{label=3;break;}
 case 3: 
 var $5=(($2+1)|0);
 HEAP32[((11032)>>2)]=$5;
 var $2=$5;label=2;break;
 case 4: 
 var $_pre21=(($2+1)|0);
 var $storemerge=$_pre21;label=6;break;
 case 5: 
 var $7=(($2+1)|0);
 var $8=HEAP8[($7)];
 var $9=(($8<<24)>>24)==10;
 var $10=(($2+2)|0);
 var $_=($9?$10:$7);
 var $storemerge=$_;label=6;break;
 case 6: 
 var $storemerge;
 HEAP32[((11032)>>2)]=$storemerge;
 var $11=HEAP8[($storemerge)];
 var $12=(($11<<24)>>24);
 var $13=_isspace($12);
 var $14=($13|0)==0;
 var $15=HEAP32[((11032)>>2)];
 if($14){var $25=$15;label=9;break;}else{var $16=$15;label=7;break;}
 case 7: 
 var $16;
 var $17=HEAP8[($16)];
 if((($17<<24)>>24)==13|(($17<<24)>>24)==10){ var $25=$16;label=9;break;}else{label=8;break;}
 case 8: 
 var $19=(($16+1)|0);
 HEAP32[((11032)>>2)]=$19;
 var $20=HEAP8[($19)];
 var $21=(($20<<24)>>24);
 var $22=_isspace($21);
 var $23=($22|0)==0;
 var $24=HEAP32[((11032)>>2)];
 if($23){var $25=$24;label=9;break;}else{var $16=$24;label=7;break;}
 case 9: 
 var $25;
 var $26=HEAP8[($25)];
 if((($26<<24)>>24)==0|(($26<<24)>>24)==59|(($26<<24)>>24)==10|(($26<<24)>>24)==13){ var $_0=0;label=16;break;}else{label=10;break;}
 case 10: 
 var $27=((($len)-(1))|0);
 var $28=($27|0)>0;
 if($28){var $i_010=0;var $29=$25;label=11;break;}else{var $i_0_lcssa=0;label=13;break;}
 case 11: 
 var $29;
 var $i_010;
 var $30=(($29+1)|0);
 HEAP32[((11032)>>2)]=$30;
 var $31=HEAP8[($29)];
 var $32=(($buf+$i_010)|0);
 HEAP8[($32)]=$31;
 var $33=HEAP32[((11032)>>2)];
 var $34=HEAP8[($33)];
 if((($34<<24)>>24)==0|(($34<<24)>>24)==59|(($34<<24)>>24)==10|(($34<<24)>>24)==13){ var $i_0_lcssa=$i_010;label=13;break;}else{label=12;break;}
 case 12: 
 var $36=((($i_010)+(1))|0);
 var $37=($36|0)<($27|0);
 if($37){var $i_010=$36;var $29=$33;label=11;break;}else{var $i_0_lcssa=$36;label=13;break;}
 case 13: 
 var $i_0_lcssa;
 var $38=($i_0_lcssa|0)==($27|0);
 if($38){label=14;break;}else{label=15;break;}
 case 14: 
 _stop(1296);
 label=15;break;
 case 15: 
 var $41=((($i_0_lcssa)+(1))|0);
 var $42=(($buf+$41)|0);
 HEAP8[($42)]=0;
 var $_0=$buf;label=16;break;
 case 16: 
 var $_0;
 return $_0;
  default: assert(0, "bad label: " + label);
 }
}
function _get_next_token(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=HEAP32[((11032)>>2)];
 var $2=HEAP32[((8976)>>2)];
 var $3=($1|0)==($2|0);
 var $4=HEAP32[((6944)>>2)];
 var $storemerge_i=($3?0:$4);
 HEAP32[((8736)>>2)]=$storemerge_i;
 var $5=_scan1();
 HEAP32[((6944)>>2)]=$5;
 if(($5|0)==0){ label=2;break;}else if(($5|0)==1001){ var $i_0_i=0;label=4;break;}else{label=7;break;}
 case 2: 
 var $6=HEAP32[((8736)>>2)];
 if(($6|0)==59|($6|0)==0){ label=7;break;}else{label=3;break;}
 case 3: 
 HEAP8[(6984)]=59;
 HEAP8[(6985)]=0;
 HEAP32[((6944)>>2)]=59;
 label=7;break;
 case 4: 
 var $i_0_i;
 var $7=($i_0_i|0)<42;
 if($7){label=5;break;}else{label=7;break;}
 case 5: 
 var $9=((232+($i_0_i<<3))|0);
 var $10=HEAP32[(($9)>>2)];
 var $11=_strcmp(6984,$10);
 var $12=($11|0)==0;
 var $13=((($i_0_i)+(1))|0);
 if($12){label=6;break;}else{var $i_0_i=$13;label=4;break;}
 case 6: 
 var $15=((232+($i_0_i<<3)+4)|0);
 var $16=HEAP32[(($15)>>2)];
 HEAP32[((6944)>>2)]=$16;
 label=7;break;
 case 7: 
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _tdist($X,$df){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=$df>0;
 if($1){label=2;break;}else{var $_0=-1;label=9;break;}
 case 2: 
 var $3=($df)*((0.5));
 var $4=($3)+((0.5));
 var $5=($X)*($X);
 var $6=($5)+($df);
 var $7=($df)/($6);
 var $8=((76.18009173))/($4);
 var $9=($8)+(1);
 var $10=($4)+(1);
 var $11=((86.50532033))/($10);
 var $12=($9)-($11);
 var $13=($4)+(2);
 var $14=((24.01409822))/($13);
 var $15=($12)+($14);
 var $16=($4)+(3);
 var $17=((1.231739516))/($16);
 var $18=($15)-($17);
 var $19=($4)+(4);
 var $20=((0.00120858003))/($19);
 var $21=($18)+($20);
 var $22=($4)+(5);
 var $23=((0.00000536382))/($22);
 var $24=($21)-($23);
 var $25=($4)+((-0.5));
 var $26=($4)+((4.5));
 var $27=Math_log($26);
 var $28=($25)*($27);
 var $29=($28)-($26);
 var $30=($24)*((2.50662827465));
 var $31=Math_log($30);
 var $32=($31)+($29);
 var $33=($32)+((-0.5723649429133815));
 var $34=((76.18009173))/($3);
 var $35=($34)+(1);
 var $36=($3)+(1);
 var $37=((86.50532033))/($36);
 var $38=($35)-($37);
 var $39=($3)+(2);
 var $40=((24.01409822))/($39);
 var $41=($38)+($40);
 var $42=($3)+(3);
 var $43=((1.231739516))/($42);
 var $44=($41)-($43);
 var $45=($3)+(4);
 var $46=((0.00120858003))/($45);
 var $47=($44)+($46);
 var $48=($3)+(5);
 var $49=((0.00000536382))/($48);
 var $50=($47)-($49);
 var $51=($3)+((-0.5));
 var $52=($3)+((4.5));
 var $53=Math_log($52);
 var $54=($51)*($53);
 var $55=($54)-($52);
 var $56=($50)*((2.50662827465));
 var $57=Math_log($56);
 var $58=($57)+($55);
 var $59=($33)-($58);
 var $60=Math_log($7);
 var $61=($3)*($60);
 var $62=($61)+($59);
 var $63=(1)-($7);
 var $64=Math_log($63);
 var $65=($64)*((0.5));
 var $66=($65)+($62);
 var $67=Math_exp($66);
 var $68=($36)/($13);
 var $69=$7<$68;
 if($69){var $B0_035_i=1;var $A1_036_i=1;var $M9_037_i=0;var $A0_038_i=0;label=3;break;}else{var $B0_035_i20=1;var $A1_036_i19=1;var $M9_037_i18=0;var $A0_038_i17=0;label=5;break;}
 case 3: 
 var $A0_038_i;
 var $M9_037_i;
 var $A1_036_i;
 var $B0_035_i;
 var $70=($3)+($M9_037_i);
 var $71=((-.0))-($70);
 var $72=($4)+($M9_037_i);
 var $73=($72)*($71);
 var $74=($7)*($73);
 var $75=($M9_037_i)*(2);
 var $76=($3)+($75);
 var $77=($74)/($76);
 var $78=($76)+(1);
 var $79=($77)/($78);
 var $80=($A0_038_i)*($79);
 var $81=($A1_036_i)+($80);
 var $82=($B0_035_i)*($79);
 var $83=($82)+(1);
 var $84=($M9_037_i)+(1);
 var $85=((0.5))-($84);
 var $86=($84)*($85);
 var $87=($7)*($86);
 var $88=($84)*(2);
 var $89=($3)+($88);
 var $90=($89)-(1);
 var $91=($87)/($90);
 var $92=($91)/($89);
 var $93=($A1_036_i)*($92);
 var $94=($81)+($93);
 var $95=($83)+($92);
 var $96=($81)/($95);
 var $97=($83)/($95);
 var $98=($94)/($95);
 var $99=($98)-($A1_036_i);
 var $100=($99)/($98);
 var $101=Math_abs($100);
 var $102=$101>(0.00001);
 if($102){var $B0_035_i=$97;var $A1_036_i=$98;var $M9_037_i=$84;var $A0_038_i=$96;label=3;break;}else{label=4;break;}
 case 4: 
 var $103=($98)/($3);
 var $104=($67)*($103);
 var $betacdf_0=$104;label=7;break;
 case 5: 
 var $A0_038_i17;
 var $M9_037_i18;
 var $A1_036_i19;
 var $B0_035_i20;
 var $105=($M9_037_i18)+((0.5));
 var $106=((-.0))-($105);
 var $107=($4)+($M9_037_i18);
 var $108=($107)*($106);
 var $109=($63)*($108);
 var $110=($M9_037_i18)*(2);
 var $111=($110)+((0.5));
 var $112=($109)/($111);
 var $113=($111)+(1);
 var $114=($112)/($113);
 var $115=($A0_038_i17)*($114);
 var $116=($A1_036_i19)+($115);
 var $117=($B0_035_i20)*($114);
 var $118=($117)+(1);
 var $119=($M9_037_i18)+(1);
 var $120=($3)-($119);
 var $121=($119)*($120);
 var $122=($63)*($121);
 var $123=($119)*(2);
 var $124=($123)+((0.5));
 var $125=($124)-(1);
 var $126=($122)/($125);
 var $127=($126)/($124);
 var $128=($A1_036_i19)*($127);
 var $129=($116)+($128);
 var $130=($118)+($127);
 var $131=($116)/($130);
 var $132=($118)/($130);
 var $133=($129)/($130);
 var $134=($133)-($A1_036_i19);
 var $135=($134)/($133);
 var $136=Math_abs($135);
 var $137=$136>(0.00001);
 if($137){var $B0_035_i20=$132;var $A1_036_i19=$133;var $M9_037_i18=$119;var $A0_038_i17=$131;label=5;break;}else{label=6;break;}
 case 6: 
 var $138=($133)*(2);
 var $139=($67)*($138);
 var $140=(1)-($139);
 var $betacdf_0=$140;label=7;break;
 case 7: 
 var $betacdf_0;
 var $142=$X<0;
 var $143=($betacdf_0)*((0.5));
 if($142){var $_0=$143;label=9;break;}else{label=8;break;}
 case 8: 
 var $145=(1)-($143);
 var $_0=$145;label=9;break;
 case 9: 
 var $_0;
 return $_0;
  default: assert(0, "bad label: " + label);
 }
}
function _qt($p,$df){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 HEAPF64[(tempDoublePtr)>>3]=$p; var $1$0=HEAP32[((tempDoublePtr)>>2)];var $1$1=HEAP32[(((tempDoublePtr)+(4))>>2)];
 var $$etemp$0$0=-1;
 var $$etemp$0$1=2147483647;
 var $2$0=$1$0&$$etemp$0$0;
 var $2$1=$1$1&$$etemp$0$1;
 var $$etemp$1$0=0;
 var $$etemp$1$1=2146435072;
 var $3=(($2$1>>>0) > ($$etemp$1$1>>>0)) | (((($2$1>>>0) == ($$etemp$1$1>>>0) & ($2$0>>>0) >  ($$etemp$1$0>>>0))));
 if($3){var $_0=NaN;label=5;break;}else{label=2;break;}
 case 2: 
 HEAPF64[(tempDoublePtr)>>3]=$df; var $5$0=HEAP32[((tempDoublePtr)>>2)];var $5$1=HEAP32[(((tempDoublePtr)+(4))>>2)];
 var $$etemp$2$0=-1;
 var $$etemp$2$1=2147483647;
 var $6$0=$5$0&$$etemp$2$0;
 var $6$1=$5$1&$$etemp$2$1;
 var $$etemp$3$0=0;
 var $$etemp$3$1=2146435072;
 var $7=(($6$1>>>0) > ($$etemp$3$1>>>0)) | (((($6$1>>>0) == ($$etemp$3$1>>>0) & ($6$0>>>0) >  ($$etemp$3$0>>>0))));
 var $8=$df<1;
 var $or_cond=$7|$8;
 if($or_cond){var $_0=NaN;label=5;break;}else{var $i_011=0;var $t1_012=-1000;var $t2_013=1000;label=3;break;}
 case 3: 
 var $t2_013;
 var $t1_012;
 var $i_011;
 var $9=($t1_012)+($t2_013);
 var $10=($9)*((0.5));
 var $11=_tdist($10,$df);
 var $12=($11)-($p);
 var $13=Math_abs($12);
 var $14=$13<(1e-10);
 if($14){var $_0=$10;label=5;break;}else{label=4;break;}
 case 4: 
 var $16=$11<$p;
 var $_t1_0=($16?$10:$t1_012);
 var $t2_0_=($16?$t2_013:$10);
 var $17=((($i_011)+(1))|0);
 var $18=($17|0)<100;
 if($18){var $i_011=$17;var $t1_012=$_t1_0;var $t2_013=$t2_0_;label=3;break;}else{var $_0=$10;label=5;break;}
 case 5: 
 var $_0;
 return $_0;
  default: assert(0, "bad label: " + label);
 }
}
function _Betacdf($Z,$A,$B){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=($A)+($B);
 var $2=((76.18009173))/($1);
 var $3=($2)+(1);
 var $4=($1)+(1);
 var $5=((86.50532033))/($4);
 var $6=($3)-($5);
 var $7=($1)+(2);
 var $8=((24.01409822))/($7);
 var $9=($6)+($8);
 var $10=($1)+(3);
 var $11=((1.231739516))/($10);
 var $12=($9)-($11);
 var $13=($1)+(4);
 var $14=((0.00120858003))/($13);
 var $15=($12)+($14);
 var $16=($1)+(5);
 var $17=((0.00000536382))/($16);
 var $18=($15)-($17);
 var $19=($1)+((-0.5));
 var $20=($1)+((4.5));
 var $21=Math_log($20);
 var $22=($19)*($21);
 var $23=($22)-($20);
 var $24=($18)*((2.50662827465));
 var $25=Math_log($24);
 var $26=($25)+($23);
 var $27=((76.18009173))/($B);
 var $28=($27)+(1);
 var $29=($B)+(1);
 var $30=((86.50532033))/($29);
 var $31=($28)-($30);
 var $32=($B)+(2);
 var $33=((24.01409822))/($32);
 var $34=($31)+($33);
 var $35=($B)+(3);
 var $36=((1.231739516))/($35);
 var $37=($34)-($36);
 var $38=($B)+(4);
 var $39=((0.00120858003))/($38);
 var $40=($37)+($39);
 var $41=($B)+(5);
 var $42=((0.00000536382))/($41);
 var $43=($40)-($42);
 var $44=($B)+((-0.5));
 var $45=($B)+((4.5));
 var $46=Math_log($45);
 var $47=($44)*($46);
 var $48=($47)-($45);
 var $49=($43)*((2.50662827465));
 var $50=Math_log($49);
 var $51=($50)+($48);
 var $52=($26)-($51);
 var $53=((76.18009173))/($A);
 var $54=($53)+(1);
 var $55=($A)+(1);
 var $56=((86.50532033))/($55);
 var $57=($54)-($56);
 var $58=($A)+(2);
 var $59=((24.01409822))/($58);
 var $60=($57)+($59);
 var $61=($A)+(3);
 var $62=((1.231739516))/($61);
 var $63=($60)-($62);
 var $64=($A)+(4);
 var $65=((0.00120858003))/($64);
 var $66=($63)+($65);
 var $67=($A)+(5);
 var $68=((0.00000536382))/($67);
 var $69=($66)-($68);
 var $70=($A)+((-0.5));
 var $71=($A)+((4.5));
 var $72=Math_log($71);
 var $73=($70)*($72);
 var $74=($73)-($71);
 var $75=($69)*((2.50662827465));
 var $76=Math_log($75);
 var $77=($76)+($74);
 var $78=($52)-($77);
 var $79=Math_log($Z);
 var $80=($79)*($A);
 var $81=($80)+($78);
 var $82=(1)-($Z);
 var $83=Math_log($82);
 var $84=($83)*($B);
 var $85=($84)+($81);
 var $86=Math_exp($85);
 var $87=($55)/($7);
 var $88=$87>$Z;
 if($88){var $B0_035_i=1;var $A1_036_i=1;var $M9_037_i=0;var $A0_038_i=0;label=2;break;}else{var $B0_035_i19=1;var $A1_036_i18=1;var $M9_037_i17=0;var $A0_038_i16=0;label=4;break;}
 case 2: 
 var $A0_038_i;
 var $M9_037_i;
 var $A1_036_i;
 var $B0_035_i;
 var $89=($M9_037_i)+($A);
 var $90=((-.0))-($89);
 var $91=($1)+($M9_037_i);
 var $92=($91)*($90);
 var $93=($92)*($Z);
 var $94=($M9_037_i)*(2);
 var $95=($94)+($A);
 var $96=($93)/($95);
 var $97=($95)+(1);
 var $98=($96)/($97);
 var $99=($A0_038_i)*($98);
 var $100=($A1_036_i)+($99);
 var $101=($B0_035_i)*($98);
 var $102=($101)+(1);
 var $103=($M9_037_i)+(1);
 var $104=($B)-($103);
 var $105=($103)*($104);
 var $106=($105)*($Z);
 var $107=($103)*(2);
 var $108=($107)+($A);
 var $109=($108)-(1);
 var $110=($106)/($109);
 var $111=($110)/($108);
 var $112=($A1_036_i)*($111);
 var $113=($100)+($112);
 var $114=($102)+($111);
 var $115=($100)/($114);
 var $116=($102)/($114);
 var $117=($113)/($114);
 var $118=($117)-($A1_036_i);
 var $119=($118)/($117);
 var $120=Math_abs($119);
 var $121=$120>(0.00001);
 if($121){var $B0_035_i=$116;var $A1_036_i=$117;var $M9_037_i=$103;var $A0_038_i=$115;label=2;break;}else{label=3;break;}
 case 3: 
 var $122=($117)/($A);
 var $123=($86)*($122);
 var $Bcdf_0=$123;label=6;break;
 case 4: 
 var $A0_038_i16;
 var $M9_037_i17;
 var $A1_036_i18;
 var $B0_035_i19;
 var $124=($M9_037_i17)+($B);
 var $125=((-.0))-($124);
 var $126=($1)+($M9_037_i17);
 var $127=($126)*($125);
 var $128=($82)*($127);
 var $129=($M9_037_i17)*(2);
 var $130=($129)+($B);
 var $131=($128)/($130);
 var $132=($130)+(1);
 var $133=($131)/($132);
 var $134=($A0_038_i16)*($133);
 var $135=($A1_036_i18)+($134);
 var $136=($B0_035_i19)*($133);
 var $137=($136)+(1);
 var $138=($M9_037_i17)+(1);
 var $139=($A)-($138);
 var $140=($138)*($139);
 var $141=($82)*($140);
 var $142=($138)*(2);
 var $143=($142)+($B);
 var $144=($143)-(1);
 var $145=($141)/($144);
 var $146=($145)/($143);
 var $147=($A1_036_i18)*($146);
 var $148=($135)+($147);
 var $149=($137)+($146);
 var $150=($135)/($149);
 var $151=($137)/($149);
 var $152=($148)/($149);
 var $153=($152)-($A1_036_i18);
 var $154=($153)/($152);
 var $155=Math_abs($154);
 var $156=$155>(0.00001);
 if($156){var $B0_035_i19=$151;var $A1_036_i18=$152;var $M9_037_i17=$138;var $A0_038_i16=$150;label=4;break;}else{label=5;break;}
 case 5: 
 var $157=($152)/($B);
 var $158=($86)*($157);
 var $159=(1)-($158);
 var $Bcdf_0=$159;label=6;break;
 case 6: 
 var $Bcdf_0;
 return $Bcdf_0;
  default: assert(0, "bad label: " + label);
 }
}
function _fdist($x,$df1,$df2){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=$x>0;
 if($1){label=2;break;}else{var $z_0=0;label=3;break;}
 case 2: 
 var $3=($df2)/($df1);
 var $4=($3)+($x);
 var $5=($x)/($4);
 var $6=($df1)*((0.5));
 var $7=($df2)*((0.5));
 var $8=_Betacdf($5,$6,$7);
 var $z_0=$8;label=3;break;
 case 3: 
 var $z_0;
 return $z_0;
  default: assert(0, "bad label: " + label);
 }
}
function _title_stmt(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 _scan();
 var $1=HEAP32[((6944)>>2)];
 var $2=($1|0)==1003;
 if($2){label=3;break;}else{label=2;break;}
 case 2: 
 _expected(2544);
 label=3;break;
 case 3: 
 var $5=HEAP32[((6976)>>2)];
 var $6=($5|0)==0;
 if($6){label=5;break;}else{label=4;break;}
 case 4: 
 _free($5);
 label=5;break;
 case 5: 
 var $9=HEAP8[(6984)];
 var $10=(($9<<24)>>24)==0;
 if($10){var $storemerge=0;label=7;break;}else{label=6;break;}
 case 6: 
 var $12=_strdup(6984);
 var $storemerge=$12;label=7;break;
 case 7: 
 var $storemerge;
 HEAP32[((6976)>>2)]=$storemerge;
 _scan();
 var $14=HEAP32[((6944)>>2)];
 var $15=($14|0)==59;
 if($15){label=9;break;}else{label=8;break;}
 case 8: 
 _stop(3816);
 label=9;break;
 case 9: 
 _scan();
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _title1_stmt(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 _scan();
 var $1=HEAP32[((6944)>>2)];
 var $2=($1|0)==1003;
 if($2){label=3;break;}else{label=2;break;}
 case 2: 
 _expected(2544);
 label=3;break;
 case 3: 
 var $5=HEAP32[((6968)>>2)];
 var $6=($5|0)==0;
 if($6){label=5;break;}else{label=4;break;}
 case 4: 
 _free($5);
 label=5;break;
 case 5: 
 var $9=HEAP8[(6984)];
 var $10=(($9<<24)>>24)==0;
 if($10){var $storemerge=0;label=7;break;}else{label=6;break;}
 case 6: 
 var $12=_strdup(6984);
 var $storemerge=$12;label=7;break;
 case 7: 
 var $storemerge;
 HEAP32[((6968)>>2)]=$storemerge;
 _scan();
 var $14=HEAP32[((6944)>>2)];
 var $15=($14|0)==59;
 if($15){label=9;break;}else{label=8;break;}
 case 8: 
 _stop(3816);
 label=9;break;
 case 9: 
 _scan();
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _title2_stmt(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 _scan();
 var $1=HEAP32[((6944)>>2)];
 var $2=($1|0)==1003;
 if($2){label=3;break;}else{label=2;break;}
 case 2: 
 _expected(2544);
 label=3;break;
 case 3: 
 var $5=HEAP32[((6960)>>2)];
 var $6=($5|0)==0;
 if($6){label=5;break;}else{label=4;break;}
 case 4: 
 _free($5);
 label=5;break;
 case 5: 
 var $9=HEAP8[(6984)];
 var $10=(($9<<24)>>24)==0;
 if($10){var $storemerge=0;label=7;break;}else{label=6;break;}
 case 6: 
 var $12=_strdup(6984);
 var $storemerge=$12;label=7;break;
 case 7: 
 var $storemerge;
 HEAP32[((6960)>>2)]=$storemerge;
 _scan();
 var $14=HEAP32[((6944)>>2)];
 var $15=($14|0)==59;
 if($15){label=9;break;}else{label=8;break;}
 case 8: 
 _stop(3816);
 label=9;break;
 case 9: 
 _scan();
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _title3_stmt(){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 _scan();
 var $1=HEAP32[((6944)>>2)];
 var $2=($1|0)==1003;
 if($2){label=3;break;}else{label=2;break;}
 case 2: 
 _expected(2544);
 label=3;break;
 case 3: 
 var $5=HEAP32[((6952)>>2)];
 var $6=($5|0)==0;
 if($6){label=5;break;}else{label=4;break;}
 case 4: 
 _free($5);
 label=5;break;
 case 5: 
 var $9=HEAP8[(6984)];
 var $10=(($9<<24)>>24)==0;
 if($10){var $storemerge=0;label=7;break;}else{label=6;break;}
 case 6: 
 var $12=_strdup(6984);
 var $storemerge=$12;label=7;break;
 case 7: 
 var $storemerge;
 HEAP32[((6952)>>2)]=$storemerge;
 _scan();
 var $14=HEAP32[((6944)>>2)];
 var $15=($14|0)==59;
 if($15){label=9;break;}else{label=8;break;}
 case 8: 
 _stop(3816);
 label=9;break;
 case 9: 
 _scan();
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _var_stmt(){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 label=2;break;
 case 2: 
 _scan();
 var $2=HEAP32[((6944)>>2)];
 if(($2|0)==59){ label=10;break;}else if(($2|0)==1001){ label=4;break;}else{label=3;break;}
 case 3: 
 _stop(2440);
 label=4;break;
 case 4: 
 var $4=HEAP32[((14112)>>2)];
 var $5=(($4+8)|0);
 var $6=HEAP32[(($5)>>2)];
 var $i_0=0;label=5;break;
 case 5: 
 var $i_0;
 var $8=($i_0|0)<($6|0);
 if($8){label=6;break;}else{label=7;break;}
 case 6: 
 var $10=(($4+20+((($i_0)*(24))&-1))|0);
 var $11=HEAP32[(($10)>>2)];
 var $12=_strcmp($11,6984);
 var $13=($12|0)==0;
 var $14=((($i_0)+(1))|0);
 if($13){label=7;break;}else{var $i_0=$14;label=5;break;}
 case 7: 
 var $16=($i_0|0)==($6|0);
 if($16){label=8;break;}else{label=9;break;}
 case 8: 
 var $18=_sprintf(12576,3784,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=6984,tempVarArgs)); STACKTOP=tempVarArgs;
 _stop(12576);
 label=9;break;
 case 9: 
 var $20=HEAP32[((8992)>>2)];
 var $21=((($20)+(1))|0);
 HEAP32[((8992)>>2)]=$21;
 var $22=((6528+($20<<2))|0);
 HEAP32[(($22)>>2)]=$i_0;
 label=2;break;
 case 10: 
 _scan();
 STACKTOP=sp;return;
  default: assert(0, "bad label: " + label);
 }
}
function _malloc($bytes){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=($bytes>>>0)<245;
 if($1){label=2;break;}else{label=78;break;}
 case 2: 
 var $3=($bytes>>>0)<11;
 if($3){var $8=16;label=4;break;}else{label=3;break;}
 case 3: 
 var $5=((($bytes)+(11))|0);
 var $6=$5&-8;
 var $8=$6;label=4;break;
 case 4: 
 var $8;
 var $9=$8>>>3;
 var $10=HEAP32[((36080)>>2)];
 var $11=$10>>>($9>>>0);
 var $12=$11&3;
 var $13=($12|0)==0;
 if($13){label=12;break;}else{label=5;break;}
 case 5: 
 var $15=$11&1;
 var $16=$15^1;
 var $17=((($16)+($9))|0);
 var $18=$17<<1;
 var $19=((36120+($18<<2))|0);
 var $20=$19;
 var $_sum111=((($18)+(2))|0);
 var $21=((36120+($_sum111<<2))|0);
 var $22=HEAP32[(($21)>>2)];
 var $23=(($22+8)|0);
 var $24=HEAP32[(($23)>>2)];
 var $25=($20|0)==($24|0);
 if($25){label=6;break;}else{label=7;break;}
 case 6: 
 var $27=1<<$17;
 var $28=$27^-1;
 var $29=$10&$28;
 HEAP32[((36080)>>2)]=$29;
 label=11;break;
 case 7: 
 var $31=$24;
 var $32=HEAP32[((36096)>>2)];
 var $33=($31>>>0)<($32>>>0);
 if($33){label=10;break;}else{label=8;break;}
 case 8: 
 var $35=(($24+12)|0);
 var $36=HEAP32[(($35)>>2)];
 var $37=($36|0)==($22|0);
 if($37){label=9;break;}else{label=10;break;}
 case 9: 
 HEAP32[(($35)>>2)]=$20;
 HEAP32[(($21)>>2)]=$24;
 label=11;break;
 case 10: 
 _abort();
 throw "Reached an unreachable!";
 case 11: 
 var $40=$17<<3;
 var $41=$40|3;
 var $42=(($22+4)|0);
 HEAP32[(($42)>>2)]=$41;
 var $43=$22;
 var $_sum113114=$40|4;
 var $44=(($43+$_sum113114)|0);
 var $45=$44;
 var $46=HEAP32[(($45)>>2)];
 var $47=$46|1;
 HEAP32[(($45)>>2)]=$47;
 var $48=$23;
 var $mem_0=$48;label=341;break;
 case 12: 
 var $50=HEAP32[((36088)>>2)];
 var $51=($8>>>0)>($50>>>0);
 if($51){label=13;break;}else{var $nb_0=$8;label=160;break;}
 case 13: 
 var $53=($11|0)==0;
 if($53){label=27;break;}else{label=14;break;}
 case 14: 
 var $55=$11<<$9;
 var $56=2<<$9;
 var $57=(((-$56))|0);
 var $58=$56|$57;
 var $59=$55&$58;
 var $60=(((-$59))|0);
 var $61=$59&$60;
 var $62=((($61)-(1))|0);
 var $63=$62>>>12;
 var $64=$63&16;
 var $65=$62>>>($64>>>0);
 var $66=$65>>>5;
 var $67=$66&8;
 var $68=$67|$64;
 var $69=$65>>>($67>>>0);
 var $70=$69>>>2;
 var $71=$70&4;
 var $72=$68|$71;
 var $73=$69>>>($71>>>0);
 var $74=$73>>>1;
 var $75=$74&2;
 var $76=$72|$75;
 var $77=$73>>>($75>>>0);
 var $78=$77>>>1;
 var $79=$78&1;
 var $80=$76|$79;
 var $81=$77>>>($79>>>0);
 var $82=((($80)+($81))|0);
 var $83=$82<<1;
 var $84=((36120+($83<<2))|0);
 var $85=$84;
 var $_sum104=((($83)+(2))|0);
 var $86=((36120+($_sum104<<2))|0);
 var $87=HEAP32[(($86)>>2)];
 var $88=(($87+8)|0);
 var $89=HEAP32[(($88)>>2)];
 var $90=($85|0)==($89|0);
 if($90){label=15;break;}else{label=16;break;}
 case 15: 
 var $92=1<<$82;
 var $93=$92^-1;
 var $94=$10&$93;
 HEAP32[((36080)>>2)]=$94;
 label=20;break;
 case 16: 
 var $96=$89;
 var $97=HEAP32[((36096)>>2)];
 var $98=($96>>>0)<($97>>>0);
 if($98){label=19;break;}else{label=17;break;}
 case 17: 
 var $100=(($89+12)|0);
 var $101=HEAP32[(($100)>>2)];
 var $102=($101|0)==($87|0);
 if($102){label=18;break;}else{label=19;break;}
 case 18: 
 HEAP32[(($100)>>2)]=$85;
 HEAP32[(($86)>>2)]=$89;
 label=20;break;
 case 19: 
 _abort();
 throw "Reached an unreachable!";
 case 20: 
 var $105=$82<<3;
 var $106=((($105)-($8))|0);
 var $107=$8|3;
 var $108=(($87+4)|0);
 HEAP32[(($108)>>2)]=$107;
 var $109=$87;
 var $110=(($109+$8)|0);
 var $111=$110;
 var $112=$106|1;
 var $_sum106107=$8|4;
 var $113=(($109+$_sum106107)|0);
 var $114=$113;
 HEAP32[(($114)>>2)]=$112;
 var $115=(($109+$105)|0);
 var $116=$115;
 HEAP32[(($116)>>2)]=$106;
 var $117=HEAP32[((36088)>>2)];
 var $118=($117|0)==0;
 if($118){label=26;break;}else{label=21;break;}
 case 21: 
 var $120=HEAP32[((36100)>>2)];
 var $121=$117>>>3;
 var $122=$121<<1;
 var $123=((36120+($122<<2))|0);
 var $124=$123;
 var $125=HEAP32[((36080)>>2)];
 var $126=1<<$121;
 var $127=$125&$126;
 var $128=($127|0)==0;
 if($128){label=22;break;}else{label=23;break;}
 case 22: 
 var $130=$125|$126;
 HEAP32[((36080)>>2)]=$130;
 var $_sum109_pre=((($122)+(2))|0);
 var $_pre=((36120+($_sum109_pre<<2))|0);
 var $F4_0=$124;var $_pre_phi=$_pre;label=25;break;
 case 23: 
 var $_sum110=((($122)+(2))|0);
 var $132=((36120+($_sum110<<2))|0);
 var $133=HEAP32[(($132)>>2)];
 var $134=$133;
 var $135=HEAP32[((36096)>>2)];
 var $136=($134>>>0)<($135>>>0);
 if($136){label=24;break;}else{var $F4_0=$133;var $_pre_phi=$132;label=25;break;}
 case 24: 
 _abort();
 throw "Reached an unreachable!";
 case 25: 
 var $_pre_phi;
 var $F4_0;
 HEAP32[(($_pre_phi)>>2)]=$120;
 var $139=(($F4_0+12)|0);
 HEAP32[(($139)>>2)]=$120;
 var $140=(($120+8)|0);
 HEAP32[(($140)>>2)]=$F4_0;
 var $141=(($120+12)|0);
 HEAP32[(($141)>>2)]=$124;
 label=26;break;
 case 26: 
 HEAP32[((36088)>>2)]=$106;
 HEAP32[((36100)>>2)]=$111;
 var $143=$88;
 var $mem_0=$143;label=341;break;
 case 27: 
 var $145=HEAP32[((36084)>>2)];
 var $146=($145|0)==0;
 if($146){var $nb_0=$8;label=160;break;}else{label=28;break;}
 case 28: 
 var $148=(((-$145))|0);
 var $149=$145&$148;
 var $150=((($149)-(1))|0);
 var $151=$150>>>12;
 var $152=$151&16;
 var $153=$150>>>($152>>>0);
 var $154=$153>>>5;
 var $155=$154&8;
 var $156=$155|$152;
 var $157=$153>>>($155>>>0);
 var $158=$157>>>2;
 var $159=$158&4;
 var $160=$156|$159;
 var $161=$157>>>($159>>>0);
 var $162=$161>>>1;
 var $163=$162&2;
 var $164=$160|$163;
 var $165=$161>>>($163>>>0);
 var $166=$165>>>1;
 var $167=$166&1;
 var $168=$164|$167;
 var $169=$165>>>($167>>>0);
 var $170=((($168)+($169))|0);
 var $171=((36384+($170<<2))|0);
 var $172=HEAP32[(($171)>>2)];
 var $173=(($172+4)|0);
 var $174=HEAP32[(($173)>>2)];
 var $175=$174&-8;
 var $176=((($175)-($8))|0);
 var $t_0_i=$172;var $v_0_i=$172;var $rsize_0_i=$176;label=29;break;
 case 29: 
 var $rsize_0_i;
 var $v_0_i;
 var $t_0_i;
 var $178=(($t_0_i+16)|0);
 var $179=HEAP32[(($178)>>2)];
 var $180=($179|0)==0;
 if($180){label=30;break;}else{var $185=$179;label=31;break;}
 case 30: 
 var $182=(($t_0_i+20)|0);
 var $183=HEAP32[(($182)>>2)];
 var $184=($183|0)==0;
 if($184){label=32;break;}else{var $185=$183;label=31;break;}
 case 31: 
 var $185;
 var $186=(($185+4)|0);
 var $187=HEAP32[(($186)>>2)];
 var $188=$187&-8;
 var $189=((($188)-($8))|0);
 var $190=($189>>>0)<($rsize_0_i>>>0);
 var $_rsize_0_i=($190?$189:$rsize_0_i);
 var $_v_0_i=($190?$185:$v_0_i);
 var $t_0_i=$185;var $v_0_i=$_v_0_i;var $rsize_0_i=$_rsize_0_i;label=29;break;
 case 32: 
 var $192=$v_0_i;
 var $193=HEAP32[((36096)>>2)];
 var $194=($192>>>0)<($193>>>0);
 if($194){label=76;break;}else{label=33;break;}
 case 33: 
 var $196=(($192+$8)|0);
 var $197=$196;
 var $198=($192>>>0)<($196>>>0);
 if($198){label=34;break;}else{label=76;break;}
 case 34: 
 var $200=(($v_0_i+24)|0);
 var $201=HEAP32[(($200)>>2)];
 var $202=(($v_0_i+12)|0);
 var $203=HEAP32[(($202)>>2)];
 var $204=($203|0)==($v_0_i|0);
 if($204){label=40;break;}else{label=35;break;}
 case 35: 
 var $206=(($v_0_i+8)|0);
 var $207=HEAP32[(($206)>>2)];
 var $208=$207;
 var $209=($208>>>0)<($193>>>0);
 if($209){label=39;break;}else{label=36;break;}
 case 36: 
 var $211=(($207+12)|0);
 var $212=HEAP32[(($211)>>2)];
 var $213=($212|0)==($v_0_i|0);
 if($213){label=37;break;}else{label=39;break;}
 case 37: 
 var $215=(($203+8)|0);
 var $216=HEAP32[(($215)>>2)];
 var $217=($216|0)==($v_0_i|0);
 if($217){label=38;break;}else{label=39;break;}
 case 38: 
 HEAP32[(($211)>>2)]=$203;
 HEAP32[(($215)>>2)]=$207;
 var $R_1_i=$203;label=47;break;
 case 39: 
 _abort();
 throw "Reached an unreachable!";
 case 40: 
 var $220=(($v_0_i+20)|0);
 var $221=HEAP32[(($220)>>2)];
 var $222=($221|0)==0;
 if($222){label=41;break;}else{var $R_0_i=$221;var $RP_0_i=$220;label=42;break;}
 case 41: 
 var $224=(($v_0_i+16)|0);
 var $225=HEAP32[(($224)>>2)];
 var $226=($225|0)==0;
 if($226){var $R_1_i=0;label=47;break;}else{var $R_0_i=$225;var $RP_0_i=$224;label=42;break;}
 case 42: 
 var $RP_0_i;
 var $R_0_i;
 var $227=(($R_0_i+20)|0);
 var $228=HEAP32[(($227)>>2)];
 var $229=($228|0)==0;
 if($229){label=43;break;}else{var $R_0_i=$228;var $RP_0_i=$227;label=42;break;}
 case 43: 
 var $231=(($R_0_i+16)|0);
 var $232=HEAP32[(($231)>>2)];
 var $233=($232|0)==0;
 if($233){label=44;break;}else{var $R_0_i=$232;var $RP_0_i=$231;label=42;break;}
 case 44: 
 var $235=$RP_0_i;
 var $236=($235>>>0)<($193>>>0);
 if($236){label=46;break;}else{label=45;break;}
 case 45: 
 HEAP32[(($RP_0_i)>>2)]=0;
 var $R_1_i=$R_0_i;label=47;break;
 case 46: 
 _abort();
 throw "Reached an unreachable!";
 case 47: 
 var $R_1_i;
 var $240=($201|0)==0;
 if($240){label=67;break;}else{label=48;break;}
 case 48: 
 var $242=(($v_0_i+28)|0);
 var $243=HEAP32[(($242)>>2)];
 var $244=((36384+($243<<2))|0);
 var $245=HEAP32[(($244)>>2)];
 var $246=($v_0_i|0)==($245|0);
 if($246){label=49;break;}else{label=51;break;}
 case 49: 
 HEAP32[(($244)>>2)]=$R_1_i;
 var $cond_i=($R_1_i|0)==0;
 if($cond_i){label=50;break;}else{label=57;break;}
 case 50: 
 var $248=HEAP32[(($242)>>2)];
 var $249=1<<$248;
 var $250=$249^-1;
 var $251=HEAP32[((36084)>>2)];
 var $252=$251&$250;
 HEAP32[((36084)>>2)]=$252;
 label=67;break;
 case 51: 
 var $254=$201;
 var $255=HEAP32[((36096)>>2)];
 var $256=($254>>>0)<($255>>>0);
 if($256){label=55;break;}else{label=52;break;}
 case 52: 
 var $258=(($201+16)|0);
 var $259=HEAP32[(($258)>>2)];
 var $260=($259|0)==($v_0_i|0);
 if($260){label=53;break;}else{label=54;break;}
 case 53: 
 HEAP32[(($258)>>2)]=$R_1_i;
 label=56;break;
 case 54: 
 var $263=(($201+20)|0);
 HEAP32[(($263)>>2)]=$R_1_i;
 label=56;break;
 case 55: 
 _abort();
 throw "Reached an unreachable!";
 case 56: 
 var $266=($R_1_i|0)==0;
 if($266){label=67;break;}else{label=57;break;}
 case 57: 
 var $268=$R_1_i;
 var $269=HEAP32[((36096)>>2)];
 var $270=($268>>>0)<($269>>>0);
 if($270){label=66;break;}else{label=58;break;}
 case 58: 
 var $272=(($R_1_i+24)|0);
 HEAP32[(($272)>>2)]=$201;
 var $273=(($v_0_i+16)|0);
 var $274=HEAP32[(($273)>>2)];
 var $275=($274|0)==0;
 if($275){label=62;break;}else{label=59;break;}
 case 59: 
 var $277=$274;
 var $278=HEAP32[((36096)>>2)];
 var $279=($277>>>0)<($278>>>0);
 if($279){label=61;break;}else{label=60;break;}
 case 60: 
 var $281=(($R_1_i+16)|0);
 HEAP32[(($281)>>2)]=$274;
 var $282=(($274+24)|0);
 HEAP32[(($282)>>2)]=$R_1_i;
 label=62;break;
 case 61: 
 _abort();
 throw "Reached an unreachable!";
 case 62: 
 var $285=(($v_0_i+20)|0);
 var $286=HEAP32[(($285)>>2)];
 var $287=($286|0)==0;
 if($287){label=67;break;}else{label=63;break;}
 case 63: 
 var $289=$286;
 var $290=HEAP32[((36096)>>2)];
 var $291=($289>>>0)<($290>>>0);
 if($291){label=65;break;}else{label=64;break;}
 case 64: 
 var $293=(($R_1_i+20)|0);
 HEAP32[(($293)>>2)]=$286;
 var $294=(($286+24)|0);
 HEAP32[(($294)>>2)]=$R_1_i;
 label=67;break;
 case 65: 
 _abort();
 throw "Reached an unreachable!";
 case 66: 
 _abort();
 throw "Reached an unreachable!";
 case 67: 
 var $298=($rsize_0_i>>>0)<16;
 if($298){label=68;break;}else{label=69;break;}
 case 68: 
 var $300=((($rsize_0_i)+($8))|0);
 var $301=$300|3;
 var $302=(($v_0_i+4)|0);
 HEAP32[(($302)>>2)]=$301;
 var $_sum4_i=((($300)+(4))|0);
 var $303=(($192+$_sum4_i)|0);
 var $304=$303;
 var $305=HEAP32[(($304)>>2)];
 var $306=$305|1;
 HEAP32[(($304)>>2)]=$306;
 label=77;break;
 case 69: 
 var $308=$8|3;
 var $309=(($v_0_i+4)|0);
 HEAP32[(($309)>>2)]=$308;
 var $310=$rsize_0_i|1;
 var $_sum_i137=$8|4;
 var $311=(($192+$_sum_i137)|0);
 var $312=$311;
 HEAP32[(($312)>>2)]=$310;
 var $_sum1_i=((($rsize_0_i)+($8))|0);
 var $313=(($192+$_sum1_i)|0);
 var $314=$313;
 HEAP32[(($314)>>2)]=$rsize_0_i;
 var $315=HEAP32[((36088)>>2)];
 var $316=($315|0)==0;
 if($316){label=75;break;}else{label=70;break;}
 case 70: 
 var $318=HEAP32[((36100)>>2)];
 var $319=$315>>>3;
 var $320=$319<<1;
 var $321=((36120+($320<<2))|0);
 var $322=$321;
 var $323=HEAP32[((36080)>>2)];
 var $324=1<<$319;
 var $325=$323&$324;
 var $326=($325|0)==0;
 if($326){label=71;break;}else{label=72;break;}
 case 71: 
 var $328=$323|$324;
 HEAP32[((36080)>>2)]=$328;
 var $_sum2_pre_i=((($320)+(2))|0);
 var $_pre_i=((36120+($_sum2_pre_i<<2))|0);
 var $F1_0_i=$322;var $_pre_phi_i=$_pre_i;label=74;break;
 case 72: 
 var $_sum3_i=((($320)+(2))|0);
 var $330=((36120+($_sum3_i<<2))|0);
 var $331=HEAP32[(($330)>>2)];
 var $332=$331;
 var $333=HEAP32[((36096)>>2)];
 var $334=($332>>>0)<($333>>>0);
 if($334){label=73;break;}else{var $F1_0_i=$331;var $_pre_phi_i=$330;label=74;break;}
 case 73: 
 _abort();
 throw "Reached an unreachable!";
 case 74: 
 var $_pre_phi_i;
 var $F1_0_i;
 HEAP32[(($_pre_phi_i)>>2)]=$318;
 var $337=(($F1_0_i+12)|0);
 HEAP32[(($337)>>2)]=$318;
 var $338=(($318+8)|0);
 HEAP32[(($338)>>2)]=$F1_0_i;
 var $339=(($318+12)|0);
 HEAP32[(($339)>>2)]=$322;
 label=75;break;
 case 75: 
 HEAP32[((36088)>>2)]=$rsize_0_i;
 HEAP32[((36100)>>2)]=$197;
 label=77;break;
 case 76: 
 _abort();
 throw "Reached an unreachable!";
 case 77: 
 var $342=(($v_0_i+8)|0);
 var $343=$342;
 var $344=($342|0)==0;
 if($344){var $nb_0=$8;label=160;break;}else{var $mem_0=$343;label=341;break;}
 case 78: 
 var $346=($bytes>>>0)>4294967231;
 if($346){var $nb_0=-1;label=160;break;}else{label=79;break;}
 case 79: 
 var $348=((($bytes)+(11))|0);
 var $349=$348&-8;
 var $350=HEAP32[((36084)>>2)];
 var $351=($350|0)==0;
 if($351){var $nb_0=$349;label=160;break;}else{label=80;break;}
 case 80: 
 var $353=(((-$349))|0);
 var $354=$348>>>8;
 var $355=($354|0)==0;
 if($355){var $idx_0_i=0;label=83;break;}else{label=81;break;}
 case 81: 
 var $357=($349>>>0)>16777215;
 if($357){var $idx_0_i=31;label=83;break;}else{label=82;break;}
 case 82: 
 var $359=((($354)+(1048320))|0);
 var $360=$359>>>16;
 var $361=$360&8;
 var $362=$354<<$361;
 var $363=((($362)+(520192))|0);
 var $364=$363>>>16;
 var $365=$364&4;
 var $366=$365|$361;
 var $367=$362<<$365;
 var $368=((($367)+(245760))|0);
 var $369=$368>>>16;
 var $370=$369&2;
 var $371=$366|$370;
 var $372=(((14)-($371))|0);
 var $373=$367<<$370;
 var $374=$373>>>15;
 var $375=((($372)+($374))|0);
 var $376=$375<<1;
 var $377=((($375)+(7))|0);
 var $378=$349>>>($377>>>0);
 var $379=$378&1;
 var $380=$379|$376;
 var $idx_0_i=$380;label=83;break;
 case 83: 
 var $idx_0_i;
 var $382=((36384+($idx_0_i<<2))|0);
 var $383=HEAP32[(($382)>>2)];
 var $384=($383|0)==0;
 if($384){var $v_2_i=0;var $rsize_2_i=$353;var $t_1_i=0;label=90;break;}else{label=84;break;}
 case 84: 
 var $386=($idx_0_i|0)==31;
 if($386){var $391=0;label=86;break;}else{label=85;break;}
 case 85: 
 var $388=$idx_0_i>>>1;
 var $389=(((25)-($388))|0);
 var $391=$389;label=86;break;
 case 86: 
 var $391;
 var $392=$349<<$391;
 var $v_0_i118=0;var $rsize_0_i117=$353;var $t_0_i116=$383;var $sizebits_0_i=$392;var $rst_0_i=0;label=87;break;
 case 87: 
 var $rst_0_i;
 var $sizebits_0_i;
 var $t_0_i116;
 var $rsize_0_i117;
 var $v_0_i118;
 var $394=(($t_0_i116+4)|0);
 var $395=HEAP32[(($394)>>2)];
 var $396=$395&-8;
 var $397=((($396)-($349))|0);
 var $398=($397>>>0)<($rsize_0_i117>>>0);
 if($398){label=88;break;}else{var $v_1_i=$v_0_i118;var $rsize_1_i=$rsize_0_i117;label=89;break;}
 case 88: 
 var $400=($396|0)==($349|0);
 if($400){var $v_2_i=$t_0_i116;var $rsize_2_i=$397;var $t_1_i=$t_0_i116;label=90;break;}else{var $v_1_i=$t_0_i116;var $rsize_1_i=$397;label=89;break;}
 case 89: 
 var $rsize_1_i;
 var $v_1_i;
 var $402=(($t_0_i116+20)|0);
 var $403=HEAP32[(($402)>>2)];
 var $404=$sizebits_0_i>>>31;
 var $405=(($t_0_i116+16+($404<<2))|0);
 var $406=HEAP32[(($405)>>2)];
 var $407=($403|0)==0;
 var $408=($403|0)==($406|0);
 var $or_cond_i=$407|$408;
 var $rst_1_i=($or_cond_i?$rst_0_i:$403);
 var $409=($406|0)==0;
 var $410=$sizebits_0_i<<1;
 if($409){var $v_2_i=$v_1_i;var $rsize_2_i=$rsize_1_i;var $t_1_i=$rst_1_i;label=90;break;}else{var $v_0_i118=$v_1_i;var $rsize_0_i117=$rsize_1_i;var $t_0_i116=$406;var $sizebits_0_i=$410;var $rst_0_i=$rst_1_i;label=87;break;}
 case 90: 
 var $t_1_i;
 var $rsize_2_i;
 var $v_2_i;
 var $411=($t_1_i|0)==0;
 var $412=($v_2_i|0)==0;
 var $or_cond21_i=$411&$412;
 if($or_cond21_i){label=91;break;}else{var $t_2_ph_i=$t_1_i;label=93;break;}
 case 91: 
 var $414=2<<$idx_0_i;
 var $415=(((-$414))|0);
 var $416=$414|$415;
 var $417=$350&$416;
 var $418=($417|0)==0;
 if($418){var $nb_0=$349;label=160;break;}else{label=92;break;}
 case 92: 
 var $420=(((-$417))|0);
 var $421=$417&$420;
 var $422=((($421)-(1))|0);
 var $423=$422>>>12;
 var $424=$423&16;
 var $425=$422>>>($424>>>0);
 var $426=$425>>>5;
 var $427=$426&8;
 var $428=$427|$424;
 var $429=$425>>>($427>>>0);
 var $430=$429>>>2;
 var $431=$430&4;
 var $432=$428|$431;
 var $433=$429>>>($431>>>0);
 var $434=$433>>>1;
 var $435=$434&2;
 var $436=$432|$435;
 var $437=$433>>>($435>>>0);
 var $438=$437>>>1;
 var $439=$438&1;
 var $440=$436|$439;
 var $441=$437>>>($439>>>0);
 var $442=((($440)+($441))|0);
 var $443=((36384+($442<<2))|0);
 var $444=HEAP32[(($443)>>2)];
 var $t_2_ph_i=$444;label=93;break;
 case 93: 
 var $t_2_ph_i;
 var $445=($t_2_ph_i|0)==0;
 if($445){var $rsize_3_lcssa_i=$rsize_2_i;var $v_3_lcssa_i=$v_2_i;label=96;break;}else{var $t_228_i=$t_2_ph_i;var $rsize_329_i=$rsize_2_i;var $v_330_i=$v_2_i;label=94;break;}
 case 94: 
 var $v_330_i;
 var $rsize_329_i;
 var $t_228_i;
 var $446=(($t_228_i+4)|0);
 var $447=HEAP32[(($446)>>2)];
 var $448=$447&-8;
 var $449=((($448)-($349))|0);
 var $450=($449>>>0)<($rsize_329_i>>>0);
 var $_rsize_3_i=($450?$449:$rsize_329_i);
 var $t_2_v_3_i=($450?$t_228_i:$v_330_i);
 var $451=(($t_228_i+16)|0);
 var $452=HEAP32[(($451)>>2)];
 var $453=($452|0)==0;
 if($453){label=95;break;}else{var $t_228_i=$452;var $rsize_329_i=$_rsize_3_i;var $v_330_i=$t_2_v_3_i;label=94;break;}
 case 95: 
 var $454=(($t_228_i+20)|0);
 var $455=HEAP32[(($454)>>2)];
 var $456=($455|0)==0;
 if($456){var $rsize_3_lcssa_i=$_rsize_3_i;var $v_3_lcssa_i=$t_2_v_3_i;label=96;break;}else{var $t_228_i=$455;var $rsize_329_i=$_rsize_3_i;var $v_330_i=$t_2_v_3_i;label=94;break;}
 case 96: 
 var $v_3_lcssa_i;
 var $rsize_3_lcssa_i;
 var $457=($v_3_lcssa_i|0)==0;
 if($457){var $nb_0=$349;label=160;break;}else{label=97;break;}
 case 97: 
 var $459=HEAP32[((36088)>>2)];
 var $460=((($459)-($349))|0);
 var $461=($rsize_3_lcssa_i>>>0)<($460>>>0);
 if($461){label=98;break;}else{var $nb_0=$349;label=160;break;}
 case 98: 
 var $463=$v_3_lcssa_i;
 var $464=HEAP32[((36096)>>2)];
 var $465=($463>>>0)<($464>>>0);
 if($465){label=158;break;}else{label=99;break;}
 case 99: 
 var $467=(($463+$349)|0);
 var $468=$467;
 var $469=($463>>>0)<($467>>>0);
 if($469){label=100;break;}else{label=158;break;}
 case 100: 
 var $471=(($v_3_lcssa_i+24)|0);
 var $472=HEAP32[(($471)>>2)];
 var $473=(($v_3_lcssa_i+12)|0);
 var $474=HEAP32[(($473)>>2)];
 var $475=($474|0)==($v_3_lcssa_i|0);
 if($475){label=106;break;}else{label=101;break;}
 case 101: 
 var $477=(($v_3_lcssa_i+8)|0);
 var $478=HEAP32[(($477)>>2)];
 var $479=$478;
 var $480=($479>>>0)<($464>>>0);
 if($480){label=105;break;}else{label=102;break;}
 case 102: 
 var $482=(($478+12)|0);
 var $483=HEAP32[(($482)>>2)];
 var $484=($483|0)==($v_3_lcssa_i|0);
 if($484){label=103;break;}else{label=105;break;}
 case 103: 
 var $486=(($474+8)|0);
 var $487=HEAP32[(($486)>>2)];
 var $488=($487|0)==($v_3_lcssa_i|0);
 if($488){label=104;break;}else{label=105;break;}
 case 104: 
 HEAP32[(($482)>>2)]=$474;
 HEAP32[(($486)>>2)]=$478;
 var $R_1_i122=$474;label=113;break;
 case 105: 
 _abort();
 throw "Reached an unreachable!";
 case 106: 
 var $491=(($v_3_lcssa_i+20)|0);
 var $492=HEAP32[(($491)>>2)];
 var $493=($492|0)==0;
 if($493){label=107;break;}else{var $R_0_i120=$492;var $RP_0_i119=$491;label=108;break;}
 case 107: 
 var $495=(($v_3_lcssa_i+16)|0);
 var $496=HEAP32[(($495)>>2)];
 var $497=($496|0)==0;
 if($497){var $R_1_i122=0;label=113;break;}else{var $R_0_i120=$496;var $RP_0_i119=$495;label=108;break;}
 case 108: 
 var $RP_0_i119;
 var $R_0_i120;
 var $498=(($R_0_i120+20)|0);
 var $499=HEAP32[(($498)>>2)];
 var $500=($499|0)==0;
 if($500){label=109;break;}else{var $R_0_i120=$499;var $RP_0_i119=$498;label=108;break;}
 case 109: 
 var $502=(($R_0_i120+16)|0);
 var $503=HEAP32[(($502)>>2)];
 var $504=($503|0)==0;
 if($504){label=110;break;}else{var $R_0_i120=$503;var $RP_0_i119=$502;label=108;break;}
 case 110: 
 var $506=$RP_0_i119;
 var $507=($506>>>0)<($464>>>0);
 if($507){label=112;break;}else{label=111;break;}
 case 111: 
 HEAP32[(($RP_0_i119)>>2)]=0;
 var $R_1_i122=$R_0_i120;label=113;break;
 case 112: 
 _abort();
 throw "Reached an unreachable!";
 case 113: 
 var $R_1_i122;
 var $511=($472|0)==0;
 if($511){label=133;break;}else{label=114;break;}
 case 114: 
 var $513=(($v_3_lcssa_i+28)|0);
 var $514=HEAP32[(($513)>>2)];
 var $515=((36384+($514<<2))|0);
 var $516=HEAP32[(($515)>>2)];
 var $517=($v_3_lcssa_i|0)==($516|0);
 if($517){label=115;break;}else{label=117;break;}
 case 115: 
 HEAP32[(($515)>>2)]=$R_1_i122;
 var $cond_i123=($R_1_i122|0)==0;
 if($cond_i123){label=116;break;}else{label=123;break;}
 case 116: 
 var $519=HEAP32[(($513)>>2)];
 var $520=1<<$519;
 var $521=$520^-1;
 var $522=HEAP32[((36084)>>2)];
 var $523=$522&$521;
 HEAP32[((36084)>>2)]=$523;
 label=133;break;
 case 117: 
 var $525=$472;
 var $526=HEAP32[((36096)>>2)];
 var $527=($525>>>0)<($526>>>0);
 if($527){label=121;break;}else{label=118;break;}
 case 118: 
 var $529=(($472+16)|0);
 var $530=HEAP32[(($529)>>2)];
 var $531=($530|0)==($v_3_lcssa_i|0);
 if($531){label=119;break;}else{label=120;break;}
 case 119: 
 HEAP32[(($529)>>2)]=$R_1_i122;
 label=122;break;
 case 120: 
 var $534=(($472+20)|0);
 HEAP32[(($534)>>2)]=$R_1_i122;
 label=122;break;
 case 121: 
 _abort();
 throw "Reached an unreachable!";
 case 122: 
 var $537=($R_1_i122|0)==0;
 if($537){label=133;break;}else{label=123;break;}
 case 123: 
 var $539=$R_1_i122;
 var $540=HEAP32[((36096)>>2)];
 var $541=($539>>>0)<($540>>>0);
 if($541){label=132;break;}else{label=124;break;}
 case 124: 
 var $543=(($R_1_i122+24)|0);
 HEAP32[(($543)>>2)]=$472;
 var $544=(($v_3_lcssa_i+16)|0);
 var $545=HEAP32[(($544)>>2)];
 var $546=($545|0)==0;
 if($546){label=128;break;}else{label=125;break;}
 case 125: 
 var $548=$545;
 var $549=HEAP32[((36096)>>2)];
 var $550=($548>>>0)<($549>>>0);
 if($550){label=127;break;}else{label=126;break;}
 case 126: 
 var $552=(($R_1_i122+16)|0);
 HEAP32[(($552)>>2)]=$545;
 var $553=(($545+24)|0);
 HEAP32[(($553)>>2)]=$R_1_i122;
 label=128;break;
 case 127: 
 _abort();
 throw "Reached an unreachable!";
 case 128: 
 var $556=(($v_3_lcssa_i+20)|0);
 var $557=HEAP32[(($556)>>2)];
 var $558=($557|0)==0;
 if($558){label=133;break;}else{label=129;break;}
 case 129: 
 var $560=$557;
 var $561=HEAP32[((36096)>>2)];
 var $562=($560>>>0)<($561>>>0);
 if($562){label=131;break;}else{label=130;break;}
 case 130: 
 var $564=(($R_1_i122+20)|0);
 HEAP32[(($564)>>2)]=$557;
 var $565=(($557+24)|0);
 HEAP32[(($565)>>2)]=$R_1_i122;
 label=133;break;
 case 131: 
 _abort();
 throw "Reached an unreachable!";
 case 132: 
 _abort();
 throw "Reached an unreachable!";
 case 133: 
 var $569=($rsize_3_lcssa_i>>>0)<16;
 if($569){label=134;break;}else{label=135;break;}
 case 134: 
 var $571=((($rsize_3_lcssa_i)+($349))|0);
 var $572=$571|3;
 var $573=(($v_3_lcssa_i+4)|0);
 HEAP32[(($573)>>2)]=$572;
 var $_sum19_i=((($571)+(4))|0);
 var $574=(($463+$_sum19_i)|0);
 var $575=$574;
 var $576=HEAP32[(($575)>>2)];
 var $577=$576|1;
 HEAP32[(($575)>>2)]=$577;
 label=159;break;
 case 135: 
 var $579=$349|3;
 var $580=(($v_3_lcssa_i+4)|0);
 HEAP32[(($580)>>2)]=$579;
 var $581=$rsize_3_lcssa_i|1;
 var $_sum_i125136=$349|4;
 var $582=(($463+$_sum_i125136)|0);
 var $583=$582;
 HEAP32[(($583)>>2)]=$581;
 var $_sum1_i126=((($rsize_3_lcssa_i)+($349))|0);
 var $584=(($463+$_sum1_i126)|0);
 var $585=$584;
 HEAP32[(($585)>>2)]=$rsize_3_lcssa_i;
 var $586=$rsize_3_lcssa_i>>>3;
 var $587=($rsize_3_lcssa_i>>>0)<256;
 if($587){label=136;break;}else{label=141;break;}
 case 136: 
 var $589=$586<<1;
 var $590=((36120+($589<<2))|0);
 var $591=$590;
 var $592=HEAP32[((36080)>>2)];
 var $593=1<<$586;
 var $594=$592&$593;
 var $595=($594|0)==0;
 if($595){label=137;break;}else{label=138;break;}
 case 137: 
 var $597=$592|$593;
 HEAP32[((36080)>>2)]=$597;
 var $_sum15_pre_i=((($589)+(2))|0);
 var $_pre_i127=((36120+($_sum15_pre_i<<2))|0);
 var $F5_0_i=$591;var $_pre_phi_i128=$_pre_i127;label=140;break;
 case 138: 
 var $_sum18_i=((($589)+(2))|0);
 var $599=((36120+($_sum18_i<<2))|0);
 var $600=HEAP32[(($599)>>2)];
 var $601=$600;
 var $602=HEAP32[((36096)>>2)];
 var $603=($601>>>0)<($602>>>0);
 if($603){label=139;break;}else{var $F5_0_i=$600;var $_pre_phi_i128=$599;label=140;break;}
 case 139: 
 _abort();
 throw "Reached an unreachable!";
 case 140: 
 var $_pre_phi_i128;
 var $F5_0_i;
 HEAP32[(($_pre_phi_i128)>>2)]=$468;
 var $606=(($F5_0_i+12)|0);
 HEAP32[(($606)>>2)]=$468;
 var $_sum16_i=((($349)+(8))|0);
 var $607=(($463+$_sum16_i)|0);
 var $608=$607;
 HEAP32[(($608)>>2)]=$F5_0_i;
 var $_sum17_i=((($349)+(12))|0);
 var $609=(($463+$_sum17_i)|0);
 var $610=$609;
 HEAP32[(($610)>>2)]=$591;
 label=159;break;
 case 141: 
 var $612=$467;
 var $613=$rsize_3_lcssa_i>>>8;
 var $614=($613|0)==0;
 if($614){var $I7_0_i=0;label=144;break;}else{label=142;break;}
 case 142: 
 var $616=($rsize_3_lcssa_i>>>0)>16777215;
 if($616){var $I7_0_i=31;label=144;break;}else{label=143;break;}
 case 143: 
 var $618=((($613)+(1048320))|0);
 var $619=$618>>>16;
 var $620=$619&8;
 var $621=$613<<$620;
 var $622=((($621)+(520192))|0);
 var $623=$622>>>16;
 var $624=$623&4;
 var $625=$624|$620;
 var $626=$621<<$624;
 var $627=((($626)+(245760))|0);
 var $628=$627>>>16;
 var $629=$628&2;
 var $630=$625|$629;
 var $631=(((14)-($630))|0);
 var $632=$626<<$629;
 var $633=$632>>>15;
 var $634=((($631)+($633))|0);
 var $635=$634<<1;
 var $636=((($634)+(7))|0);
 var $637=$rsize_3_lcssa_i>>>($636>>>0);
 var $638=$637&1;
 var $639=$638|$635;
 var $I7_0_i=$639;label=144;break;
 case 144: 
 var $I7_0_i;
 var $641=((36384+($I7_0_i<<2))|0);
 var $_sum2_i=((($349)+(28))|0);
 var $642=(($463+$_sum2_i)|0);
 var $643=$642;
 HEAP32[(($643)>>2)]=$I7_0_i;
 var $_sum3_i129=((($349)+(16))|0);
 var $644=(($463+$_sum3_i129)|0);
 var $_sum4_i130=((($349)+(20))|0);
 var $645=(($463+$_sum4_i130)|0);
 var $646=$645;
 HEAP32[(($646)>>2)]=0;
 var $647=$644;
 HEAP32[(($647)>>2)]=0;
 var $648=HEAP32[((36084)>>2)];
 var $649=1<<$I7_0_i;
 var $650=$648&$649;
 var $651=($650|0)==0;
 if($651){label=145;break;}else{label=146;break;}
 case 145: 
 var $653=$648|$649;
 HEAP32[((36084)>>2)]=$653;
 HEAP32[(($641)>>2)]=$612;
 var $654=$641;
 var $_sum5_i=((($349)+(24))|0);
 var $655=(($463+$_sum5_i)|0);
 var $656=$655;
 HEAP32[(($656)>>2)]=$654;
 var $_sum6_i=((($349)+(12))|0);
 var $657=(($463+$_sum6_i)|0);
 var $658=$657;
 HEAP32[(($658)>>2)]=$612;
 var $_sum7_i=((($349)+(8))|0);
 var $659=(($463+$_sum7_i)|0);
 var $660=$659;
 HEAP32[(($660)>>2)]=$612;
 label=159;break;
 case 146: 
 var $662=HEAP32[(($641)>>2)];
 var $663=($I7_0_i|0)==31;
 if($663){var $668=0;label=148;break;}else{label=147;break;}
 case 147: 
 var $665=$I7_0_i>>>1;
 var $666=(((25)-($665))|0);
 var $668=$666;label=148;break;
 case 148: 
 var $668;
 var $669=$rsize_3_lcssa_i<<$668;
 var $K12_0_i=$669;var $T_0_i=$662;label=149;break;
 case 149: 
 var $T_0_i;
 var $K12_0_i;
 var $671=(($T_0_i+4)|0);
 var $672=HEAP32[(($671)>>2)];
 var $673=$672&-8;
 var $674=($673|0)==($rsize_3_lcssa_i|0);
 if($674){label=154;break;}else{label=150;break;}
 case 150: 
 var $676=$K12_0_i>>>31;
 var $677=(($T_0_i+16+($676<<2))|0);
 var $678=HEAP32[(($677)>>2)];
 var $679=($678|0)==0;
 var $680=$K12_0_i<<1;
 if($679){label=151;break;}else{var $K12_0_i=$680;var $T_0_i=$678;label=149;break;}
 case 151: 
 var $682=$677;
 var $683=HEAP32[((36096)>>2)];
 var $684=($682>>>0)<($683>>>0);
 if($684){label=153;break;}else{label=152;break;}
 case 152: 
 HEAP32[(($677)>>2)]=$612;
 var $_sum12_i=((($349)+(24))|0);
 var $686=(($463+$_sum12_i)|0);
 var $687=$686;
 HEAP32[(($687)>>2)]=$T_0_i;
 var $_sum13_i=((($349)+(12))|0);
 var $688=(($463+$_sum13_i)|0);
 var $689=$688;
 HEAP32[(($689)>>2)]=$612;
 var $_sum14_i=((($349)+(8))|0);
 var $690=(($463+$_sum14_i)|0);
 var $691=$690;
 HEAP32[(($691)>>2)]=$612;
 label=159;break;
 case 153: 
 _abort();
 throw "Reached an unreachable!";
 case 154: 
 var $694=(($T_0_i+8)|0);
 var $695=HEAP32[(($694)>>2)];
 var $696=$T_0_i;
 var $697=HEAP32[((36096)>>2)];
 var $698=($696>>>0)<($697>>>0);
 if($698){label=157;break;}else{label=155;break;}
 case 155: 
 var $700=$695;
 var $701=($700>>>0)<($697>>>0);
 if($701){label=157;break;}else{label=156;break;}
 case 156: 
 var $703=(($695+12)|0);
 HEAP32[(($703)>>2)]=$612;
 HEAP32[(($694)>>2)]=$612;
 var $_sum9_i=((($349)+(8))|0);
 var $704=(($463+$_sum9_i)|0);
 var $705=$704;
 HEAP32[(($705)>>2)]=$695;
 var $_sum10_i=((($349)+(12))|0);
 var $706=(($463+$_sum10_i)|0);
 var $707=$706;
 HEAP32[(($707)>>2)]=$T_0_i;
 var $_sum11_i=((($349)+(24))|0);
 var $708=(($463+$_sum11_i)|0);
 var $709=$708;
 HEAP32[(($709)>>2)]=0;
 label=159;break;
 case 157: 
 _abort();
 throw "Reached an unreachable!";
 case 158: 
 _abort();
 throw "Reached an unreachable!";
 case 159: 
 var $711=(($v_3_lcssa_i+8)|0);
 var $712=$711;
 var $713=($711|0)==0;
 if($713){var $nb_0=$349;label=160;break;}else{var $mem_0=$712;label=341;break;}
 case 160: 
 var $nb_0;
 var $714=HEAP32[((36088)>>2)];
 var $715=($nb_0>>>0)>($714>>>0);
 if($715){label=165;break;}else{label=161;break;}
 case 161: 
 var $717=((($714)-($nb_0))|0);
 var $718=HEAP32[((36100)>>2)];
 var $719=($717>>>0)>15;
 if($719){label=162;break;}else{label=163;break;}
 case 162: 
 var $721=$718;
 var $722=(($721+$nb_0)|0);
 var $723=$722;
 HEAP32[((36100)>>2)]=$723;
 HEAP32[((36088)>>2)]=$717;
 var $724=$717|1;
 var $_sum102=((($nb_0)+(4))|0);
 var $725=(($721+$_sum102)|0);
 var $726=$725;
 HEAP32[(($726)>>2)]=$724;
 var $727=(($721+$714)|0);
 var $728=$727;
 HEAP32[(($728)>>2)]=$717;
 var $729=$nb_0|3;
 var $730=(($718+4)|0);
 HEAP32[(($730)>>2)]=$729;
 label=164;break;
 case 163: 
 HEAP32[((36088)>>2)]=0;
 HEAP32[((36100)>>2)]=0;
 var $732=$714|3;
 var $733=(($718+4)|0);
 HEAP32[(($733)>>2)]=$732;
 var $734=$718;
 var $_sum101=((($714)+(4))|0);
 var $735=(($734+$_sum101)|0);
 var $736=$735;
 var $737=HEAP32[(($736)>>2)];
 var $738=$737|1;
 HEAP32[(($736)>>2)]=$738;
 label=164;break;
 case 164: 
 var $740=(($718+8)|0);
 var $741=$740;
 var $mem_0=$741;label=341;break;
 case 165: 
 var $743=HEAP32[((36092)>>2)];
 var $744=($nb_0>>>0)<($743>>>0);
 if($744){label=166;break;}else{label=167;break;}
 case 166: 
 var $746=((($743)-($nb_0))|0);
 HEAP32[((36092)>>2)]=$746;
 var $747=HEAP32[((36104)>>2)];
 var $748=$747;
 var $749=(($748+$nb_0)|0);
 var $750=$749;
 HEAP32[((36104)>>2)]=$750;
 var $751=$746|1;
 var $_sum=((($nb_0)+(4))|0);
 var $752=(($748+$_sum)|0);
 var $753=$752;
 HEAP32[(($753)>>2)]=$751;
 var $754=$nb_0|3;
 var $755=(($747+4)|0);
 HEAP32[(($755)>>2)]=$754;
 var $756=(($747+8)|0);
 var $757=$756;
 var $mem_0=$757;label=341;break;
 case 167: 
 var $759=HEAP32[((9128)>>2)];
 var $760=($759|0)==0;
 if($760){label=168;break;}else{label=171;break;}
 case 168: 
 var $762=_sysconf(30);
 var $763=((($762)-(1))|0);
 var $764=$763&$762;
 var $765=($764|0)==0;
 if($765){label=170;break;}else{label=169;break;}
 case 169: 
 _abort();
 throw "Reached an unreachable!";
 case 170: 
 HEAP32[((9136)>>2)]=$762;
 HEAP32[((9132)>>2)]=$762;
 HEAP32[((9140)>>2)]=-1;
 HEAP32[((9144)>>2)]=-1;
 HEAP32[((9148)>>2)]=0;
 HEAP32[((36524)>>2)]=0;
 var $767=_time(0);
 var $768=$767&-16;
 var $769=$768^1431655768;
 HEAP32[((9128)>>2)]=$769;
 label=171;break;
 case 171: 
 var $771=((($nb_0)+(48))|0);
 var $772=HEAP32[((9136)>>2)];
 var $773=((($nb_0)+(47))|0);
 var $774=((($772)+($773))|0);
 var $775=(((-$772))|0);
 var $776=$774&$775;
 var $777=($776>>>0)>($nb_0>>>0);
 if($777){label=172;break;}else{var $mem_0=0;label=341;break;}
 case 172: 
 var $779=HEAP32[((36520)>>2)];
 var $780=($779|0)==0;
 if($780){label=174;break;}else{label=173;break;}
 case 173: 
 var $782=HEAP32[((36512)>>2)];
 var $783=((($782)+($776))|0);
 var $784=($783>>>0)<=($782>>>0);
 var $785=($783>>>0)>($779>>>0);
 var $or_cond1_i=$784|$785;
 if($or_cond1_i){var $mem_0=0;label=341;break;}else{label=174;break;}
 case 174: 
 var $787=HEAP32[((36524)>>2)];
 var $788=$787&4;
 var $789=($788|0)==0;
 if($789){label=175;break;}else{var $tsize_1_i=0;label=198;break;}
 case 175: 
 var $791=HEAP32[((36104)>>2)];
 var $792=($791|0)==0;
 if($792){label=181;break;}else{label=176;break;}
 case 176: 
 var $794=$791;
 var $sp_0_i_i=36528;label=177;break;
 case 177: 
 var $sp_0_i_i;
 var $796=(($sp_0_i_i)|0);
 var $797=HEAP32[(($796)>>2)];
 var $798=($797>>>0)>($794>>>0);
 if($798){label=179;break;}else{label=178;break;}
 case 178: 
 var $800=(($sp_0_i_i+4)|0);
 var $801=HEAP32[(($800)>>2)];
 var $802=(($797+$801)|0);
 var $803=($802>>>0)>($794>>>0);
 if($803){label=180;break;}else{label=179;break;}
 case 179: 
 var $805=(($sp_0_i_i+8)|0);
 var $806=HEAP32[(($805)>>2)];
 var $807=($806|0)==0;
 if($807){label=181;break;}else{var $sp_0_i_i=$806;label=177;break;}
 case 180: 
 var $808=($sp_0_i_i|0)==0;
 if($808){label=181;break;}else{label=188;break;}
 case 181: 
 var $809=_sbrk(0);
 var $810=($809|0)==-1;
 if($810){var $tsize_0303639_i=0;label=197;break;}else{label=182;break;}
 case 182: 
 var $812=$809;
 var $813=HEAP32[((9132)>>2)];
 var $814=((($813)-(1))|0);
 var $815=$814&$812;
 var $816=($815|0)==0;
 if($816){var $ssize_0_i=$776;label=184;break;}else{label=183;break;}
 case 183: 
 var $818=((($814)+($812))|0);
 var $819=(((-$813))|0);
 var $820=$818&$819;
 var $821=((($776)-($812))|0);
 var $822=((($821)+($820))|0);
 var $ssize_0_i=$822;label=184;break;
 case 184: 
 var $ssize_0_i;
 var $824=HEAP32[((36512)>>2)];
 var $825=((($824)+($ssize_0_i))|0);
 var $826=($ssize_0_i>>>0)>($nb_0>>>0);
 var $827=($ssize_0_i>>>0)<2147483647;
 var $or_cond_i131=$826&$827;
 if($or_cond_i131){label=185;break;}else{var $tsize_0303639_i=0;label=197;break;}
 case 185: 
 var $829=HEAP32[((36520)>>2)];
 var $830=($829|0)==0;
 if($830){label=187;break;}else{label=186;break;}
 case 186: 
 var $832=($825>>>0)<=($824>>>0);
 var $833=($825>>>0)>($829>>>0);
 var $or_cond2_i=$832|$833;
 if($or_cond2_i){var $tsize_0303639_i=0;label=197;break;}else{label=187;break;}
 case 187: 
 var $835=_sbrk($ssize_0_i);
 var $836=($835|0)==($809|0);
 var $ssize_0__i=($836?$ssize_0_i:0);
 var $__i=($836?$809:-1);
 var $tbase_0_i=$__i;var $tsize_0_i=$ssize_0__i;var $br_0_i=$835;var $ssize_1_i=$ssize_0_i;label=190;break;
 case 188: 
 var $838=HEAP32[((36092)>>2)];
 var $839=((($774)-($838))|0);
 var $840=$839&$775;
 var $841=($840>>>0)<2147483647;
 if($841){label=189;break;}else{var $tsize_0303639_i=0;label=197;break;}
 case 189: 
 var $843=_sbrk($840);
 var $844=HEAP32[(($796)>>2)];
 var $845=HEAP32[(($800)>>2)];
 var $846=(($844+$845)|0);
 var $847=($843|0)==($846|0);
 var $_3_i=($847?$840:0);
 var $_4_i=($847?$843:-1);
 var $tbase_0_i=$_4_i;var $tsize_0_i=$_3_i;var $br_0_i=$843;var $ssize_1_i=$840;label=190;break;
 case 190: 
 var $ssize_1_i;
 var $br_0_i;
 var $tsize_0_i;
 var $tbase_0_i;
 var $849=(((-$ssize_1_i))|0);
 var $850=($tbase_0_i|0)==-1;
 if($850){label=191;break;}else{var $tsize_244_i=$tsize_0_i;var $tbase_245_i=$tbase_0_i;label=201;break;}
 case 191: 
 var $852=($br_0_i|0)!=-1;
 var $853=($ssize_1_i>>>0)<2147483647;
 var $or_cond5_i=$852&$853;
 var $854=($ssize_1_i>>>0)<($771>>>0);
 var $or_cond6_i=$or_cond5_i&$854;
 if($or_cond6_i){label=192;break;}else{var $ssize_2_i=$ssize_1_i;label=196;break;}
 case 192: 
 var $856=HEAP32[((9136)>>2)];
 var $857=((($773)-($ssize_1_i))|0);
 var $858=((($857)+($856))|0);
 var $859=(((-$856))|0);
 var $860=$858&$859;
 var $861=($860>>>0)<2147483647;
 if($861){label=193;break;}else{var $ssize_2_i=$ssize_1_i;label=196;break;}
 case 193: 
 var $863=_sbrk($860);
 var $864=($863|0)==-1;
 if($864){label=195;break;}else{label=194;break;}
 case 194: 
 var $866=((($860)+($ssize_1_i))|0);
 var $ssize_2_i=$866;label=196;break;
 case 195: 
 var $868=_sbrk($849);
 var $tsize_0303639_i=$tsize_0_i;label=197;break;
 case 196: 
 var $ssize_2_i;
 var $870=($br_0_i|0)==-1;
 if($870){var $tsize_0303639_i=$tsize_0_i;label=197;break;}else{var $tsize_244_i=$ssize_2_i;var $tbase_245_i=$br_0_i;label=201;break;}
 case 197: 
 var $tsize_0303639_i;
 var $871=HEAP32[((36524)>>2)];
 var $872=$871|4;
 HEAP32[((36524)>>2)]=$872;
 var $tsize_1_i=$tsize_0303639_i;label=198;break;
 case 198: 
 var $tsize_1_i;
 var $874=($776>>>0)<2147483647;
 if($874){label=199;break;}else{label=340;break;}
 case 199: 
 var $876=_sbrk($776);
 var $877=_sbrk(0);
 var $notlhs_i=($876|0)!=-1;
 var $notrhs_i=($877|0)!=-1;
 var $or_cond8_not_i=$notrhs_i&$notlhs_i;
 var $878=($876>>>0)<($877>>>0);
 var $or_cond9_i=$or_cond8_not_i&$878;
 if($or_cond9_i){label=200;break;}else{label=340;break;}
 case 200: 
 var $879=$877;
 var $880=$876;
 var $881=((($879)-($880))|0);
 var $882=((($nb_0)+(40))|0);
 var $883=($881>>>0)>($882>>>0);
 var $_tsize_1_i=($883?$881:$tsize_1_i);
 var $_tbase_1_i=($883?$876:-1);
 var $884=($_tbase_1_i|0)==-1;
 if($884){label=340;break;}else{var $tsize_244_i=$_tsize_1_i;var $tbase_245_i=$_tbase_1_i;label=201;break;}
 case 201: 
 var $tbase_245_i;
 var $tsize_244_i;
 var $885=HEAP32[((36512)>>2)];
 var $886=((($885)+($tsize_244_i))|0);
 HEAP32[((36512)>>2)]=$886;
 var $887=HEAP32[((36516)>>2)];
 var $888=($886>>>0)>($887>>>0);
 if($888){label=202;break;}else{label=203;break;}
 case 202: 
 HEAP32[((36516)>>2)]=$886;
 label=203;break;
 case 203: 
 var $890=HEAP32[((36104)>>2)];
 var $891=($890|0)==0;
 if($891){label=204;break;}else{var $sp_067_i=36528;label=211;break;}
 case 204: 
 var $893=HEAP32[((36096)>>2)];
 var $894=($893|0)==0;
 var $895=($tbase_245_i>>>0)<($893>>>0);
 var $or_cond10_i=$894|$895;
 if($or_cond10_i){label=205;break;}else{label=206;break;}
 case 205: 
 HEAP32[((36096)>>2)]=$tbase_245_i;
 label=206;break;
 case 206: 
 HEAP32[((36528)>>2)]=$tbase_245_i;
 HEAP32[((36532)>>2)]=$tsize_244_i;
 HEAP32[((36540)>>2)]=0;
 var $897=HEAP32[((9128)>>2)];
 HEAP32[((36116)>>2)]=$897;
 HEAP32[((36112)>>2)]=-1;
 var $i_02_i_i=0;label=207;break;
 case 207: 
 var $i_02_i_i;
 var $899=$i_02_i_i<<1;
 var $900=((36120+($899<<2))|0);
 var $901=$900;
 var $_sum_i_i=((($899)+(3))|0);
 var $902=((36120+($_sum_i_i<<2))|0);
 HEAP32[(($902)>>2)]=$901;
 var $_sum1_i_i=((($899)+(2))|0);
 var $903=((36120+($_sum1_i_i<<2))|0);
 HEAP32[(($903)>>2)]=$901;
 var $904=((($i_02_i_i)+(1))|0);
 var $905=($904>>>0)<32;
 if($905){var $i_02_i_i=$904;label=207;break;}else{label=208;break;}
 case 208: 
 var $906=((($tsize_244_i)-(40))|0);
 var $907=(($tbase_245_i+8)|0);
 var $908=$907;
 var $909=$908&7;
 var $910=($909|0)==0;
 if($910){var $914=0;label=210;break;}else{label=209;break;}
 case 209: 
 var $912=(((-$908))|0);
 var $913=$912&7;
 var $914=$913;label=210;break;
 case 210: 
 var $914;
 var $915=(($tbase_245_i+$914)|0);
 var $916=$915;
 var $917=((($906)-($914))|0);
 HEAP32[((36104)>>2)]=$916;
 HEAP32[((36092)>>2)]=$917;
 var $918=$917|1;
 var $_sum_i14_i=((($914)+(4))|0);
 var $919=(($tbase_245_i+$_sum_i14_i)|0);
 var $920=$919;
 HEAP32[(($920)>>2)]=$918;
 var $_sum2_i_i=((($tsize_244_i)-(36))|0);
 var $921=(($tbase_245_i+$_sum2_i_i)|0);
 var $922=$921;
 HEAP32[(($922)>>2)]=40;
 var $923=HEAP32[((9144)>>2)];
 HEAP32[((36108)>>2)]=$923;
 label=338;break;
 case 211: 
 var $sp_067_i;
 var $924=(($sp_067_i)|0);
 var $925=HEAP32[(($924)>>2)];
 var $926=(($sp_067_i+4)|0);
 var $927=HEAP32[(($926)>>2)];
 var $928=(($925+$927)|0);
 var $929=($tbase_245_i|0)==($928|0);
 if($929){label=213;break;}else{label=212;break;}
 case 212: 
 var $931=(($sp_067_i+8)|0);
 var $932=HEAP32[(($931)>>2)];
 var $933=($932|0)==0;
 if($933){label=218;break;}else{var $sp_067_i=$932;label=211;break;}
 case 213: 
 var $934=(($sp_067_i+12)|0);
 var $935=HEAP32[(($934)>>2)];
 var $936=$935&8;
 var $937=($936|0)==0;
 if($937){label=214;break;}else{label=218;break;}
 case 214: 
 var $939=$890;
 var $940=($939>>>0)>=($925>>>0);
 var $941=($939>>>0)<($tbase_245_i>>>0);
 var $or_cond47_i=$940&$941;
 if($or_cond47_i){label=215;break;}else{label=218;break;}
 case 215: 
 var $943=((($927)+($tsize_244_i))|0);
 HEAP32[(($926)>>2)]=$943;
 var $944=HEAP32[((36104)>>2)];
 var $945=HEAP32[((36092)>>2)];
 var $946=((($945)+($tsize_244_i))|0);
 var $947=$944;
 var $948=(($944+8)|0);
 var $949=$948;
 var $950=$949&7;
 var $951=($950|0)==0;
 if($951){var $955=0;label=217;break;}else{label=216;break;}
 case 216: 
 var $953=(((-$949))|0);
 var $954=$953&7;
 var $955=$954;label=217;break;
 case 217: 
 var $955;
 var $956=(($947+$955)|0);
 var $957=$956;
 var $958=((($946)-($955))|0);
 HEAP32[((36104)>>2)]=$957;
 HEAP32[((36092)>>2)]=$958;
 var $959=$958|1;
 var $_sum_i18_i=((($955)+(4))|0);
 var $960=(($947+$_sum_i18_i)|0);
 var $961=$960;
 HEAP32[(($961)>>2)]=$959;
 var $_sum2_i19_i=((($946)+(4))|0);
 var $962=(($947+$_sum2_i19_i)|0);
 var $963=$962;
 HEAP32[(($963)>>2)]=40;
 var $964=HEAP32[((9144)>>2)];
 HEAP32[((36108)>>2)]=$964;
 label=338;break;
 case 218: 
 var $965=HEAP32[((36096)>>2)];
 var $966=($tbase_245_i>>>0)<($965>>>0);
 if($966){label=219;break;}else{label=220;break;}
 case 219: 
 HEAP32[((36096)>>2)]=$tbase_245_i;
 label=220;break;
 case 220: 
 var $968=(($tbase_245_i+$tsize_244_i)|0);
 var $sp_160_i=36528;label=221;break;
 case 221: 
 var $sp_160_i;
 var $970=(($sp_160_i)|0);
 var $971=HEAP32[(($970)>>2)];
 var $972=($971|0)==($968|0);
 if($972){label=223;break;}else{label=222;break;}
 case 222: 
 var $974=(($sp_160_i+8)|0);
 var $975=HEAP32[(($974)>>2)];
 var $976=($975|0)==0;
 if($976){label=304;break;}else{var $sp_160_i=$975;label=221;break;}
 case 223: 
 var $977=(($sp_160_i+12)|0);
 var $978=HEAP32[(($977)>>2)];
 var $979=$978&8;
 var $980=($979|0)==0;
 if($980){label=224;break;}else{label=304;break;}
 case 224: 
 HEAP32[(($970)>>2)]=$tbase_245_i;
 var $982=(($sp_160_i+4)|0);
 var $983=HEAP32[(($982)>>2)];
 var $984=((($983)+($tsize_244_i))|0);
 HEAP32[(($982)>>2)]=$984;
 var $985=(($tbase_245_i+8)|0);
 var $986=$985;
 var $987=$986&7;
 var $988=($987|0)==0;
 if($988){var $993=0;label=226;break;}else{label=225;break;}
 case 225: 
 var $990=(((-$986))|0);
 var $991=$990&7;
 var $993=$991;label=226;break;
 case 226: 
 var $993;
 var $994=(($tbase_245_i+$993)|0);
 var $_sum93_i=((($tsize_244_i)+(8))|0);
 var $995=(($tbase_245_i+$_sum93_i)|0);
 var $996=$995;
 var $997=$996&7;
 var $998=($997|0)==0;
 if($998){var $1003=0;label=228;break;}else{label=227;break;}
 case 227: 
 var $1000=(((-$996))|0);
 var $1001=$1000&7;
 var $1003=$1001;label=228;break;
 case 228: 
 var $1003;
 var $_sum94_i=((($1003)+($tsize_244_i))|0);
 var $1004=(($tbase_245_i+$_sum94_i)|0);
 var $1005=$1004;
 var $1006=$1004;
 var $1007=$994;
 var $1008=((($1006)-($1007))|0);
 var $_sum_i21_i=((($993)+($nb_0))|0);
 var $1009=(($tbase_245_i+$_sum_i21_i)|0);
 var $1010=$1009;
 var $1011=((($1008)-($nb_0))|0);
 var $1012=$nb_0|3;
 var $_sum1_i22_i=((($993)+(4))|0);
 var $1013=(($tbase_245_i+$_sum1_i22_i)|0);
 var $1014=$1013;
 HEAP32[(($1014)>>2)]=$1012;
 var $1015=HEAP32[((36104)>>2)];
 var $1016=($1005|0)==($1015|0);
 if($1016){label=229;break;}else{label=230;break;}
 case 229: 
 var $1018=HEAP32[((36092)>>2)];
 var $1019=((($1018)+($1011))|0);
 HEAP32[((36092)>>2)]=$1019;
 HEAP32[((36104)>>2)]=$1010;
 var $1020=$1019|1;
 var $_sum46_i_i=((($_sum_i21_i)+(4))|0);
 var $1021=(($tbase_245_i+$_sum46_i_i)|0);
 var $1022=$1021;
 HEAP32[(($1022)>>2)]=$1020;
 label=303;break;
 case 230: 
 var $1024=HEAP32[((36100)>>2)];
 var $1025=($1005|0)==($1024|0);
 if($1025){label=231;break;}else{label=232;break;}
 case 231: 
 var $1027=HEAP32[((36088)>>2)];
 var $1028=((($1027)+($1011))|0);
 HEAP32[((36088)>>2)]=$1028;
 HEAP32[((36100)>>2)]=$1010;
 var $1029=$1028|1;
 var $_sum44_i_i=((($_sum_i21_i)+(4))|0);
 var $1030=(($tbase_245_i+$_sum44_i_i)|0);
 var $1031=$1030;
 HEAP32[(($1031)>>2)]=$1029;
 var $_sum45_i_i=((($1028)+($_sum_i21_i))|0);
 var $1032=(($tbase_245_i+$_sum45_i_i)|0);
 var $1033=$1032;
 HEAP32[(($1033)>>2)]=$1028;
 label=303;break;
 case 232: 
 var $_sum2_i23_i=((($tsize_244_i)+(4))|0);
 var $_sum95_i=((($_sum2_i23_i)+($1003))|0);
 var $1035=(($tbase_245_i+$_sum95_i)|0);
 var $1036=$1035;
 var $1037=HEAP32[(($1036)>>2)];
 var $1038=$1037&3;
 var $1039=($1038|0)==1;
 if($1039){label=233;break;}else{var $oldfirst_0_i_i=$1005;var $qsize_0_i_i=$1011;label=280;break;}
 case 233: 
 var $1041=$1037&-8;
 var $1042=$1037>>>3;
 var $1043=($1037>>>0)<256;
 if($1043){label=234;break;}else{label=246;break;}
 case 234: 
 var $_sum3940_i_i=$1003|8;
 var $_sum105_i=((($_sum3940_i_i)+($tsize_244_i))|0);
 var $1045=(($tbase_245_i+$_sum105_i)|0);
 var $1046=$1045;
 var $1047=HEAP32[(($1046)>>2)];
 var $_sum41_i_i=((($tsize_244_i)+(12))|0);
 var $_sum106_i=((($_sum41_i_i)+($1003))|0);
 var $1048=(($tbase_245_i+$_sum106_i)|0);
 var $1049=$1048;
 var $1050=HEAP32[(($1049)>>2)];
 var $1051=$1042<<1;
 var $1052=((36120+($1051<<2))|0);
 var $1053=$1052;
 var $1054=($1047|0)==($1053|0);
 if($1054){label=237;break;}else{label=235;break;}
 case 235: 
 var $1056=$1047;
 var $1057=HEAP32[((36096)>>2)];
 var $1058=($1056>>>0)<($1057>>>0);
 if($1058){label=245;break;}else{label=236;break;}
 case 236: 
 var $1060=(($1047+12)|0);
 var $1061=HEAP32[(($1060)>>2)];
 var $1062=($1061|0)==($1005|0);
 if($1062){label=237;break;}else{label=245;break;}
 case 237: 
 var $1063=($1050|0)==($1047|0);
 if($1063){label=238;break;}else{label=239;break;}
 case 238: 
 var $1065=1<<$1042;
 var $1066=$1065^-1;
 var $1067=HEAP32[((36080)>>2)];
 var $1068=$1067&$1066;
 HEAP32[((36080)>>2)]=$1068;
 label=279;break;
 case 239: 
 var $1070=($1050|0)==($1053|0);
 if($1070){label=240;break;}else{label=241;break;}
 case 240: 
 var $_pre56_i_i=(($1050+8)|0);
 var $_pre_phi57_i_i=$_pre56_i_i;label=243;break;
 case 241: 
 var $1072=$1050;
 var $1073=HEAP32[((36096)>>2)];
 var $1074=($1072>>>0)<($1073>>>0);
 if($1074){label=244;break;}else{label=242;break;}
 case 242: 
 var $1076=(($1050+8)|0);
 var $1077=HEAP32[(($1076)>>2)];
 var $1078=($1077|0)==($1005|0);
 if($1078){var $_pre_phi57_i_i=$1076;label=243;break;}else{label=244;break;}
 case 243: 
 var $_pre_phi57_i_i;
 var $1079=(($1047+12)|0);
 HEAP32[(($1079)>>2)]=$1050;
 HEAP32[(($_pre_phi57_i_i)>>2)]=$1047;
 label=279;break;
 case 244: 
 _abort();
 throw "Reached an unreachable!";
 case 245: 
 _abort();
 throw "Reached an unreachable!";
 case 246: 
 var $1081=$1004;
 var $_sum34_i_i=$1003|24;
 var $_sum96_i=((($_sum34_i_i)+($tsize_244_i))|0);
 var $1082=(($tbase_245_i+$_sum96_i)|0);
 var $1083=$1082;
 var $1084=HEAP32[(($1083)>>2)];
 var $_sum5_i_i=((($tsize_244_i)+(12))|0);
 var $_sum97_i=((($_sum5_i_i)+($1003))|0);
 var $1085=(($tbase_245_i+$_sum97_i)|0);
 var $1086=$1085;
 var $1087=HEAP32[(($1086)>>2)];
 var $1088=($1087|0)==($1081|0);
 if($1088){label=252;break;}else{label=247;break;}
 case 247: 
 var $_sum3637_i_i=$1003|8;
 var $_sum98_i=((($_sum3637_i_i)+($tsize_244_i))|0);
 var $1090=(($tbase_245_i+$_sum98_i)|0);
 var $1091=$1090;
 var $1092=HEAP32[(($1091)>>2)];
 var $1093=$1092;
 var $1094=HEAP32[((36096)>>2)];
 var $1095=($1093>>>0)<($1094>>>0);
 if($1095){label=251;break;}else{label=248;break;}
 case 248: 
 var $1097=(($1092+12)|0);
 var $1098=HEAP32[(($1097)>>2)];
 var $1099=($1098|0)==($1081|0);
 if($1099){label=249;break;}else{label=251;break;}
 case 249: 
 var $1101=(($1087+8)|0);
 var $1102=HEAP32[(($1101)>>2)];
 var $1103=($1102|0)==($1081|0);
 if($1103){label=250;break;}else{label=251;break;}
 case 250: 
 HEAP32[(($1097)>>2)]=$1087;
 HEAP32[(($1101)>>2)]=$1092;
 var $R_1_i_i=$1087;label=259;break;
 case 251: 
 _abort();
 throw "Reached an unreachable!";
 case 252: 
 var $_sum67_i_i=$1003|16;
 var $_sum103_i=((($_sum2_i23_i)+($_sum67_i_i))|0);
 var $1106=(($tbase_245_i+$_sum103_i)|0);
 var $1107=$1106;
 var $1108=HEAP32[(($1107)>>2)];
 var $1109=($1108|0)==0;
 if($1109){label=253;break;}else{var $R_0_i_i=$1108;var $RP_0_i_i=$1107;label=254;break;}
 case 253: 
 var $_sum104_i=((($_sum67_i_i)+($tsize_244_i))|0);
 var $1111=(($tbase_245_i+$_sum104_i)|0);
 var $1112=$1111;
 var $1113=HEAP32[(($1112)>>2)];
 var $1114=($1113|0)==0;
 if($1114){var $R_1_i_i=0;label=259;break;}else{var $R_0_i_i=$1113;var $RP_0_i_i=$1112;label=254;break;}
 case 254: 
 var $RP_0_i_i;
 var $R_0_i_i;
 var $1115=(($R_0_i_i+20)|0);
 var $1116=HEAP32[(($1115)>>2)];
 var $1117=($1116|0)==0;
 if($1117){label=255;break;}else{var $R_0_i_i=$1116;var $RP_0_i_i=$1115;label=254;break;}
 case 255: 
 var $1119=(($R_0_i_i+16)|0);
 var $1120=HEAP32[(($1119)>>2)];
 var $1121=($1120|0)==0;
 if($1121){label=256;break;}else{var $R_0_i_i=$1120;var $RP_0_i_i=$1119;label=254;break;}
 case 256: 
 var $1123=$RP_0_i_i;
 var $1124=HEAP32[((36096)>>2)];
 var $1125=($1123>>>0)<($1124>>>0);
 if($1125){label=258;break;}else{label=257;break;}
 case 257: 
 HEAP32[(($RP_0_i_i)>>2)]=0;
 var $R_1_i_i=$R_0_i_i;label=259;break;
 case 258: 
 _abort();
 throw "Reached an unreachable!";
 case 259: 
 var $R_1_i_i;
 var $1129=($1084|0)==0;
 if($1129){label=279;break;}else{label=260;break;}
 case 260: 
 var $_sum31_i_i=((($tsize_244_i)+(28))|0);
 var $_sum99_i=((($_sum31_i_i)+($1003))|0);
 var $1131=(($tbase_245_i+$_sum99_i)|0);
 var $1132=$1131;
 var $1133=HEAP32[(($1132)>>2)];
 var $1134=((36384+($1133<<2))|0);
 var $1135=HEAP32[(($1134)>>2)];
 var $1136=($1081|0)==($1135|0);
 if($1136){label=261;break;}else{label=263;break;}
 case 261: 
 HEAP32[(($1134)>>2)]=$R_1_i_i;
 var $cond_i_i=($R_1_i_i|0)==0;
 if($cond_i_i){label=262;break;}else{label=269;break;}
 case 262: 
 var $1138=HEAP32[(($1132)>>2)];
 var $1139=1<<$1138;
 var $1140=$1139^-1;
 var $1141=HEAP32[((36084)>>2)];
 var $1142=$1141&$1140;
 HEAP32[((36084)>>2)]=$1142;
 label=279;break;
 case 263: 
 var $1144=$1084;
 var $1145=HEAP32[((36096)>>2)];
 var $1146=($1144>>>0)<($1145>>>0);
 if($1146){label=267;break;}else{label=264;break;}
 case 264: 
 var $1148=(($1084+16)|0);
 var $1149=HEAP32[(($1148)>>2)];
 var $1150=($1149|0)==($1081|0);
 if($1150){label=265;break;}else{label=266;break;}
 case 265: 
 HEAP32[(($1148)>>2)]=$R_1_i_i;
 label=268;break;
 case 266: 
 var $1153=(($1084+20)|0);
 HEAP32[(($1153)>>2)]=$R_1_i_i;
 label=268;break;
 case 267: 
 _abort();
 throw "Reached an unreachable!";
 case 268: 
 var $1156=($R_1_i_i|0)==0;
 if($1156){label=279;break;}else{label=269;break;}
 case 269: 
 var $1158=$R_1_i_i;
 var $1159=HEAP32[((36096)>>2)];
 var $1160=($1158>>>0)<($1159>>>0);
 if($1160){label=278;break;}else{label=270;break;}
 case 270: 
 var $1162=(($R_1_i_i+24)|0);
 HEAP32[(($1162)>>2)]=$1084;
 var $_sum3233_i_i=$1003|16;
 var $_sum100_i=((($_sum3233_i_i)+($tsize_244_i))|0);
 var $1163=(($tbase_245_i+$_sum100_i)|0);
 var $1164=$1163;
 var $1165=HEAP32[(($1164)>>2)];
 var $1166=($1165|0)==0;
 if($1166){label=274;break;}else{label=271;break;}
 case 271: 
 var $1168=$1165;
 var $1169=HEAP32[((36096)>>2)];
 var $1170=($1168>>>0)<($1169>>>0);
 if($1170){label=273;break;}else{label=272;break;}
 case 272: 
 var $1172=(($R_1_i_i+16)|0);
 HEAP32[(($1172)>>2)]=$1165;
 var $1173=(($1165+24)|0);
 HEAP32[(($1173)>>2)]=$R_1_i_i;
 label=274;break;
 case 273: 
 _abort();
 throw "Reached an unreachable!";
 case 274: 
 var $_sum101_i=((($_sum2_i23_i)+($_sum3233_i_i))|0);
 var $1176=(($tbase_245_i+$_sum101_i)|0);
 var $1177=$1176;
 var $1178=HEAP32[(($1177)>>2)];
 var $1179=($1178|0)==0;
 if($1179){label=279;break;}else{label=275;break;}
 case 275: 
 var $1181=$1178;
 var $1182=HEAP32[((36096)>>2)];
 var $1183=($1181>>>0)<($1182>>>0);
 if($1183){label=277;break;}else{label=276;break;}
 case 276: 
 var $1185=(($R_1_i_i+20)|0);
 HEAP32[(($1185)>>2)]=$1178;
 var $1186=(($1178+24)|0);
 HEAP32[(($1186)>>2)]=$R_1_i_i;
 label=279;break;
 case 277: 
 _abort();
 throw "Reached an unreachable!";
 case 278: 
 _abort();
 throw "Reached an unreachable!";
 case 279: 
 var $_sum9_i_i=$1041|$1003;
 var $_sum102_i=((($_sum9_i_i)+($tsize_244_i))|0);
 var $1190=(($tbase_245_i+$_sum102_i)|0);
 var $1191=$1190;
 var $1192=((($1041)+($1011))|0);
 var $oldfirst_0_i_i=$1191;var $qsize_0_i_i=$1192;label=280;break;
 case 280: 
 var $qsize_0_i_i;
 var $oldfirst_0_i_i;
 var $1194=(($oldfirst_0_i_i+4)|0);
 var $1195=HEAP32[(($1194)>>2)];
 var $1196=$1195&-2;
 HEAP32[(($1194)>>2)]=$1196;
 var $1197=$qsize_0_i_i|1;
 var $_sum10_i_i=((($_sum_i21_i)+(4))|0);
 var $1198=(($tbase_245_i+$_sum10_i_i)|0);
 var $1199=$1198;
 HEAP32[(($1199)>>2)]=$1197;
 var $_sum11_i_i=((($qsize_0_i_i)+($_sum_i21_i))|0);
 var $1200=(($tbase_245_i+$_sum11_i_i)|0);
 var $1201=$1200;
 HEAP32[(($1201)>>2)]=$qsize_0_i_i;
 var $1202=$qsize_0_i_i>>>3;
 var $1203=($qsize_0_i_i>>>0)<256;
 if($1203){label=281;break;}else{label=286;break;}
 case 281: 
 var $1205=$1202<<1;
 var $1206=((36120+($1205<<2))|0);
 var $1207=$1206;
 var $1208=HEAP32[((36080)>>2)];
 var $1209=1<<$1202;
 var $1210=$1208&$1209;
 var $1211=($1210|0)==0;
 if($1211){label=282;break;}else{label=283;break;}
 case 282: 
 var $1213=$1208|$1209;
 HEAP32[((36080)>>2)]=$1213;
 var $_sum27_pre_i_i=((($1205)+(2))|0);
 var $_pre_i24_i=((36120+($_sum27_pre_i_i<<2))|0);
 var $F4_0_i_i=$1207;var $_pre_phi_i25_i=$_pre_i24_i;label=285;break;
 case 283: 
 var $_sum30_i_i=((($1205)+(2))|0);
 var $1215=((36120+($_sum30_i_i<<2))|0);
 var $1216=HEAP32[(($1215)>>2)];
 var $1217=$1216;
 var $1218=HEAP32[((36096)>>2)];
 var $1219=($1217>>>0)<($1218>>>0);
 if($1219){label=284;break;}else{var $F4_0_i_i=$1216;var $_pre_phi_i25_i=$1215;label=285;break;}
 case 284: 
 _abort();
 throw "Reached an unreachable!";
 case 285: 
 var $_pre_phi_i25_i;
 var $F4_0_i_i;
 HEAP32[(($_pre_phi_i25_i)>>2)]=$1010;
 var $1222=(($F4_0_i_i+12)|0);
 HEAP32[(($1222)>>2)]=$1010;
 var $_sum28_i_i=((($_sum_i21_i)+(8))|0);
 var $1223=(($tbase_245_i+$_sum28_i_i)|0);
 var $1224=$1223;
 HEAP32[(($1224)>>2)]=$F4_0_i_i;
 var $_sum29_i_i=((($_sum_i21_i)+(12))|0);
 var $1225=(($tbase_245_i+$_sum29_i_i)|0);
 var $1226=$1225;
 HEAP32[(($1226)>>2)]=$1207;
 label=303;break;
 case 286: 
 var $1228=$1009;
 var $1229=$qsize_0_i_i>>>8;
 var $1230=($1229|0)==0;
 if($1230){var $I7_0_i_i=0;label=289;break;}else{label=287;break;}
 case 287: 
 var $1232=($qsize_0_i_i>>>0)>16777215;
 if($1232){var $I7_0_i_i=31;label=289;break;}else{label=288;break;}
 case 288: 
 var $1234=((($1229)+(1048320))|0);
 var $1235=$1234>>>16;
 var $1236=$1235&8;
 var $1237=$1229<<$1236;
 var $1238=((($1237)+(520192))|0);
 var $1239=$1238>>>16;
 var $1240=$1239&4;
 var $1241=$1240|$1236;
 var $1242=$1237<<$1240;
 var $1243=((($1242)+(245760))|0);
 var $1244=$1243>>>16;
 var $1245=$1244&2;
 var $1246=$1241|$1245;
 var $1247=(((14)-($1246))|0);
 var $1248=$1242<<$1245;
 var $1249=$1248>>>15;
 var $1250=((($1247)+($1249))|0);
 var $1251=$1250<<1;
 var $1252=((($1250)+(7))|0);
 var $1253=$qsize_0_i_i>>>($1252>>>0);
 var $1254=$1253&1;
 var $1255=$1254|$1251;
 var $I7_0_i_i=$1255;label=289;break;
 case 289: 
 var $I7_0_i_i;
 var $1257=((36384+($I7_0_i_i<<2))|0);
 var $_sum12_i26_i=((($_sum_i21_i)+(28))|0);
 var $1258=(($tbase_245_i+$_sum12_i26_i)|0);
 var $1259=$1258;
 HEAP32[(($1259)>>2)]=$I7_0_i_i;
 var $_sum13_i_i=((($_sum_i21_i)+(16))|0);
 var $1260=(($tbase_245_i+$_sum13_i_i)|0);
 var $_sum14_i_i=((($_sum_i21_i)+(20))|0);
 var $1261=(($tbase_245_i+$_sum14_i_i)|0);
 var $1262=$1261;
 HEAP32[(($1262)>>2)]=0;
 var $1263=$1260;
 HEAP32[(($1263)>>2)]=0;
 var $1264=HEAP32[((36084)>>2)];
 var $1265=1<<$I7_0_i_i;
 var $1266=$1264&$1265;
 var $1267=($1266|0)==0;
 if($1267){label=290;break;}else{label=291;break;}
 case 290: 
 var $1269=$1264|$1265;
 HEAP32[((36084)>>2)]=$1269;
 HEAP32[(($1257)>>2)]=$1228;
 var $1270=$1257;
 var $_sum15_i_i=((($_sum_i21_i)+(24))|0);
 var $1271=(($tbase_245_i+$_sum15_i_i)|0);
 var $1272=$1271;
 HEAP32[(($1272)>>2)]=$1270;
 var $_sum16_i_i=((($_sum_i21_i)+(12))|0);
 var $1273=(($tbase_245_i+$_sum16_i_i)|0);
 var $1274=$1273;
 HEAP32[(($1274)>>2)]=$1228;
 var $_sum17_i_i=((($_sum_i21_i)+(8))|0);
 var $1275=(($tbase_245_i+$_sum17_i_i)|0);
 var $1276=$1275;
 HEAP32[(($1276)>>2)]=$1228;
 label=303;break;
 case 291: 
 var $1278=HEAP32[(($1257)>>2)];
 var $1279=($I7_0_i_i|0)==31;
 if($1279){var $1284=0;label=293;break;}else{label=292;break;}
 case 292: 
 var $1281=$I7_0_i_i>>>1;
 var $1282=(((25)-($1281))|0);
 var $1284=$1282;label=293;break;
 case 293: 
 var $1284;
 var $1285=$qsize_0_i_i<<$1284;
 var $K8_0_i_i=$1285;var $T_0_i27_i=$1278;label=294;break;
 case 294: 
 var $T_0_i27_i;
 var $K8_0_i_i;
 var $1287=(($T_0_i27_i+4)|0);
 var $1288=HEAP32[(($1287)>>2)];
 var $1289=$1288&-8;
 var $1290=($1289|0)==($qsize_0_i_i|0);
 if($1290){label=299;break;}else{label=295;break;}
 case 295: 
 var $1292=$K8_0_i_i>>>31;
 var $1293=(($T_0_i27_i+16+($1292<<2))|0);
 var $1294=HEAP32[(($1293)>>2)];
 var $1295=($1294|0)==0;
 var $1296=$K8_0_i_i<<1;
 if($1295){label=296;break;}else{var $K8_0_i_i=$1296;var $T_0_i27_i=$1294;label=294;break;}
 case 296: 
 var $1298=$1293;
 var $1299=HEAP32[((36096)>>2)];
 var $1300=($1298>>>0)<($1299>>>0);
 if($1300){label=298;break;}else{label=297;break;}
 case 297: 
 HEAP32[(($1293)>>2)]=$1228;
 var $_sum24_i_i=((($_sum_i21_i)+(24))|0);
 var $1302=(($tbase_245_i+$_sum24_i_i)|0);
 var $1303=$1302;
 HEAP32[(($1303)>>2)]=$T_0_i27_i;
 var $_sum25_i_i=((($_sum_i21_i)+(12))|0);
 var $1304=(($tbase_245_i+$_sum25_i_i)|0);
 var $1305=$1304;
 HEAP32[(($1305)>>2)]=$1228;
 var $_sum26_i_i=((($_sum_i21_i)+(8))|0);
 var $1306=(($tbase_245_i+$_sum26_i_i)|0);
 var $1307=$1306;
 HEAP32[(($1307)>>2)]=$1228;
 label=303;break;
 case 298: 
 _abort();
 throw "Reached an unreachable!";
 case 299: 
 var $1310=(($T_0_i27_i+8)|0);
 var $1311=HEAP32[(($1310)>>2)];
 var $1312=$T_0_i27_i;
 var $1313=HEAP32[((36096)>>2)];
 var $1314=($1312>>>0)<($1313>>>0);
 if($1314){label=302;break;}else{label=300;break;}
 case 300: 
 var $1316=$1311;
 var $1317=($1316>>>0)<($1313>>>0);
 if($1317){label=302;break;}else{label=301;break;}
 case 301: 
 var $1319=(($1311+12)|0);
 HEAP32[(($1319)>>2)]=$1228;
 HEAP32[(($1310)>>2)]=$1228;
 var $_sum21_i_i=((($_sum_i21_i)+(8))|0);
 var $1320=(($tbase_245_i+$_sum21_i_i)|0);
 var $1321=$1320;
 HEAP32[(($1321)>>2)]=$1311;
 var $_sum22_i_i=((($_sum_i21_i)+(12))|0);
 var $1322=(($tbase_245_i+$_sum22_i_i)|0);
 var $1323=$1322;
 HEAP32[(($1323)>>2)]=$T_0_i27_i;
 var $_sum23_i_i=((($_sum_i21_i)+(24))|0);
 var $1324=(($tbase_245_i+$_sum23_i_i)|0);
 var $1325=$1324;
 HEAP32[(($1325)>>2)]=0;
 label=303;break;
 case 302: 
 _abort();
 throw "Reached an unreachable!";
 case 303: 
 var $_sum1819_i_i=$993|8;
 var $1326=(($tbase_245_i+$_sum1819_i_i)|0);
 var $mem_0=$1326;label=341;break;
 case 304: 
 var $1327=$890;
 var $sp_0_i_i_i=36528;label=305;break;
 case 305: 
 var $sp_0_i_i_i;
 var $1329=(($sp_0_i_i_i)|0);
 var $1330=HEAP32[(($1329)>>2)];
 var $1331=($1330>>>0)>($1327>>>0);
 if($1331){label=307;break;}else{label=306;break;}
 case 306: 
 var $1333=(($sp_0_i_i_i+4)|0);
 var $1334=HEAP32[(($1333)>>2)];
 var $1335=(($1330+$1334)|0);
 var $1336=($1335>>>0)>($1327>>>0);
 if($1336){label=308;break;}else{label=307;break;}
 case 307: 
 var $1338=(($sp_0_i_i_i+8)|0);
 var $1339=HEAP32[(($1338)>>2)];
 var $sp_0_i_i_i=$1339;label=305;break;
 case 308: 
 var $_sum_i15_i=((($1334)-(47))|0);
 var $_sum1_i16_i=((($1334)-(39))|0);
 var $1340=(($1330+$_sum1_i16_i)|0);
 var $1341=$1340;
 var $1342=$1341&7;
 var $1343=($1342|0)==0;
 if($1343){var $1348=0;label=310;break;}else{label=309;break;}
 case 309: 
 var $1345=(((-$1341))|0);
 var $1346=$1345&7;
 var $1348=$1346;label=310;break;
 case 310: 
 var $1348;
 var $_sum2_i17_i=((($_sum_i15_i)+($1348))|0);
 var $1349=(($1330+$_sum2_i17_i)|0);
 var $1350=(($890+16)|0);
 var $1351=$1350;
 var $1352=($1349>>>0)<($1351>>>0);
 var $1353=($1352?$1327:$1349);
 var $1354=(($1353+8)|0);
 var $1355=$1354;
 var $1356=((($tsize_244_i)-(40))|0);
 var $1357=(($tbase_245_i+8)|0);
 var $1358=$1357;
 var $1359=$1358&7;
 var $1360=($1359|0)==0;
 if($1360){var $1364=0;label=312;break;}else{label=311;break;}
 case 311: 
 var $1362=(((-$1358))|0);
 var $1363=$1362&7;
 var $1364=$1363;label=312;break;
 case 312: 
 var $1364;
 var $1365=(($tbase_245_i+$1364)|0);
 var $1366=$1365;
 var $1367=((($1356)-($1364))|0);
 HEAP32[((36104)>>2)]=$1366;
 HEAP32[((36092)>>2)]=$1367;
 var $1368=$1367|1;
 var $_sum_i_i_i=((($1364)+(4))|0);
 var $1369=(($tbase_245_i+$_sum_i_i_i)|0);
 var $1370=$1369;
 HEAP32[(($1370)>>2)]=$1368;
 var $_sum2_i_i_i=((($tsize_244_i)-(36))|0);
 var $1371=(($tbase_245_i+$_sum2_i_i_i)|0);
 var $1372=$1371;
 HEAP32[(($1372)>>2)]=40;
 var $1373=HEAP32[((9144)>>2)];
 HEAP32[((36108)>>2)]=$1373;
 var $1374=(($1353+4)|0);
 var $1375=$1374;
 HEAP32[(($1375)>>2)]=27;
 assert(16 % 1 === 0);HEAP32[(($1354)>>2)]=HEAP32[((36528)>>2)];HEAP32[((($1354)+(4))>>2)]=HEAP32[((36532)>>2)];HEAP32[((($1354)+(8))>>2)]=HEAP32[((36536)>>2)];HEAP32[((($1354)+(12))>>2)]=HEAP32[((36540)>>2)];
 HEAP32[((36528)>>2)]=$tbase_245_i;
 HEAP32[((36532)>>2)]=$tsize_244_i;
 HEAP32[((36540)>>2)]=0;
 HEAP32[((36536)>>2)]=$1355;
 var $1376=(($1353+28)|0);
 var $1377=$1376;
 HEAP32[(($1377)>>2)]=7;
 var $1378=(($1353+32)|0);
 var $1379=($1378>>>0)<($1335>>>0);
 if($1379){var $1380=$1377;label=313;break;}else{label=314;break;}
 case 313: 
 var $1380;
 var $1381=(($1380+4)|0);
 HEAP32[(($1381)>>2)]=7;
 var $1382=(($1380+8)|0);
 var $1383=$1382;
 var $1384=($1383>>>0)<($1335>>>0);
 if($1384){var $1380=$1381;label=313;break;}else{label=314;break;}
 case 314: 
 var $1385=($1353|0)==($1327|0);
 if($1385){label=338;break;}else{label=315;break;}
 case 315: 
 var $1387=$1353;
 var $1388=$890;
 var $1389=((($1387)-($1388))|0);
 var $1390=(($1327+$1389)|0);
 var $_sum3_i_i=((($1389)+(4))|0);
 var $1391=(($1327+$_sum3_i_i)|0);
 var $1392=$1391;
 var $1393=HEAP32[(($1392)>>2)];
 var $1394=$1393&-2;
 HEAP32[(($1392)>>2)]=$1394;
 var $1395=$1389|1;
 var $1396=(($890+4)|0);
 HEAP32[(($1396)>>2)]=$1395;
 var $1397=$1390;
 HEAP32[(($1397)>>2)]=$1389;
 var $1398=$1389>>>3;
 var $1399=($1389>>>0)<256;
 if($1399){label=316;break;}else{label=321;break;}
 case 316: 
 var $1401=$1398<<1;
 var $1402=((36120+($1401<<2))|0);
 var $1403=$1402;
 var $1404=HEAP32[((36080)>>2)];
 var $1405=1<<$1398;
 var $1406=$1404&$1405;
 var $1407=($1406|0)==0;
 if($1407){label=317;break;}else{label=318;break;}
 case 317: 
 var $1409=$1404|$1405;
 HEAP32[((36080)>>2)]=$1409;
 var $_sum11_pre_i_i=((($1401)+(2))|0);
 var $_pre_i_i=((36120+($_sum11_pre_i_i<<2))|0);
 var $F_0_i_i=$1403;var $_pre_phi_i_i=$_pre_i_i;label=320;break;
 case 318: 
 var $_sum12_i_i=((($1401)+(2))|0);
 var $1411=((36120+($_sum12_i_i<<2))|0);
 var $1412=HEAP32[(($1411)>>2)];
 var $1413=$1412;
 var $1414=HEAP32[((36096)>>2)];
 var $1415=($1413>>>0)<($1414>>>0);
 if($1415){label=319;break;}else{var $F_0_i_i=$1412;var $_pre_phi_i_i=$1411;label=320;break;}
 case 319: 
 _abort();
 throw "Reached an unreachable!";
 case 320: 
 var $_pre_phi_i_i;
 var $F_0_i_i;
 HEAP32[(($_pre_phi_i_i)>>2)]=$890;
 var $1418=(($F_0_i_i+12)|0);
 HEAP32[(($1418)>>2)]=$890;
 var $1419=(($890+8)|0);
 HEAP32[(($1419)>>2)]=$F_0_i_i;
 var $1420=(($890+12)|0);
 HEAP32[(($1420)>>2)]=$1403;
 label=338;break;
 case 321: 
 var $1422=$890;
 var $1423=$1389>>>8;
 var $1424=($1423|0)==0;
 if($1424){var $I1_0_i_i=0;label=324;break;}else{label=322;break;}
 case 322: 
 var $1426=($1389>>>0)>16777215;
 if($1426){var $I1_0_i_i=31;label=324;break;}else{label=323;break;}
 case 323: 
 var $1428=((($1423)+(1048320))|0);
 var $1429=$1428>>>16;
 var $1430=$1429&8;
 var $1431=$1423<<$1430;
 var $1432=((($1431)+(520192))|0);
 var $1433=$1432>>>16;
 var $1434=$1433&4;
 var $1435=$1434|$1430;
 var $1436=$1431<<$1434;
 var $1437=((($1436)+(245760))|0);
 var $1438=$1437>>>16;
 var $1439=$1438&2;
 var $1440=$1435|$1439;
 var $1441=(((14)-($1440))|0);
 var $1442=$1436<<$1439;
 var $1443=$1442>>>15;
 var $1444=((($1441)+($1443))|0);
 var $1445=$1444<<1;
 var $1446=((($1444)+(7))|0);
 var $1447=$1389>>>($1446>>>0);
 var $1448=$1447&1;
 var $1449=$1448|$1445;
 var $I1_0_i_i=$1449;label=324;break;
 case 324: 
 var $I1_0_i_i;
 var $1451=((36384+($I1_0_i_i<<2))|0);
 var $1452=(($890+28)|0);
 var $I1_0_c_i_i=$I1_0_i_i;
 HEAP32[(($1452)>>2)]=$I1_0_c_i_i;
 var $1453=(($890+20)|0);
 HEAP32[(($1453)>>2)]=0;
 var $1454=(($890+16)|0);
 HEAP32[(($1454)>>2)]=0;
 var $1455=HEAP32[((36084)>>2)];
 var $1456=1<<$I1_0_i_i;
 var $1457=$1455&$1456;
 var $1458=($1457|0)==0;
 if($1458){label=325;break;}else{label=326;break;}
 case 325: 
 var $1460=$1455|$1456;
 HEAP32[((36084)>>2)]=$1460;
 HEAP32[(($1451)>>2)]=$1422;
 var $1461=(($890+24)|0);
 var $_c_i_i=$1451;
 HEAP32[(($1461)>>2)]=$_c_i_i;
 var $1462=(($890+12)|0);
 HEAP32[(($1462)>>2)]=$890;
 var $1463=(($890+8)|0);
 HEAP32[(($1463)>>2)]=$890;
 label=338;break;
 case 326: 
 var $1465=HEAP32[(($1451)>>2)];
 var $1466=($I1_0_i_i|0)==31;
 if($1466){var $1471=0;label=328;break;}else{label=327;break;}
 case 327: 
 var $1468=$I1_0_i_i>>>1;
 var $1469=(((25)-($1468))|0);
 var $1471=$1469;label=328;break;
 case 328: 
 var $1471;
 var $1472=$1389<<$1471;
 var $K2_0_i_i=$1472;var $T_0_i_i=$1465;label=329;break;
 case 329: 
 var $T_0_i_i;
 var $K2_0_i_i;
 var $1474=(($T_0_i_i+4)|0);
 var $1475=HEAP32[(($1474)>>2)];
 var $1476=$1475&-8;
 var $1477=($1476|0)==($1389|0);
 if($1477){label=334;break;}else{label=330;break;}
 case 330: 
 var $1479=$K2_0_i_i>>>31;
 var $1480=(($T_0_i_i+16+($1479<<2))|0);
 var $1481=HEAP32[(($1480)>>2)];
 var $1482=($1481|0)==0;
 var $1483=$K2_0_i_i<<1;
 if($1482){label=331;break;}else{var $K2_0_i_i=$1483;var $T_0_i_i=$1481;label=329;break;}
 case 331: 
 var $1485=$1480;
 var $1486=HEAP32[((36096)>>2)];
 var $1487=($1485>>>0)<($1486>>>0);
 if($1487){label=333;break;}else{label=332;break;}
 case 332: 
 HEAP32[(($1480)>>2)]=$1422;
 var $1489=(($890+24)|0);
 var $T_0_c8_i_i=$T_0_i_i;
 HEAP32[(($1489)>>2)]=$T_0_c8_i_i;
 var $1490=(($890+12)|0);
 HEAP32[(($1490)>>2)]=$890;
 var $1491=(($890+8)|0);
 HEAP32[(($1491)>>2)]=$890;
 label=338;break;
 case 333: 
 _abort();
 throw "Reached an unreachable!";
 case 334: 
 var $1494=(($T_0_i_i+8)|0);
 var $1495=HEAP32[(($1494)>>2)];
 var $1496=$T_0_i_i;
 var $1497=HEAP32[((36096)>>2)];
 var $1498=($1496>>>0)<($1497>>>0);
 if($1498){label=337;break;}else{label=335;break;}
 case 335: 
 var $1500=$1495;
 var $1501=($1500>>>0)<($1497>>>0);
 if($1501){label=337;break;}else{label=336;break;}
 case 336: 
 var $1503=(($1495+12)|0);
 HEAP32[(($1503)>>2)]=$1422;
 HEAP32[(($1494)>>2)]=$1422;
 var $1504=(($890+8)|0);
 var $_c7_i_i=$1495;
 HEAP32[(($1504)>>2)]=$_c7_i_i;
 var $1505=(($890+12)|0);
 var $T_0_c_i_i=$T_0_i_i;
 HEAP32[(($1505)>>2)]=$T_0_c_i_i;
 var $1506=(($890+24)|0);
 HEAP32[(($1506)>>2)]=0;
 label=338;break;
 case 337: 
 _abort();
 throw "Reached an unreachable!";
 case 338: 
 var $1507=HEAP32[((36092)>>2)];
 var $1508=($1507>>>0)>($nb_0>>>0);
 if($1508){label=339;break;}else{label=340;break;}
 case 339: 
 var $1510=((($1507)-($nb_0))|0);
 HEAP32[((36092)>>2)]=$1510;
 var $1511=HEAP32[((36104)>>2)];
 var $1512=$1511;
 var $1513=(($1512+$nb_0)|0);
 var $1514=$1513;
 HEAP32[((36104)>>2)]=$1514;
 var $1515=$1510|1;
 var $_sum_i134=((($nb_0)+(4))|0);
 var $1516=(($1512+$_sum_i134)|0);
 var $1517=$1516;
 HEAP32[(($1517)>>2)]=$1515;
 var $1518=$nb_0|3;
 var $1519=(($1511+4)|0);
 HEAP32[(($1519)>>2)]=$1518;
 var $1520=(($1511+8)|0);
 var $1521=$1520;
 var $mem_0=$1521;label=341;break;
 case 340: 
 var $1522=___errno_location();
 HEAP32[(($1522)>>2)]=12;
 var $mem_0=0;label=341;break;
 case 341: 
 var $mem_0;
 return $mem_0;
  default: assert(0, "bad label: " + label);
 }
}
Module["_malloc"] = _malloc;
function _free($mem){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=($mem|0)==0;
 if($1){label=140;break;}else{label=2;break;}
 case 2: 
 var $3=((($mem)-(8))|0);
 var $4=$3;
 var $5=HEAP32[((36096)>>2)];
 var $6=($3>>>0)<($5>>>0);
 if($6){label=139;break;}else{label=3;break;}
 case 3: 
 var $8=((($mem)-(4))|0);
 var $9=$8;
 var $10=HEAP32[(($9)>>2)];
 var $11=$10&3;
 var $12=($11|0)==1;
 if($12){label=139;break;}else{label=4;break;}
 case 4: 
 var $14=$10&-8;
 var $_sum=((($14)-(8))|0);
 var $15=(($mem+$_sum)|0);
 var $16=$15;
 var $17=$10&1;
 var $18=($17|0)==0;
 if($18){label=5;break;}else{var $p_0=$4;var $psize_0=$14;label=56;break;}
 case 5: 
 var $20=$3;
 var $21=HEAP32[(($20)>>2)];
 var $22=($11|0)==0;
 if($22){label=140;break;}else{label=6;break;}
 case 6: 
 var $_sum232=(((-8)-($21))|0);
 var $24=(($mem+$_sum232)|0);
 var $25=$24;
 var $26=((($21)+($14))|0);
 var $27=($24>>>0)<($5>>>0);
 if($27){label=139;break;}else{label=7;break;}
 case 7: 
 var $29=HEAP32[((36100)>>2)];
 var $30=($25|0)==($29|0);
 if($30){label=54;break;}else{label=8;break;}
 case 8: 
 var $32=$21>>>3;
 var $33=($21>>>0)<256;
 if($33){label=9;break;}else{label=21;break;}
 case 9: 
 var $_sum276=((($_sum232)+(8))|0);
 var $35=(($mem+$_sum276)|0);
 var $36=$35;
 var $37=HEAP32[(($36)>>2)];
 var $_sum277=((($_sum232)+(12))|0);
 var $38=(($mem+$_sum277)|0);
 var $39=$38;
 var $40=HEAP32[(($39)>>2)];
 var $41=$32<<1;
 var $42=((36120+($41<<2))|0);
 var $43=$42;
 var $44=($37|0)==($43|0);
 if($44){label=12;break;}else{label=10;break;}
 case 10: 
 var $46=$37;
 var $47=($46>>>0)<($5>>>0);
 if($47){label=20;break;}else{label=11;break;}
 case 11: 
 var $49=(($37+12)|0);
 var $50=HEAP32[(($49)>>2)];
 var $51=($50|0)==($25|0);
 if($51){label=12;break;}else{label=20;break;}
 case 12: 
 var $52=($40|0)==($37|0);
 if($52){label=13;break;}else{label=14;break;}
 case 13: 
 var $54=1<<$32;
 var $55=$54^-1;
 var $56=HEAP32[((36080)>>2)];
 var $57=$56&$55;
 HEAP32[((36080)>>2)]=$57;
 var $p_0=$25;var $psize_0=$26;label=56;break;
 case 14: 
 var $59=($40|0)==($43|0);
 if($59){label=15;break;}else{label=16;break;}
 case 15: 
 var $_pre305=(($40+8)|0);
 var $_pre_phi306=$_pre305;label=18;break;
 case 16: 
 var $61=$40;
 var $62=($61>>>0)<($5>>>0);
 if($62){label=19;break;}else{label=17;break;}
 case 17: 
 var $64=(($40+8)|0);
 var $65=HEAP32[(($64)>>2)];
 var $66=($65|0)==($25|0);
 if($66){var $_pre_phi306=$64;label=18;break;}else{label=19;break;}
 case 18: 
 var $_pre_phi306;
 var $67=(($37+12)|0);
 HEAP32[(($67)>>2)]=$40;
 HEAP32[(($_pre_phi306)>>2)]=$37;
 var $p_0=$25;var $psize_0=$26;label=56;break;
 case 19: 
 _abort();
 throw "Reached an unreachable!";
 case 20: 
 _abort();
 throw "Reached an unreachable!";
 case 21: 
 var $69=$24;
 var $_sum266=((($_sum232)+(24))|0);
 var $70=(($mem+$_sum266)|0);
 var $71=$70;
 var $72=HEAP32[(($71)>>2)];
 var $_sum267=((($_sum232)+(12))|0);
 var $73=(($mem+$_sum267)|0);
 var $74=$73;
 var $75=HEAP32[(($74)>>2)];
 var $76=($75|0)==($69|0);
 if($76){label=27;break;}else{label=22;break;}
 case 22: 
 var $_sum273=((($_sum232)+(8))|0);
 var $78=(($mem+$_sum273)|0);
 var $79=$78;
 var $80=HEAP32[(($79)>>2)];
 var $81=$80;
 var $82=($81>>>0)<($5>>>0);
 if($82){label=26;break;}else{label=23;break;}
 case 23: 
 var $84=(($80+12)|0);
 var $85=HEAP32[(($84)>>2)];
 var $86=($85|0)==($69|0);
 if($86){label=24;break;}else{label=26;break;}
 case 24: 
 var $88=(($75+8)|0);
 var $89=HEAP32[(($88)>>2)];
 var $90=($89|0)==($69|0);
 if($90){label=25;break;}else{label=26;break;}
 case 25: 
 HEAP32[(($84)>>2)]=$75;
 HEAP32[(($88)>>2)]=$80;
 var $R_1=$75;label=34;break;
 case 26: 
 _abort();
 throw "Reached an unreachable!";
 case 27: 
 var $_sum269=((($_sum232)+(20))|0);
 var $93=(($mem+$_sum269)|0);
 var $94=$93;
 var $95=HEAP32[(($94)>>2)];
 var $96=($95|0)==0;
 if($96){label=28;break;}else{var $R_0=$95;var $RP_0=$94;label=29;break;}
 case 28: 
 var $_sum268=((($_sum232)+(16))|0);
 var $98=(($mem+$_sum268)|0);
 var $99=$98;
 var $100=HEAP32[(($99)>>2)];
 var $101=($100|0)==0;
 if($101){var $R_1=0;label=34;break;}else{var $R_0=$100;var $RP_0=$99;label=29;break;}
 case 29: 
 var $RP_0;
 var $R_0;
 var $102=(($R_0+20)|0);
 var $103=HEAP32[(($102)>>2)];
 var $104=($103|0)==0;
 if($104){label=30;break;}else{var $R_0=$103;var $RP_0=$102;label=29;break;}
 case 30: 
 var $106=(($R_0+16)|0);
 var $107=HEAP32[(($106)>>2)];
 var $108=($107|0)==0;
 if($108){label=31;break;}else{var $R_0=$107;var $RP_0=$106;label=29;break;}
 case 31: 
 var $110=$RP_0;
 var $111=($110>>>0)<($5>>>0);
 if($111){label=33;break;}else{label=32;break;}
 case 32: 
 HEAP32[(($RP_0)>>2)]=0;
 var $R_1=$R_0;label=34;break;
 case 33: 
 _abort();
 throw "Reached an unreachable!";
 case 34: 
 var $R_1;
 var $115=($72|0)==0;
 if($115){var $p_0=$25;var $psize_0=$26;label=56;break;}else{label=35;break;}
 case 35: 
 var $_sum270=((($_sum232)+(28))|0);
 var $117=(($mem+$_sum270)|0);
 var $118=$117;
 var $119=HEAP32[(($118)>>2)];
 var $120=((36384+($119<<2))|0);
 var $121=HEAP32[(($120)>>2)];
 var $122=($69|0)==($121|0);
 if($122){label=36;break;}else{label=38;break;}
 case 36: 
 HEAP32[(($120)>>2)]=$R_1;
 var $cond=($R_1|0)==0;
 if($cond){label=37;break;}else{label=44;break;}
 case 37: 
 var $124=HEAP32[(($118)>>2)];
 var $125=1<<$124;
 var $126=$125^-1;
 var $127=HEAP32[((36084)>>2)];
 var $128=$127&$126;
 HEAP32[((36084)>>2)]=$128;
 var $p_0=$25;var $psize_0=$26;label=56;break;
 case 38: 
 var $130=$72;
 var $131=HEAP32[((36096)>>2)];
 var $132=($130>>>0)<($131>>>0);
 if($132){label=42;break;}else{label=39;break;}
 case 39: 
 var $134=(($72+16)|0);
 var $135=HEAP32[(($134)>>2)];
 var $136=($135|0)==($69|0);
 if($136){label=40;break;}else{label=41;break;}
 case 40: 
 HEAP32[(($134)>>2)]=$R_1;
 label=43;break;
 case 41: 
 var $139=(($72+20)|0);
 HEAP32[(($139)>>2)]=$R_1;
 label=43;break;
 case 42: 
 _abort();
 throw "Reached an unreachable!";
 case 43: 
 var $142=($R_1|0)==0;
 if($142){var $p_0=$25;var $psize_0=$26;label=56;break;}else{label=44;break;}
 case 44: 
 var $144=$R_1;
 var $145=HEAP32[((36096)>>2)];
 var $146=($144>>>0)<($145>>>0);
 if($146){label=53;break;}else{label=45;break;}
 case 45: 
 var $148=(($R_1+24)|0);
 HEAP32[(($148)>>2)]=$72;
 var $_sum271=((($_sum232)+(16))|0);
 var $149=(($mem+$_sum271)|0);
 var $150=$149;
 var $151=HEAP32[(($150)>>2)];
 var $152=($151|0)==0;
 if($152){label=49;break;}else{label=46;break;}
 case 46: 
 var $154=$151;
 var $155=HEAP32[((36096)>>2)];
 var $156=($154>>>0)<($155>>>0);
 if($156){label=48;break;}else{label=47;break;}
 case 47: 
 var $158=(($R_1+16)|0);
 HEAP32[(($158)>>2)]=$151;
 var $159=(($151+24)|0);
 HEAP32[(($159)>>2)]=$R_1;
 label=49;break;
 case 48: 
 _abort();
 throw "Reached an unreachable!";
 case 49: 
 var $_sum272=((($_sum232)+(20))|0);
 var $162=(($mem+$_sum272)|0);
 var $163=$162;
 var $164=HEAP32[(($163)>>2)];
 var $165=($164|0)==0;
 if($165){var $p_0=$25;var $psize_0=$26;label=56;break;}else{label=50;break;}
 case 50: 
 var $167=$164;
 var $168=HEAP32[((36096)>>2)];
 var $169=($167>>>0)<($168>>>0);
 if($169){label=52;break;}else{label=51;break;}
 case 51: 
 var $171=(($R_1+20)|0);
 HEAP32[(($171)>>2)]=$164;
 var $172=(($164+24)|0);
 HEAP32[(($172)>>2)]=$R_1;
 var $p_0=$25;var $psize_0=$26;label=56;break;
 case 52: 
 _abort();
 throw "Reached an unreachable!";
 case 53: 
 _abort();
 throw "Reached an unreachable!";
 case 54: 
 var $_sum233=((($14)-(4))|0);
 var $176=(($mem+$_sum233)|0);
 var $177=$176;
 var $178=HEAP32[(($177)>>2)];
 var $179=$178&3;
 var $180=($179|0)==3;
 if($180){label=55;break;}else{var $p_0=$25;var $psize_0=$26;label=56;break;}
 case 55: 
 HEAP32[((36088)>>2)]=$26;
 var $182=HEAP32[(($177)>>2)];
 var $183=$182&-2;
 HEAP32[(($177)>>2)]=$183;
 var $184=$26|1;
 var $_sum264=((($_sum232)+(4))|0);
 var $185=(($mem+$_sum264)|0);
 var $186=$185;
 HEAP32[(($186)>>2)]=$184;
 var $187=$15;
 HEAP32[(($187)>>2)]=$26;
 label=140;break;
 case 56: 
 var $psize_0;
 var $p_0;
 var $189=$p_0;
 var $190=($189>>>0)<($15>>>0);
 if($190){label=57;break;}else{label=139;break;}
 case 57: 
 var $_sum263=((($14)-(4))|0);
 var $192=(($mem+$_sum263)|0);
 var $193=$192;
 var $194=HEAP32[(($193)>>2)];
 var $195=$194&1;
 var $phitmp=($195|0)==0;
 if($phitmp){label=139;break;}else{label=58;break;}
 case 58: 
 var $197=$194&2;
 var $198=($197|0)==0;
 if($198){label=59;break;}else{label=112;break;}
 case 59: 
 var $200=HEAP32[((36104)>>2)];
 var $201=($16|0)==($200|0);
 if($201){label=60;break;}else{label=62;break;}
 case 60: 
 var $203=HEAP32[((36092)>>2)];
 var $204=((($203)+($psize_0))|0);
 HEAP32[((36092)>>2)]=$204;
 HEAP32[((36104)>>2)]=$p_0;
 var $205=$204|1;
 var $206=(($p_0+4)|0);
 HEAP32[(($206)>>2)]=$205;
 var $207=HEAP32[((36100)>>2)];
 var $208=($p_0|0)==($207|0);
 if($208){label=61;break;}else{label=140;break;}
 case 61: 
 HEAP32[((36100)>>2)]=0;
 HEAP32[((36088)>>2)]=0;
 label=140;break;
 case 62: 
 var $211=HEAP32[((36100)>>2)];
 var $212=($16|0)==($211|0);
 if($212){label=63;break;}else{label=64;break;}
 case 63: 
 var $214=HEAP32[((36088)>>2)];
 var $215=((($214)+($psize_0))|0);
 HEAP32[((36088)>>2)]=$215;
 HEAP32[((36100)>>2)]=$p_0;
 var $216=$215|1;
 var $217=(($p_0+4)|0);
 HEAP32[(($217)>>2)]=$216;
 var $218=(($189+$215)|0);
 var $219=$218;
 HEAP32[(($219)>>2)]=$215;
 label=140;break;
 case 64: 
 var $221=$194&-8;
 var $222=((($221)+($psize_0))|0);
 var $223=$194>>>3;
 var $224=($194>>>0)<256;
 if($224){label=65;break;}else{label=77;break;}
 case 65: 
 var $226=(($mem+$14)|0);
 var $227=$226;
 var $228=HEAP32[(($227)>>2)];
 var $_sum257258=$14|4;
 var $229=(($mem+$_sum257258)|0);
 var $230=$229;
 var $231=HEAP32[(($230)>>2)];
 var $232=$223<<1;
 var $233=((36120+($232<<2))|0);
 var $234=$233;
 var $235=($228|0)==($234|0);
 if($235){label=68;break;}else{label=66;break;}
 case 66: 
 var $237=$228;
 var $238=HEAP32[((36096)>>2)];
 var $239=($237>>>0)<($238>>>0);
 if($239){label=76;break;}else{label=67;break;}
 case 67: 
 var $241=(($228+12)|0);
 var $242=HEAP32[(($241)>>2)];
 var $243=($242|0)==($16|0);
 if($243){label=68;break;}else{label=76;break;}
 case 68: 
 var $244=($231|0)==($228|0);
 if($244){label=69;break;}else{label=70;break;}
 case 69: 
 var $246=1<<$223;
 var $247=$246^-1;
 var $248=HEAP32[((36080)>>2)];
 var $249=$248&$247;
 HEAP32[((36080)>>2)]=$249;
 label=110;break;
 case 70: 
 var $251=($231|0)==($234|0);
 if($251){label=71;break;}else{label=72;break;}
 case 71: 
 var $_pre303=(($231+8)|0);
 var $_pre_phi304=$_pre303;label=74;break;
 case 72: 
 var $253=$231;
 var $254=HEAP32[((36096)>>2)];
 var $255=($253>>>0)<($254>>>0);
 if($255){label=75;break;}else{label=73;break;}
 case 73: 
 var $257=(($231+8)|0);
 var $258=HEAP32[(($257)>>2)];
 var $259=($258|0)==($16|0);
 if($259){var $_pre_phi304=$257;label=74;break;}else{label=75;break;}
 case 74: 
 var $_pre_phi304;
 var $260=(($228+12)|0);
 HEAP32[(($260)>>2)]=$231;
 HEAP32[(($_pre_phi304)>>2)]=$228;
 label=110;break;
 case 75: 
 _abort();
 throw "Reached an unreachable!";
 case 76: 
 _abort();
 throw "Reached an unreachable!";
 case 77: 
 var $262=$15;
 var $_sum235=((($14)+(16))|0);
 var $263=(($mem+$_sum235)|0);
 var $264=$263;
 var $265=HEAP32[(($264)>>2)];
 var $_sum236237=$14|4;
 var $266=(($mem+$_sum236237)|0);
 var $267=$266;
 var $268=HEAP32[(($267)>>2)];
 var $269=($268|0)==($262|0);
 if($269){label=83;break;}else{label=78;break;}
 case 78: 
 var $271=(($mem+$14)|0);
 var $272=$271;
 var $273=HEAP32[(($272)>>2)];
 var $274=$273;
 var $275=HEAP32[((36096)>>2)];
 var $276=($274>>>0)<($275>>>0);
 if($276){label=82;break;}else{label=79;break;}
 case 79: 
 var $278=(($273+12)|0);
 var $279=HEAP32[(($278)>>2)];
 var $280=($279|0)==($262|0);
 if($280){label=80;break;}else{label=82;break;}
 case 80: 
 var $282=(($268+8)|0);
 var $283=HEAP32[(($282)>>2)];
 var $284=($283|0)==($262|0);
 if($284){label=81;break;}else{label=82;break;}
 case 81: 
 HEAP32[(($278)>>2)]=$268;
 HEAP32[(($282)>>2)]=$273;
 var $R7_1=$268;label=90;break;
 case 82: 
 _abort();
 throw "Reached an unreachable!";
 case 83: 
 var $_sum239=((($14)+(12))|0);
 var $287=(($mem+$_sum239)|0);
 var $288=$287;
 var $289=HEAP32[(($288)>>2)];
 var $290=($289|0)==0;
 if($290){label=84;break;}else{var $R7_0=$289;var $RP9_0=$288;label=85;break;}
 case 84: 
 var $_sum238=((($14)+(8))|0);
 var $292=(($mem+$_sum238)|0);
 var $293=$292;
 var $294=HEAP32[(($293)>>2)];
 var $295=($294|0)==0;
 if($295){var $R7_1=0;label=90;break;}else{var $R7_0=$294;var $RP9_0=$293;label=85;break;}
 case 85: 
 var $RP9_0;
 var $R7_0;
 var $296=(($R7_0+20)|0);
 var $297=HEAP32[(($296)>>2)];
 var $298=($297|0)==0;
 if($298){label=86;break;}else{var $R7_0=$297;var $RP9_0=$296;label=85;break;}
 case 86: 
 var $300=(($R7_0+16)|0);
 var $301=HEAP32[(($300)>>2)];
 var $302=($301|0)==0;
 if($302){label=87;break;}else{var $R7_0=$301;var $RP9_0=$300;label=85;break;}
 case 87: 
 var $304=$RP9_0;
 var $305=HEAP32[((36096)>>2)];
 var $306=($304>>>0)<($305>>>0);
 if($306){label=89;break;}else{label=88;break;}
 case 88: 
 HEAP32[(($RP9_0)>>2)]=0;
 var $R7_1=$R7_0;label=90;break;
 case 89: 
 _abort();
 throw "Reached an unreachable!";
 case 90: 
 var $R7_1;
 var $310=($265|0)==0;
 if($310){label=110;break;}else{label=91;break;}
 case 91: 
 var $_sum250=((($14)+(20))|0);
 var $312=(($mem+$_sum250)|0);
 var $313=$312;
 var $314=HEAP32[(($313)>>2)];
 var $315=((36384+($314<<2))|0);
 var $316=HEAP32[(($315)>>2)];
 var $317=($262|0)==($316|0);
 if($317){label=92;break;}else{label=94;break;}
 case 92: 
 HEAP32[(($315)>>2)]=$R7_1;
 var $cond298=($R7_1|0)==0;
 if($cond298){label=93;break;}else{label=100;break;}
 case 93: 
 var $319=HEAP32[(($313)>>2)];
 var $320=1<<$319;
 var $321=$320^-1;
 var $322=HEAP32[((36084)>>2)];
 var $323=$322&$321;
 HEAP32[((36084)>>2)]=$323;
 label=110;break;
 case 94: 
 var $325=$265;
 var $326=HEAP32[((36096)>>2)];
 var $327=($325>>>0)<($326>>>0);
 if($327){label=98;break;}else{label=95;break;}
 case 95: 
 var $329=(($265+16)|0);
 var $330=HEAP32[(($329)>>2)];
 var $331=($330|0)==($262|0);
 if($331){label=96;break;}else{label=97;break;}
 case 96: 
 HEAP32[(($329)>>2)]=$R7_1;
 label=99;break;
 case 97: 
 var $334=(($265+20)|0);
 HEAP32[(($334)>>2)]=$R7_1;
 label=99;break;
 case 98: 
 _abort();
 throw "Reached an unreachable!";
 case 99: 
 var $337=($R7_1|0)==0;
 if($337){label=110;break;}else{label=100;break;}
 case 100: 
 var $339=$R7_1;
 var $340=HEAP32[((36096)>>2)];
 var $341=($339>>>0)<($340>>>0);
 if($341){label=109;break;}else{label=101;break;}
 case 101: 
 var $343=(($R7_1+24)|0);
 HEAP32[(($343)>>2)]=$265;
 var $_sum251=((($14)+(8))|0);
 var $344=(($mem+$_sum251)|0);
 var $345=$344;
 var $346=HEAP32[(($345)>>2)];
 var $347=($346|0)==0;
 if($347){label=105;break;}else{label=102;break;}
 case 102: 
 var $349=$346;
 var $350=HEAP32[((36096)>>2)];
 var $351=($349>>>0)<($350>>>0);
 if($351){label=104;break;}else{label=103;break;}
 case 103: 
 var $353=(($R7_1+16)|0);
 HEAP32[(($353)>>2)]=$346;
 var $354=(($346+24)|0);
 HEAP32[(($354)>>2)]=$R7_1;
 label=105;break;
 case 104: 
 _abort();
 throw "Reached an unreachable!";
 case 105: 
 var $_sum252=((($14)+(12))|0);
 var $357=(($mem+$_sum252)|0);
 var $358=$357;
 var $359=HEAP32[(($358)>>2)];
 var $360=($359|0)==0;
 if($360){label=110;break;}else{label=106;break;}
 case 106: 
 var $362=$359;
 var $363=HEAP32[((36096)>>2)];
 var $364=($362>>>0)<($363>>>0);
 if($364){label=108;break;}else{label=107;break;}
 case 107: 
 var $366=(($R7_1+20)|0);
 HEAP32[(($366)>>2)]=$359;
 var $367=(($359+24)|0);
 HEAP32[(($367)>>2)]=$R7_1;
 label=110;break;
 case 108: 
 _abort();
 throw "Reached an unreachable!";
 case 109: 
 _abort();
 throw "Reached an unreachable!";
 case 110: 
 var $371=$222|1;
 var $372=(($p_0+4)|0);
 HEAP32[(($372)>>2)]=$371;
 var $373=(($189+$222)|0);
 var $374=$373;
 HEAP32[(($374)>>2)]=$222;
 var $375=HEAP32[((36100)>>2)];
 var $376=($p_0|0)==($375|0);
 if($376){label=111;break;}else{var $psize_1=$222;label=113;break;}
 case 111: 
 HEAP32[((36088)>>2)]=$222;
 label=140;break;
 case 112: 
 var $379=$194&-2;
 HEAP32[(($193)>>2)]=$379;
 var $380=$psize_0|1;
 var $381=(($p_0+4)|0);
 HEAP32[(($381)>>2)]=$380;
 var $382=(($189+$psize_0)|0);
 var $383=$382;
 HEAP32[(($383)>>2)]=$psize_0;
 var $psize_1=$psize_0;label=113;break;
 case 113: 
 var $psize_1;
 var $385=$psize_1>>>3;
 var $386=($psize_1>>>0)<256;
 if($386){label=114;break;}else{label=119;break;}
 case 114: 
 var $388=$385<<1;
 var $389=((36120+($388<<2))|0);
 var $390=$389;
 var $391=HEAP32[((36080)>>2)];
 var $392=1<<$385;
 var $393=$391&$392;
 var $394=($393|0)==0;
 if($394){label=115;break;}else{label=116;break;}
 case 115: 
 var $396=$391|$392;
 HEAP32[((36080)>>2)]=$396;
 var $_sum248_pre=((($388)+(2))|0);
 var $_pre=((36120+($_sum248_pre<<2))|0);
 var $F16_0=$390;var $_pre_phi=$_pre;label=118;break;
 case 116: 
 var $_sum249=((($388)+(2))|0);
 var $398=((36120+($_sum249<<2))|0);
 var $399=HEAP32[(($398)>>2)];
 var $400=$399;
 var $401=HEAP32[((36096)>>2)];
 var $402=($400>>>0)<($401>>>0);
 if($402){label=117;break;}else{var $F16_0=$399;var $_pre_phi=$398;label=118;break;}
 case 117: 
 _abort();
 throw "Reached an unreachable!";
 case 118: 
 var $_pre_phi;
 var $F16_0;
 HEAP32[(($_pre_phi)>>2)]=$p_0;
 var $405=(($F16_0+12)|0);
 HEAP32[(($405)>>2)]=$p_0;
 var $406=(($p_0+8)|0);
 HEAP32[(($406)>>2)]=$F16_0;
 var $407=(($p_0+12)|0);
 HEAP32[(($407)>>2)]=$390;
 label=140;break;
 case 119: 
 var $409=$p_0;
 var $410=$psize_1>>>8;
 var $411=($410|0)==0;
 if($411){var $I18_0=0;label=122;break;}else{label=120;break;}
 case 120: 
 var $413=($psize_1>>>0)>16777215;
 if($413){var $I18_0=31;label=122;break;}else{label=121;break;}
 case 121: 
 var $415=((($410)+(1048320))|0);
 var $416=$415>>>16;
 var $417=$416&8;
 var $418=$410<<$417;
 var $419=((($418)+(520192))|0);
 var $420=$419>>>16;
 var $421=$420&4;
 var $422=$421|$417;
 var $423=$418<<$421;
 var $424=((($423)+(245760))|0);
 var $425=$424>>>16;
 var $426=$425&2;
 var $427=$422|$426;
 var $428=(((14)-($427))|0);
 var $429=$423<<$426;
 var $430=$429>>>15;
 var $431=((($428)+($430))|0);
 var $432=$431<<1;
 var $433=((($431)+(7))|0);
 var $434=$psize_1>>>($433>>>0);
 var $435=$434&1;
 var $436=$435|$432;
 var $I18_0=$436;label=122;break;
 case 122: 
 var $I18_0;
 var $438=((36384+($I18_0<<2))|0);
 var $439=(($p_0+28)|0);
 var $I18_0_c=$I18_0;
 HEAP32[(($439)>>2)]=$I18_0_c;
 var $440=(($p_0+20)|0);
 HEAP32[(($440)>>2)]=0;
 var $441=(($p_0+16)|0);
 HEAP32[(($441)>>2)]=0;
 var $442=HEAP32[((36084)>>2)];
 var $443=1<<$I18_0;
 var $444=$442&$443;
 var $445=($444|0)==0;
 if($445){label=123;break;}else{label=124;break;}
 case 123: 
 var $447=$442|$443;
 HEAP32[((36084)>>2)]=$447;
 HEAP32[(($438)>>2)]=$409;
 var $448=(($p_0+24)|0);
 var $_c=$438;
 HEAP32[(($448)>>2)]=$_c;
 var $449=(($p_0+12)|0);
 HEAP32[(($449)>>2)]=$p_0;
 var $450=(($p_0+8)|0);
 HEAP32[(($450)>>2)]=$p_0;
 label=136;break;
 case 124: 
 var $452=HEAP32[(($438)>>2)];
 var $453=($I18_0|0)==31;
 if($453){var $458=0;label=126;break;}else{label=125;break;}
 case 125: 
 var $455=$I18_0>>>1;
 var $456=(((25)-($455))|0);
 var $458=$456;label=126;break;
 case 126: 
 var $458;
 var $459=$psize_1<<$458;
 var $K19_0=$459;var $T_0=$452;label=127;break;
 case 127: 
 var $T_0;
 var $K19_0;
 var $461=(($T_0+4)|0);
 var $462=HEAP32[(($461)>>2)];
 var $463=$462&-8;
 var $464=($463|0)==($psize_1|0);
 if($464){label=132;break;}else{label=128;break;}
 case 128: 
 var $466=$K19_0>>>31;
 var $467=(($T_0+16+($466<<2))|0);
 var $468=HEAP32[(($467)>>2)];
 var $469=($468|0)==0;
 var $470=$K19_0<<1;
 if($469){label=129;break;}else{var $K19_0=$470;var $T_0=$468;label=127;break;}
 case 129: 
 var $472=$467;
 var $473=HEAP32[((36096)>>2)];
 var $474=($472>>>0)<($473>>>0);
 if($474){label=131;break;}else{label=130;break;}
 case 130: 
 HEAP32[(($467)>>2)]=$409;
 var $476=(($p_0+24)|0);
 var $T_0_c245=$T_0;
 HEAP32[(($476)>>2)]=$T_0_c245;
 var $477=(($p_0+12)|0);
 HEAP32[(($477)>>2)]=$p_0;
 var $478=(($p_0+8)|0);
 HEAP32[(($478)>>2)]=$p_0;
 label=136;break;
 case 131: 
 _abort();
 throw "Reached an unreachable!";
 case 132: 
 var $481=(($T_0+8)|0);
 var $482=HEAP32[(($481)>>2)];
 var $483=$T_0;
 var $484=HEAP32[((36096)>>2)];
 var $485=($483>>>0)<($484>>>0);
 if($485){label=135;break;}else{label=133;break;}
 case 133: 
 var $487=$482;
 var $488=($487>>>0)<($484>>>0);
 if($488){label=135;break;}else{label=134;break;}
 case 134: 
 var $490=(($482+12)|0);
 HEAP32[(($490)>>2)]=$409;
 HEAP32[(($481)>>2)]=$409;
 var $491=(($p_0+8)|0);
 var $_c244=$482;
 HEAP32[(($491)>>2)]=$_c244;
 var $492=(($p_0+12)|0);
 var $T_0_c=$T_0;
 HEAP32[(($492)>>2)]=$T_0_c;
 var $493=(($p_0+24)|0);
 HEAP32[(($493)>>2)]=0;
 label=136;break;
 case 135: 
 _abort();
 throw "Reached an unreachable!";
 case 136: 
 var $495=HEAP32[((36112)>>2)];
 var $496=((($495)-(1))|0);
 HEAP32[((36112)>>2)]=$496;
 var $497=($496|0)==0;
 if($497){var $sp_0_in_i=36536;label=137;break;}else{label=140;break;}
 case 137: 
 var $sp_0_in_i;
 var $sp_0_i=HEAP32[(($sp_0_in_i)>>2)];
 var $498=($sp_0_i|0)==0;
 var $499=(($sp_0_i+8)|0);
 if($498){label=138;break;}else{var $sp_0_in_i=$499;label=137;break;}
 case 138: 
 HEAP32[((36112)>>2)]=-1;
 label=140;break;
 case 139: 
 _abort();
 throw "Reached an unreachable!";
 case 140: 
 return;
  default: assert(0, "bad label: " + label);
 }
}
Module["_free"] = _free;
function _realloc($oldmem,$bytes){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=($oldmem|0)==0;
 if($1){label=2;break;}else{label=3;break;}
 case 2: 
 var $3=_malloc($bytes);
 var $mem_0=$3;label=11;break;
 case 3: 
 var $5=($bytes>>>0)>4294967231;
 if($5){label=4;break;}else{label=5;break;}
 case 4: 
 var $7=___errno_location();
 HEAP32[(($7)>>2)]=12;
 var $mem_0=0;label=11;break;
 case 5: 
 var $9=($bytes>>>0)<11;
 if($9){var $14=16;label=7;break;}else{label=6;break;}
 case 6: 
 var $11=((($bytes)+(11))|0);
 var $12=$11&-8;
 var $14=$12;label=7;break;
 case 7: 
 var $14;
 var $15=((($oldmem)-(8))|0);
 var $16=$15;
 var $17=_try_realloc_chunk($16,$14);
 var $18=($17|0)==0;
 if($18){label=9;break;}else{label=8;break;}
 case 8: 
 var $20=(($17+8)|0);
 var $21=$20;
 var $mem_0=$21;label=11;break;
 case 9: 
 var $23=_malloc($bytes);
 var $24=($23|0)==0;
 if($24){var $mem_0=0;label=11;break;}else{label=10;break;}
 case 10: 
 var $26=((($oldmem)-(4))|0);
 var $27=$26;
 var $28=HEAP32[(($27)>>2)];
 var $29=$28&-8;
 var $30=$28&3;
 var $31=($30|0)==0;
 var $32=($31?8:4);
 var $33=((($29)-($32))|0);
 var $34=($33>>>0)<($bytes>>>0);
 var $35=($34?$33:$bytes);
 assert($35 % 1 === 0);(_memcpy($23, $oldmem, $35)|0);
 _free($oldmem);
 var $mem_0=$23;label=11;break;
 case 11: 
 var $mem_0;
 return $mem_0;
  default: assert(0, "bad label: " + label);
 }
}
Module["_realloc"] = _realloc;
function _try_realloc_chunk($p,$nb){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=(($p+4)|0);
 var $2=HEAP32[(($1)>>2)];
 var $3=$2&-8;
 var $4=$p;
 var $5=(($4+$3)|0);
 var $6=$5;
 var $7=HEAP32[((36096)>>2)];
 var $8=($4>>>0)<($7>>>0);
 if($8){label=72;break;}else{label=2;break;}
 case 2: 
 var $10=$2&3;
 var $11=($10|0)!=1;
 var $12=($4>>>0)<($5>>>0);
 var $or_cond=$11&$12;
 if($or_cond){label=3;break;}else{label=72;break;}
 case 3: 
 var $_sum3334=$3|4;
 var $14=(($4+$_sum3334)|0);
 var $15=$14;
 var $16=HEAP32[(($15)>>2)];
 var $17=$16&1;
 var $phitmp=($17|0)==0;
 if($phitmp){label=72;break;}else{label=4;break;}
 case 4: 
 var $19=($10|0)==0;
 if($19){label=5;break;}else{label=9;break;}
 case 5: 
 var $21=($nb>>>0)<256;
 if($21){var $newp_0=0;label=73;break;}else{label=6;break;}
 case 6: 
 var $23=((($nb)+(4))|0);
 var $24=($3>>>0)<($23>>>0);
 if($24){label=8;break;}else{label=7;break;}
 case 7: 
 var $26=((($3)-($nb))|0);
 var $27=HEAP32[((9136)>>2)];
 var $28=$27<<1;
 var $29=($26>>>0)>($28>>>0);
 if($29){label=8;break;}else{var $newp_0=$p;label=73;break;}
 case 8: 
 var $newp_0=0;label=73;break;
 case 9: 
 var $32=($3>>>0)<($nb>>>0);
 if($32){label=12;break;}else{label=10;break;}
 case 10: 
 var $34=((($3)-($nb))|0);
 var $35=($34>>>0)>15;
 if($35){label=11;break;}else{var $newp_0=$p;label=73;break;}
 case 11: 
 var $37=(($4+$nb)|0);
 var $38=$37;
 var $39=$2&1;
 var $40=$39|$nb;
 var $41=$40|2;
 HEAP32[(($1)>>2)]=$41;
 var $_sum29=((($nb)+(4))|0);
 var $42=(($4+$_sum29)|0);
 var $43=$42;
 var $44=$34|3;
 HEAP32[(($43)>>2)]=$44;
 var $45=HEAP32[(($15)>>2)];
 var $46=$45|1;
 HEAP32[(($15)>>2)]=$46;
 _dispose_chunk($38,$34);
 var $newp_0=$p;label=73;break;
 case 12: 
 var $48=HEAP32[((36104)>>2)];
 var $49=($6|0)==($48|0);
 if($49){label=13;break;}else{label=15;break;}
 case 13: 
 var $51=HEAP32[((36092)>>2)];
 var $52=((($51)+($3))|0);
 var $53=($52>>>0)>($nb>>>0);
 if($53){label=14;break;}else{var $newp_0=0;label=73;break;}
 case 14: 
 var $55=((($52)-($nb))|0);
 var $56=(($4+$nb)|0);
 var $57=$56;
 var $58=$2&1;
 var $59=$58|$nb;
 var $60=$59|2;
 HEAP32[(($1)>>2)]=$60;
 var $_sum28=((($nb)+(4))|0);
 var $61=(($4+$_sum28)|0);
 var $62=$61;
 var $63=$55|1;
 HEAP32[(($62)>>2)]=$63;
 HEAP32[((36104)>>2)]=$57;
 HEAP32[((36092)>>2)]=$55;
 var $newp_0=$p;label=73;break;
 case 15: 
 var $65=HEAP32[((36100)>>2)];
 var $66=($6|0)==($65|0);
 if($66){label=16;break;}else{label=21;break;}
 case 16: 
 var $68=HEAP32[((36088)>>2)];
 var $69=((($68)+($3))|0);
 var $70=($69>>>0)<($nb>>>0);
 if($70){var $newp_0=0;label=73;break;}else{label=17;break;}
 case 17: 
 var $72=((($69)-($nb))|0);
 var $73=($72>>>0)>15;
 if($73){label=18;break;}else{label=19;break;}
 case 18: 
 var $75=(($4+$nb)|0);
 var $76=$75;
 var $77=(($4+$69)|0);
 var $78=$2&1;
 var $79=$78|$nb;
 var $80=$79|2;
 HEAP32[(($1)>>2)]=$80;
 var $_sum25=((($nb)+(4))|0);
 var $81=(($4+$_sum25)|0);
 var $82=$81;
 var $83=$72|1;
 HEAP32[(($82)>>2)]=$83;
 var $84=$77;
 HEAP32[(($84)>>2)]=$72;
 var $_sum26=((($69)+(4))|0);
 var $85=(($4+$_sum26)|0);
 var $86=$85;
 var $87=HEAP32[(($86)>>2)];
 var $88=$87&-2;
 HEAP32[(($86)>>2)]=$88;
 var $storemerge=$76;var $storemerge27=$72;label=20;break;
 case 19: 
 var $90=$2&1;
 var $91=$90|$69;
 var $92=$91|2;
 HEAP32[(($1)>>2)]=$92;
 var $_sum23=((($69)+(4))|0);
 var $93=(($4+$_sum23)|0);
 var $94=$93;
 var $95=HEAP32[(($94)>>2)];
 var $96=$95|1;
 HEAP32[(($94)>>2)]=$96;
 var $storemerge=0;var $storemerge27=0;label=20;break;
 case 20: 
 var $storemerge27;
 var $storemerge;
 HEAP32[((36088)>>2)]=$storemerge27;
 HEAP32[((36100)>>2)]=$storemerge;
 var $newp_0=$p;label=73;break;
 case 21: 
 var $99=$16&2;
 var $100=($99|0)==0;
 if($100){label=22;break;}else{var $newp_0=0;label=73;break;}
 case 22: 
 var $102=$16&-8;
 var $103=((($102)+($3))|0);
 var $104=($103>>>0)<($nb>>>0);
 if($104){var $newp_0=0;label=73;break;}else{label=23;break;}
 case 23: 
 var $106=((($103)-($nb))|0);
 var $107=$16>>>3;
 var $108=($16>>>0)<256;
 if($108){label=24;break;}else{label=36;break;}
 case 24: 
 var $_sum17=((($3)+(8))|0);
 var $110=(($4+$_sum17)|0);
 var $111=$110;
 var $112=HEAP32[(($111)>>2)];
 var $_sum18=((($3)+(12))|0);
 var $113=(($4+$_sum18)|0);
 var $114=$113;
 var $115=HEAP32[(($114)>>2)];
 var $116=$107<<1;
 var $117=((36120+($116<<2))|0);
 var $118=$117;
 var $119=($112|0)==($118|0);
 if($119){label=27;break;}else{label=25;break;}
 case 25: 
 var $121=$112;
 var $122=($121>>>0)<($7>>>0);
 if($122){label=35;break;}else{label=26;break;}
 case 26: 
 var $124=(($112+12)|0);
 var $125=HEAP32[(($124)>>2)];
 var $126=($125|0)==($6|0);
 if($126){label=27;break;}else{label=35;break;}
 case 27: 
 var $127=($115|0)==($112|0);
 if($127){label=28;break;}else{label=29;break;}
 case 28: 
 var $129=1<<$107;
 var $130=$129^-1;
 var $131=HEAP32[((36080)>>2)];
 var $132=$131&$130;
 HEAP32[((36080)>>2)]=$132;
 label=69;break;
 case 29: 
 var $134=($115|0)==($118|0);
 if($134){label=30;break;}else{label=31;break;}
 case 30: 
 var $_pre=(($115+8)|0);
 var $_pre_phi=$_pre;label=33;break;
 case 31: 
 var $136=$115;
 var $137=($136>>>0)<($7>>>0);
 if($137){label=34;break;}else{label=32;break;}
 case 32: 
 var $139=(($115+8)|0);
 var $140=HEAP32[(($139)>>2)];
 var $141=($140|0)==($6|0);
 if($141){var $_pre_phi=$139;label=33;break;}else{label=34;break;}
 case 33: 
 var $_pre_phi;
 var $142=(($112+12)|0);
 HEAP32[(($142)>>2)]=$115;
 HEAP32[(($_pre_phi)>>2)]=$112;
 label=69;break;
 case 34: 
 _abort();
 throw "Reached an unreachable!";
 case 35: 
 _abort();
 throw "Reached an unreachable!";
 case 36: 
 var $144=$5;
 var $_sum=((($3)+(24))|0);
 var $145=(($4+$_sum)|0);
 var $146=$145;
 var $147=HEAP32[(($146)>>2)];
 var $_sum2=((($3)+(12))|0);
 var $148=(($4+$_sum2)|0);
 var $149=$148;
 var $150=HEAP32[(($149)>>2)];
 var $151=($150|0)==($144|0);
 if($151){label=42;break;}else{label=37;break;}
 case 37: 
 var $_sum14=((($3)+(8))|0);
 var $153=(($4+$_sum14)|0);
 var $154=$153;
 var $155=HEAP32[(($154)>>2)];
 var $156=$155;
 var $157=($156>>>0)<($7>>>0);
 if($157){label=41;break;}else{label=38;break;}
 case 38: 
 var $159=(($155+12)|0);
 var $160=HEAP32[(($159)>>2)];
 var $161=($160|0)==($144|0);
 if($161){label=39;break;}else{label=41;break;}
 case 39: 
 var $163=(($150+8)|0);
 var $164=HEAP32[(($163)>>2)];
 var $165=($164|0)==($144|0);
 if($165){label=40;break;}else{label=41;break;}
 case 40: 
 HEAP32[(($159)>>2)]=$150;
 HEAP32[(($163)>>2)]=$155;
 var $R_1=$150;label=49;break;
 case 41: 
 _abort();
 throw "Reached an unreachable!";
 case 42: 
 var $_sum4=((($3)+(20))|0);
 var $168=(($4+$_sum4)|0);
 var $169=$168;
 var $170=HEAP32[(($169)>>2)];
 var $171=($170|0)==0;
 if($171){label=43;break;}else{var $R_0=$170;var $RP_0=$169;label=44;break;}
 case 43: 
 var $_sum3=((($3)+(16))|0);
 var $173=(($4+$_sum3)|0);
 var $174=$173;
 var $175=HEAP32[(($174)>>2)];
 var $176=($175|0)==0;
 if($176){var $R_1=0;label=49;break;}else{var $R_0=$175;var $RP_0=$174;label=44;break;}
 case 44: 
 var $RP_0;
 var $R_0;
 var $177=(($R_0+20)|0);
 var $178=HEAP32[(($177)>>2)];
 var $179=($178|0)==0;
 if($179){label=45;break;}else{var $R_0=$178;var $RP_0=$177;label=44;break;}
 case 45: 
 var $181=(($R_0+16)|0);
 var $182=HEAP32[(($181)>>2)];
 var $183=($182|0)==0;
 if($183){label=46;break;}else{var $R_0=$182;var $RP_0=$181;label=44;break;}
 case 46: 
 var $185=$RP_0;
 var $186=($185>>>0)<($7>>>0);
 if($186){label=48;break;}else{label=47;break;}
 case 47: 
 HEAP32[(($RP_0)>>2)]=0;
 var $R_1=$R_0;label=49;break;
 case 48: 
 _abort();
 throw "Reached an unreachable!";
 case 49: 
 var $R_1;
 var $190=($147|0)==0;
 if($190){label=69;break;}else{label=50;break;}
 case 50: 
 var $_sum11=((($3)+(28))|0);
 var $192=(($4+$_sum11)|0);
 var $193=$192;
 var $194=HEAP32[(($193)>>2)];
 var $195=((36384+($194<<2))|0);
 var $196=HEAP32[(($195)>>2)];
 var $197=($144|0)==($196|0);
 if($197){label=51;break;}else{label=53;break;}
 case 51: 
 HEAP32[(($195)>>2)]=$R_1;
 var $cond=($R_1|0)==0;
 if($cond){label=52;break;}else{label=59;break;}
 case 52: 
 var $199=HEAP32[(($193)>>2)];
 var $200=1<<$199;
 var $201=$200^-1;
 var $202=HEAP32[((36084)>>2)];
 var $203=$202&$201;
 HEAP32[((36084)>>2)]=$203;
 label=69;break;
 case 53: 
 var $205=$147;
 var $206=HEAP32[((36096)>>2)];
 var $207=($205>>>0)<($206>>>0);
 if($207){label=57;break;}else{label=54;break;}
 case 54: 
 var $209=(($147+16)|0);
 var $210=HEAP32[(($209)>>2)];
 var $211=($210|0)==($144|0);
 if($211){label=55;break;}else{label=56;break;}
 case 55: 
 HEAP32[(($209)>>2)]=$R_1;
 label=58;break;
 case 56: 
 var $214=(($147+20)|0);
 HEAP32[(($214)>>2)]=$R_1;
 label=58;break;
 case 57: 
 _abort();
 throw "Reached an unreachable!";
 case 58: 
 var $217=($R_1|0)==0;
 if($217){label=69;break;}else{label=59;break;}
 case 59: 
 var $219=$R_1;
 var $220=HEAP32[((36096)>>2)];
 var $221=($219>>>0)<($220>>>0);
 if($221){label=68;break;}else{label=60;break;}
 case 60: 
 var $223=(($R_1+24)|0);
 HEAP32[(($223)>>2)]=$147;
 var $_sum12=((($3)+(16))|0);
 var $224=(($4+$_sum12)|0);
 var $225=$224;
 var $226=HEAP32[(($225)>>2)];
 var $227=($226|0)==0;
 if($227){label=64;break;}else{label=61;break;}
 case 61: 
 var $229=$226;
 var $230=HEAP32[((36096)>>2)];
 var $231=($229>>>0)<($230>>>0);
 if($231){label=63;break;}else{label=62;break;}
 case 62: 
 var $233=(($R_1+16)|0);
 HEAP32[(($233)>>2)]=$226;
 var $234=(($226+24)|0);
 HEAP32[(($234)>>2)]=$R_1;
 label=64;break;
 case 63: 
 _abort();
 throw "Reached an unreachable!";
 case 64: 
 var $_sum13=((($3)+(20))|0);
 var $237=(($4+$_sum13)|0);
 var $238=$237;
 var $239=HEAP32[(($238)>>2)];
 var $240=($239|0)==0;
 if($240){label=69;break;}else{label=65;break;}
 case 65: 
 var $242=$239;
 var $243=HEAP32[((36096)>>2)];
 var $244=($242>>>0)<($243>>>0);
 if($244){label=67;break;}else{label=66;break;}
 case 66: 
 var $246=(($R_1+20)|0);
 HEAP32[(($246)>>2)]=$239;
 var $247=(($239+24)|0);
 HEAP32[(($247)>>2)]=$R_1;
 label=69;break;
 case 67: 
 _abort();
 throw "Reached an unreachable!";
 case 68: 
 _abort();
 throw "Reached an unreachable!";
 case 69: 
 var $251=($106>>>0)<16;
 if($251){label=70;break;}else{label=71;break;}
 case 70: 
 var $253=HEAP32[(($1)>>2)];
 var $254=$253&1;
 var $255=$103|$254;
 var $256=$255|2;
 HEAP32[(($1)>>2)]=$256;
 var $_sum910=$103|4;
 var $257=(($4+$_sum910)|0);
 var $258=$257;
 var $259=HEAP32[(($258)>>2)];
 var $260=$259|1;
 HEAP32[(($258)>>2)]=$260;
 var $newp_0=$p;label=73;break;
 case 71: 
 var $262=(($4+$nb)|0);
 var $263=$262;
 var $264=HEAP32[(($1)>>2)];
 var $265=$264&1;
 var $266=$265|$nb;
 var $267=$266|2;
 HEAP32[(($1)>>2)]=$267;
 var $_sum5=((($nb)+(4))|0);
 var $268=(($4+$_sum5)|0);
 var $269=$268;
 var $270=$106|3;
 HEAP32[(($269)>>2)]=$270;
 var $_sum78=$103|4;
 var $271=(($4+$_sum78)|0);
 var $272=$271;
 var $273=HEAP32[(($272)>>2)];
 var $274=$273|1;
 HEAP32[(($272)>>2)]=$274;
 _dispose_chunk($263,$106);
 var $newp_0=$p;label=73;break;
 case 72: 
 _abort();
 throw "Reached an unreachable!";
 case 73: 
 var $newp_0;
 return $newp_0;
  default: assert(0, "bad label: " + label);
 }
}
function _dispose_chunk($p,$psize){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=$p;
 var $2=(($1+$psize)|0);
 var $3=$2;
 var $4=(($p+4)|0);
 var $5=HEAP32[(($4)>>2)];
 var $6=$5&1;
 var $7=($6|0)==0;
 if($7){label=2;break;}else{var $_0=$p;var $_0277=$psize;label=54;break;}
 case 2: 
 var $9=(($p)|0);
 var $10=HEAP32[(($9)>>2)];
 var $11=$5&3;
 var $12=($11|0)==0;
 if($12){label=134;break;}else{label=3;break;}
 case 3: 
 var $14=(((-$10))|0);
 var $15=(($1+$14)|0);
 var $16=$15;
 var $17=((($10)+($psize))|0);
 var $18=HEAP32[((36096)>>2)];
 var $19=($15>>>0)<($18>>>0);
 if($19){label=53;break;}else{label=4;break;}
 case 4: 
 var $21=HEAP32[((36100)>>2)];
 var $22=($16|0)==($21|0);
 if($22){label=51;break;}else{label=5;break;}
 case 5: 
 var $24=$10>>>3;
 var $25=($10>>>0)<256;
 if($25){label=6;break;}else{label=18;break;}
 case 6: 
 var $_sum35=(((8)-($10))|0);
 var $27=(($1+$_sum35)|0);
 var $28=$27;
 var $29=HEAP32[(($28)>>2)];
 var $_sum36=(((12)-($10))|0);
 var $30=(($1+$_sum36)|0);
 var $31=$30;
 var $32=HEAP32[(($31)>>2)];
 var $33=$24<<1;
 var $34=((36120+($33<<2))|0);
 var $35=$34;
 var $36=($29|0)==($35|0);
 if($36){label=9;break;}else{label=7;break;}
 case 7: 
 var $38=$29;
 var $39=($38>>>0)<($18>>>0);
 if($39){label=17;break;}else{label=8;break;}
 case 8: 
 var $41=(($29+12)|0);
 var $42=HEAP32[(($41)>>2)];
 var $43=($42|0)==($16|0);
 if($43){label=9;break;}else{label=17;break;}
 case 9: 
 var $44=($32|0)==($29|0);
 if($44){label=10;break;}else{label=11;break;}
 case 10: 
 var $46=1<<$24;
 var $47=$46^-1;
 var $48=HEAP32[((36080)>>2)];
 var $49=$48&$47;
 HEAP32[((36080)>>2)]=$49;
 var $_0=$16;var $_0277=$17;label=54;break;
 case 11: 
 var $51=($32|0)==($35|0);
 if($51){label=12;break;}else{label=13;break;}
 case 12: 
 var $_pre62=(($32+8)|0);
 var $_pre_phi63=$_pre62;label=15;break;
 case 13: 
 var $53=$32;
 var $54=($53>>>0)<($18>>>0);
 if($54){label=16;break;}else{label=14;break;}
 case 14: 
 var $56=(($32+8)|0);
 var $57=HEAP32[(($56)>>2)];
 var $58=($57|0)==($16|0);
 if($58){var $_pre_phi63=$56;label=15;break;}else{label=16;break;}
 case 15: 
 var $_pre_phi63;
 var $59=(($29+12)|0);
 HEAP32[(($59)>>2)]=$32;
 HEAP32[(($_pre_phi63)>>2)]=$29;
 var $_0=$16;var $_0277=$17;label=54;break;
 case 16: 
 _abort();
 throw "Reached an unreachable!";
 case 17: 
 _abort();
 throw "Reached an unreachable!";
 case 18: 
 var $61=$15;
 var $_sum26=(((24)-($10))|0);
 var $62=(($1+$_sum26)|0);
 var $63=$62;
 var $64=HEAP32[(($63)>>2)];
 var $_sum27=(((12)-($10))|0);
 var $65=(($1+$_sum27)|0);
 var $66=$65;
 var $67=HEAP32[(($66)>>2)];
 var $68=($67|0)==($61|0);
 if($68){label=24;break;}else{label=19;break;}
 case 19: 
 var $_sum33=(((8)-($10))|0);
 var $70=(($1+$_sum33)|0);
 var $71=$70;
 var $72=HEAP32[(($71)>>2)];
 var $73=$72;
 var $74=($73>>>0)<($18>>>0);
 if($74){label=23;break;}else{label=20;break;}
 case 20: 
 var $76=(($72+12)|0);
 var $77=HEAP32[(($76)>>2)];
 var $78=($77|0)==($61|0);
 if($78){label=21;break;}else{label=23;break;}
 case 21: 
 var $80=(($67+8)|0);
 var $81=HEAP32[(($80)>>2)];
 var $82=($81|0)==($61|0);
 if($82){label=22;break;}else{label=23;break;}
 case 22: 
 HEAP32[(($76)>>2)]=$67;
 HEAP32[(($80)>>2)]=$72;
 var $R_1=$67;label=31;break;
 case 23: 
 _abort();
 throw "Reached an unreachable!";
 case 24: 
 var $_sum28=(((16)-($10))|0);
 var $_sum29=((($_sum28)+(4))|0);
 var $85=(($1+$_sum29)|0);
 var $86=$85;
 var $87=HEAP32[(($86)>>2)];
 var $88=($87|0)==0;
 if($88){label=25;break;}else{var $R_0=$87;var $RP_0=$86;label=26;break;}
 case 25: 
 var $90=(($1+$_sum28)|0);
 var $91=$90;
 var $92=HEAP32[(($91)>>2)];
 var $93=($92|0)==0;
 if($93){var $R_1=0;label=31;break;}else{var $R_0=$92;var $RP_0=$91;label=26;break;}
 case 26: 
 var $RP_0;
 var $R_0;
 var $94=(($R_0+20)|0);
 var $95=HEAP32[(($94)>>2)];
 var $96=($95|0)==0;
 if($96){label=27;break;}else{var $R_0=$95;var $RP_0=$94;label=26;break;}
 case 27: 
 var $98=(($R_0+16)|0);
 var $99=HEAP32[(($98)>>2)];
 var $100=($99|0)==0;
 if($100){label=28;break;}else{var $R_0=$99;var $RP_0=$98;label=26;break;}
 case 28: 
 var $102=$RP_0;
 var $103=($102>>>0)<($18>>>0);
 if($103){label=30;break;}else{label=29;break;}
 case 29: 
 HEAP32[(($RP_0)>>2)]=0;
 var $R_1=$R_0;label=31;break;
 case 30: 
 _abort();
 throw "Reached an unreachable!";
 case 31: 
 var $R_1;
 var $107=($64|0)==0;
 if($107){var $_0=$16;var $_0277=$17;label=54;break;}else{label=32;break;}
 case 32: 
 var $_sum30=(((28)-($10))|0);
 var $109=(($1+$_sum30)|0);
 var $110=$109;
 var $111=HEAP32[(($110)>>2)];
 var $112=((36384+($111<<2))|0);
 var $113=HEAP32[(($112)>>2)];
 var $114=($61|0)==($113|0);
 if($114){label=33;break;}else{label=35;break;}
 case 33: 
 HEAP32[(($112)>>2)]=$R_1;
 var $cond=($R_1|0)==0;
 if($cond){label=34;break;}else{label=41;break;}
 case 34: 
 var $116=HEAP32[(($110)>>2)];
 var $117=1<<$116;
 var $118=$117^-1;
 var $119=HEAP32[((36084)>>2)];
 var $120=$119&$118;
 HEAP32[((36084)>>2)]=$120;
 var $_0=$16;var $_0277=$17;label=54;break;
 case 35: 
 var $122=$64;
 var $123=HEAP32[((36096)>>2)];
 var $124=($122>>>0)<($123>>>0);
 if($124){label=39;break;}else{label=36;break;}
 case 36: 
 var $126=(($64+16)|0);
 var $127=HEAP32[(($126)>>2)];
 var $128=($127|0)==($61|0);
 if($128){label=37;break;}else{label=38;break;}
 case 37: 
 HEAP32[(($126)>>2)]=$R_1;
 label=40;break;
 case 38: 
 var $131=(($64+20)|0);
 HEAP32[(($131)>>2)]=$R_1;
 label=40;break;
 case 39: 
 _abort();
 throw "Reached an unreachable!";
 case 40: 
 var $134=($R_1|0)==0;
 if($134){var $_0=$16;var $_0277=$17;label=54;break;}else{label=41;break;}
 case 41: 
 var $136=$R_1;
 var $137=HEAP32[((36096)>>2)];
 var $138=($136>>>0)<($137>>>0);
 if($138){label=50;break;}else{label=42;break;}
 case 42: 
 var $140=(($R_1+24)|0);
 HEAP32[(($140)>>2)]=$64;
 var $_sum31=(((16)-($10))|0);
 var $141=(($1+$_sum31)|0);
 var $142=$141;
 var $143=HEAP32[(($142)>>2)];
 var $144=($143|0)==0;
 if($144){label=46;break;}else{label=43;break;}
 case 43: 
 var $146=$143;
 var $147=HEAP32[((36096)>>2)];
 var $148=($146>>>0)<($147>>>0);
 if($148){label=45;break;}else{label=44;break;}
 case 44: 
 var $150=(($R_1+16)|0);
 HEAP32[(($150)>>2)]=$143;
 var $151=(($143+24)|0);
 HEAP32[(($151)>>2)]=$R_1;
 label=46;break;
 case 45: 
 _abort();
 throw "Reached an unreachable!";
 case 46: 
 var $_sum32=((($_sum31)+(4))|0);
 var $154=(($1+$_sum32)|0);
 var $155=$154;
 var $156=HEAP32[(($155)>>2)];
 var $157=($156|0)==0;
 if($157){var $_0=$16;var $_0277=$17;label=54;break;}else{label=47;break;}
 case 47: 
 var $159=$156;
 var $160=HEAP32[((36096)>>2)];
 var $161=($159>>>0)<($160>>>0);
 if($161){label=49;break;}else{label=48;break;}
 case 48: 
 var $163=(($R_1+20)|0);
 HEAP32[(($163)>>2)]=$156;
 var $164=(($156+24)|0);
 HEAP32[(($164)>>2)]=$R_1;
 var $_0=$16;var $_0277=$17;label=54;break;
 case 49: 
 _abort();
 throw "Reached an unreachable!";
 case 50: 
 _abort();
 throw "Reached an unreachable!";
 case 51: 
 var $_sum=((($psize)+(4))|0);
 var $168=(($1+$_sum)|0);
 var $169=$168;
 var $170=HEAP32[(($169)>>2)];
 var $171=$170&3;
 var $172=($171|0)==3;
 if($172){label=52;break;}else{var $_0=$16;var $_0277=$17;label=54;break;}
 case 52: 
 HEAP32[((36088)>>2)]=$17;
 var $174=HEAP32[(($169)>>2)];
 var $175=$174&-2;
 HEAP32[(($169)>>2)]=$175;
 var $176=$17|1;
 var $_sum24=(((4)-($10))|0);
 var $177=(($1+$_sum24)|0);
 var $178=$177;
 HEAP32[(($178)>>2)]=$176;
 var $179=$2;
 HEAP32[(($179)>>2)]=$17;
 label=134;break;
 case 53: 
 _abort();
 throw "Reached an unreachable!";
 case 54: 
 var $_0277;
 var $_0;
 var $181=HEAP32[((36096)>>2)];
 var $182=($2>>>0)<($181>>>0);
 if($182){label=133;break;}else{label=55;break;}
 case 55: 
 var $_sum1=((($psize)+(4))|0);
 var $184=(($1+$_sum1)|0);
 var $185=$184;
 var $186=HEAP32[(($185)>>2)];
 var $187=$186&2;
 var $188=($187|0)==0;
 if($188){label=56;break;}else{label=109;break;}
 case 56: 
 var $190=HEAP32[((36104)>>2)];
 var $191=($3|0)==($190|0);
 if($191){label=57;break;}else{label=59;break;}
 case 57: 
 var $193=HEAP32[((36092)>>2)];
 var $194=((($193)+($_0277))|0);
 HEAP32[((36092)>>2)]=$194;
 HEAP32[((36104)>>2)]=$_0;
 var $195=$194|1;
 var $196=(($_0+4)|0);
 HEAP32[(($196)>>2)]=$195;
 var $197=HEAP32[((36100)>>2)];
 var $198=($_0|0)==($197|0);
 if($198){label=58;break;}else{label=134;break;}
 case 58: 
 HEAP32[((36100)>>2)]=0;
 HEAP32[((36088)>>2)]=0;
 label=134;break;
 case 59: 
 var $201=HEAP32[((36100)>>2)];
 var $202=($3|0)==($201|0);
 if($202){label=60;break;}else{label=61;break;}
 case 60: 
 var $204=HEAP32[((36088)>>2)];
 var $205=((($204)+($_0277))|0);
 HEAP32[((36088)>>2)]=$205;
 HEAP32[((36100)>>2)]=$_0;
 var $206=$205|1;
 var $207=(($_0+4)|0);
 HEAP32[(($207)>>2)]=$206;
 var $208=$_0;
 var $209=(($208+$205)|0);
 var $210=$209;
 HEAP32[(($210)>>2)]=$205;
 label=134;break;
 case 61: 
 var $212=$186&-8;
 var $213=((($212)+($_0277))|0);
 var $214=$186>>>3;
 var $215=($186>>>0)<256;
 if($215){label=62;break;}else{label=74;break;}
 case 62: 
 var $_sum20=((($psize)+(8))|0);
 var $217=(($1+$_sum20)|0);
 var $218=$217;
 var $219=HEAP32[(($218)>>2)];
 var $_sum21=((($psize)+(12))|0);
 var $220=(($1+$_sum21)|0);
 var $221=$220;
 var $222=HEAP32[(($221)>>2)];
 var $223=$214<<1;
 var $224=((36120+($223<<2))|0);
 var $225=$224;
 var $226=($219|0)==($225|0);
 if($226){label=65;break;}else{label=63;break;}
 case 63: 
 var $228=$219;
 var $229=($228>>>0)<($181>>>0);
 if($229){label=73;break;}else{label=64;break;}
 case 64: 
 var $231=(($219+12)|0);
 var $232=HEAP32[(($231)>>2)];
 var $233=($232|0)==($3|0);
 if($233){label=65;break;}else{label=73;break;}
 case 65: 
 var $234=($222|0)==($219|0);
 if($234){label=66;break;}else{label=67;break;}
 case 66: 
 var $236=1<<$214;
 var $237=$236^-1;
 var $238=HEAP32[((36080)>>2)];
 var $239=$238&$237;
 HEAP32[((36080)>>2)]=$239;
 label=107;break;
 case 67: 
 var $241=($222|0)==($225|0);
 if($241){label=68;break;}else{label=69;break;}
 case 68: 
 var $_pre60=(($222+8)|0);
 var $_pre_phi61=$_pre60;label=71;break;
 case 69: 
 var $243=$222;
 var $244=($243>>>0)<($181>>>0);
 if($244){label=72;break;}else{label=70;break;}
 case 70: 
 var $246=(($222+8)|0);
 var $247=HEAP32[(($246)>>2)];
 var $248=($247|0)==($3|0);
 if($248){var $_pre_phi61=$246;label=71;break;}else{label=72;break;}
 case 71: 
 var $_pre_phi61;
 var $249=(($219+12)|0);
 HEAP32[(($249)>>2)]=$222;
 HEAP32[(($_pre_phi61)>>2)]=$219;
 label=107;break;
 case 72: 
 _abort();
 throw "Reached an unreachable!";
 case 73: 
 _abort();
 throw "Reached an unreachable!";
 case 74: 
 var $251=$2;
 var $_sum2=((($psize)+(24))|0);
 var $252=(($1+$_sum2)|0);
 var $253=$252;
 var $254=HEAP32[(($253)>>2)];
 var $_sum3=((($psize)+(12))|0);
 var $255=(($1+$_sum3)|0);
 var $256=$255;
 var $257=HEAP32[(($256)>>2)];
 var $258=($257|0)==($251|0);
 if($258){label=80;break;}else{label=75;break;}
 case 75: 
 var $_sum18=((($psize)+(8))|0);
 var $260=(($1+$_sum18)|0);
 var $261=$260;
 var $262=HEAP32[(($261)>>2)];
 var $263=$262;
 var $264=($263>>>0)<($181>>>0);
 if($264){label=79;break;}else{label=76;break;}
 case 76: 
 var $266=(($262+12)|0);
 var $267=HEAP32[(($266)>>2)];
 var $268=($267|0)==($251|0);
 if($268){label=77;break;}else{label=79;break;}
 case 77: 
 var $270=(($257+8)|0);
 var $271=HEAP32[(($270)>>2)];
 var $272=($271|0)==($251|0);
 if($272){label=78;break;}else{label=79;break;}
 case 78: 
 HEAP32[(($266)>>2)]=$257;
 HEAP32[(($270)>>2)]=$262;
 var $R7_1=$257;label=87;break;
 case 79: 
 _abort();
 throw "Reached an unreachable!";
 case 80: 
 var $_sum5=((($psize)+(20))|0);
 var $275=(($1+$_sum5)|0);
 var $276=$275;
 var $277=HEAP32[(($276)>>2)];
 var $278=($277|0)==0;
 if($278){label=81;break;}else{var $R7_0=$277;var $RP9_0=$276;label=82;break;}
 case 81: 
 var $_sum4=((($psize)+(16))|0);
 var $280=(($1+$_sum4)|0);
 var $281=$280;
 var $282=HEAP32[(($281)>>2)];
 var $283=($282|0)==0;
 if($283){var $R7_1=0;label=87;break;}else{var $R7_0=$282;var $RP9_0=$281;label=82;break;}
 case 82: 
 var $RP9_0;
 var $R7_0;
 var $284=(($R7_0+20)|0);
 var $285=HEAP32[(($284)>>2)];
 var $286=($285|0)==0;
 if($286){label=83;break;}else{var $R7_0=$285;var $RP9_0=$284;label=82;break;}
 case 83: 
 var $288=(($R7_0+16)|0);
 var $289=HEAP32[(($288)>>2)];
 var $290=($289|0)==0;
 if($290){label=84;break;}else{var $R7_0=$289;var $RP9_0=$288;label=82;break;}
 case 84: 
 var $292=$RP9_0;
 var $293=($292>>>0)<($181>>>0);
 if($293){label=86;break;}else{label=85;break;}
 case 85: 
 HEAP32[(($RP9_0)>>2)]=0;
 var $R7_1=$R7_0;label=87;break;
 case 86: 
 _abort();
 throw "Reached an unreachable!";
 case 87: 
 var $R7_1;
 var $297=($254|0)==0;
 if($297){label=107;break;}else{label=88;break;}
 case 88: 
 var $_sum15=((($psize)+(28))|0);
 var $299=(($1+$_sum15)|0);
 var $300=$299;
 var $301=HEAP32[(($300)>>2)];
 var $302=((36384+($301<<2))|0);
 var $303=HEAP32[(($302)>>2)];
 var $304=($251|0)==($303|0);
 if($304){label=89;break;}else{label=91;break;}
 case 89: 
 HEAP32[(($302)>>2)]=$R7_1;
 var $cond53=($R7_1|0)==0;
 if($cond53){label=90;break;}else{label=97;break;}
 case 90: 
 var $306=HEAP32[(($300)>>2)];
 var $307=1<<$306;
 var $308=$307^-1;
 var $309=HEAP32[((36084)>>2)];
 var $310=$309&$308;
 HEAP32[((36084)>>2)]=$310;
 label=107;break;
 case 91: 
 var $312=$254;
 var $313=HEAP32[((36096)>>2)];
 var $314=($312>>>0)<($313>>>0);
 if($314){label=95;break;}else{label=92;break;}
 case 92: 
 var $316=(($254+16)|0);
 var $317=HEAP32[(($316)>>2)];
 var $318=($317|0)==($251|0);
 if($318){label=93;break;}else{label=94;break;}
 case 93: 
 HEAP32[(($316)>>2)]=$R7_1;
 label=96;break;
 case 94: 
 var $321=(($254+20)|0);
 HEAP32[(($321)>>2)]=$R7_1;
 label=96;break;
 case 95: 
 _abort();
 throw "Reached an unreachable!";
 case 96: 
 var $324=($R7_1|0)==0;
 if($324){label=107;break;}else{label=97;break;}
 case 97: 
 var $326=$R7_1;
 var $327=HEAP32[((36096)>>2)];
 var $328=($326>>>0)<($327>>>0);
 if($328){label=106;break;}else{label=98;break;}
 case 98: 
 var $330=(($R7_1+24)|0);
 HEAP32[(($330)>>2)]=$254;
 var $_sum16=((($psize)+(16))|0);
 var $331=(($1+$_sum16)|0);
 var $332=$331;
 var $333=HEAP32[(($332)>>2)];
 var $334=($333|0)==0;
 if($334){label=102;break;}else{label=99;break;}
 case 99: 
 var $336=$333;
 var $337=HEAP32[((36096)>>2)];
 var $338=($336>>>0)<($337>>>0);
 if($338){label=101;break;}else{label=100;break;}
 case 100: 
 var $340=(($R7_1+16)|0);
 HEAP32[(($340)>>2)]=$333;
 var $341=(($333+24)|0);
 HEAP32[(($341)>>2)]=$R7_1;
 label=102;break;
 case 101: 
 _abort();
 throw "Reached an unreachable!";
 case 102: 
 var $_sum17=((($psize)+(20))|0);
 var $344=(($1+$_sum17)|0);
 var $345=$344;
 var $346=HEAP32[(($345)>>2)];
 var $347=($346|0)==0;
 if($347){label=107;break;}else{label=103;break;}
 case 103: 
 var $349=$346;
 var $350=HEAP32[((36096)>>2)];
 var $351=($349>>>0)<($350>>>0);
 if($351){label=105;break;}else{label=104;break;}
 case 104: 
 var $353=(($R7_1+20)|0);
 HEAP32[(($353)>>2)]=$346;
 var $354=(($346+24)|0);
 HEAP32[(($354)>>2)]=$R7_1;
 label=107;break;
 case 105: 
 _abort();
 throw "Reached an unreachable!";
 case 106: 
 _abort();
 throw "Reached an unreachable!";
 case 107: 
 var $358=$213|1;
 var $359=(($_0+4)|0);
 HEAP32[(($359)>>2)]=$358;
 var $360=$_0;
 var $361=(($360+$213)|0);
 var $362=$361;
 HEAP32[(($362)>>2)]=$213;
 var $363=HEAP32[((36100)>>2)];
 var $364=($_0|0)==($363|0);
 if($364){label=108;break;}else{var $_1=$213;label=110;break;}
 case 108: 
 HEAP32[((36088)>>2)]=$213;
 label=134;break;
 case 109: 
 var $367=$186&-2;
 HEAP32[(($185)>>2)]=$367;
 var $368=$_0277|1;
 var $369=(($_0+4)|0);
 HEAP32[(($369)>>2)]=$368;
 var $370=$_0;
 var $371=(($370+$_0277)|0);
 var $372=$371;
 HEAP32[(($372)>>2)]=$_0277;
 var $_1=$_0277;label=110;break;
 case 110: 
 var $_1;
 var $374=$_1>>>3;
 var $375=($_1>>>0)<256;
 if($375){label=111;break;}else{label=116;break;}
 case 111: 
 var $377=$374<<1;
 var $378=((36120+($377<<2))|0);
 var $379=$378;
 var $380=HEAP32[((36080)>>2)];
 var $381=1<<$374;
 var $382=$380&$381;
 var $383=($382|0)==0;
 if($383){label=112;break;}else{label=113;break;}
 case 112: 
 var $385=$380|$381;
 HEAP32[((36080)>>2)]=$385;
 var $_sum13_pre=((($377)+(2))|0);
 var $_pre=((36120+($_sum13_pre<<2))|0);
 var $F16_0=$379;var $_pre_phi=$_pre;label=115;break;
 case 113: 
 var $_sum14=((($377)+(2))|0);
 var $387=((36120+($_sum14<<2))|0);
 var $388=HEAP32[(($387)>>2)];
 var $389=$388;
 var $390=HEAP32[((36096)>>2)];
 var $391=($389>>>0)<($390>>>0);
 if($391){label=114;break;}else{var $F16_0=$388;var $_pre_phi=$387;label=115;break;}
 case 114: 
 _abort();
 throw "Reached an unreachable!";
 case 115: 
 var $_pre_phi;
 var $F16_0;
 HEAP32[(($_pre_phi)>>2)]=$_0;
 var $394=(($F16_0+12)|0);
 HEAP32[(($394)>>2)]=$_0;
 var $395=(($_0+8)|0);
 HEAP32[(($395)>>2)]=$F16_0;
 var $396=(($_0+12)|0);
 HEAP32[(($396)>>2)]=$379;
 label=134;break;
 case 116: 
 var $398=$_0;
 var $399=$_1>>>8;
 var $400=($399|0)==0;
 if($400){var $I19_0=0;label=119;break;}else{label=117;break;}
 case 117: 
 var $402=($_1>>>0)>16777215;
 if($402){var $I19_0=31;label=119;break;}else{label=118;break;}
 case 118: 
 var $404=((($399)+(1048320))|0);
 var $405=$404>>>16;
 var $406=$405&8;
 var $407=$399<<$406;
 var $408=((($407)+(520192))|0);
 var $409=$408>>>16;
 var $410=$409&4;
 var $411=$410|$406;
 var $412=$407<<$410;
 var $413=((($412)+(245760))|0);
 var $414=$413>>>16;
 var $415=$414&2;
 var $416=$411|$415;
 var $417=(((14)-($416))|0);
 var $418=$412<<$415;
 var $419=$418>>>15;
 var $420=((($417)+($419))|0);
 var $421=$420<<1;
 var $422=((($420)+(7))|0);
 var $423=$_1>>>($422>>>0);
 var $424=$423&1;
 var $425=$424|$421;
 var $I19_0=$425;label=119;break;
 case 119: 
 var $I19_0;
 var $427=((36384+($I19_0<<2))|0);
 var $428=(($_0+28)|0);
 var $I19_0_c=$I19_0;
 HEAP32[(($428)>>2)]=$I19_0_c;
 var $429=(($_0+20)|0);
 HEAP32[(($429)>>2)]=0;
 var $430=(($_0+16)|0);
 HEAP32[(($430)>>2)]=0;
 var $431=HEAP32[((36084)>>2)];
 var $432=1<<$I19_0;
 var $433=$431&$432;
 var $434=($433|0)==0;
 if($434){label=120;break;}else{label=121;break;}
 case 120: 
 var $436=$431|$432;
 HEAP32[((36084)>>2)]=$436;
 HEAP32[(($427)>>2)]=$398;
 var $437=(($_0+24)|0);
 var $_c=$427;
 HEAP32[(($437)>>2)]=$_c;
 var $438=(($_0+12)|0);
 HEAP32[(($438)>>2)]=$_0;
 var $439=(($_0+8)|0);
 HEAP32[(($439)>>2)]=$_0;
 label=134;break;
 case 121: 
 var $441=HEAP32[(($427)>>2)];
 var $442=($I19_0|0)==31;
 if($442){var $447=0;label=123;break;}else{label=122;break;}
 case 122: 
 var $444=$I19_0>>>1;
 var $445=(((25)-($444))|0);
 var $447=$445;label=123;break;
 case 123: 
 var $447;
 var $448=$_1<<$447;
 var $K20_0=$448;var $T_0=$441;label=124;break;
 case 124: 
 var $T_0;
 var $K20_0;
 var $450=(($T_0+4)|0);
 var $451=HEAP32[(($450)>>2)];
 var $452=$451&-8;
 var $453=($452|0)==($_1|0);
 if($453){label=129;break;}else{label=125;break;}
 case 125: 
 var $455=$K20_0>>>31;
 var $456=(($T_0+16+($455<<2))|0);
 var $457=HEAP32[(($456)>>2)];
 var $458=($457|0)==0;
 var $459=$K20_0<<1;
 if($458){label=126;break;}else{var $K20_0=$459;var $T_0=$457;label=124;break;}
 case 126: 
 var $461=$456;
 var $462=HEAP32[((36096)>>2)];
 var $463=($461>>>0)<($462>>>0);
 if($463){label=128;break;}else{label=127;break;}
 case 127: 
 HEAP32[(($456)>>2)]=$398;
 var $465=(($_0+24)|0);
 var $T_0_c10=$T_0;
 HEAP32[(($465)>>2)]=$T_0_c10;
 var $466=(($_0+12)|0);
 HEAP32[(($466)>>2)]=$_0;
 var $467=(($_0+8)|0);
 HEAP32[(($467)>>2)]=$_0;
 label=134;break;
 case 128: 
 _abort();
 throw "Reached an unreachable!";
 case 129: 
 var $470=(($T_0+8)|0);
 var $471=HEAP32[(($470)>>2)];
 var $472=$T_0;
 var $473=HEAP32[((36096)>>2)];
 var $474=($472>>>0)<($473>>>0);
 if($474){label=132;break;}else{label=130;break;}
 case 130: 
 var $476=$471;
 var $477=($476>>>0)<($473>>>0);
 if($477){label=132;break;}else{label=131;break;}
 case 131: 
 var $479=(($471+12)|0);
 HEAP32[(($479)>>2)]=$398;
 HEAP32[(($470)>>2)]=$398;
 var $480=(($_0+8)|0);
 var $_c9=$471;
 HEAP32[(($480)>>2)]=$_c9;
 var $481=(($_0+12)|0);
 var $T_0_c=$T_0;
 HEAP32[(($481)>>2)]=$T_0_c;
 var $482=(($_0+24)|0);
 HEAP32[(($482)>>2)]=0;
 label=134;break;
 case 132: 
 _abort();
 throw "Reached an unreachable!";
 case 133: 
 _abort();
 throw "Reached an unreachable!";
 case 134: 
 return;
  default: assert(0, "bad label: " + label);
 }
}
function _strtod($string,$endPtr){
 var label=0;
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $p_0=$string;label=2;break;
 case 2: 
 var $p_0;
 var $2=HEAP8[($p_0)];
 var $3=(($2<<24)>>24);
 var $4=_isspace($3);
 var $5=($4|0)==0;
 var $6=(($p_0+1)|0);
 if($5){label=3;break;}else{var $p_0=$6;label=2;break;}
 case 3: 
 var $8=HEAP8[($p_0)];
 if((($8<<24)>>24)==45){ label=4;break;}else if((($8<<24)>>24)==43){ label=5;break;}else{var $p_2=$p_0;var $sign_0=0;label=6;break;}
 case 4: 
 var $p_2=$6;var $sign_0=1;label=6;break;
 case 5: 
 var $p_2=$6;var $sign_0=0;label=6;break;
 case 6: 
 var $sign_0;
 var $p_2;
 var $decPt_0=-1;var $mantSize_0=0;var $p_3=$p_2;label=7;break;
 case 7: 
 var $p_3;
 var $mantSize_0;
 var $decPt_0;
 var $13=HEAP8[($p_3)];
 var $14=(($13<<24)>>24);
 var $isdigittmp=((($14)-(48))|0);
 var $isdigit=($isdigittmp>>>0)<10;
 if($isdigit){var $decPt_1=$decPt_0;label=9;break;}else{label=8;break;}
 case 8: 
 var $16=(($13<<24)>>24)!=46;
 var $17=($decPt_0|0)>-1;
 var $or_cond=$16|$17;
 if($or_cond){label=10;break;}else{var $decPt_1=$mantSize_0;label=9;break;}
 case 9: 
 var $decPt_1;
 var $19=(($p_3+1)|0);
 var $20=((($mantSize_0)+(1))|0);
 var $decPt_0=$decPt_1;var $mantSize_0=$20;var $p_3=$19;label=7;break;
 case 10: 
 var $22=(((-$mantSize_0))|0);
 var $23=(($p_3+$22)|0);
 var $24=($decPt_0|0)<0;
 var $not_=$24^1;
 var $25=(($not_<<31)>>31);
 var $mantSize_1=((($25)+($mantSize_0))|0);
 var $decPt_2=($24?$mantSize_0:$decPt_0);
 var $26=($mantSize_1|0)>18;
 var $27=(((-$mantSize_1))|0);
 var $fracExp_0_p=($26?-18:$27);
 var $fracExp_0=((($fracExp_0_p)+($decPt_2))|0);
 var $mantSize_2=($26?18:$mantSize_1);
 var $28=($mantSize_2|0)==0;
 if($28){var $p_11=$string;var $fraction_0=0;label=37;break;}else{label=11;break;}
 case 11: 
 var $29=($mantSize_2|0)>9;
 if($29){var $p_483=$23;var $mantSize_384=$mantSize_2;var $frac1_085=0;label=15;break;}else{label=13;break;}
 case 12: 
 var $phitmp=($40|0);
 var $phitmp90=($phitmp)*(1000000000);
 var $frac1_0_lcssa97=$phitmp90;var $mantSize_3_lcssa98=9;var $p_4_lcssa99=$p_5;label=14;break;
 case 13: 
 var $30=($mantSize_2|0)>0;
 if($30){var $frac1_0_lcssa97=0;var $mantSize_3_lcssa98=$mantSize_2;var $p_4_lcssa99=$23;label=14;break;}else{var $frac2_0_lcssa=0;var $frac1_0_lcssa96=0;label=22;break;}
 case 14: 
 var $p_4_lcssa99;
 var $mantSize_3_lcssa98;
 var $frac1_0_lcssa97;
 var $p_676=$p_4_lcssa99;var $mantSize_477=$mantSize_3_lcssa98;var $frac2_078=0;label=18;break;
 case 15: 
 var $frac1_085;
 var $mantSize_384;
 var $p_483;
 var $31=HEAP8[($p_483)];
 var $32=(($p_483+1)|0);
 var $33=(($31<<24)>>24)==46;
 if($33){label=16;break;}else{var $c_0_in=$31;var $p_5=$32;label=17;break;}
 case 16: 
 var $35=HEAP8[($32)];
 var $36=(($p_483+2)|0);
 var $c_0_in=$35;var $p_5=$36;label=17;break;
 case 17: 
 var $p_5;
 var $c_0_in;
 var $c_0=(($c_0_in<<24)>>24);
 var $38=((($frac1_085)*(10))&-1);
 var $39=((($38)-(48))|0);
 var $40=((($39)+($c_0))|0);
 var $41=((($mantSize_384)-(1))|0);
 var $42=($41|0)>9;
 if($42){var $p_483=$p_5;var $mantSize_384=$41;var $frac1_085=$40;label=15;break;}else{label=12;break;}
 case 18: 
 var $frac2_078;
 var $mantSize_477;
 var $p_676;
 var $44=HEAP8[($p_676)];
 var $45=(($p_676+1)|0);
 var $46=(($44<<24)>>24)==46;
 if($46){label=19;break;}else{var $c_1_in=$44;var $p_7=$45;label=20;break;}
 case 19: 
 var $48=HEAP8[($45)];
 var $49=(($p_676+2)|0);
 var $c_1_in=$48;var $p_7=$49;label=20;break;
 case 20: 
 var $p_7;
 var $c_1_in;
 var $c_1=(($c_1_in<<24)>>24);
 var $51=((($frac2_078)*(10))&-1);
 var $52=((($51)-(48))|0);
 var $53=((($52)+($c_1))|0);
 var $54=((($mantSize_477)-(1))|0);
 var $55=($54|0)>0;
 if($55){var $p_676=$p_7;var $mantSize_477=$54;var $frac2_078=$53;label=18;break;}else{label=21;break;}
 case 21: 
 var $phitmp91=($53|0);
 var $frac2_0_lcssa=$phitmp91;var $frac1_0_lcssa96=$frac1_0_lcssa97;label=22;break;
 case 22: 
 var $frac1_0_lcssa96;
 var $frac2_0_lcssa;
 var $57=($frac1_0_lcssa96)+($frac2_0_lcssa);
 if((($13<<24)>>24)==69|(($13<<24)>>24)==101){ label=23;break;}else{var $exp_1=0;var $p_10=$p_3;var $expSign_1=0;label=28;break;}
 case 23: 
 var $59=(($p_3+1)|0);
 var $60=HEAP8[($59)];
 if((($60<<24)>>24)==45){ label=24;break;}else if((($60<<24)>>24)==43){ label=25;break;}else{var $p_9_ph=$59;var $expSign_0_ph=0;label=26;break;}
 case 24: 
 var $62=(($p_3+2)|0);
 var $p_9_ph=$62;var $expSign_0_ph=1;label=26;break;
 case 25: 
 var $64=(($p_3+2)|0);
 var $p_9_ph=$64;var $expSign_0_ph=0;label=26;break;
 case 26: 
 var $expSign_0_ph;
 var $p_9_ph;
 var $65=HEAP8[($p_9_ph)];
 var $66=(($65<<24)>>24);
 var $isdigittmp6268=((($66)-(48))|0);
 var $isdigit6369=($isdigittmp6268>>>0)<10;
 if($isdigit6369){var $p_970=$p_9_ph;var $exp_071=0;var $67=$65;label=27;break;}else{var $exp_1=0;var $p_10=$p_9_ph;var $expSign_1=$expSign_0_ph;label=28;break;}
 case 27: 
 var $67;
 var $exp_071;
 var $p_970;
 var $68=((($exp_071)*(10))&-1);
 var $69=(($67<<24)>>24);
 var $70=((($68)-(48))|0);
 var $71=((($70)+($69))|0);
 var $72=(($p_970+1)|0);
 var $73=HEAP8[($72)];
 var $74=(($73<<24)>>24);
 var $isdigittmp62=((($74)-(48))|0);
 var $isdigit63=($isdigittmp62>>>0)<10;
 if($isdigit63){var $p_970=$72;var $exp_071=$71;var $67=$73;label=27;break;}else{var $exp_1=$71;var $p_10=$72;var $expSign_1=$expSign_0_ph;label=28;break;}
 case 28: 
 var $expSign_1;
 var $p_10;
 var $exp_1;
 var $75=($expSign_1|0)==0;
 var $76=(((-$exp_1))|0);
 var $exp_2_p=($75?$exp_1:$76);
 var $exp_2=((($fracExp_0)+($exp_2_p))|0);
 var $77=($exp_2|0)<0;
 var $78=(((-$exp_2))|0);
 var $exp_3=($77?$78:$exp_2);
 var $79=($exp_3|0)>511;
 if($79){label=29;break;}else{label=30;break;}
 case 29: 
 var $80=___errno_location();
 HEAP32[(($80)>>2)]=34;
 var $dblExp_064=1;var $d_065=128;var $exp_566=511;label=31;break;
 case 30: 
 var $81=($exp_3|0)==0;
 if($81){var $dblExp_0_lcssa=1;label=34;break;}else{var $dblExp_064=1;var $d_065=128;var $exp_566=$exp_3;label=31;break;}
 case 31: 
 var $exp_566;
 var $d_065;
 var $dblExp_064;
 var $82=$exp_566&1;
 var $83=($82|0)==0;
 if($83){var $dblExp_1=$dblExp_064;label=33;break;}else{label=32;break;}
 case 32: 
 var $85=HEAPF64[(($d_065)>>3)];
 var $86=($dblExp_064)*($85);
 var $dblExp_1=$86;label=33;break;
 case 33: 
 var $dblExp_1;
 var $88=$exp_566>>1;
 var $89=(($d_065+8)|0);
 var $90=($88|0)==0;
 if($90){var $dblExp_0_lcssa=$dblExp_1;label=34;break;}else{var $dblExp_064=$dblExp_1;var $d_065=$89;var $exp_566=$88;label=31;break;}
 case 34: 
 var $dblExp_0_lcssa;
 var $91=($exp_2|0)>-1;
 if($91){label=36;break;}else{label=35;break;}
 case 35: 
 var $93=($57)/($dblExp_0_lcssa);
 var $p_11=$p_10;var $fraction_0=$93;label=37;break;
 case 36: 
 var $95=($57)*($dblExp_0_lcssa);
 var $p_11=$p_10;var $fraction_0=$95;label=37;break;
 case 37: 
 var $fraction_0;
 var $p_11;
 var $97=($endPtr|0)==0;
 if($97){label=39;break;}else{label=38;break;}
 case 38: 
 HEAP32[(($endPtr)>>2)]=$p_11;
 label=39;break;
 case 39: 
 var $100=($sign_0|0)==0;
 if($100){var $_0=$fraction_0;label=41;break;}else{label=40;break;}
 case 40: 
 var $102=((-.0))-($fraction_0);
 var $_0=$102;label=41;break;
 case 41: 
 var $_0;
 return $_0;
  default: assert(0, "bad label: " + label);
 }
}
function _atof($str){
 var label=0;
 var $1=_strtod($str,0);
 return $1;
}
// EMSCRIPTEN_END_FUNCS
// EMSCRIPTEN_END_FUNCS
// Warning: printing of i64 values may be slightly rounded! No deep i64 math used, so precise i64 code not included
var i64Math = null;
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
//@ sourceMappingURL=bonhomie.html.map