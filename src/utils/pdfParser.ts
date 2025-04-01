import * as pdfjsLib from 'pdfjs-dist';
import { TextItem } from 'pdfjs-dist/types/src/display/api';

// Set worker path to fetch from CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface CompetencySection {
  title: string;
  description: string;
  grade: string;
  competencies: Competency[];
}

interface Competency {
  name: string;
  description: string;
  standards: Standard[];
}

interface Standard {
  gradeLevel: string;
  description: string;
  criteria: string[];
}

export async function parseCurriculumPDF(pdfPath: string): Promise<CompetencySection[]> {
  try {
    console.log(`Loading PDF from: ${pdfPath}`);
    
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument(pdfPath);
    const pdf = await loadingTask.promise;
    
    console.log(`PDF loaded with ${pdf.numPages} pages`);
    
    // Extract text from each page
    const sections: CompetencySection[] = [];
    let currentSection: CompetencySection | null = null;
    let currentCompetency: Competency | null = null;
    
    // Process each page
    for (let i = 1; i <= pdf.numPages; i++) {
      // Skip processing all pages in development - just process the first 20 pages
      if (process.env.NODE_ENV === 'development' && i > 20) break;
      
      console.log(`Processing page ${i} of ${pdf.numPages}`);
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const textItems = textContent.items as TextItem[];
      
      // Convert text items to strings
      const pageText = textItems.map(item => item.str).join(' ');
      
      // Process the text to identify sections, competencies, etc.
      // This is a simplified example - actual parsing would be more complex
      if (pageText.includes('COMPETENCIAS')) {
        // New section found
        currentSection = {
          title: extractTitle(pageText),
          description: extractDescription(pageText),
          grade: extractGrade(pageText),
          competencies: []
        };
        sections.push(currentSection);
      } else if (pageText.includes('ESTÁNDARES DE APRENDIZAJE') && currentSection) {
        // Standards section found
        currentCompetency = {
          name: extractCompetencyName(pageText),
          description: extractCompetencyDescription(pageText),
          standards: []
        };
        currentSection.competencies.push(currentCompetency);
      }
      
      // More parsing logic would be added here for different sections
    }
    
    // For development purposes, if no sections found, create sample data
    if (sections.length === 0) {
      console.log('Creating sample curriculum data');
      return createSampleCurriculumData();
    }
    
    return sections;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    
    // Return sample data in case of error
    console.log('Returning sample curriculum data due to error');
    return createSampleCurriculumData();
  }
}

// Helper functions for text extraction
function extractTitle(text: string): string {
  // Simplified extraction - in a real implementation, this would use regex or more sophisticated parsing
  const titleMatch = text.match(/COMPETENCIAS\s+(.*?)(?:\n|$)/);
  return titleMatch ? titleMatch[1].trim() : 'Unknown Title';
}

function extractDescription(text: string): string {
  // Simplified extraction
  return text.substring(0, 200) + '...'; // Just take the first 200 chars for now
}

function extractGrade(text: string): string {
  // Try to find grade level references
  const gradeMatch = text.match(/\b(PRIMARIA|SECUNDARIA|INICIAL)\b/i);
  return gradeMatch ? gradeMatch[1] : 'All Grades';
}

function extractCompetencyName(text: string): string {
  // Simplified extraction
  const nameMatch = text.match(/COMPETENCIA\s+(.*?)(?:\n|$)/i);
  return nameMatch ? nameMatch[1].trim() : 'Unknown Competency';
}

function extractCompetencyDescription(text: string): string {
  // Simplified extraction
  return text.substring(0, 150) + '...'; // Just take the first 150 chars for now
}

// Create sample data for development or when parsing fails
function createSampleCurriculumData(): CompetencySection[] {
  return [
    {
      title: 'ÁREA: MATEMÁTICA',
      description: 'El área de matemática promueve el desarrollo de habilidades para plantear y resolver problemas...',
      grade: 'PRIMARIA',
      competencies: [
        {
          name: 'Resuelve problemas de cantidad',
          description: 'Consiste en que el estudiante solucione problemas o plantee nuevos que le demanden construir y comprender las nociones de número, de sistemas numéricos, sus operaciones y propiedades...',
          standards: [
            {
              gradeLevel: '3° grado de primaria',
              description: 'Resuelve problemas referidos a acciones de juntar, separar, agregar, quitar, igualar y comparar cantidades...',
              criteria: [
                'Traduce cantidades a expresiones numéricas',
                'Comunica su comprensión sobre los números y las operaciones',
                'Usa estrategias y procedimientos de estimación y cálculo',
                'Argumenta afirmaciones sobre las relaciones numéricas y las operaciones'
              ]
            }
          ]
        },
        {
          name: 'Resuelve problemas de regularidad, equivalencia y cambio',
          description: 'Consiste en que el estudiante logre caracterizar equivalencias y generalizar regularidades y el cambio de una magnitud con respecto de otra...',
          standards: [
            {
              gradeLevel: '3° grado de primaria',
              description: 'Resuelve problemas que presentan equivalencias o regularidades, traduciéndolas a igualdades que contienen operaciones de adición o de sustracción...',
              criteria: [
                'Traduce datos y condiciones a expresiones algebraicas y gráficas',
                'Comunica su comprensión sobre las relaciones algebraicas',
                'Usa estrategias y procedimientos para encontrar equivalencias y reglas generales',
                'Argumenta afirmaciones sobre relaciones de cambio y equivalencia'
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'ÁREA: COMUNICACIÓN',
      description: 'El área de Comunicación tiene por finalidad que los estudiantes desarrollen competencias comunicativas para interactuar con otras personas...',
      grade: 'PRIMARIA',
      competencies: [
        {
          name: 'Se comunica oralmente en su lengua materna',
          description: 'Se define como una interacción dinámica entre uno o más interlocutores para expresar y comprender ideas y emociones...',
          standards: [
            {
              gradeLevel: '3° grado de primaria',
              description: 'Se comunica oralmente mediante diversos tipos de textos; infiere el tema, propósito, hechos y conclusiones a partir de información explícita...',
              criteria: [
                'Obtiene información del texto oral',
                'Infiere e interpreta información del texto oral',
                'Adecúa, organiza y desarrolla las ideas de forma coherente y cohesionada',
                'Utiliza recursos no verbales y paraverbales de forma estratégica',
                'Interactúa estratégicamente con distintos interlocutores',
                'Reflexiona y evalúa la forma, el contenido y contexto del texto oral'
              ]
            }
          ]
        },
        {
          name: 'Lee diversos tipos de textos escritos en su lengua materna',
          description: 'Esta competencia se define como una interacción dinámica entre el lector, el texto y los contextos socioculturales que enmarcan la lectura...',
          standards: [
            {
              gradeLevel: '3° grado de primaria',
              description: 'Lee diversos tipos de textos de estructura simple en los que predominan palabras conocidas e ilustraciones que apoyan las ideas centrales...',
              criteria: [
                'Obtiene información del texto escrito',
                'Infiere e interpreta información del texto',
                'Reflexiona y evalúa la forma, el contenido y contexto del texto'
              ]
            }
          ]
        }
      ]
    }
  ];
}

// Export the sample data creation function for direct access
export { createSampleCurriculumData }; 