import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Leaf, Globe, Users, Heart } from 'lucide-react';

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', password: '' });

  // Redirect if already logged in
  if (user) {
    setLocation('/');
    return null;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(registerData);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Sustainability Game</h1>
            <p className="text-muted-foreground">Learn about global citizenship while playing</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" data-testid="tab-login">Login</TabsTrigger>
              <TabsTrigger value="register" data-testid="tab-register">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card className="p-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-username">Username</Label>
                    <Input
                      id="login-username"
                      data-testid="input-login-username"
                      value={loginData.username}
                      onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      data-testid="input-login-password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    data-testid="button-login"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card className="p-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="register-username">Username</Label>
                    <Input
                      id="register-username"
                      data-testid="input-register-username"
                      value={registerData.username}
                      onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      data-testid="input-register-password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    data-testid="button-register"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right side - Hero section */}
      <div className="flex-1 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-8 text-white">
        <div className="max-w-md text-center">
          <div className="flex justify-center space-x-4 mb-6">
            <Leaf className="w-12 h-12" />
            <Globe className="w-12 h-12" />
            <Users className="w-12 h-12" />
            <Heart className="w-12 h-12" />
          </div>
          
          <h2 className="text-3xl font-bold mb-4">Learn While You Play</h2>
          <p className="text-lg mb-6 opacity-90">
            Experience an educational Tetris-like game that teaches sustainability and global citizenship through gameplay and sentence challenges.
          </p>
          
          <div className="space-y-3 text-left">
            <div className="flex items-center space-x-3">
              <Leaf className="w-5 h-5 flex-shrink-0" />
              <span>Learn about environmental protection</span>
            </div>
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 flex-shrink-0" />
              <span>Understand global citizenship</span>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 flex-shrink-0" />
              <span>Compete with other learners</span>
            </div>
            <div className="flex items-center space-x-3">
              <Heart className="w-5 h-5 flex-shrink-0" />
              <span>Earn achievement cards via email</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}