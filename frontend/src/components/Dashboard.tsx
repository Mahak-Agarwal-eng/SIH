import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Clock, FileText, TrendingUp, Users, Shield } from "lucide-react";

interface DashboardStats {
  totalVerifications: number;
  verifiedCount: number;
  rejectedCount: number;
  pendingCount: number;
  todayVerifications: number;
}

export const Dashboard = () => {
  // Mock data - in real app this would come from API
  const stats: DashboardStats = {
    totalVerifications: 1247,
    verifiedCount: 985,
    rejectedCount: 187,
    pendingCount: 75,
    todayVerifications: 23
  };

  const recentVerifications = [
    {
      id: "1",
      fileName: "diploma_john_doe.pdf",
      status: "verified",
      timestamp: "2 minutes ago",
      confidence: 94
    },
    {
      id: "2", 
      fileName: "certificate_jane_smith.jpg",
      status: "rejected",
      timestamp: "15 minutes ago",
      confidence: 32
    },
    {
      id: "3",
      fileName: "degree_mike_johnson.pdf", 
      status: "pending",
      timestamp: "1 hour ago",
      confidence: null
    },
    {
      id: "4",
      fileName: "transcript_sarah_wilson.pdf",
      status: "verified",
      timestamp: "2 hours ago", 
      confidence: 87
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-gov-success text-white">Verified</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-gov-warning border-gov-warning">Pending</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-4 h-4 text-gov-success" />;
      case "rejected":
        return <AlertCircle className="w-4 h-4 text-gov-danger" />;
      case "pending":
        return <Clock className="w-4 h-4 text-gov-warning" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Verifications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVerifications.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.todayVerifications} today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Authentic</CardTitle>
            <CheckCircle className="h-4 w-4 text-gov-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gov-success">{stats.verifiedCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.verifiedCount / stats.totalVerifications) * 100)}% success rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <AlertCircle className="h-4 w-4 text-gov-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gov-danger">{stats.rejectedCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.rejectedCount / stats.totalVerifications) * 100)}% rejection rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-gov-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gov-warning">{stats.pendingCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting verification
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Verifications</CardTitle>
          <CardDescription>
            Latest certificate verification activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentVerifications.map((verification) => (
              <div key={verification.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(verification.status)}
                  <div>
                    <p className="font-medium">{verification.fileName}</p>
                    <p className="text-sm text-muted-foreground">{verification.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {verification.confidence && (
                    <span className="text-sm text-muted-foreground">
                      {verification.confidence}% confidence
                    </span>
                  )}
                  {getStatusBadge(verification.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>System Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Verification Engine</span>
                <Badge className="bg-gov-success text-white">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database Connection</span>
                <Badge className="bg-gov-success text-white">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API Status</span>
                <Badge className="bg-gov-success text-white">Operational</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Quick Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Average Processing Time</span>
                <span className="text-sm font-medium">2.3 seconds</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Users</span>
                <span className="text-sm font-medium">47</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Uptime</span>
                <span className="text-sm font-medium">99.9%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};