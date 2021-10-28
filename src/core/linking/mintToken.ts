import { ContractTransaction } from "@ethersproject/contracts"
import { TokenStatus, Token } from "@interrep/data-models"
import logger from "src/utils/backend/logger"
import checkAndUpdateTokenStatus from "src/core/blockchain/ReputationBadge/checkAndUpdateTokenStatus"
import mintNewToken from "src/core/blockchain/ReputationBadge/mintNewToken"

const mintToken = async (tokenId: string): Promise<ContractTransaction> => {
    let token
    try {
        token = await Token.findById(tokenId)
    } catch {
        throw new Error(`Error while retrieving token with id ${tokenId} `)
    }

    if (!token) throw new Error(`token with id ${tokenId} not found`)

    await checkAndUpdateTokenStatus([token])

    if (token.status !== TokenStatus.NOT_MINTED) {
        throw new Error(`Can't mint a token with status ${token.status}`)
    }

    const { contractAddress, userAddress, decimalId } = token

    if (!contractAddress || !userAddress || !decimalId) throw new Error(`Missing properties on token`)

    const txResponse = await mintNewToken({
        badgeAddress: contractAddress,
        to: userAddress,
        tokenId: decimalId
    })

    logger.silly(`[MINTING TX] Tx Response: ${JSON.stringify(txResponse)}`)

    if (!txResponse) {
        throw new Error(`Error while submitting mint transaction`)
    }

    const { hash, blockNumber, chainId, timestamp } = txResponse
    token.mintTransactions?.push({
        response: { hash, blockNumber, chainId, timestamp }
    })
    await token.save()

    token.status = TokenStatus.MINT_PENDING
    await token.save()

    return txResponse
}

export default mintToken
