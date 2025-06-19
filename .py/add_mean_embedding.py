from supabase import create_client, Client
import os
from dotenv import load_dotenv
from statistics import *
import torch as t
import torch.nn.functional as F
import re
import time
from tqdm import tqdm

py_version = "C:/Users/Sreek/AppData/Local/Programs/Python/Python310/python.exe"
model_data = t.load(r"C:\Users\Sreek\website\.py\model_weights2.pth")


# Extract the embedding table and the stoi dict
C = model_data["C"]  # tensor of shape [vocab_size, 200]
stoi = model_data["stoi"]  # dictionary: {word: index}
mean_embedding = C.mean(dim=0).tolist()

load_dotenv(dotenv_path=".env")

SUPABASE_URL = os.getenv("PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("PRIVATE_SUPABASE_ROLE_KEY")

# Create Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
payload = [{"content": "<MEAN_EMBEDDING>", "embedding": mean_embedding}]
supabase.table("embeddings").upsert(payload).execute()
print("completed!!!")
