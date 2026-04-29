"use client";
import React, { useState, useEffect } from "react";
import { FaPlus, FaBook, FaCloudUploadAlt, FaFilePdf, FaImage, FaTrash, FaEye } from "react-icons/fa";
import CustomDialog from "@/components/comman/CustomDialog";
import DataTable from "@/components/comman/DataTable";
import { useRouter } from 'next/navigation';

const AdminBooks = () => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [booksData, setBooksData] = useState([]);

  // Metadata Fields (Auto-filled but editable)
  const [metadata, setMetadata] = useState({
    title: "",
    author: "",
    category: "Manuscript"
  });

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/upload/manuscript');
      
      // Safety check: if response is not JSON (e.g. HTML error page)
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("API returned non-JSON response:",);
        throw new Error(`Expected JSON but got ${contentType}. Status: ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setBooksData(data);
      } else {
        console.warn("API returned unexpected data structure:",);
        setBooksData([]);
      }
    } catch (error) {
      console.error("Fetch failed:",);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
      
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
        
        // AUTO-FILL metadata from file name
        const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        setMetadata(prev => ({
          ...prev,
          title: fileNameWithoutExt,
          author: prev.author || "Traditional"
        }));
      } else {
        alert("Please select a PDF or Image file.");
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !metadata.title) {
      alert("Please select a file and provide a title.");
      return;
    }
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', metadata.title);
    formData.append('author', metadata.author || "Unknown");
    formData.append('category', metadata.category);

    try {
      const response = await fetch('/api/upload/manuscript', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setIsDialogOpen(false);
        resetForm();
        fetchBooks();
      } else {
        const errorData = await response.json();
        alert(`Upload failed: ${errorData.error || "Unknown error"}\n${errorData.details || ""}`);
      }
    } catch (error) {
      console.error("Upload error:");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setMetadata({
      title: "",
      author: "",
      category: "Manuscript"
    });
  };

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Author", accessor: "author" },
    { 
      header: "Category", 
      accessor: "category",
      render: (val) => (
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
          {val}
        </span>
      )
    },
    { 
      header: "Added On", 
      accessor: "createdAt",
      render: (val) => new Date(val).toLocaleDateString()
    },
    {
    header: "Action",
    accessor: "id",
    render: (id, item) => (
      <button 
        onClick={(e) => {
          e.stopPropagation(); // Prevent double triggers if row also has click
          const query = new URLSearchParams({
            pdfUrl: item.pdfUrl || "",
            title: item.title || "",
            author: item.author || ""
          }).toString();
          router.push(`/media/books/${id}?${query}`);
        }}
        className="text-primary font-serif hover:underline text-sm"
      >
        Read Granth
      </button>
    )
  }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-primary">Library Management</h1>
          <p className="text-sm text-muted-foreground font-serif">पन्थीनां पुरावृत्तम् — Sacred Texts & Digital Repository</p>
        </div>
        
        {/* <button 
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold shadow-soft hover:shadow-elevated transition-all active:scale-95"
        >
          <FaPlus className="w-4 h-4" />
          Add New Book
        </button> */}
      </div>

      <div className="ornament-line w-full" />

      <DataTable 
        columns={columns} 
        data={booksData} 
        isLoading={isLoading}
        onView={(item) => window.open(item.pdfUrl, '_blank')}
        onDelete={(item) => console.log("Delete", item.id)}
      />

      <CustomDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          resetForm();
        }}
        title="Register New Document"
        footer={
          <>
            <button onClick={() => setIsDialogOpen(false)} className="text-muted-foreground hover:text-foreground text-sm font-medium px-4">Cancel</button>
            <button
              disabled={!selectedFile || isUploading}
              onClick={handleUpload}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                !selectedFile || isUploading ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground shadow-lg hover:scale-105'
              }`}
            >
              {isUploading ? "Uploading..." : "Save to Repository"}
            </button>
          </>
        }
      >
        <div className="space-y-5">
          {/* File Selection Area */}
          <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${selectedFile ? 'border-primary bg-primary/5' : 'border-border'}`}>
            <input type="file" accept=".pdf,image/*" onChange={handleFileChange} className="hidden" id="book-upload" />
            <label htmlFor="book-upload" className="cursor-pointer">
              {selectedFile ? (
                <div className="flex flex-col items-center">
                  {selectedFile.type.includes('pdf') ? <FaFilePdf className="w-10 h-10 text-primary mb-2" /> : <FaImage className="w-10 h-10 text-primary mb-2" />}
                  <p className="text-sm font-medium truncate max-w-62.5">{selectedFile.name}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center py-4">
                  <FaCloudUploadAlt className="w-12 h-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-foreground">Click to select PDF or Image</p>
                </div>
              )}
            </label>
          </div>

          {/* Metadata Form */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-display text-primary/70 mb-1 block">Title (Auto-filled)</label>
              <input 
                type="text" 
                value={metadata.title}
                onChange={(e) => setMetadata({...metadata, title: e.target.value})}
                placeholder="Enter document title"
                className="w-full bg-muted/30 border border-border rounded-lg px-4 py-2.5 text-sm font-serif outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest font-display text-primary/70 mb-1 block">Author</label>
                <input 
                  type="text" 
                  value={metadata.author}
                  onChange={(e) => setMetadata({...metadata, author: e.target.value})}
                  placeholder="e.g. Maharishi Vyasa"
                  className="w-full bg-muted/30 border border-border rounded-lg px-4 py-2.5 text-sm font-serif outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest font-display text-primary/70 mb-1 block">Category</label>
                <select 
                  value={metadata.category}
                  onChange={(e) => setMetadata({...metadata, category: e.target.value})}
                  className="w-full bg-muted/30 border border-border rounded-lg px-4 py-2.5 text-sm font-serif outline-none focus:border-primary transition-colors appearance-none"
                >
                  <option value="Manuscript">Manuscript</option>
                  <option value="Book">Book</option>
                  <option value="Research">Research</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </CustomDialog>
    </div>
  );
};

export default AdminBooks;