import Crypto
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5 as Cipher_PKCS1_v1_5
from base64 import b64encode


def get_encrypt_message(publickey,message):
    publickey = RSA.importKey(publickey)

    cipher = Cipher_PKCS1_v1_5.new(publickey)
    b_message = message.encode()
    encrypted = cipher.encrypt(b_message)
    decoded = b64encode(encrypted).decode('utf-8')
    
    return decoded
