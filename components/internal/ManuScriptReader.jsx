// "use client";
// import React, { useEffect, useState, useRef } from "react";
// import { useRouter, useParams, useSearchParams } from "next/navigation";
// import { FaArrowLeft, FaSpinner, FaScroll, FaBookOpen, FaFont } from "react-icons/fa";
// import * as pdfjsLib from "pdfjs-dist";

// // PDF worker setup for Next.js
// pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// const LOCAL_KEY = "yoga-local-manuscripts";

// const dataURLToArrayBuffer = (dataUrl) => {
//   const base64 = dataUrl.split(",")[1] || "";
//   const binary = atob(base64);
//   const bytes = new Uint8Array(binary.length);
//   for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
//   return bytes.buffer;
// };

// export default function ManuscriptReader() {
//   const router = useRouter();
//   const params = useParams();
//   const searchParams = useSearchParams();
//   const manuscriptParams = params.manuscipt;
//   const id = Array.isArray(manuscriptParams) ? manuscriptParams[manuscriptParams.length - 1] : params.id;
  
//   const source = searchParams.get("source");
//   const pdfUrlParam = searchParams.get("pdfUrl");
//   const titleParam = searchParams.get("title");
//   const authorParam = searchParams.get("author");

//   const [resolved, setResolved] = useState(null);
//   const [pages, setPages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [fontSize, setFontSize] = useState(18);
//   const containerRef = useRef(null);

//   const isLocal = source === "local";

//   useEffect(() => {
//     let src = null;

//     if (pdfUrlParam) {
//       src = {
//         title: titleParam || "Manuscript",
//         author: authorParam || "Traditional",
//         pdf_url: pdfUrlParam,
//       };
//     } else if (isLocal) {
//       try {
//         const raw = localStorage.getItem(LOCAL_KEY);
//         const list = raw ? JSON.parse(raw) : [];
//         const found = list.find((l) => l.id === id);
//         if (found) {
//           src = {
//             title: found.title,
//             author: "Your Library",
//             pdf_data: dataURLToArrayBuffer(found.data_url),
//           };
//         }
//       } catch (e) {
//         console.error(e);
//       }
//     } else if (typeof getBooks === "function") {
//       const found = getBooks().find((b) => b.id === id);
//       if (found) {
//         src = { title: found.title, author: found.author, pdf_url: found.pdfUrl };
//       }
//     }

//     if (!src) {
//       setError("Manuscript not found");
//       setLoading(false);
//       return;
//     }

//     setResolved(src);

//     const loadPdf = async () => {
//       try {
//         setLoading(true);
//         const loadingTask = src.pdf_data
//           ? pdfjsLib.getDocument({ data: src.pdf_data })
//           : pdfjsLib.getDocument({ url: src.pdf_url, disableFontFace: false, });
        
//         const pdf = await loadingTask.promise;
//         const pageContents = [];
//         const maxPages = Math.min(pdf.numPages, 50);

//         for (let i = 1; i <= maxPages; i++) {
//           const page = await pdf.getPage(i);
//           const content = await page.getTextContent();
//           const text = content.items
//             .map((item) => item.str || "")
//             .join(" ")
//             .replace(/\s+/g, " ")
//             .trim();
//           pageContents.push({ pageNumber: i, text });
//         }
//         setPages(pageContents);
//       } catch (err) {
//         console.error("PDF load error:", err);
//         setError("Unable to load this manuscript.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadPdf();
//   }, [id, isLocal, pdfUrlParam, titleParam, authorParam]);

//   const splitParagraphs = (text) => {
//     if (!text) return [];
//     const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
//     const paragraphs = [];
//     for (let i = 0; i < sentences.length; i += 3) {
//       paragraphs.push(sentences.slice(i, i + 3).join(" "));
//     }
//     return paragraphs;
//   };

