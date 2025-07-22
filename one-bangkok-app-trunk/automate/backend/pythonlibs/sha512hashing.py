import hashlib

def get_hash(salt,message):
    string_to_hash = (message + salt).encode('utf-8')
    hash_password = hashlib.sha512(string_to_hash).hexdigest()
    
    return hash_password
