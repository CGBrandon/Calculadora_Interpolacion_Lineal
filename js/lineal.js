/* ═══════════════════════════════════════════════════════════
   INTERPOLACIÓN LINEAL — Lógica JavaScript
   Autores: Brandon Uriel Calixto García · Kevin Avendaño Ramírez
   ═══════════════════════════════════════════════════════════ */

/* ────────────────────────────────────────────────────────────
   1. ESTADO GLOBAL Y CONFIGURACIÓN
   ──────────────────────────────────────────────────────────── */

/** Número actual de filas en la tabla de datos */
let numFilas = 5;

/** Referencia a la instancia de Chart.js activa (para destruirla antes de redibujar) */
let graficaInterpolacion = null;

/** Mínimo de puntos requeridos (necesitas al menos 2 para interpolar) */
const MIN_FILAS = 2;

/**
 * Retorna el número de decimales ingresado por el usuario.
 * Acepta cualquier entero ≥ 0. Si el campo está vacío o es inválido, usa 4.
 * @returns {number}
 */
function getDecimals() {
    const el = document.getElementById('decimals-select');
    const raw = parseInt(el?.value, 10);
    if (isNaN(raw) || raw < 0) return 4;
    return raw;
}

/**
 * Formatea un número con los decimales configurados.
 * @param {number} valor
 * @param {number} [decimals] - Opcional: sobreescribe la selección del usuario.
 * @returns {string}
 */
function fmt(valor, decimals) {
    const d = decimals !== undefined ? decimals : getDecimals();
    return valor.toFixed(d);
}

/* ────────────────────────────────────────────────────────────
   2. CONTROL DE DECIMALES
   ──────────────────────────────────────────────────────────── */

/**
 * Actualiza el texto de vista previa junto al selector de decimales.
 * Se llama cada vez que el usuario cambia el selector.
 */
function actualizarPreviewDecimales() {
    const d = getDecimals();
    const ejemplo = (12).toFixed(d);
    const el = document.getElementById('decimals-preview');
    if (el) el.textContent = `Ej: ${ejemplo}`;
}

/* ────────────────────────────────────────────────────────────
   3. NAVEGACIÓN POR PESTAÑAS
   ──────────────────────────────────────────────────────────── */

/**
 * Muestra la sección del tab solicitado y activa el botón correspondiente.
 * @param {string} id - ID de la sección (ej: 'tab-calc')
 */
function showTab(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    const btnId = 'btn-' + id.replace('tab-', '');
    document.getElementById(btnId).classList.add('active');
}

/* ────────────────────────────────────────────────────────────
   4. GENERACIÓN DINÁMICA DE LA TABLA
   ──────────────────────────────────────────────────────────── */

/**
 * Regenera el cuerpo de la tabla de datos respetando los valores
 * ya ingresados por el usuario (no los borra al agregar/quitar filas).
 */
function generarTabla() {
    const tbody = document.getElementById('table-body');
    const inputFilas = document.getElementById('count-display');
    if (inputFilas) inputFilas.value = numFilas;

    // Guardar valores antes de vaciar el DOM
    const valores = [];
    tbody.querySelectorAll('tr').forEach(tr => {
        const inputs = tr.querySelectorAll('input');
        valores.push({
            x: inputs[0]?.value || '',
            y: inputs[1]?.value || ''
        });
    });

    tbody.innerHTML = '';

    for (let i = 0; i < numFilas; i++) {
        const tr = document.createElement('tr');
        const vx = valores[i]?.x || '';
        const vy = valores[i]?.y || '';
        tr.innerHTML = `
            <td class="row-num">${i + 1}</td>
            <td>
                <input type="number" class="tbl-input input-x"
                       id="px${i}" placeholder="-" step="any" value="${vx}">
            </td>
            <td>
                <input type="number" class="tbl-input input-y"
                       id="py${i}" placeholder="-" step="any" value="${vy}">
            </td>
        `;
        tbody.appendChild(tr);
    }
}

/**
 * Cambia el número de filas en ±1. Solo aplica el mínimo de 2 (sin límite superior).
 * @param {number} delta - +1 agrega, -1 quita.
 */
function cambiarFilas(delta) {
    const nuevo = numFilas + delta;
    if (nuevo < MIN_FILAS) return;
    numFilas = nuevo;
    generarTabla();
}

/**
 * Permite ingresar el número de filas directamente en el input.
 * Acepta cualquier entero ≥ 2.
 */
