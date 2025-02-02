"use client";
import Loader from "@/components/Loader/Loader";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Home: React.FC = () => {
  const router = useRouter(); // Используем useRouter для перенаправления

  useEffect(() => {
    const token = localStorage?.getItem("token");
    const role = localStorage?.getItem("role");

    if (token) {
      if (role === "admin") {
        router.push("/dashboard/statistics/car-service");
      } else if (role === "user") {
        router.push("/dashboard/products/categories");
      } else {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router]);
  return <Loader />;
};

export default Home;
