from django.contrib import admin
from .models import (Item, OrderItem, Colors,
                     Size, Coupon, Order, Address, UserProfile, Payment)
# Register your models here.
admin.site.register(Item)
admin.site.register(OrderItem)
admin.site.register(Colors)
admin.site.register(Size)
admin.site.register(Coupon)
admin.site.register(Order)
admin.site.register(Address)
admin.site.register(UserProfile)
admin.site.register(Payment)
