from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
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
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize OpenAI client
api_key = os.getenv('OPENAI_API_KEY')
if not api_key:
    logger.error("OPENAI_API_KEY is not set in environment variables")
    raise ValueError("OPENAI_API_KEY is required")

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
    """Check the health of the server and OpenAI connection."""
    try:
        # Test the OpenAI client
        client.models.list()
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
    """Generate a lesson plan based on provided parameters."""
    try:
        data = request.json
        error = validate_request_data(data, ['subject', 'grade', 'topic', 'objectives', 'duration'])
        if error:
            logger.error(f"Request validation failed: {error}")
            return jsonify({"success": False, "error": error}), 400

        subject = data['subject']
        grade = data['grade']
        topic = data['topic']
        objectives = data['objectives']
        duration = data['duration']
        
        logger.info(f"Generating lesson plan for subject: {subject}, grade: {grade}, topic: {topic}")
        
        prompt = f"""Crea un plan de lección detallado para la clase de {subject}, {grade}° grado, sobre el tema: {topic}.

Objetivos de Aprendizaje:
{objectives}

Duración: {duration} minutos

El plan debe incluir:
1. Inicio (activación de conocimientos previos)
2. Desarrollo (actividades principales)
3. Cierre (evaluación y reflexión)
4. Materiales necesarios
5. Adaptaciones para diferentes niveles
6. Evaluación formativa
7. Tarea o extensión

Asegúrate de que el plan:
- Esté alineado con el Currículo Nacional de Educación Básica del Perú
- Sea apropiado para la edad y nivel de los estudiantes
- Incluya estrategias de aprendizaje activo
- Considere diferentes estilos de aprendizaje
- Incorpore elementos de evaluación formativa

Por favor, estructura la respuesta en formato JSON con las siguientes secciones:
{
  "inicio": {
    "duracion": "tiempo en minutos",
    "actividades": ["lista de actividades"],
    "materiales": ["lista de materiales"]
  },
  "desarrollo": {
    "duracion": "tiempo en minutos",
    "actividades": ["lista de actividades"],
    "materiales": ["lista de materiales"]
  },
  "cierre": {
    "duracion": "tiempo en minutos",
    "actividades": ["lista de actividades"],
    "evaluacion": ["criterios de evaluación"]
  },
  "adaptaciones": ["lista de adaptaciones"],
  "tarea": "descripción de la tarea",
  "recursos_adicionales": ["lista de recursos"]
}"""
        
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "Eres un experto en educación especializado en crear planes de lección efectivos y alineados con el currículo peruano. Todas tus respuestas deben ser en español y en formato JSON válido."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            lesson_plan = response.choices[0].message.content
            
            # Validate JSON response
            try:
                lesson_plan_json = json.loads(lesson_plan)
                logger.info("Lesson plan generated successfully")
                return jsonify({
                    "success": True,
                    "lesson_plan": lesson_plan_json
                })
            except json.JSONDecodeError as e:
                logger.error(f"Invalid JSON in OpenAI response: {e}")
                return jsonify({
                    "success": False,
                    "error": "Error en el formato de la respuesta",
                    "details": str(e)
                }), 500
                
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            return jsonify({
                "success": False,
                "error": f"Error al comunicarse con OpenAI: {str(e)}"
            }), 500
            
    except Exception as e:
        logger.error(f"Error generating lesson plan: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Error al generar el plan de lección: {str(e)}"
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
    port = int(os.getenv('FLASK_PORT', 5328))
    logger.info(f"Starting Flask server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=True) 