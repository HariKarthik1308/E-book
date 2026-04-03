from rest_framework.routers import DefaultRouter
from .views import AuthorViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'', AuthorViewSet, basename='author')

urlpatterns = [
    path('', include(router.urls)),
]
