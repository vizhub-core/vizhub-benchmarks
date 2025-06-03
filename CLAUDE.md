# Claude Development Notes

## Strategic Vision: AI Coding Model Evaluation & Training Dataset

### Primary Goals
This grading interface serves dual strategic purposes in AI research and development:

#### 1. **High-Quality Training Data Generation**
- **Corpus Creation**: Generate comprehensive human-rated evaluations of AI-generated code across multiple models and challenges
- **Fine-tuning Dataset**: Provide both positive and negative examples with detailed technical/aesthetic ratings for future model training
- **Quality Standardization**: Ensure consistent, professional-grade human evaluation through collaborative grading workflow
- **Multi-dimensional Assessment**: Technical correctness AND aesthetic quality ratings enable nuanced model training

#### 2. **Model Performance Intelligence & Benchmarking**
- **Situational Awareness**: Real-time assessment of new model coding capabilities as they emerge
- **Comparative Analysis**: Systematic evaluation across models (GPT, Claude, Llama, DeepSeek, etc.) using standardized challenges
- **Capability Mapping**: Identify strengths/weaknesses in specific coding domains (visualization, algorithms, data processing)
- **Evolution Tracking**: Monitor model improvement trajectories over time with consistent evaluation metrics

### Research Applications
- **Training Data**: Human-rated examples can improve next-generation coding models through supervised fine-tuning
- **Evaluation Standards**: Establish benchmark datasets for academic research in AI coding capabilities  
- **Model Selection**: Data-driven recommendations for which models excel at specific coding tasks
- **Capability Gaps**: Identify areas where current AI coding models consistently struggle

## Current Status

### ✅ COMPLETED - PR #8 Ready for Review
**Professional Grading Interface for AI Coding Model Evaluation & Training Data Generation**

#### Core Features Delivered ✅
- **Fullscreen Grading Interface**: Minimal design that doesn't obstruct visualizations
- **VizHub-Compatible Code Viewer**: SSR-safe CodeMirror with file tabs and syntax highlighting
- **Collaborative Git Workflow**: Individual CSV files per grader enable team contributions
- **Comprehensive Hotkey System**: 1-5 (technical), Shift+1-5 (aesthetics), 0 (auto-fail), arrows (navigate)
- **Expandable Challenge Details**: View original prompts for full context
- **Grade Persistence & Resume**: Auto-loads previous work, allows resuming sessions
- **Professional UI/UX**: Progress indicators, instructions, visual feedback, accessibility

#### Technical Implementation ✅
- **React Router v7**: Proper SSR handling for CodeMirror integration
- **Client-side Components**: `.client.tsx` pattern prevents hydration issues  
- **API Routes**: Splat parameters for nested model paths (e.g., "deepseek/deepseek-r1")
- **CSV Storage**: Git-integrated workflow with individual grader files
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **TypeScript**: Strict typing with comprehensive JSDoc documentation
- **ESM Configuration**: Modern JavaScript standards throughout

#### Quality Assurance ✅
- ✅ TypeScript compilation passes without errors
- ✅ Build process completes successfully  
- ✅ All hotkeys function correctly (1-5, Shift+1-5, 0, arrows)
- ✅ Code viewer loads files with syntax highlighting
- ✅ Grade persistence works across sessions
- ✅ Expandable challenge details load prompts
- ✅ Navigation between results works smoothly
- ✅ Accessibility features work with keyboard-only navigation

## Next Development Phase: Training Dataset & Research Infrastructure

### Phase 2 Roadmap (Strategic Research Goals)

#### 1. **Training Dataset Generation & Quality Assurance**
- [ ] Inter-grader agreement metrics and calibration system
- [ ] Grade consensus algorithms with confidence intervals
- [ ] Data quality validation (flag inconsistent/outlier ratings)
- [ ] Export standardized training datasets (JSON/HuggingFace format)
- [ ] Version control for dataset releases with documentation

