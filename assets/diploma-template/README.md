# Plantillas del diploma

Cada combinación de **evento** (congreso general o un precongreso) × **rol**
(asistente / conferencista / moderador) usa su propio fondo. El motor solo dibuja el
**nombre** de la persona encima (y el nombre del curso, únicamente como respaldo
temporal mientras no exista el diseño específico de ese precongreso — ver abajo).

`asistente` es el rol por defecto y reutiliza los nombres de archivo ya existentes
(sin sufijo). `conferencista` y `moderador` agregan un sufijo. Nombres esperados:

- `background-general.png` — congreso general, asistente.
- `background-general-conferencista.png` — congreso general, conferencista.
- `background-general-moderador.png` — congreso general, moderador.
- `background-precongreso-{CODIGO}.png` — un precongreso específico, asistente.
- `background-precongreso-{CODIGO}-conferencista.png` — ídem, conferencista.
- `background-precongreso-{CODIGO}-moderador.png` — ídem, moderador.

`{CODIGO}` debe ser **exactamente** el valor de `CodigoPrecongreso` de la Google
Sheet (mismas mayúsculas/minúsculas — el sistema de archivos en producción distingue
entre mayúsculas y minúsculas, a diferencia de Windows). Ej.: `background-precongreso-PC1.png`.

Opcional — fondos genéricos (sin curso específico), usados solo si el fondo
dedicado de ese curso+rol todavía no existe; en ese caso el nombre del curso se
agrega como texto sobre este fondo:

- `background-precongreso.png` / `-conferencista.png` / `-moderador.png`

Si el archivo de una combinación evento+rol(+curso) no existe todavía, el motor cae
automáticamente a un fondo de color sólido (mockup) — no hace falta tocar código para
agregarlo después, solo colocar el archivo con el nombre correcto.

Recomendado para cada imagen: PNG, orientación horizontal, **2000×1414 px**
(equivale a carta a 300 DPI — más que suficiente para imprimir). Exportar a una
resolución mayor no mejora la calidad visible y sí afecta el rendimiento: cada
diploma se genera al momento de la descarga incrustando esta imagen completa, así
que un archivo más pesado significa una descarga más lenta para el asistente (y en
producción, riesgo de exceder el límite de tiempo de las funciones serverless).

Hay 7 precongresos en total (`PC1`–`PC7`).
