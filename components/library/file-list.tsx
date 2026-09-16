"use client";

import { FileIcon, Download, FileText, ImageIcon, FileAudio, FileVideo, FileArchive } from "lucide-react";

interface ProductFile {
  id: string;
  name: string;
  storageKey: string;
  sizeInBytes: bigint | number | null;
  contentType: string | null;
}

interface FileListProps {
  files: ProductFile[];
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function getFileIcon(contentType: string | null) {
  if (!contentType) return <FileIcon className="w-6 h-6 text-white/50" />;
  if (contentType.includes("image")) return <ImageIcon className="w-6 h-6 text-blue-400" />;
  if (contentType.includes("video")) return <FileVideo className="w-6 h-6 text-purple-400" />;
  if (contentType.includes("audio")) return <FileAudio className="w-6 h-6 text-green-400" />;
  if (contentType.includes("pdf") || contentType.includes("text")) return <FileText className="w-6 h-6 text-red-400" />;
  if (contentType.includes("zip") || contentType.includes("tar") || contentType.includes("compressed")) return <FileArchive className="w-6 h-6 text-yellow-400" />;
  
  return <FileIcon className="w-6 h-6 text-white/50" />;
}

export function FileList({ files }: FileListProps) {
  if (files.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground font-medium border-4 border-dashed border-black rounded-xl bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        No files attached to this product.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {files.map((file) => (
        <div 
          key={file.id} 
          className="flex items-center justify-between p-4 bg-white border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center border-2 border-black">
              {getFileIcon(file.contentType)}
            </div>
            <div>
              <p className="font-black text-black line-clamp-1 text-lg">{file.name}</p>
              {file.sizeInBytes && (
                <p className="text-sm font-medium text-muted-foreground mt-0.5">
                  {formatBytes(Number(file.sizeInBytes))}
                </p>
              )}
            </div>
          </div>
          
          <a
            href={file.storageKey}
            download={file.name}
            className="flex items-center gap-2 px-4 py-2 bg-[#ff90e8] hover:bg-[#ff90e8]/90 text-black border-2 border-black rounded-md font-bold transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </a>
        </div>
      ))}
    </div>
  );
}
