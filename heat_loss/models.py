from django.db import models
from django.contrib.postgres.fields import JSONField

# Create your models here.

class HeatLossScenarios(models.Model):

    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=80)
    scenarios = JSONField(default={})

class EngineeringVariables(models.Model):

    id = models.IntegerField(primary_key=True)
    variables = JSONField(default={})

class Radiators(models.Model):

    id = models.IntegerField(primary_key=True)
    type = models.CharField(max_length=50)
    reference = JSONField(default={})

class OccupancyHours(models.Model):

    id = models.IntegerField(primary_key=True)
    building = models.CharField(max_length=80)
    occupancy = JSONField(default={})

class Weather(models.Model):

    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=50)
    reference = JSONField(default={})

class SoilTemp(models.Model):

    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=50)
    reference = JSONField(default={})
