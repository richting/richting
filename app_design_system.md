# 📱 RICHTING APP - DESIGN SYSTEM
## Complete Implementation Guide voor de App

**Version:** 1.0  
**Last Updated:** Februari 2026  
**Platform:** React Native (iOS/Android) + Next.js (Web)  
**Voor:** Developers & Designers  

---

## 📚 INHOUDSOPGAVE

1. [App Overview](#app-overview)
2. [Design Tokens](#design-tokens)
3. [Component Library](#component-library)
4. [Screen Patterns](#screen-patterns)
5. [Scout Integration](#scout-integration)
6. [Animations & Interactions](#animations)
7. [Accessibility](#accessibility)
8. [Platform-Specific Guidelines](#platform-specific)

---

## 1. APP OVERVIEW {#app-overview}

### 1.1 App Identity

**Naam:** Richting  
**Tagline:** Ontdek jouw richting  
**Type:** Career Discovery App  
**Doelgroep:** Nederlandse jongeren 13-18 jaar  
**Platforms:** iOS, Android, Web  

### 1.2 Core Experience

De app bestaat uit 5 hoofdmodules die de gebruiker doorloopt:

```
Onboarding → RIASEC Swipe → Big Five Test → Werkwaarden → SCCT Scanner → Resultaten
     ↓          ↓              ↓              ↓            ↓             ↓
  Welkom    Interesses    Persoonlijkheid  Waarden    Skills       Matches
```

**Design Principes:**
1. **Mobile-First** - Gebouwd voor smartphone, desktop is bonus
2. **One-Hand Friendly** - Knoppen binnen duimbereik (bottom 2/3)
3. **Swipe-Driven** - Natuurlijke swipe gestures, niet alleen taps
4. **Progressive Disclosure** - 1 vraag/taak per scherm
5. **Instant Feedback** - Direct visuele response op elke actie

### 1.3 Information Architecture

```
App Shell
├── Navigation (Bottom Tab Bar)
│   ├── 🏠 Home (Dashboard)
│   ├── 🧭 Ontdek (Assessments)
│   ├── 📊 Resultaten (Matches)
│   └── ⚙️ Profiel (Settings)
├── Scout (Floating, always visible)
└── Modals (Overlays for details)
```

---

## 2. DESIGN TOKENS {#design-tokens}

### 2.1 Color Tokens

**Implementation:** Tailwind CSS + CSS Variables

```css
/* tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      colors: {
        // Primary
        blue: {
          50:  '#F0F7FF',
          100: '#E0F0FF',
          200: '#B8DDFF',
          300: '#8AC6FF',
          400: '#5CAFFF',
          500: '#4A90E2', // Vibrant Blue (brand primary)
          600: '#3B7DD6',
          700: '#2D6AC4',
          800: '#1F57B2',
          900: '#11449F',
        },
        coral: {
          50:  '#FFF5F5',
          100: '#FFE5E5',
          200: '#FFC7C7',
          300: '#FFA9A9',
          400: '#FF8B8B',
          500: '#FF6B6B', // Energetic Coral (brand accent)
          600: '#FF4D4D',
          700: '#FF2F2F',
          800: '#E61111',
          900: '#C70000',
        },
        // Secondary
        purple: {
          500: '#9B6DD6',
        },
        green: {
          500: '#4ECDC4',
        },
        yellow: {
          500: '#FFE66D',
        },
        // Neutrals
        gray: {
          50:  '#F8F9FA', // Background
          100: '#E8EEF2', // Border
          200: '#D1D9E0',
          300: '#B8C2CC',
          400: '#9FAAB8',
          500: '#7A8A99', // Tertiary text
          600: '#5A6C7D', // Secondary text
          700: '#465663',
          800: '#2C3E50', // Primary text
          900: '#1A252F',
        },
      },
    },
  },
}
```

**CSS Variables (for React Native):**
```css
:root {
  /* Primary */
  --color-blue-500: #4A90E2;
  --color-blue-600: #3B7DD6;
  --color-coral-500: #FF6B6B;
  
  /* Neutrals */
  --color-gray-50: #F8F9FA;
  --color-gray-600: #5A6C7D;
  --color-gray-800: #2C3E50;
  
  /* Semantic */
  --color-success: #4ECDC4;
  --color-warning: #FF8E53;
  --color-error: #FF6B6B;
  --color-info: #4A90E2;
}
```

### 2.2 Typography Tokens

**Font Loading:**
```tsx
// app/_layout.tsx (Expo)
import { useFonts } from 'expo-font';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
  });
  
  if (!fontsLoaded) return <SplashScreen />;
  return <Navigation />;
}
```

**Type Scale (Mobile-Optimized):**
```tsx
// tokens/typography.ts
export const typography = {
  // Headings
  h1: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,      // Smaller than desktop (was 48px)
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.25,
  },
  h3: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0,
  },
  h4: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: 0,
  },
  
  // Body
  bodyLarge: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    lineHeight: 28,
  },
  body: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  bodySmall: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  
  // UI
  button: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  caption: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.25,
  },
};
```

**Tailwind Classes (Web):**
```html
<!-- H1 -->
<h1 class="font-poppins font-bold text-4xl leading-tight tracking-tight text-gray-800">

<!-- Body -->
<p class="font-inter text-base leading-relaxed text-gray-600">

<!-- Button -->
<button class="font-inter font-medium text-base tracking-wide">
```

### 2.3 Spacing Tokens

**8-Point Grid System:**
```tsx
// tokens/spacing.ts
export const spacing = {
  0: 0,
  1: 4,    // 0.25rem
  2: 8,    // 0.5rem
  3: 12,   // 0.75rem
  4: 16,   // 1rem
  5: 20,   // 1.25rem
  6: 24,   // 1.5rem
  8: 32,   // 2rem
  10: 40,  // 2.5rem
  12: 48,  // 3rem
  16: 64,  // 4rem
  20: 80,  // 5rem
};

// Usage in React Native
<View style={{ padding: spacing[4], marginBottom: spacing[6] }} />

// Usage in Tailwind
<div class="p-4 mb-6"></div>
```

### 2.4 Border Radius Tokens

```tsx
// tokens/radius.ts
export const radius = {
  none: 0,
  xs: 4,   // Tags, small elements
  sm: 8,   // Inputs, small buttons
  md: 12,  // Standard buttons
  lg: 16,  // Cards
  xl: 24,  // Modals, large containers
  full: 9999, // Pills, avatars
};
```

### 2.5 Shadow Tokens

```tsx
// tokens/shadows.ts
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0, // Android
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
};
```

---

## 3. COMPONENT LIBRARY {#component-library}

### 3.1 Buttons

**Primary Button:**
```tsx
// components/ui/Button.tsx
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'text';
}

export function Button({ 
  title, 
  onPress, 
  disabled, 
  loading,
  variant = 'primary' 
}: ButtonProps) {
  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={styles.buttonContainer}
      >
        <LinearGradient
          colors={['#4A90E2', '#3B7DD6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.button, 
            disabled && styles.buttonDisabled
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }
  
  // Secondary & Text variants...
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    // iOS Shadow
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    // Android Shadow
    elevation: 4,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56, // Touch target
  },
  buttonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
```

**Web Version (Tailwind):**
```tsx
// components/ui/Button.tsx (Next.js)
export function Button({ 
  children, 
  variant = 'primary',
  ...props 
}: ButtonProps) {
  const baseClasses = "px-8 py-4 rounded-xl font-inter font-medium text-base transition-all duration-200";
  
  const variants = {
    primary: "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0",
    secondary: "bg-white text-blue-500 border-2 border-blue-500 hover:bg-gray-50",
    text: "bg-transparent text-blue-500 hover:bg-gray-50",
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

### 3.2 Cards

**Swipe Card (RIASEC):**
```tsx
// components/assessments/SwipeCard.tsx
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

interface SwipeCardProps {
  title: string;
  tagline: string;
  imageUrl: string;
  sectors: string[];
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export function SwipeCard({ 
  title, 
  tagline, 
  imageUrl, 
  sectors,
  onSwipeLeft,
  onSwipeRight 
}: SwipeCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotateZ = useSharedValue(0);
  
  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      rotateZ.value = event.translationX / 20; // Rotate while dragging
    },
    onEnd: (event) => {
      if (Math.abs(event.translationX) > 120) {
        // Swipe threshold exceeded
        if (event.translationX > 0) {
          runOnJS(onSwipeRight)();
        } else {
          runOnJS(onSwipeLeft)();
        }
        // Animate off screen
        translateX.value = withSpring(event.translationX > 0 ? 500 : -500);
      } else {
        // Spring back to center
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        rotateZ.value = withSpring(0);
      }
    },
  });
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotateZ: `${rotateZ.value}deg` },
    ],
  }));
  
  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Image source={{ uri: imageUrl }} style={styles.cardImage} />
        
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardTagline}>{tagline}</Text>
          
          <View style={styles.sectorTags}>
            {sectors.map((sector) => (
              <View key={sector} style={styles.tag}>
                <Text style={styles.tagText}>{sector}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Swipe indicators */}
        <Animated.View style={[styles.likeIndicator, likeOpacity]}>
          <Text style={styles.indicatorText}>✓</Text>
        </Animated.View>
        <Animated.View style={[styles.nopeIndicator, nopeOpacity]}>
          <Text style={styles.indicatorText}>✗</Text>
        </Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH - 48, // 24px padding on each side
    height: SCREEN_HEIGHT * 0.65,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  cardImage: {
    width: '100%',
    height: '60%',
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#2C3E50',
    marginBottom: 8,
  },
  cardTagline: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#5A6C7D',
    marginBottom: 16,
  },
  sectorTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#4A90E2',
  },
  likeIndicator: {
    position: 'absolute',
    top: 40,
    right: 40,
    backgroundColor: '#4ECDC4',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '20deg' }],
  },
  nopeIndicator: {
    position: 'absolute',
    top: 40,
    left: 40,
    backgroundColor: '#FF6B6B',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-20deg' }],
  },
  indicatorText: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
