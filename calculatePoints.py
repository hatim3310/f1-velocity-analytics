import csv
import json

drivers = {}

with open('Formula1_2025Season_RaceResults.csv', 'r') as f:
    reader = csv.reader(f)
    next(reader) # skip header
    for row in reader:
        if len(row) < 9: continue
        
        # Track,Position,No,Driver,Team... Points is index 8
        # Position is index 1
        pos = row[1].strip()
        no = row[2].strip()
        name = row[3].strip()
        points_str = row[8].strip()
        
        try:
            points = float(points_str)
        except ValueError:
            points = 0
            
        if no not in drivers:
            drivers[no] = {'name': name, 'points': 0, 'podiums': 0}
            
        drivers[no]['points'] += points
        
        if pos in ['1', '2', '3']:
            drivers[no]['podiums'] += 1

with open('points_output.json', 'w', encoding='utf-8') as f:
    json.dump(drivers, f, indent=2)
