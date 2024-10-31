from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from file_upload import upload_file_form_user, delete_file_from_user
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

# 設定本地端檔案資料夾
FILES_FOLDER = 'D:\\master_stuff\\POXA_chatbot\\admin_test\\admin_test\\backend\\uploads'
app.config['FILES_FOLDER'] = FILES_FOLDER

# API：取得資料夾中的檔案清單
@app.route('/api/files', methods=['GET'])
def list_files():
    try:
        # 確保資料夾存在
        files = os.listdir(app.config['FILES_FOLDER'])
        return jsonify(files), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API：取得指定檔案
@app.route('/files/<filename>', methods=['GET'])
def get_file(filename):
    try:
        return send_from_directory(app.config['FILES_FOLDER'], filename, as_attachment=True)
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404

# 處理指定檔案(刪除)
@app.route('/api/process-file', methods=['POST'])
def process_file():
    data = request.get_json()
    filename = data.get('filename')

    if not filename:
        return jsonify({"error": "Filename is required"}), 400

    delete_file_from_user(filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    os.remove(file_path)

    # 回傳結果
    return jsonify({"message": f"File {filename} processed successfully"}), 200

if __name__ == "__main__":
    app.run(debug=True, port=5000)
