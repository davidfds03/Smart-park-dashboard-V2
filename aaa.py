from flask import Flask, render_template, jsonify
import firebase_admin
from firebase_admin import credentials, db
from datetime import datetime
import random  # for simulating revenue if not in Firebase

app = Flask(__name__)

# Firebase setup
cred = credentials.Certificate("firebase_key.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://smart-parking-3e881-default-rtdb.asia-southeast1.firebasedatabase.app/'
})

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data')
def get_data():
    ref = db.reference('hourly_log')
    data = ref.get()

    times, occupied = [], []
    total = 0

    if data:
        for key, entry in data.items():
            times.append(entry.get('time', 'Unknown'))
            occupied.append(entry.get('occupied_spots', 0))
            total = entry.get('total_spots', total)

    # Simulated daily revenue (you can replace with actual Firebase node)
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    revenue = [random.randint(200, 500) for _ in days]

    # Hourly flow rate (change in occupancy per hour)
    flow_rate = [occupied[i] - occupied[i - 1] if i > 0 else 0 for i in range(len(occupied))]

    return jsonify({
        'times': times,
        'occupied': occupied,
        'total': total,
        'flow_rate': flow_rate,
        'days': days,
        'revenue': revenue
    })

if __name__ == '__main__':
    app.run(debug=True)
