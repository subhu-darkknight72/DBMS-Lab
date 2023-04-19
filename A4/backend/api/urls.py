from django.urls import path
from .views import getinfo, list_patients, add_patient, delete_patient, add_prescription, admit_patient, get_slot, book_slot, getusers, delete_user, add_user, download_data
from .views import add_test, list_transactions, view_image, view_text, get_pdf, doctor_patient_list

urlpatterns = [
    path('getinfo/', getinfo),
    path('list_patient/', list_patients),
    path('add_patient/', add_patient),
    path('delete_patient/', delete_patient),
    path('add_prescription/', add_prescription),
    path('admit_patient/', admit_patient),
    path('get_slots/', get_slot),
    path('book_slot/', book_slot),
    path('getusers/', getusers),
    path('deleteuser/', delete_user),
    path('adduser/', add_user),
    path('downloadadmit/', download_data),
    path('list_transactions/', list_transactions),
    path('add_test/', add_test),
    path('view_image/', view_image),
    path('view_text/', view_text),
    path('get_pdf/', get_pdf),
    path('doctor_patient/', doctor_patient_list)
]
