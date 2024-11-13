from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from file_upload import upload_file_form_user, delete_file_from_user
from db_manager import encrypt, decrypt, store_to_db, find_data
import os

app = Flask(__name__)
CORS(app, supports_credentials=True, origins="http://localhost:3000")

# 設定上傳的文件儲存路徑
UPLOAD_FOLDER = 'D:\\master_stuff\\POXA_chatbot\\admin_test\\admin_test\\backend\\uploads'
#UPLOAD_FOLDER = 'C:\\Users\\shaua\\Desktop\\mine\\POXA-admin\\upload_files\\backend\\uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# 上傳文件
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
#FILES_FOLDER = 'C:\\Users\\shaua\\Desktop\\mine\\POXA-admin\\upload_files\\backend\\uploads'
app.config['FILES_FOLDER'] = FILES_FOLDER

# 取得資料夾中的檔案清單
@app.route('/api/files', methods=['GET'])
def list_files():
    try:
        # 確保資料夾存在
        files = os.listdir(app.config['FILES_FOLDER'])
        print(f"總共有 {len(files)} 個檔案")
        return jsonify({"files": files, "numberOfFiles": len(files)}), 200
        # return jsonify(files), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 取得指定檔案
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

    return jsonify({"message": f"File {filename} processed successfully"}), 200

# 管理員登入
@app.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    input_account = data.get('account')
    input_password = data.get('password')
    
    # 任一格輸入為空白
    if not input_account or not input_password:
        return jsonify({"error": "請填入管理員帳號及密碼"}), 400
    
    admin_data = find_data({'account': input_account})
    if admin_data == None:
        return jsonify({"error": "找不到帳號"}), 400
    else:
        password = decrypt(admin_data['password'])
        if password != input_password:
            print(f"password incorrect, input password: {input_password}, correct: {password}")
            return jsonify({"error": "密碼錯誤"}), 400
        else:
            return jsonify({"message": "登入成功"}), 200

# 新增管理員帳號
@app.route('/admin/register', methods=['POST'])
def new_admin():
    data = request.get_json()
    input_account = data.get('account')
    input_password = data.get('password')

    if not input_account or not input_password:
        return jsonify({"error": "請填入管理員帳號及密碼"}), 400
    
    admin_data = find_data({'account': input_account})
    if admin_data != None:
        return jsonify({"error": "不得註冊已存在的帳號"}), 400

    admin = dict()
    admin['account'] = input_account
    admin['password'] = encrypt(input_password)
    store_to_db(admin)

    return jsonify({"message": "成功新增管理員"}), 200

if __name__ == "__main__":
    app.run(debug=True, port=5000)
