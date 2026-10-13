import { renderToBuffer } from "@react-pdf/renderer";
import { DiplomaDocument } from "./DiplomaDocument";
import type { DiplomaData } from "./types";
import { loadDiplomaBackground } from "./assets";

export async function renderDiplomaPdf(data: DiplomaData): Promise<Buffer> {
  const { buffer: backgroundImage, hasDedicatedDesign } = loadDiplomaBackground(
    data.diplomaType,
    data.role,
    data.courseCode,
  );
  const showCourseName = data.diplomaType === "precongreso" && !hasDedicatedDesign;

  return renderToBuffer(
    <DiplomaDocument
      data={data}
      backgroundImage={backgroundImage}
      showCourseName={showCourseName}
    />,
  );
}
