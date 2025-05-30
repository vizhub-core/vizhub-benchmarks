**functions.mjs**

```javascript
export function reverseString(str) {
  return str.split("").reverse().join("");
}
```

I simply split the input string into an array of individual characters, reversed the array, and then joined the characters back into a string.