import { TelegramUser } from "@interrep/db"
import { NextApiRequest, NextApiResponse } from "next"
import { appendLeaf, deleteLeaf } from "src/core/groups/mts"
import { dbConnect } from "src/utils/backend/database"
import logger from "src/utils/backend/logger"
import { sha256 } from "src/utils/common/crypto"

export default async function handleTelegramIdentityCommitmentController(req: NextApiRequest, res: NextApiResponse) {
    const name = req.query?.name as string
    const identityCommitment = req.query?.identityCommitment as string
    const { telegramUserId } = JSON.parse(req.body)

    if (!telegramUserId) {
        return res.status(400).end()
    }

    try {
        await dbConnect()

        const hashId = sha256(telegramUserId + name)
        const telegramUser = await TelegramUser.findByHashId(hashId)

        if (!telegramUser) {
            return res.status(403).end()
        }

        if (req.method === "POST") {
            if (telegramUser.hasJoined) {
                throw new Error(`Telegram user already joined this group`)
            }

            await appendLeaf("telegram", name, identityCommitment)

            telegramUser.hasJoined = true
        } else if (req.method === "DELETE") {
            if (!telegramUser.hasJoined) {
                throw new Error(`Telegram user has not joined this group yet`)
            }

            await deleteLeaf("telegram", name, identityCommitment)

            telegramUser.hasJoined = false
        }

        await telegramUser.save()

        return res.status(201).send({ data: true })
    } catch (error) {
        logger.error(error)

        return res.status(500).end()
    }
}
