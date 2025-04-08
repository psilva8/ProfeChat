# Planificador de Clases para Profesores Peruanos

Esta aplicación simple permite a los profesores peruanos generar planes de clase basados en el currículo nacional. Los profesores pueden seleccionar el grado, área y recursos disponibles para obtener un plan de clase personalizado.

## Características

- Selección de grado (1-6)
- Selección de área (Matemática, Comunicación, Ciencia y Tecnología, etc.)
- Selección de recursos disponibles (Pizarra, Papel, Ninguno)
- Generación de planes de clase utilizando IA
- Diseño responsivo y fácil de usar
- Funcionamiento con o sin conexión a internet

## Instalación

1. Clona este repositorio:
```
git clone https://github.com/psilva8/ProfeChat.git
cd ProfeChat
```

2. Instala las dependencias:
```
npm install
```

3. Configura el archivo .env con tu clave API:
```
PORT=3000
API_KEY=tu-clave-api-aquí
```

4. Inicia el servidor:
```
npm start
```

5. Abre tu navegador en `http://localhost:3000`

## Uso sin servidor

Si prefieres usar la aplicación sin necesidad del servidor Node.js:

1. Abre el archivo `peru-teacher.html` directamente en tu navegador
2. La aplicación funcionará con datos locales (aunque con menos variedad)

## Tecnologías utilizadas

- HTML/CSS/JavaScript
- Node.js
- Express
- OpenAI API

## Notas

Esta aplicación está diseñada para ser simple y fácil de usar. Los planes de clase generados son solo un punto de partida y deben ser adaptados según las necesidades específicas de cada grupo de estudiantes. 