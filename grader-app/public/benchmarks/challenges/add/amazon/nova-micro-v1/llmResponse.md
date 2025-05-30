**functions.mjs**

```js
// Entire updated code for functions.mjs
export function add(a, b) {
  return a + b;
}
```

**index.mjs**

```js
// Entire updated code for index.mjs
import { add } from "./functions.mjs";

// A simple test:
const result = add(3, 4);
if (result !== 7) {
  console.error(`Test failed: expected 7, got ${result}`);
  process.exit(1); // Exit with error code
}
console.log("Add test passed");
process.exit(0); // Exit successfully
```

No changes are needed to `README.md` as it should be kept as is. The `functions.mjs` file now correctly implements the `add` function, and the `index.mjs` file contains the test to verify the implementation.