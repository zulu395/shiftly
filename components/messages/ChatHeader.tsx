"use client";

import { LuEllipsisVertical } from "react-icons/lu";
import Avatar from "../common/Avatar";

type ChatHeaderProps = {
    user: {
        fullname: string;
        email: string;
    };
};

export default function ChatHeader({ user }: ChatHeaderProps) {
    console.log({ user });


    return (
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Avatar size={40}
                        alt={user.fullname}

                    />

                    {/* {user.email === "online" && ( */}
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                    {/* )} */}
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">{user.fullname}</h3>
                    <p className="text-xs text-gray-500 capitalize">{user.email}</p>
                </div>
            </div>

            <div className="flex items-center gap-1">
                {/* <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <LuPhone className="text-xl" />
                </button>
                <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <LuVideo className="text-xl" />
                </button> */}
                <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <LuEllipsisVertical className="text-xl" />
                </button>
            </div>
        </div>
    );
}
