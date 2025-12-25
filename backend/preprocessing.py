import pandas as pd
import numpy as np
import joblib
import os

class Preprocessor:
    def __init__(self, scaler_path='quantile_scaler.joblib'):
        self.scaler = None
        if os.path.exists(scaler_path):
            print(f"✅ Scaler loaded from {scaler_path}")
            self.scaler = joblib.load(scaler_path)
        else:
            print(f"⚠️ WARNING: {scaler_path} not found. Predictions will be inaccurate!")

    def engineer_features(self, input_data: dict):
        """
        Replicates the exact feature engineering pipeline from training.
        CRITICAL: Enforces column order to match training data exactly.
        """
        # 1. Convert to DataFrame
        df = pd.DataFrame([input_data])
        
        # 2. Base Feature Construction
        required_cols = ['Time', 'Amount'] + [f'V{i}' for i in range(1, 29)]
        for col in required_cols:
            if col not in df.columns:
                df[col] = 0.0

        # 3. Feature Engineering Logic
        df['Hour'] = (df['Time'] // 3600) % 24
        df['Hour_sin'] = np.sin(2 * np.pi * df['Hour'] / 24)
        df['Hour_cos'] = np.cos(2 * np.pi * df['Hour'] / 24)
        
        df['Amount_log'] = np.log1p(df['Amount'])
        
        # Interactions
        top_v = ['V17', 'V14', 'V12', 'V10', 'V4', 'V3', 'V11']
        for i, col1 in enumerate(top_v):
            for col2 in top_v[i:]:
                df[f'I_{col1}_{col2}'] = df[col1] * df[col2]
                
        # Aggregates
        v_cols = [f'V{i}' for i in range(1, 29)]
        df['V_std'] = df[v_cols].std(axis=1)
        df['V_max'] = df[v_cols].max(axis=1)
        
        # 4. CRITICAL: FORCE COLUMN ORDER
        final_order = []
        
        # Original CSV structure (minus Time/Class)
        final_order.extend([f'V{i}' for i in range(1, 29)]) 
        final_order.append('Amount')
        
        # Engineered features order
        final_order.extend(['Hour_sin', 'Hour_cos'])
        final_order.append('Amount_log')
        
        for i, col1 in enumerate(top_v):
            for col2 in top_v[i:]:
                final_order.append(f'I_{col1}_{col2}')
                
        final_order.extend(['V_std', 'V_max'])
        
        try:
            df_final = df[final_order]
            return df_final
        except KeyError as e:
            print(f"❌ Column Order Error: Missing {e}")
            raise e

    def transform(self, df):
        if self.scaler:
            return self.scaler.transform(df)
        return df.values
