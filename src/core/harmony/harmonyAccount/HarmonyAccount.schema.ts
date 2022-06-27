import { Schema } from "mongoose"
import { HarmonyReputationLevel } from "../harmonyReputationLevelAndCriteria"
import { findByHashId } from "./HarmonyAccount.statics"
import { HarmonyUserData, HarmonyUserDocument, HarmonyUserModel } from "./HarmonyAccount.types"

const HarmonyUserSchemaFields: Record<keyof HarmonyUserData, any> = {
    hashId: { type: String, required: true, index: true, unique: true },
    hasJoined: { type: Boolean, required: true },
    reputation: { type: String, enum: Object.values(HarmonyReputationLevel), required: true }
}

const HarmonyUserSchema = new Schema<HarmonyUserDocument, HarmonyUserModel>(HarmonyUserSchemaFields)

HarmonyUserSchema.statics.findByHashId = findByHashId

export default HarmonyUserSchema