
EXPORTED_FUNCTIONS="['_uintSizeof', '_uintArrInc']"

all:
	emcc array_param.c -o array_param.js -s EXPORTED_FUNCTIONS=$(EXPORTED_FUNCTIONS)
	rm *.map

clean:
	rm *.map array_param.js a.out a.out.js
