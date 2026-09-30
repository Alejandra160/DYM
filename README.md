# DYM Systems — sitio web

Landing page de DYM Systems (insygt + MARKO), construida con **Tailwind CSS** y JS plano.

## Estructura de carpetas

```
DYM/
├─ index.html              # Página principal (usa clases de Tailwind)
├─ assets/
│  └─ images/
│     └─ logo-dym.png      # Logo DYM
├─ src/
│  ├─ css/
│  │  └─ input.css         # Fuente de Tailwind: tema (colores/fuentes) + componentes
│  └─ js/
│     └─ main.js           # Carrusel de Verticales + tabs de FAQ
├─ dist/
│  └─ css/
│     └─ style.css         # CSS compilado (generado, no editar a mano)
├─ tools/
│  └─ tailwindcss.exe      # CLI standalone de Tailwind (no requiere Node/npm)
└─ build.ps1                # Script para compilar el CSS
```

## Cómo editar el sitio

1. Cambia clases directamente en `index.html` (son utilidades de Tailwind: `flex`, `grid`, `text-xl`, colores como `bg-navy-deep`, `text-gold`, etc.).
2. Si necesitas un color/fuente nuevo de marca, agrégalo en el bloque `@theme` de `src/css/input.css`.
3. Si necesitas un componente reutilizable (botón, tarjeta, etc.) que no se puede armar solo con utilidades, agrégalo en `@layer components` de ese mismo archivo.
4. Después de cualquier cambio en `src/css/input.css`, recompila:

```powershell
.\build.ps1
```

O para que recompile automáticamente mientras editas:

```powershell
.\build.ps1 -Watch
```

5. El JS del carrusel y las tabs de FAQ vive en `src/js/main.js` — no necesita build, solo recargar la página.

## Abrir el sitio

Solo abre `index.html` directamente en el navegador (doble clic o `start index.html`). No requiere servidor ni Node.js instalado.
