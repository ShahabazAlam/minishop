from rest_framework import serializers
from .models import (
    Item, OrderItem, Order, Coupon, Colors, Size, Address, Payment
)
from django_countries.serializer_fields import CountryField


class ItemSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField()
    label = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = ('__all__')

    def get_category(self, obj):
        return obj.get_category_display()

    def get_label(self, obj):
        return obj.get_label_display()


class ColorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Colors
        fields = (
            'id',
            'color',
            'image',
        )


class SizeSerializer(serializers.ModelSerializer):
    size = serializers.SerializerMethodField()

    class Meta:
        model = Size
        fields = (
            'id',
            'size',
        )

    def get_size(self, obj):
        return obj.size


class CartItemSerializer(serializers.ModelSerializer):
    item = serializers.SerializerMethodField()
    final_price = serializers.SerializerMethodField()
    color = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = (
            'id',
            'item',
            'quantity',
            'final_price',
            'color',
            'size',
            'ordered'
        )

    def get_item(self, obj):
        return ItemSerializer(obj.item).data

    def get_color(self, obj):
        return obj.colour.get().color

    def get_size(self, obj):
        return obj.size.get().size

    def get_final_price(self, obj):
        return obj.get_final_price()


class ItemDetailSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField()
    label = serializers.SerializerMethodField()
    color = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = (
            'id',
            'title',
            'price',
            'discount_price',
            'category',
            'label',
            'slug',
            'description',
            'image',
            'color',
            'size',
        )

    def get_size(self, obj):
        return SizeSerializer(obj.size_set.all(), many=True).data

    def get_color(self, obj):
        return ColorSerializer(obj.colors_set.all(), many=True).data

    def get_category(self, obj):
        return obj.get_category_display()

    def get_label(self, obj):
        return obj.get_label_display()


class OrderSerializer(serializers.ModelSerializer):
    total = serializers.SerializerMethodField()
    coupon = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = (
            'id',
            'total',
            'coupon'
        )

    def get_total(self, obj):
        return obj.get_total()

    def get_coupon(self, obj):
        if obj.coupon is not None:
            return CouponSerializer(obj.coupon).data
        return None


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = (
            'id',
            'code',
            'amount'
        )


class AddressSerializer(serializers.ModelSerializer):
    country = CountryField(country_dict=True,)

    class Meta:
        model = Address
        fields = (
            'id',
            'user',
            'street_address',
            'apartment_address',
            'country',
            'zip',
            'address_type',
            'default'
        )


class PaymentsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = (
            'id',
            'amount',
            'timestamp'
        )
