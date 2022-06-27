export enum Harmony {
    HARMONY = "harmony"
}

export enum HarmonyReputationLevel {
    Gold = "gold",
    Silver = "silver",
    Bronze = "bronze",
    Unrated = "unrated"
}

type ReputationParameterName = string
type ReputationParameterType = "number" | "boolean"
type ReputationParameterValue = number | boolean | { "<"?: number; ">"?: number }

type ReputationParameters = { name: ReputationParameterName; type: ReputationParameterType }[]
export type HarmonyReputationRule = { parameter: ReputationParameterName; value: ReputationParameterValue }

type HarmonyReputationLevelCriteria = {
    name: HarmonyReputationLevel
    rules: HarmonyReputationRule[]
}[]

export type HarmonyReputationAllLevelCriteria = {
    provider: Harmony
    parameters: ReputationParameters
    reputationLevels: HarmonyReputationLevelCriteria
}

// export default for import HarmonyCriteria for getHarmonyReputationCriteria

export default {
    provider: "harmony",
    parameters: [
        { name: "likes_received", type: "number" },
        { name: "posts_read_count", type: "number" },
        { name: "posts_count", type: "number" },
        { name: "read_time", type: "number" }
    ],
    reputationLevels: [
        {
            name: "gold",
            rules: [
                {
                    parameter: "likes_received",
                    value: {
                        ">": 45
                    }
                },
                {
                    parameter: "posts_read_count",
                    value: {
                        ">": 250
                    }
                },
                {
                    parameter: "posts_count",
                    value: {
                        ">": 30
                    }
                },
                {
                    parameter: "read_time",
                    value: {
                        ">": 5
                    }
                }
            ]
        },
        {
            name: "silver",
            rules: [
                {
                    parameter: "likes_received",
                    value: {
                        ">": 30
                    }
                },
                {
                    parameter: "posts_read_count",
                    value: {
                        ">": 150
                    }
                },
                {
                    parameter: "posts_count",
                    value: {
                        ">": 15
                    }
                },
                {
                    parameter: "read_time",
                    value: {
                        ">": 3
                    }
                }
            ]
        },
        {
            name: "bronze",
            rules: [
                {
                    parameter: "likes_received",
                    value: {
                        ">": 15
                    }
                },
                {
                    parameter: "posts_read_count",
                    value: {
                        ">": 120
                    }
                },
                {
                    parameter: "posts_count",
                    value: {
                        ">": 5
                    }
                },
                {
                    parameter: "read_time",
                    value: {
                        ">": 2
                    }
                }
            ]
        }
    ]
} as HarmonyReputationAllLevelCriteria
