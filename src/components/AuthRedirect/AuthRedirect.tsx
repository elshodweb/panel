// src/components/AuthRedirect.tsx
"use client"; // Директива для клиентской части
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Для навигации
import Loader from "@/components/Loader/Loader"; // Импортируем Loader

const AuthRedirect: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Состояние загрузки

  useEffect(() => {
    const token = localStorage?.getItem("token");

    if (!token) {
      router.push("/login");
    }

    setLoading(false); // Устанавливаем загрузку в false после проверки
  }, [router]);

  if (loading) {
    return <Loader />; // Показываем loader, пока проверяем токен
  }

  return null; // Этот компонент ничего не рендерит
};

export default AuthRedirect;
