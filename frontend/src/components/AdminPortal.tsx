import { useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle, FileText } from "lucide-react";
import axios from "axios";

export const AdminPortal = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedName, setSelectedName] = useState<string>("");
  const [added, setAdded] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const onPick = () => fileRef.current?.click();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setSelectedName(f.name);
    setAdded(false);
  };

  const onAdd = async () => {
    setError("");
    setTxHash("");
    if (!fileRef.current || !fileRef.current.files?.[0]) return;
    const file = fileRef.current.files[0];
    const form = new FormData();
    form.append("file", file);
    try {
      setLoading(true);
          const res = await axios.post(`${import.meta.env.VITE_API_BASE || "http://localhost:5000"}/api/admin/upload`, form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setAdded(true);
      setTxHash(res.data?.txHash || "");
      console.log('Certificate stored:', res.data);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Admin: Add Verified Certificate</span>
          </CardTitle>
          <CardDescription>
            Upload pre-verified certificates to make them available for verification. No backend call in demo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Button onClick={onPick} className="bg-gradient-to-r from-gov-blue to-gov-blue-dark">
              Choose File
            </Button>
            <input ref={fileRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.docx" onChange={onChange} />
            {selectedName && (
              <div className="flex items-center text-sm text-muted-foreground">
                <FileText className="w-4 h-4 mr-2 text-gov-blue" /> {selectedName}
              </div>
            )}
            <Button variant="outline" disabled={!selectedName || loading} onClick={onAdd}>{loading ? 'Submitting...' : 'Add to Database'}</Button>
          </div>

          {error && (
            <div className="mt-4 text-gov-danger text-sm">{error}</div>
          )}

          {added && (
            <div className="flex items-center gap-2 mt-4 text-gov-success">
              <CheckCircle className="w-4 h-4" />
              <span>Document added to database</span>
            </div>
          )}

          {txHash && (
            <div className="mt-2 text-sm">
              <span className="text-muted-foreground">Transaction Hash: </span>
              <code className="break-all">{txHash}</code>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPortal;


