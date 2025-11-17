import { Search } from 'lucide-react'

type SearchBarProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const SearchBar = (props: SearchBarProps) => {

    const { value, onChange, placeholder = "Search Filter" } = props;

    return (
        <div className="-mx-6 w-[calc(100%+3rem)] h-12 flex items-center justify-between border-b border-gray-300 px-6">
            <Search className="w-4 h-4 text-gray-400"/>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="ml-2 w-full px-2 py-1 focus:outline-none text-gray-400"
            />
        </div>
    );
}

export default SearchBar;