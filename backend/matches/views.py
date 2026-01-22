from rest_framework import viewsets, permissions
from .models import Match
from .serializers import MatchSerializer, MatchDataUpdateSerializer

class MatchViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Match.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return MatchDataUpdateSerializer
        return MatchSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count, F, Avg

class StatsViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def summary(self, request):
        matches = Match.objects.filter(user=request.user)
        total_matches = matches.count()
        wins = matches.filter(score_user__gt=F('score_opponent')).count()
        draws = matches.filter(score_user=F('score_opponent')).count()
        losses = matches.filter(score_user__lt=F('score_opponent')).count()
        
        goals_scored = matches.aggregate(Sum('score_user'))['score_user__sum'] or 0
        goals_conceded = matches.aggregate(Sum('score_opponent'))['score_opponent__sum'] or 0
        
        return Response({
            "total_matches": total_matches,
            "wins": wins,
            "draws": draws,
            "losses": losses,
            "goals_scored": goals_scored,
            "goals_conceded": goals_conceded,
            "win_rate": (wins / total_matches * 100) if total_matches > 0 else 0
        })
