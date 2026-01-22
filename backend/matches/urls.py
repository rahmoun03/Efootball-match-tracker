from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MatchViewSet, StatsViewSet

router = DefaultRouter()
router.register(r'stats', StatsViewSet, basename='stats')
router.register(r'', MatchViewSet, basename='match')

urlpatterns = [
    path('', include(router.urls)),
]
