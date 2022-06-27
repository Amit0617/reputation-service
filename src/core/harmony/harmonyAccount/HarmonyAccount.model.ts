import { model, models } from "mongoose"
import HarmonyUserSchema from "./HarmonyAccount.schema"
import type { HarmonyUserDocument, HarmonyUserModel } from "./HarmonyAccount.types"

const HARMONY_USER_MODEL_NAME = "HarmonyAccount"

const HarmonyAccount: HarmonyUserModel = 
    (models[HARMONY_USER_MODEL_NAME] as HarmonyUserModel) ||
    model<HarmonyUserDocument, HarmonyUserModel>(HARMONY_USER_MODEL_NAME, HarmonyUserSchema, "harmonyUsers")

export default HarmonyAccount