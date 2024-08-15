from connect_to_database import connect_to_database
from mysql.connector import Error

def getallna():
    conn = connect_to_database()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            query = 'SELECT * FROM `n/a`'
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

def addna(data):
    conn = connect_to_database()
    if conn:
        try:
            cursor = conn.cursor()
            query = "INSERT INTO `n/a` (nom) VALUES (%s)"
            values = (data['FileName'],)  # Note the comma here to make it a tuple
            cursor.execute(query, values)
            conn.commit()
            print("Record inserted successfully")
        except Error as e:
            print(f"Database error: {e}")
        finally:
            cursor.close()
            conn.close()
def removena(data):
    conn = connect_to_database()
    if conn:
        try:
            cursor = conn.cursor()
            # Ensure the 'id' is in the data dictionaryi
            if 'id' not in data:
                print("No ID provided in the data")
                return

            query = "DELETE FROM `n/a` WHERE id = %s"
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