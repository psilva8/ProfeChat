from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI, OpenAIError, AuthenticationError
import os
from dotenv import load_dotenv
import logging
import sys
import json
from typing import Dict, Any, Optional

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
load_dotenv(verbose=True)

app = Flask(__name__)
CORS(app)

# Initialize OpenAI client
api_key = os.getenv('OPENAI_API_KEY')
logger.info(f"API Key status: {'Configured' if api_key else 'Not configured'}")
logger.info(f"Current working directory: {os.getcwd()}")

if not api_key:
    logger.error("Invalid or missing OpenAI API key")
    raise ValueError("OpenAI API key not configured")

client = OpenAI(api_key=api_key)

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
    try:
        if not api_key or api_key == 'your-api-key-here':
            return jsonify({
                "status": "unhealthy",
                "error": "OpenAI API key not configured. Please set a valid API key in .env file"
            }), 500

        # Test OpenAI connection
        client.models.list()
        return jsonify({"status": "healthy", "message": "API is operational"}), 200
    except AuthenticationError as e:
        logger.error(f"OpenAI API key authentication failed: {str(e)}")
        return jsonify({
            "status": "unhealthy",
            "error": "Invalid OpenAI API key. Please check your configuration."
        }), 401
    except OpenAIError as e:
        logger.error(f"OpenAI API error: {str(e)}")
        return jsonify({
            "status": "unhealthy",
            "error": f"OpenAI API error: {str(e)}"
        }), 500
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({
            "status": "unhealthy",
            "error": "Internal server error"
        }), 500

@app.route('/api/generate-lesson', methods=['POST'])
def generate_lesson():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['subject', 'grade', 'topic']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    "success": False,
                    "error": f"Missing required field: {field}"
                }), 400

        # Create prompt for lesson plan
        prompt = f"Create a detailed lesson plan for {data['subject']} grade {data['grade']} about {data['topic']}."
        if 'objectives' in data:
            prompt += f"\nLearning objectives: {data['objectives']}"
        if 'duration' in data:
            prompt += f"\nLesson duration: {data['duration']}"

        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a professional teacher creating a detailed lesson plan."},
                {"role": "user", "content": prompt}
            ]
        )

        lesson_plan = response.choices[0].message.content
        return jsonify({
            "success": True,
            "lesson_plan": lesson_plan
        })

    except OpenAIError as e:
        logger.error(f"OpenAI API error: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Error with OpenAI API: {str(e)}"
        }), 500
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Internal server error"
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

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5329))
    host = os.getenv('HOST', '0.0.0.0')
    logger.info(f"Starting Flask server on {host}:{port}")
    try:
        app.run(host=host, port=port, debug=True)
    except OSError as e:
        if "Address already in use" in str(e):
            # Try the next available port
            port = port + 1
            logger.info(f"Port {port-1} in use, trying port {port}")
            app.run(host=host, port=port, debug=True)
        else:
            raise 