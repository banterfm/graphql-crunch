///**
// * Uses xorshift32 to map 32-bit numbers to 32-bit numbers with a pseudorandom
// * mapping.
// *
// * Returns an unsigned 32-bit number.
// */
//function intHash(x) {
//  x ^= x << 13;
//  x ^= x >> 17;
//  x ^= x << 5;
//  return x + 2147483648;
//}
//
//module.exports = { random };
