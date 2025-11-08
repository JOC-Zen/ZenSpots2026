# ZenSpots - Zen Rooms on Demand

ZenSpots es una plataforma que conecta profesionales de la salud y bienestar con espacios perfectos para sus prácticas. Encuentra consultorios, estudios de yoga, salas de terapia y más, disponibles por horas.

## 🌟 Características

- **Búsqueda Inteligente**: Encuentra espacios por ubicación, tipo, capacidad y servicios
- **Reservas por Horas**: Flexibilidad total para reservar solo el tiempo que necesitas
- **Gestión de Disponibilidad**: Control completo sobre tu calendario y disponibilidad
- **Perfiles de Usuario**: Gestiona tus reservas y espacios favoritos
- **Panel de Anfitrión**: Administra tus espacios y reservas desde un solo lugar
- **Sistema de Reseñas**: Valoraciones y comentarios para construir confianza

## 🚀 Tecnologías Utilizadas

- **Frontend**: React 19.2.0 con TypeScript
- **Estilos**: Tailwind CSS + CSS personalizado
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Icons**: Lucide React + Iconos personalizados
- **Estado**: React Context API

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn

## 🛠️ Instalación

1. **Clona el repositorio**:
   ```bash
   git clone [url-del-repositorio]
   cd zenspots-zen-rooms-on-demand
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**:
   Crea un archivo `.env.local` en la raíz del proyecto:
   ```
   GEMINI_API_KEY=tu-api-key-aqui
   ```

4. **Inicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

5. **Abre el navegador**:
   Visita `http://localhost:3000`

## 📁 Estructura del Proyecto

```
zenspots/
├── components/          # Componentes reutilizables
│   ├── icons/          # Iconos personalizados
│   ├── Header.tsx      # Navegación principal
│   ├── Footer.tsx      # Pie de página
│   ├── SpaceCard.tsx   # Tarjeta de espacio
│   └── ...
├── pages/              # Páginas principales
│   ├── HomePage.tsx    # Página de inicio
│   ├── BrowsePage.tsx  # Búsqueda de espacios
│   ├── SpaceDetailPage.tsx # Detalle de espacio
│   └── ...
├── contexts/           # Contexto de usuario
├── data/               # Datos mock
├── types.ts            # Definiciones de TypeScript
└── App.tsx             # Componente principal
```

## 🎯 Funcionalidades Principales

### Para Buscadores de Espacios:
- 🔍 Búsqueda avanzada con filtros
- 📅 Calendario de disponibilidad
- 💰 Precios por hora transparentes
- ⭐ Sistema de favoritos
- 📝 Reseñas y valoraciones

### Para Anfitriones:
- 🏠 Publicación de espacios
- 📊 Panel de gestión
- 💳 Control de precios
- 📅 Gestión de disponibilidad
- 📈 Estadísticas de uso

## 🎨 Personalización

### Colores
- **Primario**: `#A8D588` (Verde zen)
- **Secundario**: `#F1F8E8` (Verde claro)
- **Texto**: `#333333` (Carbón)
- **Bordes**: `#EAEAEA` (Gris claro)

### Tipografía
- **Fuente principal**: Manrope (Google Fonts)
- **Pesos disponibles**: 200-800

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run preview` - Previsualiza build de producción

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1440px+)

## 🔒 Seguridad

- Autenticación segura con localStorage
- Validación de formularios
- Protección de rutas privadas
- Sanitización de entradas

## 🚀 Deployment

### Vercel (Recomendado)
1. Conecta tu repositorio en Vercel
2. Configura las variables de entorno
3. Deploy automático en cada push

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Configura variables de entorno

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes alguna pregunta o problema:

1. Revisa la documentación
2. Busca issues existentes
3. Crea un nuevo issue con:
   - Descripción detallada
   - Pasos para reproducir
   - Screenshots si aplica
   - Información del entorno

## 📞 Contacto

- **Email**: soporte@zenspots.com
- **Web**: https://zenspots.com
- **Twitter**: @ZenSpotsApp

---

**ZenSpots** - Encuentra tu espacio perfecto para la paz y el bienestar 🧘‍♀️✨
