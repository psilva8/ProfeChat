from flask import Flask, request, jsonify, send_from_directory, redirect
import os
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__, static_folder='static')
# Set CORS with more explicit configuration to allow requests from Next.js
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://192.168.0.25:3002"]}})

# Define routes
@app.route('/')
def index():
    """Redirect to the app main page"""
    return redirect('/app')

@app.route('/app')
def app_page():
    """Serve the main app page"""
    return send_from_directory('static', 'app.html')

@app.route('/test')
def test():
    """Serve the test HTML page"""
    return send_from_directory('static', 'test.html')

@app.route('/api/health')
def health():
    """API health check"""
    return jsonify({
        "status": "healthy",
        "message": "API is operational",
        "version": "1.0.0",
        "timestamp": "2025-04-06"
    })

@app.route('/api/generate-lesson', methods=['POST'])
def generate_lesson():
    """Generate a lesson plan"""
    data = request.json
    
    print(f"Received generate-lesson request for {data.get('subject', 'None')}, {data.get('grade', 'None')}, {data.get('topic', 'None')}")
    
    # In a real app, this would call an LLM
    # For now, return a sample response
    response = {
        "lesson_plan": f"# Lesson Plan: {data.get('topic', 'General Topic')} for {data.get('grade', 'All Grades')} {data.get('subject', 'General')}\n\n## Overview\nThis is a sample lesson plan generated for teaching {data.get('topic', 'General Topic')} to {data.get('grade', 'All')} students in {data.get('subject', 'General')}.\n\n## Objectives\n- Students will understand the key concepts of {data.get('topic', 'General Topic')}\n- Students will be able to apply these concepts in practical exercises\n- Students will develop critical thinking skills related to {data.get('topic', 'General Topic')}\n\n## Materials\n- Textbooks\n- Worksheets\n- Interactive materials\n- Digital resources\n\n## Lesson Structure\n1. **Introduction (10 minutes)**\n   - Begin with an engaging activity to introduce {data.get('topic', 'General Topic')}\n   - Connect to students' prior knowledge\n\n2. **Main Lesson (25 minutes)**\n   - Present key concepts using visual aids\n   - Guide students through examples\n\n3. **Practice Activities (15 minutes)**\n   - Students work in pairs or small groups\n   - Teacher provides support and guidance\n\n4. **Assessment (5 minutes)**\n   - Quick check for understanding\n   - Exit ticket with key questions\n\n5. **Closure (5 minutes)**\n   - Summarize key learning points\n   - Preview next lesson\n\n## Assessment Methods\n- Formative assessment during practice activities\n- Exit ticket responses\n- Homework assignment\n\n## Differentiation\n- For advanced students: Additional challenging problems\n- For students needing support: Simplified examples and additional guidance",
        "success": True
    }
    
    print("Successfully generated lesson plan, returning response")
    return jsonify(response)

@app.route('/api/generate-activities', methods=['POST'])
def generate_activities():
    """Generate educational activities"""
    data = request.json
    
    print(f"Received generate-activities request for {data.get('subject', 'None')}, {data.get('grade', 'None')}, {data.get('topic', 'None')}, {data.get('activityType', 'None')}")
    
    # In a real app, this would call an LLM
    # For now, return a sample response
    activity_type = data.get('activityType', 'general')
    activities = f"# {activity_type.capitalize()} Activities for {data.get('topic', 'General Topic')}\n\n"
    
    if activity_type == 'individual':
        activities += "## Individual Activities\n\n"
        activities += "1. **Reflection Journal**: Students write their thoughts about the concepts learned.\n"
        activities += "2. **Practice Problems**: Provide a worksheet with problems of increasing difficulty.\n"
        activities += "3. **Research Task**: Students research a specific aspect of the topic and present findings.\n"
    elif activity_type == 'group':
        activities += "## Group Activities\n\n"
        activities += "1. **Collaborative Project**: Students work in teams to create a project demonstrating their understanding.\n"
        activities += "2. **Peer Teaching**: Students teach each other different aspects of the topic.\n"
        activities += "3. **Discussion Circles**: Guided discussions on key concepts and applications.\n"
    elif activity_type == 'interactive':
        activities += "## Interactive Activities\n\n"
        activities += "1. **Digital Simulations**: Use online tools to visualize concepts.\n"
        activities += "2. **Educational Games**: Gamify learning with competitive activities related to the topic.\n"
        activities += "3. **Hands-on Experiments**: Practical activities to demonstrate theoretical concepts.\n"
    elif activity_type == 'assessment':
        activities += "## Assessment Activities\n\n"
        activities += "1. **Formative Quizzes**: Short quizzes to check understanding throughout the lesson.\n"
        activities += "2. **Project-based Assessment**: Students create a final project demonstrating mastery.\n"
        activities += "3. **Peer Evaluation**: Students review and provide feedback on each other's work.\n"
    else:
        activities += "## General Activities\n\n"
        activities += "1. **Mixed Activity Type 1**: Description of first activity.\n"
        activities += "2. **Mixed Activity Type 2**: Description of second activity.\n"
        activities += "3. **Mixed Activity Type 3**: Description of third activity.\n"
    
    response = {
        "activities": activities,
        "success": True
    }
    
    print("Successfully generated activities, returning response")
    return jsonify(response)

if __name__ == '__main__':
    print(f"Starting Flask server on port {os.environ.get('PORT', 5338)}")
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5338)), debug=True) 