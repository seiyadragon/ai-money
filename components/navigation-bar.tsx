import Link from "next/link"
import Image from "next/image"
import { ThemeSwitcher } from "./theme-switcher"
import HeaderAuth from "./header-auth"

const NavigationBar = () => {
    return (
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                <div className="flex md:gap-5 lg:gap-5 items-center font-semibold">
                    <Link href="/">
                        <Image src="/images/favicon.ico" alt="logo" width={40} height={40} priority />
                    </Link>
                </div>
                <div className="flex gap-2">
                    <ThemeSwitcher />
                    <HeaderAuth />
                </div>
            </div>
        </nav>
    )
}

export default NavigationBar