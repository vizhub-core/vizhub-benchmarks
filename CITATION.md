# Citation and DOI Information

## How to Cite This Work

### Dataset Citation

If you use the VizHub-Benchmarks dataset in your research, please cite:

```bibtex
@dataset{vizhub_benchmarks_2025,
  title={VizHub-Benchmarks: Multi-Dimensional Code Quality Dataset for RLHF Training},
  author={Fox, EJ and Kelleher, Curran},
  year={2025},
  publisher={GitHub},
  doi={10.5281/zenodo.XXXXXX},
  url={https://github.com/vizhub-core/vizhub-benchmarks},
  version={1.0.0},
  note={Dataset for reinforcement learning from human feedback on AI-generated code quality}
}
```

### Methodology Citation

If you use or reference our evaluation methodology, please cite:

```bibtex
@misc{fox2025methodology,
  title={Multi-Dimensional Human Evaluation Methodology for AI Code Generation Quality Assessment},
  author={Fox, EJ and Kelleher, Curran},
  year={2025},
  eprint={arXiv:XXXX.XXXXX},
  archivePrefix={arXiv},
  primaryClass={cs.SE},
  url={https://github.com/vizhub-core/vizhub-benchmarks/blob/main/METHODOLOGY.md}
}
```

### Software Citation

If you use our grading interface or export tools, please cite:

```bibtex
@software{vizhub_grader_2025,
  title={VizHub-Benchmarks: Collaborative Grading Interface for AI Code Evaluation},
  author={Fox, EJ and Kelleher, Curran},
  year={2025},
  publisher={GitHub},
  url={https://github.com/vizhub-core/vizhub-benchmarks},
  version={1.0.0}
}
```

## DOI Registration

### Zenodo Integration

We use Zenodo for permanent dataset archival and DOI assignment:

**Current Status**: DOI registration pending
**Expected DOI**: `10.5281/zenodo.XXXXXX`
**Archive URL**: `https://zenodo.org/record/XXXXXX`

### Version-Specific DOIs

Each dataset release receives a unique DOI for precise citation:

| Version | DOI | Release Date | Description |
|---------|-----|--------------|-------------|
| v1.0.0 | `10.5281/zenodo.XXXXXX` | June 2025 | Initial release with stockPriceChart |
| v1.1.0 | TBD | TBD | Additional challenges and models |
| v2.0.0 | TBD | TBD | Multi-dimensional rating expansion |

## Academic Publication Plan

### Target Venues

**Primary Targets**:
- **ICML 2026**: Workshop on Human-AI Interaction
- **NeurIPS 2026**: Datasets and Benchmarks Track
- **ACL 2026**: Workshop on Evaluation and Comparison of NLP Systems

**Secondary Targets**:
- **IEEE Software**: Special Issue on AI-Assisted Programming
- **TOSEM**: ACM Transactions on Software Engineering and Methodology
- **EMSE**: Empirical Software Engineering

### Publication Timeline

**Phase 1 (Q3 2025)**: Dataset paper submission
- Complete methodology validation
- Expand to 100+ examples across multiple challenges
- Inter-rater reliability analysis

**Phase 2 (Q4 2025)**: Methodology paper submission  
- Statistical validation of evaluation framework
- Comparison with existing benchmarks
- Cross-cultural validation study

**Phase 3 (Q1 2026)**: Application papers
- RLHF training results using our dataset
- Model capability analysis and rankings
- Best practices for code quality evaluation

## Related Work Citations

### Foundational RLHF Research

```bibtex
@article{christiano2017deep,
  title={Deep reinforcement learning from human feedback},
  author={Christiano, Paul F and Leike, Jan and Brown, Tom and Martic, Miljan and Legg, Shane and Amodei, Dario},
  journal={Advances in neural information processing systems},
  volume={30},
  year={2017}
}

@article{ouyang2022training,
  title={Training language models to follow instructions with human feedback},
  author={Ouyang, Long and Wu, Jeffrey and Jiang, Xu and Almeida, Diogo and Wainwright, Carroll L and Mishkin, Pamela and Zhang, Chong and Agarwal, Sandhini and Slama, Katarina and Ray, Alex and others},
  journal={Advances in Neural Information Processing Systems},
  volume={35},
  pages={27730--27744},
  year={2022}
}

@article{bai2022constitutional,
  title={Constitutional ai: Harmlessness from ai feedback},
  author={Bai, Yuntao and Jones, Andy and Ndousse, Kamal and Askell, Amanda and Chen, Anna and DasSarma, Nova and Drain, Dawn and Fort, Stanislav and Ganguli, Deep and Henighan, Tom and others},
  journal={arXiv preprint arXiv:2212.08073},
  year={2022}
}
```

