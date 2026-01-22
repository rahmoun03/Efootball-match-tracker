from rest_framework import serializers
from .models import Match

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = '__all__'
        read_only_fields = ('user',)

    def create(self, validated_data):
        # user is already in validated_data because it's passed in safe() in perform_create
        match = Match.objects.create(**validated_data)
        # TODO: Trigger OCR task here if needed
        return match

class MatchDataUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ('score_user', 'score_opponent', 'stats')
