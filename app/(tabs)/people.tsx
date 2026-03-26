import { useViewMode } from "@/context/ViewModeContext";
import PeopleScreen from "@/view/people/peopleScreen";
import { Redirect } from "expo-router";

export default function People() {
  const { viewMode } = useViewMode();

  if (viewMode !== "client") {
    return <Redirect href="/(tabs)" />;
  }

  return <PeopleScreen />;
}
