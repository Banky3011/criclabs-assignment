import { Search } from 'lucide-react'

const SearchBar = () => {

    return (
        <div className="-mx-6 w-[calc(100%+3rem)] flex items-center justify-between border-b border-gray-300 px-6">
            <Search className="w-4 h-4 text-gray-400"/>
            <input
                type="text"
                placeholder="Search Filter"
                className="ml-2 w-full px-2 py-1 focus:outline-none text-gray-400"
            />
        </div>
    );
}

export default SearchBar;