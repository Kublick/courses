import { Button } from "@/components/ui/button";
import { client } from "@/server/client";
import Link from "next/link";
import React from "react";

const EnrollementsPage = async () => {
  const courses = await client.api.courses.$get();
  const resp = await courses.json();

  return (
    <div className="bg-white  p-4">
      {resp.map((r) => (
        <div key={r.id}>
          <p>{r.title}</p>
          <Link href={`/${r.slug}`}>
            <Button>Ir al Curso</Button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default EnrollementsPage;
