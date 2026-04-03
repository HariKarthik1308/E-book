from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    author_name = serializers.ReadOnlyField(source='author.name')

    class Meta:
        model = Book
        fields = '__all__'
        read_only_fields = ('uploaded_by', 'total_views', 'total_downloads')
