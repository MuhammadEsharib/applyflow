import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Card className="max-w-md w-full text-center">
        <CardContent className="p-8">
          <div className="text-6xl font-bold text-black mb-4">404</div>
          <h1 className="text-2xl font-bold mb-2 text-black">Page Not Found</h1>
          <p className="text-black/70 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button onClick={() => navigate('/dashboard')}>
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
