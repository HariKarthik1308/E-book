import os
import django
import base64
from django.core.files.base import ContentFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from books.models import Book

# A completely valid minimal PDF string (1 page, says "Ebook Placeholder")
valid_pdf_base64 = b"JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSPj4Kc3RyZWFtCkJUCi9GMSAyNCBUZgoxIDAgMCAxIDUwIDc3MCBUbQooTGlicmFyeSBFYm9vayBQbGFjZWhvbGRlcikgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKMyAwIG9iago0MwplbmRvYmoKCjEgMCBvYmoKPDwvVHlwZS9DYXRhbG9nL1BhZ2VzIDQgMCBSPj4KZW5kb2JqCgo0IDAgb2JqCjw8L1R5cGUvUGFnZXMvTWVkaWFCb3hbMCAwIDU5NSA4NDJdL0NvdW50IDEvS2lkc1s1IDAgUl0+PgplbmRvYmoKCjUgMCBvYmoKPDwvVHlwZS9QYWdlL1BhcmVudCA0IDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjE8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+Pj4+Pj4vQ29udGVudHMgMiAwIFI+PgplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMTkzIDAwMDAwIG4gCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDE0NCAwMDAwMCBuIAowMDAwMDAwMjQwIDAwMDAwIG4gCjAwMDAwMDAzMjggMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDYvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgo0NTUKJSVFT0YK"

def fix_pdfs():
    books = Book.objects.all()
    pdf_bytes = base64.b64decode(valid_pdf_base64)
    print(f"Fixing {books.count()} books...")
    for book in books:
        if book.file:
            # We recreate a valid pdf file over the old one
            old_name = book.file.name
            if old_name.startswith('book_files/'):
                old_name = old_name.replace('book_files/', '')
                
            book.file.save(old_name, ContentFile(pdf_bytes), save=True)
            print(f"Fixed PDF for: {book.title}")

if __name__ == '__main__':
    fix_pdfs()
