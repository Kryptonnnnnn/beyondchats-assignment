import { useEffect, useState } from "react";
import { api } from "../api";

export default function Home() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    api.get("/articles").then(res => setArticles(res.data));
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "auto" }}>
      <h1>BeyondChats Articles</h1>

      {articles.map(article => (
        <div
          key={article.id}
          style={{
            border: "1px solid #ddd",
            padding: 16,
            marginBottom: 12,
            borderRadius: 6,
          }}
        >
          <a href={`/article/${article.id}`}>
            <h3>{article.title}</h3>
          </a>

          <span
            style={{
              fontSize: 12,
              padding: "4px 8px",
              borderRadius: 4,
              background:
                article.version === "updated" ? "#dcfce7" : "#e5e7eb",
            }}
          >
            {article.version}
          </span>
        </div>
      ))}
    </div>
  );
}
