import mysql.connector
from mysql.connector import Error

def connect_to_database():
    try:
        # Establish a connection to the MySQL database
        conn = mysql.connector.connect(
            host='localhost',          # Corrected host address
            user='root',              # Replace with your MySQL username
            password='admin123',       # Replace with your MySQL password
            database='primatec'        # The name of your database
        )

        if conn.is_connected():
            print("Successfully connected to the database")
            return conn
        else:
            print("Failed to connect to the database")
            return None

    except Error as e:
        print(f"Error: {e}")
        return None

def main():
    conn = connect_to_database()
    if conn:
        conn.close()

if __name__ == "__main__":
    main()
