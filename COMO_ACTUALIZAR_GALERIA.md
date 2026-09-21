# Actualizar la galería

La galería se construye automáticamente desde estas carpetas:

- `img/galeria/antiguas/`
- `img/galeria/2026/<mes>/`

Después de copiar fotos nuevas, ejecuta desde la carpeta del proyecto:

```powershell
node .\generar-galeria.js
```

## Editar descripciones

Edita el archivo `descripciones-fotos.json`. Las fotos están separadas en bloques con encabezados como `#Fotos Reconocimientos`, `#Fotos galeria 2026 agosto`, `#Fotos galeria 2026 septiembre` y `#Fotos galeria antiguas`. La web solo muestra `description`.

Ejemplo:

```json
"img/galeria/2026/septiembre/mi-foto.jpg": {
	"description": "Presentación de la Tuna UNI durante septiembre de 2026."
}
```

Después ejecuta nuevamente `node .\generar-galeria.js`.

El comando actualiza `js/gallery-data.js`. Ese archivo debe publicarse junto con `Galeria.html` y las carpetas de imágenes.

Se reconocen archivos `.jpg`, `.jpeg`, `.png`, `.webp` y `.gif`. Los nombres de las fotos se usan como descripción del visor. Las carpetas vacías no aparecen en la página.
