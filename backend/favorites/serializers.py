from rest_framework import serializers
from .models import Favorite
from books.serializers import BookSerializer

class FavoriteSerializer(serializers.ModelSerializer):
    book_details = BookSerializer(source='book', read_only=True)

    class Meta:
        model = Favorite
        fields = ('id', 'user', 'book', 'book_details', 'created_at')
        read_only_fields = ('user',)
