**functions.mjs**

```js
// Implementation of the reverseString function
export function reverseString(str) {
  return str.split('').reverse().join('');
}
```

**index.mjs**

```js
import { reverseString } from "./functions.mjs";

const input = "OpenAI";
const expected = "IAnepO"; // Corrected expected output

const result = reverseString(input);
if (result !== expected) {
  console.error(`Test failed: expected '${expected}', but got '${result}'`);
  process.exit(1);
}
console.log("reverseString test passed");
process.exit(0);
```

**README.md**

```md
// README.md

This project contains a simple function to reverse a string.

## Files

- `functions.mjs`
- `index.mjs`
```

**Note:** The `functions.mjs` file now contains the implementation of the `reverseString` function, and the `index.mjs` file contains the test for this function. The `README.md` is kept as per the instructions, and no other files are needed.