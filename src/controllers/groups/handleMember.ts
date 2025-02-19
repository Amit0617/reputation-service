import { MerkleTreeNode } from "@interep/db"
import { NextApiRequest, NextApiResponse } from "next"
import { checkGroup } from "src/core/groups"
import { Harmony } from "src/core/harmony"
import { GroupName, Provider } from "src/types/groups"
import { getCors, logger, runAPIMiddleware } from "src/utils/backend"
import { connectDatabase } from "src/utils/backend/database"
import handleEmailMemberController from "./handleEmailMember"
import handleHarmonyMemberController from "./handleHarmonyMember"
import handleOAuthMemberController from "./handleOAuthMember"
import handlePoapMemberController from "./handlePoapMember"
import handleTelegramMemberController from "./handleTelegramMember"

export default async function handleMemberController(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST" && req.method !== "GET") {
        res.status(405).end()
        return
    }

    const provider = req.query?.provider as Provider
    const name = req.query?.name as GroupName
    const identityCommitment = req.query?.member as string

    if (
        !provider ||
        typeof provider !== "string" ||
        !name ||
        typeof name !== "string" ||
        !identityCommitment ||
        typeof identityCommitment !== "string"
    ) {
        res.status(400).end()
        return
    }

    if (!checkGroup(provider, name)) {
        res.status(404).end("The group does not exist")
        return
    }

    if (req.method === "GET") {
        try {
            await connectDatabase()

            const leaf = await MerkleTreeNode.findByGroupAndHash({ name, provider }, identityCommitment)

            res.status(200).send({ data: !!leaf && leaf.level === 0 })
        } catch (error) {
            res.status(500).end()

            logger.error(error)
        }

        return
    }

    try {
        await runAPIMiddleware(req, res, getCors())
    } catch (error: any) {
        res.status(401).end()

        logger.error(error)
        return
    }

    switch (provider) {
        case "poap":
            await handlePoapMemberController(req, res)
            break
        case "telegram":
            await handleTelegramMemberController(req, res)
            break
        case "email":
            await handleEmailMemberController(req, res)
            break
        case Harmony.HARMONY:
            await handleHarmonyMemberController(req, res)
            break
        default:
            await handleOAuthMemberController(req, res)
    }

    if (res.statusCode === 200 || res.statusCode === 201) {
        logger.info(`[${req.url}] A new member has been added to the group`)
    }
}
