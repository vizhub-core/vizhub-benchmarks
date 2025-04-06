# vizhub-benchmarks
AI code editing benchmarks for interactive visuals

## Benchmark System

### Running Benchmarks

Test how different AI models perform on code tasks:

```bash
# Run all benchmarks with default models
npm run benchmark

# Run a specific challenge
npm run benchmark -- --challenge stockPriceChart

# Specify which models to test
npm run benchmark -- --models gpt-4,claude-3

# Enable caching for faster development
npm run benchmark -- --cache
```




### Using the Grader UI

The benchmark system includes a grader for evaluating AI-generated visualizations:

```bash
# Launch the grader UI
npm run grade

# Focus on a specific challenge
npm run grade -- --challenge stockPriceChart
```

#### Grading Workflow

1. **Select Challenge**: Choose from available challenges in the dropdown
2. **Browse Models**: Navigate between different AI models' solutions
3. **Review Visualization**: See the rendered visualization and screenshot
4. **Inspect Code**: Review the generated code
5. **Assign Scores**:
   - **Functionality (0-5)**: How well it meets requirements
   - **Aesthetics (0-5)**: Visual appeal and usability
6. **Add Notes**: Provide specific feedback
7. **Submit Grade**: Save evaluation to the results database

#### Scoring Guidelines

**Functionality (0-5)**:

- 0: Does not work
- 1: Major bugs
- 2: Works but missing requirements
- 3: Meets basic requirements
- 4: Implements all requirements well
- 5: Perfect implementation with extras

**Aesthetics (0-5)**:

- 0: Unusable layout
- 1: Poor design
- 2: Basic appearance
- 3: Clean design
- 4: Well-designed with good UX
- 5: Exceptional design
