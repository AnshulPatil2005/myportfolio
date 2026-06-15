### ML-Focused Technical Description

**Gujarati Legal Document Corpus and NLP Pipeline for Court Case Understanding**

This research project is not limited to scraping Gujarat court data. The main objective is to build a machine learning-ready Gujarati legal corpus and use it to train, evaluate, and compare NLP models for legal document understanding. The scraping pipeline provides the raw legal documents, while the ML pipeline converts those documents into structured training data for tasks such as legal text classification, bail order understanding, information extraction, summarization, and legal question answering.

The first ML component is the **document extraction and normalization layer**. Gujarat court PDFs are highly inconsistent: some contain valid Unicode Gujarati text, some use legacy fonts such as LMG-Arun and TERAFONT-VARUN, and others contain corrupted or missing ToUnicode mappings. Because of this, the project evaluates multiple text extraction strategies before model training, including direct PDF text extraction, legacy font conversion, Tesseract Gujarati OCR, SuryaOCR, Google Cloud Vision OCR, IronOCR, and deterministic glyph-to-Unicode mapping. The extracted text is then cleaned, normalized, and stored with metadata such as district, court, year, legal section, case number, CNR number, PDF path, extraction method, and error flags. The project specifically identifies OCR errors such as Gujarati digit ૨ being confused with ર, broken conjuncts, wrong vowel marks, and noisy stamp/signature hallucinations. 

The second ML component is **dataset construction for supervised and weakly supervised learning**. Each scraped case can be converted into a structured JSONL record containing the raw judgment/order text, case metadata, section information, and document-level labels. For bail-related cases, labels can include bail granted, bail rejected, pending/unclear outcome, legal section, offense type, applicant/respondent details, court name, date, advocate names, judge names, and cited statutes. This creates a task-specific Gujarati legal dataset that can be used for both classification and extraction.

The third component is **baseline OCR and text-quality evaluation**. Before training legal NLP models, the project compares text extraction quality across tools. Tesseract with Gujarati support is treated as a baseline, but it produces major errors in names, dates, amounts, conjuncts, and legal phrases. SuryaOCR is considered as a stronger open-source OCR candidate, while Google Cloud Vision and IronOCR are considered paid high-accuracy alternatives. Legacy-font conversion is also explored because many PDFs visually render Gujarati correctly but internally store glyph IDs rather than Unicode text. This OCR/text extraction evaluation becomes important because downstream NLP model performance depends directly on extraction quality.

The fourth component is **Gujarati legal text classification**. Once the corpus is cleaned, transformer-based models can be trained to classify documents into legal categories. Candidate models include multilingual BERT, XLM-RoBERTa, IndicBERT, MuRIL, and newer multilingual encoder models. These models can be fine-tuned for tasks such as:

* Predicting whether a document is a bail order, domestic violence order, criminal procedure order, or other legal category
* Classifying the relevant legal section, such as CrPC 436, 437, 438, or 439
* Predicting case outcome, such as bail granted or bail rejected
* Detecting whether the order contains procedural, factual, or final judgment content
* Classifying document quality based on whether extraction is clean, noisy, or unusable

The fifth component is **legal named entity recognition and fact extraction**. Sequence labeling models can be trained to extract legal entities from Gujarati court text. These entities may include petitioner/applicant names, respondent names, advocate names, judge names, court names, dates, monetary amounts, sections, acts, police station names, FIR numbers, and final order outcomes. For this part, models such as IndicBERT, MuRIL, XLM-R, or multilingual token classification transformers can be fine-tuned using manually or weakly annotated examples. A rule-based baseline using regex can also be used for structured fields such as dates, amounts, case numbers, and section references.

The sixth component is **legal summarization**. Since court orders are often long and noisy, the project can train or evaluate summarization models that convert Gujarati legal orders into concise structured summaries. Possible models include mT5, IndicBART, mBART, ByT5, and newer instruction-tuned multilingual LLMs. The summaries can be generated in either Gujarati or English, depending on the downstream use case. A target summary may include the case background, legal section, key allegations, court reasoning, and final decision.

The seventh component is **retrieval and legal question answering**. After text extraction and cleaning, the corpus can be indexed using multilingual sentence embedding models. Candidate embedding models include LaBSE, multilingual-e5, BGE-M3, Indic sentence-transformer models, and XLM-R based embeddings. These embeddings can support semantic search over Gujarati court documents. A retrieval-augmented generation system can then answer questions such as:

* Which cases mention anticipatory bail under CrPC 438?
* Which court orders granted bail in a specific district and year?
* What were the common reasons for bail rejection?
* Which documents mention a specific legal provision or police station?
* What are the facts and outcome of a given CNR number?

