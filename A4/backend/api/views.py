from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.utils import timezone
from job.models import UserProfile
from .models import Patient, Room, Transaction, Doctor_Appointment, Admit, Test
from .serializers import PatientSerializer, UserSerializer, TransactionSerializer, DoctorAppSerializer
from django.http import HttpResponse, FileResponse
from datetime import datetime, timedelta
from django.utils import timezone
from .utils import check_designation, designation_in_list, DATA_ENTRY_OPERATOR, DATABASE_ADMIN, DOCTOR, FRONT_DESK_OPERATOR, download_csv
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


@api_view(['GET',])
def getinfo(request):
    response = {
        'user': '-1',
        'job': '-1'
    }
    if (request.user.is_authenticated):
        response['user'] = request.user.username
        user = User.objects.filter(username=response['user']).first()
        response['job'] = UserProfile.objects.filter(
            user=user).first().designation
    else:
        response['error'] = 'Not Logged In'

    return Response(response)


@api_view(['GET'])
def getusers(request):
    if (not request.user.is_authenticated or not check_designation(request.user, DATABASE_ADMIN)):
        return Response({
            'Error': 'Not Logged In Or Wrong Designation'
        })

    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response({'Success': serializer.data})


@api_view(['POST'])
def add_user(request):
    if (not request.user.is_authenticated or not check_designation(request.user, DATABASE_ADMIN)):
        return Response({
            'Error': 'Not Logged In Or Wrong Designation'
        })
    username = request.data.get('username', None)
    email = request.data.get('email', None)
    password = request.data.get('password', None)
    designation = request.data.get('designation', None)

    if (username is None or email is None or password is None or designation is None):
        return Response({"Error": "Form Error"})

    if (not designation_in_list(designation)):
        return Response({"Error": "Wrong Designation"})

    try:
        user = User.objects.create_user(
            username=username, password=password, email=email)
        job = UserProfile(user=user, designation=designation)
        job.save()
        return Response({"Success": "User Created"})
    except:
        return Response({"Error": "Something went wrong"})


@api_view(['POST'])
def delete_user(request):
    if (not request.user.is_authenticated or not check_designation(request.user, DATABASE_ADMIN)):
        return Response({
            'Error': 'Not Logged In Or Wrong Designation'
        })

    user_id = request.data.get('user_id', None)
    if (user_id is None):
        return Response({"Error": "Form Error"})

    user = User.objects.filter(id=user_id)
    user.delete()

    return Response({"Success": "Deleted user"})


@api_view(['GET'])
def list_patients(request):
    if (not request.user.is_authenticated):
        return Response({"Error": "Not Logged In"})

    admits = Admit.objects.filter(exit_time=None)
    patient_id = [i.patient.id for i in admits]

    patientList = Patient.objects.filter(id__in=patient_id)

    serializer = PatientSerializer(patientList, many=True)
    resonse = {}
    resonse['data'] = serializer.data
    rooms = Room.objects.all()
    for room in rooms:
        if room.patient == None:
            continue
        resonse[room.patient.id] = room.number
    return Response(resonse)


@api_view(['GET'])
def doctor_patient_list(request):
    if (not request.user.is_authenticated or not check_designation(request.user, DOCTOR)):
        return Response({"Error": "Wrong user"})

    doctor_apps = Doctor_Appointment.objects.filter(
        doctor=request.user).order_by('slot_time')
    serializer = DoctorAppSerializer(doctor_apps, many=True)
    return Response({"data": serializer.data})


@ api_view(['POST'])
def add_patient(request):

    if (not request.user.is_authenticated or not check_designation(request.user, FRONT_DESK_OPERATOR)):
        return Response({
            'Error': 'Not Logged In Or Wrong Designation'
        })

    name = request.data.get('name', None)
    age = request.data.get('age', None)
    address = request.data.get('address', None)
    phone = request.data.get('phone', None)
    symptoms = request.data.get('symptoms', None)
    if (name is None or age is None or address is None or phone is None or symptoms is None):
        return Response({"Error": "Form Error"})
    patient = None
    patients = Patient.objects.filter(
        name=name, age=age, address=address, phone=phone)
    if (len(patients) != 0):
        patient = patients.first()
        admit = Admit.objects.filter(patient=patient).first()
        if (admit.exit_time is None):
            return Response({"Error": "Already Admitted"})
    else:
        patient = Patient(
            name=name,
            age=age,
            address=address,
            phone=phone,
            symptoms=symptoms,
        )
        patient.save()

    admit = Admit(patient=patient, room=None, exit_time=None)
    admit.save()

    return Response({
        'Success': 'Data entered'
    })


