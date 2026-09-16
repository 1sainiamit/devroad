"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

interface SaleDetails {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  product: string;
  quantity: string;
  unitPrice: string;
  date: string;
  amount: string;
  numericAmount: number;
  status: string;
  paymentId?: string | null;
  creatorName: string;
  creatorEmail: string;
}

function numberToWords(num: number): string {
    if (num === 0) return 'ZERO ONLY';
    const a = ['', 'ONE ', 'TWO ', 'THREE ', 'FOUR ', 'FIVE ', 'SIX ', 'SEVEN ', 'EIGHT ', 'NINE ', 'TEN ', 'ELEVEN ', 'TWELVE ', 'THIRTEEN ', 'FOURTEEN ', 'FIFTEEN ', 'SIXTEEN ', 'SEVENTEEN ', 'EIGHTEEN ', 'NINETEEN '];
    const b = ['', '', 'TWENTY ', 'THIRTY ', 'FORTY ', 'FIFTY ', 'SIXTY ', 'SEVENTY ', 'EIGHTY ', 'NINETY '];
    const numStr = Math.floor(num).toString();
    if (numStr.length > 9) return 'OVERFLOW';
    const n = ('000000000' + numStr).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';
    let str = '';
    str += (n[1] != '00') ? (a[Number(n[1])] || b[Number(n[1][0])] + a[Number(n[1][1])]) + 'CRORE ' : '';
    str += (n[2] != '00') ? (a[Number(n[2])] || b[Number(n[2][0])] + a[Number(n[2][1])]) + 'LAKH ' : '';
    str += (n[3] != '00') ? (a[Number(n[3])] || b[Number(n[3][0])] + a[Number(n[3][1])]) + 'THOUSAND ' : '';
    str += (n[4] != '0') ? (a[Number(n[4])] || b[Number(n[4][0])] + a[Number(n[4][1])]) + 'HUNDRED ' : '';
    str += (n[5] != '00') ? ((str != '') ? 'AND ' : '') + (a[Number(n[5])] || b[Number(n[5][0])] + a[Number(n[5][1])]) + 'ONLY' : 'ONLY';
    return str.trim();
}

export function ReceiptButton({ sale }: { sale: SaleDetails }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      const { jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Pure White Background
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // Neo-brutalist thick outer border
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(1.5);
      doc.rect(15, 15, pageWidth - 30, pageHeight - 30, 'S');

      // Header: DevRoad Branding
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.setTextColor(0, 0, 0);
      doc.text("DevRoad", 25, 35);
      
      // Receipt Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("PAYMENT RECEIPT", pageWidth - 25, 30, { align: "right" });
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`#${sale.orderId.slice(-8).toUpperCase()}`, pageWidth - 25, 37, { align: "right" });

      // Solid Thick Separator
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(1.5);
      doc.line(15, 45, pageWidth - 15, 45);

      // RECEIVED FROM / RECIPIENT DETAILS
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("RECEIVED FROM", 25, 60);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(sale.customerName, 25, 68);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(sale.customerEmail, 25, 74);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("RECIPIENT DETAILS", pageWidth - 25, 60, { align: "right" });
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("DevRoad", pageWidth - 25, 68, { align: "right" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`Received By: ${sale.creatorName}`, pageWidth - 25, 74, { align: "right" });
      doc.text(sale.creatorEmail, pageWidth - 25, 80, { align: "right" });

      // Payment & Transaction Details
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("DATE", 25, 95);
      doc.setFont("helvetica", "normal");
      doc.text(sale.date, 25, 102);

      doc.setFont("helvetica", "bold");
      doc.text("PAYMENT MODE", 75, 95);
      doc.setFont("helvetica", "normal");
      doc.text("Online / Razorpay", 75, 102);

      if (sale.paymentId) {
        doc.setFont("helvetica", "bold");
        doc.text("TRANSACTION NO.", pageWidth - 25, 95, { align: "right" });
        doc.setFont("helvetica", "normal");
        doc.text(sale.paymentId, pageWidth - 25, 102, { align: "right" });
      }

      // Table for items (Neo-brutalist style)
      autoTable(doc, {
        startY: 115,
        margin: { left: 25, right: 25 },
        head: [['PAYMENT FOR', 'UNIT PRICE', 'QTY', 'AMOUNT']],
        body: [
          [sale.product, sale.unitPrice, sale.quantity, sale.amount],
        ],
        theme: 'plain',
        headStyles: {
          fontStyle: 'bold',
          textColor: [0, 0, 0],
          fontSize: 10,
          cellPadding: { top: 8, bottom: 8, left: 5, right: 5 },
          lineColor: [0, 0, 0],
          lineWidth: { bottom: 1.5, top: 1.5 },
        },
        bodyStyles: {
          textColor: [0, 0, 0],
          fontSize: 12,
          fontStyle: 'bold',
          cellPadding: { top: 15, bottom: 15, left: 5, right: 5 },
          lineColor: [0, 0, 0],
          lineWidth: { bottom: 1.5 },
        },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { cellWidth: 35, halign: 'right' },
          2: { cellWidth: 20, halign: 'center' },
          3: { cellWidth: 40, halign: 'right' },
        }
      });

      // @ts-ignore
      const finalY = doc.lastAutoTable.finalY || 150;
      
      // Amount in Words
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("AMOUNT IN WORDS", 25, finalY + 15);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`${numberToWords(sale.numericAmount)}`, 25, finalY + 22);

      // Neo-brutalist Total Box (with offset shadow)
      const boxX = pageWidth - 90;
      const boxY = finalY + 15;
      const boxW = 65;
      const boxH = 30;

      // Shadow
      doc.setFillColor(0, 0, 0);
      doc.rect(boxX + 3, boxY + 3, boxW, boxH, 'F');
      
      // Box
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(1.5);
      doc.rect(boxX, boxY, boxW, boxH, 'FD');
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text("TOTAL AMOUNT", boxX + (boxW/2), boxY + 10, { align: "center" });
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(sale.amount, boxX + (boxW/2), boxY + 22, { align: "center" });

      // Status Badge (Neo-brutalist pill)
      if (sale.status === 'PAID') {
        // Shadow
        doc.setFillColor(0, 0, 0);
        doc.rect(25 + 3, finalY + 35 + 3, 30, 10, 'F');
        // Pill
        doc.setFillColor(74, 222, 128); // Green
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(1.5);
        doc.rect(25, finalY + 35, 30, 10, 'FD');
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text("PAID", 40, finalY + 42, { align: "center" });
      } else if (sale.status === 'REFUNDED') {
        // Shadow
        doc.setFillColor(0, 0, 0);
        doc.rect(25 + 3, finalY + 35 + 3, 35, 10, 'F');
        // Pill
        doc.setFillColor(253, 224, 71); // Yellow
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(1.5);
        doc.rect(25, finalY + 35, 35, 10, 'FD');
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text("REFUNDED", 42.5, finalY + 42, { align: "center" });
      }

      // Footer
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("THANK YOU FOR YOUR PAYMENT.", pageWidth / 2, pageHeight - 25, { align: "center" });

      // Save the PDF
      doc.save(`Receipt_${sale.orderId.slice(-8)}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={generatePDF}
      disabled={isGenerating}
      className="border-2 border-black font-bold h-8 px-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-xs bg-white"
    >
      {isGenerating ? (
        <Loader2 className="w-3 h-3 mr-2 animate-spin" />
      ) : (
        <Download className="w-3 h-3 mr-2" />
      )}
      Receipt
    </Button>
  );
}
