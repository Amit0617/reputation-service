const url = "https://talk.harmony.one/u/"

export async function getHarmonyUserByUsername(username: string){
    const userSummarydetails = await fetch(`${url}/${username}/summary.json`)
    return userSummarydetails
}