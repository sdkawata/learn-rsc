import { Layout } from "./Layout.js"
import { readdir } from "fs/promises";

export const PageList = async () => {
    const postFiles = await readdir("./posts");
    const postSlugs = postFiles.map(file => file.slice(0, file.lastIndexOf(".")))
    return (<Layout>
        <>{postSlugs.map((postSlug) => <div><a href={`/${postSlug}`}>{postSlug}</a></div>)}</>
    </Layout>)
}