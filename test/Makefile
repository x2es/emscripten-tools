
ARRAY_PARAM_EXPORTED_FUNCTIONS="['_uintSizeof', '_uintArrInc']"
PARAMS_PTRS_EXPORTED_FUNCTIONS="['_sumPtr', '_sum3', '_main', '_sizeofUInt', '_sizeofULongLong']"

all: js

js:
	emcc array_param.c -o array_param.js -s EXPORTED_FUNCTIONS=$(ARRAY_PARAM_EXPORTED_FUNCTIONS)
	emcc params_ptrs.c -o params_ptrs.js -s EXPORTED_FUNCTIONS=$(PARAMS_PTRS_EXPORTED_FUNCTIONS)
	rm *.map

html: 
	emcc array_param.c -o array_param.html -s EXPORTED_FUNCTIONS=$(ARRAY_PARAM_EXPORTED_FUNCTIONS)
	emcc params_ptrs.c -o params_ptrs.html -s EXPORTED_FUNCTIONS=$(PARAMS_PTRS_EXPORTED_FUNCTIONS)
	rm *.map

clean:
	rm array_param.js params_ptrs.js
	rm *.html
	rm a.out a.out.js
