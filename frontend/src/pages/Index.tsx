import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { AuthForm } from "@/components/AuthForm";
import { Dashboard } from "@/components/Dashboard";
import { CertificateUpload } from "@/components/CertificateUpload";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const { toast } = useToast();

  const handleLogin = (email: string, password: string) => {
    // Simulate authentication
    setTimeout(() => {
      setIsAuthenticated(true);
      setUserEmail(email);
      toast({
        title: "Authentication Successful",
        description: "Welcome to the Certificate Verification System",
      });
    }, 1000);
  };

  const handleSignup = (email: string, password: string) => {
    // Simulate signup
    setTimeout(() => {
      setIsAuthenticated(true);
      setUserEmail(email);
      toast({
        title: "Account Created",
        description: "Your government account has been registered successfully",
      });
    }, 1000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail("");
    toast({
      title: "Signed Out",
      description: "You have been securely logged out",
    });
  };

  if (!isAuthenticated) {
    return <AuthForm onLogin={handleLogin} onSignup={handleSignup} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isAuthenticated={isAuthenticated} 
        userEmail={userEmail} 
        onLogout={handleLogout} 
      />
      
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="upload">Upload Certificate</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Verification Dashboard</h1>
              <p className="text-muted-foreground">
                Monitor certificate verification activity and system status
              </p>
            </div>
            <Dashboard />
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Certificate Verification</h1>
              <p className="text-muted-foreground">
                Upload certificates to verify their authenticity against government databases
              </p>
            </div>
            <CertificateUpload />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;