function establecerFilas() {
    const el = document.getElementById('count-display');
    const raw = parseInt(el?.value, 10);
    if (isNaN(raw) || raw < MIN_FILAS) {
        el.value = numFilas; // restaurar si el valor es inválido
        return;
    }
    numFilas = raw;
    generarTabla();
}

/* ────────────────────────────────────────────────────────────
   5. EJEMPLO PREDEFINIDO
   ──────────────────────────────────────────────────────────── */

/**
 * Carga un conjunto de datos de ejemplo y calcula la interpolación.
 */
function cargarEjemplo() {
    const datos = [
        { x: 0, y: 0 },
        { x: 5, y: 12.5 },
        { x: 10, y: 25 },
        { x: 15, y: 37.5 },
        { x: 20, y: 50 },
    ];
    numFilas = datos.length;
    generarTabla();
    datos.forEach((p, i) => {
        document.getElementById(`px${i}`).value = p.x;
        document.getElementById(`py${i}`).value = p.y;
    });
    document.getElementById('x-target').value = 12;
    calcular();
}

/* ────────────────────────────────────────────────────────────
   6. LECTURA Y VALIDACIÓN DE DATOS
   ──────────────────────────────────────────────────────────── */

/**
 * Lee los valores de la tabla, descarta filas incompletas o no numéricas,
 * y retorna los puntos ordenados por X ascendente.
 * @returns {Array<{x: number, y: number}>}
 */
function obtenerPuntos() {
    const puntos = [];
    for (let i = 0; i < numFilas; i++) {
        const xv = document.getElementById(`px${i}`)?.value;
        const yv = document.getElementById(`py${i}`)?.value;
        const xn = parseFloat(xv);
        const yn = parseFloat(yv);
        if (xv !== '' && yv !== '' && !isNaN(xn) && !isNaN(yn)) {
            puntos.push({ x: xn, y: yn });
        }
    }
    puntos.sort((a, b) => a.x - b.x);
    return puntos;
}

/* ────────────────────────────────────────────────────────────
   7. SELECCIÓN INTELIGENTE DE PUNTOS
   ──────────────────────────────────────────────────────────── */

/**
 * Dado un arreglo de puntos y un valor xTarget, determina el par
 * (P1, P2) más conveniente para interpolar:
 *
 * - Si xTarget está DENTRO del rango → P1 = inmediato anterior, P2 = inmediato posterior.
 * - Si xTarget coincide exactamente con un punto → devuelve { exacto }.
 * - Si xTarget está FUERA del rango → extrapolación con los dos extremos más cercanos.
 *
 * @param {Array<{x: number, y: number}>} puntos - Puntos ordenados por x.
 * @param {number} xTarget
 * @returns {{ p1, p2, exacto?: object, extrapolacion?: string } | null}
 */
function seleccionarPuntos(puntos, xTarget) {
    if (puntos.length < 2) return null;

    const menores = puntos.filter(p => p.x <= xTarget);
    const mayores = puntos.filter(p => p.x >= xTarget);

    if (menores.length > 0 && mayores.length > 0) {
        const p1 = menores[menores.length - 1]; // mayor de los menores
        const p2 = mayores[0];                  // menor de los mayores

        // Coincidencia exacta
        if (p1.x === p2.x) {
            const idx = puntos.indexOf(p1);
            const siguiente = puntos[Math.min(idx + 1, puntos.length - 1)];
            return { p1, p2: siguiente, exacto: p1 };
        }
        return { p1, p2, exacto: null };
    }

    // Extrapolación izquierda
    if (menores.length === 0) {
        return { p1: puntos[0], p2: puntos[1], extrapolacion: 'izquierda' };
    }
    // Extrapolación derecha
    return {
        p1: puntos[puntos.length - 2],
        p2: puntos[puntos.length - 1],
        extrapolacion: 'derecha'
    };
}

/* ────────────────────────────────────────────────────────────
   8. CÁLCULO PRINCIPAL DE INTERPOLACIÓN
   ──────────────────────────────────────────────────────────── */

/**
 * Función principal. Lee datos, valida, selecciona puntos,
 * calcula la interpolación y actualiza la UI (resultado + gráfica).
 */
