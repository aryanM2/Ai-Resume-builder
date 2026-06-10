import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, ogImage, ogType = 'website', canonicalUrl, schema }) => {
  const defaultTitle = 'ResumeAI - AI-Powered Resume Builder';
  const defaultDescription = 'Create professional resumes in minutes with our AI-powered resume builder. Enhance your summary, job descriptions, and upload existing resumes with AI assistance.';
  const defaultKeywords = 'resume builder, AI resume, professional resume, CV builder, resume templates, job application, career tools';
  const defaultOgImage = '/og-image.png';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title || defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <meta name="author" content="ResumeAI" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title || defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={ogImage || defaultOgImage} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content="ResumeAI" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || defaultTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={ogImage || defaultOgImage} />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#4f46e5" />
      <meta name="msapplication-TileColor" content="#4f46e5" />
      
      {/* Structured Data / JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
