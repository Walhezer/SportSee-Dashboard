import { useUser } from "~/context/UserContext";

export default function Dashboard() {
  const { user } = useUser();

  if (!user) {
    return (
      <main style={{ padding: "40px", textAlign: "center" }}>
        <p>Veuillez d'abord vous connecter sur la page d'accueil.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px" }}>
      <h1>
        Bonjour <span style={{ color: "#FF0101" }}>{user.userInfos.firstName}</span>
      </h1>
      <p>Félicitations ! Vous avez explosé vos objectifs hier 👏</p>
    </main>
  );
}