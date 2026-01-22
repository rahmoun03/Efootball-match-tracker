from celery import shared_task
from .services import MockOCRService

@shared_task
def process_screenshot_task(match_id, image_path):
    # This acts as a placeholder for the actual Celery task integration
    # Ideally, we'd import Match here, but circular imports might be an issue if not handled carefully
    # For now, we just print
    service = MockOCRService()
    data = service.extract_text(image_path)
    print(f"Processed match {match_id}: {data}")
    return data
