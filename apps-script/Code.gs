/**
 * THSE Recorder · Solicitudes de acceso → Google Sheets
 *
 * Recibe los datos del formulario (index.html) y los agrega como una fila
 * nueva en la hoja indicada abajo.
 *
 * El script lee los encabezados de la fila 1 y pone cada dato en la columna
 * que corresponde, aunque las columnas estén en otro orden o con otro nombre
 * (por ejemplo "Correo electrónico" en vez de "email"). Si un dato del
 * formulario no tiene columna, crea una al final para no perderlo.
 */

// Hoja de destino: el ID es la parte de la URL entre /d/ y /edit.
var SPREADSHEET_ID = '1xc0QbNpt92GBnlFsgVmwLWI7gl7MX1lB_bVE1-Z886k';
// Pestaña de destino: el número que aparece después de "gid=" en la URL.
var SHEET_GID = 0;

// Campos que envía el formulario, en el orden en que se crean las columnas
// si la hoja está vacía. Cada campo acepta varios nombres de encabezado.
var FIELDS = [
  { key: 'fecha',          header: 'Fecha',             aliases: ['marca temporal', 'timestamp', 'fecha y hora', 'fecha de envio'] },
  { key: 'solicitud',      header: 'Código solicitud',  aliases: ['id', 'codigo', 'id solicitud', 'n solicitud', 'folio'] },
  { key: 'nombre',         header: 'Nombre',            aliases: ['nombre completo', 'nombre y apellido', 'participante'] },
  { key: 'email',          header: 'Correo',            aliases: ['correo electronico', 'e-mail', 'mail'] },
  { key: 'organizacion',   header: 'Organización',      aliases: ['organizacion o proyecto', 'empresa', 'institucion', 'proyecto'] },
  { key: 'rol',            header: 'Rol',               aliases: ['cargo', 'ocupacion', 'perfil'] },
  { key: 'plan',           header: 'Plan',              aliases: ['plan de interes', 'plan que te interesa', 'suscripcion'] },
  { key: 'tipo_registro',  header: 'Tipo de registro',  aliases: ['tipo', 'tipo registro', 'registro'] },
  { key: 'uso',            header: 'Uso',               aliases: ['que te gustaria registrar', 'mensaje', 'comentarios', 'descripcion'] },
  { key: 'consentimiento', header: 'Consentimiento',    aliases: ['acepta', 'autorizacion'] },
  { key: 'pagina',         header: 'Página',            aliases: ['origen', 'url'] }
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000); // evita que dos envíos simultáneos se pisen

  try {
    var params = (e && e.parameter) || {};

    // Campo trampa: si viene lleno, es un bot. Respondemos OK sin guardar.
    if (params.website) return json({ result: 'success' });

    if (!params.nombre || !params.email) {
      return json({ result: 'error', error: 'Faltan campos obligatorios' });
    }

    var sheet = getSheet();
    var columns = mapColumns(sheet);
    var row = [];
    for (var i = 0; i < sheet.getLastColumn(); i++) row.push('');
    FIELDS.forEach(function (field) {
      row[columns[field.key]] = field.key === 'fecha' ? new Date() : clean(params[field.key]);
    });
    sheet.appendRow(row);

    return json({ result: 'success', row: sheet.getLastRow() });
  } catch (err) {
    return json({ result: 'error', error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Abre la URL /exec en el navegador para comprobar la conexión y ver qué
// columna de la hoja recibe cada campo del formulario.
function doGet() {
  var sheet = getSheet();
  var columns = mapColumns(sheet);
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var mapa = {};
  FIELDS.forEach(function (f) { mapa[f.key] = headers[columns[f.key]]; });
  return json({ result: 'ok', hoja: sheet.getParent().getName(), pestana: sheet.getName(), columnas: mapa });
}

// Ejecútala una vez desde el editor (botón ▶ Ejecutar) para autorizar el
// script y preparar los encabezados que falten antes de publicar.
function probarConexion() {
  var sheet = getSheet();
  mapColumns(sheet);
  Logger.log('Conectado a "%s", pestaña "%s".', sheet.getParent().getName(), sheet.getName());
}

function getSheet() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheets().filter(function (s) { return s.getSheetId() === SHEET_GID; })[0];
  if (!sheet) throw new Error('No existe la pestaña con gid=' + SHEET_GID);
  return sheet;
}

// Devuelve { campo: índice de columna (desde 0) }. Si la hoja está vacía
// escribe los encabezados; si falta una columna, la agrega al final.
function mapColumns(sheet) {
  var lastCol = sheet.getLastColumn();
  var headers = lastCol ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
  var normalized = headers.map(normalize);
  var columns = {};
  var added = [];

  FIELDS.forEach(function (field) {
    var names = [field.key, field.header].concat(field.aliases).map(normalize);
    var index = -1;
    for (var i = 0; i < normalized.length && index < 0; i++) {
      if (normalized[i] && names.indexOf(normalized[i]) >= 0) index = i;
    }
    if (index < 0) {
      index = headers.length + added.length;
      added.push(field.header);
    }
    columns[field.key] = index;
  });

  if (added.length) {
    sheet.getRange(1, headers.length + 1, 1, added.length).setValues([added]).setFontWeight('bold');
    if (!headers.length) sheet.setFrozenRows(1);
  }
  return columns;
}

// "Correo electrónico:" → "correo electronico"
function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[_¿?:.*#º°]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Recorta el texto y evita que un valor empiece con =, +, - o @
// (Sheets lo interpretaría como fórmula).
function clean(value) {
  var text = String(value == null ? '' : value).trim().slice(0, 1000);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