The eighth component is **LLM-based structured information extraction**. Larger language models can be used to convert noisy legal text into structured JSON. Models such as LLaMA, Qwen, Gemma, or other multilingual instruction-tuned models can be tested for extracting fields like case parties, court, judge, act, section, outcome, reasoning, and cited provisions. Since many general-purpose VLMs and LLMs are weak on Gujarati legal text, the project can compare zero-shot prompting, few-shot prompting, LoRA fine-tuning, and OCR-corrected input pipelines.

A strong ML workflow for this project would look like this:

1. Scrape Gujarat eCourts metadata and PDFs.
2. Extract text using direct PDF parsing, OCR, or legacy font conversion.
3. Normalize Gujarati text and remove extraction noise.
4. Build JSONL records with metadata, text, labels, and extraction-quality tags.
5. Train baseline models using TF-IDF plus Logistic Regression or SVM.
6. Fine-tune transformer models such as IndicBERT, MuRIL, XLM-R, mT5, or mBART.
7. Compare results across extraction methods to measure OCR impact on NLP performance.
8. Build retrieval indexes using multilingual embedding models.
9. Evaluate classification, extraction, summarization, and retrieval performance.
10. Use the best-performing pipeline for Gujarati legal analytics and court case understanding.

The main ML contribution is the creation of a low-resource Gujarati legal NLP pipeline where model performance is studied under real-world document noise. Unlike clean benchmark datasets, this project deals with corrupted PDFs, legacy fonts, OCR uncertainty, incomplete metadata, session-bound court documents, and inconsistent legal formatting. This makes the ML problem more realistic and technically valuable because the models must work on actual district court data rather than pre-cleaned legal text.

**Robust and Explainable CNN-Based Chest X-Ray Classification Across Unseen Clinical Datasets**
## Implementation-Focused Research Project Description

This project implements a **cross-dataset generalization pipeline for multi-label chest X-ray classification**. The main idea is to train CNN-based models on one primary dataset, starting with **CheXpert**, and then evaluate the same trained models directly on completely unseen external datasets such as **MIMIC-CXR-JPG, ChestX-ray14, PadChest, VinDr-CXR, and BRAX**. This setup is designed to measure whether a model actually learns transferable radiological features or whether it overfits to dataset-specific shortcuts such as scanner style, hospital source, image resolution, preprocessing artifacts, or label-generation bias. 

The initial implementation uses **CheXpert as the source training dataset** because it is a large-scale multi-label CXR dataset with 224,316 images, 65,240 patients, and 14 disease labels. The CheXpert training split is used to train the models, while the CheXpert validation split is used for internal model selection and sanity checking. After training, the model weights are frozen and evaluated without further fine-tuning on external datasets. This creates a strict external validation setting where datasets such as MIMIC-CXR-JPG, NIH ChestX-ray14, PadChest, VinDr-CXR, and BRAX act as unseen test domains.

Before training, all datasets are converted into a common format. Each dataset is parsed into image paths, patient-level metadata where available, and multi-label disease vectors. Since the datasets use different annotation schemes, a **label harmonization module** maps their labels into a shared disease space. The shared labels include conditions such as **No Finding, Cardiomegaly, Atelectasis, Consolidation, Pleural Effusion, Pneumothorax, Pneumonia, Edema, and Lung Lesion**. For labels that do not perfectly match across datasets, the implementation handles them separately. For example, Lung Lesion can be approximated by merging Mass and Nodule labels in datasets where direct Lung Lesion labels are unavailable, while Pneumonia and Edema may be excluded from VinDr-specific evaluation if clean mapping is not possible.

The image preprocessing pipeline standardizes each dataset before model input. Since original CXR images can vary from low-resolution downsampled versions to 2000 to 3000 pixel resolution scans, the pipeline resizes images to controlled resolutions such as **224, 384, 512, 1024, and 2048** depending on the experiment. Each image is converted into a consistent tensor format, normalized, and passed through the selected CNN backbone. Different preprocessing variants are tested, including ImageNet normalization, min-max scaling, per-image z-score normalization, histogram standardization, ROI cropping, adaptive ROI crop plus histogram standardization, and CLAHE.

The first model implementation uses **DenseNet-121** as the baseline. This model is trained on CheXpert using a multi-label classification head with sigmoid activation and binary cross-entropy loss. DenseNet-121 is selected first because it is a standard CXR classification backbone and provides a reliable baseline for comparing newer architectures. A simple DenseNet-121 training run on downsampled CheXpert is used as the initial sanity check to confirm that the data loading, label parsing, training loop, loss computation, and validation metrics are working correctly.

After the baseline is verified, the same training and evaluation pipeline is extended to multiple CNN architectures. The main architecture set includes:

