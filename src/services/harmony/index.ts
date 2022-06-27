const url = "https://harmony-fetcher.herokuapp.com/https://talk.harmony.one/u/"

export const getHarmonyUserbyUserName = async(userName: string) => {
    const userSummary = await fetch(`${url}/${userName}/summary.json`)
    return userSummary.json()
}