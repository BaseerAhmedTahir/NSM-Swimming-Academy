import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex bg-background min-h-screen font-sans antialiased overflow-hidden">
            {/* Fixed Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Fixed TopBar inside the flex column */}
                <TopBar />

                {/* Scrollable Content inside main area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto h-full space-y-8 pb-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
