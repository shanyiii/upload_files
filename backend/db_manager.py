import pymongo
from cryptography.fernet import Fernet

uri = "mongodb+srv://victoria91718:white0718@poxa.1j2eh.mongodb.net/?retryWrites=true&w=majority&appName=poxa"
client = pymongo.MongoClient(uri)
mydb = client['admin_data']
mycol = mydb['admin_account']

# Generate encryption key
#key = Fernet.generate_key()
f = open('D:\\master_stuff\\POXA_chatbot\\admin_test\\admin_test\\backend\\key.txt', 'r')
#f = open('C:\\Users\\shaua\\Desktop\\mine\\POXA-admin\\upload_files\\backend\\key.txt', 'r')
key = f.read()
cipher_suite = Fernet(key)

# Custom encryption function, encrypt in byte
def encrypt(plaintext):
    return cipher_suite.encrypt(plaintext.encode())

# Custom decryption function
def decrypt(ciphertext):
    return cipher_suite.decrypt(ciphertext).decode()

# store data
def store_to_db(data):
    if data:
        mycol.insert_one(data)
        print("Inserted new data into the database.")
    else:
        print("error: No data.")

# find data
def find_data(query):
    data = mycol.find_one(query)
    return data