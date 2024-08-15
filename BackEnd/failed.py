from connect_to_database import connect_to_database
from mysql.connector import Error
import base64
import os
from werkzeug.utils import secure_filename

def save_file(file, upload_folder):
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    
    filename = secure_filename(file.filename)
    file_path = os.path.join(upload_folder, filename)
    file.save(file_path)
    return file_path







def getallfailed():
    
    conn = connect_to_database()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            query = """
                SELECT id,  file_name, file_data FROM failed
                
            """
            cursor.execute(query)
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








def add(file_path):
    """Insert file data into the Failed table."""
    connection = connect_to_database()
    if connection is None:
        raise Exception("Database connection failed")

    try:
        cursor = connection.cursor()
        
        # Read file data
        with open(file_path, 'rb') as file:
            binary_data = file.read()
        
        # SQL query for insertion
        sql = "INSERT INTO Failed (file_data, file_name) VALUES (%s, %s)"
        values = (binary_data, os.path.basename(file_path))

        # Execute SQL query
        cursor.execute(sql, values)
        connection.commit()

        print("Record inserted successfully")
    
    except Exception as e:
        print(f"Error inserting report into database: {e}")
        raise
    
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()






def remove(data):
    conn = connect_to_database()
    if conn:
        try:
            cursor = conn.cursor()
            # Ensure the 'id' is in the data dictionaryi
            if 'id' not in data:
                print("No ID provided in the data")
                return

            query = "DELETE FROM `failed` WHERE id = %s"
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