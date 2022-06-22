/* istanbul ignore file */
import { ReputationLevel } from "@interep/reputation"
import { PoapEvent } from "src/core/poap"
import { HarmonyReputationLevel } from "src/core/harmony"
import { Provider } from "src/types/groups"
import sendRequest from "./sendRequest"

export function sendEmail({ email }: { email: string }) {
    return sendRequest(`/api/v1/email/send`, {
        email
    })
}

export function getGroup({
    provider,
    groupName
}: {
    provider: Provider
    groupName: ReputationLevel | PoapEvent | HarmonyReputationLevel | string
}): Promise<any | null> {
    return sendRequest(`/api/v1/groups/${provider}/${groupName}`)
}

export function getGroups(): Promise<any | null> {
    return sendRequest(`/api/v1/groups`)
}

export async function hasJoinedAGroup(): Promise<boolean | null> {
    return sendRequest(`/api/v1/groups/has-joined`)
}

export function hasIdentityCommitment({
    provider,
    groupName,
    identityCommitment
}: {
    provider: Provider
    groupName: ReputationLevel | PoapEvent | HarmonyReputationLevel | string
    identityCommitment: string
}): Promise<any | null> {
    return sendRequest(`/api/v1/groups/${provider}/${groupName}/${identityCommitment}`)
}

export function addIdentityCommitment({
    provider,
    groupName,
    identityCommitment,
    accountId,
    userAddress,
    userSignature,
    telegramUserId,
    emailUserId,
    emailUserToken
}: {
    provider: Provider
    groupName: ReputationLevel | PoapEvent | HarmonyReputationLevel | string
    identityCommitment: string
    accountId?: string
    userAddress?: string
    userSignature?: string
    telegramUserId?: string
    emailUserId?: string
    emailUserToken?: string
}): Promise<any | null> {
    return sendRequest(`/api/v1/groups/${provider}/${groupName}/${identityCommitment}`, {
        accountId,
        userAddress,
        userSignature,
        telegramUserId,
        emailUserId,
        emailUserToken
    })
}
