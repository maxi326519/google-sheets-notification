import { FileData, getSheetData } from "./services/google-sheets";
import { sendEmail } from "./services/mail/indext";

async function sendNotification() {
  // Sheet info
  const spreadsheetId = process.env.GOOGLE_SPREAT_SHEET_ID;
  if (!spreadsheetId) throw new Error("GOOGLE_SPREAT_SHEET_ID not found");

  console.log("Buscando archivo:");

  // Get data
  const data: FileData[] = await getSheetData(spreadsheetId);

  // Foreach and send notification
  for (const row of data) {
    if (
      checkDate(row.fechaAudienciaInicial) ||
      checkDate(row.fechaPactoCumplimiento) ||
      checkDate(row.fechaAudienciaPrueba) ||
      checkDate(row.fechaRequerimiento) ||
      checkDate(row.fechaMedidaCautelar) ||
      checkDate(row.fechaContestacion)
    ) {
      await sendEmail(
        row.correo,
        row.apoderado,
        row.radicado,
        row.mensaje
      );
    }
  }

  console.log("Finalizado");
}

function checkDate(date: string): boolean {
  if (date && !isNaN(formatDateDDMMYYtoYYMMDD(date).getTime())) {
    const currentDate = formatDateDDMMYYtoYYMMDD(date);
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 1000 * 60 * 60 * 24);
    tomorrow.setUTCHours(0);
    tomorrow.setUTCMinutes(0);
    tomorrow.setUTCSeconds(0);
    tomorrow.setUTCMilliseconds(0);

    return (
      tomorrow.getTime() - currentDate.getTime() <= 1000 * 60 * 60 * 24 &&
      tomorrow.getTime() - currentDate.getTime() > 0
    );
  }
  return false;
}

function formatDateDDMMYYtoYYMMDD(date: string) {
  const dateSplit = date.split("/");
  const day = dateSplit[0];
  const month = dateSplit[1];
  const year = dateSplit[2];

  return new Date(Number(year), Number(month) - 1, Number(day));
}

sendNotification();
