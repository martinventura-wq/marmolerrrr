# AURA Marmolería & Superficies de Autor — Landing Page Premium

Landing page web moderna, interactiva y de alta gama desarrollada específicamente para una marmolería de servicios técnicos premium (corte CNC, plantillado láser, mesadas de cocina, vanitories monolíticos, quinchos y revestimientos arquitectónicos).

---

## 🏛️ Características Principales

1. **Diseño Visual de Lujo y Paleta de Piedra Natural**:
   - Paleta inspirada en piedras nobles: Blanco Marfil (`#FAF8F5`), Negro Antracita (`#121417`), Oro Champagne (`#C5A880`) y Verde Esmeralda Profundo (`#1B3B2B`).
   - Tipografía refinada: *Playfair Display* (títulos de autor) y *Plus Jakarta Sans* (lectura técnica y moderna).
   - Micro-interacciones en hover, efectos de glassmorphism mate y sombras orgánicas.

2. **Simulador / Cotizador Rápido en Tiempo Real**:
   - Selección dinámica de tipo de espacio (Cocina/Isla, Baño, Quincho, Escaleras).
   - Selector de materiales con rango de precios (Carrara, Travertino, Negro Absoluto, Silestone, Dekton, Ónix, Cuarcita Patagonia).
   - Slider de metros lineales y cálculo automático de bordes (regruesado 4cm a 45°, simple, cascada).
   - Opciones de trasforos (bacha, anafe, escurridor tallado en piedra).
   - **Botón directo a WhatsApp** con el mensaje pre-armado y codificado con el detalle de la cotización.

3. **Comparador Técnico de Materiales (Tabs Interactivos)**:
   - Matriz comparativa entre *Mármol Natural*, *Granito*, *Cuarzo Compacto*, *Sinterizado (Dekton)* y *Ónix*.
   - Barras visuales de resistencia térmica, al rayado y a los ácidos, con requerimientos de mantenimiento y pros/contras.

4. **Galería de Proyectos Filtrable & Modal Lightbox**:
   - Filtros instantáneos (*Todos*, *Cocinas*, *Baños*, *Quinchos*, *Especiales*).
   - Modal con ficha técnica detallada, materiales usados, tiempo de ejecución y llamada a la acción.

5. **Proceso de Trabajo en 4 Fases**:
   - 01. Relevamiento & Medición Láser In Situ.
   - 02. Selección de Placa & Render 3D.
   - 03. Corte CNC & Pulido Robotizado.
   - 04. Colocación Especializada & Sellado Hidrófugo.

6. **Social Proof & Testimonios**:
   - Reseñas de arquitectos y clientes particulares con valoración de 5 estrellas.

7. **Preguntas Frecuentes (Acordeón con Buscador en Vivo)**:
   - Despeja dudas clave sobre duración, diferencias de materiales, tiempos de colocación y cuidados.

8. **Formulario de Cotización Formal**:
   - Validación de campos y redirección automática hacia WhatsApp con todos los datos completados.

9. **Botón Flotante de WhatsApp**:
   - Burbuja con asesor en línea y tarjeta desplegable de chat rápido.

10. **Optimización SEO y Accesibilidad**:
    - Meta tags completos (OpenGraph, description, keywords).
    - Datos estructurados Schema.org (`HomeGoodsStore`) para posicionamiento local.
    - Estructura semántica HTML5 y navegación responsive mobile-first.

---

## 📁 Estructura del Proyecto

```
marmoleria-landing/
├── index.html          # Página principal con marcado semántico y Tailwind CSS
├── css/
│   └── custom.css      # Estilos de lujo, animaciones, sliders y glassmorphism
├── js/
│   └── main.js         # Lógica interactiva (calculadora, comparador, galería, modal, FAQ, WhatsApp)
└── README.md           # Documentación del proyecto
```

---

## 🚀 Cómo Ejecutar y Visualizar

### Opción 1: Abrir directamente en el navegador
Hacé doble clic en el archivo `index.html` en el Explorador de Windows o abrílo en tu navegador preferido (Chrome, Edge, Firefox, Safari). No requiere ningún paso de compilación ni instalación de paquetes.

### Opción 2: Servidor local ligero
Si tenés Python instalado:
```bash
python -m http.server 8000
```
O con Node.js / npx:
```bash
npx serve .
```
Luego abrí `http://localhost:8000` en tu navegador.

---

## ⚙️ Personalización Rápida

### Cambiar el número de WhatsApp
Buscá `5491155554321` en `index.html` y en `js/main.js` y reemplazalo por el número de WhatsApp de la marmolería (con código de país y área, sin signos `+` o `-`).

### Modificar precios base de la calculadora
En `js/main.js`, editá el objeto `MATERIAL_PRICING`:
```javascript
const MATERIAL_PRICING = {
  'granito-nacional': { name: 'Granito Nacional', basePrice: 180, tier: 'Económico' },
  'marmol-carrara': { name: 'Mármol Blanco Carrara', basePrice: 340, tier: 'Lujo Clásico' },
  // ...
};
```
