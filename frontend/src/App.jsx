
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [universities, setUniversities] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `https://laughing-sniffle-q7g5rrp4grrvf5v7-3001.app.github.dev/api/universities?search=${encodeURIComponent(search)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Error al consultar el servidor");
        }

        const result = await response.json();
        setUniversities(result.data);

      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
          setUniversities([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search]);

  return (
    <main className="container">

      <header>
        <h1>Buscador</h1>
      </header>

      <section className="search">
        <input
          type="text"
          placeholder="nombre de una universidad"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      {loading && <p>Buscando </p>}

      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <p>Resultados {universities.length}</p>
      )}

      <section className="grid">
        {universities.map((uni, index) => (
          <article className="card" key={`${uni.name}-${index}`}>
            <h2>{uni.name}</h2>

            <p>País: {uni.country}</p>

            <p>
              Dominio: {uni.domains?.join(", ")}
            </p>

            {uni.web_pages?.[0] && (
              <a
                href={uni.web_pages[0]}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visitar universidad →
              </a>
            )}
          </article>
        ))}
      </section>

      {!loading && !error && universities.length === 0 && (
        <p>No se encontraron universidades.</p>
      )}

    </main>
  );
}

export default App;
