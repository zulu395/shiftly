import Link from "next/link";
import { MoveRight } from "lucide-react";
import AppLogo from "../common/AppLogo";

export function LandingHeader() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-xl">
            <div className="app-container-fluid flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <AppLogo size={30} />
                    <span className="text-lg font-semibold text-gray-900">Shiftly</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                        Features
                    </Link>
                    <Link href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                        Testimonials
                    </Link>
                    <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                        Sign In
                    </Link>
                    <Link
                        href="/register"
                        className="flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
                    >
                        Get Started
                        <MoveRight className="h-4 w-4" />
                    </Link>
                </nav>
            </div>
        </header>
    );
}