```

**Standard Card:**
```tsx
// components/ui/Card.tsx
export function Card({ children, onPress }: CardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.95}
      style={styles.card}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
});
```

### 3.3 Input Fields

**Text Input:**
```tsx
// components/ui/Input.tsx
export function Input({ 
  label, 
  value, 
  onChangeText,
  error,
  ...props 
}: InputProps) {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[
          styles.input,
          error && styles.inputError
        ]}
        placeholderTextColor="#7A8A99"
        {...props}
      />
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#2C3E50',
    marginBottom: 8,
    letterSpacing: 0.25,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E8EEF2',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#2C3E50',
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#FF6B6B',
    marginTop: 4,
  },
});
```

**Slider:**
```tsx
// components/ui/Slider.tsx
import Slider from '@react-native-community/slider';

export function CustomSlider({ 
  label,
  value, 
  onValueChange,
  min = 1,
  max = 10 
}: SliderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}/10</Text>
      </View>
      
      <Slider
        value={value}
        onValueChange={onValueChange}
        minimumValue={min}
        maximumValue={max}
        step={1}
        minimumTrackTintColor="#4A90E2"
        maximumTrackTintColor="#E8EEF2"
        thumbTintColor="#FFFFFF"
        style={styles.slider}
      />
      
      <View style={styles.labels}>
        <Text style={styles.labelText}>Niet belangrijk</Text>
        <Text style={styles.labelText}>Heel belangrijk</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#2C3E50',
  },
  value: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: '#4A90E2',
  },
  slider: {
    height: 40,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  labelText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#7A8A99',
  },
});
```

### 3.4 Progress Indicators

**Progress Bar:**
```tsx
// components/ui/ProgressBar.tsx
export function ProgressBar({ 
  current, 
  total,
  label 
}: ProgressBarProps) {
  const progress = (current / total) * 100;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.count}>{current}/{total}</Text>
      </View>
      
      <View style={styles.track}>
        <Animated.View 
          style={[
            styles.fill,
            { width: `${progress}%` }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#5A6C7D',
  },
  count: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4A90E2',
  },
  track: {
    height: 8,
    backgroundColor: '#E8EEF2',
    borderRadius: 8,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 8,
  },
});
```

**Circular Progress (Reliability Score):**
```tsx
// components/ui/CircularProgress.tsx
import { Circle, Svg } from 'react-native-svg';

