import abc

class OCRService(abc.ABC):
    @abc.abstractmethod
    def extract_text(self, image_path):
        pass

class MockOCRService(OCRService):
    def extract_text(self, image_path):
        # Mock extracted data matching the frontend expectation
        return {
            "opponent": "Mock Opponent FC",
            "score_user": 3,
            "score_opponent": 2,
            "score": "3 - 2", # For frontend convenience if needed
            "stats": {
                "possession": {"user": 55, "opponent": 45},
                "shots_on_target": {"user": 8, "opponent": 4},
                "completed_passes": {"user": 120, "opponent": 95}
            }
        }
