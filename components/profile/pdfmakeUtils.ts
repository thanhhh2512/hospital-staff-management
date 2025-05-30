import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// Register fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs;

/**
 * Generate PDF using pdfmake library (alternative to jspdf)
 * @param contentRef Reference to HTML element containing data
 */
export const generatePDFWithPdfMake = async (
  contentRef: HTMLElement | null
): Promise<void> => {
  if (!contentRef) return;

  try {
    // Extract title
    const title =
      contentRef.querySelector("h1")?.textContent ?? "Hồ sơ cá nhân";

    // Extract personal information
    const personalInfo: any[] = [];
    const personalFields = contentRef.querySelectorAll(
      ".form-group, .grid.gap-4 > div"
    );

    personalFields.forEach((field) => {
      const label = field
        .querySelector("label, .font-medium")
        ?.textContent?.trim();
      const value = field
        .querySelector("input, select, .text-sm:not(.font-medium)")
        ?.textContent?.trim();

      if (label && value) {
        personalInfo.push([label, value]);
      }
    });

    // Extract certificate data
    const certData: any[] = [];
    const certCards = contentRef.querySelectorAll(
      ".print-container .border.p-4.rounded"
    );

    certCards.forEach((card) => {
      const name = card.querySelector("h3")?.textContent ?? "";
      const pTags = card.querySelectorAll("p");

      certData.push([
        name,
        pTags[0]?.textContent?.replace("Loại: ", "") ?? "",
        pTags[1]?.textContent?.replace("Ngày cấp: ", "") ?? "",
        pTags[2]?.textContent?.replace("Đơn vị cấp: ", "") ?? "",
        pTags[3]?.textContent?.replace("Mô tả: ", "") ?? "",
      ]);
    });

    // Extract training data
    const trainingTable = contentRef.querySelector(".print-container table");
    let trainingHeaders: string[] = [];
    const trainingData: any[] = [];

    if (trainingTable) {
      trainingTable.querySelectorAll("thead th").forEach((th) => {
        trainingHeaders.push(th.textContent || "");
      });

      trainingTable.querySelectorAll("tbody tr").forEach((tr) => {
        const rowData: string[] = [];
        tr.querySelectorAll("td").forEach((td) => {
          rowData.push(td.textContent || "");
        });
        trainingData.push(rowData);
      });
    }

    // Define document definition
    const docDefinition = {
      content: [
        // Title
        { text: title, style: "title" },

        // Personal Information section
        {
          text: "Thông tin cá nhân",
          style: "sectionHeader",
          margin: [0, 10, 0, 8],
        },
        personalInfo.length > 0
          ? {
              table: {
                widths: ["40%", "60%"],
                body: personalInfo,
              },
              layout: {
                fillColor: function (
                  rowIndex: number,
                  node: any,
                  columnIndex: number
                ) {
                  return columnIndex === 0 ? "#f8f8f8" : null;
                },
                hLineWidth: function () {
                  return 0.5;
                },
                vLineWidth: function () {
                  return 0.5;
                },
              },
            }
          : { text: "Không có thông tin cá nhân", style: "normal" },

        // Certificates section
        {
          text: "Bằng cấp & Chứng chỉ",
          style: "sectionHeader",
          margin: [0, 15, 0, 8],
        },
        certData.length > 0
          ? {
              table: {
                headerRows: 1,
                widths: ["*", "auto", "auto", "auto", "*"],
                body: [
                  // Header row
                  ["Tên", "Loại", "Ngày cấp", "Đơn vị cấp", "Mô tả"].map(
                    (text) => ({
                      text,
                      style: "tableHeader",
                    })
                  ),
                  // Data rows
                  ...certData,
                ],
              },
              layout: {
                fillColor: function (rowIndex: number) {
                  return rowIndex === 0 ? "#f2f2f2" : null;
                },
              },
            }
          : {
              text: "Không có bằng cấp/chứng chỉ nào được tìm thấy",
              style: "normal",
            },

        // Training section
        {
          text: "Quá trình đào tạo",
          style: "sectionHeader",
          margin: [0, 20, 0, 8],
        },
        trainingData.length > 0
          ? {
              table: {
                headerRows: 1,
                widths: Array(trainingHeaders.length).fill("*"),
                body: [
                  // Header row
                  trainingHeaders.map((text) => ({
                    text,
                    style: "tableHeader",
                  })),
                  // Data rows
                  ...trainingData,
                ],
              },
              layout: {
                fillColor: function (rowIndex: number) {
                  return rowIndex === 0 ? "#f2f2f2" : null;
                },
              },
            }
          : { text: "Không có dữ liệu quá trình đào tạo", style: "normal" },
      ],
      styles: {
        title: {
          fontSize: 18,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 20],
        },
        sectionHeader: {
          fontSize: 14,
          bold: true,
        },
        tableHeader: {
          bold: true,
          fillColor: "#f2f2f2",
        },
        normal: {
          fontSize: 10,
        },
      },
      defaultStyle: {
        fontSize: 10,
      },
    };

    // Generate PDF
    pdfMake.createPdf(docDefinition).download("ho-so-ca-nhan.pdf");
  } catch (err) {
    console.error("Lỗi xuất PDF:", err);
  }
};