**Classic baselines:** DenseNet-121, ResNet-18, ResNet-50, DenseNet-161, ResNet-101
**Modern CNNs:** ConvNeXt-S, ConvNeXt V2-T, EfficientNetV2-S
**Efficient/NAS models:** EfficientNet-B0, EfficientNet-B4
**Multi-label or attention-based models:** TResNet-50, SE-ResNet-50, ResNeXt-101
**Lightweight models:** MobileNetV3-Large, RepVGG-B0
**Underexplored models:** RegNet-Y-4GF, Xception, DPN-style models if compute allows

Each model is trained under the same controlled data split and evaluation protocol. The output layer is replaced with a dataset-specific multi-label classifier matching the harmonized label count. During training, the model predicts one probability per disease label. During evaluation, predictions are compared against the harmonized ground-truth labels for both internal CheXpert validation and external dataset validation.

The generalization experiment is implemented in two stages. In the first stage, each model is trained only on CheXpert and evaluated on CheXpert validation to measure in-domain performance. In the second stage, the same trained checkpoint is evaluated on external datasets without additional training. This gives a direct comparison between **internal performance** and **external generalization performance**. A model that performs well on CheXpert but drops sharply on MIMIC-CXR, NIH, PadChest, VinDr, or BRAX is treated as less generalizable.

The evaluation script reports both overall and per-dataset metrics. For each dataset, it computes **per-class AUROC, macro-AUROC, macro-F1, precision, recall, sensitivity, specificity, and calibration metrics** where possible. Results are stored separately for each model and each dataset so that the generalization gap can be measured as:

`Generalization Gap = Internal CheXpert Performance - External Dataset Performance`

This allows the project to identify which CNN architectures are robust across hospitals and which ones are over-specialized to CheXpert.

The project also includes architecture-efficiency tracking. For every model, the pipeline records **number of parameters, FLOPs, GPU memory usage, training time per epoch, convergence speed, and inference throughput**. These values are combined with AUROC and macro-F1 to build an accuracy-efficiency comparison. This helps identify models that are not only accurate but also practical for clinical deployment or low-resource settings.

A second implementation phase studies training choices beyond architecture. Using a fixed backbone such as DenseNet-121 or ConvNeXt-S, the project tests different optimizers including **AdamW, Muon, Schedule-Free AdamW, Lion, SOAP, Adan, MARS, SAM variants, and RMSProp**. Each optimizer is evaluated using the same CheXpert training data and the same external dataset testing protocol. The goal is to determine whether optimizer choice affects external generalization, convergence stability, and robustness.

The project also implements loss-function ablations. Standard **binary cross-entropy** is compared with **focal loss**, **margin-based surrogate loss**, and AUC-oriented loss functions. Since CheXpert and similar datasets contain uncertain labels, the implementation also compares uncertainty-label strategies such as **U-Ones, U-Zeros, U-Ignore, and label smoothing**. These experiments test whether better handling of ambiguous radiology labels improves external performance.

For shortcut analysis, the implementation may train a separate **dataset-source classifier**. In this setup, the model predicts which dataset an image came from, rather than predicting disease labels. If the dataset-source classifier performs very well, it indicates that strong dataset-specific visual signatures exist. This supports the hypothesis that disease classifiers may exploit shortcuts related to hospital source, scanner type, resolution, or preprocessing style. The main disease models can then be analyzed to see whether stronger dataset-source separability corresponds to weaker external generalization.

The final part of the implementation includes **XAI-based inspection**. For selected models, Grad-CAM-style heatmaps are generated for correct predictions, incorrect predictions, and high-confidence failures. These heatmaps are compared across datasets to check whether the model attends to clinically meaningful regions such as lungs, pleura, cardiac silhouette, or lesion regions, or whether it relies on irrelevant features such as image borders, text markers, black padding, acquisition artifacts, or dataset-specific cues.

In summary, the implementation follows this structure:

1. Load and preprocess CheXpert as the primary training dataset.
2. Harmonize labels across CheXpert, MIMIC-CXR-JPG, ChestX-ray14, PadChest, VinDr-CXR, and BRAX.
3. Train CNN models on CheXpert using a multi-label sigmoid classification head.
4. Validate internally on CheXpert.
5. Freeze the trained model and evaluate directly on external datasets.
6. Compare internal performance, external performance, and generalization gap.
7. Repeat the same protocol for multiple CNN backbones, preprocessing strategies, optimizers, loss functions, and uncertainty-label strategies.
8. Use efficiency metrics and XAI visualizations to identify models that are accurate, robust, efficient, and clinically interpretable.

Overall, this project builds a reproducible implementation framework for testing how well CNN-based CXR classifiers generalize beyond their training hospital. Instead of reporting only internal test accuracy, the project emphasizes external validation, label harmonization, shortcut detection, model efficiency, and explainability as core parts of the medical imaging pipeline.
