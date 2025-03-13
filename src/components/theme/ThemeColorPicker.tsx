
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';

type ThemeColor = {
  name: string;
  value: string;
  class: string;
};

const themeColors: ThemeColor[] = [
  { name: 'Black', value: 'black', class: 'theme-black' },
  { name: 'Blue', value: 'blue', class: 'theme-blue' },
  { name: 'Green', value: 'green', class: 'theme-green' },
  { name: 'Red', value: 'red', class: 'theme-red' },
  { name: 'Orange', value: 'orange', class: 'theme-orange' },
  { name: 'Purple', value: 'purple', class: 'theme-purple' },
];

interface ThemeColorPickerProps {
  onThemeChange?: (color: string) => void;
}

export function ThemeColorPicker({ onThemeChange }: ThemeColorPickerProps) {
  const { profile, saveThemePreference } = useAuth();
  const [selectedColor, setSelectedColor] = React.useState<string>(
    profile?.theme_color || 'black'
  );

  const handleColorChange = async (color: string) => {
    setSelectedColor(color);
    
    // Apply the theme class to the document body
    document.documentElement.classList.remove(...themeColors.map(c => c.class));
    document.documentElement.classList.add(`theme-${color}`);
    
    // Save preference if user is logged in
    if (profile) {
      await saveThemePreference(color);
    }
    
    if (onThemeChange) {
      onThemeChange(color);
    }
  };

  // Apply saved theme on component mount
  React.useEffect(() => {
    if (profile?.theme_color) {
      document.documentElement.classList.remove(...themeColors.map(c => c.class));
      document.documentElement.classList.add(`theme-${profile.theme_color}`);
      setSelectedColor(profile.theme_color);
    } else {
      // Default to black theme
      document.documentElement.classList.add('theme-black');
    }
  }, [profile]);

  return (
    <div className="flex flex-col space-y-3">
      <p className="text-sm font-medium">Theme Color</p>
      <div className="flex flex-wrap gap-2">
        {themeColors.map((color) => (
          <Button
            key={color.value}
            type="button"
            variant="outline"
            className={`h-8 w-8 rounded-full p-0 ${color.class}`}
            style={{ backgroundColor: `hsl(var(--theme-color))` }}
            onClick={() => handleColorChange(color.value)}
          >
            <span className="sr-only">{color.name}</span>
            {selectedColor === color.value && (
              <Check className="h-4 w-4 text-theme-color-foreground" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}
