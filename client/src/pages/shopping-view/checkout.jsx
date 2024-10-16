import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [selectedPaymentType, setSelectedPaymentType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  console.log(currentSelectedAddress, "cartItems");

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  function handleInitiatePaypalPayment() {
    if (cartItems.items.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });

      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      console.log(data, "mahdi");
      if (data?.payload?.success) {
        setIsPaymentStart(true);
      } else {
        setIsPaymentStart(false);
      }
    });
  }

  const handleCashOnDelivery = async (e) => {
    e.preventDefault();
    if (cartItems.items.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });

      return;
    }
    if (!selectedPaymentType) {
      toast({
        title: "Please select a payment type.",
        variant: "destructive",
      });
      return;
    }

    const form = e.target;
    const senderNumber = form?.senderNumber?.value;
    const transactionID = form?.transactionID?.value;
    const deliveryCharge = form?.amount?.value;

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "COD",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
      deliveryChargeDetails: {
        paymentType: selectedPaymentType,
        senderNumber,
        transactionID,
        deliveryCharge,
      },
    };

    setIsPaymentStart(true);

    const { data } = await axios.post(
      `${import.meta.env.VITE_API_KEY}/api/shop/order/cod`,
      orderData
    );
    console.log(data)
    if (data?.success) {
      toast({
        title: "Order Successful",
      });
      setIsPaymentStart(false);
      setIsModalOpen(false);
    } else {
      toast({
        title: "Failed to place order. Please try again.",
        variant: "destructive",
      });
      setIsPaymentStart(false);
    }
  };
  const deliveryCharge =
    currentSelectedAddress && currentSelectedAddress?.city === "Sylhet"
      ? 60
      : 120;

  if (approvalURL) {
    window.location.href = approvalURL;
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item, idx) => (
                <UserCartItemsContent key={idx} cartItem={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            {currentSelectedAddress && (
              <div className="flex justify-between">
                <span className="font-bold">Delivery Charge</span>
                <span className="font-bold">৳{deliveryCharge}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">
                ৳
                {totalCartAmount +
                  (currentSelectedAddress ? deliveryCharge : 0)}
              </span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button
              title="Not Available in your country"
              disabled
              onClick={handleInitiatePaypalPayment}
              className="w-full disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isPaymentStart
                ? "Processing Paypal Payment..."
                : "Checkout with Paypal"}
            </Button>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger className="w-full">
                <Button
                  onClick={() => {
                    if (cartItems.items.length === 0) {
                      toast({
                        title:
                          "Your cart is empty. Please add items to proceed",
                        variant: "destructive",
                      });
                      return;
                    }
                    if (currentSelectedAddress === null) {
                      toast({
                        title: "Please select one address to proceed.",
                        variant: "destructive",
                      });

                      return;
                    }
                  }}
                  className="w-full mt-2 bg-rose-500 transition-all duration-300 hover:bg-rose-600"
                >
                  Cash on Delivery
                </Button>
              </DialogTrigger>
              {currentSelectedAddress && (
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm your Order</DialogTitle>
                    <DialogDescription>
                      To confirm your order pay your Delivery Charge BDT{" "}
                      {deliveryCharge} via bKash or Nagad Send Money to{" "}
                      <span className="text-rose-500 font-semibold">
                        01875661523
                      </span>{" "}
                      and provide transaction id and sender number here! The
                      product will be delivered within{" "}
                      {deliveryCharge === 60 ? "1 days" : "3-4 working days"}.
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={handleCashOnDelivery}
                    className="flex flex-col items-center justify-center mt-3 gap-3"
                  >
                    <div className="w-full flex flex-col gap-3">
                      <Label>Sender Number</Label>
                      <Input
                        type="text"
                        name="senderNumber"
                        placeholder="Sender Number"
                        required
                      />
                    </div>
                    <div className="w-full flex flex-col gap-3">
                      <Label>Delivery Charge</Label>
                      <Input
                        type="number"
                        name="amount"
                        placeholder="Amount"
                        value={deliveryCharge}
                      />
                    </div>
                    <div className="w-full flex flex-col gap-3">
                      <Label>Transaction ID</Label>
                      <Input
                        type="text"
                        name="transactionID"
                        placeholder="Transaction ID"
                        required
                      />
                    </div>
                    <div className="w-full flex flex-col gap-3">
                      <Label>Payment Type</Label>
                      <Select
                        onValueChange={(value) => setSelectedPaymentType(value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Payment Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Payment Type</SelectLabel>
                            <SelectItem value="bKash">bKash</SelectItem>
                            <SelectItem value="nagad">Nagad</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full flex flex-col gap-3 mt-2">
                      <button className="w-full bg-gray-900 rounded p-2 text-white">
                        {isPaymentStart ? "Processing Payment..." : "Order Now"}
                      </button>
                    </div>
                  </form>
                </DialogContent>
              )}
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
