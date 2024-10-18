export class CreateTransactionDto {
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  date: Date;
}
