import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  category: string;
  tags: string[];
  readTime: string;
  featured: boolean;
  coverImage: string;
  likes: number;
  comments: number;
  views: number;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: '10 Essential Tips for Remote Work Success',
    excerpt: 'Learn how to thrive in a remote work environment with these proven strategies.',
    content: 'Full article content here...',
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
    },
    publishedAt: '2024-01-15',
    category: 'Remote Work',
    tags: ['remote', 'productivity', 'work-life balance'],
    readTime: '5 min read',
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=200&fit=crop',
    likes: 234,
    comments: 45,
    views: 1523
  },
  {
    id: '2',
    title: 'How to Negotiate Your Salary Like a Pro',
    excerpt: 'Master the art of salary negotiation with these expert techniques.',
    content: 'Full article content here...',
    author: {
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    },
    publishedAt: '2024-01-12',
    category: 'Negotiation',
    tags: ['salary', 'negotiation', 'career'],
    readTime: '8 min read',
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1554224154-260325c0ce47?w=400&h=200&fit=crop',
    likes: 189,
    comments: 32,
    views: 987
  }
];

export default function CareerBlog() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Career Blog</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert advice, insights, and strategies to advance your career and land your dream job.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Blog Posts */}
          <div className="lg:col-span-2 space-y-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-blue-600">{post.category}</span>
                        <span className="text-sm text-gray-500">·</span>
                        <span className="text-sm text-gray-500">{post.readTime}</span>
                      </div>
                      <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                      <p className="text-gray-600">{post.excerpt}</p>
                    </div>
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-32 h-32 object-cover rounded-lg ml-4"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="text-sm font-medium">{post.author.name}</p>
                          <p className="text-sm text-gray-500">{post.publishedAt}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{post.views} views</span>
                      <span>{post.likes} likes</span>
                      <span>{post.comments} comments</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Newsletter */}
            <Card>
              <CardHeader>
                <CardTitle>Stay Updated</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Get the latest career advice and job search tips delivered to your inbox.
                </p>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full"
                />
                <Button className="w-full">
                  Subscribe Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}