//   return (
//     <div className="min-h-screen bg-linear-to-b from-cream to-cream-dark">
//       <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
//         <div className="flex items-center justify-between px-4 py-3 max-w-3xl mx-auto">
//           <button
//             onClick={() => router.back()}
//             className="flex items-center text-sm font-serif hover:opacity-70 transition-opacity"
//           >
//             <FaArrowLeft className="w-4 h-4 mr-1" /> Back
//           </button>
//           <div className="flex items-center gap-1">
//             <button 
//               onClick={() => setFontSize((s) => Math.max(14, s - 2))}
//               className="p-2 hover:bg-secondary/50 rounded-md"
//             >
//               <FaFont className="w-3.5 h-3.5" />
//             </button>
//             <button 
//               onClick={() => setFontSize((s) => Math.min(28, s + 2))}
//               className="p-2 hover:bg-secondary/50 rounded-md"
//             >
//               <FaFont className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       </header>

//       {resolved && (
//         <div className="px-4 pt-8 pb-6 text-center max-w-3xl mx-auto lotus-pattern">
//           <div className="flex items-center justify-center gap-2 mb-2">
//             <FaScroll className="w-5 h-5 text-gold" />
//             <h1 className="font-display text-3xl text-gradient-saffron">{resolved.title}</h1>
//             <FaScroll className="w-5 h-5 text-gold" />
//           </div>
//           <p className="font-serif italic text-muted-foreground">— {resolved.author} —</p>
//           <div className="ornament-line w-32 mx-auto mt-4" />
//         </div>
//       )}

//       <main ref={containerRef} className="px-4 pb-16 max-w-3xl mx-auto">
//         {loading && (
//           <div className="flex flex-col items-center justify-center py-20 gap-3">
//             <FaSpinner className="w-8 h-8 text-primary animate-spin" />
//             <p className="font-serif italic text-muted-foreground">Unrolling the manuscript...</p>
//           </div>
//         )}

//         {error && (
//           <div className="card-yoga sanskrit-border p-8 text-center mt-8">
//             <FaBookOpen className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
//             <h3 className="font-display text-xl mb-2">Cannot open manuscript</h3>
//             <p className="font-serif italic text-muted-foreground mb-4">{error}</p>
//           </div>
//         )}

//         {!loading && !error && pages.map((page) => (
//           <section
//             key={page.pageNumber}
//             className="manuscript-page sanskrit-border p-7 md:p-10 relative mb-10 bg-white/50"
//             style={{ fontSize: `${fontSize}px` }}
//           >
//             <div className="ornament-line w-24 mx-auto mb-5 opacity-70" />
//             <div className="space-y-5 font-serif text-foreground/90 leading-[1.9] text-justify">
//               {splitParagraphs(page.text).map((para, idx) => (
//                 <p key={idx} className={idx === 0 ? "first-letter:font-display first-letter:text-5xl first-letter:text-primary first-letter:float-left first-letter:mr-2 first-letter:leading-none first-letter:mt-1" : ""}>
//                   {para}
//                 </p>
//               ))}
//             </div>
//             <div className="flex items-center justify-center gap-3 mt-8 pt-4 border-t border-gold/20">
//               <span className="text-gold">✦</span>
//               <span className="font-display text-sm text-muted-foreground">{page.pageNumber}</span>
//               <span className="text-gold">✦</span>
//             </div>
//           </section>
//         ))}

//         {!loading && !error && pages.length > 0 && (
//           <div className="text-center py-8">
//             <div className="ornament-line w-40 mx-auto mb-3" />
//             <p className="font-display text-gold text-lg">॥ इति समाप्तम् ॥</p>
//             <p className="font-serif italic text-sm text-muted-foreground mt-1">Thus it is concluded</p>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { FaArrowLeft, FaSpinner, FaScroll, FaBookOpen, FaFont } from "react-icons/fa";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/legacy/build/pdf.worker.min.mjs`;

