from rest_framework.serializers import ModelSerializer, SerializerMethodField
from .models import Patient, Transaction, Test, Admit, Doctor_Appointment, Room
from job.models import UserProfile
from django.contrib.auth.models import User


class DoctorAppSerializer(ModelSerializer):
    patient_username = SerializerMethodField('eval_pat')
    patient_id = SerializerMethodField('eval_id')
    patient_symptoms = SerializerMethodField('eval_sym')
    prescription = SerializerMethodField('eval_pres')
    room = SerializerMethodField('eval_room')

    def eval_id(self, foo):
        patient = Patient.objects.filter(id=foo.patient.id)
        if (len(patient) == 0):
            return ""

        return patient.first().id

    def eval_room(self, foo):
        patient = Patient.objects.filter(id=foo.patient.id)
        if (len(patient) == 0):
            return "None"

        room = Room.objects.filter(patient=patient.first())
        if (len(room) == 0):
            return "None"

        return room.first().number

    def eval_pres(self, foo):
        patient = Patient.objects.filter(id=foo.patient.id)
        if (len(patient) == 0):
            return ""
        transaction = Transaction.objects.filter(patient=patient.first())
        if len(transaction) == 0:
            return ""
        return transaction.last().prescription
    

    def eval_sym(self, foo):
        try:
            patient = Patient.objects.filter(id=foo.patient.id)
            return patient.first().symptoms
        except:
            return ""

    def eval_pat(self, foo):
        try:
            patient = Patient.objects.filter(id=foo.patient.id)
            return patient.first().name
        except:
            return ""

    class Meta:
        model = Doctor_Appointment
        fields = ('id', 'patient_username', 'slot_time',
                  'patient_symptoms', 'prescription', 'room', "patient_id")


class AdmitSerializer(ModelSerializer):
    class Meta:
        model = Admit
        fields = '__all__'


class TestSerializer(ModelSerializer):
    class Meta:
        model = Test
        fields = '__all__'


class TransactionSerializer(ModelSerializer):
    patient_username = SerializerMethodField('eval_pat')
    doctor_username = SerializerMethodField('eval_doc')
    test = SerializerMethodField('eval_test')

    def eval_test(self, foo):
        test = Test.objects.filter(transaction=foo)
        if (len(test) == 0):
            return None
        return TestSerializer(test.first(), many=False).data

    def eval_pat(self, foo):
        patient = Patient.objects.filter(id=foo.patient.id)
        return patient.first().name

    def eval_doc(self, foo):
        doctor = User.objects.filter(id=foo.doctor.id)
        return doctor.first().username

    class Meta:
        model = Transaction
        fields = ('id', 'patient_username', 'doctor_username',
                  'prescription', 'created_time', 'test')


class UserSerializer(ModelSerializer):
    designation = SerializerMethodField('eval_job')

    def eval_job(self, foo):
        job = UserProfile.objects.filter(user=foo)
        if (len(job) == 0):
            return ""
        return job.first().designation

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'designation')


class PatientSerializer(ModelSerializer):
    prescription = SerializerMethodField('eval_pres')

    def eval_pres(self, foo):
        transaction = Transaction.objects.filter(patient=foo)
        if len(transaction) == 0:
            return ""
        return transaction.last().prescription

    class Meta:
        model = Patient
        fields = ('id', 'name', 'address', 'phone',
                  'age', 'symptoms', 'prescription')
