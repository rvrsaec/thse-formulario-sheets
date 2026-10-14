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

El script ya está configurado para tu hoja:
[`1xc0QbNpt92GBnlFsgVmwLWI7gl7MX1lB_bVE1-Z886k`](https://docs.google.com/spreadsheets/d/1xc0QbNpt92GBnlFsgVmwLWI7gl7MX1lB_bVE1-Z886k/edit), primera pestaña (`gid=0`). Si cambias de hoja o de pestaña, edita `SPREADSHEET_ID` y `SHEET_GID` al inicio de `Code.gs`.

### 1. Agregar el Apps Script
1. Abre tu hoja y ve a **Extensiones → Apps Script**.
2. Borra el contenido de `Código.gs` y pega el contenido de [`apps-script/Code.gs`](apps-script/Code.gs).
3. Guarda (`Ctrl + S`).

### 2. Probar la conexión
1. Arriba, en el selector de funciones, elige **probarConexion** y pulsa **▶ Ejecutar**.
2. Autoriza los permisos. Si aparece "Google no verificó esta app": *Configuración avanzada → Ir a … (no seguro)*. Es tu propio script.
3. En el registro debe aparecer `Conectado a "…", pestaña "…"`. En la hoja, el script agrega al final de la fila 1 las columnas del formulario que falten.

### 3. Publicar como aplicación web
1. **Implementar → Nueva implementación**.
2. En *Seleccionar tipo* (ícono de engranaje) elige **Aplicación web**.
3. Configura:
   - **Ejecutar como:** Yo
   - **Quién tiene acceso:** Cualquier persona
4. Pulsa **Implementar** (si pide permisos de nuevo, autorízalos).
5. Copia la **URL de la aplicación web** (termina en `/exec`).

> Si abres esa URL en el navegador, debe mostrar `{"result":"ok", ...}` y qué columna de tu hoja recibe cada campo del formulario.

### 4. Pegar la URL en la página
Abre `index.html` con un editor de texto (Bloc de notas, VS Code), busca `SCRIPT_URL` y pega la URL entre las comillas:

```js
var SCRIPT_URL = "https://script.google.com/macros/s/XXXXXXXX/exec";
```

Guarda, vuelve a abrir la página, envía el formulario y revisa tu hoja.

## Columnas de la hoja

El script lee los encabezados de la fila 1 y busca la columna de cada campo por su nombre. No importa el orden, las mayúsculas ni las tildes, y acepta nombres alternativos:

| Campo del formulario | Encabezado que crea si falta | También reconoce |
|---|---|---|
| `fecha` | Fecha | Marca temporal, Timestamp, Fecha y hora |
| `solicitud` | Código solicitud | ID, Código, Folio, N° solicitud |
| `nombre` | Nombre | Nombre completo, Nombre y apellido, Participante |
| `email` | Correo | Correo electrónico, E-mail, Mail |
| `organizacion` | Organización | Empresa, Institución, Proyecto |
| `rol` | Rol | Cargo, Ocupación, Perfil |
| `tipo_registro` | Tipo de registro | Tipo, Registro |
| `uso` | Uso | ¿Qué te gustaría registrar?, Mensaje, Comentarios |
| `consentimiento` | Consentimiento | Acepta, Autorización |
| `pagina` | Página | Origen, URL |

- Si la hoja está vacía, crea todos los encabezados en ese orden.
- Si un campo no tiene columna, la agrega al final de la fila 1.
- Las columnas de tu hoja que no son del formulario quedan vacías en cada fila nueva.
- `solicitud` es un código con el estilo de los ID de registro de THSE Recorder: `ACC-AAAAMMDD-HHMMSS`.

Para que un encabezado tuyo se reconozca, agrégalo a `aliases` del campo en `FIELDS` (escrito en minúsculas y sin tildes).

## Agregar un campo nuevo

1. En `index.html`, agrega el campo con un atributo `name`, por ejemplo `<input name="ciudad">`. Para que salga en la vista previa, agrega `"ciudad"` a `HEADERS` y `"Ciudad"` a `LABELS` en el script de la página.
2. En `Code.gs`, agrega a `FIELDS`: `{ key: 'ciudad', header: 'Ciudad', aliases: ['comuna'] }`.
3. Publica una nueva versión (abajo). La columna se crea sola en el siguiente envío.

**Importante:** cada cambio en `Code.gs` requiere **Implementar → Gestionar implementaciones → Editar (lápiz) → Versión: Nueva versión → Implementar**. La URL no cambia.

## Problemas frecuentes

| Síntoma | Causa probable |
|---|---|
| "No se pudo enviar" | URL mal copiada, o el acceso no está en *Cualquier persona* |
| Cambié `Code.gs` y no se nota | Falta publicar una **nueva versión** de la implementación |
| Aparece una columna repetida al final | Tu encabezado tiene un nombre que el script no reconoce: agrégalo a `aliases` en `FIELDS` y borra la columna sobrante |
| "No existe la pestaña con gid=…" | `SHEET_GID` no coincide con el número `gid=` de la URL de tu pestaña |
| Error de CORS en la consola | No envíes JSON con `Content-Type: application/json`; la página usa formulario codificado a propósito |

## Seguridad

- El script se ejecuta con tu cuenta, pero solo **agrega filas** a esta hoja. La URL `/exec` muestra el nombre de la hoja y de sus columnas, nunca los datos.
- Incluye un campo oculto anti-spam (*honeypot*) y un bloqueo para envíos simultáneos.
- Los valores que empiezan con `=`, `+`, `-` o `@` se guardan como texto para evitar inyección de fórmulas.
