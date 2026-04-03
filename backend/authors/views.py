from rest_framework import viewsets
from .models import Author
from .serializers import AuthorSerializer
from accounts.permissions import IsAdminUserOrReadOnly

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all().order_by('-created_at')
    serializer_class = AuthorSerializer
    permission_classes = [IsAdminUserOrReadOnly]