export function CircularProgress({ 
  size = 120,
  progress = 0, // 0-100
  strokeWidth = 12,
  color = '#4A90E2',
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E8EEF2"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      
      <View style={styles.labelContainer}>
        <Text style={styles.percentage}>{Math.round(progress)}%</Text>
        <Text style={styles.label}>Betrouwbaar</Text>
      </View>
    </View>
  );
}
```

### 3.5 Bottom Sheet / Modal

```tsx
// components/ui/BottomSheet.tsx
import { Modal, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function BottomSheet({ 
  visible, 
  onClose, 
  title,
  children 
}: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <View 
          style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}
          onStartShouldSetResponder={() => true}
        >
          {/* Handle bar */}
          <View style={styles.handle} />
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          {/* Content */}
          <ScrollView style={styles.content}>
            {children}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(44, 62, 80, 0.7)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E8EEF2',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EEF2',
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#2C3E50',
  },
  closeButton: {
    fontSize: 24,
    color: '#7A8A99',
  },
  content: {
    padding: 24,
  },
});
```

---

## 4. SCREEN PATTERNS {#screen-patterns}

### 4.1 Onboarding Flow

**Welcome Screen:**
```tsx
// screens/Onboarding/WelcomeScreen.tsx
export function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4A90E2', '#3B7DD6']}
        style={styles.gradient}
      >
        {/* Scout Hero */}
        <View style={styles.hero}>
          <Image 
            source={require('@/assets/scout-welcome.png')}
            style={styles.scoutImage}
          />
          <Text style={styles.greeting}>Hey! Ik ben Scout 🦅</Text>
        </View>
        
        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Welkom bij Richting</Text>
          <Text style={styles.subtitle}>
            Ontdek welke beroepen en studies bij jou passen - zonder druk, met wetenschappelijke onderbouwing.
          </Text>
          
          <View style={styles.features}>
            <Feature 
              icon="🎯" 
              text="Swipe door beroepen zoals Tinder" 
            />
            <Feature 
              icon="🧠" 
              text="Wetenschappelijk gevalideerde tests" 
            />
            <Feature 
              icon="🦅" 
              text="Scout begeleidt je door het hele proces" 
            />
          </View>
        </View>
        
        {/* CTA */}
        <View style={styles.footer}>
          <Button 
            title="Start ontdekking"
            onPress={() => navigation.navigate('RIASECIntro')}
            variant="primary"
          />
          <Text style={styles.disclaimer}>
            Dit duurt ongeveer 30-40 minuten. Je kunt altijd pauzeren.
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
```

### 4.2 RIASEC Swipe Screen

**Layout:**
```
┌─────────────────────────┐
│  [Progress: 23/60]      │ ← Top bar
│  Scout 🦅               │ ← Fixed top-right
├─────────────────────────┤
│                         │
│     [Swipe Card]        │ ← Center, takes 70% height
│      Timmerman          │
│   "Bouwen met hout"     │
│   [Bouw] [Ambacht]      │
│                         │
├─────────────────────────┤
│   [←]         [→]       │ ← Buttons (alternative to swipe)
└─────────────────────────┘
```

```tsx
// screens/Assessment/RIASECSwipeScreen.tsx
export function RIASECSwipeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState<Card[]>(RIASEC_CARDS);
  
  const handleSwipeLeft = () => {
    // NO vote - no action, just next card
    setCurrentIndex(prev => prev + 1);
  };
  
  const handleSwipeRight = async () => {
    // YES vote - save to profile
    const card = cards[currentIndex];
    await saveRIASECResponse(card.id, 'yes');
    
    setCurrentIndex(prev => prev + 1);
    
    // Milestone check
    if (currentIndex + 1 === 10) {
      showScoutMessage("Goed bezig! Nog 20 te gaan 🎯");
    }
  };
  
  if (currentIndex >= cards.length) {
    return <RIASECCompleteScreen />;
  }
  
  return (
    <View style={styles.container}>
      {/* Progress */}
      <ProgressBar 
        current={currentIndex + 1}
        total={cards.length}
        label="RIASEC Swipe"
      />
      
      {/* Card Stack (show top 2 cards) */}
      <View style={styles.cardStack}>
        {cards.slice(currentIndex, currentIndex + 2).map((card, index) => (
          <SwipeCard
            key={card.id}
            {...card}
            onSwipeLeft={index === 0 ? handleSwipeLeft : undefined}
            onSwipeRight={index === 0 ? handleSwipeRight : undefined}
            style={{ 
              zIndex: 2 - index,
              transform: [{ scale: 1 - (index * 0.05) }],
            }}
          />
        ))}
      </View>
      
      {/* Alternative buttons */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.nopeButton]}
          onPress={handleSwipeLeft}
        >
          <Text style={styles.actionIcon}>✗</Text>
          <Text style={styles.actionText}>Niet voor mij</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.likeButton]}
          onPress={handleSwipeRight}
        >
          <Text style={styles.actionIcon}>✓</Text>
          <Text style={styles.actionText}>Lijkt me leuk!</Text>
        </TouchableOpacity>
      </View>
      
      {/* Scout */}
      <Scout />
    </View>
  );
}
```

### 4.3 Question Screen (Big Five)

**Layout:**
```
┌─────────────────────────┐
│  Vraag 8/25             │ ← Progress
│  Scout 🦅               │
├─────────────────────────┤
│                         │
│  Ik probeer graag       │ ← Question (Large text)
│  nieuwe dingen uit      │
│                         │
│  😐 ●────────○ 😊      │ ← Slider
│  Oneens    Eens         │
│                         │
│  [ ← Vorige ]           │ ← Back button (optional)
│                         │
│                         │
└─────────────────────────┘
```

```tsx
// screens/Assessment/BigFiveScreen.tsx
export function BigFiveScreen() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(25).fill(3));
  
  const question = BIGFIVE_QUESTIONS[currentQ];
  const progress = ((currentQ + 1) / 25) * 100;
  
  const handleNext = () => {
    if (currentQ < 24) {
      setCurrentQ(prev => prev + 1);
    } else {
      // Complete - calculate scores
      const scores = calculateBigFive(answers);
      saveBigFiveScores(scores);
      navigation.navigate('WorkValues');
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Progress */}
      <Text style={styles.progress}>Vraag {currentQ + 1}/25</Text>
      
      {/* Question */}
      <View style={styles.questionContainer}>
        <Text style={styles.question}>{question.text}</Text>
        
        {/* Slider */}
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>😐</Text>
          
          <Slider
            value={answers[currentQ]}
            onValueChange={(value) => {
              const newAnswers = [...answers];
              newAnswers[currentQ] = value;
              setAnswers(newAnswers);
            }}
            minimumValue={1}
            maximumValue={5}
            step={1}
            minimumTrackTintColor="#4A90E2"
            maximumTrackTintColor="#E8EEF2"
            style={styles.slider}
          />
          
          <Text style={styles.sliderLabel}>😊</Text>
        </View>
        
        <View style={styles.labels}>
          <Text style={styles.labelText}>Helemaal mee oneens</Text>
          <Text style={styles.labelText}>Helemaal mee eens</Text>
        </View>
      </View>
      
      {/* Navigation */}
      <View style={styles.navigation}>
        {currentQ > 0 && (
          <Button 
            title="← Vorige"
            onPress={() => setCurrentQ(prev => prev - 1)}
            variant="text"
          />
        )}
        
        <Button 
          title={currentQ < 24 ? "Volgende →" : "Afronden"}
          onPress={handleNext}
          variant="primary"
        />
      </View>
      
      <Scout />
    </SafeAreaView>
  );
}
```

### 4.4 Results Screen

**Layout:**
```
┌─────────────────────────┐
│  [← Terug]              │
├─────────────────────────┤
│  Jouw Profiel           │ ← Scroll view
│  [Reliability: 80%]     │
│                         │
│  [RIASEC Radar Chart]   │
│                         │
│  Top Matches            │
│  ┌─────────────────┐   │
│  │ Software Dev 92%│   │ ← Card list
│  │ 🎯 Direct Match │   │
│  └─────────────────┘   │
│  ┌─────────────────┐   │
│  │ UX Designer  88%│   │
│  │ 🌱 Groei        │   │
│  └─────────────────┘   │
│  ...                    │
└─────────────────────────┘
```

```tsx
// screens/Results/ResultsScreen.tsx
export function ResultsScreen() {
  const { profile, matches } = useUserProfile();
  
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Jouw Profiel</Text>
        <CircularProgress progress={profile.reliabilityScore} />
      </View>
      
      {/* RIASEC Chart */}
      <Card style={styles.chartCard}>
        <Text style={styles.sectionTitle}>Jouw Interesses (RIASEC)</Text>
        <RadarChart data={profile.riasec} />
      </Card>
      
      {/* Top Matches */}
      <View style={styles.matchesSection}>
        <Text style={styles.sectionTitle}>Top Matches</Text>
        
        {matches.slice(0, 10).map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </View>
      
      {/* Scout Celebration */}
      <ScoutCelebration />
    </ScrollView>
  );
}

