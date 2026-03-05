import React, { useState, useRef } from "react";
import { MainLayout } from "../components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Upload, CheckCircle2, FileText, Loader2, X, Download } from "lucide-react";
import { toast } from "../components/ui/sonner";
import { useAuth } from '@/contexts/AuthContext';
import { cn } from "../lib/utils";

interface TimetablePreview {
  facultyId: string;
  facultyName: string;
  department: string;
  day: string;
  hour: number;
  subject: string;
  section: string;
  year: string;
  academicYear: string;
}

export default function CreateTimetable() {
  const [academicYear, setAcademicYear] = useState("2025-2026");
  const [yearOptions, setYearOptions] = useState<string[]>([]);
  const [semester, setSemester] = useState("odd");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [previewData, setPreviewData] = useState<TimetablePreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { authToken } = useAuth();

  // load academic years from backend (derived from student_profile.batch)
  React.useEffect(() => {
    fetch('/api/v1/students/academic-years')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setYearOptions(data.data);
          if (data.data.length > 0) {
            setAcademicYear(data.data[0]);
          }
        }
      })
      .catch(err => {
        console.error('Failed to load academic years', err);
      });
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv'))) {
      const validationError = await validateCsvFile(droppedFile);
      if (validationError) {
        toast.error(validationError);
        return;
      }
      setFile(droppedFile);
      setUploadSuccess(false);
      setPreviewData([]);
    } else {
      toast.error('Please select a valid CSV file.');
    }
  };

  const validateCsvFile = async (file: File): Promise<string | null> => {
    // read first few KB to check header and content
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        const firstLine = text.split(/\r?\n/)[0] || '';
        // basic sanity: reject HTML pages
        if (firstLine.trim().startsWith('<')) {
          resolve('File does not appear to be a CSV (received HTML/React code)');
          return;
        }
        // Accept both camelCase and snake_case column names
        const requiredFieldMappings = [
          ['facultyId', 'faculty_id', 'faculty_college_code'],
          ['facultyName', 'faculty_name'],
          ['department', 'dept'],
          ['year', 'academic_year'],
          ['section', 'class_section'],
          ['day', 'day_of_week'],
          ['hour', 'period'],
          ['subject', 'subject_code'],
          ['academicYear', 'academic_year', 'year_sem']
        ];
        
        const headers = firstLine.split(',').map(h=>h.trim());
        const missingFields = [];
        
        for (const fieldOptions of requiredFieldMappings) {
          const found = fieldOptions.some(option => headers.includes(option));
          if (!found) {
            missingFields.push(fieldOptions.join('/'));
          }
        }
        
        if (missingFields.length > 0) {
          resolve(`Missing required columns: ${missingFields.join(', ')}`);
          return;
        }
        resolve(null);
      };
      reader.onerror = () => resolve('Unable to read file for validation');
      reader.readAsText(file.slice(0, 1024));
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        toast.error('Please select a valid CSV file.');
        setFile(null);
        return;
      }
      const validationError = await validateCsvFile(selectedFile);
      if (validationError) {
        toast.error(validationError);
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setUploadSuccess(false);
      setPreviewData([]);
    }
  };

  const clearFile = () => {
    setFile(null);
    setUploadSuccess(false);
    setPreviewData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a CSV file to upload.');
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('academicYear', academicYear);
    formData.append('semester', semester);

    try {
      // Only set Authorization header if token exists
      const token = authToken || localStorage.getItem('authToken');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(
        "/api/v1/timetable/bulk-upload",
        {
          method: "POST",
          body: formData,
          headers
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(`Bulk timetable uploaded successfully! ${data.insertedCount} records inserted and ${data.deletedCount || 0} old records replaced.`);
        
        setUploadSuccess(true);
        
        // Set preview data from response
        if (data.preview && data.preview.length > 0) {
          // Use preview data directly from the response
          const preview: TimetablePreview[] = data.preview.map((item: any) => ({
            facultyId: item.facultyId || "",
            facultyName: item.facultyName || "",
            department: item.department || "",
            day: item.day || "",
            hour: item.hour || 0,
            subject: item.subject || "",
            section: item.section || "",
            year: item.year || "",
            academicYear: item.academicYear || academicYear
          }));
          setPreviewData(preview);
        }
        
        // Clear file input after success
        clearFile();
      } else {
        const errorMsg = data.error || data.message || "Failed to upload timetable.";
        toast.error(errorMsg);
      }
    } catch (error: any) {
      console.error("Error uploading timetable:", error);
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setIsUploading(false);
    }
  };

  const downloadFormat = () => {
    // use backend route to avoid dev server returning index.html
    const link = document.createElement('a');
    link.href = '/api/v1/timetable/format';
    link.download = 'Timetable_Format.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bulk Timetable Upload</h1>
          <p className="text-muted-foreground">
            Upload department-wide timetable CSV file containing multiple faculty schedules.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Side - Upload Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Upload Bulk Timetable</CardTitle>
                <CardDescription>
                  Fill in the details and upload your CSV file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Academic Year */}
                <div className="space-y-2">
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Select value={academicYear} onValueChange={setAcademicYear}>
                    <SelectTrigger id="academicYear">
                      <SelectValue placeholder="Select academic year" />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.length > 0 ? (
                        yearOptions.map((yr) => (
                          <SelectItem key={yr} value={yr}>{yr}</SelectItem>
                        ))
                      ) : (
                        // fallback options while loading
                        <>
                          <SelectItem value="2024-2025">2024-2025</SelectItem>
                          <SelectItem value="2025-2026">2025-2026</SelectItem>
                          <SelectItem value="2026-2027">2026-2027</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Semester */}
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Select value={semester} onValueChange={setSemester}>
                    <SelectTrigger id="semester">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="odd">Odd Semester</SelectItem>
                      <SelectItem value="even">Even Semester</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* File Upload - Drag & Drop Style */}
                <div className="space-y-2">
                  <Label>CSV File Upload</Label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                      "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
                      isDragging 
                        ? "border-primary bg-primary/5" 
                        : file 
                          ? "border-green-500 bg-green-50" 
                          : "border-muted-foreground/25 hover:border-muted-foreground/50",
                      "relative"
                    )}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    
                    {file ? (
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-12 w-12 text-green-500" />
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{file.name}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              clearFile();
                            }}
                            className="p-1 hover:bg-muted rounded-full"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Click to change file
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-12 w-12 text-muted-foreground" />
                        <p className="font-medium">Drag and drop your CSV file here</p>
                        <p className="text-sm text-muted-foreground">
                          or click to browse
                        </p>
                      </div>
                    )}
                  </div>
                  {file && (
                    <p className="text-sm text-green-600 flex items-center gap-2 mt-2">
                      <CheckCircle2 className="h-4 w-4" />
                      {file.name} selected ({Math.round(file.size / 1024)} KB)
                    </p>
                  )}
                </div>

                {/* Upload Button */}
                <Button
                  onClick={handleUpload}
                  className="w-full"
                  disabled={isUploading || !file}
                  size="lg"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Bulk Timetable
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Preview Table - Shows after successful upload */}
            {uploadSuccess && previewData.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Upload Preview</CardTitle>
                  <CardDescription>
                    Showing sample of uploaded timetable data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="p-2 text-left font-medium">Faculty ID</th>
                          <th className="p-2 text-left font-medium">Faculty Name</th>
                          <th className="p-2 text-left font-medium">Department</th>
                          <th className="p-2 text-left font-medium">Day</th>
                          <th className="p-2 text-left font-medium">Hour</th>
                          <th className="p-2 text-left font-medium">Subject</th>
                          <th className="p-2 text-left font-medium">Section</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((row, index) => (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="p-2">{row.facultyId}</td>
                            <td className="p-2">{row.facultyName}</td>
                            <td className="p-2">{row.department}</td>
                            <td className="p-2">{row.day}</td>
                            <td className="p-2">{row.hour}</td>
                            <td className="p-2">{row.subject}</td>
                            <td className="p-2">{row.section}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Side - CSV Format Requirements */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>CSV Format Requirements</CardTitle>
                <CardDescription>
                  Required columns for bulk upload
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Button 
                    onClick={downloadFormat}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Timetable Format
                  </Button>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Required Columns (Header Row Mandatory):
                  </p>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="bg-background p-2 rounded border">
                      <span className="text-primary font-semibold">facultyId</span>
                    </div>
                    <div className="bg-background p-2 rounded border">
                      <span className="text-primary font-semibold">facultyName</span>
                    </div>
                    <div className="bg-background p-2 rounded border">
                      <span className="text-primary font-semibold">department</span>
                    </div>
                    <div className="bg-background p-2 rounded border">
                      <span className="text-primary font-semibold">year</span>
                    </div>
                    <div className="bg-background p-2 rounded border">
                      <span className="text-primary font-semibold">section</span> <span className="text-xs italic">(optional)</span>
                    </div>
                    <div className="bg-background p-2 rounded border">
                      <span className="text-primary font-semibold">day</span>
                    </div>
                    <div className="bg-background p-2 rounded border">
                      <span className="text-primary font-semibold">hour</span>
                    </div>
                    <div className="bg-background p-2 rounded border">
                      <span className="text-primary font-semibold">subject</span>
                    </div>
                    <div className="bg-background p-2 rounded border">
                      <span className="text-primary font-semibold">academicYear</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 italic">
                    Note: Column names must match exactly as shown above.
                  </p>
                </div>

                {/* Sample CSV */}
                <div className="mt-6">
                  <p className="text-sm font-medium mb-2">Example CSV Content:</p>
                  <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-xs font-mono whitespace-pre">
{`# header: section column is optional (you may leave it blank or omit entirely)
facultyId,facultyName,department,year,day,hour,subject,academicYear
FAC001,John Smith,CSE,1,Monday,1,Math,2025-2026
FAC002,Jane Doe,CSE,2,Tuesday,1,Chemistry,2025-2026

# with section supplied
facultyId,facultyName,department,year,section,day,hour,subject,academicYear
FAC003,Alice Brown,CSE,3,A,Wednesday,2,Physics,2025-2026`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
