/* eslint-disable @next/next/no-img-element */
import { ArrowRight, Calendar, Users } from "lucide-react";
import Link from "next/link";

export function LandingHero() {
    return (
        <section className="relative overflow-hidden bg-white pt-32 pb-20 lg:pt-48 lg:pb-32">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
                <div className="absolute top-[10%] left-1/4 h-[500px] w-[500px] rounded-full bg-blue-100/50 blur-[120px]" />
                <div className="absolute top-[20%] right-1/4 h-[400px] w-[400px] rounded-full bg-purple-100/50 blur-[100px]" />
            </div>

            <div className="relative app-container-fluid flex flex-col items-center text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm text-blue-600 mb-8">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    The Future of Workforce Management
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 max-w-4xl">
                    Orchestrate your team with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-blue-800">precision</span>.
                </h1>

                <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl">
                    Shiftly is the all-in-one platform for modern teams to schedule shifts, plan events, communicate instantly, and track performance.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Link
                        href="/register"
                        className="flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 text-base font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95 shadow-blue-200"
                    >
                        Start Free Trial
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                        href="#features"
                        className="flex h-12 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-8 text-base font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300"
                    >
                        See How It Works
                    </Link>
                </div>

                {/* Floating Icons/Elements */}
                <div className="mt-20 relative w-full max-w-5xl mx-auto">
                    <div className="relative rounded-2xl border border-gray-200 bg-white/50 p-3 backdrop-blur-xl shadow-2xl">
                        <img
                            src="/images/landing/dashboard.png"
                            alt="Dashboard Preview"
                            className="w-full h-auto rounded-xl shadow-sm"
                        />

                        {/* Floating Cards */}
                        <div className="absolute -left-12 bottom-20 hidden md:flex items-center gap-3 rounded-xl border border-gray-100 bg-white/90 p-4 backdrop-blur-md shadow-xl animate-bounce duration-[3000ms]">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">Total Staff</div>
                                <div className="text-sm font-bold text-gray-900">124 Active</div>
                            </div>
                        </div>

                        <div className="absolute -right-8 top-20 hidden md:flex items-center gap-3 rounded-xl border border-gray-100 bg-white/90 p-4 backdrop-blur-md shadow-xl animate-bounce duration-[4000ms]">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">Upcoming Events</div>
                                <div className="text-sm font-bold text-gray-900">All Systems Go</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
