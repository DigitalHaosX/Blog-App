// src/utils/pdfExport.ts
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Captures the element with id="dashboard-export" and saves it as a
 * multi-page A4 PDF.  The background colour is read from the current
 * theme so both light and dark dashboards render correctly.
 */
export async function exportDashboardToPdf(): Promise<void> {
  const element = document.getElementById("dashboard-export");
  if (!element) throw new Error("dashboard-export element not found");

  // Resolve the current background colour from the computed CSS variable
  const isDark = document.documentElement.classList.contains("dark");
  const backgroundColor = isDark ? "#000000" : "#ffffff";

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor,
    // Inline CSS custom properties so Recharts SVGs render correctly
    onclone: (clonedDoc) => {
      const style = clonedDoc.createElement("style");
      style.textContent = `
        * { font-family: "Plus Jakarta Sans", system-ui, sans-serif !important; }
        .recharts-wrapper svg text { font-size: 11px; }
      `;
      clonedDoc.head.appendChild(style);
    },
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const imgW = pageW;
  const imgH = (canvas.height * imgW) / canvas.width;

  if (imgH <= pageH) {
    // Single page
    pdf.addImage(imgData, "PNG", 0, 0, imgW, imgH);
  } else {
    // Slice into multiple A4 pages
    let yOffset = 0;
    let remaining = imgH;

    while (remaining > 0) {
      pdf.addImage(imgData, "PNG", 0, -yOffset, imgW, imgH);
      yOffset += pageH;
      remaining -= pageH;
      if (remaining > 0) pdf.addPage();
    }
  }

  const date = new Date().toISOString().slice(0, 10);
  pdf.save(`blog-analytics-${date}.pdf`);
}
