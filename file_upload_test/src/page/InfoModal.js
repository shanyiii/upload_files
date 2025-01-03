import React from 'react';
import { Modal, Button } from "react-bootstrap";

export const InfoModal = ({ show, onClose }) => { 
    return (
        <Modal show={show} onHide={onClose}>
          <Modal.Header closeButton>
            <Modal.Title>OpenAI Vector Store 檔案上傳限制</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>此區檔案將一併上傳至 OpenAI 的 Vector store，將文件以向量方式儲存於資料庫。</p>
            <p>首 1GB 是免費的，超出部分將以 $0.10/GB/天 的 vector store 費率收費。</p>
            <p>最大文件大小為 512 MB。每個文件應包含不超過 5,000,000 個 token。每個 vector store 最多可容納 10,000 個文件。</p>
            <p>一個 token 包含多少個字母是由電腦決定的，以英文為例 1000 個 token 大約是 750 個單字。</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>
              關閉
            </Button>
          </Modal.Footer>
        </Modal>
    );
}
