"use client"; // For the comments form to handle interactivity
import { useState } from "react";
import Head from "next/head";
import "bootstrap/dist/css/bootstrap.min.css";

export default async function PostPage({ params }) {
  const { slug } = params;

  // Fetch the post based on the slug
  const res = await fetch(
    `https://mytests.brisklydispatchlogistics.com/wp-json/wp/v2/posts?slug=${slug}&_embed`
  );
  const data = await res.json();

  // If no post is found
  if (!data.length) {
    return <div>Post not found</div>;
  }

  const post = data[0];

  return (
    <div className="container">
      <Head>
        <title>{post.title.rendered}</title>
      </Head>
      <div className="post">
        <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        <img
          src={
            post._embedded["wp:featuredmedia"][0]?.source_url ||
            "default-image.jpg"
          }
          alt={post.title.rendered}
          className="img-fluid"
        />
        <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
      </div>
      <CommentsForm postId={post.id} />
    </div>
  );
}

// Comments Form as a Client Component
function CommentsForm({ postId }) {
  const [formData, setFormData] = useState({
    comment: "",
    name: "",
    email: "",
    website: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Token for Authorization
  const token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL215dGVzdHMuYnJpc2tseWRpc3BhdGNobG9naXN0aWNzLmNvbSIsImlhdCI6MTczMzQwNTc5OCwibmJmIjoxNzMzNDA1Nzk4LCJleHAiOjE3MzQwMTA1OTgsImRhdGEiOnsidXNlciI6eyJpZCI6IjEifX19.AO-Mno1QIlnEDPqVPonPTD0CM40FWZkReEsEnis49QM";

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        "https://mytests.brisklydispatchlogistics.com/wp-json/wp/v2/comments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token
          },
          body: JSON.stringify({
            post: postId, // Post ID
            content: formData.comment,
            author_name: formData.name,
            author_email: formData.email,
            author_url: formData.website,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Comment submitted successfully!");
        setFormData({
          comment: "",
          name: "",
          email: "",
          website: "",
        });
      } else {
        setMessage(data.message || "Failed to submit comment.");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      setMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comments-section mt-5">
      <h2>Leave a Comment</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="comment">Comment*</label>
          <textarea
            className="form-control"
            id="comment"
            rows="4"
            value={formData.comment}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="name">Name*</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email*</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="website">Website</label>
          <input
            type="url"
            className="form-control"
            id="website"
            value={formData.website}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
      {message && <div className="mt-3 alert alert-info">{message}</div>}
    </div>
  );
}
