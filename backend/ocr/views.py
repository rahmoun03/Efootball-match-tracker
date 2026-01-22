from rest_framework import views, parsers, response, status
from .services import MockOCRService

class ExtractDataView(views.APIView):
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)

    def post(self, request):
        if 'screenshot' not in request.data:
            return response.Response({'error': 'No screenshot provided'}, status=status.HTTP_400_BAD_REQUEST)

        # In a real scenario, we would save the temporary file or pass the stream
        # For the mock, we just acknowledge receipt
        
        service = MockOCRService()
        data = service.extract_text(None) # We don't actually process the image in mock
        
        return response.Response(data, status=status.HTTP_200_OK)
