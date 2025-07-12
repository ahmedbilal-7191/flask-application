from flask import Flask, request, jsonify
import psycopg2
from psycopg2 import extras
from config import DB_CONFIG

app = Flask(__name__)

def get_connection():
    return psycopg2.connect(**DB_CONFIG)

def create_table():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            content TEXT NOT NULL
        );
    """)
    conn.commit()
    cur.close()
    conn.close()

@app.route('/messages', methods=['GET'])
def get_messages():
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=extras.DictCursor)
        cur.execute("SELECT * FROM messages ORDER BY id ASC;")
        rows = cur.fetchall()
        messages = [{'id': row['id'], 'message': row['content']} for row in rows]
        cur.close()
        conn.close()
        return jsonify(messages)
    except Exception as e:
        return str(e), 500

@app.route('/messages', methods=['POST'])
def create_message():
    data = request.get_json()
    content = data.get('message', '').strip()
    if not content:
        return jsonify({'error': 'Message content required'}), 400

    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("INSERT INTO messages (content) VALUES (%s) RETURNING id;", (content,))
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'id': new_id, 'message': content}), 201
    except Exception as e:
        return str(e), 500

@app.route('/messages/<int:msg_id>', methods=['PUT'])
def update_message(msg_id):
    data = request.get_json()
    new_content = data.get('message', '').strip()
    if not new_content:
        return jsonify({'error': 'New message content required'}), 400

    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("UPDATE messages SET content = %s WHERE id = %s RETURNING id;", (new_content, msg_id))
        updated = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        if updated:
            return jsonify({'id': msg_id, 'message': new_content}), 200
        else:
            return jsonify({'error': 'Message not found'}), 404
    except Exception as e:
        return str(e), 500

@app.route('/messages/<int:msg_id>', methods=['DELETE'])
def delete_message(msg_id):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM messages WHERE id = %s RETURNING id;", (msg_id,))
        deleted = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        if deleted:
            return jsonify({'message': f'Message {msg_id} deleted.'}), 200
        else:
            return jsonify({'error': 'Message not found'}), 404
    except Exception as e:
        return str(e), 500

if __name__ == '__main__':
    create_table()
    app.run(host='0.0.0.0', port=5000, debug=True)
