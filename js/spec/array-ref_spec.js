
define(['chai', 'c-array-param', 'c-array-ref'], function(chai, CArrayParam, CArrayRef) {
  var expect = chai.expect;

  // TODO:x2es: how to convert TypedArray to Array (standart way?)
  function typedToArray(typedArray) {
    var res = [];
    for (var k in typedArray) if (typedArray.hasOwnProperty(k)) {
      res.push(typedArray[k]);
    }
    return (res);
  }

  describe('array-param', function() {
    it('should has unit32', function() {
      expect(CArrayParam._uintSizeof()).to.equal(4);
    });

    describe('c-function uintArrInc', function() {
      var uintArrInc;
      before(function() {
        uintArrInc = CArrayParam.cwrap('uintArrInc', 'number', ['number', 'number', 'number']);
      });

      it('should work with manual array passing', function() {
        var data = new Uint32Array([1,2,3,4,5]);
        var dataBytes = data.length * data.BYTES_PER_ELEMENT;

        var dataPtr = CArrayParam._malloc(dataBytes);

        var dataHeap = new Uint8Array(CArrayParam.HEAPU8.buffer, dataPtr, dataBytes);
        dataHeap.set(new Uint8Array(data.buffer));

        uintArrInc(dataPtr, data.length, 30);
        var resTyped = new Uint32Array(CArrayParam.HEAPU8.buffer, dataPtr, data.length);

        var res = typedToArray(resTyped);

        expect(res).to.deep.equal([31,32,33,34,35]);

        CArrayParam._free(dataPtr);
      });

      it('should work when used CArrayRef', function() {
        var arrRef = new CArrayRef(CArrayParam, [1,2,3,4,5], 'uint32');
        uintArrInc(arrRef.ptr, arrRef.itemsCount, 40);
        expect(arrRef.getArray()).to.deep.equal([41,42,43,44,45]);

        uintArrInc(arrRef.ptr, arrRef.itemsCount, 10);
        expect(arrRef.getArray()).to.deep.equal([51,52,53,54,55]);
        arrRef.free();
      });
    });
  });

  describe('ArrayRef', function() {
    describe('length', function() {
      it('should return items count', function() {
        var arrRef = new CArrayRef(CArrayParam, [1,2,3], 'uint32');
        expect(arrRef.itemsCount).to.equal(3);
        arrRef.free();
      });

      it('should return correct bytes count', function() {
        var typesSizes = {
          'int8':   1,
          'uint8':  1,
          'int16':  2,
          'uint16': 2,
          'int32':  4,
          'uint32': 4
        };

        for (var typ in typesSizes) if (typesSizes.hasOwnProperty(typ)) {
          var arrRef = new CArrayRef(CArrayParam, [1,2,3], typ);
          expect(arrRef.bytesCount).to.equal(typesSizes[typ] * 3, 'for type: ' + typ);
          arrRef.free();
        }

      });
    });

    describe('types', function() {
      it('should support int8');
      it('should support uint8');
      it('should support int16');
      it('should support uint16');
      it('should support int32');
      it('should support uint32');
      // it('should support int64');
      // it('should support uint64');
    });

    describe('errors', function() {
      describe('#constructor', function() {
        it('should support omitted "new" form', function() {
          var arrRef = CArrayRef(CArrayParam, [], 'uint32');
          expect(arrRef).to.exist;
          expect(arrRef.constructor).to.equal(CArrayRef);
          arrRef.free();
        });

        it('should accept Array', function() {
          var arrRef = CArrayRef(CArrayParam, [1,2,3], 'uint32');
          expect(arrRef.getTypedArray()).to.be.instanceof(Uint32Array, 'uint32');

          var arrRef = CArrayRef(CArrayParam, [1,2,3], 'uint16');
          expect(arrRef.getTypedArray()).to.be.instanceof(Uint16Array, 'uint16');
          arrRef.free();
        });

        it('should accept TypedArray');
        it('should guess itemsType when passed TypedArray');

        it('should place array in emscripten HEAP', function() {
          var arr = [1,2,3,4];
          var arrRef = CArrayRef(CArrayParam, arr, 'uint32');
          
          var typedHeap = new Uint32Array(CArrayParam.HEAPU8.buffer, arrRef.ptr, arr.length);
          var fromHeap = typedToArray(typedHeap);
          arrRef.free();

          expect(fromHeap).to.deep.equal(arr);
        });

        it('should throw on wrong itemsType');
        it('should protect from changing array length');
      });
    });
  });
});
