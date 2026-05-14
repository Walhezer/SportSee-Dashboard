import { Link } from "react-router";

export default function NotFound() {
  return (
    <main style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>404</h1>
      <p>Oups ! La page que vous demandez n'existe pas.</p>
      <Link to="/">Retourner à la page d'accueil</Link>
    </main>
  );
}