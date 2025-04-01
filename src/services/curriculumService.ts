import fs from 'fs';
import path from 'path';

// TypeScript interfaces for curriculum data
export interface CompetencySection {
  title: string;
  description: string;
  grade: string;
  competencies: Competency[];
}

export interface Competency {
  name: string;
  description: string;
  standards: Standard[];
}

export interface Standard {
  gradeLevel: string;
  description: string;
  criteria: string[];
}

// In-memory cache for curriculum data
let curriculumCache: CompetencySection[] | null = null;

// Path to the curriculum JSON file
const DATA_FILE_PATH = path.resolve(process.cwd(), 'public/curriculum/curriculum-data.json');

/**
 * Load curriculum data from a JSON file or generate mock data if file doesn't exist
 */
async function loadCurriculumData(): Promise<CompetencySection[]> {
  try {
    // Check if JSON file exists
    if (fs.existsSync(DATA_FILE_PATH)) {
      console.log('Loading curriculum data from JSON file');
      const fileData = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      return JSON.parse(fileData);
    }
    
    // Create directory if it doesn't exist
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // File doesn't exist, create mock data
    console.log('Creating mock curriculum data');
    const mockData = createMockCurriculumData();
    
    // Save mock data to file
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(mockData, null, 2), 'utf-8');
    
    return mockData;
  } catch (error) {
    console.error('Error loading curriculum data:', error);
    return createMockCurriculumData();
  }
}

/**
 * Create sample curriculum data for demo purposes
 */