function MatchCard({ match }: MatchCardProps) {
  return (
    <TouchableOpacity 
      style={styles.matchCard}
      onPress={() => openJobDetail(match.id)}
    >
      <View style={styles.matchHeader}>
        <Text style={styles.matchTitle}>{match.jobTitle}</Text>
        <View style={styles.matchBadge}>
          <Text style={styles.matchScore}>{match.percentage}%</Text>
        </View>
      </View>
      
      <View style={styles.matchMeta}>
        <ClassificationBadge type={match.classification} />
        <Text style={styles.matchSector}>{match.sector}</Text>
      </View>
      
      <View style={styles.matchBreakdown}>
        <BreakdownBar label="Interesses" value={match.riasecScore} />
        <BreakdownBar label="Persoonlijkheid" value={match.bigFiveScore} />
        <BreakdownBar label="Waarden" value={match.valuesScore} />
      </View>
    </TouchableOpacity>
  );
}
```

### 4.5 Bottom Tab Navigation

```tsx
// navigation/TabNavigator.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#7A8A99',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E8EEF2',
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Discover"
        component={DiscoverStack}
        options={{
          tabBarLabel: 'Ontdek',
          tabBarIcon: ({ color, size }) => (
            <Icon name="compass" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Results"
        component={ResultsScreen}
        options={{
          tabBarLabel: 'Resultaten',
          tabBarIcon: ({ color, size }) => (
            <Icon name="bar-chart" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profiel',
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
```

---

## 5. SCOUT INTEGRATION {#scout-integration}

### 5.1 Scout Component

```tsx
// components/Scout/Scout.tsx
import { useScout } from '@/hooks/useScout';

export function Scout() {
  const { message, pose, visible } = useScout();
  
  if (!visible) return null;
  
  return (
    <View style={styles.container}>
      {/* Scout Avatar */}
      <Animated.View style={[styles.avatar, floatAnimation]}>
        <ScoutAvatar pose={pose} />
      </Animated.View>
      
      {/* Speech Bubble */}
      {message && (
        <Animated.View style={[styles.bubble, fadeInAnimation]}>
          <Text style={styles.bubbleText}>{message}</Text>
          <View style={styles.bubbleTail} />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 24,
    right: 24,
    zIndex: 100,
  },
  avatar: {
    width: 60,
    height: 60,
  },
  bubble: {
    position: 'absolute',
    top: 70,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    maxWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bubbleText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#2C3E50',
  },
  bubbleTail: {
    position: 'absolute',
    top: -6,
    right: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFFFFF',
  },
});
```

### 5.2 Scout Avatar (SVG)

```tsx
// components/Scout/ScoutAvatar.tsx
import { Svg, Path, Circle, G } from 'react-native-svg';

interface ScoutAvatarProps {
  pose: 'neutral' | 'happy' | 'thinking' | 'celebrating' | 'encouraging';
  size?: number;
}

export function ScoutAvatar({ pose = 'neutral', size = 60 }: ScoutAvatarProps) {
  const poses = {
    neutral: {
      body: "M30,45 Q20,35 15,20 Q15,10 20,5 Q25,0 30,0 Q35,0 40,5 Q45,10 45,20 Q40,35 30,45",
      eyes: [
        { cx: 25, cy: 20, r: 3 },
        { cx: 35, cy: 20, r: 3 }
      ],
      beak: "M30,25 L28,28 L32,28 Z",
    },
    happy: {
      body: "M30,45 Q20,35 15,20 Q15,10 20,5 Q25,0 30,0 Q35,0 40,5 Q45,10 45,20 Q40,35 30,45",
      eyes: [
        { cx: 25, cy: 18, r: 4 }, // Bigger eyes
        { cx: 35, cy: 18, r: 4 }
      ],
      beak: "M30,25 Q28,28 30,30 Q32,28 30,25", // Open beak (smile)
    },
    // ... other poses
  };
  
  const currentPose = poses[pose];
  
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      {/* Body */}
      <Path
        d={currentPose.body}
        fill="#4A90E2"
        fillOpacity={0.9}
      />
      
      {/* Wings */}
      <Path
        d="M15,25 Q10,20 10,15 L15,20 Z"
        fill="#3B7DD6"
      />
      <Path
        d="M45,25 Q50,20 50,15 L45,20 Z"
        fill="#3B7DD6"
      />
      
      {/* Eyes */}
      {currentPose.eyes.map((eye, i) => (
        <G key={i}>
          <Circle cx={eye.cx} cy={eye.cy} r={eye.r} fill="#FFFFFF" />
          <Circle cx={eye.cx} cy={eye.cy} r={eye.r * 0.6} fill="#2C3E50" />
        </G>
      ))}
      
      {/* Beak */}
      <Path d={currentPose.beak} fill="#FFE66D" />
    </Svg>
  );
}
```

### 5.3 Scout Hook

```tsx
// hooks/useScout.ts
import { create } from 'zustand';

interface ScoutState {
  message: string | null;
  pose: 'neutral' | 'happy' | 'thinking' | 'celebrating' | 'encouraging';
  visible: boolean;
  
  say: (message: string, pose?: ScoutState['pose']) => void;
  hide: () => void;
  celebrate: () => void;
}

export const useScout = create<ScoutState>((set) => ({
  message: null,
  pose: 'neutral',
  visible: true,
  
  say: (message, pose = 'neutral') => {
    set({ message, pose, visible: true });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      set({ message: null, pose: 'neutral' });
    }, 5000);
  },
  
  hide: () => {
    set({ visible: false });
  },
  
  celebrate: () => {
    set({ 
      message: "Yes! Je hebt het voltooid! 🎉", 
      pose: 'celebrating',
      visible: true 
    });
  },
}));
```

### 5.4 Scout Messages (Context-Aware)

```tsx
// utils/scoutMessages.ts
export const scoutMessages = {
  onboarding: {
    welcome: "Hey! Ik ben Scout 🦅",
    intro: "Leuk je te ontmoeten! Laten we samen je richting ontdekken.",
  },
  
  riasec: {
    start: "Swipe door beroepen - kies wat je leuk lijkt!",
    milestone_10: "Goed bezig! Nog 20 te gaan 🎯",
    milestone_20: "Nog 10 te gaan! Ik zie al een patroon 👀",
    complete: "Perfect! Je hebt genoeg voor eerste inzichten 🎉",
  },
  
  bigfive: {
    start: "Tijd om te kijken hoe jij werkt! 💭",
    halfway: "Halverwege! Je doet het goed 💪",
    difficult: "Lastige vraag? Denk aan hoe je meestal bent.",
    complete: "Wow! Ik begrijp je nu veel beter 🎉",
  },
  
  values: {
    start: "Wat maakt werk leuk voor jou? 🎯",
    complete: "Perfect! Nu weet ik wat jou motiveert 💪",
  },
  
  scct: {
    start: "Laten we je zelfvertrouwen meten 💡",
    encouraging: "Geloof in jezelf! Je kunt meer dan je denkt.",
    complete: "Super! Nu kan ik je leer-curve inschatten 📈",
  },
  
  results: {
    reveal: "Trots op je! Kijk wat we ontdekt hebben 🎯",
    directMatch: "Dit is een perfecte match voor jou! 🎯",
    growthPotential: "Dit kun je leren - flinke groeikansen! 🌱",
  },
  
  dilemma: {
    daily: "Nieuwe vraag! Wat zou jij doen? 💭",
    streak: "7 dagen streak! Je bent top 🔥",
  },
};
```

---

## 6. ANIMATIONS & INTERACTIONS {#animations}

### 6.1 Animation Constants

```tsx
// constants/animations.ts
export const animations = {
  // Durations
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 400,
    extra: 600,
  },
  
  // Easing
  easing: {
    easeOut: Easing.bezier(0.33, 1, 0.68, 1),
    easeInOut: Easing.bezier(0.65, 0, 0.35, 1),
    bounce: Easing.bezier(0.68, -0.55, 0.265, 1.55),
  },
  
  // Springs
  spring: {
    default: {
      damping: 15,
      stiffness: 150,
      mass: 1,
    },
    bouncy: {
      damping: 8,
      stiffness: 120,
      mass: 0.8,
    },
    gentle: {
      damping: 20,
      stiffness: 100,
      mass: 1.2,
    },
  },
};
```

### 6.2 Common Animations

**Fade In:**
```tsx
// animations/fadeIn.ts
export function useFadeIn(delay = 0) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);
  
  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 300 })
    );
    translateY.value = withDelay(
      delay,
      withSpring(0, animations.spring.default)
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
  
  return animatedStyle;
}

