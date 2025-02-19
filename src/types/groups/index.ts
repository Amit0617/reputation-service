import { ReputationLevel, OAuthProvider } from "@interep/reputation"
import { TelegramGroup } from "@interep/telegram-bot"
import { EmailDomain } from "src/core/email"
import { PoapEvent } from "src/core/poap"
import { Harmony, HarmonyReputationLevel } from "src/core/harmony"

export type Provider = OAuthProvider |"poap" | "telegram" | "email" | Harmony
export type GroupName = ReputationLevel | PoapEvent | TelegramGroup | EmailDomain | HarmonyReputationLevel

export type Group = {
    provider: Provider
    name: GroupName
    depth: number
    root: string
    size: number
    numberOfLeaves: number
}

// Group with additional parameters used in the UI.
export type UserGroup = Group & {
    joined: boolean | null // True if the user has already joined the group.
}

export type Groups = Group[]
