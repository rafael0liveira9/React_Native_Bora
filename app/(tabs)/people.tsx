import { useViewMode } from "@/context/ViewModeContext";
import PeopleScreen from "@/view/people/peopleScreen";
import { Redirect } from "expo-router";

export default function People() {
  const { viewMode } = useViewMode();

  // Redireciona para home se não estiver em modo cliente
  if (viewMode !== "client") {
    return <Redirect href="/(tabs)" />;
  }

  return <PeopleScreen />;
}
