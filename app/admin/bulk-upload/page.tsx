"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Download, FileSpreadsheet, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface UploadResult {
  success: boolean
  message: string
  results?: {
    created: number
    updated: number
    errors: { row: number; error: string }[]
  }
}

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<UploadResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".csv")) {
        alert("Please select a CSV file")
        return
      }
      setFile(selectedFile)
      setResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/admin/bulk-upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setResult({
          success: false,
          message: data.error || "Upload failed",
        })
      } else {
        setResult({
          success: true,
          message: data.message,
          results: data.results,
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Upload failed. Please try again.",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleClear = () => {
    setFile(null)
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bulk Upload Law Firms</h1>
        <p className="text-muted-foreground">
          Upload multiple law firm profiles at once using a CSV file
        </p>
      </div>

      {/* Template Download */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Download Template
          </CardTitle>
          <CardDescription>
            Download the CSV template to see the required format for bulk uploads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <a
              href="/templates/firm-bulk-upload-template.csv"
              download="firm-bulk-upload-template.csv"
            >
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download CSV Template
              </Button>
            </a>
            <p className="text-sm text-muted-foreground">
              To use in Google Sheets: Download CSV, then go to Google Sheets → File → Import
            </p>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Template Columns:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><strong>Firm Name</strong> (required) - The official name of the law firm</li>
              <li><strong>Website</strong> - Firm website URL</li>
              <li><strong>Phone</strong> - Main phone number</li>
              <li><strong>Description</strong> - Brief description of the firm</li>
              <li><strong>Founded Year</strong> - Year the firm was established</li>
              <li><strong>Employee Count</strong> - Number of employees</li>
              <li><strong>Tier Level</strong> - Ranking tier (1-5, where 1 is highest)</li>
              <li><strong>Is Active</strong> - Whether profile is active (true/false)</li>
              <li><strong>Is Premium</strong> - Premium profile status (true/false)</li>
              <li><strong>Office Address</strong> (required) - Street address</li>
              <li><strong>Office City</strong> (required) - City name</li>
              <li><strong>Office State</strong> (required) - State code (e.g., NY, CA)</li>
              <li><strong>Office Postal Code</strong> - ZIP code</li>
              <li><strong>Office Phone</strong> - Office-specific phone</li>
              <li><strong>Is Primary Office</strong> - Primary office indicator (true/false)</li>
              <li><strong>Practice Areas</strong> - Comma-separated list of practice areas</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload CSV File
          </CardTitle>
          <CardDescription>
            Select your completed CSV file to upload law firm profiles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* File Input */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                file ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => fileInputRef.current?.click()}
              style={{ cursor: "pointer" }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />

              {file ? (
                <div className="space-y-2">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="font-medium">Click to select a CSV file</p>
                  <p className="text-sm text-muted-foreground">
                    or drag and drop
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="flex-1"
              >
                {uploading ? "Uploading..." : "Upload and Process"}
              </Button>
              {file && (
                <Button variant="outline" onClick={handleClear}>
                  Clear
                </Button>
              )}
            </div>

            {/* Results */}
            {result && (
              <div
                className={`p-4 rounded-lg ${
                  result.success
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        result.success ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {result.message}
                    </p>

                    {result.results && (
                      <div className="mt-4 space-y-2">
                        <div className="flex gap-6 text-sm">
                          <span className="text-green-700">
                            <strong>{result.results.created}</strong> created
                          </span>
                          <span className="text-blue-700">
                            <strong>{result.results.updated}</strong> updated
                          </span>
                          {result.results.errors.length > 0 && (
                            <span className="text-red-700">
                              <strong>{result.results.errors.length}</strong> errors
                            </span>
                          )}
                        </div>

                        {result.results.errors.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-red-800 mb-2">
                              Errors:
                            </p>
                            <ul className="text-sm text-red-700 space-y-1 max-h-40 overflow-y-auto">
                              {result.results.errors.map((err, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>
                                    Row {err.row}: {err.error}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <ol className="space-y-2 text-muted-foreground">
            <li>Download the CSV template or open it in Google Sheets</li>
            <li>Fill in your law firm data following the column format</li>
            <li>
              For <strong>Practice Areas</strong>, use comma-separated values (e.g., "Corporate Law, Litigation, Tax Law")
            </li>
            <li>
              <strong>State</strong> can be entered as a code (NY, CA) or full name (New York, California)
            </li>
            <li>
              If a firm with the same name already exists, it will be updated instead of creating a duplicate
            </li>
            <li>Save as CSV and upload the file</li>
            <li>Review the results and fix any errors</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
