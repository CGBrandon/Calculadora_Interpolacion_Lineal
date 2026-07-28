# Guía completa de la calculadora de interpolación lineal

Esta página está hecha en un solo archivo HTML llamado `Lineal.html`. Su funcionamiento se basa en tres partes principales:

- **HTML**: organiza la interfaz.
- **CSS**: define el diseño visual.
- **JavaScript**: realiza los cálculos y genera la gráfica.

---

## 1. ¿Qué utiliza esta página?

### Librerías externas

- **Google Fonts**
  - Se usa la fuente **Inter** para dar un estilo moderno y limpio.

- **Chart.js**
  - Es la librería que permite dibujar la gráfica.
  - Se carga desde un CDN en la sección `<head>` del archivo.

### Tecnologías internas

- **HTML**
  - Define los campos de entrada, el botón, el área de resultados y el contenedor de la gráfica.

- **CSS**
  - Crea el estilo visual minimalista, con colores claros, sombras suaves, efectos de vidrio y botones modernos.

- **JavaScript**
  - Lee los valores introducidos por el usuario.
  - Calcula la interpolación lineal.
  - Actualiza el resultado de manera dinámica.
  - Dibuja la gráfica en tiempo real.

---

## 2. Estructura general del archivo

La página está organizada así:

1. **Encabezado**
   - Muestra el título de la calculadora.
   - Incluye una breve descripción.

2. **Panel de parámetros**
   - Contiene los campos:
     - `x₁`, `y₁`
     - `x₂`, `y₂`
     - `x` (valor objetivo)
   - También contiene el botón para calcular.

3. **Panel de gráfica**
   - Tiene un elemento `canvas` donde Chart.js dibuja la línea y el punto interpolado.

---

## 3. Diseño visual

El CSS le da a la página un aspecto elegante tipo Apple minimalista.

### Características del diseño

- **Colores claros** y suaves.
- **Tarjetas con efecto glass**.
- **Sombras sutiles** para profundidad.
- **Botones con estilo moderno**.
- **Fondo decorativo con círculos difuminados**.

### Variables CSS

Se usan variables como:

- `--apple-bg`: color de fondo.
- `--apple-card-bg`: fondo de las tarjetas.
- `--apple-accent`: color azul principal.
- `--apple-text-primary`: color de texto principal.
- `--apple-text-secondary`: color de texto secundario.

Estas variables hacen que el diseño sea más fácil de mantener.

---

## 4. ¿Cómo funciona el script?

El script está dentro de la etiqueta `<script>` al final del archivo.

### Variable principal

```js
let graficaInterpolacion = null;
```

Esta variable guarda la instancia de la gráfica actual. Sirve para destruir la gráfica anterior antes de crear una nueva.

---

## 5. Función `cargarEjemplo()`

```js
function cargarEjemplo() {
    document.getElementById('x1').value = 2;
    document.getElementById('y1').value = 10;
    document.getElementById('x2').value = 8;
    document.getElementById('y2').value = 40;
    document.getElementById('x').value = 5;
    calcular();
}
```

### ¿Qué hace?

- Llena los campos con valores de ejemplo.
- Luego llama a la función `calcular()`.

Esto permite que la página muestre un resultado y una gráfica al cargarla por primera vez.

---

## 6. Función `calcular()`

Esta es la función más importante de la calculadora.

### Paso 1: leer los valores

El script toma los datos de los inputs con `parseFloat(...)`:

```js
let x1 = parseFloat(document.getElementById('x1').value);
let y1 = parseFloat(document.getElementById('y1').value);
let x2 = parseFloat(document.getElementById('x2').value);
let y2 = parseFloat(document.getElementById('y2').value);
let x = parseFloat(document.getElementById('x').value);
```

Esto convierte el texto ingresado por el usuario en números reales.

### Paso 2: validar datos

El código comprueba si los campos están vacíos o si alguno no es un número.

```js
if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2) || isNaN(x)) {
    contenedorResultado.innerHTML = '<div class="error-msg">Por favor llena todos los campos con valores numéricos.</div>';
    return;
}
```

También verifica que `x₁` y `x₂` no sean iguales, porque eso produciría una división entre cero.

