"use client";
import React from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";



const DataTable = ({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  onView,
  isLoading = false,
  emptyMessage = "No records found."
}) => {
  return (
    <div className="w-full overflow-hidden sanskrit-border bg-card shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {columns.map((col, index) => (
                <th 
                  key={index} 
                  className="px-6 py-5 text-xs font-display uppercase tracking-widest text-primary/80"
                >
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete || onView) && (
                <th className="px-6 py-5 text-xs font-display uppercase tracking-widest text-primary/80 text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground font-serif">Loading wisdom...</p>
                  </div>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((item, rowIndex) => (
                <tr 
                  key={item.id || rowIndex} 
                  className="hover:bg-primary/5 transition-all duration-200 group"
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 text-sm text-foreground font-serif">
                      {col.render 
                        ? col.render((item)[col.accessor], item, rowIndex) 
                        : (item)[col.accessor]}
                    </td>
                  ))}
                  {(onEdit || onDelete || onView) && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        {onView && (
                          <button 
                            onClick={() => onView(item)}
                            title="View Details"
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                        )}
                        {/* {onEdit && (
                          <button 
                            onClick={() => onEdit(item)}
                            title="Edit Record"
                            className="p-2 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-lg transition-all"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                        )} */}
                        {/* {onDelete && (
                          <button 
                            onClick={() => onDelete(item)}
                            title="Delete Record"
                            className="p-2 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        )} */}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length + 1} 
                  className="px-6 py-16 text-center text-muted-foreground italic font-serif"
                >
                  <div className="flex flex-col items-center opacity-40">
                    <p className="text-lg">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
