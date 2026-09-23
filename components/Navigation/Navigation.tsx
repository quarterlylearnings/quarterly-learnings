"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Work", href: "/work" },
    { label: "Blog", href: "/blog" },
];

type NavigationProps = {
    currentPath?: string;
    transparent?: boolean;
};

export function Navigation({
    currentPath,
    transparent: transparentProp,
}: NavigationProps) {
    const pathname = usePathname();
    const activePath = currentPath ?? pathname;
    const transparent = transparentProp ?? activePath === "/";

    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const hamburgerRef = useRef<HTMLButtonElement>(null);
    const drawerRef = useRef<HTMLElement>(null);
    const wasOpen = useRef(false);

    useEffect(() => {
        if (!transparent) return;
        const onScroll = () => setScrolled(window.scrollY > 80);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [transparent]);

    // Focus trap when drawer is open
    useEffect(() => {
        if (!isOpen || !drawerRef.current) return;

        const focusableSelectors = [
            "a[href]",
            "button:not([disabled])",
            "[tabindex]:not([tabindex=\"-1\"])",
        ].join(", ");

        const getFocusable = () =>
            Array.from(
                drawerRef.current!.querySelectorAll<HTMLElement>(focusableSelectors)
            );

        getFocusable()[0]?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsOpen(false);
                return;
            }
            if (e.key !== "Tab") return;

            const focusable = getFocusable();
            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    // Return focus to hamburger button when drawer closes
    useEffect(() => {
        if (!isOpen && wasOpen.current) {
            hamburgerRef.current?.focus();
        }
        wasOpen.current = isOpen;
    }, [isOpen]);

    const showSolid = !transparent || scrolled || isOpen;

    return (
        <>
            <header
                className="fixed top-0 left-0 right-0 z-50 transition-colors duration-[var(--duration-base)] ease-[var(--ease-default)]"
                style={{
                    backgroundColor: showSolid
                        ? "var(--color-tertiary)"
                        : "transparent",
                }}
            >
                <div className="mx-auto max-w-7xl px-8 lg:px-20 flex items-center justify-between h-16">
                    {/* Logo + wordmark */}
                    <NextLink
                        href="/"
                        aria-label="Quarterly Learnings home"
                        className="flex items-center gap-3"
                    >
                        <Image
                            src="/quarterly-learnings-logo@3x.png"
                            alt="Quarterly Learnings"
                            width={40}
                            height={40}
                            priority
                        />
                        <span className="md:block font-serif text-white text-[1.1rem] tracking-[-0.01em]">
                            Quarterly Learnings
                        </span>
                    </NextLink>

                    {/* Desktop nav */}
                    <nav
                        aria-label="Main navigation"
                        className="hidden md:flex items-center gap-6"
                    >
                        {navLinks.map(({ label, href }) => (
                            <NextLink
                                key={href}
                                href={href}
                                className="font-sans text-small transition-colors"
                                style={{
                                    color:
                                        activePath === href
                                            ? "var(--color-primary)"
                                            : "rgba(255,255,255,0.6)",
                                }}
                                onMouseOver={(e) => {
                                    if (activePath !== href)
                                        e.currentTarget.style.color =
                                            "rgba(255,255,255,0.9)";
                                }}
                                onMouseOut={(e) => {
                                    if (activePath !== href)
                                        e.currentTarget.style.color =
                                            "rgba(255,255,255,0.6)";
                                }}
                            >
                                {label}
                            </NextLink>
                        ))}
                        <Button
                            variant="primary"
                            size="sm"
                            as="a"
                            href="/contact"
                        >
                            Contact
                        </Button>
                    </nav>

                    {/* Mobile hamburger */}
                    <button
                        ref={hamburgerRef}
                        type="button"
                        className="md:hidden flex h-11 w-11 items-center justify-center rounded-md text-white/80 hover:text-white transition-colors"
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isOpen}
                        aria-controls="mobile-menu"
                        onClick={() => setIsOpen((prev) => !prev)}
                    >
                        {isOpen ? (
                            <X className="h-5 w-5" aria-hidden="true" />
                        ) : (
                            <Menu className="h-5 w-5" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </header>

            {/* Mobile drawer */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40 md:hidden"
                        aria-hidden="true"
                        onClick={() => setIsOpen(false)}
                    />
                    {/* Drawer */}
                    <nav
                        ref={drawerRef}
                        id="mobile-menu"
                        aria-label="Main navigation"
                        className="fixed top-16 left-0 right-0 z-40 md:hidden border-t border-white/10"
                        style={{ backgroundColor: "var(--color-tertiary)" }}
                    >
                        <ul className="flex flex-col px-8 py-4">
                            {navLinks.map(({ label, href }) => (
                                <li key={href}>
                                    <NextLink
                                        href={href}
                                        className="font-sans text-body min-h-[44px] flex items-center transition-colors"
                                        style={{
                                            color:
                                                activePath === href
                                                    ? "var(--color-primary)"
                                                    : "rgba(255,255,255,0.7)",
                                        }}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {label}
                                    </NextLink>
                                </li>
                            ))}
                            <li className="pt-2 pb-2">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    as="a"
                                    href="/contact"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Contact
                                </Button>
                            </li>
                        </ul>
                    </nav>
                </>
            )}
        </>
    );
}
