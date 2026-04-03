from django.db import models
from accounts.models import User
from categories.models import Category
from authors.models import Author

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='books')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='books')
    description = models.TextField()
    isbn = models.CharField(max_length=50, unique=True, blank=True, null=True)
    publish_date = models.DateField(blank=True, null=True)
    language = models.CharField(max_length=50, default='English')
    cover_image = models.ImageField(upload_to='book_covers/', blank=True, null=True)
    file = models.FileField(upload_to='book_files/') # PDF typically
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_books')
    total_views = models.IntegerField(default=0)
    total_downloads = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
