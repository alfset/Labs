"use client";
import React, { useState, useEffect } from "react";
import { HoveredLink, Menu, MenuItem } from "./ui/navbar-menu";
import { cn } from "@/utils/cn";
import Link from "next/link";

const Navbar = ({ className }: { className?: string }) => {
    const [active, setActive] = useState<string | null>(null);
    const [showNavbar, setShowNavbar] = useState<boolean>(true);
    const [lastScrollTop, setLastScrollTop] = useState<number>(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            if (currentScroll > lastScrollTop) {
                setShowNavbar(false);
            } else {
                setShowNavbar(true);
            }
            setLastScrollTop(currentScroll);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollTop]);

    return (
        <div
            className={cn(
                "fixed top-10 inset-x-0 max-w-2xl mx-auto z-50 transition-transform",
                showNavbar ? "translate-y-0" : "-translate-y-full",
                className,
                "bg-transparent" // Ensure background is transparent
            )}
        >
            <Menu setActive={setActive}>
                <Link href={"/"}>
                    <MenuItem setActive={setActive} active={active} item="Home">
                        {/* Home */}
                    </MenuItem>
                </Link>
                <MenuItem setActive={setActive} active={active} item="Explore">
                    <div className="flex flex-col space-y-4 text-sm">
                        <HoveredLink href="/courses">Apps</HoveredLink>
                        <HoveredLink href="/courses">Staking</HoveredLink>
                        <HoveredLink href="/courses">Pool</HoveredLink>
                        <HoveredLink href="/courses">Lending And Borrowing</HoveredLink>
                        <HoveredLink href="/courses">Oracle Service</HoveredLink>
                    </div>
                </MenuItem>
            </Menu>
        </div>
    );
};

export default Navbar;
