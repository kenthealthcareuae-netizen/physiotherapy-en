import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Save, Eye, EyeOff, Settings, Image, Code, Mail, Upload } from 'lucide-react';
import { useConfig } from '@/contexts/ConfigContext';
import MediaManager from './MediaManager';

const AdminPanel = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Use context for configuration
  const {
    emailjsConfig,
    setEmailjsConfig,
    images,
    setImages,
    trackingCodes,
    setTrackingCodes,
    customCss,
    setCustomCss,
    customJs,
    setCustomJs
  } = useConfig();

  // Admin password
  const ADMIN_PASSWORD = 'KentAdmin2024!';

  // Configuration is now managed by context, no need to load from localStorage here

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({
        title: 'Login Successful',
        description: 'Welcome to the admin panel.',
      });
    } else {
      toast({
        title: 'Invalid Password',
        description: 'Please check your password and try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSaveEmailjs = () => {
    // Configuration is automatically saved by context
    toast({
      title: 'EmailJS Configuration Saved',
      description: 'Your EmailJS settings have been updated.',
    });
  };

  const handleSaveImages = () => {
    // Configuration is automatically saved by context
    toast({
      title: 'Images Updated',
      description: 'Your image URLs have been saved.',
    });
  };

  const handleSaveTracking = () => {
    // Configuration is automatically saved by context
    toast({
      title: 'Tracking Codes Saved',
      description: 'Your tracking and custom codes have been updated.',
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    toast({
      title: 'Logged Out',
      description: 'You have been logged out of the admin panel.',
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Kent Healthcare Admin Panel</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <Tabs defaultValue="emailjs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="emailjs" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              EmailJS
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Images
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Tracking
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Media Gallery
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Custom Code
            </TabsTrigger>
          </TabsList>

          {/* EmailJS Configuration */}
          <TabsContent value="emailjs">
            <Card>
              <CardHeader>
                <CardTitle>EmailJS Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="serviceId">Service ID</Label>
                    <Input
                      id="serviceId"
                      value={emailjsConfig.serviceId}
                      onChange={(e) => setEmailjsConfig({...emailjsConfig, serviceId: e.target.value})}
                      placeholder="service_xxxxxxx"
                    />
                  </div>
                  <div>
                    <Label htmlFor="templateId">Template ID</Label>
                    <Input
                      id="templateId"
                      value={emailjsConfig.templateId}
                      onChange={(e) => setEmailjsConfig({...emailjsConfig, templateId: e.target.value})}
                      placeholder="template_xxxxxxx"
                    />
                  </div>
                  <div>
                    <Label htmlFor="publicKey">Public Key</Label>
                    <Input
                      id="publicKey"
                      value={emailjsConfig.publicKey}
                      onChange={(e) => setEmailjsConfig({...emailjsConfig, publicKey: e.target.value})}
                      placeholder="xxxxxxxxxxxxx"
                    />
                  </div>
                  <div>
                    <Label htmlFor="redirectUrl">Redirect URL</Label>
                    <Input
                      id="redirectUrl"
                      value={emailjsConfig.redirectUrl}
                      onChange={(e) => setEmailjsConfig({...emailjsConfig, redirectUrl: e.target.value})}
                      placeholder="https://example.com/thankyou"
                    />
                  </div>
                </div>
                <Button onClick={handleSaveEmailjs} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save EmailJS Configuration
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Images Configuration */}
          <TabsContent value="images">
            <Card>
              <CardHeader>
                <CardTitle>Image URLs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="heroImage">Hero Image URL</Label>
                    <Input
                      id="heroImage"
                      value={images.heroImage}
                      onChange={(e) => setImages({...images, heroImage: e.target.value})}
                      placeholder="https://example.com/hero-image.jpg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="conditionsImage">Conditions Image URL</Label>
                    <Input
                      id="conditionsImage"
                      value={images.conditionsImage}
                      onChange={(e) => setImages({...images, conditionsImage: e.target.value})}
                      placeholder="https://example.com/conditions-image.jpg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      value={images.logoUrl}
                      onChange={(e) => setImages({...images, logoUrl: e.target.value})}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                </div>
                <Button onClick={handleSaveImages} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Image URLs
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tracking Codes */}
          <TabsContent value="tracking">
            <Card>
              <CardHeader>
                <CardTitle>Tracking & Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                    <Input
                      id="googleAnalytics"
                      value={trackingCodes.googleAnalytics}
                      onChange={(e) => setTrackingCodes({...trackingCodes, googleAnalytics: e.target.value})}
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="googleTagManager">Google Tag Manager ID</Label>
                    <Input
                      id="googleTagManager"
                      value={trackingCodes.googleTagManager}
                      onChange={(e) => setTrackingCodes({...trackingCodes, googleTagManager: e.target.value})}
                      placeholder="GTM-XXXXXXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="facebookPixel">Facebook Pixel ID</Label>
                    <Input
                      id="facebookPixel"
                      value={trackingCodes.facebookPixel}
                      onChange={(e) => setTrackingCodes({...trackingCodes, facebookPixel: e.target.value})}
                      placeholder="123456789012345"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gclid">Google Click ID (GCLID)</Label>
                    <Input
                      id="gclid"
                      value={trackingCodes.gclid}
                      onChange={(e) => setTrackingCodes({...trackingCodes, gclid: e.target.value})}
                      placeholder="Cj0KCQjw..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="utmSource">UTM Source</Label>
                    <Input
                      id="utmSource"
                      value={trackingCodes.utmSource}
                      onChange={(e) => setTrackingCodes({...trackingCodes, utmSource: e.target.value})}
                      placeholder="google, facebook, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="utmMedium">UTM Medium</Label>
                    <Input
                      id="utmMedium"
                      value={trackingCodes.utmMedium}
                      onChange={(e) => setTrackingCodes({...trackingCodes, utmMedium: e.target.value})}
                      placeholder="cpc, social, email, etc."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="utmCampaign">UTM Campaign</Label>
                    <Input
                      id="utmCampaign"
                      value={trackingCodes.utmCampaign}
                      onChange={(e) => setTrackingCodes({...trackingCodes, utmCampaign: e.target.value})}
                      placeholder="summer_sale_2024"
                    />
                  </div>
                </div>
                <Button onClick={handleSaveTracking} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Tracking Codes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Gallery */}
          <TabsContent value="media">
            <MediaManager />
          </TabsContent>

          {/* Custom Code */}
          <TabsContent value="custom">
            <Card>
              <CardHeader>
                <CardTitle>Custom CSS & JavaScript</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customCss">Custom CSS</Label>
                  <Textarea
                    id="customCss"
                    value={customCss}
                    onChange={(e) => setCustomCss(e.target.value)}
                    placeholder="/* Custom CSS code */"
                    rows={8}
                    className="font-mono text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="customJs">Custom JavaScript</Label>
                  <Textarea
                    id="customJs"
                    value={customJs}
                    onChange={(e) => setCustomJs(e.target.value)}
                    placeholder="// Custom JavaScript code"
                    rows={8}
                    className="font-mono text-sm"
                  />
                </div>
                <Button onClick={handleSaveTracking} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Custom Code
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