function calcular() {
    const contenedor = document.getElementById('resultado');
    const xTarget = parseFloat(document.getElementById('x-target').value);
    const d = getDecimals();   // decimales seleccionados

    // ── Validar X objetivo ──
    if (isNaN(xTarget)) {
        mostrarError(contenedor, 'Ingresa el valor de X a interpolar.');
        return;
    }

    const puntos = obtenerPuntos();

    // ── Validar cantidad de puntos ──
    if (puntos.length < 2) {
        mostrarError(contenedor, 'Ingresa al menos 2 puntos válidos (X e Y) en la tabla.');
        return;
    }

    // ── Validar X duplicados ──
    const xs = puntos.map(p => p.x);
    const xSet = new Set(xs);
    if (xs.length !== xSet.size) {
        mostrarError(contenedor, 'Hay valores de X duplicados. Cada X debe ser único.');
        return;
    }

    // ── Seleccionar par de puntos ──
    const seleccion = seleccionarPuntos(puntos, xTarget);
    if (!seleccion) {
        mostrarError(contenedor, 'No se pudo seleccionar un par de puntos válido.');
        return;
    }

    const { p1, p2, exacto, extrapolacion } = seleccion;
    let y, m, resultadoHTML;

    // ── Caso: valor exacto en tabla ──
    if (exacto) {
        y = exacto.y;
        m = 0;
        resultadoHTML = `
            <div class="result-box success">
                <div class="result-label">✨ Valor Exacto Encontrado</div>
                <div class="result-value">${fmt(y, d)}</div>
                <div class="result-meta">
                    <span>x = <strong>${fmt(xTarget, d)}</strong> coincide con un punto exacto de la tabla</span>
                </div>
            </div>`;

        // ── Caso: interpolación / extrapolación ──
    } else {
        m = (p2.y - p1.y) / (p2.x - p1.x);
        y = p1.y + m * (xTarget - p1.x);

        const esExtrapolacion = Boolean(extrapolacion);
        const tipoTexto = esExtrapolacion
            ? '⚠️ Extrapolación — x está fuera del rango de datos'
            : '✅ Interpolación — x está dentro del rango de datos';
        const colorResultado = esExtrapolacion ? 'var(--orange)' : 'var(--green)';
        const tipoClase = esExtrapolacion ? 'error' : 'success';
        const tipoLabel = esExtrapolacion ? '⚠️ Resultado Extrapolado' : '✅ Resultado Interpolado';

        resultadoHTML = `
            <div class="result-box ${tipoClase}">
                <div class="result-label">${tipoLabel}</div>
                <div class="result-value" style="color: ${colorResultado};">${fmt(y, d)}</div>
                <div class="result-meta">
                    <span>Punto hallado: <strong>(${fmt(xTarget, d)}, ${fmt(y, d)})</strong></span>
                </div>
                <div class="selected-points-info">
                    <strong>📌 Puntos seleccionados automáticamente:</strong><br>
                    P₁ = (${fmt(p1.x, d)}, ${fmt(p1.y, d)})
                    &nbsp;·&nbsp;
                    P₂ = (${fmt(p2.x, d)}, ${fmt(p2.y, d)})<br>
                    <span style="color: var(--text-secondary); font-size: 11px;">${tipoTexto}</span>
                </div>
            </div>`;
    }

    contenedor.innerHTML = resultadoHTML;

    // ── Resaltar filas utilizadas ──
    resaltarFilas(p1, p2);

    // ── Dibujar gráfica ──
    dibujarGrafica(puntos, p1, p2, xTarget, y, extrapolacion);
}

/**
 * Muestra un mensaje de error en el contenedor de resultado.
 * @param {HTMLElement} contenedor
 * @param {string} mensaje
 */
function mostrarError(contenedor, mensaje) {
    contenedor.innerHTML = `
        <div class="result-box error">
            <div class="result-label">Error</div>
            <div class="result-value error-val">${mensaje}</div>
        </div>`;
}

/**
 * Resalta en verde las filas de la tabla que corresponden a P1 y P2.
 * @param {{ x: number }} p1
 * @param {{ x: number }} p2
 */
function resaltarFilas(p1, p2) {
    document.querySelectorAll('.tbl-input').forEach(el => el.classList.remove('highlight-row'));
    for (let i = 0; i < numFilas; i++) {
        const xv = parseFloat(document.getElementById(`px${i}`)?.value);
        if (xv === p1.x || xv === p2.x) {
            document.getElementById(`px${i}`)?.classList.add('highlight-row');
            document.getElementById(`py${i}`)?.classList.add('highlight-row');
        }
    }
}

/* ────────────────────────────────────────────────────────────
   9. GRÁFICA CON CHART.JS
   ──────────────────────────────────────────────────────────── */

