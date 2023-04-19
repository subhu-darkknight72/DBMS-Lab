from job.models import UserProfile
from django.http import HttpResponse
import csv

DATABASE_ADMIN = 'database_admin'
DOCTOR = 'doctor'
DATA_ENTRY_OPERATOR = 'data_entry_operator'
FRONT_DESK_OPERATOR = 'front_desk_operator'


def check_designation(user, designation: str) -> bool:
    '''
        checks if user's designation mathces with query designation
    '''
    job = UserProfile.objects.filter(user=user)
    if (len(job) == 0):
        return False
    return job.first().designation == designation


def download_csv(modeladmin, request, queryset):
    opts = queryset.model._meta
    model = queryset.model
    response = HttpResponse(content_type='text/csv')
    # force download.
    response['Content-Disposition'] = 'attachment;filename=export.csv'
    # the csv writer
    writer = csv.writer(response)
    field_names = [field.name for field in opts.fields]
    # Write a first row with header information
    writer.writerow(field_names)
    # Write data rows
    for obj in queryset:
        writer.writerow([getattr(obj, field) for field in field_names])
    return response


def designation_in_list(designation: str) -> bool:
    '''
        given designation in [doctor,front_desk_operator...,]
    '''
    return designation == DATA_ENTRY_OPERATOR or designation == DATABASE_ADMIN or designation == DOCTOR or designation == FRONT_DESK_OPERATOR
