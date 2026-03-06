import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from functools import wraps
from models import db, User, Event, Registration

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = 'eventify_secret_key_123' # In production, use a secure env variable
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///eventify.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Authentication Decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
            
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
            
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

# -----------------
# Auth Routes
# -----------------
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({'message': 'Email already exists'}), 400
        
    hashed_password = generate_password_hash(data.get('password'))
    new_user = User(
        name=data.get('name'), 
        email=data.get('email'), 
        password=hashed_password
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Could not verify'}), 401
        
    user = User.query.filter_by(email=data.get('email')).first()
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
        
    if check_password_hash(user.password, data.get('password')):
        token = jwt.encode(
            {'user_id': user.id, 'exp': datetime.utcnow() + timedelta(hours=24)}, 
            app.config['SECRET_KEY'], 
            algorithm="HS256"
        )
        return jsonify({
            'token': token,
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': user.role
            }
        })
        
    return jsonify({'message': 'Wrong password'}), 401


# -----------------
# Event Routes
# -----------------
@app.route('/api/events', methods=['GET'])
def get_events():
    events = Event.query.all()
    output = []
    for event in events:
        event_data = {
            'id': event.id,
            'title': event.title,
            'category': event.category,
            'description': event.description,
            'date': event.date,
            'time': event.time,
            'location': event.location,
            'participants': event.participants,
            'teamSize': event.team_size,
            'status': event.status,
            'prizePool': event.prize_pool
        }
        output.append(event_data)
    return jsonify({'events': output})


@app.route('/api/events/seed', methods=['POST'])
def seed_events():
    """Initializes the database with dummy events if it is empty"""
    if Event.query.count() == 0:
        events = [
            Event(title="GameOn: Arena Wars", category="Gaming", description="24x7 gaming tournament with multiple battle arenas", date="Upcoming", time="Throughout the day", location="Study Center Arena", participants=200, team_size="Solo/Team (varies by game)", status="Open", prize_pool="₹50,000"),
            Event(title="Drop That Beat", category="Cultural", description="Solo DJ competition featuring the best beatmakers", date="Upcoming", time="11:00 AM - 2:00 PM", location="Main Stage", participants=30, team_size="Solo", status="Open", prize_pool="₹30,000"),
            Event(title="Live Concert Night", category="Concert", description="Live musical performance by top artists", date="Upcoming", time="09:00 PM onwards", location="Main Stage", participants=2000, team_size="No registration needed", status="Open Entry", prize_pool="Free Entry"),
            Event(title="EDM Night", category="Concert", description="High-energy DJ set to end the fest on a high note", date="Upcoming", time="11:00 PM onwards", location="Main Stage", participants=2000, team_size="No registration needed", status="Open Entry", prize_pool="Free Entry"),
            Event(title="Tech Innovation Challenge", category="Technical", description="Build innovative tech solutions for real-world problems", date="Upcoming", time="10:00 AM - 1:00 PM", location="Innovation Lab", participants=100, team_size="3-4 members", status="Filling Fast", prize_pool="₹40,000"),
            Event(title="Cosplay Competition", category="Cultural", description="Show off your creative side in this cosplay competition", date="Upcoming", time="1:00 PM - 4:00 PM", location="Central Arena", participants=80, team_size="Solo/Duo", status="Open", prize_pool="₹25,000")
        ]
        db.session.bulk_save_objects(events)
        db.session.commit()
        return jsonify({'message': 'Database seeded!'}), 201
    return jsonify({'message': 'Events already exist.'}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