@ api_view(['POST'])
def delete_patient(request):
    if (not request.user.is_authenticated or not check_designation(request.user, FRONT_DESK_OPERATOR)):
        return Response({
            'Error': 'Not Logged In Or Wrong Designation'
        })

    patient_id = request.data.get('id', None)
    if (patient_id is None):
        return Response({"Error": "Form Error"})

    patient = Patient.objects.filter(id=patient_id).first()

    if (patient is None):
        return Response({"Error": "Patient Not Found"})

    admit = Admit.objects.filter(
        patient=patient).filter(exit_time=None).first()

    if admit is None:
        return Response({"Error": "Already not admitted"})

    admit.exit_time = timezone.now()
    admit.save()

    room = Room.objects.filter(patient=patient).first()
    room.patient = None
    room.save()

    return Response({"Success": "Discharged"})


@ api_view(['POST'])
def add_prescription(request):
    response = {}
    if (not request.user.is_authenticated or not check_designation(request.user, DOCTOR)):
        response['Error'] = 'Not Authenticated'
    else:
        user = request.user
        patient_id = request.data.get('patient_id', None)
        if (patient_id is None):
            response['Error'] = 'Patient Id not Found'
        else:
            patient = Patient.objects.filter(id=patient_id).first()

            prescription = request.data.get('prescription', None)
            if (prescription is None):
                response['Error'] = 'Prescription not found'
            else:
                transaction = Transaction.objects.filter(
                    patient=patient).filter(doctor=user)
                if (len(transaction) == 0):
                    transaction = Transaction(
                        patient=patient, doctor=user, prescription=prescription)
                    transaction.save()
                else:
                    transaction = transaction.first()
                    transaction.prescription = prescription
                    transaction.save()
                response['Success'] = 'Prescriptions Added'
    return Response(response)


@ api_view(['POST'])
def admit_patient(request):
    if (not request.user.is_authenticated or not check_designation(request.user, FRONT_DESK_OPERATOR)):
        return Response({
            'Error': 'Not Logged In Or Wrong Designation'
        })

    patient_id = request.data.get('id', None)
    is_emergency = request.data.get('emergency', None)

    if (is_emergency == None):
        return Response({"Error": "Emergency value not found"})

    if (patient_id == None):
        return Response({
            'Error': 'patient_id not sent'
        })
    patient = Patient.objects.filter(id=patient_id).first()

    if (patient is None):
        return Response({"Error": "Patient Not FOund"})

    if (len(Room.objects.filter(patient=patient)) != 0):
        return Response({"Error": "Already Admitted"})

    available_room = Room.objects.filter(patient=None)

    if is_emergency == '0' or is_emergency == 0:
        print("here")
        available_room = available_room.filter(emergency=False)

    available_room = available_room.first()

    if available_room is None:
        return Response({
            'Error': 'Room not available'
        })
    room_number = available_room.number
    available_room.patient = patient
    available_room.save()

    admit = Admit.objects.filter(
        patient=patient).filter(exit_time=None).first()
    admit.room = available_room
    admit.save()

    return Response({
        'Success': 'Admitted',
        'Room': f'{room_number}'
    })


@ api_view(['POST'])
def get_slot(request):
    response = {}
    if (not request.user.is_authenticated):
        response['Error'] = "Not Logged In"
        return Response(response)

    pref_time_slot = request.data.get('date', None)

    if (pref_time_slot is None):
        response['Error'] = "Form Error"
        return Response(response)

    user = request.user
    job = UserProfile.objects.filter(user=user)
    if (len(job) == 0):
        response['Error'] = "Wrong User"
        return Response(response)
    if (job.first().designation != "front_desk_operator"):
        response['Error'] = "Not Front Desk Operator"
        return Response(response)

    my_date = datetime.strptime(pref_time_slot, "%a %b %d %Y").date()

    time_slots = []
    current_time = datetime(year=my_date.year, month=my_date.month,
                            day=my_date.day, hour=14, minute=0, second=0)
    end_time = datetime(year=my_date.year, month=my_date.month,
                        day=my_date.day, hour=17, minute=0, second=0)

    while current_time < end_time:
        time_slots.append(current_time.time())
        current_time += timedelta(hours=1)

    doctor_apps = Doctor_Appointment.objects.all()

    free_time_slots = []
    for time_slot in time_slots:
        flag = 0
        for doctor_app in doctor_apps:
            if doctor_app.slot_time.time() == time_slot and doctor_app.slot_time.date() == my_date:
                flag += 1
        if flag != len(UserProfile.objects.filter(designation="doctor")):
            free_time_slots.append(time_slot)

    response['Success'] = free_time_slots
    return Response(response)


