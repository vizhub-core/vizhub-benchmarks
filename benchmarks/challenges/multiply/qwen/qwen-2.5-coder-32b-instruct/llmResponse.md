**functions.mjs**

```js
// TODO: Implement the multiply function
export function multiply(a, b) {
  return a * b;
}
```

**index.mjs**

```js
import { multiply } from "./functions.mjs";

const result = multiply(6, 7);
if (result !== 42) {
  console.error(`Test failed: expected 42, got ${result}`);
  process.exit(1);
}
console.log("Multiply test passed");
process.exit(0);
```

**README.md**

```markdown
# Project Description

This project contains a simple implementation of a multiply function and a unit test for it.
```