#### 2. **Model Performance Analytics & Intelligence**
- [ ] Automated model ranking and performance matrices
- [ ] Challenge difficulty analysis and categorization
- [ ] Model capability mapping (strengths/weaknesses per domain)
- [ ] Temporal performance tracking (model evolution over time)
- [ ] Statistical significance testing for model comparisons

#### 3. **Research Infrastructure & Standardization**
- [ ] Grader calibration system (training/agreement benchmarks)
- [ ] Evaluation methodology documentation for reproducibility
- [ ] API endpoints for programmatic access to evaluation data
- [ ] Integration with academic research workflows (citations, DOIs)
- [ ] Automated report generation for model assessments

#### 4. **Advanced Evaluation Capabilities**
- [ ] Multi-dimensional rating scales (beyond technical/aesthetic)
- [ ] Code quality metrics integration (complexity, maintainability)
- [ ] Automated pre-screening (syntax errors, basic functionality)
- [ ] Challenge expansion system for new evaluation domains
- [ ] A/B testing framework for evaluation methodology improvements

## Architecture & Technical Decisions

### Component Architecture
```typescript
// SSR-Safe Pattern
CodeViewer.client.tsx    // Client-only with .client.tsx extension
CodeViewer.tsx          // Server-side wrapper component

// API Route Structure  
api.code.$challenge.$.ts // Splat routes for nested paths
api.grades.ts           // Individual grader file loading
api.results.ts          // Main results CSV loading
```

### Key Technical Solutions
1. **SSR Compatibility**: CodeMirror requires client-side rendering, solved with `.client.tsx` pattern
2. **Nested Model Paths**: Splat routes handle "deepseek/deepseek-r1" style model names
3. **Keyboard Events**: Using `event.code` vs `event.key` for Shift+number detection
4. **Grade Persistence**: Individual CSV files enable git-based collaboration
5. **Accessibility**: Comprehensive ARIA labels, keyboard navigation, screen reader support

### Training Dataset Considerations
```typescript
// Standardized Training Data Format
interface TrainingExample {
  challenge: string;           // "reverseString", "stockPriceChart"
  model: string;              // "deepseek/deepseek-r1", "anthropic/claude-3.5-haiku"
  prompt: string;             // Original challenge prompt
  code: {                     // Generated code files
    'index.mjs': string;
    'functions.mjs': string;
    // ... other files
  };
  human_ratings: {
    technical: number;        // 1-5 scale
    aesthetic: number;        // 1-5 scale
    consensus: number;        // Calculated consensus score
    confidence: number;       // Inter-grader agreement metric
    grader_count: number;     // Number of human evaluators
  };
  metadata: {
    domain: string;           // "visualization", "algorithms", "data-processing"
    difficulty: string;       // "beginner", "intermediate", "advanced"
    success: boolean;         // Pass/fail evaluation
    timestamp: string;        // When evaluated
  };
}
```

### Performance Optimizations
- **Efficient Keyboard Listeners**: Event delegation with cleanup
- **Lazy Loading**: CodeMirror only loads client-side when needed
- **CSV Caching**: Results loaded once, grades cached per session
- **Debounced Auto-save**: Form submission prevents save spam

### Code Quality Standards Applied
- **TypeScript Strict Mode**: Full type safety throughout
- **JSDoc Documentation**: All functions documented with parameters/returns
- **ARIA Accessibility**: Screen reader and keyboard-only navigation
- **Clean Architecture**: Separation of concerns, reusable components
- **Error Handling**: Graceful fallbacks with user-friendly messages

## Final File Structure

