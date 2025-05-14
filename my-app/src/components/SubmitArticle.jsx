// import React, { useState } from 'react';

// export default function SubmitArticle({ activeTab, setActiveTab }) {
//   const [formData, setFormData] = useState({
//     title: '',
//     category: '',
//     content: '',
//     tags: '',
//     confirm: false
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Form submitted:', formData);
//     // Здесь можно добавить отправку на сервер
//   };

//   return (
//     <div className="container">
//       {/* Вкладки */}
//       <div className="tabs">
//         <div 
//           className={`tab ${activeTab === 'profile' ? 'active' : ''}`} 
//           onClick={() => setActiveTab('profile')}
//         >
//           Profile
//         </div>
//         <div 
//           className={`tab ${activeTab === 'articles' ? 'active' : ''}`} 
//           onClick={() => setActiveTab('articles')}
//         >
//           My Articles
//         </div>
//         <div 
//           className={`tab ${activeTab === 'submit' ? 'active' : ''}`} 
//           onClick={() => setActiveTab('submit')}
//         >
//           Submit Article
//         </div>
//       </div>

//       {/* Форма отправки статьи */}
//       <section className="form-section">
//         <h2 className="form-title">Submit Article for Review</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label className="form-label">Article Title</label>
//             <input 
//               type="text" 
//               className="form-input" 
//               placeholder="Enter article title"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label className="form-label">Category</label>
//             <select 
//               className="form-select"
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select a category</option>
//               <option value="Technology">Technology</option>
//               <option value="Healthcare">Healthcare</option>
//               <option value="Environment">Environment</option>
//             </select>
//           </div>

//           <div className="form-group">
//             <label className="form-label">Article Content</label>
//             <textarea 
//               className="form-textarea" 
//               placeholder="Write your article content here..."
//               name="content"
//               value={formData.content}
//               onChange={handleChange}
//               required
//             ></textarea>
//           </div>

//           <div className="form-group">
//             <label className="form-label">Tags</label>
//             <input 
//               type="text" 
//               className="form-input" 
//               placeholder="Enter tags separated by commas"
//               name="tags"
//               value={formData.tags}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="checkbox-group">
//             <input 
//               type="checkbox" 
//               id="confirm" 
//               name="confirm"
//               checked={formData.confirm}
//               onChange={handleChange}
//               required
//             />
//             <label htmlFor="confirm">
//               I confirm that this article is my original work and agree to the submission guidelines.
//             </label>
//           </div>

//           <div className="button-group">
//             <button type="submit" className="btn btn-primary">Submit for Review</button>
//             <button type="button" className="btn btn-secondary">Save Draft</button>
//           </div>
//         </form>
//       </section>
//     </div>
//   );
// }