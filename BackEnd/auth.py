from flask import Flask, request, jsonify, session
from connect_to_database import connect_to_database
from flask_session import Session
import bcrypt
from mysql.connector import Error

def login():
    conn = connect_to_database()
    if not conn:
        return jsonify({"message": "Failed to connect to the database"}), 500

    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        cursor = conn.cursor()
        cursor.execute("""
            SELECT users.id, users.password, roles.role_name
            FROM users
            JOIN roles ON users.role_id = roles.id
            WHERE users.username = %s
        """, (username,))

        result = cursor.fetchone()

        if result:
            user_id, hashed_password, role_name = result
            
            # Verify password
            if bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8')):
                session["user_id"] = user_id    
                session["role_name"] = role_name  
                return jsonify({"message": "Login successful", "user_id": user_id, "role_name": role_name}), 200
            else:
                return jsonify({"message": "Invalid username or password"}), 401
        else:
            return jsonify({"message": "Invalid username or password"}), 401

    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        conn.close()
