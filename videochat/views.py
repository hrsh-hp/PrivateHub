from django.shortcuts import render

# Create your views here.
def main_view(request):
    
    global room 
    
    if request.method == "POST":
        room = request.POST['room']
        
    if room:
        context = {'room' : room }
    else:
        context = {'room' : 'Test'}
    return render(request, 'videochat/main.html',context)


def index(request):
    return render(request, 'videochat/index.html')