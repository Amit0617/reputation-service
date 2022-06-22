import { Harmony } from "./harmonyReputationLevelAndCriteria"

// @returns Harmony Provider
export default function getHarmonyProvider(): Harmony[]{
    return Object.values(Harmony)
}