import { getHarmonyUserbyUserName } from "src/services/harmony"
import { GroupName } from "src/types/groups"
import { appendLeaf } from "src/core/groups/mts"
import { connectDatabase } from "src/utils/backend/database"
import { logger } from "src/utils/backend"
import { calculateHarmonyReputation, Harmony, HarmonyReputationLevel } from "src/core/harmony"
import { NextApiRequest, NextApiResponse } from "next"
import HarmonyAccount from "src/core/harmony/harmonyAccount/HarmonyAccount.model"
import { sha256 } from "src/utils/common/crypto"

export default async function handleHarmonyMemberController(req: NextApiRequest, res: NextApiResponse) {
    const name = req.query?.name as GroupName
    const identityCommitment = req.query?.member as string
    const { users } = JSON.parse(req.body)

    const username = req.query?.u

    const hashId = sha256(username)
    const harmonyUser = await HarmonyAccount.findByHashId(hashId)
    let reputation: HarmonyReputationLevel

    if (!users[0].username) {
        res.status(400).end()
        return
    }

    try {

        const {
            user_summary
        } = await getHarmonyUserbyUserName(username)

        harmonyUser.reputation = calculateHarmonyReputation({
            likes_received: user_summary.likes_received,
            posts_read_count: user_summary.posts_read_count,
            posts_count: user_summary.post_count,
            read_time: user_summary.time_read
        })

        await connectDatabase()

        if (!harmonyUser) {
            res.status(404).send("The harmony account does not exist")
            return
        }

        if (harmonyUser.hasJoined) {
            throw new Error(`Harmony user already joined this group`)
        }

        await appendLeaf(Harmony.HARMONY, name, identityCommitment)
        harmonyUser.hasJoined = true

        await harmonyUser.save()

        res.status(201).send({ data: true })

    } catch (error) {
        res.status(500).end()
        logger.error(error)
    }
  
}