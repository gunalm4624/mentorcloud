
import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Upload, Plus } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { ThemeColorPicker } from '@/components/theme/ThemeColorPicker';

const ProfilePage = () => {
  const { profile, isLoading, updateProfile, uploadAvatar, becomeCreator } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = async () => {
    await updateProfile({ full_name: fullName });
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      await uploadAvatar(file);
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        </div>
        <div className="grid gap-6">
          <div className="rounded-lg border bg-card p-6 flex items-center justify-center">
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            Edit Profile
          </Button>
        )}
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Manage your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-6 md:items-start">
              <div className="relative">
                <Avatar 
                  className="h-24 w-24 cursor-pointer ring-2 ring-theme-color/20"
                  onClick={handleAvatarClick}
                >
                  <AvatarImage 
                    src={profile?.avatar_url || ''} 
                    alt={profile?.full_name || 'User'} 
                  />
                  <AvatarFallback className="bg-theme-color/10 text-theme-color text-xl">
                    {profile?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
                  </div>
                )}
                <div className="absolute bottom-0 right-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full theme-bg">
                    <Upload className="h-4 w-4" />
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*"
                  />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName" 
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)} 
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleSaveProfile} className="theme-bg">Save Changes</Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsEditing(false);
                          setFullName(profile?.full_name || '');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">{profile?.full_name || 'User'}</h3>
                      <p className="text-muted-foreground">{profile?.id}</p>
                      <div className="flex mt-2">
                        {profile?.is_creator ? (
                          <Badge className="theme-bg">Creator</Badge>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center"
                            onClick={becomeCreator}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Become a Creator
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {profile?.is_creator && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="font-semibold mb-4">Creator Settings</h3>
                <ThemeColorPicker />
              </div>
            )}
          </CardContent>
        </Card>

        {profile?.is_creator && (
          <Card>
            <CardHeader>
              <CardTitle>Creator Dashboard</CardTitle>
              <CardDescription>Manage your courses and mentorships</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Your Courses</h3>
                  <p className="text-muted-foreground text-sm my-2">Create and manage your courses</p>
                  <Button className="w-full mt-2 theme-bg">Manage Courses</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Your Mentorships</h3>
                  <p className="text-muted-foreground text-sm my-2">Set up and manage mentorship sessions</p>
                  <Button className="w-full mt-2 theme-bg">Manage Mentorships</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
