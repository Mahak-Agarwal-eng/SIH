import { useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle, FileText } from "lucide-react";

export const AdminPortal = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedName, setSelectedName] = useState<string>("");
  const [added, setAdded] = useState<boolean>(false);

  const onPick = () => fileRef.current?.click();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setSelectedName(f.name);
    setAdded(false);
  };

  const onAdd = () => {
    if (!selectedName) return;
    setAdded(true);
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
            <Button variant="outline" disabled={!selectedName} onClick={onAdd}>Add to Database</Button>
          </div>

          {added && (
            <div className="flex items-center gap-2 mt-4 text-gov-success">
              <CheckCircle className="w-4 h-4" />
              <span>Document added to database</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPortal;


