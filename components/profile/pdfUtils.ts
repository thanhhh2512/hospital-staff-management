import jsPDF from "jspdf";
// Import jspdf-autotable default export
import autoTable from "jspdf-autotable";
import vietnameseFont from "../../public/fonts/times-vietnamese";

// Import type JobDescription từ components/job-description
import { JobDescription } from "@/components/job-description/types";

// Type for jsPDF with autoTable
type jsPDFWithAutoTable = jsPDF & {
  autoTable: (options: any) => any;
  lastAutoTable?: {
    finalY?: number;
  };
  addFileToVFS: (filename: string, data: string) => void;
  addFont: (
    fontName: string,
    fontStyle: string,
    fontWeight: string,
    postScriptName?: string
  ) => jsPDF;
  setFont: (fontName: string, fontStyle?: string) => jsPDF;
};

// Utility function to remove Vietnamese tones (kept as fallback)
const removeVietnameseTones = (str: string): string => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
    .replace(/[èéẹẻẽêềếệểễ]/g, "e")
    .replace(/[ìíịỉĩ]/g, "i")
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
    .replace(/[ùúụủũưừứựửữ]/g, "u")
    .replace(/[ỳýỵỷỹ]/g, "y");
};

/**
 * Initialize Vietnamese font in PDF document
 */
const initVietnameseFont = (pdf: jsPDFWithAutoTable): void => {
  pdf.addFileToVFS(
    "Times-Vietnamese-normal.ttf",
    vietnameseFont["times-vietnamese"]
  );
  pdf.addFont("Times-Vietnamese-normal.ttf", "Times-Vietnamese", "normal");
  pdf.setFont("Times-Vietnamese");
};

/**
 * Generate PDF from HTML content element
 */
export const generatePDF = async (
  contentRef: HTMLElement | null
): Promise<void> => {
  if (!contentRef) return;

  try {
    if (typeof window !== "undefined") {
      await import("jspdf-autotable"); // dynamic import to ensure plugin is loaded
    }

    const pdf = new jsPDF() as jsPDFWithAutoTable;
    initVietnameseFont(pdf);

    const title =
      contentRef.querySelector("h1")?.textContent ?? "Bằng cấp & Chứng chỉ";

    const fontSize = { title: 18, heading: 14, normal: 10 };
    const margin = { top: 20, left: 15, right: 15 };
    const pageWidth = pdf.internal.pageSize.getWidth();

    pdf.setFontSize(fontSize.title);
    pdf.text(title, pageWidth / 2, margin.top, { align: "center" });

    pdf.setFontSize(fontSize.heading);
    pdf.text("Bằng cấp & Chứng chỉ", margin.left, margin.top + 15);

    const certHeaders = ["Tên", "Loại", "Ngày cấp", "Đơn vị cấp", "Mô tả"];
    const certData: string[][] = [];

    const certCards = contentRef.querySelectorAll(
      ".print-container .border.p-4.rounded"
    );
    certCards.forEach((card) => {
      const row: string[] = [];
      const name = card.querySelector("h3")?.textContent ?? "";
      row.push(name);

      const pTags = card.querySelectorAll("p");
      row.push(pTags[0]?.textContent?.replace("Loại: ", "") ?? "");
      row.push(pTags[1]?.textContent?.replace("Ngày cấp: ", "") ?? "");
      row.push(pTags[2]?.textContent?.replace("Đơn vị cấp: ", "") ?? "");
      row.push(pTags[3]?.textContent?.replace("Mô tả: ", "") ?? "");

      certData.push(row);
    });

    if (certData.length === 0) {
      const cards = contentRef.querySelectorAll(".grid .card");
      cards.forEach((card) => {
        const name = card.querySelector(".card-title")?.textContent ?? "";
        const type = card.querySelector(".card-description")?.textContent ?? "";

        const values = card.querySelectorAll(".text-sm:not(.font-medium)");
        const row = [
          name,
          type,
          values[0]?.textContent ?? "",
          values[1]?.textContent ?? "",
          card.querySelector("p.text-sm.text-muted-foreground")?.textContent ??
            "",
        ];
        certData.push(row);
      });
    }

    if (certData.length > 0) {
      autoTable(pdf, {
        head: [certHeaders],
        body: certData,
        startY: margin.top + 20,
        margin: { left: margin.left, right: margin.right },
        styles: {
          overflow: "linebreak",
          cellPadding: 3,
          font: "Times-Vietnamese",
        },
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: [0, 0, 0],
          font: "Times-Vietnamese",
          fontStyle: "normal",
        },
        bodyStyles: { textColor: [0, 0, 0] },
      });
    } else {
      pdf.setFontSize(fontSize.normal);
      pdf.text(
        "Không có bằng cấp/chứng chỉ nào được tìm thấy",
        margin.left,
        margin.top + 25
      );
    }

    const trainingY = (pdf.lastAutoTable?.finalY ?? margin.top + 40) + 15;
    pdf.setFontSize(fontSize.heading);
    pdf.text("Quá trình đào tạo", margin.left, trainingY);

    const trainingTable = contentRef.querySelector(".print-container table");
    if (trainingTable) {
      const trainingHeaders: string[] = [];
      trainingTable.querySelectorAll("thead th").forEach((th) => {
        trainingHeaders.push(th.textContent || "");
      });

      const trainingData: string[][] = [];
      trainingTable.querySelectorAll("tbody tr").forEach((tr) => {
        const rowData: string[] = [];
        tr.querySelectorAll("td").forEach((td) => {
          rowData.push(td.textContent || "");
        });
        trainingData.push(rowData);
      });

      if (trainingData.length > 0) {
        autoTable(pdf, {
          head: [trainingHeaders],
          body: trainingData,
          startY: trainingY + 5,
          margin: { left: margin.left, right: margin.right },
          styles: {
            overflow: "linebreak",
            cellPadding: 3,
            font: "Times-Vietnamese",
          },
          headStyles: {
            fillColor: [220, 220, 220],
            textColor: [0, 0, 0],
            font: "Times-Vietnamese",
            fontStyle: "normal",
          },
          bodyStyles: { textColor: [0, 0, 0] },
        });
      }
    } else {
      pdf.setFontSize(fontSize.normal);
      pdf.text(
        "Không có dữ liệu quá trình đào tạo",
        margin.left,
        trainingY + 10
      );
    }

    pdf.save("ho-so-ca-nhan.pdf");
  } catch (err) {
    console.error("Lỗi xuất PDF:", err);
  }
};

