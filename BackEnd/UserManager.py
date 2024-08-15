from flask import Flask, request, jsonify, session
from connect_to_database import connect_to_database
from flask_session import Session
import bcrypt
from mysql.connector import Error


def afficheuser():
    conn = connect_to_database()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            query = 'SELECT * FROM `users`'
            cursor.execute(query)
            result = cursor.fetchall()
        except Error as e:
            print(f"Database error: {e}")
            result = None
        finally:
            cursor.close()
            conn.close()
        return result
    return None




def add_user():
    conn = connect_to_database()
    if not conn:
        return jsonify({"message": "Failed to connect to the database"}), 500

    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        mail = data.get('mail')
        role_name = data.get('role_name')

        # Hash the password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO users (username, password, email, role_id)
            VALUES (%s, %s, %s, (SELECT id FROM roles WHERE role_name = %s))
        """, (username, hashed_password.decode('utf-8'), mail, role_name))

        conn.commit()

        return jsonify({"message": "User added successfully"}), 201

    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        conn.close()


def get_roles():
    conn = connect_to_database()
    if not conn:
        return jsonify({"message": "Failed to connect to the database"}), 500

    try:
        cursor = conn.cursor()
        cursor.execute("SELECT role_name FROM roles")
        roles = cursor.fetchall()

        if roles:
            return jsonify({"roles": [role[0] for role in roles]}), 200
        else:
            return jsonify({"message": "No roles found"}), 404

    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        conn.close()
        
def removeuser(data):
    conn = connect_to_database()
    if conn:
        try:
            cursor = conn.cursor()
            # Ensure the 'id' is in the data dictionaryi
            if 'id' not in data:
                print("No ID provided in the data")
                return

            query = "DELETE FROM `users` WHERE id = %s"
            values = (data['id'],)  # Note the comma here to make it a tuple
            cursor.execute(query, values)
            conn.commit()

            if cursor.rowcount > 0:
                print("Record deleted successfully")
            else:
                print("No record found with the provided ID")
                
        except Error as e:
            print(f"Database error: {e}")
        finally:
            cursor.close()
            conn.close()