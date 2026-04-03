from django.db import models
from accounts.models import User
from books.models import Book

class BookView(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='view_history')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='views_history')
    viewed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} viewed {self.book.title}"

class BookDownload(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='download_history')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='downloads_history')
    downloaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} downloaded {self.book.title}"
