// ATS-Compliant DOCX Generator using docx and file-saver
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

/**
 * Generates and downloads an ATS-compliant Word document (.docx)
 * Strictly preserves candidate truth without dummy values or hallucinated fields.
 * @param {object} resume 
 * @param {object} options 
 */
export async function exportResumeToDocx(resume, options = { showSummary: true }) {
  const children = [];

  // 1. Name (Centered)
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: (resume.fullName || "Candidate Name").toUpperCase(),
          bold: true,
          size: 28, // 14pt
          font: "Calibri",
          color: "111827"
        })
      ]
    })
  );

  // Headline / Target Role
  if (resume.headline || resume.targetRole) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: resume.headline || resume.targetRole,
            bold: true,
            size: 20, // 10pt
            font: "Calibri",
            color: "374151"
          })
        ]
      })
    );
  }

  // Contact Info (Only real fields)
  const contactParts = [
    resume.phone,
    resume.email,
    resume.location,
    resume.linkedin,
    resume.portfolio,
    resume.github
  ].filter(Boolean);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 140 },
        children: [
          new TextRun({
            text: contactParts.join("  |  "),
            size: 18, // 9pt
            font: "Calibri",
            color: "4B5563"
          })
        ]
      })
    );
  }

  // Helper for Section Heading
  const addSectionHeader = (title) => {
    children.push(
      new Paragraph({
        spacing: { before: 140, after: 60 },
        border: {
          bottom: {
            color: "9CA3AF",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 4
          }
        },
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 20, // 10pt
            font: "Calibri",
            color: "111827"
          })
        ]
      })
    );
  };

  // 2. Summary (Optional)
  if (options.showSummary && resume.summary && resume.summary.trim().length > 0) {
    addSectionHeader("Professional Summary");
    children.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: resume.summary,
            size: 19, // 9.5pt
            font: "Calibri",
            color: "374151"
          })
        ]
      })
    );
  }

  // 3. Technical Skills
  if (resume.skills && Object.keys(resume.skills).length > 0) {
    addSectionHeader("Technical Skills");
    for (const [category, items] of Object.entries(resume.skills)) {
      const skillsList = Array.isArray(items) ? items.join(", ") : String(items);
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: `${category}: `,
              bold: true,
              size: 19,
              font: "Calibri",
              color: "1F2937"
            }),
            new TextRun({
              text: skillsList,
              size: 19,
              font: "Calibri",
              color: "374151"
            })
          ]
        })
      );
    }
  }

  // 4. Experience & Projects
  if (resume.experience && resume.experience.length > 0) {
    addSectionHeader("Work Experience");
    resume.experience.forEach(job => {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 30 },
          children: [
            new TextRun({
              text: `${job.role} `,
              bold: true,
              size: 19,
              font: "Calibri",
              color: "111827"
            }),
            new TextRun({
              text: job.company ? `| ${job.company} ` : '',
              bold: true,
              size: 19,
              font: "Calibri",
              color: "374151"
            }),
            new TextRun({
              text: job.period ? `(${job.period})` : '',
              size: 18,
              font: "Calibri",
              color: "6B7280"
            })
          ]
        })
      );

      if (job.bullets && job.bullets.length > 0) {
        job.bullets.forEach(bullet => {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 30 },
              children: [
                new TextRun({
                  text: bullet,
                  size: 18,
                  font: "Calibri",
                  color: "374151"
                })
              ]
            })
          );
        });
      }
    });
  }

  // 5. Certifications & Achievements
  if (resume.certifications && resume.certifications.length > 0) {
    addSectionHeader("Certifications & Achievements");
    resume.certifications.forEach(cert => {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 30 },
          children: [
            new TextRun({
              text: cert,
              size: 18,
              font: "Calibri",
              color: "374151"
            })
          ]
        })
      );
    });
  }

  // 6. Education
  if (resume.education && resume.education.length > 0) {
    addSectionHeader("Education");
    resume.education.forEach(edu => {
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: `${edu.degree} `,
              bold: true,
              size: 19,
              font: "Calibri",
              color: "111827"
            }),
            new TextRun({
              text: edu.institution ? `\n${edu.institution} ` : '',
              size: 18,
              font: "Calibri",
              color: "4B5563"
            }),
            new TextRun({
              text: edu.year ? `(${edu.year})` : '',
              size: 18,
              font: "Calibri",
              color: "6B7280"
            })
          ]
        })
      );
    });
  }

  // Create document with standard 0.4 inch margins
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 576,    // 0.4 in
              right: 576,
              bottom: 576,
              left: 576
            }
          }
        },
        children: children
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const cleanName = (resume.fullName || "Candidate").toLowerCase().replace(/\s+/g, '_');
  saveAs(blob, `${cleanName}_ATS_Tailored_Resume.docx`);
}