@ api_view(['POST'])
def book_slot(request):
    response = {}
    if (not request.user.is_authenticated):
        response['Error'] = "Not Logged In"
        return Response(response)

    pref_date = request.data.get('date', None)
    if (pref_date is None):
        response['Error'] = "Form Error"
        return Response(response)

    pref_time = request.data.get('time', None)
    if pref_time is None:
        response['Error'] = "Form Error"
        return Response(response)

    patient_id = request.data.get('patient', None)
    if patient_id is None:
        response['Error'] = "Form Error"
        return Response(response)

    my_date = datetime.strptime(
        pref_date + " " + pref_time, "%a %b %d %Y %H:%M:%S")

    timezone.activate(timezone.get_current_timezone())

    my_date = timezone.make_aware(my_date)

    doctor_apps = Doctor_Appointment.objects.all()

    doctor_id = []

    booked = False

    for doctor_app in doctor_apps:
        if doctor_app.slot_time == my_date:
            doctor_id.append(doctor_app.doctor.id)

    all_doctors = UserProfile.objects.filter(designation="doctor")
    for doctor in all_doctors:
        if doctor.user.id not in doctor_id:
            booked = True
            app = Doctor_Appointment(doctor=doctor.user, patient=Patient.objects.filter(
                id=patient_id).first(), slot_time=my_date)
            app.save()
            response['Doctor'] = app.doctor.username
            response['Slot'] = app.slot_time
            break

    if booked:
        response['Success'] = 'Booking Done'
    else:
        response['Error'] = 'Booking Error'

    return Response(response)


def download_data(request):
    if (not request.user.is_authenticated or not check_designation(request.user, DATABASE_ADMIN)):
        return Response({
            'Error': 'Not Logged In Or Wrong Designation'
        })
    data = download_csv(Admit, request, Admit.objects.all())

    return HttpResponse(data, content_type='text/csv')


@ api_view(['GET'])
def list_transactions(request):
    if (not request.user.is_authenticated):
        return Response({"Error": "Not Logged In"})

    transactions = Transaction.objects.all()
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data)


@ api_view(['POST'])
def add_test(request):
    if (not request.user.is_authenticated):
        return Response({"Error": "Not Logged In"})
    transaction_id = request.data.get('id', None)
    if transaction_id is None:
        return Response({
            'Error': 'Transaction id not recieved'
        })
    transaction = Transaction.objects.filter(id=transaction_id)
    if len(transaction) == 0:
        return Response({
            'Error': 'Provided transaction id not exist'
        })
    test_objects = Test.objects.filter(transaction=transaction.first())

    text = request.data.get('text', None)
    image = request.data.get('image', None)
    if text is None and image is None:
        return Response({
            'Error': 'Both text and image not provided'
        })

    if len(test_objects) is 0:
        test = Test(
            transaction=transaction.first(),
            report_text=text,
            report_image=image
        )
        test.save()
        return Response({
            'Success': 'Test added'
        })
    else:
        test = test_objects.first()
        if text is not None:
            test.report_text = text
        if image is not None:
            test.report_image = image
        test.save()
        return Response({
            'Success': 'Test added'
        })


@ api_view(['POST'])
def view_text(request):
    if (not request.user.is_authenticated):
        return Response({"Error": "Not Logged In"})
    transaction_id = request.data.get('id', None)
    if transaction_id is None:
        return Response({
            'Error': 'Transaction id not recieved'
        })
    transaction = Transaction.objects.filter(id=transaction_id)
    if len(transaction) == 0:
        return Response({
            'Error': 'Provided transaction id not exist'
        })
    test_objects = Test.objects.filter(transaction=transaction.first())
    if len(test_objects) is 0:
        return Response({
            'Error': 'Empty'
        })
    text = test_objects.first().report_text
    if text is None:
        return Response({
            'Error': 'Empty'
        })
    return Response({
        'Success': text
    })


@ api_view(['POST'])
def view_image(request):
    if (not request.user.is_authenticated):
        return Response({"Error": "Not Logged In"})
    transaction_id = request.data.get('id', None)
    if transaction_id is None:
        return Response({
            'Error': 'Transaction id not recieved'
        })
    transaction = Transaction.objects.filter(id=transaction_id)
    if len(transaction) == 0:
        return Response({
            'Error': 'Provided transaction id not exist'
        })
    test_objects = Test.objects.filter(transaction=transaction.first())
    if len(test_objects) is 0:
        return Response({
            'Error': 'Empty'
        })
    image = test_objects.first().report_image
    if image is None:
        return Response({
            'Error': 'Empty'
        })

    f = open(image.path, 'rb')
    response = FileResponse(f, content_type='image/png')
    return response


@ api_view(['POST'])
def get_pdf(request):
    if (not request.user.is_authenticated):
        return Response({"Error": "Not Logged In"})
    
    transaction_id = request.data.get('id', None)
    if transaction_id is None:
        return Response({
            'Error': 'Transaction id not recieved'
        })
    transaction = Transaction.objects.filter(id=transaction_id)
    if len(transaction) == 0:
        return Response({
            'Error': 'Provided transaction id not exist'
        })
    test_objects = Test.objects.filter(transaction=transaction.first())
    if len(test_objects) is 0:
        return Response({
            'Error': 'No data'
        })
    image = test_objects.first().report_image
    text = test_objects.first().report_text
    if image is None or text is None:
        return Response({
            'Error': 'No data'
        })

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="mypdf.pdf"'
    pdf_canvas = canvas.Canvas(response, pagesize=letter)

    print(image)

    image_path = image.path
    pdf_canvas.drawImage(image_path, x=50, y=50, width=300, height=200)

    pdf_canvas.drawString(100, 300, text)

    pdf_canvas.save()
    return response
    