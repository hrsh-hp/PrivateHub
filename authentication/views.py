from django.shortcuts import render

# Create your views here.
def login_view(request):
    if request.method == 'GET':
        return render(request, 'login.html')

def register(request):
    if request.method == 'POST':
        pass
    if request.method == 'GET':
        return render(request, 'register.html')
