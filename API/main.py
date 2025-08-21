import json
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# ✅ モデルのロード（fugashi不要・安定動作）
model = SentenceTransformer("intfloat/multilingual-e5-small")

# ✅ JSONファイルの読み込み
with open("novel_info.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# ✅ DataFrame化
df = pd.DataFrame(data)

# ✅ タイトル + あらすじ をベクトル化（passage形式）
df["full_text"] = "passage: " + df["title"] + "。" + df["story"]
embeddings = model.encode(df["full_text"].tolist(), normalize_embeddings=True)

# ✅ ユーザー入力（検索クエリ）
user_title = ""
user_story = ""
query_text = f"query: {user_title}。{user_story}"
query_vec = model.encode([query_text], normalize_embeddings=True)

# ✅ 類似度計算
similarities = cosine_similarity(query_vec, embeddings)[0]
top_indices = np.argsort(similarities)[::-1][:5]

# ✅ 結果表示
print("\n--- 類似作品 ---")
for i, idx in enumerate(top_indices):
    print(f"{i+1}. タイトル: {df.loc[idx, 'title']}")
    print(f"   作者: {df.loc[idx, 'writer']}")
    print(f"   類似度: {similarities[idx]:.4f}")
    print(f"   あらすじ: {df.loc[idx, 'story'][:100]}...\n")