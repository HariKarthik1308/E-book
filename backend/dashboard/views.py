from rest_framework.views import APIView
from rest_framework.response import Response
from accounts.permissions import IsAdminUser
from accounts.models import User
from books.models import Book
from categories.models import Category
from authors.models import Author

class DashboardSummaryView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        data = {
            'total_users': User.objects.filter(role='User').count(),
            'total_admins': User.objects.filter(role='Admin').count(),
            'total_books': Book.objects.count(),
            'total_categories': Category.objects.count(),
            'total_authors': Author.objects.count(),
            'total_views': sum(book.total_views for book in Book.objects.all()),
            'total_downloads': sum(book.total_downloads for book in Book.objects.all()),
            # You can extract specific objects and pass to serializers if you need more fields,
            # this basic summary responds to standard requirement.
        }
        return Response(data)
