from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from payments.models import Order, Payment
from .serializers import CardInformationSerializer
import stripe




class PaymentAPI(APIView):
    serializer_class = CardInformationSerializer
    def post(self, request):
       
        domain_url = 'http://localhost:8000/'
        stripe.api_key = settings.STRIPE_SECRET_KEY
        try:
            # Create new Checkout Session for the order
            # Other optional params include:
            # [billing_address_collection] - to display billing address details on the page
            # [customer] - if you have an existing Stripe Customer ID
            # [payment_intent_data] - capture the payment later
            # [customer_email] - prefill the email input in the form
            # For full details see https://stripe.com/docs/api/checkout/sessions/create

            # ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
            # Retrieve product details from the request
            line_items = request.data.get('line_items', [
            {
                'name': 'T-shirt',  # Default item
                'quantity': 1,
                'currency': 'usd',
                'amount': '2000',
            }
        ])
            checkout_session = stripe.checkout.Session.create(
                success_url=domain_url + 'success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url=domain_url + 'cancelled/',
                payment_method_types=['card'],
                mode='payment',
                line_items=line_items,
            )
            return Response({'sessionId': checkout_session['id']})
        except Exception as e:
            return Response({'error': str(e)})
        
        

    def stripe_card_payment(self, data_dict):
        try:
            # Create a payment method for the card
            payment_method = stripe.PaymentMethod.create(
                type="card",
                card={
                    "number": data_dict['card_number'],
                    "exp_month": data_dict['expiry_month'],
                    "exp_year": data_dict['expiry_year'],
                    "cvc": data_dict['cvc'],
                },
            )

            # Create a PaymentIntent
            payment_intent = stripe.PaymentIntent.create(
                amount=data_dict['amount'],  # Amount in smallest currency unit
                currency=data_dict['currency'],  # Currency, e.g., 'inr'
                payment_method=payment_method['id'],
                confirm=True,  # Immediate confirmation
            )

            # Retrieve PaymentIntent to check status
            payment_intent_status = stripe.PaymentIntent.retrieve(payment_intent['id'])

            if payment_intent_status and payment_intent_status['status'] == 'succeeded':
                response = {
                    'message': "Card Payment Success",
                    'status': status.HTTP_200_OK,
                    "payment_intent": payment_intent_status,
                }
            else:
                response = {
                    'message': "Card Payment Failed",
                    'status': status.HTTP_400_BAD_REQUEST,
                    "payment_intent": payment_intent_status,
                }
        except stripe.error.CardError as e:
            response = {
                'error': "Card declined or invalid",
                'status': status.HTTP_400_BAD_REQUEST,
                "stripe_error": str(e),
            }
        except stripe.error.StripeError as e:
            response = {
                'error': "Stripe processing error",
                'status': status.HTTP_500_INTERNAL_SERVER_ERROR,
                "stripe_error": str(e),
            }
        except Exception as e:
            response = {
                'error': "An unexpected error occurred",
                'status': status.HTTP_500_INTERNAL_SERVER_ERROR,
                "exception": str(e),
            }

        return response



from rest_framework.decorators import api_view


# Configure Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY

@api_view(['POST'])
def create_payment_intent(request):
    try:
        total_amount = request.data.get('totalAmount')

        if not total_amount:
            return Response({'error': 'Total amount is required'}, status=400)

        # Create an order record
        order = Order.objects.create(
            customer_name=request.data.get('name'),
            contact_number=request.data.get('contactNumber'),
            delivery_location=request.data.get('deliveryLocation'),
            total_amount=total_amount,
        )

        # Create PaymentIntent in Stripe
        payment_intent = stripe.PaymentIntent.create(
            amount=int(float(total_amount) * 140),
            currency='Rs.',
        )

        # Save Payment record
        Payment.objects.create(
            order=order,
            stripe_payment_intent_id=payment_intent['id'],
            status='created',
        )

        return Response({'clientSecret': payment_intent['client_secret']})
    except Exception as e:
        return Response({'error': str(e)}, status=400)
