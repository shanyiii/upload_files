import openai, os, re
from openai import OpenAI

openai.api_key = os.getenv('OPENAI_API_KEY')
client = OpenAI()

#上傳檔案到 vector store
def upload_file(file_paths, my_vector_store):
    file_streams = [open(path, "rb") for path in file_paths]
    print(file_streams)
    file_batch = client.beta.vector_stores.file_batches.upload_and_poll(
        vector_store_id=my_vector_store.id,
        files=file_streams
    )
    '''
    file_to_upload = client.files.create(
        file=open(file_path, 'rb'),
        purpose='assistants'
    )
    '''
    print("---------file upload success----------")
    return file_batch

def create_vector_store(vector_name):
    new_vector = client.beta.vector_stores.create(
        name=vector_name
    )
    return new_vector

def upload_file_form_user(file_path):
    vector_store_id = "vs_aNGnuTDnhWzZF7JjzGmfCJ1F"
    my_vector_store = client.beta.vector_stores.retrieve(vector_store_id=vector_store_id)
    print(my_vector_store.name)

    file_paths = list()
    file_paths.append(file_path)

    #print(f"----file path: {file_path}")

    #上傳檔案
    file_batch = upload_file(file_paths, my_vector_store)
    print(file_batch.status)

    #取得已上傳的檔案
    #file = client.files.retrieve("file-rDms4HPiLIw8hNcZZTYcWRnb")
    #print(file.id)


#file_path = ["D:\\master_stuff\\POXA_chatbot\\admin_test\\admin_test\\backend\\uploads\\2024-工研院-能源資產績效管理知識GPT模型程式委託開發-第1期報告-V2.pdf"]

#upload_file_form_user(file_path)