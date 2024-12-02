
import styles from "./page.module.css";
import Head from "next/head";
import Link from "next/link"


export default async function HomePage() {
  // Fetching the data directly
  const getPosts = await fetch('https://propakistani.pk//wp-json/wp/v2/posts?_embed', {
    next: { revalidate: 60 },
  });
  const data = await getPosts.json();

  return (
    <div>
      {console.log(data)}

      <h1>Blog Posts</h1>
      <ul>
        {data.map((post) => (
          <li key={post.id}>
            <h2>{post.title.rendered}</h2>
            <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
