from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from huggingface_hub import hf_hub_download
import torch
import numpy as np
import os
import uvicorn
from contextlib import asynccontextmanager

# Import custom modules
from model_defs import ResNetClassifier, AE
from preprocessing import Preprocessor

# ================= CONFIGURATION =================
DEVICE = 'cuda' if torch.cuda.is_available() else 'cpu'

# Hugging Face Configuration
HF_REPO_ID = "Arko007/credit-card-fraud-massive-resnet"
CLASSIFIER_FILENAME = "Classifier.pt"   # Renamed from Classifier_best.pt
AE_FILENAME = "Autoencoder.pt"         # Renamed from Autoencoder_best.pt
SCALER_FILENAME = "quantile_scaler.joblib"

AE_THRESHOLD = 0.0115

# ================= HELPER: DOWNLOAD MODEL =================
def get_file_path(filename):
    """
    Checks local directory first, otherwise downloads from HF.
    """
    if os.path.exists(filename):
        print(f"📂 Found local file: {filename}")
        return filename
    
    print(f"⬇️ Downloading {filename} from Hugging Face ({HF_REPO_ID})...")
    try:
        path = hf_hub_download(repo_id=HF_REPO_ID, filename=filename)
        print(f"✅ Download complete: {path}")
        return path
    except Exception as e:
        print(f"❌ Failed to download {filename}: {e}")
        return None

# ================= STATE =================
models = {}
preprocessor = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"🚀 Initializing Beast API on {DEVICE}...")
    global preprocessor
    
    # 1. Load Preprocessor (Auto-Download Scaler)
    scaler_path = get_file_path(SCALER_FILENAME)
    if scaler_path:
        preprocessor = Preprocessor(scaler_path)
    else:
        print("⚠️ CRITICAL: Scaler not found. Feature scaling will fail.")
    
    # 2. Load Models (Auto-Download Weights)
    try:
        # Classifier
        clf_path = get_file_path(CLASSIFIER_FILENAME)
        clf = ResNetClassifier(input_dim=62)
        
        if clf_path:
            state_dict = torch.load(clf_path, map_location=DEVICE)
            # Remove 'module.' prefix if it exists
            new_state_dict = {k.replace("module.", ""): v for k, v in state_dict.items()}
            clf.load_state_dict(new_state_dict)
            clf.to(DEVICE)
            clf.eval()
            models['clf'] = clf
            print("✅ Classifier Loaded (The Beast)")
        else:
            print("❌ Classifier weights missing.")

        # Autoencoder
        ae_path = get_file_path(AE_FILENAME)
        ae = AE(input_dim=62)
        
        if ae_path:
            state_dict = torch.load(ae_path, map_location=DEVICE)
            new_state_dict = {k.replace("module.", ""): v for k, v in state_dict.items()}
            ae.load_state_dict(new_state_dict)
            ae.to(DEVICE)
            ae.eval()
            models['ae'] = ae
            print("✅ Autoencoder Loaded")
        else:
            print("❌ Autoencoder weights missing.")
            
    except Exception as e:
        print(f"🔥 Critical Error: {e}")
        
    yield
    models.clear()

app = FastAPI(title="Fraud Detection API", lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Transaction(BaseModel):
    Time: float
    Amount: float
    V1: float = 0.0
    V2: float = 0.0
    V3: float = 0.0
    V4: float = 0.0
    V5: float = 0.0
    V6: float = 0.0
    V7: float = 0.0
    V8: float = 0.0
    V9: float = 0.0
    V10: float = 0.0
    V11: float = 0.0
    V12: float = 0.0
    V13: float = 0.0
    V14: float = 0.0
    V15: float = 0.0
    V16: float = 0.0
    V17: float = 0.0
    V18: float = 0.0
    V19: float = 0.0
    V20: float = 0.0
    V21: float = 0.0
    V22: float = 0.0
    V23: float = 0.0
    V24: float = 0.0
    V25: float = 0.0
    V26: float = 0.0
    V27: float = 0.0
    V28: float = 0.0

@app.post("/predict")
def predict(txn: Transaction):
    if 'clf' not in models or not preprocessor:
        raise HTTPException(status_code=503, detail="System not ready (Models or Scaler missing)")

    try:
        # Pipeline
        input_data = txn.dict()
        df = preprocessor.engineer_features(input_data)
        X_scaled = preprocessor.transform(df)
        X_tensor = torch.tensor(X_scaled, dtype=torch.float32).to(DEVICE)

        with torch.no_grad():
            # Classifier
            logits = models['clf'](X_tensor)
            clf_prob = torch.sigmoid(logits).item()
            
            # Autoencoder
            mse = 0.0
            ae_score_norm = 0.0
            if 'ae' in models:
                recon = models['ae'](X_tensor)
                mse = torch.mean((X_tensor - recon) ** 2, dim=1).item()
                ae_score_norm = min(mse / (AE_THRESHOLD * 2), 1.0)
        
        # Ensemble
        final_score = (0.2 * ae_score_norm) + (0.8 * clf_prob)
        
        risk_level = "LOW"
        if final_score > 0.8: risk_level = "CRITICAL"
        elif final_score > 0.5: risk_level = "HIGH"
        elif final_score > 0.2: risk_level = "MODERATE"

        return {
            "fraud_probability": final_score,
            "is_fraud": final_score > 0.5,
            "risk_level": risk_level,
            "details": {
                "classifier_score": clf_prob,
                "anomaly_score": mse,
                "normalized_anomaly": ae_score_norm
            }
        }
    except Exception as e:
        print(f"Prediction Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
