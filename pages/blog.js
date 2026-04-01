import Layout from "../components/layout";
import { getSortedPostsData } from "../lib/posts";

import Link from "next/link";
// replace with imported function for retrieving filesystem post data

export async function getStaticProps() {
    const allPostsData = getSortedPostsData();

    return {
        props: {
            allPostsData,
        },
    };
}

export default function Blog({ allPostsData }) {
    return (
        <Layout>
            <h1 className="col-span-full text-4xl font-serif text-primary mb-8">Writings</h1>
            <section className="col-span-full space-y-6">
                {allPostsData.map((post) => (
                    <article className="bg-tertiary p-4 rounded" key={post.id}>
                        <h2 className="text-2xl font-serif text-white mb-2">
                            <Link href={`/posts/${post.id}`} className="hover:underline">{post.title}</Link>
                        </h2>
                        <p className="text-sm text-accent mb-2">{new Date(post.dateCreated).toDateString()}</p>
                    </article>
                ))}
            </section>
        </Layout>
    );
}
