import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';

export async function getServerSideProps(context) {
  const { slug } = "context.params";
  console.log(context.params);
  try {
    const res = await fetch(
      `https://mytests.brisklydispatchlogistics.com/wp-json/wp/v2/posts?slug=${slug}&_embed`
    );
    const data = await res.json();

    if (!data.length) {
      return { notFound: true };
    }

    return {
      props: { post: data[0] },
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return { notFound: true };
  }
}

const PostPage = ({ post }) => {
  return (
    <div className="container">
      <Head>
        <title>{post.title.rendered}</title>
      </Head>
      <div className="post">
        <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        <img
          src={post._embedded['wp:featuredmedia'][0]?.source_url || "default-image.jpg"}
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
};

export default PostPage;
