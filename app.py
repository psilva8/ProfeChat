from flask import Flask, request, jsonify, send_from_directory
import os

# Initialize Flask app
app = Flask(__name__, static_folder='static')

# Define routes
@app.route('/')
def index():
    """Serve the main HTML page"""
    return send_from_directory('static', 'index.html')

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
    try:
        data = request.json
        subject = data.get('subject', 'General')
        grade = data.get('grade', 'All Grades')
        topic = data.get('topic', 'General Subject')
        
        # Generate a simple lesson plan (this is where you would integrate with OpenAI or other service)
        lesson_plan = f"""# Lesson Plan: {topic} for {grade} {subject}

## Overview
This is a sample lesson plan generated for teaching {topic} to {grade} students in {subject}.

## Objectives
- Students will understand the key concepts of {topic}
- Students will be able to apply these concepts in practical exercises
- Students will develop critical thinking skills related to {topic}

## Materials
- Textbooks
- Worksheets
- Interactive materials
- Digital resources

## Lesson Structure
1. **Introduction (10 minutes)**
   - Begin with an engaging activity to introduce {topic}
   - Connect to students' prior knowledge

2. **Main Lesson (25 minutes)**
   - Present key concepts using visual aids
   - Guide students through examples

3. **Practice Activities (15 minutes)**
   - Students work in pairs or small groups
   - Teacher provides support and guidance

4. **Assessment (5 minutes)**
   - Quick check for understanding
   - Exit ticket with key questions

5. **Closure (5 minutes)**
   - Summarize key learning points
   - Preview next lesson

## Assessment Methods
- Formative assessment during practice activities
- Exit ticket responses
- Homework assignment

## Differentiation
- For advanced students: Additional challenging problems
- For students needing support: Simplified examples and additional guidance"""

        return jsonify({
            "lesson_plan": lesson_plan,
            "success": True
        })
    except Exception as e:
        return jsonify({
            "lesson_plan": f"# Error generating lesson plan\n\nWe encountered an error: {str(e)}",
            "success": False
        }), 200  # Return 200 even on error to avoid browser issues

@app.route('/api/generate-activities', methods=['POST'])
def generate_activities():
    """Generate activities"""
    try:
        data = request.json
        subject = data.get('subject', 'General')
        grade = data.get('grade', 'All Grades')
        topic = data.get('topic', 'General Subject')
        
        # Generate activities (this is where you would integrate with OpenAI or other service)
        activities = f"""Actividad 1: "Exploración de {topic}"
1. Descripción de la actividad: Los estudiantes explorarán los conceptos clave de {topic}.
2. Duración: 30 minutos.
3. Materiales necesarios: Hojas de trabajo, materiales manipulativos.
4. Instrucciones paso a paso:
   - Paso 1: Introducir el concepto de {topic}.
   - Paso 2: Demostrar ejemplos prácticos.
   - Paso 3: Permitir que los estudiantes experimenten con los materiales.
   - Paso 4: Discutir los hallazgos en grupos pequeños.
5. Criterios de evaluación: Participación, comprensión conceptual.

Actividad 2: "Aplicación práctica de {topic}"
1. Descripción de la actividad: Los estudiantes aplicarán lo aprendido en situaciones del mundo real.
2. Duración: 45 minutos.
3. Materiales necesarios: Hojas de problemas, recursos digitales.
4. Instrucciones paso a paso:
   - Paso 1: Revisar los conceptos clave de {topic}.
   - Paso 2: Presentar problemas del mundo real relacionados con {topic}.
   - Paso 3: Los estudiantes trabajan en parejas para resolver los problemas.
   - Paso 4: Compartir soluciones y estrategias.
5. Criterios de evaluación: Precisión, razonamiento, colaboración.

Actividad 3: "Proyecto creativo sobre {topic}"
1. Descripción de la actividad: Los estudiantes crearán un proyecto para demostrar su comprensión.
2. Duración: 60 minutos.
3. Materiales necesarios: Materiales de arte, recursos tecnológicos.
4. Instrucciones paso a paso:
   - Paso 1: Lluvia de ideas sobre proyectos relacionados con {topic}.
   - Paso 2: Planificar el proyecto (individual o en grupo).
   - Paso 3: Crear el proyecto utilizando los materiales disponibles.
   - Paso 4: Presentar y explicar el proyecto a la clase.
5. Criterios de evaluación: Creatividad, comprensión del tema, presentación."""

        return jsonify({
            "success": True,
            "data": activities,
            "activities": activities,
            "message": "Actividades generadas correctamente"
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "data": f"Error: {str(e)}",
            "activities": f"Error: {str(e)}",
            "message": f"Error generating activities: {str(e)}"
        }), 200  # Return 200 even on error to avoid browser issues

if __name__ == '__main__':
    # Write the port to .flask-port file for reference
    port = int(os.environ.get('PORT', 5338))
    with open('.flask-port', 'w') as f:
        f.write(str(port))
    
    # Start the Flask app
    app.run(host='0.0.0.0', port=port, debug=True) 