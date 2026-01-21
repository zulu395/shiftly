import { LuSearch } from "react-icons/lu";

type Props = {
    search: string;
    setSearch: (value: string) => void;
};

export default function ConversationSearch({ search, setSearch }: Props) {
    return (
        <div className="p-3 border-b border-gray-100 bg-gray-50/30">
            <div className="relative">
                <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search conversations..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                />
            </div>
        </div>
    );
}