// --- SUB-COMPONENT FOR CLEAN RENDERING ---
const PDFPageCanvas = ({ page, scale = 2.0 }) => {
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);

  useEffect(() => {
    const renderPage = async () => {
      const canvas = canvasRef.current;
      if (!canvas || !page) return;

      const context = canvas.getContext("2d");
      
      // 1. Cancel any existing render operation on this canvas
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      const viewport = page.getViewport({ scale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      // 2. Start new render task and store reference
      renderTaskRef.current = page.render(renderContext);

      try {
        await renderTaskRef.current.promise;
      } catch (err) {
        if (err.name !== "RenderingCancelledException") {
          console.error("Canvas render error:", err);
        }
      }
    };

    renderPage();

    // Cleanup: Cancel rendering if component unmounts
    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [page, scale]);

  return (
    <div className="flex justify-center w-full overflow-hidden rounded-sm">
      <canvas 
        ref={canvasRef} 
        className="max-w-full h-auto shadow-sm"
        style={{ filter: "sepia(10%) contrast(105%)" }} 
      />
    </div>
  );
};

// --- MAIN READER COMPONENT ---
export default function ManuscriptReader() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const id = params.id;
  const source = searchParams.get("source");
  const pdfUrlParam = searchParams.get("pdfUrl");
  const titleParam = searchParams.get("title");
  const authorParam = searchParams.get("author");

  const [resolved, setResolved] = useState(null);
  const [pages, setPages] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoom, setZoom] = useState(2.0); 

  useEffect(() => {
    let src = null;
    if (pdfUrlParam) {
      src = { title: titleParam || "Manuscript", author: authorParam || "Traditional", pdf_url: pdfUrlParam };
    } else if (source === "local") {
      try {
        const raw = localStorage.getItem("yoga-local-manuscripts");
        const list = raw ? JSON.parse(raw) : [];
        const found = list.find((l) => l.id === id);
        if (found) src = { title: found.title, author: "Your Library", pdf_url: found.data_url };
      } catch (e) { console.error(e); }
    }

    if (!src) { setError("Manuscript not found"); setLoading(false); return; }
    setResolved(src);

    const loadPdf = async () => {
      try {
        setLoading(true);
        const loadingTask = pdfjsLib.getDocument({ url: src.pdf_url, disableFontFace: false });
        const pdf = await loadingTask.promise;
        
        const pageObjects = [];
        // REMOVED 50 PAGE LIMIT: Load all pages
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          pageObjects.push(page);
        }
        setPages(pageObjects);
      } catch (err) {
        console.error("PDF load error:", err);
        setError("Unable to load the manuscript.");
      } finally {
        setLoading(false);
      }
    };

    loadPdf();
  }, [id, source, pdfUrlParam, titleParam, authorParam]);

  return (
    <div className="min-h-screen bg-linear-to-b from-cream to-cream-dark">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-3xl mx-auto">
          <button onClick={() => router.back()} className="flex items-center text-sm font-serif hover:opacity-70">
            <FaArrowLeft className="w-4 h-4 mr-1" /> Back
          </button>
          <div className="flex items-center gap-2">
             <button onClick={() => setZoom((z) => Math.max(1.0, z - 0.5))} className="p-2 hover:bg-secondary/50 rounded-md border border-border">
              <FaFont className="w-3 h-3 scale-75" />
            </button>
            <button onClick={() => setZoom((z) => Math.min(3.5, z + 0.5))} className="p-2 hover:bg-secondary/50 rounded-md border border-border">
              <FaFont className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {resolved && (
        <div className="px-4 pt-8 pb-6 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FaScroll className="w-5 h-5 text-gold" />
            <h1 className="font-display text-3xl text-gradient-saffron">{resolved.title}</h1>
            <FaScroll className="w-5 h-5 text-gold" />
          </div>
          <p className="font-serif italic text-muted-foreground">— {resolved.author} —</p>
          <div className="ornament-line w-32 mx-auto mt-4" />
        </div>
      )}

      <main className="px-4 pb-16 max-w-3xl mx-auto">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <FaSpinner className="w-8 h-8 text-primary animate-spin" />
            <p className="font-serif italic text-muted-foreground">Unrolling the manuscript...</p>
          </div>
        )}

        {!loading && !error && pages.map((page, index) => (
          <section key={index} className="manuscript-page sanskrit-border p-3 md:p-6 relative mb-12 bg-white/80 shadow-md">
            <PDFPageCanvas page={page} scale={zoom} />
            <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-gold/20">
              <span className="text-gold">✦</span>
              <span className="font-display text-sm text-muted-foreground">{index + 1}</span>
              <span className="text-gold">✦</span>
            </div>
          </section>
        ))}

        {!loading && pages.length > 0 && (
          <div className="text-center py-8">
            <p className="font-display text-gold text-lg">॥ इति समाप्तम् ॥</p>
          </div>
        )}
      </main>
    </div>
  );
}