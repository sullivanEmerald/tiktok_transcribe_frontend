import { NavigationBar } from "../ui/NavigationIndex"
import Footer from "../genreral/footer"
export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <section>
            <div className="px-8">
                <div className="sticky top-0">
                    <NavigationBar />
                </div>
                <main className="pt-8 sm:pt-15">
                    {children}
                </main>
            </div>
            <footer className="w-full max-w-full mt-4">
                <Footer />
            </footer>
        </section>
    )
}