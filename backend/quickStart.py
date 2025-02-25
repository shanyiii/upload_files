import os.path
import json

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

import google.auth
from googleapiclient.http import MediaFileUpload

# If modifying these scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/drive']
GDRIVE_LIST_PATH = "D:\master_stuff\POXA_chatbot\\admin_test\\admin_test\\backend\google_drive_list.json"
FILE_AND_LINK = "D:\master_stuff\POXA_chatbot\pdftest\POXA-backend-\gdrive_file_links.json"

def upload_file_to_gdrive(file_name, file_path, folder_id):
  """Upload a file to the specified folder and prints file ID, folder ID
  Args: Id of the folder
  Returns: ID of the file uploaded
  """
#   creds, _ = google.auth.default()
  try:
    file_metadata = {"name": file_name, "parents": [folder_id]}
    media = MediaFileUpload(
        file_path, mimetype="application/pdf", resumable=True
    )
    # pylint: disable=maybe-no-member
    file = (
        service.files()
        .create(body=file_metadata, media_body=media, fields="id")
        .execute()
    )
    print(f'File ID: "{file.get("id")}".')
    
    data = list()
    fp = open(GDRIVE_LIST_PATH, "r", encoding="utf-8")
    data = json.loads(fp.read())
    fileid = file.get("id")
    d = {
      "file_name": file_name,
      "file_id": fileid
    }
    data.append(d)
    fp = open(GDRIVE_LIST_PATH, "w", encoding="utf-8")
    json.dump(data, fp, ensure_ascii=False, indent=4)
    
    permission = {
      "type": "anyone",  # 任何人
      "role": "reader",  # 只讀權限（可改為 "writer" 讓任何人可編輯）
    }

    service.permissions().create(fileId=fileid, body=permission).execute()

    # 取得分享連結
    file_info = service.files().get(fileId=fileid, fields="webViewLink").execute()
    print(f"分享連結: {file_info['webViewLink']}")

    fp = open(FILE_AND_LINK, "r", encoding="utf-8")
    links = json.loads(fp.read())
    file_link = {
      "file_name": file_name,
      "file_link": file_info['webViewLink']
    }
    links.append(file_link)
    fp = open(FILE_AND_LINK, "w", encoding="utf-8")
    json.dump(links, fp, ensure_ascii=False, indent=4)    

    return fileid

  except HttpError as error:
    print(f"An error occurred: {error}")
    return None

def delete_file_from_gdrive(file_name):
  fileid = ""
  data = list()
  fp = open(GDRIVE_LIST_PATH, "r", encoding="utf-8")
  data = json.loads(fp.read())
  index = 0

  try:
    for d in data:
        if d['file_name'] == file_name:
            fileid = d['file_id']
            data.pop(index)
            fp = open(GDRIVE_LIST_PATH, "w", encoding="utf-8")
            json.dump(data, fp, ensure_ascii=False, indent=4)
            break
        index = index + 1
    body_value = {'trashed': True}
    response = service.files().update(fileId=fileid, body=body_value).execute()
    # print(response)
  except HttpError as error:
    print(f"An error occurred: {error}")

def setup_gdrive():
  creds = None
  global service
  # The file token.json stores the user's access and refresh tokens, and is
  # created automatically when the authorization flow completes for the first
  # time.
  if os.path.exists("token.json"):
    creds = Credentials.from_authorized_user_file("token.json", SCOPES)
  # If there are no (valid) credentials available, let the user log in.
  if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
      creds.refresh(Request())
    else:
      flow = InstalledAppFlow.from_client_secrets_file(
          "credentials.json", SCOPES
      )
      creds = flow.run_local_server(port=0)
    # Save the credentials for the next run
    with open("token.json", "w") as token:
      token.write(creds.to_json())

  # create drive api client
  service = build("drive", "v3", credentials=creds)

  # upload_file_to_gdrive("中華民國國歌.pdf", "D:\master_stuff\POXA_chatbot\中華民國國歌.pdf", "1Qc1O5pC7f3ZHvuj2WVad1TFWtuTZvW1p")
  # delete_file_from_gdrive('1kNB7bg2Orzj4cGm-u_5MEbUG9tmRcXAN')

  # try:
  #   # Call the Drive v3 API
  #   results = (
  #       service.files()
  #       .list(fields="nextPageToken, files(id, name)", q="'1Qc1O5pC7f3ZHvuj2WVad1TFWtuTZvW1p' in parents")
  #       .execute()
  #   )
  #   items = results.get("files", [])

  #   if not items:
  #     print("No files found.")
  #     return
  #   print("Files:")
  #   data = list()
  #   for item in items:
  #     d = {
  #       "file_name": item['name'],
  #       "file_id": item['id']
  #     }
  #     data.append(d)
  #     print(f"{item['name']} ({item['id']})")
  #   fp = open(GDRIVE_LIST_PATH, "w", encoding="utf-8")
  #   json.dump(data, fp, ensure_ascii=False, indent=4)
  # except HttpError as error:
  #   print(f"An error occurred: {error}")


# if __name__ == "__main__":
#   main()