# 🚀 KanbanFlow: Gestión de Tareas de Próxima Generación

![KanbanFlow Hero](https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&q=80&w=1000)

**KanbanFlow** es una aplicación de gestión de proyectos altamente interactiva, visualmente impactante y optimizada para la productividad, construida con React, Tailwind CSS y Framer Motion.

## ✨ Características Principales

- **🎨 Interfaz Premium (Glassmorphism)**: Diseño moderno con efectos de cristal, gradientes dinámicos y temas personalizables.
- **🔄 Drag & Drop Intuitivo**: Reordenamiento fluido de tareas y columnas con retroalimentación visual inmediata.
- **⏱️ Seguimiento de Tiempo**: Temporizadores integrados por tarea para medir la productividad real.
- **📊 Estadísticas Avanzadas**: Paneles de control para visualizar la distribución de tareas por prioridad y tiempo invertido.
- **👥 Gestión de Equipo**: Sistema de miembros para asignar responsables a cada tarea.
- **📝 Funcionalidad Completa de Tareas**:
  - Subtareas con barra de progreso.
  - Etiquetas (Tags) personalizadas.
  - Fechas de entrega y prioridades.
  - Sistema de comentarios por tarea.
- **📂 Importar/Exportar**: Guarda y carga tus tableros en formato JSON con un solo clic.
- **📱 Responsive & Animado**: Optimizado para cualquier dispositivo con animaciones suaves gracias a Framer Motion.

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + Vite
- **Estilos**: Tailwind CSS (Custom Utilites)
- **Animaciones**: Framer Motion
- **Iconos**: Lucide React
- **Drag & Drop**: @hello-pangea/dnd
- **Notificaciones**: React Hot Toast
- **Testing**: Vitest + Testing Library

## 🚀 Instalación y Uso

1. **Clonar el repositorio**:
   ```bash
   git clone <repo-url>
   cd project-board
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

4. **Ejecutar pruebas**:
   ```bash
   npm test
   ```

## 📐 Arquitectura

El proyecto sigue una arquitectura modular limpia:
- `src/components`: Componentes reutilizables divididos por dominio (layout, kanban, modals, sidebar).
- `src/hooks`: Lógica de negocio encapsulada en hooks personalizados (`useKanban`).
- `src/utils`: Constantes y funciones de ayuda globales.
- `src/tests`: Cobertura de pruebas unitarias para la lógica principal.

---
*Desarrollado con ❤️ para maximizar la productividad.*