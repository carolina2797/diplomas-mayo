# Sistema de diplomas por QR + búsqueda por correo — evento de mayo

## Origen

Este proyecto es una **copia independiente** del sistema construido para un evento
anterior (repo `carolina2797/diplomas-evento`, desplegado en
https://diplomas-evento.vercel.app, que **sigue en línea** y no debe tocarse desde
aquí). Se copió el código tal cual; no se copiaron el historial de git, los fondos
de diploma ni el QR del evento anterior.

El evento de mayo tiene **la misma estructura, roles y prefijos** que el anterior,
por lo que no se esperan cambios de código: solo cambian la Google Sheet, los fondos
(PNG), la configuración de Vercel y el QR.

## Contexto

Cada asistente debe poder obtener, escaneando un código QR impreso en el evento y
buscando por su correo en un sitio web:

- Un diploma de **participación general** (todos los asistentes confirmados).
- Un diploma adicional si participó en un **precongreso** (curso específico). Hay 7
  precongresos posibles (`PC1`–`PC7`), pero **cada asistente va a lo sumo a uno**. Es
  decir, cada persona recibe 1 o 2 diplomas en total (0 si `RolGeneral` es "Ninguno" y
  no fue a ningún precongreso).
- Cada uno de esos diplomas (general y precongreso) tiene además un **rol**:
  asistente, conferencista o moderador — independiente entre sí. El rol determina qué
  fondo/diseño se usa, no cuántos diplomas recibe.

Decisiones clave (heredadas del proyecto original):

- **Fuente de datos**: Google Sheets. Tab `Asistentes`: Correo, Nombre,
  CodigoPrecongreso, RolGeneral, RolPrecongreso (rango `A:E`). Tab `Cursos`:
  CodigoPrecongreso → NombreCompletoCurso. `RolGeneral` vacío = asistente;
  "Ninguno"/"No aplica"/"N/A"/"No" = sin diploma general.
- **Verificación**: solo correo, sin capa extra (riesgo aceptado).
- **Prefijo de tratamiento** (Dr., Dra., Lic., Licda.): se elige en un selector al
  buscar; se antepone al nombre solo al generar el PDF.
- **Diseño del diploma**: fondos PNG exportados del diseño real (uno por evento ×
  rol × curso, ver `assets/diploma-template/README.md`); el motor solo dibuja el
  nombre encima, con `@react-pdf/renderer`. Posición del nombre heredada: 50% desde
  arriba — **hay que recalibrarla** con el diseño nuevo.
- **Generación de PDFs**: on-demand, sin storage persistente.
- **Stack**: Next.js (App Router, TypeScript) + Vercel (tier gratuito) + Google Sheets
  API (cuenta de servicio) + `@react-pdf/renderer`. Costo esperado: $0.
- **Código QR**: uno solo, apuntando a la URL raíz del sitio desplegado.

## Convenciones de trabajo

- El proyecto se ejecuta **por partes**; antes de cada parte se explica qué se hará y
  se pide permiso antes de ejecutar.
- **Claude nunca ejecuta `git commit` ni `git push`.** Se entrega el mensaje de commit
  listo (Conventional Commits, en inglés, sin `Co-Authored-By`) para que el usuario lo
  ejecute desde su propia terminal.
- Nunca se suben credenciales al repositorio (`.env*`, claves de cuenta de servicio,
  etc. están en `.gitignore`).
- Flujo de ramas: commits directos sobre `develop` (sin feature branches ni PRs); `main`
  se reserva solo para releases (y es la rama que despliega Vercel a producción).
- El `user.email` de git (a nivel de repo) debe ser el del dueño de la cuenta de
  Vercel/GitHub (`carolinaherrera1997.02@hotmail.com`); si no, Vercel bloquea el
  despliegue (plan Hobby, repo privado).
- Arquitectura: Single Responsibility Principle — acceso a datos (Sheets), generación
  de diplomas (PDF) y lógica de búsqueda/matching viven en módulos separados; las rutas
  de API son una capa delgada que solo orquesta.
- Tests con cobertura ≥ 80% sobre la lógica de negocio (Vitest).

## Estructura del proyecto

- `src/app/` — rutas de Next.js: `page.tsx` (página pública), `api/attendee`
  (búsqueda), `api/diploma/download` (descarga del PDF).
- `src/lib/attendees/` — tipos, parseo de filas del Sheet, matching de diplomas,
  servicio de búsqueda.
- `src/lib/sheets/` — configuración y cliente de Google Sheets.
- `src/lib/diploma/` — componente del diploma, render a PDF, selección de fondos,
  prefijos, nombres de archivo y URLs de descarga.
- `src/lib/env.ts` — lectura de variables de entorno (incluye normalización de la
  clave privada).
- `assets/diploma-template/` — fondos PNG del diploma (2000×1414 px).
- `vitest.config.mts` / `vitest.setup.ts` — configuración de tests.

## Bitácora

### 2026-10-13 — Parte 1: Copia del proyecto base

- Se copió el código del proyecto del evento anterior a esta carpeta, excluyendo
  `.git`, `node_modules`, `.next`, `coverage`, los 24 fondos PNG y el QR.
- `.env.local` copiado con las mismas credenciales de la cuenta de servicio;
  `GOOGLE_SHEETS_SPREADSHEET_ID` se dejó **vacío** a propósito para no leer por error
  la Sheet del evento anterior.
- `package.json` renombrado a `diplomas-mayo`.
- Git inicializado con ramas `develop` y `main` (sin commits).
- Pendiente (usuario): crear el repo en GitHub y hacer el primer commit/push; crear la
  Sheet nueva y compartirla con la cuenta de servicio; poner su ID en `.env.local`;
  exportar los 24 fondos nuevos.

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.
