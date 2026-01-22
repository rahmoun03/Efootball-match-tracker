from django.db import models
from django.conf import settings

class Match(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='matches')
    opponent_name = models.CharField(max_length=255)
    score_user = models.IntegerField(null=True, blank=True)
    score_opponent = models.IntegerField(null=True, blank=True)
    stats = models.JSONField(default=dict, blank=True)
    screenshot = models.ImageField(upload_to="matches/")
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user} vs {self.opponent_name}"
