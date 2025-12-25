import torch
import torch.nn as nn
import torch.nn.functional as F

# ==========================================
# 🧠 MODEL ARCHITECTURE
# ==========================================

class GaussianNoise(nn.Module):
    def __init__(self, sigma=0.05):
        super().__init__()
        self.sigma = sigma
    def forward(self, x):
        if self.training:
            return x + torch.randn_like(x) * self.sigma
        return x

class Mish(nn.Module):
    def forward(self, x):
        return x * torch.tanh(F.softplus(x))

class ResBlock(nn.Module):
    def __init__(self, dim, dropout=0.2):
        super().__init__()
        self.norm1 = nn.BatchNorm1d(dim)
        self.act1 = Mish()
        self.fc1 = nn.Linear(dim, dim)
        self.drop1 = nn.Dropout(dropout)
        
        self.norm2 = nn.BatchNorm1d(dim)
        self.act2 = Mish()
        self.fc2 = nn.Linear(dim, dim)
        self.drop2 = nn.Dropout(dropout)
        
    def forward(self, x):
        res = x
        x = self.norm1(x)
        x = self.act1(x)
        x = self.fc1(x)
        x = self.drop1(x)
        x = self.norm2(x)
        x = self.act2(x)
        x = self.fc2(x)
        x = self.drop2(x)
        return x + res

class AE(nn.Module):
    def __init__(self, input_dim=62):
        super().__init__()
        # Encoder
        self.encoder = nn.Sequential(
            GaussianNoise(0.05),
            nn.Linear(input_dim, 2048),
            nn.BatchNorm1d(2048),
            Mish(),
            nn.Linear(2048, 512),
            nn.BatchNorm1d(512),
            Mish(),
            nn.Linear(512, 128) # Latent
        )
        # Decoder
        self.decoder = nn.Sequential(
            nn.Linear(128, 512),
            nn.BatchNorm1d(512),
            Mish(),
            nn.Linear(512, 2048),
            nn.BatchNorm1d(2048),
            Mish(),
            nn.Linear(2048, input_dim)
        )
        
    def forward(self, x):
        z = self.encoder(x)
        return self.decoder(z)

class ResNetClassifier(nn.Module):
    def __init__(self, input_dim=62):
        super().__init__()
        self.noise = GaussianNoise(0.05)
        self.proj = nn.Linear(input_dim, 4096)
        self.blocks = nn.Sequential(
            ResBlock(4096, 0.4),
            ResBlock(4096, 0.4),
            ResBlock(4096, 0.3),
            ResBlock(4096, 0.3),
            ResBlock(4096, 0.2),
            ResBlock(4096, 0.2)
        )
        self.bottleneck = nn.Sequential(
            nn.BatchNorm1d(4096),
            Mish(),
            nn.Linear(4096, 512),
            Mish()
        )
        self.head = nn.Linear(512, 1)

    def forward(self, x):
        x = self.noise(x)
        x = self.proj(x)
        x = self.blocks(x)
        x = self.bottleneck(x)
        return self.head(x).squeeze()
