import { Layout } from "./Layout.js"

export const PageList = ({postSlugs}) => {
    return (<Layout>
        {postSlugs.map((postSlug) => <div><a href={`/${postSlug}`}>{postSlug}</a></div>)}
    </Layout>)
}