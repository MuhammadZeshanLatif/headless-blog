import Head from 'next/head';
import Link from 'next/link';

import 'bootstrap/dist/css/bootstrap.min.css';

export default async function HomePage() {
  const getPosts = await fetch(
    "https://mytests.brisklydispatchlogistics.com/wp-json/wp/v2/posts?_embed&per_page=100&page=1",
    {
      next: { revalidate: 60 },
    }
  );
  const data = await getPosts.json();

  return (
    <div>
      <Head>
        <title>Content</title>
      </Head>
      <h1>Content</h1>
      <div className="container d-flex flex-wrap gap-4">
        {data.map((post, index) => (
        <Link href={`/blog/${post.slug}`} key={index}>
        <div className="card" style={{ width: "18rem" }}>
          <img
            src={post._embedded['wp:featuredmedia'][0]?.source_url || "default-image.jpg"}
            className="card-img-top"
            alt="Card image cap"
          />
          <div className="card-body">
            <h5
              className="card-title"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
            <p
              className="card-text"
              dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
            />
            <a href="#" className="btn btn-primary">
              Go somewhere
            </a>
          </div>
        </div>
      </Link>
      
        ))}
      </div>
    </div>
  );
}