function createMockCurriculumData(): CompetencySection[] {
  return [
    {
      title: "Matemática",
      description: "El área de Matemática promueve el desarrollo de la competencia para plantear y resolver problemas con actitud crítica.",
      grade: "PRIMARIA",
      competencies: [
        {
          name: "Resuelve problemas de cantidad",
          description: "Consiste en que el estudiante solucione problemas o plantee nuevos problemas que le demanden construir y comprender las nociones de número.",
          standards: [
            {
              gradeLevel: "Ciclo III (1º y 2º grado de primaria)",
              description: "Resuelve problemas referidos a acciones de juntar, separar, agregar, quitar, igualar y comparar cantidades.",
              criteria: [
                "Traduce cantidades a expresiones numéricas",
                "Comunica su comprensión sobre los números y las operaciones",
                "Usa estrategias y procedimientos de estimación y cálculo",
                "Argumenta afirmaciones sobre las relaciones numéricas y las operaciones"
              ]
            }
          ]
        },
        {
          name: "Resuelve problemas de regularidad, equivalencia y cambio",
          description: "Consiste en que el estudiante logre caracterizar equivalencias y generalizar regularidades mediante reglas y álgebra.",
          standards: [
            {
              gradeLevel: "Ciclo III (1º y 2º grado de primaria)",
              description: "Resuelve problemas que presentan equivalencias o regularidades, traduciéndolas a igualdades con expresiones aditivas.",
              criteria: [
                "Traduce datos y condiciones a expresiones algebraicas y gráficas",
                "Comunica su comprensión sobre las relaciones algebraicas",
                "Usa estrategias y procedimientos para encontrar equivalencias y reglas generales",
                "Argumenta afirmaciones sobre relaciones de cambio y equivalencia"
              ]
            }
          ]
        }
      ]
    },
    {
      title: "Comunicación",
      description: "El área de Comunicación promueve el desarrollo comunicativo para la comprensión y construcción de la realidad.",
      grade: "PRIMARIA",
      competencies: [
        {
          name: "Se comunica oralmente en su lengua materna",
          description: "Se define como una interacción dinámica entre uno o más interlocutores para expresar y comprender ideas y emociones.",
          standards: [
            {
              gradeLevel: "Ciclo III (1º y 2º grado de primaria)",
              description: "Se comunica oralmente mediante diversos tipos de textos; identifica información explícita, infiere e interpreta hechos y temas.",
              criteria: [
                "Obtiene información del texto oral",
                "Infiere e interpreta información del texto oral",
                "Adecúa, organiza y desarrolla el texto de forma coherente y cohesionada",
                "Utiliza recursos no verbales y paraverbales de forma estratégica",
                "Interactúa estratégicamente con distintos interlocutores",
                "Reflexiona y evalúa la forma, el contenido y contexto del texto oral"
              ]
            }
          ]
        },
        {
          name: "Lee diversos tipos de textos escritos en su lengua materna",
          description: "Esta competencia se define como una interacción dinámica entre el lector, el texto y los contextos socioculturales.",
          standards: [
            {
              gradeLevel: "Ciclo III (1º y 2º grado de primaria)",
              description: "Lee diversos tipos de textos que presentan estructura simple con algunos elementos complejos y vocabulario variado.",
              criteria: [
                "Obtiene información del texto escrito",
                "Infiere e interpreta información del texto",
                "Reflexiona y evalúa la forma, el contenido y contexto del texto"
              ]
            }
          ]
        }
      ]
    },
    {
      title: "Ciencia y Tecnología",
      description: "El área de Ciencia y Tecnología promueve el desarrollo de la indagación y alfabetización científica y tecnológica.",
      grade: "SECUNDARIA",
      competencies: [
        {
          name: "Indaga mediante métodos científicos para construir sus conocimientos",
          description: "El estudiante es capaz de construir su conocimiento acerca del funcionamiento y estructura del mundo natural y artificial.",
          standards: [
            {
              gradeLevel: "Ciclo VI (1º y 2º de secundaria)",
              description: "Indaga a partir de preguntas sobre una situación y argumenta la influencia de las variables, formula una hipótesis y diseña un plan de indagación.",
              criteria: [
                "Problematiza situaciones para hacer indagación",
                "Diseña estrategias para hacer indagación",
                "Genera y registra datos e información",
                "Analiza datos e información",
                "Evalúa y comunica el proceso y resultados de su indagación"
              ]
            }
          ]
        },
        {
          name: "Explica el mundo físico basándose en conocimientos sobre los seres vivos, materia y energía",
          description: "El estudiante es capaz de comprender conocimientos científicos relacionados a hechos o fenómenos y los utiliza para generar argumentos.",
          standards: [
            {
              gradeLevel: "Ciclo VI (1º y 2º de secundaria)",
              description: "Explica, con base en evidencia con respaldo científico, las relaciones entre las propiedades de los materiales y los cambios de la materia con la estructura de sus partículas.",
              criteria: [
                "Comprende y usa conocimientos sobre los seres vivos, materia y energía, biodiversidad, Tierra y universo",
                "Evalúa las implicancias del saber y del quehacer científico y tecnológico"
              ]
            }
          ]
        }
      ]
    },
    {
      title: "Personal Social",
      description: "El área de Personal Social busca contribuir al desarrollo integral de los estudiantes como personas autónomas y miembros conscientes de la sociedad.",
      grade: "INICIAL",
      competencies: [
        {
          name: "Construye su identidad",
          description: "El estudiante conoce y valora su cuerpo, su forma de sentir, de pensar y de actuar desde el reconocimiento de sus identidades.",
          standards: [
            {
              gradeLevel: "Ciclo II (3-5 años)",
              description: "Construye su identidad al tomar conciencia de los aspectos que lo hacen único y se identifica con características físicas y preferencias.",
              criteria: [
                "Se valora a sí mismo",
                "Autorregula sus emociones",
                "Reflexiona y argumenta éticamente",
                "Vive su sexualidad de manera integral y responsable"
              ]
            }
          ]
        },
        {
          name: "Convive y participa democráticamente en la búsqueda del bien común",
          description: "El estudiante actúa en la sociedad relacionándose con los demás de manera justa y equitativa.",
          standards: [
            {
              gradeLevel: "Ciclo II (3-5 años)",
              description: "Convive y participa democráticamente cuando interactúa de manera respetuosa con sus compañeros y se relaciona con adultos de su entorno.",
              criteria: [
                "Interactúa con todas las personas",
                "Construye normas y asume acuerdos y leyes",
                "Maneja conflictos de manera constructiva",
                "Delibera sobre asuntos públicos",
                "Participa en acciones que promueven el bienestar común"
              ]
            }
          ]
        }
      ]
    }
  ];
}

/**
 * Get full curriculum data
 * Returns cached data if available or loads from file if not
 */
export async function getCurriculumData(): Promise<CompetencySection[]> {
  if (curriculumCache) {
    return curriculumCache;
  }
  
  // Load curriculum data from file
  const curriculumData = await loadCurriculumData();
  
  // Cache the data
  curriculumCache = curriculumData;
  
  return curriculumData;
}

