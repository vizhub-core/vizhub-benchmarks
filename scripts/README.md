# Training Dataset Export Scripts

This directory contains scripts for converting human-graded code generation evaluations into industry-standard training datasets for LLM fine-tuning and research.

## 🎯 Strategic Purpose

These scripts transform our collaborative grading data into **valuable training datasets** that can:

1. **Fine-tune coding models** with human preference data (RLHF)
2. **Train reward models** to automatically assess code quality
3. **Enable academic research** with standardized evaluation datasets
4. **Benchmark model capabilities** against human-validated standards

## 📊 HuggingFace RLHF Export

### Overview

`export-huggingface.js` converts graded challenge results into the industry-standard RLHF format used by OpenAI, Anthropic, and leading AI labs.

**Output Format**: `{prompt, chosen, rejected}` triplets following [Anthropic/hh-rlhf](https://huggingface.co/datasets/Anthropic/hh-rlhf) schema.

### Quick Start

```bash
# Export with default settings
npm run export:huggingface

# Export with custom options
npm run export:huggingface -- --output my-dataset.jsonl --min-votes 2 --verbose

# View all options
npm run export:huggingface -- --help
```

### How It Works

1. **Load Grader Data**: Reads all CSV files from `benchmarks/results/grades/`
2. **Calculate Consensus**: Aggregates ratings across multiple graders
3. **Create Preference Pairs**: Identifies "chosen" vs "rejected" code based on human ratings
4. **Generate Training Examples**: Exports standardized JSONL format with metadata

### Example Output

```json
{
  "prompt": "Generate code for the stockPriceChart challenge.",
  "chosen": "**index.html**\n\n```html\n<!DOCTYPE html>...",
  "rejected": "**index.html**\n\n```html\n<!DOCTYPE html>...",
  "metadata": {
    "challenge": "stockPriceChart",
    "chosen_model": "qwen/qwq-32b",
    "rejected_model": "deepseek/deepseek-r1",
    "chosen_scores": {
      "technical": 5,
      "aesthetic": 5,
      "overall": 5.0,
      "vote_count": 1
    },
    "rejected_scores": {
      "technical": 4,
      "aesthetic": 3,
      "overall": 3.5,
      "vote_count": 1
    },
    "score_difference": 1.5,
    "dataset_version": "1.0.0",
    "generated_at": "2025-06-03T17:30:07.636Z"
  }
}
```

## 🔬 Technical Details

### Quality Assurance

- **Minimum Vote Threshold**: Configurable minimum grader agreement
- **Score Difference Filter**: Only creates pairs with meaningful quality gaps (≥0.5 points)
- **Code Validation**: Ensures both chosen/rejected examples have valid code content
- **Metadata Tracking**: Full audit trail of model performance and grader decisions

### File Structure

```
exports/
├── training-dataset-v1.0.jsonl     # Main RLHF dataset
└── training-dataset-v1.0.meta.json # Dataset statistics and metadata
```

### Integration with Research Pipelines

**HuggingFace Datasets**:
```python
from datasets import load_dataset
dataset = load_dataset('json', data_files='training-dataset-v1.0.jsonl')
```

**Direct Fine-tuning**:
```python
# Compatible with TRL, OpenAI fine-tuning API, etc.
import json
with open('training-dataset-v1.0.jsonl') as f:
    examples = [json.loads(line) for line in f]
```

## 🎓 Research Impact

This export capability transforms our grading interface from a simple evaluation tool into **research infrastructure** that:

- **Generates publication-ready datasets** with proper methodology documentation
- **Enables reproducible research** with versioned, citable datasets  
- **Supports industry training pipelines** with standardized formats
- **Creates competitive advantage** through high-quality human evaluation data

## 🚀 Next Steps

1. **Calibration System**: Ensure consistent grader quality (PR #2)
2. **Academic Documentation**: Add methodology docs for citations (PR #3)
3. **Multi-dimensional Ratings**: Richer training signals beyond technical/aesthetic (PR #4)
4. **Quality Detection**: Automated flagging of annotation inconsistencies (PR #5)

---

*Generated as part of the vizhub-benchmarks training dataset infrastructure initiative.*