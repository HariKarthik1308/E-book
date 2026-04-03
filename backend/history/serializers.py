from rest_framework import serializers
from .models import BookView, BookDownload
from books.serializers import BookSerializer

class BookViewSerializer(serializers.ModelSerializer):
    book_details = BookSerializer(source='book', read_only=True)

    class Meta:
        model = BookView
        fields = '__all__'

class BookDownloadSerializer(serializers.ModelSerializer):
    book_details = BookSerializer(source='book', read_only=True)

    class Meta:
        model = BookDownload
        fields = '__all__'
