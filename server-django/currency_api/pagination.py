from rest_framework.pagination import PageNumberPagination,LimitOffsetPagination
from rest_framework.response import Response

class CustomPagination(PageNumberPagination):
    page_size_query_param = 'page_size'
    page_query_param = "page_num"
    max_page_size = 1

    def get_paginated_response(self, data):
        return Response({
            'current': self.page.number,
            'next': self.get_next_link(),
            'prev': self.get_previous_link(),
            'count': self.page.paginator.count,
            'number_of_pages': self.page.paginator.num_pages,
            'page_size': self.page_size,
            'results': data,
        })


