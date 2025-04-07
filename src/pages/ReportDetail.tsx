
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { mockReports } from "@/services/mockData";
import { PotholeReport, Comment } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  MapPin,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Calendar,
  User,
} from "lucide-react";

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<PotholeReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, this would be an API call
    const foundReport = mockReports.find((r) => r.id === id);
    if (foundReport) {
      setReport(foundReport);
    }
    setLoading(false);
  }, [id]);

  const handleUpvote = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please log in to vote on reports.",
        variant: "destructive",
      });
      return;
    }

    if (!report) return;

    const newReport = { ...report };
    
    if (userVote === "up") {
      // Remove upvote
      newReport.upvotes -= 1;
      setUserVote(null);
    } else {
      // Add upvote
      newReport.upvotes += 1;
      
      // If previously downvoted, remove downvote
      if (userVote === "down") {
        newReport.downvotes -= 1;
      }
      
      setUserVote("up");
    }
    
    setReport(newReport);
  };

  const handleDownvote = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please log in to vote on reports.",
        variant: "destructive",
      });
      return;
    }

    if (!report) return;

    const newReport = { ...report };
    
    if (userVote === "down") {
      // Remove downvote
      newReport.downvotes -= 1;
      setUserVote(null);
    } else {
      // Add downvote
      newReport.downvotes += 1;
      
      // If previously upvoted, remove upvote
      if (userVote === "up") {
        newReport.upvotes -= 1;
      }
      
      setUserVote("down");
    }
    
    setReport(newReport);
  };

  const handleCommentSubmit = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please log in to comment.",
        variant: "destructive",
      });
      return;
    }

    if (!report || !user || !newComment.trim()) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      content: newComment,
      createdAt: new Date().toISOString(),
      user: user,
    };

    const updatedReport = {
      ...report,
      comments: [...report.comments, comment],
    };

    setReport(updatedReport);
    setNewComment("");
    
    toast({
      title: "Comment posted",
      description: "Your comment has been added to this report.",
    });
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Helper for status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "reported":
        return "bg-yellow-500";
      case "in_progress":
        return "bg-blue-500";
      case "fixed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p>Loading report details...</p>
        </div>
      </Layout>
    );
  }

  if (!report) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Report not found</h2>
          <p className="text-gray-600 mb-6">
            The pothole report you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/")}>Back to Homepage</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="outline"
          className="mb-4"
          onClick={() => navigate("/")}
        >
          &larr; Back to Reports
        </Button>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3 space-y-6">
            <Card>
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={report.imageUrl}
                  alt={report.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-2xl">{report.title}</CardTitle>
                  <Badge
                    className={`${getStatusColor(report.status)} text-white`}
                  >
                    {report.status.replace("_", " ")}
                  </Badge>
                </div>
                <CardDescription className="flex items-center text-brand-darkgray">
                  <MapPin className="h-4 w-4 mr-1" />
                  {report.location.address}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-gray-700">{report.description}</p>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>Reported by {report.author.username}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(report.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-6 pt-2">
                  <Button
                    variant={userVote === "up" ? "default" : "outline"}
                    className={
                      userVote === "up"
                        ? "bg-green-500 hover:bg-green-600"
                        : ""
                    }
                    size="sm"
                    onClick={handleUpvote}
                  >
                    <ArrowUp className="mr-1 h-4 w-4" />
                    Upvote ({report.upvotes})
                  </Button>
                  <Button
                    variant={userVote === "down" ? "default" : "outline"}
                    className={
                      userVote === "down"
                        ? "bg-red-500 hover:bg-red-600"
                        : ""
                    }
                    size="sm"
                    onClick={handleDownvote}
                  >
                    <ArrowDown className="mr-1 h-4 w-4" />
                    Downvote ({report.downvotes})
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Comments ({report.comments.length})
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Add your comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <Button
                      onClick={handleCommentSubmit}
                      className="bg-brand-blue hover:bg-blue-600"
                      disabled={!newComment.trim()}
                    >
                      Post Comment
                    </Button>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-md text-center">
                    <p className="text-gray-600 mb-3">
                      You need to be logged in to comment
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/login")}
                    >
                      Log in to comment
                    </Button>
                  </div>
                )}

                <Separator />

                {report.comments.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p>No comments yet. Be the first to comment!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {report.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        <div className="flex items-center mb-2">
                          <img
                            src={comment.user.avatarUrl || "https://i.pravatar.cc/150?img=0"}
                            alt={comment.user.username}
                            className="h-8 w-8 rounded-full mr-2"
                          />
                          <div>
                            <p className="font-medium">{comment.user.username}</p>
                            <p className="text-xs text-gray-500">
                              {formatDate(comment.createdAt)}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="w-full lg:w-1/3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center mb-4">
                  <MapPin className="h-10 w-10 text-brand-orange opacity-70" />
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Address:</p>
                  <p className="text-gray-700">{report.location.address}</p>
                  <p className="text-sm text-gray-500">
                    Lat: {report.location.lat}, Lng: {report.location.lng}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Status History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-yellow-500 rounded-full h-4 w-4 mt-1 mr-3"></div>
                    <div>
                      <p className="font-medium">Reported</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(report.createdAt)}
                      </p>
                    </div>
                  </div>
                  {report.status === "in_progress" ||
                  report.status === "fixed" ? (
                    <div className="flex items-start">
                      <div className="bg-blue-500 rounded-full h-4 w-4 mt-1 mr-3"></div>
                      <div>
                        <p className="font-medium">In Progress</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(report.updatedAt)}
                        </p>
                      </div>
                    </div>
                  ) : null}
                  {report.status === "fixed" ? (
                    <div className="flex items-start">
                      <div className="bg-green-500 rounded-full h-4 w-4 mt-1 mr-3"></div>
                      <div>
                        <p className="font-medium">Fixed</p>
                        <p className="text-sm text-gray-500">Not yet</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportDetail;
