// pages/api/submitComment.js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { postId, content, author_name, author_email, author_url } = req.body;

    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'u262237041_vgSHP',
      password: 'sm32DfDum8',
      database: 'u262237041_YhPr2',
    });

    try {
      const [rows] = await connection.execute(
        'INSERT INTO wp_comments (comment_post_ID, comment_content, comment_author, comment_author_email, comment_author_url, comment_date) VALUES (?, ?, ?, ?, ?, NOW())',
        [postId, content, author_name, author_email, author_url]
      );

      res.status(200).json({ message: 'Comment submitted successfully!' });
    } catch (error) {
      console.error('Error submitting comment:', error);
      res.status(500).json({ message: 'Failed to submit comment.', error });
    } finally {
      await connection.end();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
