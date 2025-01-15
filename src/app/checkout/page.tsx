import ProductCheckout from "./product-checkout";

const CheckOut = async () => {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Make a Payment</h1>
        <ProductCheckout
          priceId="price_1QgZWfEPP9iiw0AmdWqwzMGn"
          productName="Incrementa tu consulta"
          price={94700}
          currency="usd"
        />
      </div>
    </main>
  );
};

export default CheckOut;
