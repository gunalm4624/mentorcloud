
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '@/integrations/firebase/client';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  is_creator: boolean;
  theme_color?: string;
}

interface AuthContextType {
  session: FirebaseUser | null;
  user: FirebaseUser | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<{ success: boolean, error?: any }>;
  uploadAvatar: (file: File) => Promise<{ success: boolean, avatarUrl?: string }>;
  becomeCreator: () => Promise<{ success: boolean, error?: any }>;
  saveThemePreference: (themeColor: string) => Promise<{ success: boolean, error?: any }>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize user profiles in local storage if not exists
  const initializeUserProfiles = () => {
    if (!localStorage.getItem('userProfiles')) {
      localStorage.setItem('userProfiles', JSON.stringify({}));
    }
  };

  // Save profile to local storage
  const saveProfileToStorage = (userId: string, profileData: Profile) => {
    const profiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
    profiles[userId] = profileData;
    localStorage.setItem('userProfiles', JSON.stringify(profiles));
  };

  // Get profile from local storage
  const getProfileFromStorage = (userId: string) => {
    const profiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
    return profiles[userId] || null;
  };

  // Create or update profile in Supabase
  const syncProfileWithSupabase = async (user: FirebaseUser, profileData: Profile) => {
    try {
      // Check if profile exists in Supabase
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.uid)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking profile in Supabase:', fetchError);
        return;
      }

      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            full_name: profileData.full_name,
            avatar_url: profileData.avatar_url,
            is_creator: profileData.is_creator,
            theme_color: profileData.theme_color
          })
          .eq('id', user.uid);

        if (updateError) {
          console.error('Error updating profile in Supabase:', updateError);
        }
      } else {
        // Insert new profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{
            id: user.uid,
            full_name: profileData.full_name,
            avatar_url: profileData.avatar_url,
            is_creator: profileData.is_creator || false,
            theme_color: profileData.theme_color || 'black'
          }]);

        if (insertError) {
          console.error('Error inserting profile in Supabase:', insertError);
        }
      }
    } catch (error) {
      console.error('Error syncing profile with Supabase:', error);
    }
  };

  useEffect(() => {
    initializeUserProfiles();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setSession(user);
      
      if (user) {
        // Check if we have a profile in local storage
        let userProfile = getProfileFromStorage(user.uid);
        
        if (!userProfile) {
          // Create a new profile if one doesn't exist
          userProfile = {
            id: user.uid,
            full_name: user.displayName,
            avatar_url: user.photoURL,
            is_creator: false,
            theme_color: 'black'
          };
          saveProfileToStorage(user.uid, userProfile);
        }
        
        setProfile(userProfile);
        
        // Sync profile with Supabase
        syncProfileWithSupabase(user, userProfile);
      } else {
        setProfile(null);
      }
      
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/app');
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    } catch (error: any) {
      console.error('Error signing in:', error.message);
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message,
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's profile with their full name
      await updateProfile(user, {
        displayName: fullName
      });
      
      // Create a new profile in local storage
      const newProfile = {
        id: user.uid,
        full_name: fullName,
        avatar_url: null,
        is_creator: false,
        theme_color: 'black'
      };
      
      saveProfileToStorage(user.uid, newProfile);
      setProfile(newProfile);
      
      // Sync with Supabase
      await syncProfileWithSupabase(user, newProfile);
      
      toast({
        title: "Account created!",
        description: "Your account has been successfully created.",
      });
    } catch (error: any) {
      console.error('Error signing up:', error.message);
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message,
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      navigate('/auth');
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message,
      });
    }
  };

  const updateProfileFn = async (updates: any) => {
    try {
      if (!session) throw new Error('No user is logged in');
      
      // Update the profile in local storage
      const currentProfile = getProfileFromStorage(session.uid);
      const updatedProfile = { ...currentProfile, ...updates };
      saveProfileToStorage(session.uid, updatedProfile);
      
      // Update the profile state
      setProfile(updatedProfile);
      
      // Sync with Supabase
      await syncProfileWithSupabase(session, updatedProfile);
      
      return { success: true };
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
      return { success: false, error };
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      if (!session) throw new Error('No user is logged in');
      
      // In a real implementation, you would upload the file to Firebase Storage
      // For now, we'll use a data URL as a placeholder
      const reader = new FileReader();
      
      return new Promise<{ success: boolean, avatarUrl?: string }>((resolve) => {
        reader.onload = async (e) => {
          const dataUrl = e.target?.result as string;
          
          // Update Firebase user profile
          await updateProfile(session, {
            photoURL: dataUrl
          });
          
          // Update local profile
          await updateProfileFn({ avatar_url: dataUrl });
          
          resolve({ success: true, avatarUrl: dataUrl });
        };
        
        reader.readAsDataURL(file);
      });
    } catch (error: any) {
      console.error('Error uploading avatar:', error.message);
      return { success: false, error };
    }
  };

  const becomeCreator = async () => {
    try {
      if (!session) throw new Error('No user is logged in');
      
      const result = await updateProfileFn({ is_creator: true });
      
      if (result.success) {
        toast({
          title: "You're now a creator!",
          description: "You can now create and publish courses.",
        });
      }
      
      return result;
    } catch (error: any) {
      console.error('Error becoming creator:', error.message);
      return { success: false, error };
    }
  };

  const saveThemePreference = async (themeColor: string) => {
    try {
      if (!session) throw new Error('No user is logged in');
      
      const result = await updateProfileFn({ theme_color: themeColor });
      
      if (result.success) {
        toast({
          title: "Theme updated",
          description: `Your theme color has been set to ${themeColor}.`,
        });
      }
      
      return result;
    } catch (error: any) {
      console.error('Error saving theme preference:', error.message);
      return { success: false, error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if we have a profile for this user
      let userProfile = getProfileFromStorage(user.uid);
      
      if (!userProfile) {
        // Create a new profile if one doesn't exist
        userProfile = {
          id: user.uid,
          full_name: user.displayName,
          avatar_url: user.photoURL,
          is_creator: false,
          theme_color: 'black'
        };
        saveProfileToStorage(user.uid, userProfile);
        
        // Sync with Supabase
        await syncProfileWithSupabase(user, userProfile);
      }
      
      setProfile(userProfile);
      navigate('/app');
      
      toast({
        title: "Welcome!",
        description: "You've successfully signed in with Google.",
      });
    } catch (error: any) {
      console.error('Google sign-in error:', error.message);
      toast({
        variant: "destructive",
        title: "Google sign-in failed",
        description: error.message,
      });
    }
  };

  const value = {
    session,
    user: session,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile: updateProfileFn,
    uploadAvatar,
    becomeCreator,
    saveThemePreference,
    signInWithGoogle
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
