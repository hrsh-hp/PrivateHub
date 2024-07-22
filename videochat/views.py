import random
import string
from django.shortcuts import render
import uuid 
# Create your views here.

def generate_random_hash():
    chars = string.ascii_lowercase
    
    part1 = ''.join(random.choice(chars) for _ in range(3))
    part2 = ''.join(random.choice(chars) for _ in range(3))
    part3 = ''.join(random.choice(chars) for _ in range(3))
    
    random_hash = f"{part1}-{part2}-{part3}"
    
    return random_hash

def main_view(request):
    
    # global room 
    # room = 'Test'
    if request.method == "POST":
        
        action = request.POST['action']
        print(action)
        
        if action == 'create':
            room = generate_random_hash()
        elif action == 'join':
            room = request.POST['room']
        
        context = {'room' : room }
        return render(request, 'videochat/main.html',context)
    
    else:
        return render(request, 'videochat/index.html')  


def index(request):
    return render(request, 'videochat/index.html')