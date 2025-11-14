import type { ReactNode } from 'react';

type DrawerProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    onSave?: () => void;
    loading?: boolean;
    showActions?: boolean;
}

const Drawer = (props: DrawerProps) => {

    const { isOpen, onClose, title, children, onSave, loading = false, showActions = true } = props;

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-[50] transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            <div
                className={`fixed top-0 right-0 md:ml-[256px] mt-16 lg:mt-0 md:mt-0 h-full rounded-t-xl w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-[60] ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between h-16 px-6 py-4 border-gray-200 border-b">
                        <h2 className="text-md font-semibold">{title}</h2>
                        {showActions && (
                            <div className="items-center flex space-x-2">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-50 font-semibold"
                                    type="button"
                                >
                                    Cancel
                                </button>
                                {onSave && (
                                    <button
                                        onClick={onSave}
                                        disabled={loading}
                                        className="px-4 py-2 bg-[#009540] text-white font-semibold rounded-md hover:bg-myGreenHover disabled:opacity-50"
                                        type="button"
                                    >
                                        Save
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Children */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Drawer;