/**
 * Search curriculum data based on query and grade filters
 * @param query Search term for curriculum content
 * @param gradeLevel Grade level filter (INICIAL, PRIMARIA, SECUNDARIA)
 */
export async function searchCurriculum(
  query: string = '', 
  gradeLevel: string = ''
): Promise<CompetencySection[]> {
  // Get full curriculum data
  const curriculumData = await getCurriculumData();
  
  // If no filters, return all data
  if (!query && !gradeLevel) {
    return curriculumData;
  }
  
  // Convert query to lowercase for case-insensitive search
  const searchQuery = query.toLowerCase();
  const gradeLevelUpper = gradeLevel.toUpperCase();
  
  // Filter data based on query and grade
  return curriculumData.filter(section => {
    // Apply grade filter if provided
    if (gradeLevelUpper && section.grade !== gradeLevelUpper) {
      return false;
    }
    
    // If no search query, return based on grade filter only
    if (!searchQuery) {
      return true;
    }
    
    // Search in section title and description
    const sectionMatches = 
      section.title.toLowerCase().includes(searchQuery) || 
      section.description.toLowerCase().includes(searchQuery);
    
    if (sectionMatches) return true;
    
    // Search in competencies
    const competencyMatches = section.competencies.some(competency => 
      competency.name.toLowerCase().includes(searchQuery) ||
      competency.description.toLowerCase().includes(searchQuery) ||
      competency.standards.some(standard => 
        standard.description.toLowerCase().includes(searchQuery) ||
        standard.criteria.some(criterion => 
          criterion.toLowerCase().includes(searchQuery)
        )
      )
    );
    
    return competencyMatches;
  });
}

/**
 * Generate a lesson plan based on curriculum competencies
 * @param subject Subject area
 * @param competencyName Specific competency name
 * @param gradeLevel Grade level
 * @param topic Specific topic for the lesson
 */
export async function generateLessonPlan(
  subject: string,
  competencyName: string,
  gradeLevel: string,
  topic: string
): Promise<any> {
  try {
    // Get curriculum data
    const curriculumData = await getCurriculumData();
    
    // Find matching section by subject
    const section = curriculumData.find(s => 
      s.title.toLowerCase() === subject.toLowerCase()
    );
    
    if (!section) {
      throw new Error(`Subject not found: ${subject}`);
    }
    
    // Find matching competency
    const competency = section.competencies.find(c => 
      c.name.toLowerCase() === competencyName.toLowerCase()
    );
    
    if (!competency) {
      throw new Error(`Competency not found: ${competencyName}`);
    }
    
    // Find matching standard by grade level
    const standard = competency.standards.find(s => 
      s.gradeLevel.toLowerCase().includes(gradeLevel.toLowerCase())
    );
    
    if (!standard) {
      throw new Error(`Standard not found for grade level: ${gradeLevel}`);
    }
    
    // Create a structured lesson plan based on the curriculum data
    const lessonPlan = {
      title: `Lección: ${topic}`,
      subject: section.title,
      grade: section.grade,
      competency: competency.name,
      learningStandard: standard.description,
      objectives: [
        `Comprender ${topic} en el contexto de ${subject}`,
        `Desarrollar habilidades relacionadas con ${competency.name}`,
        `Aplicar aprendizaje de ${topic} en situaciones prácticas`
      ],
      materials: [
        "Libro de texto",
        "Materiales manipulativos",
        "Presentación digital",
        "Hojas de trabajo"
      ],
      activities: [
        {
          title: "Actividad introductoria",
          description: `Introducir ${topic} y conectar con conocimientos previos`,
          duration: "15 minutos"
        },
        {
          title: "Desarrollo del tema",
          description: `Explicación y demostración de ${topic}`,
          duration: "25 minutos"
        },
        {
          title: "Práctica guiada",
          description: "Trabajo en grupos pequeños para aplicar lo aprendido",
          duration: "20 minutos"
        },
        {
          title: "Práctica independiente",
          description: "Trabajo individual para consolidar el aprendizaje",
          duration: "15 minutos"
        },
        {
          title: "Cierre y evaluación",
          description: "Revisión de lo aprendido y evaluación formativa",
          duration: "15 minutos"
        }
      ],
      assessment: {
        formative: [
          "Observación durante la práctica guiada",
          "Preguntas y respuestas durante la lección",
          "Revisión del trabajo en clase"
        ],
        summative: [
          "Proyecto final de unidad",
          "Prueba escrita sobre el tema",
          "Presentación oral"
        ]
      },
      standardsCriteria: standard.criteria,
      extensions: [
        "Actividades de enriquecimiento para estudiantes avanzados",
        "Apoyo adicional para estudiantes que lo necesiten",
        "Conexiones con otras áreas del currículo"
      ]
    };
    
    return lessonPlan;
  } catch (error) {
    console.error('Error generating lesson plan:', error);
    throw new Error('Failed to generate lesson plan');
  }
}

