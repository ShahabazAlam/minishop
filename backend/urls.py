from django.urls import path, re_path
from .views import (index,
                    ItemListView,
                    AddToCartView,
                    FetchCartView,
                    DeleteCartView,
                    QuantityUpdateView,
                    ProductDetail,
                    CountryListView,
                    CreateAddressView,
                    FetchAddressView,
                    DeleteAddressView,
                    MakeAddressDefaultView,
                    CouponView,
                    MakePayment,
                    FetchPaymentsView,
                    DeletePaymentView
                    )
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    re_path(r'^home/*', index),
    path('products/<str:slug>/', ItemListView.as_view(), name='product-list'),
    path('product-detail/<int:id>/', ProductDetail.as_view(), name='product-list'),
    path('add-to-cart/', AddToCartView.as_view(), name='add-to-cart'),
    path('fetch-cart/', FetchCartView.as_view(), name='fetch-cart'),
    path('create-address/', CreateAddressView.as_view(), name='create-address'),
    path('fetch-address/', FetchAddressView.as_view(), name='fetch-address'),
    path('delete-address/<pk>', DeleteAddressView.as_view(), name='delete-address'),
    path('make-address-default/', MakeAddressDefaultView.as_view(),
         name='make-address-default'),
    path('fetch-countries/', CountryListView.as_view(), name='fetch-countries'),
    path('delete-cart/<pk>', DeleteCartView.as_view(), name='delete-cart'),
    path('coupon/', CouponView.as_view(), name='coupon'),
    path('change-quantity/',
         QuantityUpdateView.as_view(), name='add-item-quantity'),
    path('make-payment/', MakePayment.as_view(), name='make-payment'),
    path('fetch-payments/', FetchPaymentsView.as_view(), name='fetch-payments'),
    path('delete-payment/<pk>', DeletePaymentView.as_view(), name='delete-payment'),



]
