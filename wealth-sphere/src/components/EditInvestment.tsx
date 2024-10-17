import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"

export function EditInvestment() {
  const { symbol } = useParams<{ symbol: string }>();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Investment: {symbol}</h1>
      <Link to={`/investment/${symbol}`}>
        <Button variant="outline">Back to Investment Details</Button>
      </Link>
    </div>
  );
}