/**
 * Destruye la gráfica anterior (si existe) y dibuja una nueva con:
 *  - Todos los puntos de la tabla
 *  - El segmento lineal entre P1 y P2 (ligeramente extendido)
 *  - Los puntos P1 y P2 seleccionados (destacados)
 *  - El punto interpolado / extrapolado (color verde o naranja)
 *
 * @param {Array<{x,y}>}  puntos       - Todos los puntos de la tabla.
 * @param {{x,y}}         p1           - Primer punto del segmento.
 * @param {{x,y}}         p2           - Segundo punto del segmento.
 * @param {number}        xTarget      - Valor X interpolado.
 * @param {number}        yInterp      - Valor Y calculado.
 * @param {string|null}   extrapolacion - Si hay extrapolación, su dirección.
 */
function dibujarGrafica(puntos, p1, p2, xTarget, yInterp, extrapolacion) {
    if (graficaInterpolacion) graficaInterpolacion.destroy();

    const ctx = document.getElementById('miGrafica').getContext('2d');
    const d = getDecimals();

    // Extender la línea un 15 % a cada lado del segmento
    const ext = (p2.x - p1.x) * 0.15;
    const linX1 = p1.x - ext;
    const linX2 = p2.x + ext;
    const m = (p2.y - p1.y) / (p2.x - p1.x);
    const linY1 = p1.y + m * (linX1 - p1.x);
    const linY2 = p1.y + m * (linX2 - p1.x);

    const colorInterp = extrapolacion ? '#FF9500' : '#34C759';

    graficaInterpolacion = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                /* Dataset 1: Todos los puntos de la tabla */
                {
                    label: 'Datos de la tabla',
                    data: puntos.map(p => ({ x: p.x, y: p.y })),
                    borderColor: 'rgba(0,122,255,0.50)',
                    backgroundColor: 'rgba(0,122,255,0.15)',
                    pointRadius: 7,
                    pointHoverRadius: 9,
                    pointBorderColor: '#007AFF',
                    pointBorderWidth: 2,
                    showLine: false,
                },
                /* Dataset 2: Segmento lineal extendido */
                {
                    label: 'Segmento lineal (P₁–P₂)',
                    data: [{ x: linX1, y: linY1 }, { x: linX2, y: linY2 }],
                    borderColor: '#007AFF',
                    backgroundColor: 'transparent',
                    borderWidth: 2.5,
                    borderDash: [6, 3],
                    showLine: true,
                    pointRadius: 0,
                },
                /* Dataset 3: Puntos P1 y P2 seleccionados */
                {
                    label: 'Puntos seleccionados',
                    data: [{ x: p1.x, y: p1.y }, { x: p2.x, y: p2.y }],
                    borderColor: '#007AFF',
                    backgroundColor: '#007AFF',
                    pointRadius: 10,
                    pointHoverRadius: 12,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 3,
                    showLine: false,
                },
                /* Dataset 4: Punto interpolado / extrapolado */
                {
                    label: extrapolacion ? 'Punto extrapolado' : 'Punto interpolado',
                    data: [{ x: xTarget, y: yInterp }],
                    borderColor: colorInterp,
                    backgroundColor: colorInterp,
                    pointRadius: 12,
                    pointHoverRadius: 14,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 3,
                    showLine: false,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 16,
                        font: { family: 'Inter', size: 12, weight: '500' },
                        color: '#1C1C1E'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(28,28,30,0.88)',
                    titleFont: { family: 'Inter', size: 13, weight: '600' },
                    bodyFont: { family: 'Inter', size: 12 },
                    padding: 12,
                    cornerRadius: 10,
                    displayColors: false,
                    callbacks: {
                        label: ctx => {
                            const xv = typeof ctx.raw.x === 'number' ? fmt(ctx.raw.x, d) : ctx.raw.x;
                            const yv = typeof ctx.raw.y === 'number' ? fmt(ctx.raw.y, d) : ctx.raw.y;
                            return `(${xv}, ${yv})`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    grid: { color: 'rgba(0,0,0,0.04)' },
                    ticks: { font: { family: 'Inter', size: 11 }, color: '#6C6C70' },
                    title: { display: true, text: 'Eje X', font: { family: 'Inter', size: 12, weight: '500' }, color: '#6C6C70' }
                },
                y: {
                    grid: { color: 'rgba(0,0,0,0.04)' },
                    ticks: { font: { family: 'Inter', size: 11 }, color: '#6C6C70' },
                    title: { display: true, text: 'Eje Y', font: { family: 'Inter', size: 12, weight: '500' }, color: '#6C6C70' }
                }
            }
        }
    });
}

/* ────────────────────────────────────────────────────────────
   10. INICIALIZACIÓN
   ──────────────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
    generarTabla();
    actualizarPreviewDecimales();
    cargarEjemplo();
});
