from app.core.vector_store import client, COLLECTION_NAME

try:
    client.delete_collection(collection_name=COLLECTION_NAME)
    print("Collection deleted successfully!")
except Exception as e:
    print("Error:", e)