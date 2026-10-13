// @vitest-environment node
import { describe, it, expect } from "vitest";
import { renderToBuffer } from "@react-pdf/renderer";
import { DiplomaDocument } from "./DiplomaDocument";

// 1x1 transparent PNG, used only to exercise the "with background image" branch.
const ONE_PIXEL_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

const baseData = {
  attendeeName: "Ana Pérez",
  diplomaType: "general" as const,
  role: "asistente" as const,
};

describe("DiplomaDocument", () => {
  it("embeds the background image (as an XObject) when one is provided", async () => {
    const backgroundImage = Buffer.from(ONE_PIXEL_PNG_BASE64, "base64");

    const buffer = await renderToBuffer(
      <DiplomaDocument data={baseData} backgroundImage={backgroundImage} />,
    );

    expect(buffer.subarray(0, 5).toString("ascii")).toBe("%PDF-");
    expect(buffer.toString("latin1")).toMatch(/\/Subtype\s*\/Image/);
  });

  it("renders the solid-color fallback without an embedded image when there is none", async () => {
    const buffer = await renderToBuffer(
      <DiplomaDocument data={baseData} backgroundImage={null} />,
    );

    expect(buffer.subarray(0, 5).toString("ascii")).toBe("%PDF-");
    expect(buffer.toString("latin1")).not.toMatch(/\/Subtype\s*\/Image/);
  });

  it("shows the course name only when showCourseName is true", async () => {
    const data = {
      attendeeName: "Ana Pérez",
      diplomaType: "precongreso" as const,
      role: "asistente" as const,
      courseName: "Precongreso de Ecografía",
    };

    const withCourse = await renderToBuffer(
      <DiplomaDocument data={data} backgroundImage={null} showCourseName />,
    );
    const withoutCourse = await renderToBuffer(
      <DiplomaDocument data={data} backgroundImage={null} showCourseName={false} />,
    );

    // The course name text should make the "with course" PDF distinctly
    // bigger than the one without it (an extra text object + font glyphs).
    expect(withCourse.length).toBeGreaterThan(withoutCourse.length);
  });
});
