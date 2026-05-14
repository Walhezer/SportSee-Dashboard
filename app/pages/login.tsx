import { useNavigate } from "react-router";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    document.cookie = "userToken=votre_token_ici; path=/; max-age=3600";

    navigate("/dashboard");
  };

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
      <h1>Connexion SportSee</h1>
      <button 
        onClick={handleLogin}
        style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#FF0101', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        Se connecter en tant que Sophie
      </button>
    </main>
  );
}