from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI, OpenAIError, AuthenticationError
import os
from dotenv import load_dotenv
import logging
import sys
import json
from typing import Dict, Any, Optional
import socket
import openai
from datetime import datetime
import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:3000",  # Next.js development server
            "http://127.0.0.1:3000",  # Alternate localhost format
            "https://demo-02.vercel.app",  # Production domain (update as needed)
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

def is_port_in_use(port: int) -> bool:
    """Check if a port is already in use."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind(('0.0.0.0', port))
            return False
        except socket.error:
            return True

def get_available_port(start_port: int, max_attempts: int = 10) -> int:
    """Get the next available port starting from start_port."""
    port = start_port
    while port < (start_port + max_attempts):
        if not is_port_in_use(port):
            return port
        port += 1
    raise RuntimeError(f"No available ports found between {start_port} and {start_port + max_attempts - 1}")

def validate_api_key(api_key: str) -> OpenAI:
    """Validate OpenAI API key and initialize client."""
    if not api_key or api_key == 'your-api-key-here':
        logger.error("OpenAI API key not configured")
        raise ValueError("OpenAI API key not configured")

    try:
        client = OpenAI(api_key=api_key)
        client.models.list()
        logger.info("OpenAI API key validated successfully")
        return client
    except AuthenticationError as e:
        logger.error("Invalid OpenAI API key")
        raise ValueError("Invalid OpenAI API key") from e
    except Exception as e:
        logger.error(f"Error initializing OpenAI client: {str(e)}")
        raise

# Initialize OpenAI client
api_key = os.getenv('OPENAI_API_KEY')
try:
    client = validate_api_key(api_key)
except Exception as e:
    logger.error(f"Failed to initialize OpenAI client: {str(e)}")
    client = None

def validate_request_data(data: Dict[str, Any], required_fields: list) -> Optional[str]:
    """Validate request data and return error message if invalid."""
    if not data:
        return "No se proporcionaron datos"
    
    missing_fields = [field for field in required_fields if not data.get(field)]
    if missing_fields:
        return f"Faltan campos requeridos: {', '.join(missing_fields)}"
    
    return None

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify the server is running correctly"""
    logger.info("Health check endpoint called")
    return jsonify({
        "status": "healthy",
        "message": "API is operational",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/generate-lesson', methods=['POST'])
def generate_lesson():
    """Generate a lesson plan based on the provided parameters"""
    try:
        data = request.json
        logger.info(f"Received lesson plan generation request: {data}")
        
        # Extract parameters
        subject = data.get('subject', '')
        grade = data.get('grade', '')
        topic = data.get('topic', '')
        duration = data.get('duration', 60)
        objectives = data.get('objectives', '')
        
        # Create prompt for OpenAI
        prompt = f"""
        Create a detailed lesson plan for the following:
        Subject: {subject}
        Grade: {grade}
        Topic: {topic}
        Duration: {duration} minutes
        Learning Objectives: {objectives}
        
        The lesson plan should include:
        1. Introduction/warm-up activity
        2. Main content/teaching activities
        3. Practice activities
        4. Assessment
        5. Closure
        6. Materials needed
        
        Please structure it in a clear, organized format that a teacher can easily follow.
        """
        
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert curriculum designer and educator."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1500
        )
        
        # Extract and return the lesson plan
        lesson_plan = response.choices[0].message.content
        logger.info(f"Generated lesson plan successfully")
        
        return jsonify({
            "success": True,
            "lesson_plan": lesson_plan
        })
    
    except Exception as e:
        logger.error(f"Error generating lesson plan: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/generate-rubric', methods=['POST'])
def generate_rubric():
    """Generate a rubric based on provided parameters."""
    try:
        data = request.json
        error = validate_request_data(data, ['assignmentType', 'criteria', 'gradeLevel'])
        if error:
            return jsonify({"success": False, "error": error}), 400

        assignment_type = data['assignmentType']
        criteria = data['criteria']
        grade_level = data['gradeLevel']
        
        prompt = f"""Crea una rúbrica detallada para {assignment_type} de {grade_level}° grado con los siguientes criterios: {', '.join(criteria)}. 
        Incluye:
        1. Niveles de desempeño específicos
        2. Criterios de calificación
        3. Descriptores para cada nivel
        4. Puntajes
        
        La respuesta debe estar en español."""
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Eres un asistente docente especializado en crear rúbricas de evaluación alineadas con estándares educativos. Todas tus respuestas deben ser en español."},
                {"role": "user", "content": prompt}
            ]
        )
        
        return jsonify({
            "success": True,
            "rubric": response.choices[0].message.content
        })
    except Exception as e:
        logger.error(f"Error generating rubric: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/generate-unit-plan', methods=['POST'])
def generate_unit_plan():
    """Generate a unit plan based on provided parameters."""
    try:
        data = request.json
        error = validate_request_data(data, ['subject', 'grade', 'mainTopic'])
        if error:
            return jsonify({"success": False, "error": error}), 400

        subject = data['subject']
        grade = data['grade']
        duration = data.get('duration', '4 semanas')
        main_topic = data['mainTopic']
        
        prompt = f"""Crea un plan de unidad de {duration} para la clase de {subject}, {grade}° grado, enfocado en {main_topic}. 
        Incluye:
        1. Objetivos de la unidad
        2. Desglose semanal
        3. Actividades principales
        4. Plan de evaluación
        5. Materiales requeridos
        
        Asegúrate de que esté alineado con el Currículo Nacional de Educación Básica del Perú.
        La respuesta debe estar en español."""
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Eres un especialista en planificación curricular familiarizado con los estándares educativos peruanos. Todas tus respuestas deben ser en español."},
                {"role": "user", "content": prompt}
            ]
        )
        
        return jsonify({
            "success": True,
            "unit_plan": response.choices[0].message.content
        })
    except Exception as e:
        logger.error(f"Error generating unit plan: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/generate-activities', methods=['POST'])
def generate_activities():
    try:
        data = request.json
        if not data:
            logger.error("No data provided in request")
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        subject = data.get('subject')
        grade = data.get('grade')
        topic = data.get('topic')
        activity_type = data.get('activityType', 'individual')
        
        # Validate required fields
        if not all([subject, grade, topic]):
            missing = []
            if not subject: missing.append("subject")
            if not grade: missing.append("grade")
            if not topic: missing.append("topic")
            logger.error(f"Missing required fields: {', '.join(missing)}")
            return jsonify({"success": False, "error": f"Missing required fields: {', '.join(missing)}"}), 400
        
        prompt = f"""Crea 3 actividades {activity_type}s atractivas para la clase de {subject}, {grade}° grado, sobre {topic}. 
        Para cada actividad incluye:
        1. Descripción de la actividad
        2. Duración
        3. Materiales necesarios
        4. Instrucciones paso a paso
        5. Criterios de evaluación
        
        Asegúrate de que las actividades sean apropiadas para el nivel y estén alineadas con el Currículo Nacional.
        La respuesta debe estar en español."""
        
        logger.info(f"Calling OpenAI API for activities generation with prompt related to {subject}, {grade}, {topic}")
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Eres un experto en crear actividades educativas atractivas alineadas con el Currículo Nacional de Educación Básica del Perú. Todas tus respuestas deben ser en español."},
                {"role": "user", "content": prompt}
            ]
        )
        
        logger.info("Successfully generated activities with OpenAI")
        return jsonify({
            "success": True,
            "activities": response.choices[0].message.content
        })
    except OpenAIError as e:
        logger.error(f"OpenAI API error: {str(e)}")
        return jsonify({"success": False, "error": f"AI service error: {str(e)}"}), 500
    except Exception as e:
        logger.error(f"Error generating activities: {str(e)}")
        return jsonify({"success": False, "error": f"Server error: {str(e)}"}), 500

