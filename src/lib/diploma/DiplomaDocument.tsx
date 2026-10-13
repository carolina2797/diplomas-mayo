import { Document, Page, Text, Image, StyleSheet } from "@react-pdf/renderer";
import type { DiplomaData } from "./types";
import { formatDisplayName } from "./content";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#f5f1e8",
    position: "relative",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  // Positioned to sit on the gold line under "Otorga el presente DIPLOMA A"
  // in the May event's design. Calibrated against a grid overlay (45.5% from
  // the top — the line itself is at ~51%).
  name: {
    position: "absolute",
    top: "45.5%",
    left: 0,
    width: "100%",
    textAlign: "center",
    fontSize: 26,
  },
  courseName: {
    position: "absolute",
    top: "58%",
    left: 0,
    width: "100%",
    textAlign: "center",
    fontSize: 14,
  },
});

interface DiplomaDocumentProps {
  data: DiplomaData;
  // A Buffer (not a file path) — passing an absolute path string to
  // @react-pdf/renderer's <Image> breaks on Windows, since it misreads the
  // drive letter (e.g. "C:") as a URL scheme and tries to fetch() it.
  backgroundImage?: Buffer | null;
  // Whether to also print the course name as an overlay. Only relevant for
  // "precongreso" diplomas that don't have a background already designed
  // specifically for that course (which would have the name baked in).
  showCourseName?: boolean;
}

export function DiplomaDocument({
  data,
  backgroundImage,
  showCourseName,
}: DiplomaDocumentProps) {
  return (
    <Document>
      <Page size="LETTER" orientation="landscape" style={styles.page}>
        {backgroundImage ? (
          // eslint-disable-next-line jsx-a11y/alt-text -- this is @react-pdf/renderer's <Image> (PDF output), not an HTML <img>
          <Image src={backgroundImage} style={styles.background} />
        ) : null}
        <Text style={styles.name}>{formatDisplayName(data.attendeeName, data.prefix)}</Text>
        {showCourseName && data.courseName ? (
          <Text style={styles.courseName}>{data.courseName}</Text>
        ) : null}
      </Page>
    </Document>
  );
}
