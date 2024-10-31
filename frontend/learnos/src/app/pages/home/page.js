"use client";
import Navbar from '@/app/components/Navbar';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    const handleNavigate = () => {
        router.push('./planning');
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <Navbar />
            <header className="text-center mb-12">
                <h1 className="text-5xl font-bold text-gray-900">Welcome to LearnOS</h1>
                <p className="mt-4 text-lg text-gray-600">Beat Procrastination And Stay On Track!</p>
            </header>
    
            <main className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 text-center border border-gray-200 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-800">Track your progress</h2>
                    <p className="mt-4 text-gray-600">
                        Use LearnOS to manage and track your learning journey with powerful tools.
                    </p>
                </div>
                <div className="p-6 text-center border border-gray-200 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-800">Stay organized</h2>
                    <p className="mt-4 text-gray-600">
                        Organize your study materials, tasks, and deadlines in one place.
                    </p>
                </div>
            </div>
            </main>

            <button onClick={handleNavigate} className="bg-blue-500 text-white px-4 py-2 mt-5 rounded">
                Go to Planning Page
            </button>

            <footer className="mt-12 text-center">
                <p className="text-gray-500">&copy; 2024 LearnOS. All rights reserved.</p>
            </footer>
        </div>
    );
}