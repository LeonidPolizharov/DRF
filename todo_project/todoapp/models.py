from django.db import models
from users.models import User


class Project(models.Model):
    name = models.CharField(max_length=64, unique=True)
    users = models.ManyToManyField(User)
    repo_link = models.URLField(blank=True)

    def __str__(self):
        return self.name


class ToDo(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    text = models.TextField()
    create_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.PROTECT)
    is_active = models.BooleanField(default=True)