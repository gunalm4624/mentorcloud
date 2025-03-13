import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  is_creator: boolean;
}

interface AuthContextType {
  session: Session | null;
  profile: any;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<{ success: boolean, error?: any }>;
  uploadAvatar: (file: File) => Promise<{ success: boolean, avatarUrl?: string }>;
  becomeCreator: () => Promise<{ success: boolean, error?: any }>;
  saveThemePreference: (themeColor: string) => Promise<{ success: boolean, error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (error) {
            console.error('Error fetching user profile:', error);
          } else {
            setProfile(data);
          }
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (error) {
          console.error('Error fetching user profile:', error);
        } else {
          setProfile(data);
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/app');
    } catch (error: any) {
      console.error('Error signing in:', error.message);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing up:', error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/auth');
    } catch (error: any) {
      console.error('Error signing out:', error.message);
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      if (!session?.user) throw new Error('No user is logged in');
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', session.user.id);
        
      if (error) throw error;
      
      setProfile({
        ...profile,
        ...updates
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
      return { success: false, error };
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      if (!session?.user) throw new Error('No user is logged in');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', session.user.id);
        
      if (updateError) throw updateError;
      
      setProfile({
        ...profile,
        avatar_url: data.publicUrl
      });
      
      return { success: true, avatarUrl: data.publicUrl };
    } catch (error: any) {
      console.error('Error uploading avatar:', error.message);
      return { success: false, error };
    }
  };

  const becomeCreator = async () => {
    try {
      if (!session?.user) throw new Error('No user is logged in');
      
      const { error } = await supabase
        .from('profiles')
        .update({ is_creator: true })
        .eq('id', session.user.id);
        
      if (error) throw error;
      
      setProfile({
        ...profile,
        is_creator: true
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Error becoming creator:', error.message);
      return { success: false, error };
    }
  };

  const saveThemePreference = async (themeColor: string) => {
    try {
      if (!session?.user) throw new Error('No user is logged in');
      
      const { error } = await supabase
        .from('profiles')
        .update({ theme_color: themeColor })
        .eq('id', session.user.id);
        
      if (error) throw error;
      
      setProfile({
        ...profile,
        theme_color: themeColor
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Error saving theme preference:', error.message);
      return { success: false, error };
    }
  };

  const value = {
    session,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    uploadAvatar,
    becomeCreator,
    saveThemePreference
  };

  return (
    <AuthContext.Provider 
      value={value}
    >
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
