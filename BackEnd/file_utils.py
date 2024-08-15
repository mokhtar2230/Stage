import os, shutil
from connect_to_database import connect_to_database
import bcrypt

def insert_report(user_id, file_path):
    connection = connect_to_database()
    if connection is None:
        raise Exception("Database connection failed")

    try:
        cursor = connection.cursor()
        with open(file_path, 'rb') as file:
            binary_data = file.read()
        query = "INSERT INTO reports (user_id, file_data, file_name) VALUES (%s, %s, %s)"
        cursor.execute(query, (user_id, binary_data, os.path.basename(file_path)))
        connection.commit()
        cursor.close()
    except Exception as e:
        print(f"Error inserting report into database: {e}")
        raise
    finally:
        if connection.is_connected():
            connection.close()
def create_output_directory(base_path=None):

    if base_path is None:
        base_path = os.getcwd() 

    output_dir = os.path.join(base_path, 'result')
    os.makedirs(output_dir, exist_ok=True)
    return output_dir

def get_input_files(input_folder):
    """Retrieve a list of input files from the specified folder."""
    return [os.path.join(input_folder, filename) for filename in os.listdir(input_folder) if filename.endswith(".xlsx")]


def clear_upload_folder(folder_path):
    """Remove all files and subdirectories in the given folder."""
    if os.path.exists(folder_path):
        # Remove all files and directories within the folder
        for item in os.listdir(folder_path):
            item_path = os.path.join(folder_path, item)
            if os.path.isfile(item_path):
                os.remove(item_path)
            elif os.path.isdir(item_path):
                shutil.rmtree(item_path)
    else:
        os.makedirs(folder_path)