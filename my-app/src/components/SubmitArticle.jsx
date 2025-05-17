import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config';

const SubmitArticle = ({ authorId = 1, ...props }) => {
  const [form, setForm] = useState({
    title: '',
    category: '',
    content: '',
    tags: '',
    confirm: false,
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // При монтировании проверяем, есть ли черновик в localStorage
    const draft = localStorage.getItem('articleDraft');
    if (draft) {
      setForm(JSON.parse(draft));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm(prev => ({ ...prev, file }));
  };

  const handleSaveDraft = () => {
    localStorage.setItem('articleDraft', JSON.stringify(form));
    setSuccess(false);
    setError('Draft saved locally!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');
    try {
      const res = await fetch(API_ENDPOINTS.ARTICLES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.content,
          authorId,
          status: 'NotReviewed',
          category: form.category,
          tags: form.tags
        })
      });
      if (res.ok) {
        setSuccess(true);
        setForm({ title: '', content: '', category: '', tags: '', confirm: false, file: null });
        localStorage.removeItem('articleDraft');
        if (typeof props?.onArticleAdded === 'function') props.onArticleAdded();
      } else {
        setError('Ошибка при отправке статьи.');
      }
    } catch (err) {
      setError('Ошибка при отправке статьи.');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="form-section">
        <h2 className="form-title">Submit New Article</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Article Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter article title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Environment">Environment</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Article Content</label>
            <textarea
              className="form-textarea"
              placeholder="Write your article content here..."
              name="content"
              value={form.content}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label className="form-label">Tags</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter tags separated by commas"
              name="tags"
              value={form.tags}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Upload File</label>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="form-input"
            />
          </div>
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="confirm"
              name="confirm"
              checked={form.confirm}
              onChange={handleChange}
              required
            />
            <label htmlFor="confirm">
              I confirm that this article is my original work and agree to the submission guidelines.
            </label>
          </div>
          <div className="button-group">
            <button type="submit" className="btn btn-primary" disabled={loading}>Submit for Review</button>
            <button type="button" className="btn btn-secondary" onClick={handleSaveDraft} disabled={loading}>Save Draft</button>
          </div>
          {success && <div style={{color:'green', marginTop:8}}>Article submitted successfully!</div>}
          {error && <div style={{color:'red', marginTop:8}}>{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default SubmitArticle;