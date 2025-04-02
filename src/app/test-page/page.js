export default function TestPage() {
  const sampleLessonPlan = {
    title: "Sample Lesson Plan",
    subject: "Math",
    grade: "5",
    topic: "Fractions",
    objectives: [
      "Understand fractions as parts of a whole",
      "Add and subtract fractions with like denominators",
      "Solve word problems involving fractions"
    ],
    activities: [
      {
        name: "Introduction",
        duration: "10 minutes",
        description: "Introduce the concept of fractions using visual aids."
      },
      {
        name: "Guided Practice",
        duration: "20 minutes",
        description: "Work through example problems as a class."
      },
      {
        name: "Independent Practice",
        duration: "15 minutes",
        description: "Students complete worksheet problems individually."
      }
    ]
  };

  const sampleActivities = [
    {
      title: "Fraction Art Project",
      subject: "Math",
      grade: "5",
      duration: 45,
      content: {
        description: "Students create art using geometric shapes divided into fractions.",
        objectives: "Apply fraction concepts through creative expression"
      }
    },
    {
      title: "Fraction Bingo",
      subject: "Math",
      grade: "5",
      duration: 30,
      content: {
        description: "Play bingo with fraction problems to solve.",
        objectives: "Practice identifying equivalent fractions"
      }
    }
  ];

  const pageStyles = {
    container: {
      minHeight: '100vh',
      padding: '32px',
      fontFamily: 'Arial, sans-serif',
      color: 'black',
      backgroundColor: 'white'
    },
    heading: {
      fontSize: '30px',
      fontWeight: 'bold',
      marginBottom: '24px',
      color: 'black',
    },
    section: {
      marginBottom: '32px',
      padding: '16px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      backgroundColor: '#f9fafb'
    },
    subheading: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '16px',
      color: 'black',
    },
    buttonContainer: {
      display: 'flex',
      gap: '16px',
      marginBottom: '16px',
    },
    button: {
      padding: '8px 16px',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
    },
    resultBox: {
      padding: '16px',
      backgroundColor: '#f3f4f6',
      borderRadius: '4px',
      marginTop: '16px'
    },
    resultTitle: {
      fontSize: '18px',
      fontWeight: '500',
      marginBottom: '8px',
      color: 'black',
    },
    resultItem: {
      marginBottom: '8px',
      color: 'black',
    },
    objectivesList: {
      listStyleType: 'disc',
      paddingLeft: '20px',
      marginTop: '8px',
      marginBottom: '16px',
    },
    activityBox: {
      padding: '8px',
      backgroundColor: 'white',
      borderRadius: '4px',
      marginBottom: '8px',
      border: '1px solid #e5e7eb'
    },
  };

  return (
    <main style={pageStyles.container}>
      <h1 style={pageStyles.heading}>Static API Test Page</h1>
      
      <div style={pageStyles.section}>
        <h2 style={pageStyles.subheading}>Sample Lesson Plan</h2>
        <div style={pageStyles.resultBox}>
          <h3 style={pageStyles.resultTitle}>{sampleLessonPlan.title}</h3>
          <p style={pageStyles.resultItem}><strong>Subject:</strong> {sampleLessonPlan.subject}</p>
          <p style={pageStyles.resultItem}><strong>Grade:</strong> {sampleLessonPlan.grade}</p>
          <p style={pageStyles.resultItem}><strong>Topic:</strong> {sampleLessonPlan.topic}</p>
          
          <h4 style={{...pageStyles.resultItem, fontWeight: '500', marginTop: '16px'}}>Objectives:</h4>
          <ul style={pageStyles.objectivesList}>
            {sampleLessonPlan.objectives.map((obj, index) => (
              <li key={index} style={{color: 'black'}}>{obj}</li>
            ))}
          </ul>
          
          <h4 style={{...pageStyles.resultItem, fontWeight: '500', marginTop: '16px'}}>Activities:</h4>
          <div style={{display: 'grid', gap: '8px'}}>
            {sampleLessonPlan.activities.map((activity, index) => (
              <div key={index} style={pageStyles.activityBox}>
                <p style={{color: 'black'}}><strong>{activity.name}</strong> ({activity.duration})</p>
                <p style={{color: 'black'}}>{activity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div style={pageStyles.section}>
        <h2 style={pageStyles.subheading}>Sample Activities</h2>
        <div style={{display: 'grid', gap: '16px'}}>
          {sampleActivities.map((activity, index) => (
            <div key={index} style={pageStyles.resultBox}>
              <h3 style={pageStyles.resultTitle}>{activity.title}</h3>
              <p style={pageStyles.resultItem}><strong>Subject:</strong> {activity.subject}</p>
              <p style={pageStyles.resultItem}><strong>Grade:</strong> {activity.grade}</p>
              <p style={pageStyles.resultItem}><strong>Duration:</strong> {activity.duration} minutes</p>
              
              <div style={{marginTop: '12px'}}>
                <p style={pageStyles.resultItem}><strong>Description:</strong> {activity.content.description}</p>
                <p style={pageStyles.resultItem}><strong>Objectives:</strong> {activity.content.objectives}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 