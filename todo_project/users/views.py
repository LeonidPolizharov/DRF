from rest_framework.viewsets import ModelViewSet
from rest_framework import mixins, viewsets, permissions
from .models import User
from .serializers import UserModelSerializer


class UserModelViewSet(mixins.ListModelMixin,
                  mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserModelSerializer