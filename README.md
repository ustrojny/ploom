
## Main Objective:
Design your tests to easily extend them to new markets (different country-specific websites). 
For this homework, your tests should be able to run on the following shops, and it should be easy to add new ones.

### Key features include:

1. Market Configuration: Define supported markets and their URLs in a centralized configuration file. Easy to add new markets.
2. Localization Support: Handle market-specific text through a dedicated localization file.
3. Reusable Test Fragments: Shared test logic and utilities in file tests.utils.ts for efficient and scalable test development
4. Environment Control: Run tests for specific markets via environment variables
5. Page Object Model (POM): Organizes the test logic by separating page-specific actions (like clicking buttons, checking visibility, etc.) into dedicated classes, making tests more maintainable and readable.
   
### Supported markets
- UK  
- PL 

### Market configuration
You can use env MARKET to specify the market for running tests

Default market is set up to `UK` and it can be easily change in the `defaultMarket` variable in file `test.utils.ts`.
If an incorrect ENV variable is provided, the default market will be used.
```
const defaultMarket = "UK";
```

### Run all tests for default market
```
npx playwright test
```

### Run all tests for specific market
```
MARKET=UK npx playwright test
```

### Run specific test for a specific market in headed mode
```
MARKET=UK npx playwright test addToCart.spec.ts --headed
```

### Place for improvements
Some pages have long load times, and standard Playwright waiting methods were insufficient. To address this, additional explicit waits were used, though they are not ideal. Potential improvements include: optimizing page performance, dynamically adjusting timeout values for slow pages, collaborating with developers to resolve server or frontend bottlenecks, breaking down complex tests into smaller scenarios.

### Comments in the code
I generally avoid adding comments about the code itself, as I strive to write clean and self-explanatory code. However, a few comments have been included, focusing on potential improvements rather than the code's content.