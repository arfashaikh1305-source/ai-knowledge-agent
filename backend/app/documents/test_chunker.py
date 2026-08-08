from app.documents.chunker import chunk_text

text = """
Artificial Intelligence is transforming industries.
It is changing healthcare, education, finance,
manufacturing and many more sectors.
""" * 20

chunks = chunk_text(text)

print("Total Chunks:", len(chunks))

for i, chunk in enumerate(chunks):
    print("=" * 50)
    print(f"Chunk {i+1}")
    print(chunk)