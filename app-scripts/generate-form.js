function generarExamenesPorAlumno() {
  const HOJA_PREGUNTAS = "banco";
  const HOJA_ALUMNOS = "alumnos";
  const NUM_PREGUNTAS = 10;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const banco = ss.getSheetByName(HOJA_PREGUNTAS).getDataRange().getValues();
  const alumnos = ss.getSheetByName(HOJA_ALUMNOS).getDataRange().getValues();

  const preguntas = banco.slice(1); // Sin encabezado
  const listaAlumnos = alumnos.slice(1); // Sin encabezado

  listaAlumnos.forEach(([nombre, correo]) => {
    // Mezclar preguntas y tomar 10 aleatorias
    const seleccionadas = preguntas
      .sort(() => 0.5 - Math.random())
      .slice(0, NUM_PREGUNTAS);

    // Crear un nuevo formulario para este alumno
    const form = FormApp.create(`Examen de ${nombre}`);
    form.setTitle(`Examen de Programación - ${nombre}`);
    form.setDescription(`Hola ${nombre}, responde las siguientes preguntas:`);

    // Agregar las preguntas al formulario
    seleccionadas.forEach(p => {
      const [pregunta, a, b, c, d, correcta] = p;
      const item = form.addMultipleChoiceItem();
      item.setTitle(pregunta)
          .setChoices([
            item.createChoice(a, correcta === "A"),
            item.createChoice(b, correcta === "B"),
            item.createChoice(c, correcta === "C"),
            item.createChoice(d, correcta === "D"),
          ])
          .setRequired(true);
    });

    // Hacerlo tipo "cuestionario" con calificación automática
    form.setIsQuiz(true);

    // Registrar enlace
    const editUrl = form.getEditUrl();
    const publicUrl = form.getPublishedUrl();
    Logger.log(`${nombre}: ${publicUrl}`);

    // (Opcional) Enviar correo con el enlace al alumno
    if (correo && correo.includes("@")) {
      MailApp.sendEmail({
        to: correo,
        subject: "Tu examen de programación",
        htmlBody: `
          <p>Hola <b>${nombre}</b>,</p>
          <p>Se ha generado tu examen de programación. Puedes realizarlo en el siguiente enlace:</p>
          <p><a href="${publicUrl}">Abrir examen</a></p>
          <p>¡Éxito!</p>
        `
      });
    }
  });

  Logger.log("Todos los exámenes fueron generados correctamente ✅");
};