**functions.mjs**

```javascript
/**
 * Adds two numbers together.
 * 
 * @param {number} a The first number to add.
 * @param {number} b The second number to add.
 * @returns {number} The sum of a and b.
 */
export function add(a, b) {
    return a + b;
}
```

**index.mjs**

```javascript
import { add } from "./functions.mjs";

// A simple test:
const result = add(3,4);
if (result !== 7) {
    console.error(`Test failed: expected 7, got ${result}`);
    process.exit(1); // Exit with error code
}
console.log("Add test passed");
process.exit(0); // Exit successfully
```