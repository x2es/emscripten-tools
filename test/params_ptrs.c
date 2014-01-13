/* * * 
 * This is C sample with functions which accepts multiple params of different types.
 */

#include <stdio.h>

unsigned int sizeofUInt() { return (sizeof(unsigned int)); }
unsigned int sizeofULongLong() { return (sizeof(unsigned long long)); }

unsigned int sum3(unsigned int a, unsigned long long b, unsigned int c) {
  printf("sum3 a=%i, b=%lli, c=%i\n", a,b,c);
  return (a+b+c);
}

unsigned int sumPtr(unsigned int* a, unsigned long long* b, unsigned int* c) {
  printf("sumPtr a=%i, b=%lli, c=%i\n", a,b,c);
  printf("sumPtr a[0]=%i, b[0]=%lli, c[0]=%i\n", a[0],b[0],c[0]);
  printf("sumPtr *a=%i, *b=%lli, *c=%i\n", *a,*b,*c);
  return (sum3(*a, *b, *c));
}

int main() {
  printf("sizeof unsigned int: %i\n", sizeofUInt());
  printf("sizeof unsigned long long: %i\n", sizeofULongLong());
  printf("sum is: %i\n", sum3(2, 20, 200));

  unsigned int v3 = 3;
  unsigned long long v30 = 30;
  unsigned int v300 = 300;

  printf("sumPtr is: %i\n", sumPtr(&v3, &v30, &v300));
  return 0;
}