/**
 * Generate profile PDF with optional avatar
 */
export const generateProfilePDF = async (
  profileRef: HTMLElement | null,
  avatarSrc?: string | null
): Promise<void> => {
  if (!profileRef) return;

  try {
    if (typeof window !== "undefined") {
      await import("jspdf-autotable");
    }

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    }) as jsPDFWithAutoTable;

    initVietnameseFont(pdf);

    const fontSize = { title: 18, heading: 14, normal: 10 };
    const margin = { top: 20, left: 15, right: 15 };
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    let yPosition = margin.top + 15;
    const lineHeight = 7;

    const title =
      profileRef.querySelector("h2")?.textContent ?? "Lý lịch cá nhân";

    pdf.setFontSize(fontSize.title);
    pdf.text(title, pageWidth / 2, margin.top, { align: "center" });

    if (avatarSrc) {
      const imgWidth = 32;
      const imgHeight = 44;
      pdf.addImage(
        avatarSrc,
        "JPEG",
        pageWidth - margin.right - imgWidth,
        margin.top + 5,
        imgWidth,
        imgHeight
      );
    }

    pdf.setFontSize(fontSize.normal);
    const personalInfoItems = profileRef.querySelectorAll(".border-b p");

    personalInfoItems.forEach((item) => {
      const text = item.textContent?.trim() || "";
      if (text) {
        pdf.text(text, margin.left, yPosition);
        yPosition += lineHeight;
      }
    });

    if (yPosition > pageHeight - 100) {
      pdf.addPage();
      yPosition = margin.top;
    }

    const trainingTitle =
      profileRef.querySelector(".my-2 span")?.textContent ??
      "Đào tạo, bồi dưỡng";

    pdf.setFontSize(fontSize.normal);
    yPosition += 10;
    pdf.text(trainingTitle, margin.left, yPosition);
    yPosition += 10;

    const table = profileRef.querySelector("table");
    if (table) {
      const headers = Array.from(table.querySelectorAll("thead th")).map(
        (th) => th.textContent?.trim() || ""
      );
      const rows = Array.from(table.querySelectorAll("tbody tr")).map((tr) =>
        Array.from(tr.querySelectorAll("td")).map(
          (td) => td.textContent?.trim() || ""
        )
      );

      if (rows.length > 0) {
        autoTable(pdf, {
          head: [headers],
          body: rows,
          startY: yPosition,
          margin: { left: margin.left, right: margin.right },
          styles: {
            fontSize: fontSize.normal,
            cellPadding: 3,
            font: "Times-Vietnamese",
          },
          headStyles: {
            fillColor: [220, 220, 220],
            textColor: [0, 0, 0],
            font: "Times-Vietnamese",
            fontStyle: "normal",
          },
          bodyStyles: { textColor: [0, 0, 0] },
        });
      }
    }
    pdf.save("ly-lich-ca-nhan.pdf");

  } catch (error) {
    console.error("Lỗi khi tạo PDF:", error);
  }
};