@app.route('/api/test-lesson-plans', methods=['GET'])
def test_lesson_plans():
    """Return sample lesson plans for testing without authentication"""
    logger.info("Test lesson plans endpoint called")
    sample_plans = [
        {
            "id": "test-plan-1",
            "subject": "English",
            "grade": "8th Grade",
            "topic": "Poetry Analysis",
            "duration": 60,
            "objectives": "Students will learn to identify literary devices in poetry and analyze their effect.",
            "content": {
                "introduction": "Begin with a reading of 'The Road Not Taken' by Robert Frost.",
                "main_content": "Discuss metaphor, imagery, and symbolism in the poem.",
                "activities": "Group work to identify literary devices in assigned poems.",
                "assessment": "Students will write a short analysis of a poem using the techniques learned.",
                "closure": "Class discussion on how poetry analysis skills transfer to other texts."
            },
            "created_at": "2023-03-30T14:30:00Z"
        },
        {
            "id": "test-plan-2",
            "subject": "Science",
            "grade": "5th Grade",
            "topic": "The Solar System",
            "duration": 45,
            "objectives": "Students will be able to identify the planets in our solar system and describe their key characteristics.",
            "content": {
                "introduction": "Show a video clip about space exploration.",
                "main_content": "Present information about each planet with visual aids.",
                "activities": "Create a scale model of the solar system in the classroom.",
                "assessment": "Quiz on planet names, order, and key facts.",
                "closure": "Discuss how understanding our solar system helps us understand our place in the universe."
            },
            "created_at": "2023-03-29T10:15:00Z"
        },
        {
            "id": "test-plan-3",
            "subject": "Mathematics",
            "grade": "9th Grade",
            "topic": "Algebra Basics",
            "duration": 55,
            "objectives": "Students will understand how to solve simple equations with one variable.",
            "content": {
                "introduction": "Review the concept of variables with real-world examples.",
                "main_content": "Demonstrate solving for x in various equations.",
                "activities": "Worksheet practice with graduated difficulty levels.",
                "assessment": "Exit ticket with 3 equations to solve independently.",
                "closure": "Discuss how algebraic thinking is used in daily life and various careers."
            },
            "created_at": "2023-03-28T09:45:00Z"
        }
    ]
    
    # Add any dynamically created plans if they exist
    if hasattr(app, 'test_plans'):
        sample_plans.extend(app.test_plans)
    
    return jsonify(sample_plans)

