# 📐 Calculadora de Interpolación Lineal

> Herramienta web interactiva para calcular, visualizar y comprender la interpolación lineal.

**Autores:** Brandon Uriel Calixto García · Kevin Avendaño Ramírez  
**Universidad Tecnológica de Tula-Tepeji**

---

## ✨ Características

- 📜 **Sección de Historia** — Línea de tiempo con imágenes de los personajes que desarrollaron la interpolación lineal (Ptolomeo, Brahmagupta, Kepler, Newton, etc.)
- 📐 **Sección de Fórmula** — Visualización clara de la fórmula con sus variables, derivación geométrica y condiciones de validez
- 💡 **Sección Cómo Usarla** — Pasos detallados y ejemplo resuelto paso a paso
- 🧮 **Calculadora interactiva** con:
  - Tabla de datos dinámica (sin límite de puntos)
  - Selección **automática e inteligente** del par de puntos más conveniente
  - Detección de interpolación vs. extrapolación
  - Control libre de decimales (sin límite)
  - Gráfica interactiva con **Chart.js**
  - Resaltado visual de los puntos utilizados

---

## 📁 Estructura del proyecto

```
interpolacion-lineal/
├── Lineal.html          # Estructura principal de la página
├── css/
│   └── lineal.css       # Todos los estilos (variables globales + componentes)
├── js/
│   └── lineal.js        # Toda la lógica de cálculo y visualización
├── img/
│   ├── ReglamentosUT.jpg        # Banner de la universidad
│   ├── historia_babilonia.png   # Imagen: tablilla cuneiforme
│   ├── historia_ptolomeo.png    # Imagen: Ptolomeo
│   ├── historia_brahmagupta.png # Imagen: Brahmagupta
│   ├── historia_kepler.png      # Imagen: Kepler
│   ├── historia_newton.png      # Imagen: Newton
│   └── historia_digital.png     # Imagen: Era Digital
└── README.md
```

---

## 🚀 Uso

1. Clona el repositorio:
   ```bash
   git clone https://github.com/TU_USUARIO/interpolacion-lineal.git
   ```
2. Abre `Lineal.html` directamente en tu navegador — **no requiere servidor ni dependencias**.

> Las únicas dependencias externas son **Google Fonts** y **Chart.js**, ambas cargadas por CDN.

---

## 🧮 ¿Cómo funciona la calculadora?

1. Ingresa tus puntos (X, Y) en la tabla — puedes agregar los que necesites
2. Escribe el valor de **X** que deseas interpolar
3. El programa **selecciona automáticamente** el par de puntos más cercano
4. Aplica la fórmula:

$$y = y_1 + (x - x_1) \cdot \frac{y_2 - y_1}{x_2 - x_1}$$

5. Muestra el resultado y lo grafica visualmente

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 semántico | Estructura de la página |
| CSS3 + Variables CSS | Diseño, temas, glassmorphism |
| JavaScript (Vanilla) | Lógica de interpolación y DOM |
| [Chart.js](https://www.chartjs.org/) | Gráfica interactiva |
| [Google Fonts — Inter](https://fonts.google.com/specimen/Inter) | Tipografía |

---

## 📄 Licencia

MIT © 2025 — Brandon Uriel Calixto García & Kevin Avendaño Ramírez
