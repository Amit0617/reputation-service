import { calculateHarmonyReputation, HarmonyParameters } from "src/core/harmony";
import { Harmony, HarmonyReputationLevel } from "src/core/harmony";
import { Account } from "next-auth";
import { User } from "src/types/next-auth"
import { connectDatabase } from "src/utils/backend/database";
import HarmonyAccount from "./harmonyAccount/HarmonyAccount.model";

export default async function createHarmonyAccount(user: User, harmonyAccount: Account): Promise<boolean> {
    await connectDatabase()

    let account = await HarmonyAccount.findByHashId()

    if (!account) {
        account = new HarmonyAccount({
            hashId,
            hasJoined,
            reputation
        })

    }

    const { likes_received, posts_read_count, posts_count, read_time } = user as HarmonyParameters
    account.reputation = calculateHarmonyReputation({
        likes_received,
        posts_read_count,
        posts_count,
        read_time
    })
}