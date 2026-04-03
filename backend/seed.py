import os
import django
import urllib.request
import json
from django.core.files.base import ContentFile
import datetime
import random

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from books.models import Book
from authors.models import Author
from categories.models import Category
from accounts.models import User

def run_seed():
    print("Starting database seed...")
    
    # 1. Ensure we have an uploader user
    user = User.objects.first()
    if not user:
        print("No users found. Creating 'admin' user...")
        user = User.objects.create_superuser('admin', 'admin@example.com', 'adminpass')
        
    print(f"Using user '{user.username}' as uploader.")

    # Popular search queries to get a varied and realistic dataset
    queries = ['Fantasy', 'Science Fiction', 'Programming', 'Machine Learning', 'History', 'Philosophy', 'Art']
    
    books_created = 0

    for query in queries:
        print(f"\nFetching books for category: {query}")
        try:
            url = f'https://openlibrary.org/search.json?q={query.replace(" ", "+")}&limit=6'
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=10) as response:
                data = json.loads(response.read().decode())
                
            for item in data.get('docs', []):
                title = item.get('title', 'Unknown Title')
                
                # Check if this book already exists to avoid unique constraint errors (ISBN)
                isbn = None
                if item.get('isbn'):
                    isbn = item['isbn'][0]
                    if Book.objects.filter(isbn=isbn).exists():
                        print(f"  - Skipping {title} (ISBN already exists)")
                        continue
                else:
                    base_isbn = f"ISBN-{random.randint(1000000, 9999999)}"
                    # ensure random ISBN doesn't exist
                    while Book.objects.filter(isbn=base_isbn).exists():
                        base_isbn = f"ISBN-{random.randint(1000000, 9999999)}"
                    isbn = base_isbn
                
                # Check exact title to avoid duplicates
                if Book.objects.filter(title=title).exists():
                    print(f"  - Skipping {title} (Title already exists)")
                    continue
                
                author_names = item.get('author_name', ['Unknown Author'])
                author_name = author_names[0]
                
                # Get or Create Author
                author, _ = Author.objects.get_or_create(name=author_name)
                
                # Category
                subjects = item.get('subject', [query.capitalize()])
                category_name = None
                for s in subjects:
                    if isinstance(s, str) and len(s) < 30:
                        category_name = s.title()
                        break
                
                if not category_name:
                    category_name = query.capitalize()
                
                category, _ = Category.objects.get_or_create(name=category_name)
                
                # Details
                publish_year = item.get('first_publish_year')
                if publish_year:
                    publish_date = datetime.date(publish_year, 1, 1)
                else:
                    publish_date = datetime.date.today()
                    
                language = 'English'
                if item.get('language'):
                    language = item['language'][0]
                
                cover_id = item.get('cover_i')
                cover_url = None
                if cover_id:
                    cover_url = f"https://covers.openlibrary.org/b/id/{cover_id}-L.jpg"
                
                # Fetch cover image
                cover_file = None
                if cover_url:
                    try:
                        req_img = urllib.request.Request(cover_url, headers={'User-Agent': 'Mozilla/5.0'})
                        with urllib.request.urlopen(req_img, timeout=5) as img_response:
                            if img_response.status == 200:
                                cover_file = ContentFile(img_response.read(), name=f"cover_{isbn}.jpg")
                    except:
                        pass
                
                # Create a blank PDF content file since it's required by the model
                dummy_pdf = ContentFile(b'%PDF-1.4\n1 0 obj\n<< /Title (Dummy PDF) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF', name=f"{title.replace(' ', '_')}.pdf")
                
                book = Book(
                    title=title,
                    author=author,
                    category=category,
                    description=f"This is a fetched description for the book {title} by {author.name}. This helps round out the dataset with realistic views and authors.",
                    isbn=isbn,
                    publish_date=publish_date,
                    language=language,
                    uploaded_by=user,
                    total_views=random.randint(10, 5000),
                    total_downloads=random.randint(0, 1000)
                )
                
                if cover_file:
                    book.cover_image.save(f"cover_{isbn}.jpg", cover_file, save=False)
                    
                book.file.save(f"{title.replace(' ', '_')}.pdf", dummy_pdf, save=False)
                
                book.save()
                books_created += 1
                print(f"  + Created: {title} by {author.name}")
                
        except Exception as e:
            print(f"! Error fetching/saving for {query}: {e}")

    print(f"\n✅ Successfully seeded {books_created} books into the database!")

if __name__ == '__main__':
    run_seed()
