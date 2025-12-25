# Job Application
Machine learning based credit card fraud detection system using Python and GitHub Codespaces.
# 🛡️ FraudGuard AI | Enterprise Risk Engine

![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)
![Python](https://img.shields.io/badge/Python-3.10+-yellow.svg)
![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-red.svg)
![React](https://img.shields.io/badge/React-18-cyan.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-teal.svg)

> **The Beast:** A massive 4096-width Deep Residual Network trained on **2x Tesla T4 GPUs** with a batch size of **24,576**.

**FraudGuard AI** is a production-grade, full-stack anomaly detection system designed to identify fraudulent credit card transactions in real-time. It combines a state-of-the-art PyTorch backend with a modern, glassmorphism-styled React frontend.

---

## ⚡ Key Features

* **Deep ResNet Classifier:** A supervised model with 6 residual blocks and 4096 neurons per layer, achieving elite precision on imbalanced data.
* **Unsupervised Autoencoder:** A secondary anomaly detection engine that flags transactions deviating from the mathematical manifold of "normal" spending.
* **Beast Mode Training:** Trained using **BorderlineSMOTE** (1:1 balance) and **Quantile Scaling** to force the model to learn hard decision boundaries.
* **Glassmorphism UI:** A futuristic, responsive dashboard built with React, Tailwind CSS, and Framer Motion.
* **Auto-Healing Backend:** The FastAPI server automatically downloads model weights (800MB+) from Hugging Face if they are missing.

---

## 🏆 Performance Metrics

Evaluated on the **Credit Card Fraud Detection** dataset (284,807 transactions).

| Metric | Score | Significance |
| :--- | :--- | :--- |
| **PR-AUC** | **0.8163** | Area Under Precision-Recall Curve. (Industry standard is ~0.75) |
| **ROC-AUC** | **0.9746** | Exceptional separation between Fraud and Normal classes. |
| **Inference** | **<50ms** | Real-time latency on standard CPU (via ONNX/PyTorch). |

---

## 🏗️ Architecture

### The Backend (FastAPI + PyTorch)
* **Model A (Classifier):** `ResNet-4096-Deep` with `Mish` activation and Dynamic Gaussian Noise Injection.
* **Model B (Autoencoder):** Bottleneck architecture for reconstruction error analysis.
* **Preprocessing:** Strict `QuantileTransformer` scaling (Gaussian Output) to normalize input vectors.

### The Frontend (React + Vite)
* **Visuals:** Tailwind CSS with extensive `backdrop-blur` and gradients.
* **State:** Real-time Axios integration with the risk engine.
* **UX:** Interactive simulation tools to generate "Normal" vs "Anomalous" traffic patterns.

---

## 🚀 Quick Start

### Prerequisites
* Python 3.10+
* Node.js 18+

### 1. Backend Setup
The backend will automatically download the trained models from [Hugging Face](https://huggingface.co/Arko007/credit-card-fraud-massive-resnet).

```bash
cd backend
# Install dependencies
pip install -r requirements.txt

# Start the Beast API
python main.py
```
Wait for the logs to say: ✅ Classifier Loaded (The Beast)

2. Frontend Setup
Open a new terminal.
```bash
cd frontend
# Install dependencies
npm install

# Launch Dashboard
npm run dev
```
Open your browser to http://localhost:5173.

📂 Project Structure
```Plaintext

fraud-detection-beast/
├── backend/                        # Python FastAPI Backend
│   ├── main.py                     # API Entry point
│   ├── model_defs.py               # PyTorch Architecture definitions
│   ├── preprocessing.py            # Feature Engineering logic
│   ├── quantile_scaler.joblib      # Production Scaler (CRITICAL)
│   └── requirements.txt            # Dependencies
│
├── frontend/                       # React + Vite Frontend
│   ├── src/
│   │   ├── App.jsx                 # Glassmorphism UI
│   │   └── main.jsx                # React root
│   └── public/                     # Static assets (Shield Logo)
│
└── README.md                       # Documentation
```
🛡️ Feature Engineering Pipeline
The model does not take raw data. It processes inputs through a rigorous pipeline:

Log Transformation: log1p(Amount) to crush outliers.

Cyclical Encoding: Converting Time into Hour_sin and Hour_cos.

Interaction Terms: Polynomial features for high-correlation components (e.g., V14 * V17).

Scaling: All 62 features are mapped to a Normal Distribution using the saved quantile_scaler.joblib.

📄 License
This project is licensed under the Apache 2.0 License.

Models hosted on: Hugging Face