/**
 * Generate learning activities based on curriculum data
 * @param subject Subject area
 * @param gradeLevel Grade level
 * @param topic Specific topic for activities
 */
export async function generateActivities(
  subject: string,
  gradeLevel: string,
  topic: string
): Promise<any> {
  try {
    // Get curriculum data
    const curriculumData = await getCurriculumData();
    
    // Find matching section by subject
    const section = curriculumData.find(s => 
      s.title.toLowerCase() === subject.toLowerCase()
    );
    
    if (!section) {
      throw new Error(`Subject not found: ${subject}`);
    }
    
    // Create activities based on curriculum data
    const activities = [
      {
        title: `Actividad 1: Exploración de ${topic}`,
        description: `Los estudiantes explorarán conceptos básicos relacionados con ${topic} a través de investigación guiada.`,
        objective: `Comprender los fundamentos de ${topic} en el contexto de ${subject}.`,
        timeRequired: "45 minutos",
        materials: [
          "Libros de texto",
          "Acceso a internet",
          "Hojas de trabajo"
        ],
        procedure: [
          "Organizar a los estudiantes en grupos pequeños",
          `Presentar preguntas clave sobre ${topic}`,
          "Guiar a los estudiantes en la investigación",
          "Facilitar la discusión de hallazgos",
          "Consolidar el aprendizaje con una actividad de cierre"
        ],
        assessment: "Rúbrica de evaluación para trabajo en grupo y comprensión conceptual",
        differentiation: "Proporcionar recursos adicionales para diferentes niveles de habilidad"
      },
      {
        title: `Actividad 2: Aplicación práctica de ${topic}`,
        description: `Los estudiantes aplicarán su comprensión de ${topic} a través de actividades prácticas.`,
        objective: `Desarrollar habilidades prácticas relacionadas con ${topic}.`,
        timeRequired: "60 minutos",
        materials: [
          "Materiales manipulativos",
          "Hojas de actividades",
          "Equipos y herramientas específicas"
        ],
        procedure: [
          "Demostrar la aplicación práctica",
          "Modelar el proceso paso a paso",
          "Proporcionar tiempo para práctica guiada",
          "Facilitar práctica independiente",
          "Revisar y dar retroalimentación"
        ],
        assessment: "Lista de verificación de habilidades prácticas",
        differentiation: "Ajustar la complejidad de las tareas según las necesidades individuales"
      },
      {
        title: `Actividad 3: Proyecto colaborativo sobre ${topic}`,
        description: `Los estudiantes trabajarán en equipos para crear un proyecto que demuestre su comprensión de ${topic}.`,
        objective: `Sintetizar conocimientos y aplicarlos en un contexto creativo relacionado con ${topic}.`,
        timeRequired: "90 minutos (o varias sesiones)",
        materials: [
          "Materiales de arte y manualidades",
          "Recursos digitales",
          "Materiales de presentación"
        ],
        procedure: [
          "Presentar los requisitos del proyecto",
          "Formar equipos y asignar roles",
          "Proporcionar tiempo para planificación",
          "Supervisar el desarrollo del proyecto",
          "Organizar presentaciones de proyectos"
        ],
        assessment: "Rúbrica de evaluación para proyectos colaborativos",
        differentiation: "Ofrecer opciones de proyecto para diferentes estilos de aprendizaje"
      }
    ];
    
    return activities;
  } catch (error) {
    console.error('Error generating activities:', error);
    throw new Error('Failed to generate activities');
  }
} 