@app.route('/api/test-lesson-plans', methods=['POST'])
def test_lesson_plans_post():
    """Handle POST requests to test-lesson-plans, for testing without authentication"""
    logger.info("POST request to test lesson plans endpoint")
    try:
        plan_data = request.json
        logger.info(f"Received plan data: {plan_data}")
        
        # Initialize the test_plans list if it doesn't exist
        if not hasattr(app, 'test_plans'):
            app.test_plans = []
        
        # Add the new plan to the in-memory list
        app.test_plans.append(plan_data)
        logger.info(f"Test lesson plan received and stored. Total plans: {len(app.test_plans)}")
        
        return jsonify({
            "success": True,
            "message": "POST request to test lesson plans received",
            "data": plan_data
        })
    except Exception as e:
        logger.error(f"Error handling POST to test-lesson-plans: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/test-create-plan', methods=['POST'])
def create_test_plan():
    """Add a new test lesson plan to the in-memory store"""
    try:
        plan_data = request.json
        logger.info(f"Creating test lesson plan: {plan_data.get('topic')}")
        
        # Initialize the test_plans list if it doesn't exist
        if not hasattr(app, 'test_plans'):
            app.test_plans = []
        
        # Add the new plan to the in-memory list
        app.test_plans.append(plan_data)
        logger.info(f"Test lesson plan created successfully. Total plans: {len(app.test_plans)}")
        
        return jsonify({
            "success": True,
            "message": "Test lesson plan created successfully"
        })
    except Exception as e:
        logger.error(f"Error creating test lesson plan: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/debug', methods=['GET'])
def debug_endpoints():
    """Return a list of all available endpoints for debugging"""
    endpoints = []
    for rule in app.url_map.iter_rules():
        endpoints.append({
            'endpoint': rule.endpoint,
            'methods': [method for method in rule.methods if method != 'OPTIONS' and method != 'HEAD'],
            'path': str(rule)
        })
    return jsonify({
        'endpoints': endpoints,
        'total': len(endpoints)
    })

@app.route('/api/activities', methods=['GET'])
def get_activities():
    """Return a list of educational activities"""
    logger.info("Activities endpoint called")
    activities = [
        {
            "id": "activity-1",
            "title": "Group Discussion on Literary Themes",
            "subject": "English",
            "grade": "High School",
            "duration": 30,
            "description": "Students form groups to discuss major themes in the assigned reading"
        },
        {
            "id": "activity-2",
            "title": "Science Experiment: Plant Growth",
            "subject": "Science",
            "grade": "Elementary",
            "duration": 45,
            "description": "Students observe and record plant growth under different conditions"
        },
        {
            "id": "activity-3",
            "title": "Math Problem Solving Challenge",
            "subject": "Mathematics",
            "grade": "Middle School",
            "duration": 25,
            "description": "Students work in pairs to solve real-world math problems"
        }
    ]
    return jsonify(activities)

@app.route('/lesson-plans', methods=['GET'])
def frontend_lesson_plans():
    """Handle direct requests to /lesson-plans (not through API)"""
    logger.info("/lesson-plans direct endpoint called")
    # This endpoint is just to handle direct requests that might come from frontend
    # Typically, these should be handled by the frontend routing, not Flask
    return jsonify({
        "message": "This endpoint is accessible but should be handled by frontend routing",
        "redirectTo": "/test/lesson-plans"
    })

@app.route('/api/proxy/activities', methods=['GET'])
def proxy_activities():
    """Return a list of educational activities for proxy endpoint"""
    logger.info("Proxy Activities endpoint called")
    return get_activities()

@app.route('/api/proxy/lesson-plans', methods=['GET'])
def proxy_lesson_plans():
    """Return lesson plans for proxy endpoint"""
    logger.info("Proxy Lesson Plans endpoint called")
    return test_lesson_plans()

@app.route('/api/test-openai-key', methods=['GET'])
def test_openai_key():
    """Test if the OpenAI API key is valid and working"""
    try:
        if not api_key or api_key == 'your-api-key-here':
            logger.error("OpenAI API key not configured")
            return jsonify({
                "valid": False,
                "error": "OpenAI API key not configured"
            })

        # Test API key by making a simple request
        try:
            client = OpenAI(api_key=api_key)
            models = client.models.list()
            
            # If we've reached here, the API key is valid
            logger.info("OpenAI API key is valid")
            
            return jsonify({
                "valid": True,
                "models_available": len(models.data)
            })
        except AuthenticationError:
            logger.error("Invalid OpenAI API key")
            return jsonify({
                "valid": False,
                "error": "Invalid OpenAI API key"
            })
        except Exception as e:
            logger.error(f"Error validating OpenAI API key: {str(e)}")
            return jsonify({
                "valid": False,
                "error": f"Error validating OpenAI API key: {str(e)}"
            })
    except Exception as e:
        logger.error(f"Unexpected error testing OpenAI key: {str(e)}")
        return jsonify({
            "valid": False,
            "error": f"Unexpected error: {str(e)}"
        }), 500

@app.route('/api/check-db', methods=['GET'])
def check_db():
    """Check database connectivity (simulated for now)"""
    logger.info("Database check endpoint called")
    
    try:
        # This is a placeholder - in a real app, would check actual DB connection
        # For demo purposes, we'll simulate a working database
        return jsonify({
            "status": "healthy",
            "message": "Database connection is operational",
            "details": {
                "type": "SQLite (simulated)",
                "latency_ms": 5,
                "connections": 1
            },
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Database check failed: {str(e)}")
        return jsonify({
            "status": "error",
            "error": str(e),
            "message": "Failed to connect to database",
            "timestamp": datetime.now().isoformat()
        })

@app.route('/status', methods=['GET'])
def status():
    """Status endpoint to verify the server is running correctly (simpler version of health check)"""
    logger.info("Status endpoint called")
    return jsonify({
        "status": "ok",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/check-openai-key', methods=['GET'])
def check_openai_key():
    """Check if the OpenAI API key is valid"""
    logger.info("OpenAI API key check endpoint called")
    
    try:
        # Try listing models to validate the key
        openai.models.list()
        return jsonify({
            "valid": True,
            "message": "API key is valid and working",
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"OpenAI API key validation failed: {str(e)}")
        return jsonify({
            "valid": False,
            "error": str(e),
            "message": "API key validation failed",
            "timestamp": datetime.now().isoformat()
        })

if __name__ == '__main__':
    # Validate OpenAI API key
    try:
        # No need to re-validate here since we've already done it above
        pass
    except Exception as e:
        logger.error(f"Failed to initialize OpenAI client: {str(e)}")
        exit(1)

    # Get port from environment variable or use default
    port = int(os.getenv('FLASK_SERVER_PORT', 5338))
    
    # If the port is in use, find an available one
    if is_port_in_use(port):
        logger.warning(f"Port {port} is already in use. Searching for an available port...")
        try:
            # Try to find an available port starting from our original port
            port = get_available_port(port + 1, max_attempts=60)
            logger.info(f"Found available port: {port}")
            
            # Update environment variable
            os.environ['FLASK_SERVER_PORT'] = str(port)
        except Exception as e:
            logger.error(f"Failed to find available port: {str(e)}")
            exit(1)
    
    # Always print the port for the parent process to capture
    print(f"FLASK_SERVER_PORT={port}", flush=True)
    sys.stdout.flush()
    
    logger.info(f"Starting Flask server on 0.0.0.0:{port}")
    
    try:
        app.run(host='0.0.0.0', port=port, debug=True)
    except Exception as e:
        logger.error(f"Error starting Flask server: {str(e)}")
        exit(1) 