```js
if (x1 === x2) {
    contenedorResultado.innerHTML = '<div class="error-msg">Error: x₁ y x₂ no pueden ser iguales (división entre cero).</div>';
    return; 
}
```

### Paso 3: aplicar la fórmula de interpolación lineal

La fórmula usada es:

$$
 y = y_1 + \frac{(x - x_1)(y_2 - y_1)}{x_2 - x_1}
$$

Y la pendiente se calcula así:

$$
 m = \frac{y_2 - y_1}{x_2 - x_1}
$$

En el código se escribe así:

```js
let m = (y2 - y1) / (x2 - x1);
let y = y1 + m * (x - x1);
```

### Paso 4: mostrar el resultado

El resultado se inserta dinámicamente en el HTML:

```js
contenedorResultado.innerHTML = `
    <div class="result-container">
        <div class="result-label">Resultado Interpolado (y)</div>
        <div class="result-value">${y.toLocaleString('es-ES', { maximumFractionDigits: 4 })}</div>
        <div class="result-details">
            <span>Pendiente (m): <strong>${m.toFixed(4)}</strong></span>
            <span>Punto: <strong>(${x}, ${y.toFixed(2)})</strong></span>
        </div>
    </div>
`;
```

Esto muestra:

- el valor interpolado de `y`
- la pendiente `m`
- el punto calculado `(x, y)`

---

## 7. ¿Cómo funciona la gráfica?

La gráfica se genera con **Chart.js** usando un tipo de gráfico llamado `scatter`.

### ¿Qué dibuja?

- El primer punto: `(x₁, y₁)`
- El segundo punto: `(x₂, y₂)`
- Un punto adicional: `(x, y)` que es el valor interpolado

### Estructura de la gráfica

El script crea dos datasets:

1. **Línea de referencia**
   - representa los datos originales de los dos puntos conocidos.
   - se une con una línea azul.

2. **Punto interpolado**
   - representa el valor estimado.
   - aparece como un punto rojo.

### Código principal

```js
graficaInterpolacion = new Chart(ctx, {
    type: 'scatter',
    data: {
        datasets: [
            {
                label: 'Línea de Referencia',
                data: [ {x: x1, y: y1}, {x: x2, y: y2} ],
                borderColor: '#0071E3',
                backgroundColor: '#0071E3',
                borderWidth: 3,
                showLine: true,
                pointRadius: 6
            },
            {
                label: 'Punto Interpolado',
                data: [ {x: x, y: y} ],
                borderColor: '#FF3B30',
                backgroundColor: '#FF3B30',
                pointRadius: 9
            }
        ]
    }
});
```

### ¿Por qué se destruye la gráfica anterior?

```js
if (graficaInterpolacion !== null) {
    graficaInterpolacion.destroy();
}
```

Esto evita que se acumulen varias gráficas en la pantalla y garantiza que solo haya una activa a la vez.

---

## 8. ¿Qué pasa al cargar la página?

Al final del script se añade este evento:

```js
window.addEventListener('DOMContentLoaded', () => {
    cargarEjemplo();
});
```

### ¿Qué significa?

- Cuando el navegador termina de cargar el HTML,
- se ejecuta `cargarEjemplo()`.

Por eso la calculadora aparece lista desde el inicio con valores de ejemplo.

---

## 9. Resumen simple del funcionamiento

1. El usuario ingresa los valores de los puntos.
2. El botón ejecuta `calcular()`.
3. El script valida los datos.
4. Calcula la pendiente y el valor interpolado.
5. Muestra el resultado en pantalla.
6. Genera la gráfica con Chart.js.

---

## 10. En pocas palabras

Esta calculadora funciona así:

- **HTML** organiza la interfaz.
- **CSS** le da su diseño moderno.
- **JavaScript** hace la matemática.
- **Chart.js** dibuja la gráfica.

La parte clave es la función `calcular()`, porque ahí se aplica la fórmula de interpolación lineal y se actualiza la visualización.

Si quieres, también puedo convertir esta guía en un archivo Markdown más profesional, con formato tipo documentación técnica o con secciones más detalladas para presentación.
