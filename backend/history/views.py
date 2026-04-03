from rest_framework import generics, permissions
from .models import BookView, BookDownload
from .serializers import BookViewSerializer, BookDownloadSerializer

class BookViewHistoryList(generics.ListAPIView):
    serializer_class = BookViewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BookView.objects.filter(user=self.request.user).order_by('-viewed_at')

class BookDownloadHistoryList(generics.ListAPIView):
    serializer_class = BookDownloadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BookDownload.objects.filter(user=self.request.user).order_by('-downloaded_at')