// Usage
function MyComponent() {
  const fadeInStyle = useFadeIn(200);
  
  return (
    <Animated.View style={fadeInStyle}>
      <Text>Hello</Text>
    </Animated.View>
  );
}
```

**Scout Float:**
```tsx
// animations/scoutFloat.ts
export function useScoutFloat() {
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  
  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 2000, easing: animations.easing.easeInOut }),
        withTiming(0, { duration: 2000, easing: animations.easing.easeInOut })
      ),
      -1, // Infinite
      false
    );
    
    rotate.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 2000 }),
        withTiming(3, { duration: 2000 })
      ),
      -1,
      true // Reverse
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));
  
  return animatedStyle;
}
```

**Button Press:**
```tsx
// animations/buttonPress.ts
export function useButtonPress() {
  const scale = useSharedValue(1);
  
  const onPressIn = () => {
    scale.value = withTiming(0.96, { duration: 100 });
  };
  
  const onPressOut = () => {
    scale.value = withSpring(1, animations.spring.bouncy);
  };
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  return { animatedStyle, onPressIn, onPressOut };
}

// Usage
function MyButton() {
  const { animatedStyle, onPressIn, onPressOut } = useButtonPress();
  
  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={animatedStyle}>
        <Text>Press me</Text>
      </Animated.View>
    </Pressable>
  );
}
```

**Progress Fill:**
```tsx
// animations/progressFill.ts
export function useProgressFill(progress: number) {
  const width = useSharedValue(0);
  
  useEffect(() => {
    width.value = withTiming(progress, {
      duration: 800,
      easing: animations.easing.easeOut,
    });
  }, [progress]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));
  
  return animatedStyle;
}
```

### 6.3 Page Transitions

**Stack Navigator Transitions:**
```tsx
// navigation/transitions.ts
export const screenOptions = {
  headerShown: false,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 300,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 250,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      },
    },
  },
};
```

**Modal Slide Up:**
```tsx
// Use React Native's Modal with animationType="slide"
<Modal
  visible={visible}
  animationType="slide"
  presentationStyle="pageSheet" // iOS: Bottom sheet style