```
grader-app/
├── app/
│   ├── routes/
│   │   ├── home.tsx                      # ✅ Main grader interface
│   │   ├── api.code.$challenge.$.ts      # ✅ Code file serving
│   │   ├── api.grades.ts                 # ✅ Grade persistence
│   │   └── api.results.ts                # ✅ Results loading
│   ├── components/
│   │   ├── CodeViewer.client.tsx         # ✅ VizHub-compatible viewer
│   │   └── CodeViewer.tsx                # ✅ SSR wrapper
│   ├── types/
│   │   └── result.ts                     # ✅ TypeScript definitions
│   ├── app.css                           # ✅ Fullscreen grader styles
│   └── routes.ts                         # ✅ Routing configuration
├── package.json                          # ✅ ESM + dependencies
└── README.md                             # ✅ Usage instructions

benchmarks/
└── results/
    ├── results.csv                       # ✅ Main results file
    └── grades/                           # ✅ Individual contributions
        └── ej-fox.csv                    # ✅ Per-grader files
```

## Development Completed ✅

**PR #8 Status**: https://github.com/vizhub-core/vizhub-benchmarks/pull/8
- All features implemented and tested
- Comprehensive documentation provided
- Clean commits with detailed messages
- Ready for review and deployment

## Research Impact & Future Applications

### Training Data Applications
- **Fine-tuning Datasets**: High-quality human evaluations can train models to better assess their own code quality
- **Reward Modeling**: Technical/aesthetic ratings enable RLHF training for coding-focused models  
- **Curriculum Learning**: Difficulty-graded examples allow progressive model training strategies
- **Multi-modal Training**: Code + visual output pairs create richer training contexts

### Evaluation & Benchmarking
- **Academic Benchmarks**: Standardized evaluation methodology for AI coding research
- **Industry Standards**: Practical assessment framework for production model selection
- **Capability Tracking**: Longitudinal studies of AI coding model evolution
- **Domain Analysis**: Fine-grained understanding of model strengths/weaknesses by coding domain

### Strategic Advantages
- **First-mover Advantage**: Comprehensive dataset before widespread adoption of evaluation standards
- **Research Credibility**: Rigorous methodology enables academic publication and citation
- **Model Selection Intelligence**: Data-driven recommendations for specific coding use cases
- **Training Data Value**: High-quality human evaluations increasingly valuable as models improve

---

## Strategic Roadmap: Small, Focused PRs (20-50 Actions Each)

### **Phase 1: Quick Wins (Next 3 PRs)**

#### **PR #1: HuggingFace Export Script (~25 actions)**
- New file: `scripts/export-huggingface.js`
- Reads: `benchmarks/results/grades/*.csv` + `benchmarks/challenges/*/llmResponse.md`
- Outputs: `exports/training-dataset-v1.0.jsonl` (industry-standard RLHF format)
- **Impact**: Immediate utility for ML practitioners globally

#### **PR #2: Calibration Dataset Creation (~30 actions)**  
- New file: `benchmarks/calibration/gold-standard.csv` (20 hand-curated examples)
- New file: `scripts/calibration-test.js` (measures inter-grader agreement)
- **Impact**: Grader training foundation following industry standards

#### **PR #3: Academic Documentation (~35 actions)**
- Update: `README.md` with evaluation methodology
- New files: `METHODOLOGY.md`, `datasets/DATASET_CARD.md`
- **Impact**: Research-credible documentation enabling citations

### **Phase 2: Quality Enhancements (Next 2 PRs)**

#### **PR #4: Multi-Dimensional Ratings (~40 actions)**
- Update: `grader-app/app/routes/home.tsx` (4-dimension rating scales)
- Update: `grader-app/app/types/result.ts` (technical, aesthetic, functionality, maintainability)
- **Impact**: Richer training signals following SOTA research (Zhang et al. CVPR 2024)

#### **PR #5: Basic Quality Checks (~45 actions)**
- New file: `scripts/quality-check.js` (automated data validation)
- Outputs: `quality-report.html` with flagged examples for review
- **Impact**: Automated QA following Cleanlab methodology (catches 5-10% annotation errors)

**Current Status**: Starting with PR #1 (HuggingFace Export Script)

---

**Next Steps**: 
1. **Immediate**: Complete PR #1 HuggingFace export script implementation
2. **Phase 1**: Sequential PR delivery for quick training dataset value
3. **Research Impact**: Each PR builds toward publication-ready evaluation framework