from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv
import logging
import sys

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

# Initialize OpenAI client
api_key = os.getenv('OPENAI_API_KEY')
if not api_key:
    logger.error("OPENAI_API_KEY is not set in environment variables")
    raise ValueError("OPENAI_API_KEY is required")

openai.api_key = api_key

@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        # Test the OpenAI client
        models = openai.Model.list()
        return jsonify({
            "status": "healthy",
            "service": "flask-backend",
            "openai_key_configured": True,
            "openai_connection": "successful"
        })
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return jsonify({
            "status": "unhealthy", 
            "error": str(e),
            "openai_key_configured": bool(api_key)
        }), 500

@app.route('/api/generate-lesson', methods=['POST'])
def generate_lesson():
    try:
        data = request.json
        if not data:
            return jsonify({"success": False, "error": "No se proporcionaron datos"}), 400

        required_fields = ['subject', 'grade', 'topic']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({
                "success": False,
                "error": f"Faltan campos requeridos: {', '.join(missing_fields)}"
            }), 400

        subject = data.get('subject')
        grade = data.get('grade')
        topic = data.get('topic')
        
        logger.info(f"Generando plan de lección para asignatura: {subject}, grado: {grade}, tema: {topic}")
        
        prompt = f"""Crea un plan de lección para la clase de {subject}, {grade}° grado, sobre {topic}. 
        Incluye:
        1. Objetivos de aprendizaje
        2. Actividades
        3. Evaluación
        4. Materiales necesarios
        5. Tiempo estimado

        Asegúrate de que esté alineado con el Currículo Nacional de Educación Básica del Perú.
        La respuesta debe estar en español."""
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Eres un asistente docente especializado en crear planes de lección alineados con el Currículo Nacional de Educación Básica del Perú. Todas tus respuestas deben ser en español."},
                    {"role": "user", "content": prompt}
                ]
            )
            
            lesson_plan = response.choices[0].message['content']
            logger.info("Plan de lección generado exitosamente")
            
            return jsonify({
                "success": True,
                "lesson_plan": lesson_plan
            })
        except Exception as e:
            logger.error(f"Error de API de OpenAI: {str(e)}")
            return jsonify({
                "success": False,
                "error": f"Error de API de OpenAI: {str(e)}"
            }), 500
            
    except Exception as e:
        logger.error(f"Error al generar el plan de lección: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Ocurrió un error: {str(e)}"
        }), 500

@app.route('/api/generate-rubric', methods=['POST'])
def generate_rubric():
    try:
        data = request.json
        assignment_type = data.get('assignmentType')
        criteria = data.get('criteria', [])
        grade_level = data.get('gradeLevel')
        
        prompt = f"""Crea una rúbrica detallada para {assignment_type} de {grade_level}° grado con los siguientes criterios: {', '.join(criteria)}. 
        Incluye:
        1. Niveles de desempeño específicos
        2. Criterios de calificación
        3. Descriptores para cada nivel
        4. Puntajes
        
        La respuesta debe estar en español."""
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Eres un asistente docente especializado en crear rúbricas de evaluación alineadas con estándares educativos. Todas tus respuestas deben ser en español."},
                {"role": "user", "content": prompt}
            ]
        )
        
        return jsonify({
            "success": True,
            "rubric": response.choices[0].message['content']
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/generate-unit-plan', methods=['POST'])
def generate_unit_plan():
    try:
        data = request.json
        subject = data.get('subject')
        grade = data.get('grade')
        duration = data.get('duration', '4 semanas')
        main_topic = data.get('mainTopic')
        
        prompt = f"""Crea un plan de unidad de {duration} para la clase de {subject}, {grade}° grado, enfocado en {main_topic}. 
        Incluye:
        1. Objetivos de la unidad
        2. Desglose semanal
        3. Actividades principales
        4. Plan de evaluación
        5. Materiales requeridos
        
        Asegúrate de que esté alineado con el Currículo Nacional de Educación Básica del Perú.
        La respuesta debe estar en español."""
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Eres un especialista en planificación curricular familiarizado con los estándares educativos peruanos. Todas tus respuestas deben ser en español."},
                {"role": "user", "content": prompt}
            ]
        )
        
        return jsonify({
            "success": True,
            "unit_plan": response.choices[0].message['content']
        })
    except Exception as e:
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
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Eres un experto en crear actividades educativas atractivas alineadas con el Currículo Nacional de Educación Básica del Perú. Todas tus respuestas deben ser en español."},
                {"role": "user", "content": prompt}
            ]
        )
        
        return jsonify({
            "success": True,
            "activities": response.choices[0].message['content']
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5328))
    logger.info(f"Starting Flask server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=True) 