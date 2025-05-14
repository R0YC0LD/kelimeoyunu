
import React, { createContext, useState, useEffect, useContext } from 'react';
import { storage } from '@/lib/storage';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = storage.getItem('user');
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = storage.getItem('users') || [];
        const existingUser = users.find(u => u.username === username && u.password === password);

        if (existingUser) {
          const userData = { id: existingUser.id, username: existingUser.username, profilePicture: existingUser.profilePicture };
          storage.setItem('user', userData);
          setUser(userData);
          toast({ title: "Giriş Başarılı", description: `Hoşgeldin, ${username}!` });
          setLoading(false);
          resolve(userData);
        } else {
          toast({ variant: "destructive", title: "Giriş Başarısız", description: "Kullanıcı adı veya şifre hatalı." });
          setLoading(false);
          reject(new Error("Kullanıcı adı veya şifre hatalı."));
        }
      }, 500);
    });
  };

  const register = (username, password) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let users = storage.getItem('users') || [];
        if (users.find(u => u.username === username)) {
          toast({ variant: "destructive", title: "Kayıt Başarısız", description: "Bu kullanıcı adı zaten mevcut." });
          setLoading(false);
          reject(new Error("Bu kullanıcı adı zaten mevcut."));
          return;
        }
        const newUser = { 
          id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, 
          username, 
          password, // Gerçek uygulamada şifreler hashlenmeli!
          profilePicture: '', // Varsayılan profil resmi yok
          createdAt: new Date().toISOString()
        };
        users.push(newUser);
        storage.setItem('users', users);
        
        const userData = { id: newUser.id, username: newUser.username, profilePicture: newUser.profilePicture };
        storage.setItem('user', userData);
        setUser(userData);
        toast({ title: "Kayıt Başarılı", description: `Hesabınız oluşturuldu, ${username}!` });
        setLoading(false);
        resolve(userData);
      }, 500);
    });
  };

  const logout = () => {
    storage.removeItem('user');
    setUser(null);
    toast({ title: "Çıkış Yapıldı", description: "Başarıyla çıkış yaptınız." });
  };
  
  const updateUserProfile = (updatedData) => {
    if (!user) return Promise.reject(new Error("Kullanıcı bulunamadı."));
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let users = storage.getItem('users') || [];
        const userIndex = users.findIndex(u => u.id === user.id);

        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...updatedData };
          storage.setItem('users', users);
          
          const updatedUser = { ...user, ...updatedData };
          storage.setItem('user', updatedUser);
          setUser(updatedUser);
          
          toast({ title: "Profil Güncellendi", description: "Profil bilgileriniz başarıyla güncellendi." });
          setLoading(false);
          resolve(updatedUser);
        } else {
          toast({ variant: "destructive", title: "Güncelleme Başarısız", description: "Kullanıcı bulunamadı." });
          setLoading(false);
          reject(new Error("Kullanıcı bulunamadı."));
        }
      }, 500);
    });
  };


  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
  