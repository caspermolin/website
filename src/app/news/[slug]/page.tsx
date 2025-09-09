import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, Clock, Share2 } from 'lucide-react';
import { newsPosts } from '@/data/news';

interface NewsPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return newsPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const post = newsPosts.find((p) => p.slug === params.slug);
  
  if (!post) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: [
      post.title,
      post.category,
      ...post.tags,
      'audio post production',
      'Posta Vermaas news'
    ],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: [
        {
          url: post.heroImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

export default function NewsPage({ params }: NewsPageProps) {
  const post = newsPosts.find((p) => p.slug === params.slug);
  
  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
  };

  const currentIndex = newsPosts.findIndex((p) => p.slug === params.slug);
  const prevPost = currentIndex > 0 ? newsPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < newsPosts.length - 1 ? newsPosts[currentIndex + 1] : null;

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="relative h-96 lg:h-[500px] overflow-hidden">
        <Image
          src={post.heroImage}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container-custom pb-12">
            <div className="max-w-4xl">
              <div className="flex items-center space-x-4 text-white/80 text-sm mb-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(post.publishedAt)}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatReadingTime(post.content)}
                </div>
                <span className="bg-accent-600 px-3 py-1 rounded-full">
                  {post.category}
                </span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                {post.title}
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Article Meta */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-8 border-b border-neutral-200">
              <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-4 sm:mb-0">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Published {formatDate(post.publishedAt)}
                </div>
                {post.updatedAt !== post.publishedAt && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Updated {formatDate(post.updatedAt)}
                  </div>
                )}
              </div>
              <button className="btn-ghost text-sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-lg text-neutral-600 leading-relaxed mb-8">
                {post.excerpt}
              </div>
              
              <div className="whitespace-pre-line text-neutral-700 leading-relaxed">
                {post.content}
              </div>
            </div>

            {/* Related Articles */}
            <div className="mt-16 pt-8 border-t border-neutral-200">
              <h3 className="text-2xl font-semibold text-neutral-900 mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {newsPosts
                  .filter(p => p.id !== post.id && p.category === post.category)
                  .slice(0, 2)
                  .map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={`/news/${relatedPost.slug}`}
                      className="group card-hover"
                    >
                      <div className="relative overflow-hidden rounded-t-xl">
                        <Image
                          src={relatedPost.heroImage}
                          alt={relatedPost.title}
                          width={400}
                          height={250}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-accent-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {relatedPost.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h4 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2">
                          {relatedPost.title}
                        </h4>
                        <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center text-sm text-neutral-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(relatedPost.publishedAt)}
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-neutral-50 py-12">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              {prevPost ? (
                <Link
                  href={`/news/${prevPost.slug}`}
                  className="btn-secondary group"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                  Previous
                </Link>
              ) : (
                <div className="btn-secondary opacity-50 cursor-not-allowed">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </div>
              )}
            </div>

            <Link
              href="/news"
              className="btn-ghost"
            >
              View All News
            </Link>

            <div className="flex items-center space-x-4">
              {nextPost ? (
                <Link
                  href={`/news/${nextPost.slug}`}
                  className="btn-secondary group"
                >
                  Next
                  <ArrowLeft className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              ) : (
                <div className="btn-secondary opacity-50 cursor-not-allowed">
                  Next
                  <ArrowLeft className="w-4 h-4 ml-2" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
