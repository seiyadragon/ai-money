"use client";

import Link from "next/link";

export type DashboardNavigationProps = {
    dashboard: boolean;
    pathname: string;
    children?: React.ReactNode;
};

const DashboardNavigation = (props: DashboardNavigationProps) => {

    return (
        <div className="w-full flex py-4 mb-8">
            {!props.dashboard && (
                <Link href="/dashboard" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    ←
                </Link>
            )}
            <div className={`${!props.dashboard ? "justify-center w-full" : "justify-start"} flex`}>
                {props.children}
            </div>
            {props.dashboard && (
                <div className="flex w-full h-full align-middle justify-end">
                    <Link href="/dashboard/expenses" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Expenses
                    </Link>
                    <Link href="/dashboard/networth" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
                        Net Worth
                    </Link>
                </div>
            )}
        </div>
    )
};

export default DashboardNavigation;