/**
 * Generate PDF from job description
 */
export const generateJobDescriptionPDF = async (
  jobDescription: JobDescription
): Promise<void> => {
  try {
    if (typeof window !== "undefined") {
      await import("jspdf-autotable");
    }

    const pdf = new jsPDF() as jsPDFWithAutoTable;
    initVietnameseFont(pdf);

    const fontSize = { title: 18, heading: 14, normal: 10 };
    const margin = { top: 20, left: 15, right: 15 };
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Title
    pdf.setFontSize(fontSize.title);
    pdf.text(jobDescription.title, pageWidth / 2, margin.top, {
      align: "center",
    });

    // Department and date
    pdf.setFontSize(fontSize.normal);
    const departmentText = `Phòng/Ban: ${jobDescription.department}`;
    const dateText = `Ngày tải lên: ${new Date(
      jobDescription.uploadDate
    ).toLocaleDateString("vi-VN")}`;
    pdf.text(departmentText, margin.left, margin.top + 15);
    pdf.text(dateText, margin.left, margin.top + 22);

    let yPosition = margin.top + 30;
    const lineHeight = 7;

    // Parse content and add to PDF
    const lines = jobDescription.content.split("\n");
    for (const line of lines) {
      if (line.trim() === "") {
        yPosition += lineHeight / 2;
        continue;
      }

      // Check if the current position is near the bottom of the page
      if (yPosition > pdf.internal.pageSize.getHeight() - 20) {
        pdf.addPage();
        yPosition = margin.top;
      }

      if (line.startsWith("# ")) {
        pdf.setFontSize(fontSize.title);
        pdf.text(line.substring(2), margin.left, yPosition);
        yPosition += lineHeight * 2;
      } else if (line.startsWith("## ")) {
        pdf.setFontSize(fontSize.heading);
        pdf.text(line.substring(3), margin.left, yPosition);
        yPosition += lineHeight * 1.5;
      } else if (line.startsWith("### ")) {
        pdf.setFontSize(fontSize.heading);
        pdf.text(line.substring(4), margin.left, yPosition);
        yPosition += lineHeight * 1.5;
      } else if (line.startsWith("- ")) {
        pdf.setFontSize(fontSize.normal);
        pdf.text(`• ${line.substring(2)}`, margin.left + 5, yPosition);
        yPosition += lineHeight;
      } else if (line.match(/^\d+\. /)) {
        pdf.setFontSize(fontSize.normal);
        pdf.text(line, margin.left + 5, yPosition);
        yPosition += lineHeight;
      } else if (line.startsWith("   - ")) {
        pdf.setFontSize(fontSize.normal);
        pdf.text(`  ○ ${line.substring(5)}`, margin.left + 10, yPosition);
        yPosition += lineHeight;
      } else {
        pdf.setFontSize(fontSize.normal);
        pdf.text(line, margin.left, yPosition);
        yPosition += lineHeight;
      }
    }

    pdf.save(`mo-ta-cong-viec-${jobDescription.id}.pdf`);
  } catch (error) {
    console.error("Lỗi khi tạo PDF:", error);
  }
};

// === Helper functions ===

function createSimpleTable(headers: string[]): HTMLTableElement {
  const table = document.createElement("table");
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  headers.forEach((text) => {
    const th = document.createElement("th");
    th.textContent = text;
    th.style.border = "1px solid #000";
    th.style.padding = "8px";
    th.style.backgroundColor = "#f2f2f2";
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);
  table.appendChild(document.createElement("tbody"));

  return table;
}

function appendRowToTable(table: HTMLTableElement, values: string[]) {
  const row = document.createElement("tr");
  values.forEach((val) => {
    const td = document.createElement("td");
    td.textContent = val;
    td.style.border = "1px solid #000";
    td.style.padding = "8px";
    row.appendChild(td);
  });

  const tbody = table.querySelector("tbody");
  if (tbody) tbody.appendChild(row);
}

function resetTableStyles(table: HTMLTableElement) {
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";

  const cells = table.querySelectorAll("th, td");
  cells.forEach((cell) => {
    const htmlCell = cell as HTMLElement;
    htmlCell.style.border = "1px solid #000";
    htmlCell.style.padding = "8px";
    htmlCell.style.color = "#000";
    htmlCell.style.backgroundColor = cell.tagName === "TH" ? "#f2f2f2" : "#fff";
  });
}
