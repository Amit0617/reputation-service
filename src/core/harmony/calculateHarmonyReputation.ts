import getHarmonyReputationCriteria from "./getHarmonyReputationCriteria";
import { HarmonyReputationLevel } from "./harmonyReputationLevelAndCriteria"

export type HarmonyParameters = {
    likes_received?: number
    posts_read_count?: number
    posts_count?: number
    read_time?: number
}

export default function calculateHarmonyReputation(parameters: HarmonyParameters): HarmonyReputationLevel{
    const criteria = getHarmonyReputationCriteria()
    const harmonyParameterNames = criteria.parameters.map((parameter: any) => parameter.name)
    const harmonyParameterTypes = criteria.parameters.map((parameter: any) => parameter.type)
    
    for (const parameterName in parameters) {
        if (Object.prototype.hasOwnProperty.call(parameters, parameterName)) {
            const parameterIndex = harmonyParameterNames.indexOf(parameterName)

            // If parameterName not found in harmonyParameterNames
            if (parameterIndex === -1) {
                throw new Error(`Parameter '${parameterName}' is not supported`)
            }

            const parameterValue = parameters[parameterName as keyof HarmonyParameters]
            const expectedType = harmonyParameterTypes[parameterIndex]

            if (typeof parameterValue !== expectedType) {
                throw new TypeError(`Parameter '${parameterName}' is not a ${expectedType}`)
            }
        }
    }

    for (const reputation of criteria.reputationLevels) {
        for (const rule of reputation.rules) {
            if (rule.value !== null) {
                const parameterValue = parameters[rule.parameter as keyof HarmonyParameters]

                if (parameterValue !== undefined) {
                    if (typeof rule.value !== "object") {
                        if (parameterValue === rule.value) {
                            return reputation.name
                        }
                    } else if (
                        (rule.value["<"] !== undefined || rule.value[">"] !== undefined) &&
                        (rule.value["<"] === undefined || parameterValue < rule.value["<"]) &&
                        (rule.value[">"] === undefined || parameterValue > rule.value[">"])
                    ) {
                        return reputation.name
                    }
                }
            }
        }
    }
    return HarmonyReputationLevel.Unrated

}