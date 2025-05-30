**functions.mjs**
```javascript
// Exported square function
export function square(x) {
  // Returns x_squared
  return x * x;
}
```

**index.mjs**
```
import { square } from "./functions.mjs";

const input = 5;
const result = square(input);
if (result !== 25) {
  console.error(`Test failed: expected 25, got ${result}`);
  process.exit(1);
}
console.log("Square test passed");
process.exit(0);
```