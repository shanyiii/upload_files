from flask import Flask, request, jsonify
from flask_cors import CORS
from file_upload import upload_file_form_user
import os

app = Flask(__name__)
CORS(app)

# 設定上傳的文件儲存路徑
UPLOAD_FOLDER = 'D:\\master_stuff\\POXA_chatbot\\admin_test\\admin_test\\backend\\uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# 上傳文件 API
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "沒有發現文件"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "未選擇文件"}), 400

    # 儲存文件到指定路徑
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    print(f"file name: {file.filename}\nfile path: {file_path}")

    upload_file_form_user(file_path)

    return jsonify({"message": "文件上傳成功", "file_path": file_path}), 200

if __name__ == "__main__":
    app.run(debug=True, port=5000)
