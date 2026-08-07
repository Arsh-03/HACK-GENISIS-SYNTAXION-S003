import os
import json
import base64
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from dotenv import load_dotenv

load_dotenv()

def get_aes_cipher():
    key_b64 = os.getenv("MASTER_ENCRYPTION_KEY")
    if not key_b64:
        raise ValueError("MASTER_ENCRYPTION_KEY not set")
    key_bytes = base64.b64decode(key_b64)
    if len(key_bytes) != 32:
        raise ValueError("MASTER_ENCRYPTION_KEY must be 32 bytes for AES-256")
    return AESGCM(key_bytes)

def decrypt_question_payload(ciphertext_b64: str, iv_b64: str) -> dict:
    """
    Decrypts the AES-256-GCM payload using the master key.
    Returns the JSON-parsed dictionary.
    """
    aesgcm = get_aes_cipher()
    ciphertext = base64.b64decode(ciphertext_b64)
    iv = base64.b64decode(iv_b64)
    
    plaintext_bytes = aesgcm.decrypt(iv, ciphertext, None)
    return json.loads(plaintext_bytes.decode('utf-8'))
