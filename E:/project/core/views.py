from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

def index(request):
    """Render the single-page portfolio application."""
    return render(request, 'core/index.html')

@csrf_exempt
def contact_submit(request):
    """Handle AJAX contact form submissions."""
    if request.method == 'POST':
        name = request.POST.get('name', '')
        email = request.POST.get('email', '')
        message = request.POST.get('message', '')
        
        # In production, you would save to database or send email
        # For now, just return success response
        return JsonResponse({
            'success': True,
            'message': 'Thank you for your message. I will get back to you soon.'
        })
    
    return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=405)
