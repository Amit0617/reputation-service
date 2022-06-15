import { HarmonyReputationLevel } from "./harmonyReputationLevelAndCriteria"

// Returns reputation levels likely - Gold, Silver, Bronze, Unrated
export default function getHarmonyReputationLevel(): HarmonyReputationLevel[] {
    return Object.values(HarmonyReputationLevel)
}