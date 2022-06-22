import { getOAuthProviders } from "@interep/reputation"
import { getHarmonyProvider } from "src/core/harmony"
import { Provider } from "src/types/groups"

export default function getProviders(): Provider[] {
    return [...getOAuthProviders(), ...getHarmonyProvider(), "poap", "telegram", "email"]
}
