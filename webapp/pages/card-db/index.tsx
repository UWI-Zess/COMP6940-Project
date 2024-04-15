import { useEffect } from 'react';
import type { ReactElement } from 'react';
import BaseLayout from '@/layouts/BaseLayout';
import {useRouter} from "next/router";
import Footer from "@/components/Footer";

function CardDb() {
  const router = useRouter();

  useEffect(() => {
    router.push("/status/coming-soon")
  }, [])

  return (
    <>
      <Footer />
    </>
  );
}

export default CardDb;

CardDb.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
