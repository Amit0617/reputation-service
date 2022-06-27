
import { User } from "src/types/next-auth"
import { HarmonyParameters } from "../harmony"

export default async function mapHarmonyProfile({
    users,
    user_summary
}: User): Promise<User & HarmonyParameters>{
    return {
        id: users[0].id,
        name: users[0].name,
        username: users[0].username,
        likes_received: user_summary.likes_received,
        posts_read_count: user_summary.posts_read_count,
        posts_count: user_summary.post_count,
        read_time: user_summary.time_read
    }
}