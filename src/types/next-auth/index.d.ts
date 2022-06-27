import { Session as NextAuthSession } from "next-auth"
import { JWT as NextAuthJWT } from "next-auth/jwt"
import { ReputationLevel, OAuthProvider } from "@interep/reputation"
import { Harmony, HarmonyReputationLevel } from "src/core/harmony"

interface User extends Record<string, any> {
    id: string
    username: string
    name: string
    reputation?: ReputationLevel | HarmonyReputationLevel
}

declare module "next-auth" {
    interface Session extends NextAuthSession {
        accountId: string
        provider: OAuthProvider | Harmony
        user: User
    }
    interface Account extends Account {
        username: string
    }
}

declare module "next-auth/jwt" {
    interface JWT extends NextAuthJWT {
        accountId: string
        provider: OAuthProvider | Harmony
        user: User
    }
}
