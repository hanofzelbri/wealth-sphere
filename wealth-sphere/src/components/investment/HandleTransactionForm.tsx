import React, { useState } from "react";
import { Transaction } from "../../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HandleTransactionFormProps {
  submitButtonText: string;
  transaction?: Transaction;
  onSubmit: (transaction: Transaction) => Promise<void>;
  onCancel: () => void;
}

export const HandleTransactionForm: React.FC<HandleTransactionFormProps> = ({
  submitButtonText,
  transaction,
  onSubmit,
  onCancel,
}) => {
  const [type, setType] = useState<"buy" | "sell">(transaction?.type || "buy");
  const [quantity, setQuantity] = useState(
    transaction?.quantity?.toString() || ""
  );
  const [price, setPrice] = useState(transaction?.price?.toString() || "");
  const [date, setDate] = useState(
    transaction?.date
      ? new Date(transaction.date).toISOString().split("T")[0]
      : ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ret: Transaction = {
      id: transaction?.id ?? "",
      investmentId: transaction?.investmentId ?? "",
      type,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
      date: new Date(date),
    };
    await onSubmit(ret);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="type">Type</Label>
        <Select
          value={type}
          onValueChange={(value: "buy" | "sell") => setType(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select transaction type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="buy">Buy</SelectItem>
            <SelectItem value="sell">Sell</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitButtonText}</Button>
      </div>
    </form>
  );
};
