# THSE Recorder · Formulario conectado a Google Sheets

Página de práctica para una capacitación de Google Sheets, con la temática de THSE Recorder. Es una página de solicitud de acceso: cada envío del formulario se guarda como una fila nueva en una hoja de Google Sheets, usando **Google Apps Script** como API intermedia (sin servidor propio y sin claves en el navegador).

```
Navegador (index.html)  ──POST──▶  Apps Script (/exec)  ──▶  Google Sheets
```

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La página completa: estilos, formulario y código en un solo archivo. Arriba del `<script>` está `SCRIPT_URL`, donde pegas la URL de tu Apps Script |
| `apps-script/Code.gs` | Recibe los datos y escribe en la hoja |

## Cómo abrir la página

Descarga `index.html` y ábrelo con doble clic: se abre en tu navegador (Chrome, Edge, Firefox). No necesitas instalar nada.

Si `SCRIPT_URL` está vacía, la página funciona en **modo demostración**: el formulario se puede enviar y la fila aparece en la vista previa «Así llega a tu hoja», pero no llega a Google Sheets.

## Conectar con Google Sheets

### 1. Crear la hoja
1. Entra a [sheets.new](https://sheets.new) y ponle un nombre, por ejemplo *Solicitudes THSE*.
2. No hace falta crear columnas: el script crea la pestaña **Respuestas** con los encabezados en el primer envío.

### 2. Agregar el Apps Script
1. En la hoja: **Extensiones → Apps Script**.
2. Borra el contenido de `Código.gs` y pega el contenido de [`apps-script/Code.gs`](apps-script/Code.gs).
3. Guarda (`Ctrl + S`).

### 3. Publicar como aplicación web
1. **Implementar → Nueva implementación**.
2. En *Seleccionar tipo* (ícono de engranaje) elige **Aplicación web**.
3. Configura:
   - **Ejecutar como:** Yo
   - **Quién tiene acceso:** Cualquier persona
4. Pulsa **Implementar** y autoriza los permisos. Si aparece "Google no verificó esta app": *Configuración avanzada → Ir a … (no seguro)*. Es tu propio script.
5. Copia la **URL de la aplicación web** (termina en `/exec`).

> Si abres esa URL en el navegador, debe mostrar `{"result":"ok", ...}`.

### 4. Pegar la URL en la página
Abre `index.html` con un editor de texto (Bloc de notas, VS Code), busca `SCRIPT_URL` y pega la URL entre las comillas:

```js
var SCRIPT_URL = "https://script.google.com/macros/s/XXXXXXXX/exec";
```

Guarda, vuelve a abrir la página, envía el formulario y revisa la pestaña **Respuestas** de tu hoja.

## Columnas de la hoja

`fecha · solicitud · nombre · email · organizacion · rol · tipo_registro · uso · consentimiento · pagina`

La columna `solicitud` es un código con el estilo de los ID de registro de THSE Recorder: `ACC-AAAAMMDD-HHMMSS`.

## Agregar o cambiar campos

1. En `index.html`, agrega el campo con un atributo `name`, por ejemplo `<input name="ciudad">`, y agrega `"ciudad"` a la lista `HEADERS` del script de la página (solo afecta la vista previa).
2. En `Code.gs`, agrega `'ciudad'` a la lista `HEADERS`.
3. Agrega la columna `ciudad` en la fila 1 de la hoja (o borra la pestaña para que se vuelva a crear).
4. **Importante:** cada cambio en `Code.gs` requiere **Implementar → Gestionar implementaciones → Editar (lápiz) → Versión: Nueva versión → Implementar**. La URL no cambia.

## Problemas frecuentes

| Síntoma | Causa probable |
|---|---|
| "No se pudo enviar" | URL mal copiada, o el acceso no está en *Cualquier persona* |
| Cambié `Code.gs` y no se nota | Falta publicar una **nueva versión** de la implementación |
| Datos en columnas equivocadas | `HEADERS` de `Code.gs` no coincide con la fila 1 de la hoja |
| Error de CORS en la consola | No envíes JSON con `Content-Type: application/json`; la página usa formulario codificado a propósito |

## Seguridad

- El script se ejecuta con tu cuenta, pero solo **agrega filas** a esta hoja; la URL no permite leerla.
- Incluye un campo oculto anti-spam (*honeypot*) y un bloqueo para envíos simultáneos.
- Los valores que empiezan con `=`, `+`, `-` o `@` se guardan como texto para evitar inyección de fórmulas.
