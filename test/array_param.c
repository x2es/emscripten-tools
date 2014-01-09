/* * * 
 * This is C sample with functions which accepts arrays and then changes it.
 */

#include <stdio.h>

/* *
 * Helper function intended to using inside JavaScript
 * @return bytes count for uint
 */
int uintSizeof() {
  return sizeof(unsigned int);
}

/* *
 * Function which takes pointer to array of uint and adds delta to each array item
 * @param unsigned int *arr
 * @param unsigned int length
 * @param int delta
 */
void uintArrInc(unsigned int *arr, unsigned int length, int delta) {
  int i;
  for (i = 0; i < length; ++i) {
    arr[i] += delta;
  }
}


// uncomment for debugging purposes
/* int main() {
  int i;

  printf("sizeof(unsigned int): %i bytes\n", uintSizeof());

  unsigned int arr[] = {1, 2, 3, 4, 5, 6};
  int arrLength = sizeof(arr) / sizeof(arr[0]);

  uintArrInc(arr, arrLength, 10);

  for (i = 0; i < arrLength; ++i) {
    printf(" %i", arr[i]);
  }

  printf("\n");

  return 0;
}*/
