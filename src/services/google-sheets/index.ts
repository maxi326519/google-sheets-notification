import { sheets_v4 } from "googleapis/build/src/apis/sheets";
import { google } from "googleapis";
import * as fs from "fs";
import path from "path";
import "dotenv/config";

export interface FileData {
  apoderado: string;
  radicado: string;
  fechaEjecutoria: string;
  fechaTerminacion: string;
  fechaAudienciaInicial: string;
  fechaPactoCumplimiento: string;
  fechaAudienciaPrueba: string;
  fechaRequerimiento: string;
  fechaMedidaCautelar: string;
  fechaContestacion: string;
  mensaje: string;
  correo: string;
}

// Carga las credenciales del archivo JSON de la cuenta de servicio
const credentialsPath = path.join(
  __dirname,
  "../../../procesos-judiciales-83343-64bcbdc914ac.json"
);
const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));

// Configura la autenticación
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: credentials.client_email,
    private_key: credentials.private_key,
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

// Función para obtener datos de una hoja de Google Sheets
async function getSheetData(spreadsheetId: string): Promise<FileData[]> {
  try {
    const sheets: sheets_v4.Sheets = google.sheets({ version: "v4", auth });
    const range = "Employees!A1:AY400";
    const data: FileData[] = [];

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (rows && rows.length) {
      rows.forEach((row: any, index) =>
        data.push({
          apoderado: row[0],
          radicado: row[4],
          fechaEjecutoria: row[41],
          fechaTerminacion: row[42],
          fechaAudienciaInicial: row[43],
          fechaPactoCumplimiento: row[44],
          fechaAudienciaPrueba: row[45],
          fechaRequerimiento: row[46],
          fechaMedidaCautelar: row[47],
          fechaContestacion: row[48],
          mensaje: row[49],
          correo: row[50],
        })
      );
    } else {
      console.log("No se encontraron datos en la hoja.");
    }

    return data;
  } catch (err) {
    console.error("Error al obtener datos de Google Sheets:", err);
    return [];
  }
}

export { getSheetData };
