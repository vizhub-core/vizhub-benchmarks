**functions.mjs**

```js
export function reverseString(str) {
  return str.split('').reverse().join('');
}
```

The implementation is straightforward and follows these steps:
1. Split the string into an array of characters using `split('')`
2. Reverse the array using `reverse()`
3. Join the array back into a string using `join('')`

No changes are needed to index.mjs as it already contains the correct test case and logic.