import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import AppLogo from "../common/AppLogo";

export function LandingFooter() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
            <div className="app-container-fluid max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
                    <div className="col-span-2 lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <AppLogo size={40} />
                            <span className="text-xl font-bold text-gray-900">Shiftly</span>
                        </Link>
                        <p className="text-gray-500 max-w-xs mb-6">
                            The futuristic platform for modern workforce management. Schedule, plan, and analyze with ease.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-white hover:text-blue-600 hover:border-blue-200 hover:shadow-sm transition-all">
                                <Twitter className="h-4 w-4" />
                            </a>
                            <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-white hover:text-blue-600 hover:border-blue-200 hover:shadow-sm transition-all">
                                <Linkedin className="h-4 w-4" />
                            </a>
                            <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-white hover:text-blue-600 hover:border-blue-200 hover:shadow-sm transition-all">
                                <Github className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-gray-900 font-bold mb-6">Product</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Features</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Pricing</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Changelog</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Docs</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-gray-900 font-bold mb-6">Company</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors">About</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Careers</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Blog</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-gray-900 font-bold mb-6">Legal</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Privacy</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Terms</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Security</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} Shiftly Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <p className="text-sm text-gray-500">Designed with future in mind.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
