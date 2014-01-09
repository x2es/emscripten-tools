
define(function() {

  function CArrayRef(emModule, array, itemsType) {
    /* *
     * NOTE: after finish working with CArrayRef you should free mem! (arrRef.free() or equivalent)
     *       it is based on low-level asm-like logic and requires to control this aspect manually
     *
     * CArrayRef represents array placed into emscripten HEAP.
     * It is gives an opportunity to pass an array to c-functions as pointer
     *
     * NOTE: passed array will be copied into emscripten HEAP and will live in HEAP
     *       until arrayRef.free(); will not be called
     *
     * NOTE: after arrayRef.free() data may be still available, but you should not use it
     *       ensure that you make a copy of needed data before calling .free()
     *
     * NOTE: .itemsCount and .bytesCount calculated during CArrayRef construction and does not changing later
     *
     * NOTE: .getTypedArray() returns reference to ArrayBufferView linked to Module.HEAPU8.buffer
     *       but .getArray() copies typed-array into Array and returns copy
     *
     * Usage:
     *   
     *   var arrRef = new CArrayRef(Module, [1,2,3], 'uint32');
     *   var arrRef = CArrayRef(Module, [1,2,3], 'uint32'); // also possible without 'new'
     *   var arrRef = CArrayRef(Module, Uint16Array([1,2,3])); // also possible pass typed-array
   !!! (NOT IMPLEMENTED)  *   // in last case argument 'itemsType' not used, type will be correspond to type of passed array
     *
     *   // avail types: [u]int[8,16,32] @see CArrayRef.TYPES_ARRAYS
     *   // Module - is emscripten Module
     *
     *   // now we can pass arrRef.ptr to c-function compiled by emscripten
     *   cfunc = Module.cwrap('cfunc', 'number', ['number', 'number']);
     *   cfunc(arrRef.ptr, arrRef.itemsCount)
     *   // .itemsCount equals to array.length of passed array
     *   // IMHO using .length in this context is ambigous, I prefer .itemsCount and .bytesCount
     *
     *   // if cfunc changes array, then we can get this changes immediately after function invocation
     *   var typedArr = arrRef.getTypedArray()
     *   // or
     *   var arr = arrRef.getArray();
     *
     *   // if you need typed array but not needed arrayRef instance, you can get copy of typed array
     *   // you should do this before calling .free()
   !!! (NOT IMPLEMENTED) *   var typedArrCopyt = arrRef.copy.getTypedArray();
     *
     *   // when instance of CArrayRef not needed anymore you should call .free()
     *   arrRef.free();
     *
     */

    // support call without 'new' keyword
    if ( !(this instanceof CArrayRef) ) return (new CArrayRef(emModule, array, itemsType));

    this._emModule = emModule;
    this._itemsType = itemsType;

    this._TypedArrayConstructor = CArrayRef.TYPES_ARRAYS[this._itemsType];

    this._setupArray(array);

    this.itemsCount = this._array.length;
    this.bytesCount = this._calcBytesCount();

    this._putArrayToHeap();
  }

  CArrayRef.prototype._setupArray = function(array) {
    if (array instanceof Array) {
      this._array = new this._TypedArrayConstructor(array);
    }
  }

  CArrayRef.prototype._putArrayToHeap = function() {
    this.ptr = this._emModule._malloc(this.bytesCount);
    this._heapArrU8 = new Uint8Array(this._emModule.HEAPU8.buffer, this.ptr, this.bytesCount);
    this._heapArrU8.set(new Uint8Array(this._array.buffer));

    // remap this._array to emscripten HEAP
    // source array not needed anymore
    this._array = new this._TypedArrayConstructor(this._emModule.HEAPU8.buffer, this.ptr, this._array.length);
  }

  CArrayRef.TYPES_ARRAYS = {
    'int8':   Int8Array,
    'uint8':  Uint8Array,
    'int16':  Int16Array,
    'uint16': Uint16Array,
    'int32':  Int32Array,
    'uint32': Uint32Array
  }

  CArrayRef.prototype._calcBytesCount = function() {
    return (this.itemsCount * CArrayRef.TYPES_ARRAYS[this._itemsType].BYTES_PER_ELEMENT);
  }

  CArrayRef.prototype.getArray = function() {
    var typedArr = this.getTypedArray();
    var arr = [];
    for (var i = 0, il = typedArr.length; i < il; i++) { 
      arr.push(typedArr[i]);
    };
    
    return (arr);
  }

  CArrayRef.prototype.getTypedArray = function() {
    return (this._array);
  }

  /* *
   * releases memory in emscripten HEAP
   * don't forget to call it!
   */
  CArrayRef.prototype.free = function() {
    this._emModule._free(this.ptr);
  }

  return CArrayRef;
});
