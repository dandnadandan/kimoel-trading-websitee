import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Smartphone, QrCode, CheckCircle } from "lucide-react";
import { PaymentMethod } from "@/types";

interface GCashPaymentProps {
  onPaymentComplete: (paymentDetails: PaymentMethod) => void;
  amount: number;
}

export default function GCashPayment({ onPaymentComplete, amount }: GCashPaymentProps) {
  const [gcashNumber, setGcashNumber] = useState("");
  const [gcashName, setGcashName] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!gcashNumber || !gcashName || !referenceNumber) {
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const paymentDetails: PaymentMethod = {
        type: 'gcash',
        details: {
          gcashNumber,
          gcashName,
          referenceNumber
        }
      };

      setIsPaid(true);
      setIsProcessing(false);
      onPaymentComplete(paymentDetails);
    }, 2000);
  };

  if (isPaid) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            Payment Successful!
          </h3>
          <p className="text-green-600">
            Your GCash payment of ₱{amount.toFixed(2)} has been processed.
          </p>
          <p className="text-sm text-green-500 mt-2">
            Reference: {referenceNumber}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-blue-600" />
          GCash Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* GCash Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3">How to Pay with GCash:</h4>
          <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
            <li>Open your GCash app</li>
            <li>Scan the QR code below or send money to: <strong>YOUR_ACTUAL_GCASH_NUMBER</strong></li>
            <li>Enter the exact amount: ₱{amount.toFixed(2)}</li>
            <li>Complete the payment and save the reference number</li>
            <li>Fill in your payment details below with the reference number</li>
          </ol>
          <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-700">
            <strong>Note:</strong> Please keep your GCash receipt as proof of payment
          </div>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
          <img 
            src="/gcash-qr.png" 
            alt="GCash QR Code" 
            className="w-48 h-48 object-contain mb-4"
          />
          <p className="text-sm text-gray-600 font-medium">Scan to Pay</p>
          <p className="text-xs text-gray-500 mt-1">Amount: ₱{amount.toFixed(2)}</p>
        </div>

        <Separator />

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gcashNumber">GCash Number *</Label>
              <Input
                id="gcashNumber"
                type="tel"
                placeholder="09XXXXXXXXX"
                value={gcashNumber}
                onChange={(e) => setGcashNumber(e.target.value)}
                pattern="09[0-9]{9}"
                maxLength={11}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gcashName">Account Name *</Label>
              <Input
                id="gcashName"
                type="text"
                placeholder="Juan Dela Cruz"
                value={gcashName}
                onChange={(e) => setGcashName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referenceNumber">Reference Number *</Label>
            <Input
              id="referenceNumber"
              type="text"
              placeholder="1234567890"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500">
              Found in your GCash transaction history
            </p>
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Amount to Pay:</strong> ₱{amount.toFixed(2)}
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isProcessing || !gcashNumber || !gcashName || !referenceNumber}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing Payment...
              </>
            ) : (
              "Confirm Payment"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
