import { Layout } from "./Layout.js"
import { readFile } from "fs/promises";

export const Page = async ({slug}) => {
    const content = await readFile(`./posts/${slug}.txt`, "utf8")
    return (<Layout>
        {content}
    </Layout>)
}