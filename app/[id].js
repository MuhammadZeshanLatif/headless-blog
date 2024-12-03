import React from 'react';

async function fetchPost(slug) {
  // Fetch the post data using the slug parameter from the URL
  const res = await fetch(`https://propakistani.pk/wp-json/wp/v2/posts?_embed&slug=${slug}`);
  const post = await res.json();
  return post[0];  // Assuming the API returns an array and we need the first post
}

export default async function BlogPost({ params }) {
  const { slug } = params;  // Destructure the dynamic parameter (slug)
  const post = await fetchPost(slug);  // Fetch the post by its slug

  if (!post) {
    return <div>Post not found</div>;  // Handle if no post is found
  }

  return (
    <div>
      <h1>{post.title.rendered}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
      <img 
        src={post._embedded['wp:featuredmedia'][0].source_url || 'default-image.jpg'} 
        alt="Post image"
      />
    </div>
  );
}
