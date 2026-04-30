import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  Download,
  Eye,
  Star,
  FileText,
  Search,
  Zap,
  CheckCircle
} from 'lucide-react';

interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  preview: string;
  downloads: number;
  rating: number;
  features: string[];
  tags: string[];
  isPro?: boolean;
  isNew?: boolean;
}

const templates: ResumeTemplate[] = [
  {
    id: '1',
    name: 'Modern Professional',
    description: 'Clean and contemporary design perfect for tech and creative roles',
    category: 'Professional',
    difficulty: 'Beginner',
    preview: 'https://images.unsplash.com/photo-1586281380349-632531db7cd4?w=400',
    downloads: 15420,
    rating: 4.8,
    features: ['ATS-friendly', 'One-page', 'Modern layout'],
    tags: ['Tech', 'Creative', 'Startup'],
    isNew: true
  },
  {
    id: '2',
    name: 'Executive Classic',
    description: 'Traditional design for senior management and executive positions',
    category: 'Executive',
    difficulty: 'Intermediate',
    preview: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400',
    downloads: 12350,
    rating: 4.9,
    features: ['Two-page option', 'Professional summary', 'Achievement-focused'],
    tags: ['Management', 'Leadership', 'C-level'],
    isPro: true
  },
  {
    id: '3',
    name: 'Creative Portfolio',
    description: 'Eye-catching design for designers, artists, and creative professionals',
    category: 'Creative',
    difficulty: 'Advanced',
    preview: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    downloads: 8934,
    rating: 4.7,
    features: ['Visual portfolio', 'Custom colors', 'Gallery section'],
    tags: ['Design', 'Art', 'Portfolio'],
    isNew: true
  },
  {
    id: '4',
    name: 'Technical Engineer',
    description: 'Optimized for software engineers and technical professionals',
    category: 'Technical',
    difficulty: 'Intermediate',
    preview: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
    downloads: 18765,
    rating: 4.8,
    features: ['Skills section', 'Project highlights', 'GitHub integration'],
    tags: ['Engineering', 'Development', 'IT']
  },
  {
    id: '5',
    name: 'Entry Level Fresh',
    description: 'Perfect for recent graduates and entry-level positions',
    category: 'Entry Level',
    difficulty: 'Beginner',
    preview: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400',
    downloads: 22156,
    rating: 4.6,
    features: ['Education focus', 'Internship section', 'Skills highlight'],
    tags: ['Graduate', 'Internship', 'Junior'],
    isPro: false
  },
  {
    id: '6',
    name: 'Sales Performance',
    description: 'Results-driven template for sales and business development roles',
    category: 'Sales',
    difficulty: 'Intermediate',
    preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    downloads: 9876,
    rating: 4.7,
    features: ['Metrics focus', 'Achievement tracker', 'Commission history'],
    tags: ['Sales', 'Business', 'Revenue'],
    isPro: true
  }
];

const categories = ['All', 'Professional', 'Executive', 'Creative', 'Technical', 'Entry Level', 'Sales'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function ResumeTemplates() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular');
  // Template selection handled by UI interactions

  const filteredTemplates = templates
    .filter(template => {
      const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || template.difficulty === selectedDifficulty;
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesDifficulty && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.downloads - a.downloads;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        default:
          return 0;
      }
    });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleDownload = (template: ResumeTemplate) => {
    // Simulate download
    console.log('Downloading template:', template.name);
  };

  const handlePreview = () => {
    // Preview template functionality
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 bg-linear-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-full"
        >
          <FileText className="w-4 h-4" />
          <span className="text-sm font-medium">Professional Templates</span>
        </motion.div>
        <h1 className="text-4xl font-bold text-slate-900">Resume Templates</h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Choose from our collection of professionally designed resume templates. Each template is ATS-friendly and optimized for maximum impact.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">50+</div>
            <div className="text-sm text-slate-600">Templates</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">100K+</div>
            <div className="text-sm text-slate-600">Downloads</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">4.8</div>
            <div className="text-sm text-slate-600">Avg Rating</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">98%</div>
            <div className="text-sm text-slate-600">ATS Success</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white"
          >
            {difficulties.map(diff => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'popular' | 'rating' | 'newest')}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img
                  src={template.preview}
                  alt={template.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  {template.isNew && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      NEW
                    </span>
                  )}
                  {template.isPro && (
                    <span className="bg-linear-to-r from-yellow-400 to-orange-400 text-white text-xs px-2 py-1 rounded-full">
                      PRO
                    </span>
                  )}
                </div>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  {template.category}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{template.name}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{template.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(template.difficulty)}`}>
                      {template.difficulty}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span>{template.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Download className="w-3 h-3" />
                      <span>{template.downloads.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs text-slate-500">
                      Features: {template.features.slice(0, 2).join(', ')}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={handlePreview}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(template)}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Resume Tips & Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900">ATS Optimization</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  Use standard fonts and formatting
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  Include relevant keywords from job descriptions
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  Avoid images and complex layouts
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900">Content Structure</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  Start with a strong professional summary
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  Use action verbs and quantify achievements
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  Keep it concise and relevant
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900">Design Principles</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  Maintain consistent formatting
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  Use white space effectively
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  Ensure readability on all devices
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
