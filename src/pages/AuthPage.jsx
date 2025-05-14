
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';

const AuthPage = () => {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);

  const { login, register, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(loginUsername, loginPassword);
      navigate('/');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerPassword !== registerConfirmPassword) {
      alert("Şifreler eşleşmiyor!"); 
      return;
    }
    try {
      await register(registerUsername, registerPassword);
      navigate('/');
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, type: "spring", stiffness: 120 } },
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-15rem)] py-12">
      <motion.div variants={cardVariants} initial="hidden" animate="visible">
        <Tabs defaultValue="login" className="w-[400px] sm:w-[450px]">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800 border border-slate-700">
            <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Giriş Yap</TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Kayıt Ol</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card className="bg-slate-800/70 border-slate-700 glassmorphic">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary via-pink-500 to-orange-400">
                  Giriş Yap
                </CardTitle>
                <CardDescription className="text-center text-gray-400">
                  Hesabınıza erişmek için bilgilerinizi girin.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Kullanıcı Adı</Label>
                    <Input 
                      id="login-username" 
                      type="text" 
                      placeholder="kullanici_adiniz" 
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      required 
                      className="bg-slate-700 border-slate-600 text-gray-200 placeholder-gray-500 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Şifre</Label>
                    <div className="relative">
                      <Input 
                        id="login-password" 
                        type={showLoginPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required 
                        className="bg-slate-700 border-slate-600 text-gray-200 placeholder-gray-500 focus:ring-primary pr-10"
                      />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-400 hover:text-gray-200" onClick={() => setShowLoginPassword(!showLoginPassword)}>
                        {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90 text-white" disabled={loading}>
                    {loading ? 'Giriş Yapılıyor...' : <><LogIn className="mr-2 h-4 w-4" /> Giriş Yap</>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="register">
            <Card className="bg-slate-800/70 border-slate-700 glassmorphic">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary via-pink-500 to-orange-400">
                  Hesap Oluştur
                </CardTitle>
                <CardDescription className="text-center text-gray-400">
                  Yeni bir hesap oluşturmak için bilgilerinizi girin.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-username">Kullanıcı Adı</Label>
                    <Input 
                      id="register-username" 
                      type="text" 
                      placeholder="yeni_kullanici_adi" 
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                      required 
                      className="bg-slate-700 border-slate-600 text-gray-200 placeholder-gray-500 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Şifre</Label>
                     <div className="relative">
                        <Input 
                          id="register-password" 
                          type={showRegisterPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          required 
                          className="bg-slate-700 border-slate-600 text-gray-200 placeholder-gray-500 focus:ring-primary pr-10"
                        />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-400 hover:text-gray-200" onClick={() => setShowRegisterPassword(!showRegisterPassword)}>
                          {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </Button>
                      </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Şifreyi Onayla</Label>
                    <div className="relative">
                      <Input 
                        id="register-confirm-password" 
                        type={showRegisterConfirmPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        required 
                        className="bg-slate-700 border-slate-600 text-gray-200 placeholder-gray-500 focus:ring-primary pr-10"
                      />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-400 hover:text-gray-200" onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}>
                        {showRegisterConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90 text-white" disabled={loading}>
                    {loading ? 'Kayıt Olunuyor...' : <><UserPlus className="mr-2 h-4 w-4" /> Kayıt Ol</>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default AuthPage;
  