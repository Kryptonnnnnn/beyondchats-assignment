import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api";

export default function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    api.get(`/articles/${id}`).then(res => setArticle(res.data));
  }, [id]);

  if (!article) return <p>Loading...</p>;

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "auto" }}>
      <h1>{article.title}</h1>

      <pre style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
        {article.content}
      </pre>

      {article.references && article.references.length > 0 && (
        <>
          <h3>References</h3>
          <ul>
            {article.references.map((ref, i) => (
              <li key={i}>
                <a href={ref} target="_blank">{ref}</a>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
