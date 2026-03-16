from rest_framework import serializers
from django.contrib.auth import authenticate
from authentication.models import User
from recruiter.models import JobPost
from .models import Webinar, AdmissionPost, WebinarRegistration, AdmissionRegistration

class UserManagementSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'role', 'password', 'created_at', 'is_active']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance

class JobPostSerializer(serializers.ModelSerializer):
    recruiter_name = serializers.CharField(source='recruiter.get_full_name', read_only=True)
    company_name = serializers.CharField(source='recruiter.company_profile.company_name', read_only=True)
    
    class Meta:
        model = JobPost
        fields = [
            'id', 'job_title', 'location', 'job_type', 'work_mode', 
            'experience_level', 'min_salary', 'max_salary', 'job_description',
            'is_published', 'created_at', 'updated_at', 'recruiter_name', 'company_name'
        ]

class WebinarSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = Webinar
        fields = [
            'id', 'title', 'speaker', 'organization', 'date', 'time', 
            'mode', 'platform', 'price', 'category', 'description', 
            'agenda', 'created_at', 'updated_at', 'is_active', 'created_by_name'
        ]
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

class AdmissionPostSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = AdmissionPost
        fields = [
            'id', 'college_name', 'location', 'courses', 'eligibility', 
            'deadline', 'fees', 'contact_email', 'contact_phone', 
            'description', 'created_at', 'updated_at', 'is_active', 'created_by_name'
        ]
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

class WebinarRegistrationSerializer(serializers.ModelSerializer):
    webinar_title = serializers.CharField(source='webinar.title', read_only=True)
    webinar_date = serializers.DateField(source='webinar.date', read_only=True)
    webinar_time = serializers.TimeField(source='webinar.time', read_only=True)
    webinar_mode = serializers.CharField(source='webinar.mode', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_phone = serializers.CharField(source='user.phone', read_only=True)
    
    class Meta:
        model = WebinarRegistration
        fields = [
            'id', 'webinar', 'user', 'status', 'registered_at', 'updated_at',
            'webinar_title', 'webinar_date', 'webinar_time', 'webinar_mode',
            'user_name', 'user_email', 'user_phone'
        ]
        read_only_fields = ['registered_at', 'updated_at']

class AdmissionRegistrationSerializer(serializers.ModelSerializer):
    admission_college = serializers.CharField(source='admission.college_name', read_only=True)
    admission_location = serializers.CharField(source='admission.location', read_only=True)
    admission_deadline = serializers.DateField(source='admission.deadline', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_phone = serializers.CharField(source='user.phone', read_only=True)
    
    class Meta:
        model = AdmissionRegistration
        fields = [
            'id', 'admission', 'user', 'status', 'applied_at', 'updated_at',
            'documents_submitted', 'notes', 'admission_college', 'admission_location',
            'admission_deadline', 'user_name', 'user_email', 'user_phone'
        ]
        read_only_fields = ['applied_at', 'updated_at']