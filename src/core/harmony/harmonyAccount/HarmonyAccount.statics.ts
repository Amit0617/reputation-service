import type HarmonyAccount from "./HarmonyAccount.model"
import  type { HarmonyUserDocument } from "./HarmonyAccount.types"

export async function findByHashId(this: typeof HarmonyAccount, hashId: string): Promise<HarmonyUserDocument | null>{
    return this.findOne({ hashId })
}