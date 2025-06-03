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

## Collaborative Grading System

### Current State vs. Ideal Structure

**Current Issues:**
- Grader saves results to `grader-app/public/benchmarks/results/results.csv` (isolated)
- No git integration for collaborative contributions
- Manual file copying between main repo and grader app
- Results aren't versioned or shared between graders

**Ideal Collaborative Structure:**

```
benchmarks/
├── results/
│   ├── results.csv              # Main results file (git-tracked)
│   ├── grades/                  # Individual grader contributions
│   │   ├── alice-2024-01-15.csv # Timestamped grader files
│   │   ├── bob-2024-01-16.csv
│   │   └── claire-2024-01-17.csv
│   └── consensus/               # Aggregated consensus grades
│       └── consensus.csv        # Merged/averaged results
├── challenges/                  # Challenge implementations (existing)
└── visualizations/             # Generated outputs (existing)
```

### Planned Collaborative Workflow

1. **Individual Grading**:
   - Each grader works on a local copy
   - Grader saves to timestamped file: `grades/{grader-name}-{date}.csv`
   - Grader commits their individual grades to git
   - Creates PR with their grading session

2. **Grade Aggregation**:
   - Automated script merges individual grades
   - Handles conflicts (multiple grades for same result)
   - Generates consensus scores (median/average)
   - Updates main `results.csv` with consensus

3. **Git Integration**:
   - Each grading session = git commit
   - Grader identity tracked in commit metadata
   - Full audit trail of grading decisions
   - Easy diffing between grading sessions

4. **Quality Assurance**:
   - Flag results with high grade variance
   - Track inter-grader reliability
   - Identify results needing re-evaluation
   - Generate grading statistics and reports

### Technical Implementation Plan

**Phase 1: File Structure**
- Create `benchmarks/results/grades/` directory
- Modify grader to save individual grade files
- Update file paths and data flow

**Phase 2: Git Integration**
- Auto-commit individual grading sessions
- Generate meaningful commit messages
- Add grader metadata to commits

**Phase 3: Aggregation System**
- Script to merge individual grades
- Consensus calculation algorithms
- Conflict resolution strategies

**Phase 4: Quality Tools**
- Inter-grader agreement metrics
- Grade variance analysis
- Automated quality reports

### Benefits

- **Distributed Grading**: Multiple people can contribute grades independently
- **Version Control**: Full history of grading decisions
- **Quality Control**: Statistical analysis of grader agreement
- **Transparency**: Open process with audit trail
- **Scalability**: Easy to add new graders and challenges
