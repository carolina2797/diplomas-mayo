"use client";

import { useState, type FormEvent } from "react";
import styles from "./page.module.css";
import { TREATMENT_PREFIXES } from "@/lib/diploma/prefixes";
import { buildDiplomaTitle } from "@/lib/diploma/content";
import { buildDiplomaDownloadUrl } from "@/lib/diploma/downloadUrl";
import type { AttendeeLookupResult } from "@/lib/attendees/types";

export default function Home() {
  const [email, setEmail] = useState("");
  const [prefix, setPrefix] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AttendeeLookupResult | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/api/attendee?email=${encodeURIComponent(email)}`);

      if (response.status === 404) {
        setError(
          "No encontramos ese correo. Verifica que sea el mismo con el que te registraste.",
        );
        return;
      }

      if (!response.ok) {
        setError("Ocurrió un error al buscar tus diplomas. Intenta de nuevo.");
        return;
      }

      const data: AttendeeLookupResult = await response.json();
      setResult(data);
    } catch {
      setError("Ocurrió un error al buscar tus diplomas. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h1 className={styles.title}>Descarga tu diploma</h1>
        <p className={styles.subtitle}>
          Ingresa el correo con el que te registraste al evento para ver tus diplomas
          disponibles.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu.correo@ejemplo.com"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="prefix">Prefijo de tratamiento (opcional)</label>
            <select id="prefix" value={prefix} onChange={(e) => setPrefix(e.target.value)}>
              <option value="">Sin prefijo</option>
              {TREATMENT_PREFIXES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? "Buscando..." : "Buscar mis diplomas"}
          </button>
        </form>

        {error ? <div className={styles.error}>{error}</div> : null}

        {result && result.diplomas.length === 0 ? (
          <div className={styles.error}>
            No hay diplomas disponibles para este correo. Si crees que es un error,
            contacta a la organización.
          </div>
        ) : null}

        {result && result.diplomas.length > 0 ? (
          <div className={styles.results}>
            <p className={styles.resultsTitle}>
              Diplomas disponibles para {result.attendee.name}:
            </p>
            {result.diplomas.map((diploma) => (
              <a
                key={diploma.diplomaType}
                className={styles.diplomaButton}
                href={buildDiplomaDownloadUrl({
                  email: result.attendee.email,
                  type: diploma.diplomaType,
                  prefix,
                })}
              >
                Descargar: {buildDiplomaTitle(diploma)}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
