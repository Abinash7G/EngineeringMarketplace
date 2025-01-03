import psycopg2

try:
    conn = psycopg2.connect(
        dbname="engineering_marketplace",
        user="engineer_user",
        password="securepassword",
        host="localhost",
        port="5432"
    )
    print("Database connection successful!")
except Exception as e:
    print(f"Error: {e}")
