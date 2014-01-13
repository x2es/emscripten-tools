
define(['chai', 'c-params-ptrs'], function(chai, CParamsPtrs) {
  var expect = chai.expect;

  describe('self test', function() {
    it('should has 4 bytes unsigned int', function() {
      var size = CParamsPtrs.ccall('sizeofUInt', 'number', []);
      expect(size).to.equal(4);
    });

    it('should has 8 bytes unsigned long long', function() {
      var size = CParamsPtrs.ccall('sizeofULongLong', 'number', []);
      expect(size).to.equal(8);
    });
  });

  describe('params-ptrs', function() {
    describe('sum3', function() {
      it('should not work with direct passing', function() {
        var sum3 = CParamsPtrs.cwrap('sum3', 'number', ['number', 'number', 'number']);
        var buf = sum3(1,10,100);
        expect(buf).to.not.equal(111);
      });
    });

    describe('sumPtr', function() {
      it('should work with passed by pointer', function() {
        var sumPtr = CParamsPtrs.cwrap('sumPtr', 'number', ['number', 'number', 'number']);
        var aSize = 4;  // bytes
        var bSize = 8;  // bytes
        var cSize = 4;  // bytes

        var aPtr = CParamsPtrs._malloc(aSize);
        var bPtr = CParamsPtrs._malloc(bSize);
        var cPtr = CParamsPtrs._malloc(cSize);

        var aHeap = new Uint32Array(CParamsPtrs.HEAPU8.buffer, aPtr, 1);
        aHeap[0] = 4;

        var bHeap = new Uint32Array(CParamsPtrs.HEAPU8.buffer, bPtr, 2);
        // bHeap[0] = 4294967295; bHeap[1] = 3;   // 0000 0011 + 1111 1111 (hi lo tails for 64bit value)
        bHeap[0] = 40; bHeap[1] = 0;    // ISSUE: hardcoded LE

        var cHeap = new Uint32Array(CParamsPtrs.HEAPU8.buffer, cPtr, 1);
        cHeap[0] = 400;

        var res = sumPtr(aPtr, bPtr, cPtr);

        CParamsPtrs._free(aPtr);
        CParamsPtrs._free(bPtr);
        CParamsPtrs._free(cPtr);

        expect(res).to.equal(444);
      });
    });
  });

});
