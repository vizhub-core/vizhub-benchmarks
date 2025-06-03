# VizHub-Benchmarks: Multi-Dimensional Code Quality Dataset

## Dataset Description

**VizHub-Benchmarks** is a human-annotated dataset for training and evaluating AI models on multi-dimensional code quality assessment. The dataset contains preference pairs of AI-generated code solutions with expert human evaluations across technical and aesthetic dimensions.

### Key Features
- **Multi-dimensional quality assessment**: Technical correctness and aesthetic design ratings
- **Expert human evaluation**: Professional data visualization practitioners as evaluators  
- **Cross-model coverage**: Solutions from 10+ major AI models (GPT, Claude, Llama, DeepSeek, Qwen)
- **Preference pair format**: Compatible with RLHF training pipelines
- **Rich metadata**: Consensus scores, confidence intervals, evaluator statistics

## Dataset Structure

### Data Format
The dataset is provided in JSONL format, with each line containing a preference pair:

```json
{
  "prompt": "Generate code for the stockPriceChart challenge...",
  "chosen": "<!DOCTYPE html>\n<html>...",
  "rejected": "<!DOCTYPE html>\n<html>...",
  "metadata": {
    "challenge": "stockPriceChart",
    "chosen_model": "qwen/qwq-32b",
    "rejected_model": "deepseek/deepseek-r1",
    "chosen_scores": {
      "technical": 5.0,
      "aesthetic": 4.8,
      "overall": 4.9,
      "vote_count": 3
    },
    "rejected_scores": {
      "technical": 3.2,
      "aesthetic": 2.8,
      "overall": 3.0,
      "vote_count": 3
    },
    "score_difference": 1.9,
    "dataset_version": "1.0.0"
  }
}
```

### Data Fields

| Field | Type | Description |
|-------|------|-------------|
| `prompt` | string | Challenge description and requirements |
| `chosen` | string | Higher-quality code solution |
| `rejected` | string | Lower-quality code solution |
| `metadata.challenge` | string | Challenge identifier (e.g., "stockPriceChart") |
| `metadata.chosen_model` | string | Model that generated the chosen solution |
| `metadata.rejected_model` | string | Model that generated the rejected solution |
| `metadata.chosen_scores` | object | Quality scores for chosen solution |
| `metadata.rejected_scores` | object | Quality scores for rejected solution |
| `metadata.score_difference` | float | Quality difference between chosen/rejected |
| `metadata.dataset_version` | string | Dataset version for reproducibility |

## Dataset Statistics

### Current Release (v1.0.0)
- **Total examples**: 9 preference pairs
- **Challenges**: 1 (stockPriceChart)
- **Models covered**: 10 major AI models
- **Average score difference**: 1.39 points
- **Evaluation period**: June 2025

### Model Coverage
| Provider | Models | Examples |
|----------|--------|----------|
| Qwen | qwq-32b, qwen-2.5-coder-32b-instruct, qwen-2.5-72b-instruct, qwen-2.5-7b-instruct, qwen-vl-max | 9 |
| DeepSeek | deepseek-r1, deepseek-chat, deepseek-chat-v3-0324 | 6 |
| Anthropic | claude-3.5-haiku | 2 |
| Meta | llama-4-maverick, llama-3.1-8b-instruct, llama-3.2-3b-instruct, llama-3.2-1b-instruct | 4 |
| Google | gemini-2.0-flash-001 | 2 |
| Amazon | nova-micro-v1 | 2 |

## Intended Use

### Primary Use Cases
1. **Reinforcement Learning from Human Feedback (RLHF)**
   - Training reward models for code quality assessment
   - Fine-tuning language models with human preference data
   - Constitutional AI development for coding assistants

2. **Benchmarking and Evaluation**
   - Systematic comparison of AI coding model capabilities
   - Multi-dimensional quality assessment research
   - Establishment of code generation quality standards

3. **Academic Research**
   - Human evaluation methodology studies
   - Code quality assessment research
   - Multi-modal preference learning investigations

### Compatible Frameworks
- **OpenAI Fine-tuning API**: Direct compatibility with preference-based training
- **HuggingFace TRL**: Transformer Reinforcement Learning library
- **Anthropic Constitutional AI**: Preference-based safety training
- **Custom RLHF pipelines**: Standard format adaptable to research frameworks

## Out-of-Scope Use

