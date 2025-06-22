from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView
from .serializers import(
    ItemSerializer,
    ItemDetailSerializer,
    CartItemSerializer,
    OrderSerializer,
    AddressSerializer,
    PaymentsListSerializer,
)
from .models import (
    Item,
    Order,
    OrderItem,
    Colors,
    Size,
    Address,
    Coupon,
    UserProfile,
    Payment
)
from rest_framework.permissions import AllowAny
from django.http import Http404
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404
from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from rest_framework.generics import (
    ListAPIView, RetrieveAPIView, CreateAPIView,
    UpdateAPIView, DestroyAPIView
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
import stripe
from django_countries import countries
# Create yur views here.

stripe.api_key = 'Your Secret Key'


def index(request):
    return render(request, 'frontend/index.html', {'title': 'Home'})


class ItemListView(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ItemSerializer

    def get_queryset(self):
        slug = self.kwargs['slug']
        return Item.objects.filter(slug=slug)


class ItemDetailView(RetrieveAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ItemDetailSerializer

    def get_object(self):
        queryset = OrderItem.objects.filter(user=self.request.user)


class FetchCartView(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = CartItemSerializer

    def get_queryset(self):
        return OrderItem.objects.filter(user=self.request.user)


class AddToCartView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        slug = request.data.get('slug', None)
        p_id = request.data.get('p_id', None)
        color = request.data.get('color', None)
        size = request.data.get('size', None)

        if slug and p_id is None:
            return Response({"message": "Invalid request"}, status=HTTP_400_BAD_REQUEST)

        item = get_object_or_404(Item, id=p_id, slug=slug)

        order_item_qs = OrderItem.objects.filter(
            item=item,
            user=self.request.user,
            ordered=False,
            colour=color,
            size=size
        )
        if order_item_qs.exists():
            order_item = order_item_qs.first()
            order_item.quantity += 1
            order_item.save()
            return Response({'cart': 'old', "message": "Added 1+ Item Successfully"}, status=HTTP_200_OK)
        else:
            order_item = OrderItem.objects.create(
                item=item,
                user=self.request.user,
                ordered=False,
            )
            if color and size:
                order_item.colour.add(color)
                order_item.size.add(size)
                order_item.save()

            order_qs = Order.objects.filter(user=request.user, ordered=False)
            if order_qs.exists():
                order = order_qs[0]
                if not order.items.filter(item__id=order_item.id).exists():
                    order.items.add(order_item)

            else:
                ordered_date = timezone.now()
                order = Order.objects.create(
                    user=request.user, ordered_date=ordered_date)
                order.items.add(order_item)
            serializer = CartItemSerializer(order_item)
            return Response({'cart': 'new', 'data': serializer.data, "message": "Added New Cart Successfully"}, status=HTTP_200_OK)


class DeleteCartView(APIView):
    permission_classes = (IsAuthenticated,)
    
    def get_object(self, pk):
        try:
            return OrderItem.objects.get(pk=pk)
        except OrderItem.DoesNotExist:
            raise Http404

    def delete(self, request, pk, format=None):
        item = self.get_object(pk)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class QuantityUpdateView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request, *args, **kwargs):
        pk = request.data.get('id', None)
        action = request.data.get('action', None)
        if pk is None:
            return Response({"message": "Invalid data"}, status=HTTP_400_BAD_REQUEST)

        item = OrderItem.objects.get(pk=pk, user=request.user)

        if action == 'add':
            item.quantity += 1
            item.save()
            return Response({"message": 'addedquantity'}, status=HTTP_200_OK)
        elif action == 'remove':
            if item.quantity > 1:
                item.quantity -= 1
                item.save()
                return Response({"message": 'removedquantity'}, status=HTTP_200_OK)
            else:
                item.delete()
                return Response({"message": 'deleted'}, status=HTTP_200_OK)


class ProductDetail(RetrieveAPIView):
    permission_classes = [AllowAny, ]

    def get(self, request, id, format=None):
        queryset = Item.objects.get(id=id)
        serializer = ItemDetailSerializer(queryset)
        return Response(serializer.data)


class CountryListView(APIView):
    def get(self, request, *args, **kwargs):
        return Response(countries, status=HTTP_200_OK)


class CreateAddressView(APIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request, *args, **kwargs):
        address_type = request.data.get('address_type')
        apartment_address = request.data.get('apartment_address')
        country = request.data.get('country')
        default = request.data.get('default')
        street_address = request.data.get('street_address')
        user = request.data.get('user')
        zip = request.data.get('zip')
        if default == True:
            Address.objects.filter(
                user=user, address_type=address_type).update(default=False)
        queryset = Address.objects.create(
            address_type=address_type,
            apartment_address=apartment_address,
            country=country,
            default=default,
            street_address=street_address,
            user_id=user,
            zip=zip
        )
        serializer = AddressSerializer(queryset).data
        return Response(serializer, status=status.HTTP_200_OK,)


class FetchAddressView(ListAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = AddressSerializer

    def get_queryset(self):
        address_type = self.request.query_params.get('address_type', None)
        if address_type is None:
            return Response({"message": "Invalid data"}, status=HTTP_400_BAD_REQUEST)
        elif address_type == 'null':
            return Address.objects.filter(user=self.request.user)
        return Address.objects.filter(
            user=self.request.user, address_type=address_type)


class DeleteAddressView(DestroyAPIView):
    permission_classes = [IsAuthenticated, ]
    queryset = Address.objects.all()


class MakeAddressDefaultView(APIView):
    def post(self, request, *args, **kwargs):
        id = request.data.get('id')
        address_type = request.data.get('address_type')
        if id and address_type is None:
            return Response({"message": "Invalid data"}, status=HTTP_400_BAD_REQUEST)
        q_s = Address.objects.filter(
            user=self.request.user, address_type=address_type)
        for q in q_s:
            if q.id == id:
                q.default = True
            else:
                q.default = False
            q.save()
        return Response('Success', status=status.HTTP_200_OK)


class CouponView(APIView):
    def get(self, request, *args, **kwargs):
        order = Order.objects.get(
            user=self.request.user, ordered=False)
        if order.coupon:
            return Response(data=order.coupon.amount, status=status.HTTP_200_OK)
        else:
            return Response(data=0, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        code = request.data.get('code', None)
        if code is None:
            return Response({"message": "Invalid data received"}, status=HTTP_400_BAD_REQUEST)
        order = Order.objects.get(
            user=self.request.user, ordered=False)
        coupon = get_object_or_404(Coupon, code=code)
        coupon_amount = coupon.amount
        order.coupon = coupon
        order.save()
        return Response(data=coupon_amount, status=HTTP_200_OK)


class MakePayment(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        order = Order.objects.get(user=self.request.user, ordered=False)
        userprofile, created = UserProfile.objects.get_or_create(
            user=self.request.user)
        token = request.data.get('s_token')
        billing_address_id = request.data.get('selectedBillingAddress')
        shipping_address_id = request.data.get('selectedShippingAddress')

        billing_address = Address.objects.get(id=billing_address_id)
        shipping_address = Address.objects.get(id=shipping_address_id)
        if userprofile.stripe_customer_id is not None:
            customer = stripe.Customer.retrieve(
                userprofile.stripe_customer_id,
            )

        else:
            customer = stripe.Customer.create(
                source=token,
                email=self.request.user.email,
                name=request.user.username,
                description='test description',
                address={"city": billing_address.apartment_address, "country": billing_address.country,
                         "line1": shipping_address.apartment_address, "line2": "", "postal_code": billing_address.zip, "state": 'uttarpradesh'}
            )
            userprofile.stripe_customer_id = customer['id']
            userprofile.one_click_purchasing = True
            userprofile.save()

        amount = int(order.get_total()*100)

        try:

            # charge the customer because we cannot charge the token more than once
            charge = stripe.Charge.create(
                amount=amount,  # cents
                currency="inr",
                customer=userprofile.stripe_customer_id,
                description='Purchase on minishop',
            )
            payment = Payment()
            payment.stripe_charge_id = charge['id']
            payment.user = self.request.user
            payment.amount = order.get_total()
            payment.save()

            # assign the payment to the order

            order_items = order.items.all()
            order_items.update(ordered=True)
            for item in order_items:
                item.save()

            order.ordered = True
            order.payment = payment
            order.billing_address = billing_address
            order.shipping_address = shipping_address
            # order.ref_code = create_ref_code()
            order.save()

            return Response(status=HTTP_200_OK)

        except stripe.error.CardError as e:
            body = e.json_body
            print(body)
            err = body.get('error', {})
            return Response({"message": f"{err.get('message')}"}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.RateLimitError as e:
            # Too many requests made to the API too quickly
            return Response({"message": "Rate limit error"}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.InvalidRequestError as e:
            # Invalid parameters were supplied to Stripe's API
            return Response({"message": "Invalid parameters"}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.AuthenticationError as e:
            # Authentication with Stripe's API failed
            # (maybe you changed API keys recently)
            return Response({"message": "Not authenticated"}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.APIConnectionError as e:
            # Network communication with Stripe failed
            return Response({"message": "Network error"}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.StripeError as e:
            # Display a very generic error to the user, and maybe send
            # yourself an email
            return Response({"message": "Something went wrong. You were not charged. Please try again."}, status=HTTP_400_BAD_REQUEST)

        except Exception as e:
            # send an email to ourselves
            return Response({"message": "A serious error occurred. We have been notifed."}, status=HTTP_400_BAD_REQUEST)

        return Response({"message": "Invalid data received"}, status=HTTP_400_BAD_REQUEST)


class FetchPaymentsView(ListAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = PaymentsListSerializer

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)


class DeletePaymentView(APIView):
    permission_classes = (IsAuthenticated,)
    
    def get_object(self, pk):
        try:
            return Payment.objects.get(pk=pk)
        except Payment.DoesNotExist:
            raise Http404

    def delete(self, request, pk, format=None):
        payment = self.get_object(pk)
        payment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
