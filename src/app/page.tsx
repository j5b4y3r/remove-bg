import Image from "next/image";
import BackgroundRemoval from "@/components/remover";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <BackgroundRemoval/>
    </main>
  );
}
