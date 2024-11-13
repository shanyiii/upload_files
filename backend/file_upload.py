import openai, os, re
from openai import OpenAI
import json

openai.api_key = os.getenv('OPENAI_API_KEY')
client = OpenAI()

# 上傳檔案到 vector store
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

# 刪除指定檔案
def delete_file(file_to_delete, my_vector_store):
    print(f"id of the file to delete: {file_to_delete}")
    deleted_vector_store_file = client.files.delete(file_to_delete)
    # deleted_vector_store_file = client.beta.vector_stores.files.delete(
    #     vector_store_id=my_vector_store.id,
    #     file_id=file_to_delete
    # )
    return deleted_vector_store_file

# 建立 vector store
def create_vector_store(vector_name):
    new_vector = client.beta.vector_stores.create(
        name=vector_name
    )
    return new_vector

# 由前端上傳檔案
def upload_file_form_user(file_path):
    vector_store_id = "vs_aNGnuTDnhWzZF7JjzGmfCJ1F"
    my_vector_store = client.beta.vector_stores.retrieve(vector_store_id=vector_store_id)
    print(my_vector_store.name)

    file_paths = list()
    file_paths.append(file_path)

    #上傳檔案
    file_batch = upload_file(file_paths, my_vector_store)
    print(file_batch.status)

    #取得已上傳的檔案
    #file = client.files.retrieve("file-rDms4HPiLIw8hNcZZTYcWRnb")
    #print(file.id)

SEVER_FILES_FOLDER = "D:\\master_stuff\\POXA_chatbot\\admin_test\\admin_test\\backend\\fileids.json"
# SEVER_FILES_FOLDER = 'C:\\Users\\shaua\\Desktop\\mine\\POXA-admin\\upload_files\\backend\\fileids.json'

# 使用者刪除指定檔案
def delete_file_from_user(filename):
    vector_store_id = "vs_aNGnuTDnhWzZF7JjzGmfCJ1F"
    my_vector_store = client.beta.vector_stores.retrieve(vector_store_id=vector_store_id)
    print(f"file name received: {filename}")

    data = []
    fp = open(SEVER_FILES_FOLDER, "r", encoding="utf-8")
    data = json.loads(fp.read())
    index = 0

    for d in data:
        if d['file_name'] == filename:
            # 刪除 Open AI 的檔案
            delete_vs_file = delete_file(d['file_id'], my_vector_store)
            print(delete_vs_file)

            # 刪除伺服器端本地檔案
            data.pop(index)
            fp = open(SEVER_FILES_FOLDER, "w", encoding="utf-8")
            json.dump(data, fp, ensure_ascii=False, indent=4)
            break
        index = index + 1