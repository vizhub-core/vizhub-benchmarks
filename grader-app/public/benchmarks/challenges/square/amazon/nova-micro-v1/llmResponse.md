**functions.mjs**

```js
// Entire updated code for functions.mjs
export function square(x) {
  return x * x;
}
```

**index.mjs**

```js
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

**README.md**

```md
```

(If there was a README.md file, it remains unchanged as per the instructions.)