>
  {/* Content */}
</Modal>
```

### 6.4 Micro-interactions

**Haptic Feedback:**
```tsx
import * as Haptics from 'expo-haptics';

// On button press
const handlePress = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  // ... rest of logic
};

// On success
const handleSuccess = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

// On error
const handleError = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
};
```

**Confetti Celebration:**
```tsx
// components/Confetti.tsx
import ConfettiCannon from 'react-native-confetti-cannon';

export function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  
  return (
    <ConfettiCannon
      count={100}
      origin={{ x: width / 2, y: 0 }}
      colors={['#4A90E2', '#FF6B6B', '#9B6DD6', '#4ECDC4', '#FFE66D']}
      explosionSpeed={350}
      fadeOut
      autoStart
    />
  );
}
```

---

## 7. ACCESSIBILITY {#accessibility}

### 7.1 Text Accessibility

**Minimum Sizes:**
```tsx
// Never go below these sizes
const minSizes = {
  body: 16, // Default body text
  label: 14, // Form labels, buttons
  caption: 12, // Timestamps only
};
```

**Dynamic Type Support (iOS):**
```tsx
// components/ui/Text.tsx
import { Text as RNText, TextProps } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export function Text({ 
  variant = 'body',
  children,
  ...props 
}: CustomTextProps) {
  const { typography, dynamicScale } = useTheme();
  
  const style = {
    ...typography[variant],
    fontSize: typography[variant].fontSize * dynamicScale, // Respects iOS text size settings
  };
  
  return (
    <RNText style={style} {...props}>
      {children}
    </RNText>
  );
}
```

### 7.2 Color Contrast

**WCAG AA Compliance:**
```tsx
// All text must have ≥4.5:1 contrast
const accessiblePairs = {
  // Light backgrounds
  onLight: {
    primary: '#2C3E50',   // Gray-800 on White = 12.6:1 ✅
    secondary: '#5A6C7D', // Gray-600 on White = 7.2:1 ✅
    tertiary: '#7A8A99',  // Gray-500 on White = 4.9:1 ✅
  },
  
  // Dark backgrounds
  onDark: {
    primary: '#FFFFFF',   // White on Blue-600 = 4.8:1 ✅
    secondary: '#E0F0FF', // Blue-100 on Blue-600 = 8.1:1 ✅
  },
};
```

**Test with Tools:**
```bash
# Install contrast checker
npm install --save-dev @adobe/leonardo-contrast-colors

