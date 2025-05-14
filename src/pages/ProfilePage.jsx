
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Camera, Save, Edit3, ShieldCheck } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUserProfile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState(''); // URL olarak saklanacak
  const [newProfilePictureFile, setNewProfilePictureFile] = useState(null); // Dosya için
  const [previewProfilePicture, setPreviewProfilePicture] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setProfilePicture(user.profilePicture || '');
      setPreviewProfilePicture(user.profilePicture || '');
    }
  }, [user]);

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    let updatedProfilePictureUrl = profilePicture;

    // Eğer yeni bir resim seçildiyse, normalde burası bir upload servisine giderdi.
    // Şimdilik, base64 string'i direkt kaydediyoruz (localStorage için OK, ama ideal değil).
    if (newProfilePictureFile) {
       // Gerçek bir uygulamada, bu base64 string'i bir sunucuya yükleyip URL alırdınız.
       // localStorage için, base64 string'i doğrudan kullanabiliriz.
      updatedProfilePictureUrl = previewProfilePicture; 
    }
    
    try {
      await updateUserProfile({ username, profilePicture: updatedProfilePictureUrl });
      toast({ title: "Profil Güncellendi", description: "Profil bilgileriniz başarıyla kaydedildi." });
      setIsEditing(false);
      setNewProfilePictureFile(null); // Dosyayı sıfırla
    } catch (error) {
      toast({ variant: "destructive", title: "Güncelleme Başarısız", description: error.message });
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
  };

  if (authLoading && !user) {
    return <div className="flex justify-center items-center h-full"><p className="text-gray-300">Yükleniyor...</p></div>;
  }

  if (!user) {
    return <div className="flex justify-center items-center h-full"><p className="text-red-400">Profil bilgilerini görüntülemek için lütfen giriş yapın.</p></div>;
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, type: "spring", stiffness: 100 } },
  };

  return (
    <div className="flex justify-center items-start py-12 min-h-[calc(100vh-15rem)]">
      <motion.div variants={cardVariants} initial="hidden" animate="visible" className="w-full max-w-2xl">
        <Card className="bg-slate-800/70 border-slate-700 glassmorphic shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary via-pink-500 to-orange-400">
              Profil Ayarları
            </CardTitle>
            <CardDescription className="text-gray-400 mt-2">
              Kullanıcı bilgilerinizi ve profil resminizi buradan yönetebilirsiniz.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-6 sm:p-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <Avatar className="h-32 w-32 sm:h-40 sm:w-40 border-4 border-primary shadow-lg">
                  <AvatarImage src={previewProfilePicture || undefined} alt={username} />
                  <AvatarFallback className="text-5xl bg-primary text-primary-foreground">
                    {getInitials(username)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label htmlFor="profile-picture-upload" className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera className="h-10 w-10 text-white" />
                    <input id="profile-picture-upload" type="file" accept="image/*" className="sr-only" onChange={handlePictureChange} />
                  </label>
                )}
              </div>
              {!isEditing && (
                <h2 className="text-2xl font-semibold text-gray-100">{user.username}</h2>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-300">Kullanıcı Adı</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-gray-200 placeholder-gray-500 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => { setIsEditing(false); setPreviewProfilePicture(user.profilePicture || ''); setNewProfilePictureFile(null); }} className="border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white">
                    İptal
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90 text-white" disabled={authLoading}>
                    {authLoading ? 'Kaydediliyor...' : <><Save className="mr-2 h-4 w-4" /> Değişiklikleri Kaydet</>}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                 {/* İleride eklenebilecek diğer bilgiler için yer tutucu */}
                <p className="text-gray-400"><ShieldCheck className="inline mr-2 h-5 w-5 text-green-500" />Hesap {new Date(user.createdAt || Date.now()).toLocaleDateString()} tarihinde oluşturuldu.</p>
                <Button onClick={() => setIsEditing(true)} className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-500/90 hover:to-indigo-600/90 text-white">
                  <Edit3 className="mr-2 h-4 w-4" /> Profili Düzenle
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="text-center text-xs text-gray-500 pt-6 border-t border-slate-700">
            Profil resminizin güncellenmesi biraz zaman alabilir.
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
  