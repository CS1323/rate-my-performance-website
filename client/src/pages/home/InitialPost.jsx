import { useTranslation } from 'react-i18next';
import './InitialPost.css';
import { getImageUrl } from '../../config/api';

export function InitialPost({ post }) {
  const { t } = useTranslation();

  // Safely handle null/undefined post
  if (!post) {
    return (
      <section className="initial-post">
        <div className="initial-post-title">{t('post.loading')}</div>
      </section>
    );
  }

  const imageUrl = getImageUrl(post.image);

  return (
    <section className="initial-post">
      <div className="initial-post-title">
        {post.title}
      </div>

      {post.image && (
        <div className="initial-post-image">
          <img 
            src={imageUrl} 
            alt={post.title} 
            loading="eager"
            fetchPriority="high"
          />
        </div>
      )}

      <div className="initial-post-comment">
        {post.content.split('\n').filter(Boolean).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <div className="initial-post-instructions">
        <h3>{t('post.howToJoin')}</h3>
        <p>{t('post.instructions1')}</p>
        <p>{t('post.instructions2')}</p>
      </div>
    </section>
  );
}