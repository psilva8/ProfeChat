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
CORS(app)

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
        subject = data.get('subject')
        grade = data.get('grade')
        topic = data.get('topic')
        activity_type = data.get('activityType', 'individual')
        
        prompt = f"""Crea 3 actividades {activity_type}s atractivas para la clase de {subject}, {grade}° grado, sobre {topic}. 
        Para cada actividad incluye:
        1. Descripción de la actividad
        2. Duración
        3. Materiales necesarios
        4. Instrucciones paso a paso
        5. Criterios de evaluación
        
        Asegúrate de que las actividades sean apropiadas para el nivel y estén alineadas con el Currículo Nacional.
        La respuesta debe estar en español."""
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Eres un experto en crear actividades educativas atractivas alineadas con el Currículo Nacional de Educación Básica del Perú. Todas tus respuestas deben ser en español."},
                {"role": "user", "content": prompt}
            ]
        )
        
        return jsonify({
            "success": True,
            "activities": response.choices[0].message.content
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

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

if __name__ == '__main__':
    # Validate OpenAI API key
    try:
        openai.models.list()
        logger.info("OpenAI API key validated successfully")
    except Exception as e:
        logger.error(f"Failed to validate OpenAI API key: {str(e)}")
        exit(1)

    # Get port from environment variable with fallback to 5336
    base_port = int(os.getenv('FLASK_PORT', 5336))
    try:
        port = get_available_port(base_port)
        logger.info(f"Found available port: {port}")
        
        # Print the port to stdout for scripts that need to capture it
        # This line is important for the start-flask.js script to detect the port
        print(f"FLASK_SERVER_PORT={port}", flush=True)
        sys.stdout.flush()
        
        # Start Flask server
        logger.info(f"Starting Flask server on 0.0.0.0:{port}")
        app.run(host='0.0.0.0', port=port, debug=True)
    except Exception as e:
        logger.error(f"Failed to start Flask server: {str(e)}")
        exit(1) 