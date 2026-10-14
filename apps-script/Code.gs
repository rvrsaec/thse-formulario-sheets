/**
 * Recibe los datos del formulario web y los guarda en Google Sheets.
 *
 * Uso: abre tu hoja de cálculo → Extensiones → Apps Script, pega este
 * código y publícalo como "Aplicación web" (ver README.md).
 */

// Nombre de la pestaña donde se guardan las respuestas (se crea si no existe).
var SHEET_NAME = 'Respuestas';

// Columnas de la hoja, en orden. Deben coincidir con los atributos "name"
// de los campos del formulario (salvo "fecha", que se agrega aquí).
var HEADERS = ['fecha', 'solicitud', 'nombre', 'email', 'organizacion', 'rol', 'tipo_registro', 'uso', 'consentimiento', 'pagina'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000); // evita que dos envíos simultáneos se pisen

  try {
    var params = (e && e.parameter) || {};

    // Campo trampa: si viene lleno, es un bot. Respondemos OK sin guardar.
    if (params.website) {
      return json({ result: 'success' });
    }

    if (!params.nombre || !params.email) {
      return json({ result: 'error', error: 'Faltan campos obligatorios' });
    }

    var sheet = getSheet();
    var row = HEADERS.map(function (header) {
      if (header === 'fecha') return new Date();
      return clean(params[header]);
    });
    sheet.appendRow(row);

    return json({ result: 'success', row: sheet.getLastRow() });
  } catch (err) {
    return json({ result: 'error', error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Permite comprobar en el navegador que la URL /exec está activa.
function doGet() {
  return json({ result: 'ok', message: 'El servicio está funcionando. Usa POST para enviar datos.' });
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
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
