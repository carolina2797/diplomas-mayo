import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diplomas del evento",
  description: "Busca y descarga tu diploma del evento con tu correo electrónico.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
