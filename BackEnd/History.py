import mysql.connector
from mysql.connector import Error
from connect_to_database import connect_to_database
import base64

def get_reports_by_user(user_id):
    conn = connect_to_database()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            query = """
                SELECT reports.id, reports.user_id, reports.file_name, reports.file_data, users.username ,users.id
                FROM reports
                JOIN users ON users.id = reports.user_id
                WHERE users.id = %s
            """
            cursor.execute(query, (user_id,))
            result = cursor.fetchall()

            # Encode the file_data in Base64
            for report in result:
                if report['file_data']:
                    report['file_data'] = base64.b64encode(report['file_data']).decode('utf-8')
            return result
        except Error as e:
            print(f"Error reading data from MySQL table: {e}")
            return None
        finally:
            if conn.is_connected():
                cursor.close()
                conn.close()
    else:
        print("Failed to connect to the database.")
        return None
    




def get_reports(user_id):
    conn = connect_to_database()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            query = """
                SELECT reports.id, reports.user_id, reports.file_name, reports.file_data, users.username ,users.id
                FROM reports
                JOIN users ON users.id = reports.user_id
                WHERE users.id != %s
            """
            cursor.execute(query, (user_id,))
            result = cursor.fetchall()

        
            for report in result:
                if report['file_data']:
                    report['file_data'] = base64.b64encode(report['file_data']).decode('utf-8')
            return result
        except Error as e:
            print(f"Error reading data from MySQL table: {e}")
            return None
        finally:
            if conn.is_connected():
                cursor.close()
                conn.close()
    else:
        print("Failed to connect to the database.")
        return None