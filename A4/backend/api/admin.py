from django.contrib import admin
from .models import Patient, Room, Doctor_Appointment, Admit, Transaction, Test

admin.site.register(Room)
admin.site.register(Doctor_Appointment)
admin.site.register(Admit)
admin.site.register(Transaction)
admin.site.register(Test)
admin.site.register(Patient)