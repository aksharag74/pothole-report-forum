
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Upload, AlertTriangle } from "lucide-react";

const NewReport = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    imageFile: null as File | null,
    imagePreview: "",
    isSubmitting: false,
  });

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Login required",
        description: "You must be logged in to report a pothole.",
      });
      navigate("/login");
    }
  }, [isAuthenticated, navigate, toast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: previewUrl,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.trim()) {
      toast({
        variant: "destructive",
        title: "Missing title",
        description: "Please enter a title for your report.",
      });
      return;
    }
    
    if (!formData.description.trim()) {
      toast({
        variant: "destructive",
        title: "Missing description",
        description: "Please describe the pothole issue.",
      });
      return;
    }
    
    if (!formData.address.trim()) {
      toast({
        variant: "destructive",
        title: "Missing location",
        description: "Please enter the location of the pothole.",
      });
      return;
    }
    
    if (!formData.imageFile) {
      toast({
        variant: "destructive",
        title: "Missing image",
        description: "Please upload a photo of the pothole.",
      });
      return;
    }

    // Submit form
    setFormData((prev) => ({ ...prev, isSubmitting: true }));
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Report submitted",
        description: "Your pothole report has been submitted successfully!",
      });
      navigate("/");
    }, 1500);
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => navigate("/")}
        >
          &larr; Back to Reports
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-brand-orange" />
              <CardTitle>Report a Pothole</CardTitle>
            </div>
            <CardDescription>
              Fill out the form below to report a pothole in your community.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="E.g., Deep pothole on Main Street"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the pothole, its size, depth, and any other relevant details..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Location</Label>
                <div className="flex">
                  <div className="flex-grow">
                    <Input
                      id="address"
                      name="address"
                      placeholder="Street address or intersection"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  <Button 
                    type="button" 
                    variant="outline"
                    className="ml-2"
                    onClick={() => toast({
                      title: "Location feature",
                      description: "This would use your current location in a real app."
                    })}
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter the street address or intersection where the pothole is located
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Photo</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {formData.imagePreview ? (
                    <div className="space-y-3">
                      <img
                        src={formData.imagePreview}
                        alt="Pothole preview"
                        className="mx-auto max-h-60 rounded-md"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          imageFile: null,
                          imagePreview: ""
                        }))}
                      >
                        Remove photo
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center cursor-pointer py-6">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <span className="text-sm font-medium">
                        Upload photo of pothole
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        Click to browse or drag and drop
                      </span>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-4">
            <Button
              variant="outline"
              disabled={formData.isSubmitting}
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-brand-blue hover:bg-blue-600"
              disabled={formData.isSubmitting}
            >
              {formData.isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default NewReport;
