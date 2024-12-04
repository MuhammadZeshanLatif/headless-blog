import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';

export default async function PostPage({ params }) {
  const { slug } = params; // Access the slug dynamically from the `params` prop

  // Fetch the post based on the slug
  const res = await fetch(
    `https://mytests.brisklydispatchlogistics.com/wp-json/wp/v2/posts?slug=${slug}&_embed`
  );
  const data = await res.json();

  // If no post is found
  if (!data.length) {
    return <div>Post not found</div>;
  }

  const post = data[0]; // Single post data

  return (
    <div className="container">
      <Head>
        <title>{post.title.rendered}</title>
      </Head>
      <div className="post">
        <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        <img
          src={post._embedded['wp:featuredmedia'][0]?.source_url || 'default-image.jpg'}
          alt={post.title.rendered}
          className="img-fluid"
        />
        <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
      </div>
      <div className="comments-section mt-5">
        <h2>Leave a Comment</h2>
        <form>
          <div className="form-group">
            <label htmlFor="comment">Comment*</label>
            <textarea className="form-control" id="comment" rows="4" required></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="name">Name*</label>
            <input type="text" className="form-control" id="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input type="email" className="form-control" id="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input type="url" className="form-control" id="website" />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  );
}

// Use Next.js `generateStaticParams` to pre-render routes
export async function generateStaticParams() {
  const res = await fetch(
    'https://mytests.brisklydispatchlogistics.com/wp-json/wp/v2/posts?_embed&per_page=100&page=1'
  );
  const posts = await res.json();

  // Return an array of params with slugs for all posts
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Configure dynamic metadata
export async function generateMetadata({ params }) {
  const { slug } = params;

  const res = await fetch(
    `https://mytests.brisklydispatchlogistics.com/wp-json/wp/v2/posts?slug=${slug}&_embed`
  );
  const data = await res.json();

  if (!data.length) {
    return { title: 'Post not found' };
  }

  const post = data[0];
  return { title: post.title.rendered };
}
