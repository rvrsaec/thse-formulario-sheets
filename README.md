# THSE Recorder · Formulario conectado a Google Sheets

**Página publicada: https://rvrsaec.github.io/thse-formulario-sheets/**

Landing de THSE Recorder para la fase de lanzamiento: presentación, **planes de suscripción**, tabla comparativa, preguntas frecuentes y formulario de acceso anticipado. Nació como práctica de una capacitación de Google Sheets: cada envío del formulario se guarda como una fila nueva en una hoja, usando **Google Apps Script** como API intermedia (sin servidor propio y sin claves en el navegador).

> Mientras el repositorio sea privado, GitHub Pages no publica la página (en una cuenta gratuita solo publica repositorios públicos). Se puede abrir `index.html` con doble clic.

```
Navegador (index.html)  ──POST──▶  Apps Script (/exec)  ──▶  Google Sheets
```

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La página completa: estilos, formulario y código en un solo archivo. Arriba del `<script>` está `SCRIPT_URL`, donde pegas la URL de tu Apps Script |
| `apps-script/Code.gs` | Recibe los datos y escribe en la hoja |

## Planes de suscripción

Cuatro niveles; cada uno suma lo anterior. Basados en las funciones ya implementadas en THSE Recorder Internal v1 y en el borrador comercial de `docs/ROADMAP.md` (repositorio de la app). Precios de referencia en USD.

| Nivel | Para quién | Mensual | Anual | Lo principal |
|---|---|---|---|---|
| **Gratis** | Probar con los primeros registros | $0 | $0 | 10 registros · 720p · Original y 16:9 · recorte · Looks None y Cinematic · FLD e INT · ficha TXT · biblioteca en el navegador con respaldo JSON · línea «RECORDED WITH THSE» en el HUD · 2 proyectos · papelera 3 días · 1 dispositivo |
| **Creador** (recomendado) | Publicar en redes (Instagram, TikTok, YouTube) | $5,99 | $48 (ahorra 33 %) | 20 registros al mes · 1080p · 16:9, 9:16 y 1:1 · recorte o barras · Looks None, Cinematic y Blue · los 4 tipos · ficha PDF y TXT · plantillas · biblioteca en tu propia carpeta · marca discreta en el HUD · 5 proyectos · los 4 tipos + 1 propio · 1 biblioteca · papelera 14 días · 2 dispositivos |
| **Pro** | Documentalistas y cineastas | $12,99 | $109 (ahorra 30 %) | Ilimitados · sin marca · los 7 formatos · fondo difuminado · los 5 Looks · 12 proyectos · los 4 tipos + 8 propios · 3 bibliotecas (+2 extra a $19,99, pago único) · ficha JSON · catálogo PDF · acciones en lote · papelera 30 días · 3 dispositivos · *pronto:* logo propio, 4K, campos personalizados, huella SHA-256 |
| **Equipo** (lista de espera) | Equipos, escuelas y laboratorios | $19,99 | $175 (ahorra 27 %) | Proyectos ilimitados · tipos propios sin límite · 5 bibliotecas (+ extra a $19,99, pago único) · 5 dispositivos · licencias para grupos · soporte prioritario · *pronto:* usuarios con biblioteca propia, perfiles de uso, compilar un proyecto |

Solo suscripción, mensual o anual (el anual se destaca por defecto). Si la suscripción vence, nada se borra ni se oculta: lo creado queda en modo lectura hasta renovar, y se pueden seguir agregando registros a los proyectos con las funciones del plan Gratis.

En todos los planes: proceso local (los videos nunca se suben), registro con código `CODE-AAAAMMDD-NNN`, respaldo JSON con recordatorios y papelera.

Los botones de cada plan llevan al formulario con ese plan ya elegido (campo `plan`). Los precios, límites y nombres se cambian directamente en `index.html` (tarjetas `.plan` y tabla `.compare`).

## Para participantes

1. Abre **https://rvrsaec.github.io/thse-formulario-sheets/** en el celular o el computador.
2. Completa el formulario y pulsa **Enviar solicitud**.
3. Si todo sale bien, aparece en verde **"Solicitud registrada"** con tu código `ACC-…`, y la fila llega a la hoja.

