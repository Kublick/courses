import React from "react";

interface Props {
  params: Promise<{ id: string }>;
}

const CustomerRegistration = async ({ params }: Props) => {
  const { id } = await params;

  return (
    <div>
      <p>Welcome</p>
    </div>
  );
};

export default CustomerRegistration;
