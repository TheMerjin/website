from supabase import create_client, Client
import os
from dotenv import load_dotenv
import torch as t
import torch.nn.functional as F
import numpy as np
import re
import sys
import json
from typing import List, Dict, Any

# Load environment variables
load_dotenv(dotenv_path=".env")

SUPABASE_URL = os.getenv("PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("PRIVATE_SUPABASE_ROLE_KEY")

# Load the model
model_data = t.load(r"C:\Users\Sreek\website\.py\model_weights2.pth")
C = model_data["C"]  # tensor of shape [vocab_size, 200]
stoi = model_data["stoi"]  # dictionary: {word: index}

def tokenize_text(text: str) -> List[int]:
    """Tokenize text into word indices"""
    # Simple tokenization - split on whitespace and convert to lowercase
    words = re.findall(r'\b\w+\b', text.lower())
    indices = []
    for word in words:
        if word in stoi:
            indices.append(stoi[word])
    return indices

def get_embedding_for_text(text: str) -> List[float]:
    """Get embedding for a given text"""
    indices = tokenize_text(text)
    if not indices:
        # If no valid tokens found, return mean embedding
        return C.mean(dim=0).tolist()
    
    # Get embeddings for all tokens
    token_embeddings = C[indices]
    
    # Average the embeddings
    avg_embedding = token_embeddings.mean(dim=0)
    
    return avg_embedding.tolist()

def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Calculate cosine similarity between two vectors"""
    vec1 = np.array(vec1)
    vec2 = np.array(vec2)
    
    dot_product = np.dot(vec1, vec2)
    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)
    
    if norm1 == 0 or norm2 == 0:
        return 0.0
    
    return dot_product / (norm1 * norm2)

def search_posts_by_similarity(query: str, limit: int = 10) -> List[Dict[str, Any]]:
    """Search for actual posts using similarity with embeddings"""
    # Create Supabase client
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Get embedding for the query
    query_embedding = get_embedding_for_text(query)
    
    # Get all embeddings from the database
    response = supabase.table("embeddings").select("*").execute()
    embeddings_data = response.data
    
    # Calculate similarities and get post IDs
    similarities = []
    for item in embeddings_data:
        if item['content'] != "<MEAN_EMBEDDING>":  # Skip the mean embedding
            similarity = cosine_similarity(query_embedding, item['embedding'])
            # Extract post ID from content (assuming content contains post ID)
            post_id = item.get('post_id')  # If you have a post_id column
            similarities.append({
                'post_id': post_id,
                'similarity': similarity,
                'embedding_id': item.get('id')
            })
    
    # Sort by similarity (highest first)
    similarities.sort(key=lambda x: x['similarity'], reverse=True)
    
    # Get the actual posts for the top similar embeddings
    post_ids = [item['post_id'] for item in similarities[:limit] if item['post_id']]
    
    if not post_ids:
        return []
    
    # Fetch the actual posts
    posts_response = supabase.table("posts").select("*").in_("id", post_ids).execute()
    posts_data = posts_response.data
    
    # Create a mapping of post_id to post data
    posts_map = {post['id']: post for post in posts_data}
    
    # Combine similarity scores with post data
    results = []
    for item in similarities[:limit]:
        if item['post_id'] in posts_map:
            post_data = posts_map[item['post_id']].copy()
            post_data['similarity_score'] = item['similarity']
            results.append(post_data)
    
    return results

if __name__ == "__main__":
    # Check if command line arguments are provided
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Query is required"}))
        sys.exit(1)
    
    query = sys.argv[1]
    limit = int(sys.argv[2]) if len(sys.argv) > 2 else 10
    
    try:
        # Search for similar posts
        similar_posts = search_posts_by_similarity(query, limit)
        
        # Output as JSON
        print(json.dumps(similar_posts))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1) 