### Not Recommended For:
- **Production code generation**: Dataset represents specific evaluation context, not general capability
- **Absolute model ranking**: Scores valid only within this evaluation framework
- **Cross-domain generalization**: Limited to data visualization domain
- **Real-time applications**: Manual evaluation process not suitable for dynamic systems

### Domain Limitations:
- **Language specificity**: JavaScript/HTML/CSS/D3.js ecosystem only
- **Challenge complexity**: Intermediate-level programming problems
- **Cultural context**: Aesthetic judgments influenced by Western design principles
- **Temporal validity**: Best practices and design trends evolve over time

## Data Collection Process

### Human Evaluators
- **Qualifications**: Professional data visualization practitioners (minimum 2 years experience)
- **Expertise**: Web technologies (HTML, CSS, JavaScript, D3.js), UI/UX design principles
- **Training**: Standardized evaluation guidelines and rating criteria
- **Quality assurance**: Regular review of edge cases and evaluation consistency

### Evaluation Protocol
1. **Blind evaluation**: Evaluators unaware of model identity during assessment
2. **Randomized order**: Solutions presented in random sequence to mitigate bias
3. **Standardized criteria**: Consistent technical and aesthetic quality dimensions
4. **Consensus scoring**: Multiple evaluators with statistical aggregation

### Quality Control
- **Inter-rater reliability**: Pearson correlation and ICC measurements
- **Score validation**: Meaningful preference differences (≥0.5 points)
- **Metadata tracking**: Complete audit trail for reproducibility
- **Version control**: Systematic dataset versioning and change documentation

## Bias Considerations

### Potential Biases
1. **Evaluator bias**: Design preferences influenced by cultural background and professional experience
2. **Selection bias**: Model and challenge selection may not represent full capability spectrum
3. **Temporal bias**: Evaluation reflects current best practices and design trends
4. **Domain bias**: Focus on data visualization limits generalizability to other coding domains

### Mitigation Strategies
- **Expert evaluators**: Domain expertise reduces subjective interpretation variance
- **Multiple evaluators**: Consensus scoring across multiple human raters
- **Transparent methodology**: Complete documentation of evaluation process and criteria
- **Systematic sampling**: Representative model selection across providers and capability levels

## Ethical Considerations

### Fair Evaluation
- **Model neutrality**: No preferential treatment based on provider popularity or commercial relationships
- **Transparent criteria**: Evaluation dimensions clearly defined and consistently applied
- **Open methodology**: Complete evaluation process documented for reproducibility

### Data Rights and Usage
- **Generated content**: Code solutions created specifically for evaluation, no copyright concerns
- **Attribution**: Model providers credited appropriately in dataset metadata
- **Research purpose**: Dataset intended for academic research and non-commercial applications

### Potential Misuse Prevention
- **Quality limitations**: Clear documentation of dataset scope and evaluation context
- **Bias acknowledgment**: Explicit discussion of potential biases and limitations
- **Responsible use**: Guidelines for appropriate application in research and development

## Licensing

**License**: MIT License
**Commercial use**: Permitted with attribution
**Distribution**: Freely redistributable with proper citation
**Modification**: Allowed with clear documentation of changes

## Citation

If you use this dataset in your research, please cite:

```bibtex
@dataset{vizhub_benchmarks_2025,
  title={VizHub-Benchmarks: Multi-Dimensional Code Quality Dataset for RLHF},
  author={Fox, EJ and Kelleher, Curran},
  year={2025},
  publisher={GitHub},
  url={https://github.com/vizhub-core/vizhub-benchmarks},
  version={1.0.0}
}
```

## Contact Information

**Maintainers**: 
- EJ Fox (ej@ejfox.com)
- Curran Kelleher (curran@datavis.tech)

**Project Repository**: https://github.com/vizhub-core/vizhub-benchmarks
**Issues and Questions**: https://github.com/vizhub-core/vizhub-benchmarks/issues

## Changelog

### v1.0.0 (June 2025)
- Initial release with stockPriceChart challenge
- 9 preference pairs across 10 AI models
- Multi-dimensional quality assessment (technical + aesthetic)
- Complete methodology documentation and reproducibility package

### Future Releases
- Additional challenges (multiply, add, reverseString, etc.)
- Expanded model coverage
- Enhanced metadata and quality metrics
- Cross-cultural evaluator validation

---

*This dataset card follows HuggingFace dataset documentation standards and provides comprehensive information for responsible research use.*