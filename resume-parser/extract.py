import PyPDF2
import os
import sys

def extract_pdf(file_path):
    text = []
    try:
        with open(file_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text.append(page_text)
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
    return "\n".join(text)

if __name__ == "__main__":
    dir_path = "../.resumes"
    files = ["Naveen_Peram_Resume_Final.pdf", "Naveen_Peram_resume.docx.pdf"]
    
    with open("combined_text.txt", "w", encoding="utf-8") as out:
        for fname in files:
            path = os.path.join(dir_path, fname)
            out.write(f"--- {fname} ---\n")
            out.write(extract_pdf(path))
            out.write("\n\n")
    print("Done")