## Cómo se publica la página

La página se publica con **GitHub Pages** desde la rama `main`, carpeta raíz (**Settings → Pages**). Cada cambio que se sube a `index.html` se publica solo en uno o dos minutos.

También puedes usarla sin GitHub Pages: descarga `index.html` y ábrelo con doble clic. Para enviar el formulario se necesita conexión a internet.

Si `SCRIPT_URL` está vacía, la página funciona en **modo demostración**: el formulario se puede enviar, pero los datos no llegan a Google Sheets (se ven en la consola del navegador, F12). Sirve para practicar o para copiar la página a otro proyecto antes de conectarla.

## Conectar con Google Sheets

> Esta página **ya está conectada** a la hoja del taller. Estos pasos sirven para repetir la configuración con otra hoja o explicar cómo se hizo.

El script está configurado para esta hoja:
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
   - **Quién tiene acceso:** Cualquier usuario (no "Cualquier usuario con cuenta de Google")
4. Pulsa **Implementar** (si pide permisos de nuevo, autorízalos).
5. Copia la **URL de la aplicación web** (termina en `/exec`, con el botón **Copiar**). No uses el *ID de implementación* ni la URL de *Probar implementaciones*, que termina en `/dev`.

> Si abres esa URL en el navegador, debe mostrar `{"result":"ok", ...}` y qué columna de tu hoja recibe cada campo del formulario.

### 4. Pegar la URL en la página
Abre `index.html` con un editor de texto (Bloc de notas, VS Code), busca `SCRIPT_URL` y pega la URL entre las comillas:

```js
var SCRIPT_URL = "https://script.google.com/macros/s/XXXXXXXX/exec";
```

Guarda y sube el cambio al repositorio (o vuelve a abrir el archivo local). Envía el formulario y revisa tu hoja.

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
| `plan` | Plan | Plan de interés, Suscripción |
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

1. En `index.html`, agrega el campo dentro del formulario con un atributo `name`, por ejemplo `<input name="ciudad">`.
2. En `Code.gs`, agrega a `FIELDS`: `{ key: 'ciudad', header: 'Ciudad', aliases: ['comuna'] }`.
3. Publica una nueva versión (abajo). La columna se crea sola en el siguiente envío.

**Importante:** cada cambio en `Code.gs` requiere **Implementar → Gestionar implementaciones → Editar (lápiz) → Versión: Nueva versión → Implementar**. La URL no cambia.

## Problemas frecuentes

| Síntoma | Causa probable |
|---|---|
| "No se pudo enviar" | URL mal copiada, o el acceso no está en *Cualquier usuario* |
| La página publicada muestra la versión anterior | GitHub Pages tarda uno o dos minutos; recarga con `Ctrl + F5` |
| Cambié `Code.gs` y no se nota | Falta publicar una **nueva versión** de la implementación |
| Aparece una columna repetida al final | Tu encabezado tiene un nombre que el script no reconoce: agrégalo a `aliases` en `FIELDS` y borra la columna sobrante |
| "No existe la pestaña con gid=…" | `SHEET_GID` no coincide con el número `gid=` de la URL de tu pestaña |
| Error de CORS en la consola | No envíes JSON con `Content-Type: application/json`; la página usa formulario codificado a propósito |

## Seguridad

- El script se ejecuta con tu cuenta, pero solo **agrega filas** a esta hoja. La URL `/exec` muestra el nombre de la hoja y de sus columnas, nunca los datos.
- El repositorio es público: se ven el código, el ID de la hoja y la URL `/exec`. La hoja sigue privada; solo entra quien se invite desde **Compartir**. Con la URL `/exec` alguien podría agregar filas, pero no leerlas: si llega spam, bórralo o publica una implementación nueva y cambia `SCRIPT_URL`.
- Incluye un campo oculto anti-spam (*honeypot*) y un bloqueo para envíos simultáneos.
- Los valores que empiezan con `=`, `+`, `-` o `@` se guardan como texto para evitar inyección de fórmulas.
