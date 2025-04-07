
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { mockReports } from "@/services/mockData";
import { PotholeReport } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Clock,
  Image,
} from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [reports, setReports] = useState<PotholeReport[]>(mockReports);
  const [filter, setFilter] = useState<string>("all");

  // Handle filter change
  const handleFilterChange = (value: string) => {
    setFilter(value);
    if (value === "all") {
      setReports(mockReports);
    } else {
      setReports(
        mockReports.filter((report) => report.status === value)
      );
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Community Pothole Reports
            </h1>
            <p className="text-gray-600">
              Help improve our roads by reporting, voting, and commenting on
              potholes in your community.
            </p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <Select 
              value={filter} 
              onValueChange={handleFilterChange}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All reports</SelectItem>
                <SelectItem value="reported">Reported</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
              </SelectContent>
            </Select>
            
            {isAuthenticated && (
              <Button className="bg-brand-blue hover:bg-blue-600">
                <Link to="/report/new" className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  Report Pothole
                </Link>
              </Button>
            )}
          </div>
        </div>

        {!isAuthenticated && (
          <Card className="bg-brand-lightgray border-l-4 border-brand-blue">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-lg font-semibold mb-1">
                    Sign in to report potholes
                  </h3>
                  <p className="text-gray-600">
                    Join our community to report potholes, vote, and comment.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" asChild>
                    <Link to="/login">Log in</Link>
                  </Button>
                  <Button className="bg-brand-blue hover:bg-blue-600" asChild>
                    <Link to="/signup">Sign up</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {reports.length === 0 ? (
          <div className="text-center py-12">
            <Image className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No reports found
            </h3>
            <p className="text-gray-500 mb-6">
              No pothole reports match your current filter.
            </p>
            <Button
              variant="outline"
              onClick={() => handleFilterChange("all")}
            >
              View all reports
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Link
                to={`/report/${report.id}`}
                key={report.id}
                className="h-full"
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={report.imageUrl}
                      alt={report.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge
                      className={`absolute top-3 right-3 ${getStatusColor(
                        report.status
                      )} text-white`}
                    >
                      {report.status.replace("_", " ")}
                    </Badge>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{report.title}</CardTitle>
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="truncate">{report.location.address}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-600 line-clamp-2">
                      {report.description}
                    </p>
                  </CardContent>
                  
                  <CardFooter className="border-t pt-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-sm">{report.upvotes}</span>
                      </div>
                      <div className="flex items-center">
                        <ArrowDown className="h-4 w-4 text-red-600 mr-1" />
                        <span className="text-sm">{report.downvotes}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 text-brand-blue mr-1" />
                        <span className="text-sm">{report.comments.length}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatDate(report.createdAt)}</span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
