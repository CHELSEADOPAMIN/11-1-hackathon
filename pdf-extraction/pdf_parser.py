"""
PDF Parser - Extracts text from treatment plan PDFs
Handles both text-based PDFs and scanned images with OCR
"""

import io
import re
from typing import Optional, Dict, List
from pathlib import Path

try:
    import pdfplumber
    PDFPLUMBER_AVAILABLE = True
except ImportError:
    PDFPLUMBER_AVAILABLE = False

try:
    import PyPDF2
    PYPDF2_AVAILABLE = True
except ImportError:
    PYPDF2_AVAILABLE = False

try:
    import pytesseract
    from PIL import Image
    OCR_AVAILABLE = True
except ImportError:
    OCR_AVAILABLE = False


class PDFParser:
    """Extract text content from PDF treatment plans"""
    
    def __init__(self):
        self.supported_formats = []
        if PDFPLUMBER_AVAILABLE:
            self.supported_formats.append('pdfplumber')
        if PYPDF2_AVAILABLE:
            self.supported_formats.append('pypdf2')
        if OCR_AVAILABLE:
            self.supported_formats.append('ocr')
    
    def extract_text(self, pdf_path: str, use_ocr: bool = False) -> Dict[str, any]:
        """
        Extract text from PDF file
        
        Args:
            pdf_path: Path to PDF file
            use_ocr: Whether to use OCR for scanned images
            
        Returns:
            Dictionary with extracted text and metadata
        """
        pdf_path = Path(pdf_path)
        if not pdf_path.exists():
            raise FileNotFoundError(f"PDF file not found: {pdf_path}")
        
        # Try pdfplumber first (better for structured text)
        if PDFPLUMBER_AVAILABLE:
            try:
                return self._extract_with_pdfplumber(pdf_path)
            except Exception as e:
                print(f"pdfplumber extraction failed: {e}")
        
        # Fallback to PyPDF2
        if PYPDF2_AVAILABLE:
            try:
                return self._extract_with_pypdf2(pdf_path)
            except Exception as e:
                print(f"PyPDF2 extraction failed: {e}")
        
        # Try OCR if enabled and other methods failed
        if use_ocr and OCR_AVAILABLE:
            try:
                return self._extract_with_ocr(pdf_path)
            except Exception as e:
                print(f"OCR extraction failed: {e}")
        
        raise RuntimeError("Failed to extract text from PDF")
    
    def _extract_with_pdfplumber(self, pdf_path: Path) -> Dict[str, any]:
        """Extract text using pdfplumber (best for structured text)"""
        full_text = []
        pages_data = []
        
        with pdfplumber.open(pdf_path) as pdf:
            for page_num, page in enumerate(pdf.pages, 1):
                text = page.extract_text()
                if text:
                    full_text.append(text)
                    pages_data.append({
                        'page_number': page_num,
                        'text': text,
                        'bbox': page.bbox
                    })
        
        return {
            'full_text': '\n\n'.join(full_text),
            'pages': pages_data,
            'total_pages': len(pages_data),
            'extraction_method': 'pdfplumber',
            'metadata': {
                'title': pdf.metadata.get('Title', ''),
                'author': pdf.metadata.get('Author', ''),
                'subject': pdf.metadata.get('Subject', '')
            }
        }
    
    def _extract_with_pypdf2(self, pdf_path: Path) -> Dict[str, any]:
        """Extract text using PyPDF2 (fallback method)"""
        full_text = []
        pages_data = []
        
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            
            for page_num, page in enumerate(pdf_reader.pages, 1):
                text = page.extract_text()
                if text:
                    full_text.append(text)
                    pages_data.append({
                        'page_number': page_num,
                        'text': text
                    })
        
        return {
            'full_text': '\n\n'.join(full_text),
            'pages': pages_data,
            'total_pages': len(pages_data),
            'extraction_method': 'pypdf2',
            'metadata': pdf_reader.metadata if hasattr(pdf_reader, 'metadata') else {}
        }
    
    def _extract_with_ocr(self, pdf_path: Path) -> Dict[str, any]:
        """Extract text using OCR (for scanned PDFs)"""
        # This would require converting PDF pages to images first
        # Implementation depends on pdf2image or similar library
        raise NotImplementedError("OCR extraction not fully implemented")
    
    def clean_text(self, text: str) -> str:
        """Clean extracted text"""
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove page breaks
        text = re.sub(r'\f', '\n', text)
        # Normalize line breaks
        text = re.sub(r'\r\n', '\n', text)
        return text.strip()
    
    def identify_sections(self, text: str) -> List[Dict[str, str]]:
        """Identify document sections based on headings"""
        sections = []
        
        # Common section patterns
        section_patterns = [
            r'(?i)^(treatment\s+plan|home\s+rehabilitation\s+program|exercises|goals|instructions|appointment\s+schedule|do\'?s?\s+and\s+don\'?t?s?|patient\s+goals)',
            r'(?i)^(\d+\.\s+[A-Z][^\n]+)',
            r'(?i)^([A-Z][A-Z\s]+(?:\s*-\s*[A-Z][^\n]+)?)',
        ]
        
        lines = text.split('\n')
        current_section = None
        current_content = []
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Check if line matches a section heading
            is_heading = False
            for pattern in section_patterns:
                if re.match(pattern, line):
                    # Save previous section
                    if current_section:
                        sections.append({
                            'title': current_section,
                            'content': '\n'.join(current_content)
                        })
                    # Start new section
                    current_section = line
                    current_content = []
                    is_heading = True
                    break
            
            if not is_heading and current_section:
                current_content.append(line)
        
        # Add final section
        if current_section:
            sections.append({
                'title': current_section,
                'content': '\n'.join(current_content)
            })
        
        return sections


if __name__ == '__main__':
    # Example usage
    parser = PDFParser()
    
    # Test extraction
    # result = parser.extract_text('example_treatment_plan.pdf')
    # print(result['full_text'][:500])
    # sections = parser.identify_sections(result['full_text'])
    # for section in sections:
    #     print(f"\n=== {section['title']} ===")
    #     print(section['content'][:200])

