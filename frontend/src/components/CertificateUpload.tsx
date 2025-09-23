import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, X, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "pending" | "verified" | "rejected";
  verificationResult?: {
    isAuthentic: boolean;
    confidence: number;
    details: string;
  };
}

export const CertificateUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: "pending"
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // Simulate verification process
    newFiles.forEach(file => {
      setTimeout(() => {
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { 
                ...f, 
                status: Math.random() > 0.3 ? "verified" : "rejected",
                verificationResult: {
                  isAuthentic: Math.random() > 0.3,
                  confidence: Math.floor(Math.random() * 30) + 70,
                  details: Math.random() > 0.3 
                    ? "Certificate verified against government database" 
                    : "Certificate could not be verified - potential forgery detected"
                }
              }
            : f
        ));
      }, 2000 + Math.random() * 3000);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string, isAuthentic?: boolean) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-gov-warning" />;
      case "verified":
        return isAuthentic ? 
          <CheckCircle className="w-4 h-4 text-gov-success" /> : 
          <AlertCircle className="w-4 h-4 text-gov-danger" />;
      case "rejected":
        return <AlertCircle className="w-4 h-4 text-gov-danger" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (file: UploadedFile) => {
    switch (file.status) {
      case "pending":
        return <Badge variant="outline" className="text-gov-warning border-gov-warning">Verifying...</Badge>;
      case "verified":
        return file.verificationResult?.isAuthentic ? 
          <Badge className="bg-gov-success text-white">Verified Authentic</Badge> :
          <Badge variant="destructive">Verification Failed</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Certificate Upload</span>
          </CardTitle>
          <CardDescription>
            Upload certificates for verification. Supported formats: PDF, JPG, PNG, DOCX
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              dragActive 
                ? "border-gov-blue bg-gov-blue/5" 
                : "border-border hover:border-gov-blue hover:bg-gov-blue/5"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Drop files here or click to browse</h3>
            <p className="text-muted-foreground mb-4">
              Maximum file size: 20MB. Multiple files can be uploaded at once.
            </p>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-gov-blue to-gov-blue-dark hover:from-gov-blue-dark hover:to-gov-blue"
            >
              Choose Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.docx"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Certificates</CardTitle>
            <CardDescription>
              Track the verification status of your uploaded certificates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-gov-blue" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                      {file.verificationResult && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Confidence: {file.verificationResult.confidence}% • {file.verificationResult.details}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(file.status, file.verificationResult?.isAuthentic)}
                    {getStatusBadge(file)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="ml-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};