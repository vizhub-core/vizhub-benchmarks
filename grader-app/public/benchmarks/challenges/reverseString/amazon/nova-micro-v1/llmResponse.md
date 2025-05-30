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
# Project

This project contains a simple function to reverse a string.

## Files

- `index.mjs`: The main file that tests the `reverseString` function.
- `functions.mjs`: The file containing the `reverseString` function.

## Usage

To test the `reverseString` function, run the following command in the terminal:

```sh
node index.mjs
```

If the test passes, it will print "reverseString test passed". If it fails, it will print an error message.
```