# Check contrast programmatically
import { checkContrast } from '@adobe/leonardo-contrast-colors';

const ratio = checkContrast('#2C3E50', '#FFFFFF');
console.log(ratio >= 4.5 ? '✅ Accessible' : '❌ Fails WCAG AA');
```

### 7.3 Screen Reader Support

**Accessible Labels:**
```tsx
// Button
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Start ontdekking"
  accessibilityHint="Begin met de RIASEC swipe test"
  accessibilityRole="button"
>
  <Text>Start</Text>
</TouchableOpacity>

// Image
<Image
  source={{ uri: imageUrl }}
  accessible={true}
  accessibilityLabel="Timmerman aan het werk met gereedschap"
  accessibilityRole="image"
/>

// Progress
<View
  accessible={true}
  accessibilityLabel={`Voortgang: ${current} van ${total} voltooid`}
  accessibilityRole="progressbar"
  accessibilityValue={{
    min: 0,
    max: total,
    now: current,
  }}
>
  <ProgressBar current={current} total={total} />
</View>
```

**Skip Decorative Elements:**
```tsx
// Scout is visual decoration, don't announce
<View 
  accessible={false}
  importantForAccessibility="no"
>
  <Scout />
</View>
```

### 7.4 Touch Targets

**Minimum Size: 44×44pt (iOS) / 48×48dp (Android)**
```tsx
const styles = StyleSheet.create({
  button: {
    minHeight: 48, // Ensures touch target
    minWidth: 48,
    padding: 12, // Visual size can be smaller with padding
  },
});

