import Link from "next/link";

export function LandingCTA() {
    return (
        <section className="bg-white py-24 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-gray-50 to-transparent" />
            </div>

            <div className="app-container-fluid max-w-5xl mx-auto relative z-10">
                <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-12 md:p-24 text-center shadow-2xl relative overflow-hidden">

                    {/* Glow effect behind text */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-100/50 blur-[100px] rounded-full pointer-events-none" />

                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 relative">
                        Ready to transform your team?
                    </h2>
                    <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto relative">
                        Join thousands of forward-thinking companies using Shiftly to streamline operations and boost productivity.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
                        <Link
                            href="/register"
                            className="flex h-14 items-center justify-center gap-2 rounded-full bg-blue-600 px-10 text-lg font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 hover:scale-105"
                        >
                            Get Started Now
                        </Link>
                        <Link
                            href="/contact"
                            className="flex h-14 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-10 text-lg font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300"
                        >
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
