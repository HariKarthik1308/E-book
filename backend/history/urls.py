from django.urls import path
from .views import BookViewHistoryList, BookDownloadHistoryList

urlpatterns = [
    path('views/', BookViewHistoryList.as_view(), name='view-history'),
    path('downloads/', BookDownloadHistoryList.as_view(), name='download-history'),
]
