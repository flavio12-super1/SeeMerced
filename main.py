import csv

def count_rows_in_csv(file_path, encoding='utf-16'):
    with open(file_path, 'r', encoding=encoding) as file:
        reader = csv.reader(file)
        row_count = sum(1 for row in reader)
    return row_count

# Path to your cleaned CSV file
file_path = 'testing1.csv'

# Count the rows
row_count = count_rows_in_csv(file_path)
print(f"Number of rows in the CSV file: {row_count}")
