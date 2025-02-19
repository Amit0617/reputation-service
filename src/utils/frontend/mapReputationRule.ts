import { ReputationRule } from "@interep/reputation"
import { HarmonyReputationRule } from "src/core/harmony"
import { formatNumber } from "../common"

export default function mapReputationRule(rule: ReputationRule | HarmonyReputationRule): string {
    if (rule.value !== null && typeof rule.value === "object") {
        if (rule.value["<"] !== undefined) {
            return `< ${formatNumber(rule.value["<"])}`
        }

        if (rule.value[">"] !== undefined) {
            return `> ${formatNumber(rule.value[">"])}`
        }
    }

    if (typeof rule.value === "number") {
        return formatNumber(rule.value)
    }

    if (typeof rule.value === "boolean") {
        return rule.value ? "Yes" : "No"
    }

    return "N/A"
}