### Code Generation Benchmarks

```bibtex
@article{chen2021evaluating,
  title={Evaluating large language models trained on code},
  author={Chen, Mark and Tworek, Jerry and Jun, Heewoo and Yuan, Qiming and Pinto, Henrique Ponde de Oliveira and Kaplan, Jared and Edwards, Harri and Burda, Yuri and Joseph, Nicholas and Brockman, Greg and others},
  journal={arXiv preprint arXiv:2107.03374},
  year={2021}
}

@article{austin2021program,
  title={Program synthesis with large language models},
  author={Austin, Jacob and Odena, Augustus and Nye, Maxwell and Bosma, Maarten and Michalewski, Henryk and Dohan, David and Shyam, Pengcheng and Nguyen, Christine and Krueger, David and Sutskever, Ilya},
  journal={arXiv preprint arXiv:2108.07732},
  year={2021}
}
```

### Human Evaluation Methodologies

```bibtex
@article{liang2022holistic,
  title={Holistic evaluation of language models},
  author={Liang, Percy and Bommasani, Rishi and Lee, Tony and Tsipras, Dimitris and Soylu, Dilara and Yasunaga, Michihiro and Zhang, Yian and Narayanan, Deepak and Wu, Yuhuai and Kumar, Ananya and others},
  journal={arXiv preprint arXiv:2211.09110},
  year={2022}
}

@article{cicchetti1994guidelines,
  title={Guidelines, criteria, and rules of thumb for evaluating normed and standardized assessment instruments in psychology},
  author={Cicchetti, Domenic V},
  journal={Psychological assessment},
  volume={6},
  number={4},
  pages={284},
  year={1994},
  publisher={American Psychological Association}
}
```

## Attribution Requirements

### Minimum Attribution

When using any component of this work, please include:

> "This work uses the VizHub-Benchmarks dataset (Fox & Kelleher, 2025), available at https://github.com/vizhub-core/vizhub-benchmarks"

### Full Attribution

For research publications, please include:

1. **Dataset citation** in references
2. **Methodology reference** if using evaluation framework
3. **Brief description** of dataset characteristics in methods section
4. **Acknowledgment** of original authors in acknowledgments section

### Commercial Use Attribution

Commercial applications must include:

1. **Visible attribution** in documentation or about section
2. **Link** to original repository
3. **License compliance** with MIT license terms
4. **Contact** with maintainers for large-scale commercial use

## Contact for Citations

For questions about citation, DOI registration, or academic collaboration:

**Primary Contact**: EJ Fox (ej@ejfox.com)
**Secondary Contact**: Curran Kelleher (curran@datavis.tech)
**Project Issues**: https://github.com/vizhub-core/vizhub-benchmarks/issues

## Derived Work Guidelines

### Acceptable Derived Works
- **Extended datasets** with additional challenges or models
- **Modified evaluation methodologies** with proper attribution
- **Statistical analysis** using our methodology framework
- **Replication studies** with different model sets

### Required Documentation for Derived Works
1. **Clear attribution** to original dataset and methodology
2. **Description of modifications** made to original approach
3. **Rationale** for changes and improvements
4. **Comparison** with original results where applicable

### Collaboration Opportunities

We welcome collaboration on:
- **Dataset expansion** with additional challenges
- **Cross-cultural validation** studies
- **Methodology refinement** and statistical validation
- **Application research** using the dataset

Please contact us to discuss potential collaborations and co-authorship opportunities.

---

*This citation guide ensures proper academic attribution and supports the development of a research community around multi-dimensional code quality evaluation.*