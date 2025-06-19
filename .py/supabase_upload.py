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
mean_embedding = C.mean(dim=0)


# (Optional) Invert stoi to get index-to-word mapping
itos = {i: w for w, i in stoi.items()}
word = "sun"
if word in stoi:
    embedding = C[stoi[word]]
    print(f"Embedding for '{word}':", embedding.shape)
else:
    print(f"'{word}' not in vocabulary.")

load_dotenv(dotenv_path=".env")

SUPABASE_URL = os.getenv("PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("PRIVATE_SUPABASE_ROLE_KEY")

# Create Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


import csv


def batched_upserts(stoi: dict, C: t.Tensor, batch_size=10):
    # Sort by index and slice last 20%
    items = sorted(stoi.items(), key=lambda x: x[1])
    start_idx = int(0.4 * len(items))
    items = items[start_idx:]

    for i in tqdm(range(0, len(items), batch_size), desc="Batch inserting embeddings"):
        batch = items[i : i + batch_size]
        payload = [
            {"content": word, "embedding": C[idx].tolist()} for word, idx in batch
        ]
        supabase.table("embeddings").upsert(payload).execute()
        time.sleep(1)

    print(f"✅ Upserted {len(items)} embeddings in batches of {batch_size}")


# Call the batching function here


# Example: fetch from a table called "posts"
response = supabase.table("posts").select("*").execute()
for i in range(len(response.data)):
    post = response.data[i]
    content = post["content"]
    text = re.sub(r"[‘’]", "'", content)
    text = re.sub(r"[“”]", '"', content)
    words = re.findall(r"\b\w+'\w+|\w+\b", text.lower())
    vectors = []
    for word in words:
        if word in stoi:
            index = stoi[word]
            embedding = C[index]  # a vector that is 200 long

        else:
            embedding = mean_embedding
        vectors.append(embedding)
    stacked_words = t.stack(vectors)
    document_vector = stacked_words.mean(dim=0).tolist()
    # we mjust insert the embedding
    insert_response = (
        supabase.table("posts")
        .update({"embedding": document_vector})
        .eq("id", post["id"])
        .execute()
    )
    print(insert_response)
