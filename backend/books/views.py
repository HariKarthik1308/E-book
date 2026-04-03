from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Book
from .serializers import BookSerializer
from accounts.permissions import IsAdminUserOrReadOnly
from history.models import BookView, BookDownload

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all().order_by('-created_at')
    serializer_class = BookSerializer
    permission_classes = [IsAdminUserOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'author', 'language']
    search_fields = ['title', 'isbn', 'description']
    ordering_fields = ['created_at', 'total_views', 'total_downloads']

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)
        
    @action(detail=True, methods=['post'], permission_classes=[])
    def view(self, request, pk=None):
        book = self.get_object()
        book.total_views += 1
        book.save()
        if request.user.is_authenticated:
            BookView.objects.create(user=request.user, book=book)
        return Response({'status': 'view tracked'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[])
    def download(self, request, pk=None):
        book = self.get_object()
        book.total_downloads += 1
        book.save()
        if request.user.is_authenticated:
            BookDownload.objects.create(user=request.user, book=book)
        return Response({'status': 'download tracked'}, status=status.HTTP_200_OK)
