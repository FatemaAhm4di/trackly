import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Dashboard() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Dashboard</h1>
      <Card>
        <CardContent>
          <h2>Welcome to Trackly</h2>
          <Button>Try It</Button>
        </CardContent>
      </Card>
    </div>
  );
}