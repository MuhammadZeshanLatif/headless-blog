import styles from "./page.module.css";
import Head from "next/head";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
export default async function HomePage() {
  // Fetching the data directly
  const getPosts = await fetch(
    "https://propakistani.pk/wp-json/wp/v2/posts?_embed&per_page=100&page=2",
    // "https://mytests.brisklydispatchlogistics.com/wp-json/wp/v2/posts?_embed",
    {
      next: { revalidate: 60 },
    }
  );
  const data = await getPosts.json();

  return (
    <div>
      <h1>Content</h1>
      <div className="container d-flex flex-wrap gap-4">
        {data.map((post, index) => {
          console.log(post.uagb_featured_image_src); // Correct placement of console.log
          return (
            <Link href={`/blog/${post['slug']}`}>
            <div className="card" style={{ width: "18rem" }} key={index}>
              <img 
                src={post['_embedded']['wp:featuredmedia'][0]['source_url'] || "default-image.jpg"} 
                className="card-img-top" 
                alt="Card image cap" 
              />
              <div className="card-body">
                <h5 className="card-title">
                  {post['title']['rendered']}
                </h5>
                <p 
                  className="card-text" 
                  dangerouslySetInnerHTML={{ __html: post['excerpt']['rendered'] }} 
                />
                <a href="#" className="btn btn-primary">
                  Go somewhere
                </a>
              </div>
            </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
  
}