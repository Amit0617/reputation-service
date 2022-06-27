import type {Document, Model} from "mongoose"
import { HarmonyReputationLevel } from "../harmonyReputationLevelAndCriteria"
import type { findByHashId } from "./HarmonyAccount.statics"

export type HarmonyUserData = {
    hashId: string,
    hasJoined: boolean,
    reputation: HarmonyReputationLevel,

}

export type HarmonyUserDocument = HarmonyUserData & Document

export type HarmonyUserModel = Model<HarmonyUserDocument> & {
    findByHashId: typeof findByHashId
}
