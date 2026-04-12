from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def mock_face_match(input_encoding, stored_encoding):
    """Simple mock matching - compares random similarity"""
    if len(input_encoding) == 0 or len(stored_encoding) == 0:
        return 0.0
    
    input_arr = np.array(input_encoding)
    stored_arr = np.array(stored_encoding)
    
    if len(input_arr) != len(stored_arr):
        return 0.0
    
    similarity = 1 - np.linalg.norm(input_arr - stored_arr) / np.linalg.norm(input_arr)
    similarity = max(0, min(100, similarity * 100))
    return round(similarity, 2)

@app.route('/encode', methods=['POST'])
def encode_image():
    try:
        data = request.get_json()
        image_path = data.get('image_path', '')

        if not image_path:
            return jsonify({'error': 'No image path provided'}), 400

        mock_encoding = np.random.rand(128).tolist()

        return jsonify({'encoding': mock_encoding, 'message': 'Face encoded successfully (demo mode)'})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/match', methods=['POST'])
def match_faces():
    try:
        data = request.get_json()
        image_path = data.get('image_path', '')
        stored_encodings = data.get('encodings', [])

        if not image_path:
            return jsonify({'error': 'No image path provided'}), 400

        input_encoding = np.random.rand(128).tolist()
        matches = []

        for stored in stored_encodings:
            stored_encoding = stored.get('encoding', [])
            similarity = mock_face_match(input_encoding, stored_encoding)

            if similarity >= 40:
                matches.append({
                    'id': stored.get('id'),
                    'name': stored.get('name'),
                    'similarity': similarity
                })

        matches.sort(key=lambda x: x['similarity'], reverse=True)

        return jsonify({'matches': matches, 'message': 'Match complete (demo mode)'})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'safefind-ai', 'mode': 'demo'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)