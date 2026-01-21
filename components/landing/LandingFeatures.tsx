/* eslint-disable @next/next/no-img-element */
import { BarChart, CalendarDays, Check, MessageSquare } from "lucide-react";

const features = [
    {
        title: "Smart Staff Scheduling",
        description: "Drag-and-drop shifts, handle availability conflicts automatically, and publish schedules in seconds. Keep your team in sync without the chaos.",
        icon: <CalendarDays className="h-6 w-6 text-blue-600" />,
        image: "/images/landing/scheduling.png",
        alignment: "left",
        bullets: [
            "AI-Powered Conflict Detection: Automatically flags availability clashes before you publish.",
            "One-Click Drag & Drop: Shift management so smooth it feels like magic.",
            "Instant Mobile Notifications: Your team knows their schedule the moment you do.",
        ]
    },
    {
        title: "Event Planning Mastery",
        description: "Organize company events, track RSVPs, and manage resources all in one place. From team building to major conferences, Shiftly has you covered.",
        icon: <Check className="h-6 w-6 text-purple-600" />,
        image: "/images/landing/event-planning.png",
        alignment: "right",
        bullets: [
            "Seamless RSVP Tracking: Watch the guest list grow in real-time.",
            "Resource Allocation: Assign venues, equipment, and staff with zero friction.",
            "Timeline View: Visualize your entire event roadmap at a glance.",
        ]
    },
    {
        title: "Real-time Messaging",
        description: "Keep conversations strictly professional with built-in team chat. Create channels for departments, shifts, or events and cut down on email clutter.",
        icon: <MessageSquare className="h-6 w-6 text-pink-600" />,
        image: "/images/landing/messaging.png",
        alignment: "left",
        bullets: [
            "Department Channels: Dedicated spaces for Kitchen, Front of House, and more.",
            "Direct Messaging: Private, secure communication for sensitive matters.",
            "File Sharing: Drop documents, schedules, and policies right in the chat.",
        ]
    },
    {
        title: "Deep Analytics & Insights",
        description: "Track attendance, labor costs, and productivity trends. Make data-driven decisions to optimize your workforce efficiency.",
        icon: <BarChart className="h-6 w-6 text-cyan-600" />,
        image: "/images/landing/analytics.png",
        alignment: "right",
        bullets: [
            "Labor Cost Forecasting: Predict expenses before they hit your P&L.",
            "Attendance Heatmaps: Spot trends in lateness and absenteeism instantly.",
            "Productivity Reports: Identify your top performers and optimize shifts.",
        ]
    },
];

export function LandingFeatures() {
    return (
        <section id="features" className="bg-white py-24 relative overflow-hidden">
            <div className="app-container-fluid max-w-7xl mx-auto">
                <div className="text-center mb-24">
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 mb-6">
                        Everything you need to run your team.
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                        Powerful tools integrated into a single platform. Stop switching between apps and start getting work done.
                    </p>
                </div>

                <div className="space-y-32">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${feature.alignment === "right" ? "lg:flex-row-reverse" : ""
                                }`}
                        >
                            {/* Text Content */}
                            <div className="flex-1 space-y-8">
                                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 shadow-sm">
                                    {feature.icon}
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900">{feature.title}</h3>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    {feature.description}
                                </p>
                                <ul className="space-y-4">
                                    {feature.bullets.map((bullet, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-700">
                                            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                                            <span>{bullet}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Image Visual */}
                            <div className="flex-1 relative group perspective-1000">
                                <div className="absolute -inset-4 bg-gradient-to-r from-blue-200/50 to-purple-200/50 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <div className="relative rounded-2xl border border-gray-200 bg-white p-2 shadow-xl transform transition-transform duration-500 group-hover:rotate-y-2 group-hover:scale-[1.02]">
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="w-full h-auto rounded-xl shadow-inner border border-gray-100"
                                    />

                                    {/* Decorative glass overlay - lighter for light mode */}
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