// For small buttons, add padding to increase touch area
<TouchableOpacity
  style={styles.smallButton}
  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
>
  <Icon size={20} />
</TouchableOpacity>
```

### 7.5 Reduced Motion

**Respect User Preferences:**
```tsx
import { AccessibilityInfo } from 'react-native';

export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);
  
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReducedMotion);
    
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReducedMotion
    );
    
    return () => subscription.remove();
  }, []);
  
  return reducedMotion;
}

// Usage
function AnimatedComponent() {
  const reducedMotion = useReducedMotion();
  
  const animationDuration = reducedMotion ? 0 : 300;
  
  return (
    <Animated.View
      style={{
        // Use instant transitions if reduced motion is enabled
      }}
    />
  );
}
```

---

## 8. PLATFORM-SPECIFIC GUIDELINES {#platform-specific}

### 8.1 iOS Guidelines

**Safe Area:**
```tsx
import { SafeAreaView } from 'react-native-safe-area-context';

export function Screen({ children }: Props) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {children}
    </SafeAreaView>
  );
}
```

**Navigation Bar:**
```tsx
// Use iOS-style back button
import { HeaderBackButton } from '@react-navigation/elements';

<Stack.Screen
  options={{
    headerLeft: (props) => (
      <HeaderBackButton {...props} tintColor="#4A90E2" />
    ),
  }}
/>
```

**Haptics (iOS-specific):**
```tsx
import * as Haptics from 'expo-haptics';

// Use iOS haptic patterns
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);   // Subtle
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);  // Standard
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);   // Strong
```

### 8.2 Android Guidelines

**Material Design Elements:**
```tsx
// Use Android-specific components when appropriate
import { Button } from 'react-native-paper';

<Button 
  mode="contained"
  style={{ backgroundColor: '#4A90E2' }}
>
  Start
</Button>
```

**Navigation Bar:**
```tsx
// Android back button is system-provided
// Just handle the back action
useEffect(() => {
  const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    () => {
      navigation.goBack();
      return true;
    }
  );
  
  return () => backHandler.remove();
}, []);
```

**Elevation vs Shadow:**
```tsx
const styles = StyleSheet.create({
  card: {
    // iOS: shadow properties
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      // Android: elevation
      android: {
        elevation: 4,
      },
    }),
  },
});
```

### 8.3 Web-Specific (Next.js)

**Responsive Breakpoints:**
```tsx
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',   // Mobile landscape
      'md': '768px',   // Tablet
      'lg': '1024px',  // Desktop
      'xl': '1280px',  // Large desktop
    },
  },
};

// Usage
<div class="px-4 md:px-8 lg:px-16">
  {/* Responsive padding */}
</div>
```

**Hover States (Desktop):**
```tsx
// Only add hover on non-touch devices
<button class="
  bg-blue-500 
  hover:bg-blue-600 
  hover:shadow-lg
  transition-all
  duration-200
  active:scale-95
">
  Click me
</button>
```

**SEO & Meta Tags:**
```tsx
// app/layout.tsx
export const metadata = {
  title: 'Richting - Ontdek jouw richting',
  description: 'Ontdek welke beroepen en studies bij jou passen met wetenschappelijk gevalideerde tests.',
  keywords: 'studiekeuze, carrière, RIASEC, beroepskeuze',
  openGraph: {
    title: 'Richting',
    description: 'Ontdek jouw richting',
    images: ['/og-image.png'],
  },
};
```

---

## 📊 IMPLEMENTATION CHECKLIST

### Development Setup
- [ ] Install Expo CLI / Next.js
- [ ] Setup Tailwind CSS (web) / StyleSheet (mobile)
- [ ] Install fonts (Poppins, Inter)
- [ ] Configure design tokens
- [ ] Setup Reanimated 2
- [ ] Install navigation (React Navigation / Next.js App Router)

### Core Components
- [ ] Button (Primary, Secondary, Text variants)
- [ ] Card (Standard, Swipe)
- [ ] Input (Text, Slider)
- [ ] Progress (Bar, Circular)
- [ ] Modal / Bottom Sheet
- [ ] Scout component
- [ ] Tab Navigation

### Screens
- [ ] Onboarding flow
- [ ] RIASEC Swipe screen
- [ ] Big Five question screen
- [ ] Work Values screen
- [ ] SCCT Scanner screen
- [ ] Results screen
- [ ] Profile screen

### Animations
- [ ] Fade in animations
- [ ] Scout float animation
- [ ] Button press feedback
- [ ] Page transitions
- [ ] Confetti celebration

### Accessibility
- [ ] Color contrast check (WCAG AA)
- [ ] Screen reader labels
- [ ] Touch target sizes (48×48dp)
- [ ] Reduced motion support
- [ ] Dynamic type support (iOS)

### Platform Optimization
- [ ] Safe area insets (iOS)
- [ ] Navigation patterns (iOS/Android)
- [ ] Haptic feedback
- [ ] Responsive breakpoints (Web)
- [ ] SEO meta tags (Web)

---

**END OF APP DESIGN SYSTEM**

*For questions: design@richting.app*  
*Last updated: Februari 2026*