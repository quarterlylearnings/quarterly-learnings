import Head from "next/head";
import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Link from "next/link";

export async function getStaticProps({ params }) {
    const postData = await getPostData(params.id);

    return {
        props: {
            postData,
        }
    }
}

export async function getStaticPaths() {
    const paths = getAllPostIds();

    return {
        paths,
        fallback: false,
    }
}

export default function Post({postData}) {
    return (
        <Layout>
            <Head>
                <title>{ postData.title }</title>
            </Head>
            <main className="col-span-full">
                <article className="prose prose-lg max-w-2xl mx-auto">
                    <h1 className='text-4xl font-serif mb-8'>{ postData.title }</h1>
                    <p className="text-sm text-accent mb-4">{ new Date(postData.dateCreated).toDateString() }</p>
                    <div className="prose prose-zinc" dangerouslySetInnerHTML={{ __html: postData.postHtml }} />    
                    <p className="mt-8">
                        <Link href="/blog" className="text-primary hover:underline">&larr; Back</Link>
                    </p>
                </article>
            </main>
        </Layout>
    )
}
